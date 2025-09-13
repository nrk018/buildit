import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { selectedProblems, problemDetails } = await request.json()
    
    if (!selectedProblems || selectedProblems.length === 0) {
      return NextResponse.json(
        { error: 'No problems selected for solution generation' },
        { status: 400 }
      )
    }

    // Check if we have the API key for AI-powered solution generation
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.warn('Google Gemini API key not found, using fallback solution generation')
      return await generateFallbackSolutions(selectedProblems, problemDetails)
    }

    try {
      // Initialize the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      // Create a comprehensive prompt for solution generation
      const prompt = `
        Generate specific, actionable solutions for the following industrial problems. Each solution should be tailored to address the specific problem characteristics.

        PROBLEMS TO ADDRESS:
        ${problemDetails.map((problem: any, index: number) => `
        ${index + 1}. ${problem.title}
           - Category: ${problem.category}
           - Severity: ${problem.severity}
           - Description: ${problem.description}
           - Impact: ${problem.impact || 'Not specified'}
           - Urgency: ${problem.urgency || 'Not specified'}
           - Estimated Cost: ${problem.estimatedCost || 'Not specified'}
           - Timeline: ${problem.timeline || 'Not specified'}
        `).join('')}
        
        Please generate 3-5 specific solutions that:
        1. Directly address the identified problems
        2. Are practical and implementable
        3. Include realistic cost estimates and timelines
        4. Consider the severity and urgency of each problem
        5. Provide measurable effectiveness ratings
        6. Include both technical and non-technical approaches
        7. Are tailored to the specific problem categories and industries
        
        Return the response as a JSON object with the following structure:
        {
          "solutions": [
            {
              "id": "unique_id",
              "title": "Specific solution title",
              "description": "Detailed solution description tailored to the problems",
              "type": "technical|non-technical",
              "complexity": "simple|moderate|complex",
              "estimatedCost": "Realistic cost range based on problem severity",
              "timeToImplement": "Realistic timeline based on problem urgency",
              "effectiveness": 85,
              "problemsAddressed": ["problem_id_1", "problem_id_2"],
              "roi": "Realistic ROI timeline",
              "riskLevel": "low|medium|high",
              "implementationSteps": ["Step 1", "Step 2", "Step 3"],
              "successMetrics": ["Metric 1", "Metric 2"],
              "prerequisites": ["Prerequisite 1", "Prerequisite 2"]
            }
          ]
        }
        
        Make the solutions feel specific to these exact problems, not generic industrial solutions.
      `

      // Generate content using Gemini
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Parse the JSON response
      let solutionResult
      try {
        // Extract JSON from the response (in case there's extra text)
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          solutionResult = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('No JSON found in response')
        }
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError)
        console.log('Raw response:', text)
        return await generateFallbackSolutions(selectedProblems, problemDetails)
      }

      // Validate and structure the response
      const solutions = solutionResult.solutions || []
      const structuredSolutions = solutions.map((solution: any, index: number) => ({
        id: solution.id || `solution_${index + 1}`,
        title: solution.title || 'Unidentified Solution',
        description: solution.description || 'No description available',
        type: solution.type || 'technical',
        complexity: solution.complexity || 'moderate',
        estimatedCost: solution.estimatedCost || 'Unknown',
        timeToImplement: solution.timeToImplement || 'Unknown',
        effectiveness: solution.effectiveness || 80,
        problemsAddressed: solution.problemsAddressed || [],
        roi: solution.roi || '12-18 months',
        riskLevel: solution.riskLevel || 'medium',
        implementationSteps: solution.implementationSteps || [],
        successMetrics: solution.successMetrics || [],
        prerequisites: solution.prerequisites || []
      }))

      return NextResponse.json({
        success: true,
        solutions: structuredSolutions,
        totalSolutions: structuredSolutions.length,
        generationTime: 2.8,
        aiModel: 'Google Gemini 1.5 Flash',
        recommendations: {
          bestROI: structuredSolutions.reduce((best, current) => 
            current.effectiveness > best.effectiveness ? current : best
          ),
          quickestWin: structuredSolutions.reduce((quickest, current) => 
            current.complexity === 'simple' && current.effectiveness > quickest.effectiveness ? current : quickest
          ),
          mostComprehensive: structuredSolutions.find(s => s.problemsAddressed.length > 1) || structuredSolutions[0]
        }
      })

    } catch (geminiError) {
      console.error('Gemini API error:', geminiError)
      return await generateFallbackSolutions(selectedProblems, problemDetails)
    }

  } catch (error) {
    console.error('Error generating solutions:', error)
    return NextResponse.json(
      { error: 'Failed to generate solutions' },
      { status: 500 }
    )
  }
}

// Fallback solution generation when Gemini API is not available
async function generateFallbackSolutions(selectedProblems: string[], problemDetails: any[]) {
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Create more dynamic solutions based on the actual problems
  const problemCategories = [...new Set(problemDetails.map(p => p.category))]
  const severityLevels = [...new Set(problemDetails.map(p => p.severity))]
  
  // Generate solutions based on the specific problems
  const dynamicSolutions = problemDetails.map((problem, index) => {
    const baseCost = problem.severity === 'critical' ? 50000 : 
                    problem.severity === 'high' ? 25000 : 
                    problem.severity === 'medium' ? 15000 : 5000
    
    const timeline = problem.urgency === 'immediate' ? '1-2 weeks' :
                    problem.urgency === 'within_week' ? '2-4 weeks' :
                    problem.urgency === 'within_month' ? '1-2 months' : '2-3 months'
    
    return {
      id: `solution_${index + 1}`,
      title: `Targeted Solution for ${problem.title}`,
      description: `Comprehensive solution specifically designed to address ${problem.title}. This ${problem.category.toLowerCase()} solution includes immediate remediation and long-term prevention strategies tailored to your specific environment.`,
      type: problem.category === 'Safety' || problem.category === 'Maintenance' ? 'technical' : 'non-technical',
      complexity: problem.severity === 'critical' ? 'complex' : 
                 problem.severity === 'high' ? 'moderate' : 'simple',
      estimatedCost: `$${baseCost.toLocaleString()} - $${(baseCost * 1.5).toLocaleString()}`,
      timeToImplement: timeline,
      effectiveness: problem.severity === 'critical' ? 95 : 
                    problem.severity === 'high' ? 88 : 
                    problem.severity === 'medium' ? 75 : 65,
      problemsAddressed: [problem.id],
      roi: problem.severity === 'critical' ? '6-12 months' : 
           problem.severity === 'high' ? '8-15 months' : '12-18 months',
      riskLevel: problem.severity === 'critical' ? 'low' : 
                problem.severity === 'high' ? 'medium' : 'medium',
      implementationSteps: [
        `Immediate assessment of ${problem.title}`,
        `Development of ${problem.category.toLowerCase()} remediation plan`,
        `Implementation of core solution components`,
        `Training and change management`,
        `Monitoring and optimization`
      ],
      successMetrics: [
        `${problem.severity === 'critical' ? '100%' : '90%'} reduction in ${problem.category.toLowerCase()} incidents`,
        `Improved operational efficiency by 25-40%`,
        `Enhanced compliance and safety scores`,
        `Reduced long-term operational costs`
      ],
      prerequisites: [
        'Management commitment and budget approval',
        'Cross-functional team assembly',
        'Baseline assessment completion',
        'Stakeholder alignment and communication'
      ]
    }
  })
  
  // Add a comprehensive solution if multiple problems are selected
  if (selectedProblems.length > 1) {
    const totalCost = dynamicSolutions.reduce((sum, sol) => {
      const cost = sol.estimatedCost.match(/\$([0-9,]+)/)?.[1]?.replace(/,/g, '') || '0'
      return sum + parseInt(cost)
    }, 0)
    
    dynamicSolutions.push({
      id: 'comprehensive_solution',
      title: 'Integrated Multi-Problem Resolution Platform',
      description: `Comprehensive platform that addresses all ${selectedProblems.length} identified problems through an integrated approach. This solution combines multiple technologies and processes to create a unified problem-solving ecosystem.`,
      type: 'technical',
      complexity: 'complex',
      estimatedCost: `$${(totalCost * 0.7).toLocaleString()} - $${(totalCost * 0.9).toLocaleString()}`,
      timeToImplement: '3-6 months',
      effectiveness: 96,
      problemsAddressed: selectedProblems,
      roi: '12-18 months',
      riskLevel: 'medium',
      implementationSteps: [
        'Comprehensive system design and architecture',
        'Phased implementation across all problem areas',
        'Integration with existing systems and processes',
        'Comprehensive training and change management',
        'Continuous monitoring and optimization'
      ],
      successMetrics: [
        '95%+ reduction in all identified problem categories',
        '40-60% improvement in overall operational efficiency',
        'Significant reduction in compliance and safety risks',
        'Measurable ROI within 12-18 months'
      ],
      prerequisites: [
        'Executive sponsorship and full budget commitment',
        'Cross-functional project team with dedicated resources',
        'Comprehensive change management strategy',
        'Integration planning with existing systems'
      ]
    })
  }

  return NextResponse.json({
    success: true,
    solutions: dynamicSolutions,
    totalSolutions: dynamicSolutions.length,
    generationTime: 1.5,
    aiModel: 'Fallback Solution Generation (Gemini API not available)',
    recommendations: {
      bestROI: dynamicSolutions.reduce((best, current) => 
        current.effectiveness > best.effectiveness ? current : best
      ),
      quickestWin: dynamicSolutions.reduce((quickest, current) => 
        current.complexity === 'simple' && current.effectiveness > quickest.effectiveness ? current : quickest
      ),
      mostComprehensive: dynamicSolutions.find(s => s.id === 'comprehensive_solution') || dynamicSolutions[0]
    }
  })
}

