import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { 
      problem,
      solutions,
      marketContext = 'India',
      campusFocus = true
    } = await request.json()
    
    if (!problem || !solutions || solutions.length === 0) {
      return NextResponse.json(
        { error: 'Problem and solutions are required' },
        { status: 400 }
      )
    }

    // Check if we have the API key
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.warn('Google Gemini API key not found, using fallback business model')
      return await fallbackBusinessModel(problem, solutions, marketContext, campusFocus)
    }

    try {
      // Initialize the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      // Create a comprehensive prompt for business model generation
      const prompt = `
        Generate a comprehensive business model for a campus-based startup solving this specific problem:

        PROBLEM DETAILS:
        - Title: ${problem.title}
        - Description: ${problem.description}
        - Category: ${problem.category}
        - Severity: ${problem.severity}
        - Impact: ${problem.impact || 'High impact on campus operations'}

        SELECTED SOLUTIONS:
        ${solutions.map((sol: any, index: number) => `
        ${index + 1}. ${sol.title}
           - Description: ${sol.description}
           - Category: ${sol.category}
           - Cost: ${sol.cost}
           - Timeline: ${sol.timeline}
           - Effectiveness: ${sol.effectiveness}%
           - Implementation: ${sol.implementation?.join(', ') || 'Standard implementation'}
        `).join('\n')}

        MARKET CONTEXT: ${marketContext}
        CAMPUS FOCUS: ${campusFocus ? 'Yes - focus on college/university implementation' : 'No - general market'}

        IMPORTANT REQUIREMENTS:
        1. All currency values must be in Indian Rupees (₹)
        2. Focus specifically on college/campus implementation
        3. Consider Indian college environment, regulations, and business practices
        4. Include realistic timelines and costs for Indian market
        5. Provide specific, actionable implementation steps
        6. Consider student involvement, faculty collaboration, and campus partnerships

        Please generate a comprehensive business model that includes:

        1. CAMPUS IMPLEMENTATION METHODOLOGY:
           - Step-by-step implementation process for college environment
           - Challenges specific to campus implementation
           - Opportunities unique to college setting
           - Key partnerships with colleges, students, and faculty
           - Realistic timeline for campus deployment

        2. BUSINESS MODEL CANVAS:
           - Value Proposition: How this solves campus problems specifically
           - Customer Segments: Who on campus will use this (students, faculty, admin, etc.)
           - Key Partners: College departments, student organizations, industry partners
           - Key Activities: What the business will do day-to-day
           - Key Resources: What's needed to operate (team, technology, campus access)
           - Channels: How to reach campus customers
           - Customer Relationships: How to maintain relationships with campus stakeholders
           - Cost Structure: Realistic costs in Indian Rupees
           - Revenue Streams: How to make money from campus implementation

        3. 6-MONTH TIMELINE:
           - Month 1: Initial setup and partnerships
           - Month 2: Pilot program and testing
           - Month 3: Iteration and improvement
           - Month 4: Full deployment and scaling
           - Month 5: Optimization and expansion
           - Month 6: Growth and next phase planning

        4. COMPELLING TAGLINE AND CALL TO ACTION:
           - A catchy tagline that captures the campus focus
           - Motivational call to action for implementation

        Return the response as a JSON object with the following structure:
        {
          "campusImplementation": {
            "methodology": ["Step 1", "Step 2", "Step 3", "Step 4", "Step 5"],
            "challenges": ["Challenge 1", "Challenge 2", "Challenge 3"],
            "opportunities": ["Opportunity 1", "Opportunity 2", "Opportunity 3"],
            "partnerships": ["Partnership 1", "Partnership 2", "Partnership 3"],
            "timeline": "Overall implementation timeline"
          },
          "businessStructure": {
            "valueProposition": "Clear value proposition for campus implementation",
            "customerSegments": ["Segment 1", "Segment 2", "Segment 3"],
            "keyPartners": ["Partner 1", "Partner 2", "Partner 3"],
            "keyActivities": ["Activity 1", "Activity 2", "Activity 3"],
            "keyResources": ["Resource 1", "Resource 2", "Resource 3"],
            "channels": ["Channel 1", "Channel 2", "Channel 3"],
            "customerRelationships": ["Relationship 1", "Relationship 2", "Relationship 3"],
            "costStructure": ["Cost 1 in INR", "Cost 2 in INR", "Cost 3 in INR"],
            "revenueStreams": ["Revenue 1 in INR", "Revenue 2 in INR", "Revenue 3 in INR"]
          },
          "timeline": {
            "month1": ["Task 1", "Task 2", "Task 3"],
            "month2": ["Task 1", "Task 2", "Task 3"],
            "month3": ["Task 1", "Task 2", "Task 3"],
            "month4": ["Task 1", "Task 2", "Task 3"],
            "month5": ["Task 1", "Task 2", "Task 3"],
            "month6": ["Task 1", "Task 2", "Task 3"]
          },
          "tagline": "Compelling tagline for campus implementation",
          "callToAction": "Motivational call to action message"
        }

        Make this business model specific to the exact problem and solutions provided, not generic business advice.
        Focus on practical, implementable strategies for Indian college campuses.
      `

      // Generate content using Gemini
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Parse the JSON response
      let businessModel
      try {
        // Extract JSON from the response (in case there's extra text)
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          businessModel = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('No JSON found in response')
        }
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError)
        console.log('Raw response:', text)
        return await fallbackBusinessModel(problem, solutions, marketContext, campusFocus)
      }

      return NextResponse.json({
        success: true,
        businessModel,
        analysisTime: 3.2,
        aiModel: 'Google Gemini 1.5 Flash',
        problemAnalyzed: {
          title: problem.title,
          category: problem.category,
          solutionsCount: solutions.length
        }
      })

    } catch (geminiError) {
      console.error('Gemini API error:', geminiError)
      return await fallbackBusinessModel(problem, solutions, marketContext, campusFocus)
    }

  } catch (error) {
    console.error('Error generating business model:', error)
    return NextResponse.json(
      { error: 'Failed to generate business model' },
      { status: 500 }
    )
  }
}

// Fallback business model when Gemini API is not available
async function fallbackBusinessModel(problem: any, solutions: any[], marketContext: string, campusFocus: boolean) {
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  const solutionTitles = solutions.map(sol => sol.title).join(', ')
  
  return NextResponse.json({
    success: true,
    businessModel: {
      campusImplementation: {
        methodology: [
          'Establish partnerships with 3-5 college departments for pilot program',
          'Recruit student interns and project teams for development and testing',
          'Deploy solution in controlled campus environment with faculty oversight',
          'Collect feedback and iterate based on campus-specific requirements',
          'Scale implementation across multiple campus facilities and departments',
          'Develop training programs for campus staff and student users'
        ],
        challenges: [
          'Limited budget constraints in college environment',
          'Student turnover and continuous training requirements',
          'Infrastructure limitations and technical constraints',
          'Regulatory compliance in educational setting',
          'Seasonal variations in campus activity and usage'
        ],
        opportunities: [
          'Access to motivated student talent for development and testing',
          'Real-world testing environment with diverse user base',
          'Research collaboration opportunities with faculty and departments',
          'Potential for government education funding and grants',
          'Scalable model for replication across multiple colleges',
          'Student entrepreneurship and innovation programs'
        ],
        partnerships: [
          'College administration and IT departments',
          'Student organizations and entrepreneurship clubs',
          'Faculty research groups and academic departments',
          'Local industry partners for internships and mentorship',
          'Government education initiatives and funding programs',
          'Technology vendors and service providers'
        ],
        timeline: '6-month phased implementation starting with pilot program and expanding to full campus deployment'
      },
      businessStructure: {
        valueProposition: `AI-powered ${problem.category.toLowerCase()} solution specifically designed for college campuses, providing cost-effective problem detection and resolution with student involvement and faculty collaboration`,
        customerSegments: [
          'College administrations and IT departments',
          'Student organizations and clubs',
          'Faculty and research departments',
          'Campus maintenance and operations teams',
          'Local businesses serving college communities',
          'Government education initiatives'
        ],
        keyPartners: [
          'College administration and IT departments',
          'Student development and entrepreneurship organizations',
          'Faculty research groups and academic departments',
          'Local technology vendors and service providers',
          'Government education initiatives and funding agencies',
          'Industry mentors and business advisors'
        ],
        keyActivities: [
          'AI model development and training with campus data',
          'Campus integration and system deployment',
          'Student training and support programs',
          'Data collection and analysis for continuous improvement',
          'Partnership development and relationship management',
          'Research collaboration and academic integration'
        ],
        keyResources: [
          'AI/ML development team with campus experience',
          'Campus infrastructure access and integration capabilities',
          'Student talent pool for development and testing',
          'Technology partnerships and vendor relationships',
          'Government and institutional funding sources',
          'Academic research and development capabilities'
        ],
        channels: [
          'Direct campus partnerships and institutional agreements',
          'Student organization networks and campus events',
          'Faculty research collaborations and academic programs',
          'Government education programs and funding initiatives',
          'Industry conference presentations and networking',
          'Digital marketing and social media engagement'
        ],
        customerRelationships: [
          'Personal assistance and dedicated support for campus users',
          'Community building and student engagement programs',
          'Co-creation with students and faculty for solution development',
          'Regular feedback collection and iterative improvement',
          'Long-term partnership development and relationship management',
          'Training and education programs for continuous adoption'
        ],
        costStructure: [
          'Development team salaries (₹8-12 lakhs/month)',
          'Infrastructure and cloud computing costs (₹50,000-1 lakh/month)',
          'Student stipends and internship programs (₹2-3 lakhs/month)',
          'Marketing and partnership development (₹1-2 lakhs/month)',
          'Legal and compliance requirements (₹50,000/month)',
          'Research and development activities (₹1-2 lakhs/month)'
        ],
        revenueStreams: [
          'Campus licensing fees (₹5-10 lakhs per college annually)',
          'Student project and internship program fees (₹2-5 lakhs per project)',
          'Government and institutional grants (₹10-50 lakhs annually)',
          'Industry partnership revenue sharing (₹3-8 lakhs annually)',
          'Consulting and training services (₹1-3 lakhs per engagement)',
          'Technology licensing to other educational institutions (₹2-5 lakhs per license)'
        ]
      },
      timeline: {
        month1: [
          'Finalize partnerships with 2-3 college departments',
          'Set up development team and establish campus infrastructure',
          'Begin AI model training with initial campus data',
          'Recruit first batch of student interns and project teams',
          'Establish legal framework and compliance requirements'
        ],
        month2: [
          'Deploy pilot system in selected college departments',
          'Conduct initial testing and data collection activities',
          'Train campus staff and student users on system operation',
          'Establish feedback collection mechanisms and user support',
          'Begin development of student training programs'
        ],
        month3: [
          'Analyze pilot results and iterate on solution based on feedback',
          'Expand system deployment to additional campus areas',
          'Develop comprehensive student training and education programs',
          'Begin seeking additional funding and partnership opportunities',
          'Establish metrics and success measurement frameworks'
        ],
        month4: [
          'Complete full campus deployment and system integration',
          'Launch student internship and project programs',
          'Establish industry partnerships and mentorship programs',
          'Begin marketing and outreach to other colleges',
          'Develop case studies and success documentation'
        ],
        month5: [
          'Optimize system performance and user experience',
          'Scale student programs and expand partnership network',
          'Prepare for expansion to additional colleges and institutions',
          'Develop comprehensive case studies and success metrics',
          'Establish sustainable revenue streams and business model'
        ],
        month6: [
          'Launch implementation at 2-3 additional colleges',
          'Establish sustainable revenue streams and business operations',
          'Build strategic partnerships and long-term alliances',
          'Plan for next phase of growth and market expansion',
          'Develop intellectual property and competitive advantages'
        ]
      },
      tagline: `"Transforming Campus Life Through AI-Powered ${problem.category} Solutions"`,
      callToAction: 'Ready to revolutionize campus problem-solving? Join our mission to create smarter, more efficient college environments through innovative AI technology and student collaboration.'
    },
    analysisTime: 1.5,
    aiModel: 'Fallback Business Model (Gemini API not available)',
    problemAnalyzed: {
      title: problem.title,
      category: problem.category,
      solutionsCount: solutions.length
    }
  })
}
