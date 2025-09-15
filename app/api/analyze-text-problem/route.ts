import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { problemText, imageData, analysisMode } = await request.json()
    
    if (!problemText) {
      return NextResponse.json(
        { error: 'Problem text is required' },
        { status: 400 }
      )
    }

    // Check if we have the API key
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.warn('Google Gemini API key not found, using fallback analysis')
      return await fallbackTextAnalysis(problemText, imageData, analysisMode)
    }

    try {
      // Initialize the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      // Create the prompt for detailed problem analysis
      const prompt = analysisMode === 'image' 
        ? `
          Analyze this image and the accompanying description to identify problems and provide comprehensive solutions.
          
          User Description: "${problemText}"
          
          Please analyze the image and description together to:
          1. Identify visual problems in the image
          2. Consider the user's specific concerns mentioned in the description
          3. Provide a comprehensive analysis combining visual and contextual information
          4. Generate practical solutions that address both visible and described issues
          
          Focus on:
          - Safety hazards visible in the image
          - Maintenance issues
          - Operational inefficiencies
          - Environmental concerns
          - Workflow problems
          - Equipment issues
          - Space utilization problems
          - Compliance issues
          - Any specific concerns mentioned in the user's description
          
          IMPORTANT: All cost estimates must be in Indian Rupees (₹) format, not dollars ($). Use realistic Indian market pricing.
          
          Return the response as a JSON object with the following structure:
          {
            "problemDescription": "Clear description combining image analysis and user description",
            "problems": [
              {
                "id": "unique_id",
                "title": "Problem title",
                "description": "Detailed problem description",
                "severity": "critical|high|medium|low",
                "category": "Safety|Maintenance|Operations|Compliance|Environmental|Other",
                "confidence": 0.95,
                "location": {"x": 0, "y": 0},
                "solutions": [
                  {
                    "title": "Solution title",
                    "description": "Detailed solution description",
                    "cost": "₹41,500-₹83,000",
                    "timeline": "1-2 weeks",
                    "priority": "high|medium|low"
                  }
                ],
                "impact": "Description of potential impact if not addressed",
                "urgency": "immediate|within_week|within_month|low_priority"
              }
            ],
            "overallAssessment": "Overall assessment combining image analysis and user concerns",
            "recommendations": "General recommendations for problem resolution"
          }
          
          Be thorough and specific in your analysis. Consider both what you see in the image and what the user has described.
        `
        : `
          Analyze this problem description and provide comprehensive solutions and recommendations.
          
          Problem Description: "${problemText}"
          
          Please provide:
          1. A clear problem statement
          2. Root cause analysis
          3. Impact assessment
          4. Multiple solution options with costs and timelines
          5. Implementation recommendations
          6. Risk assessment
          7. Success metrics
          
          IMPORTANT: All cost estimates must be in Indian Rupees (₹) format, not dollars ($). Use realistic Indian market pricing.
          
          Focus on:
          - Practical, actionable solutions
          - Cost-benefit analysis
          - Implementation feasibility
          - Timeline considerations
          - Resource requirements
          - Risk mitigation strategies
          
          Return the response as a JSON object with the following structure:
          {
            "problemDescription": "Clear description of the problem",
            "problems": [
              {
                "id": "unique_id",
                "title": "Problem title",
                "description": "Detailed problem description",
                "severity": "critical|high|medium|low",
                "category": "Technical|Business|Operational|Financial|Other",
                "confidence": 0.95,
                "location": {"x": 0, "y": 0},
                "solutions": [
                  {
                    "title": "Solution title",
                    "description": "Detailed solution description",
                    "cost": "₹41,500-₹83,000",
                    "timeline": "1-2 weeks",
                    "priority": "high|medium|low"
                  }
                ],
                "impact": "Description of potential impact if not addressed",
                "urgency": "immediate|within_week|within_month|low_priority"
              }
            ],
            "overallAssessment": "Overall assessment of the problem and recommended approach",
            "recommendations": "General recommendations for problem resolution"
          }
          
          Be thorough and specific in your analysis. Provide practical, implementable solutions.
        `

      // Generate content using Gemini
      let result
      if (analysisMode === 'image' && imageData) {
        // Convert base64 image data to the format expected by Gemini
        const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, '')
        
        result = await model.generateContent([
          prompt,
          {
            inlineData: {
              data: base64Data,
              mimeType: "image/jpeg"
            }
          }
        ])
      } else {
        result = await model.generateContent(prompt)
      }
      
      const response = await result.response
      const text = response.text()
      
      // Parse the JSON response
      let analysisResult
      try {
        // Extract JSON from the response (in case there's extra text)
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          analysisResult = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('No JSON found in response')
        }
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError)
        console.log('Raw response:', text)
        return await fallbackTextAnalysis(problemText)
      }

      // Validate and structure the response
      const problems = analysisResult.problems || []
      const structuredProblems = problems.map((problem: any, index: number) => ({
        id: problem.id || `problem_${index + 1}`,
        title: problem.title || 'Unidentified Problem',
        description: problem.description || 'No description available',
        severity: problem.severity || 'medium',
        category: problem.category || 'Other',
        confidence: problem.confidence || 0.8,
        location: problem.location || { x: 0, y: 0 },
        solutions: problem.solutions || [],
        impact: problem.impact || 'Unknown impact',
        urgency: problem.urgency || 'medium',
        estimatedCost: problem.solutions?.[0]?.cost || 'Unknown',
        timeline: problem.solutions?.[0]?.timeline || 'Unknown'
      }))

      return NextResponse.json({
        success: true,
        problems: structuredProblems,
        problemDescription: analysisResult.problemDescription || problemText,
        overallAssessment: analysisResult.overallAssessment || 'Analysis completed',
        recommendations: analysisResult.recommendations || 'No specific recommendations',
        analysisTime: 3.5,
        problemProcessed: true,
        aiModel: 'Google Gemini 1.5 Flash'
      })

    } catch (geminiError) {
      console.error('Gemini API error:', geminiError)
      return await fallbackTextAnalysis(problemText)
    }

  } catch (error) {
    console.error('Error analyzing text problem:', error)
    return NextResponse.json(
      { error: 'Failed to analyze text problem' },
      { status: 500 }
    )
  }
}

// Fallback analysis when Gemini API is not available
async function fallbackTextAnalysis(problemText: string, imageData?: string, analysisMode?: string) {
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  const isImageAnalysis = analysisMode === 'image' && imageData
  
  const mockProblems = [
    {
      id: '1',
      title: isImageAnalysis ? 'Image & Text Analysis' : 'Problem Analysis from Text',
      description: isImageAnalysis 
        ? `Based on your image and description: "${problemText}", we've identified the core issues and potential solutions.`
        : `Based on your description: "${problemText}", we've identified the core issues and potential solutions.`,
      severity: 'medium',
      category: 'Analysis',
      confidence: 0.85,
      location: { x: 0, y: 0 },
      solutions: [
        {
          title: 'Immediate Action Plan',
          description: 'Develop a structured approach to address the identified problem with clear milestones and deliverables.',
          cost: '$500-$2000',
          timeline: '1-2 weeks',
          priority: 'high'
        },
        {
          title: 'Long-term Strategic Solution',
          description: 'Implement a comprehensive solution that addresses root causes and prevents recurrence.',
          cost: '$2000-$10000',
          timeline: '1-3 months',
          priority: 'medium'
        },
        {
          title: 'Quick Wins Implementation',
          description: 'Identify and implement low-cost, high-impact solutions that can be executed immediately.',
          cost: '$100-$500',
          timeline: '3-7 days',
          priority: 'high'
        }
      ],
      impact: 'Addressing this problem will improve efficiency, reduce costs, and enhance overall performance',
      urgency: 'within_month',
      estimatedCost: '$500-$2000',
      timeline: '1-2 weeks'
    },
    {
      id: '2',
      title: 'Process Optimization',
      description: 'Current processes may be inefficient and could benefit from optimization and automation.',
      severity: 'medium',
      category: 'Operational',
      confidence: 0.75,
      location: { x: 0, y: 0 },
      solutions: [
        {
          title: 'Process Mapping and Analysis',
          description: 'Document current processes and identify bottlenecks and inefficiencies.',
          cost: '$1000-$3000',
          timeline: '2-4 weeks',
          priority: 'medium'
        },
        {
          title: 'Automation Implementation',
          description: 'Implement automated solutions to reduce manual work and improve accuracy.',
          cost: '$3000-$8000',
          timeline: '1-2 months',
          priority: 'medium'
        }
      ],
      impact: 'Improved efficiency and reduced operational costs',
      urgency: 'within_month',
      estimatedCost: '$1000-$3000',
      timeline: '2-4 weeks'
    }
  ]

  return NextResponse.json({
    success: true,
    problems: mockProblems,
    problemDescription: isImageAnalysis ? `Image Analysis: ${problemText}` : problemText,
    overallAssessment: isImageAnalysis 
      ? 'Image and text analysis completed with recommended solutions and implementation strategies'
      : 'Text-based problem analysis completed with recommended solutions and implementation strategies',
    recommendations: 'Focus on immediate actions first, then implement long-term strategic solutions. Consider process optimization and automation for sustainable improvements.',
    analysisTime: 2.1,
    problemProcessed: true,
    aiModel: 'Fallback Text Analysis (Gemini API not available)'
  })
}

