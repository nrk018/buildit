import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { 
      problemStatement,
      businessModel,
      solutions,
      targetMarket,
      industry
    } = await request.json()
    
    if (!problemStatement) {
      return NextResponse.json(
        { error: 'Problem statement is required' },
        { status: 400 }
      )
    }

    // Check if we have the API key
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.warn('Google Gemini API key not found, using fallback analysis')
      return await fallbackStartupRequirements(problemStatement, businessModel, solutions, targetMarket, industry)
    }

    try {
      // Initialize the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      // Create a comprehensive prompt for startup requirements analysis
      const prompt = `
        Analyze the following startup idea and generate comprehensive team requirements:

        PROBLEM STATEMENT:
        ${problemStatement}

        BUSINESS MODEL:
        ${businessModel ? JSON.stringify(businessModel, null, 2) : 'Not provided'}

        SOLUTIONS:
        ${solutions ? solutions.map((sol: any, index: number) => `${index + 1}. ${sol.title}: ${sol.description}`).join('\n') : 'Not provided'}

        TARGET MARKET:
        ${targetMarket || 'Not specified'}

        INDUSTRY:
        ${industry || 'Not specified'}

        Based on this information, generate a comprehensive analysis that includes:

        1. REQUIRED POSITIONS:
           - Core team positions needed for the first 6-12 months
           - Technical roles required
           - Business/operational roles needed
           - Priority level for each position (Critical, High, Medium, Low)
           - Skills and experience required for each position
           - Timeline for hiring each position

        2. TEAM STRUCTURE:
           - Recommended team size for MVP phase
           - Recommended team size for growth phase
           - Key roles that can be combined initially
           - Roles that can be outsourced vs. in-house

        3. SKILLS ANALYSIS:
           - Technical skills required
           - Business skills required
           - Soft skills needed
           - Industry-specific expertise needed

        4. HIRING STRATEGY:
           - Immediate hiring priorities (next 3 months)
           - Medium-term hiring goals (3-6 months)
           - Long-term team expansion (6-12 months)
           - Budget considerations for each phase

        Return the response as a JSON object with the following structure:
        {
          "requiredPositions": [
            {
              "title": "Position Title",
              "category": "Technical/Business/Operations",
              "priority": "Critical/High/Medium/Low",
              "skills": ["Skill 1", "Skill 2", "Skill 3"],
              "experience": "Required experience level",
              "timeline": "When to hire",
              "description": "Detailed role description",
              "equity": "Suggested equity range",
              "salary": "Salary range in INR"
            }
          ],
          "teamStructure": {
            "mvpTeam": {
              "size": "Recommended team size",
              "roles": ["Role 1", "Role 2", "Role 3"],
              "description": "Team structure for MVP phase"
            },
            "growthTeam": {
              "size": "Recommended team size",
              "roles": ["Role 1", "Role 2", "Role 3"],
              "description": "Team structure for growth phase"
            }
          },
          "skillsAnalysis": {
            "technical": ["Technical skill 1", "Technical skill 2"],
            "business": ["Business skill 1", "Business skill 2"],
            "soft": ["Soft skill 1", "Soft skill 2"],
            "industry": ["Industry skill 1", "Industry skill 2"]
          },
          "hiringStrategy": {
            "immediate": ["Priority 1", "Priority 2"],
            "mediumTerm": ["Goal 1", "Goal 2"],
            "longTerm": ["Expansion 1", "Expansion 2"],
            "budget": "Budget considerations"
          }
        }

        Make this analysis specific to the exact problem and business model provided, not generic startup advice.
        Focus on practical, actionable team building strategies for Indian startup environment.
      `

      // Generate content using Gemini
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Parse the JSON response
      let startupRequirements
      try {
        // Extract JSON from the response (in case there's extra text)
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          startupRequirements = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('No JSON found in response')
        }
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError)
        console.log('Raw response:', text)
        return await fallbackStartupRequirements(problemStatement, businessModel, solutions, targetMarket, industry)
      }

      return NextResponse.json({
        success: true,
        startupRequirements,
        analysisTime: 2.8,
        aiModel: 'Google Gemini 1.5 Flash',
        problemAnalyzed: {
          problemStatement: problemStatement.substring(0, 100) + '...',
          hasBusinessModel: !!businessModel,
          solutionsCount: solutions ? solutions.length : 0
        }
      })

    } catch (geminiError) {
      console.error('Gemini API error:', geminiError)
      return await fallbackStartupRequirements(problemStatement, businessModel, solutions, targetMarket, industry)
    }

  } catch (error) {
    console.error('Error analyzing startup requirements:', error)
    return NextResponse.json(
      { error: 'Failed to analyze startup requirements' },
      { status: 500 }
    )
  }
}

// Fallback analysis when Gemini API is not available
async function fallbackStartupRequirements(problemStatement: string, businessModel: any, solutions: any[], targetMarket: string, industry: string) {
  // Extract keywords from problem statement for basic analysis
  const keywords = problemStatement.toLowerCase().split(' ').filter(word => 
    word.length > 3 && !['the', 'and', 'for', 'with', 'this', 'that', 'from', 'they', 'have', 'been', 'will', 'would', 'could', 'should'].includes(word)
  )

  // Determine if it's a tech startup
  const isTechStartup = keywords.some(keyword => 
    ['ai', 'machine', 'learning', 'software', 'app', 'platform', 'system', 'digital', 'tech', 'computer', 'data', 'algorithm'].includes(keyword)
  )

  // Determine if it's a hardware startup
  const isHardwareStartup = keywords.some(keyword => 
    ['hardware', 'device', 'sensor', 'iot', 'embedded', 'electronics', 'manufacturing', 'equipment'].includes(keyword)
  )

  // Determine if it's a service startup
  const isServiceStartup = keywords.some(keyword => 
    ['service', 'consulting', 'support', 'management', 'operations', 'maintenance', 'quality', 'control'].includes(keyword)
  )

  // Generate basic required positions based on analysis
  const requiredPositions = []

  // Core positions for any startup
  requiredPositions.push({
    title: "CEO/Founder",
    category: "Business",
    priority: "Critical",
    skills: ["Leadership", "Strategic Planning", "Business Development", "Fundraising"],
    experience: "2+ years in relevant industry or strong domain expertise",
    timeline: "Immediate",
    description: "Overall leadership, strategy, and business development",
    equity: "40-60%",
    salary: "₹0-50,000/month (equity-focused)"
  })

  // Technical positions based on startup type
  if (isTechStartup) {
    requiredPositions.push({
      title: "CTO/Technical Co-founder",
      category: "Technical",
      priority: "Critical",
      skills: ["Software Development", "System Architecture", "Technology Strategy", "Team Leadership"],
      experience: "3+ years in software development",
      timeline: "Immediate",
      description: "Technical leadership, product development, and engineering team management",
      equity: "20-30%",
      salary: "₹0-80,000/month (equity-focused)"
    })

    requiredPositions.push({
      title: "Full Stack Developer",
      category: "Technical",
      priority: "High",
      skills: ["Frontend Development", "Backend Development", "Database Design", "API Development"],
      experience: "2+ years in full stack development",
      timeline: "Month 1-2",
      description: "Develop and maintain the core product",
      equity: "2-5%",
      salary: "₹40,000-80,000/month"
    })
  }

  if (isHardwareStartup) {
    requiredPositions.push({
      title: "Hardware Engineer",
      category: "Technical",
      priority: "Critical",
      skills: ["Hardware Design", "Embedded Systems", "IoT", "Prototyping"],
      experience: "2+ years in hardware development",
      timeline: "Immediate",
      description: "Design and develop hardware components",
      equity: "15-25%",
      salary: "₹50,000-90,000/month"
    })
  }

  // Business positions
  requiredPositions.push({
    title: "Business Development Manager",
    category: "Business",
    priority: "High",
    skills: ["Sales", "Partnership Development", "Market Research", "Customer Relations"],
    experience: "2+ years in business development",
    timeline: "Month 2-3",
    description: "Develop partnerships, sales strategy, and customer acquisition",
    equity: "3-8%",
    salary: "₹35,000-70,000/month"
  })

  // Marketing position
  requiredPositions.push({
    title: "Marketing Specialist",
    category: "Business",
    priority: "Medium",
    skills: ["Digital Marketing", "Content Creation", "Social Media", "Brand Management"],
    experience: "1+ years in marketing",
    timeline: "Month 3-4",
    description: "Develop and execute marketing strategies",
    equity: "1-3%",
    salary: "₹25,000-50,000/month"
  })

  // Operations position for service startups
  if (isServiceStartup) {
    requiredPositions.push({
      title: "Operations Manager",
      category: "Operations",
      priority: "High",
      skills: ["Process Management", "Quality Control", "Team Coordination", "Project Management"],
      experience: "2+ years in operations",
      timeline: "Month 1-2",
      description: "Manage day-to-day operations and service delivery",
      equity: "5-10%",
      salary: "₹40,000-70,000/month"
    })
  }

  return NextResponse.json({
    success: true,
    startupRequirements: {
      requiredPositions,
      teamStructure: {
        mvpTeam: {
          size: "3-5 people",
          roles: ["CEO/Founder", "CTO/Technical Lead", "Business Development", "Core Developer"],
          description: "Minimal viable team to build and launch MVP"
        },
        growthTeam: {
          size: "8-12 people",
          roles: ["CEO", "CTO", "2-3 Developers", "Business Development", "Marketing", "Operations", "Sales"],
          description: "Expanded team for growth and scaling"
        }
      },
      skillsAnalysis: {
        technical: isTechStartup ? ["Software Development", "System Architecture", "Database Design"] : 
                  isHardwareStartup ? ["Hardware Design", "Embedded Systems", "IoT"] : 
                  ["Process Management", "Quality Control", "Operations"],
        business: ["Strategic Planning", "Business Development", "Sales", "Marketing"],
        soft: ["Leadership", "Communication", "Problem Solving", "Team Management"],
        industry: ["Domain Expertise", "Market Knowledge", "Customer Understanding"]
      },
      hiringStrategy: {
        immediate: ["CEO/Founder", "CTO/Technical Lead"],
        mediumTerm: ["Core Developer", "Business Development Manager"],
        longTerm: ["Marketing Specialist", "Additional Developers", "Operations Manager"],
        budget: "Focus on equity-based compensation for early team members"
      }
    },
    analysisTime: 1.2,
    aiModel: 'Fallback Analysis',
    problemAnalyzed: {
      problemStatement: problemStatement.substring(0, 100) + '...',
      hasBusinessModel: !!businessModel,
      solutionsCount: solutions ? solutions.length : 0,
      startupType: isTechStartup ? 'Tech' : isHardwareStartup ? 'Hardware' : 'Service'
    }
  })
}
