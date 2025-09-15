import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { 
      problemStatement,
      analyzedProblems,
      generatedSolutions,
      businessModel,
      teamData,
      marketAnalysis,
      pitchDocument,
      imageAnalysis,
      mvpData,
      experiments,
      targetMarket,
      industry,
      userLocation,
      collegeContext
    } = await request.json()
    
    if (!problemStatement || !mvpData) {
      return NextResponse.json(
        { error: 'Problem statement and MVP data are required' },
        { status: 400 }
      )
    }

    // Check if we have the API key
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.warn('Google Gemini API key not found, using fallback document')
      return await fallbackMVPDocument(problemStatement, analyzedProblems, generatedSolutions, businessModel, teamData, marketAnalysis, pitchDocument, imageAnalysis, mvpData, experiments, targetMarket, industry, userLocation, collegeContext)
    }

    try {
      // Initialize the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      // Create a comprehensive prompt for MVP document generation
      const prompt = `
        Generate a comprehensive, professional MVP document based on the following startup data:

        PROBLEM STATEMENT:
        ${problemStatement}

        ANALYZED PROBLEMS:
        ${analyzedProblems ? JSON.stringify(analyzedProblems, null, 2) : 'Not provided'}

        GENERATED SOLUTIONS:
        ${generatedSolutions ? JSON.stringify(generatedSolutions, null, 2) : 'Not provided'}

        BUSINESS MODEL:
        ${businessModel ? JSON.stringify(businessModel, null, 2) : 'Not provided'}

        TEAM DATA:
        ${teamData ? JSON.stringify(teamData, null, 2) : 'Not provided'}

        MARKET ANALYSIS:
        ${marketAnalysis ? JSON.stringify(marketAnalysis, null, 2) : 'Not provided'}

        PITCH DOCUMENT:
        ${pitchDocument ? JSON.stringify(pitchDocument, null, 2) : 'Not provided'}

        IMAGE ANALYSIS:
        ${imageAnalysis ? JSON.stringify(imageAnalysis, null, 2) : 'Not provided'}

        MVP DATA:
        ${mvpData ? JSON.stringify(mvpData, null, 2) : 'Not provided'}

        EXPERIMENTS:
        ${experiments ? JSON.stringify(experiments, null, 2) : 'Not provided'}

        TARGET MARKET:
        ${targetMarket || 'Not specified'}

        INDUSTRY:
        ${industry || 'Not specified'}

        USER LOCATION:
        ${userLocation || 'India'}

        COLLEGE CONTEXT:
        ${collegeContext ? 'Yes - This is a college campus implementation' : 'No'}

        CRITICAL REQUIREMENTS:
        - This MVP document MUST be highly specific to the exact problem statement and solutions provided above
        - Use the exact analyzed problems, generated solutions, and business model data provided
        - Incorporate the specific team structure, market analysis, and pitch document details
        - All cost estimates and financial projections must be in Indian Rupees (₹) format, not dollars ($)
        - Use realistic Indian market pricing and costs
        - Focus on college campus implementation context
        - Make this document actionable and specific, not generic advice

        Generate a comprehensive MVP document that includes:

        1. EXECUTIVE SUMMARY:
           - Problem statement and solution overview
           - Market opportunity
           - Key value propositions
           - Team overview
           - MVP goals and success metrics

        2. MARKET ANALYSIS:
           - Target market definition
           - Market size and opportunity
           - Competitive landscape
           - Customer segments

        3. PRODUCT OVERVIEW:
           - MVP feature set
           - User stories and use cases
           - Technical architecture
           - User experience flow

        4. TEAM & ORGANIZATION:
           - Team structure and roles
           - Key team members and expertise
           - Organizational chart
           - Hiring plan

        5. BUSINESS MODEL:
           - Revenue streams
           - Pricing strategy
           - Cost structure
           - Key partnerships

        6. VALIDATION STRATEGY:
           - Experiment plan
           - Success metrics
           - Risk mitigation
           - Iteration plan

        7. DEVELOPMENT PLAN:
           - Technical requirements
           - Development timeline
           - Resource allocation
           - Launch strategy

        8. FINANCIAL PROJECTIONS:
           - Development costs
           - Operating expenses
           - Revenue projections
           - Funding requirements

        Return the response as a JSON object with the following structure:
        {
          "executiveSummary": {
            "problemStatement": "Clear problem statement",
            "solutionOverview": "Solution description",
            "marketOpportunity": "Market size and opportunity",
            "valuePropositions": ["Value prop 1", "Value prop 2", "Value prop 3"],
            "teamOverview": "Team summary",
            "mvpGoals": ["Goal 1", "Goal 2", "Goal 3"],
            "successMetrics": ["Metric 1", "Metric 2", "Metric 3"]
          },
          "marketAnalysis": {
            "targetMarket": "Target market definition",
            "marketSize": "Market size estimation",
            "competitiveLandscape": "Competition analysis",
            "customerSegments": ["Segment 1", "Segment 2", "Segment 3"]
          },
          "productOverview": {
            "featureSet": ["Feature 1", "Feature 2", "Feature 3"],
            "userStories": ["Story 1", "Story 2", "Story 3"],
            "technicalArchitecture": "Technical overview",
            "userExperienceFlow": "UX flow description"
          },
          "teamOrganization": {
            "teamStructure": "Team structure description",
            "keyMembers": ["Member 1", "Member 2", "Member 3"],
            "organizationalChart": "Org chart description",
            "hiringPlan": "Hiring strategy"
          },
          "businessModel": {
            "revenueStreams": ["Stream 1", "Stream 2", "Stream 3"],
            "pricingStrategy": "Pricing approach",
            "costStructure": "Cost breakdown",
            "keyPartnerships": ["Partnership 1", "Partnership 2"]
          },
          "validationStrategy": {
            "experimentPlan": "Validation experiments",
            "successMetrics": ["Metric 1", "Metric 2", "Metric 3"],
            "riskMitigation": "Risk management",
            "iterationPlan": "Iteration strategy"
          },
          "developmentPlan": {
            "technicalRequirements": "Tech requirements",
            "developmentTimeline": "Timeline breakdown",
            "resourceAllocation": "Resource planning",
            "launchStrategy": "Launch approach"
          },
          "financialProjections": {
            "developmentCosts": "Development cost breakdown",
            "operatingExpenses": "Operating cost breakdown",
            "revenueProjections": "Revenue projections",
            "fundingRequirements": "Funding needs"
          }
        }

        Make this document specific to the exact startup data provided, not generic advice.
        Focus on creating a professional, actionable MVP document that can be used for development and funding.
      `

      // Generate content using Gemini
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Parse the JSON response
      let mvpDocument
      try {
        // Extract JSON from the response (in case there's extra text)
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          mvpDocument = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('No JSON found in response')
        }
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError)
        console.log('Raw response:', text)
        return await fallbackMVPDocument(problemStatement, analyzedProblems, generatedSolutions, businessModel, teamData, marketAnalysis, pitchDocument, imageAnalysis, mvpData, experiments, targetMarket, industry, userLocation, collegeContext)
      }

      return NextResponse.json({
        success: true,
        mvpDocument,
        analysisTime: 3.5,
        aiModel: 'Google Gemini 1.5 Flash',
        documentGenerated: {
          problemStatement: problemStatement.substring(0, 100) + '...',
          teamSize: teamData?.teamMembers?.length || 0,
          featuresCount: mvpData?.features?.length || 0,
          experimentsCount: experiments ? Object.keys(experiments).length : 0
        }
      })

    } catch (geminiError) {
      console.error('Gemini API error:', geminiError)
      return await fallbackMVPDocument(problemStatement, analyzedProblems, generatedSolutions, businessModel, teamData, marketAnalysis, pitchDocument, imageAnalysis, mvpData, experiments, targetMarket, industry, userLocation, collegeContext)
    }

  } catch (error) {
    console.error('Error generating MVP document:', error)
    return NextResponse.json(
      { error: 'Failed to generate MVP document' },
      { status: 500 }
    )
  }
}

// Fallback MVP document when Gemini API is not available
async function fallbackMVPDocument(problemStatement: string, analyzedProblems: any, generatedSolutions: any, businessModel: any, teamData: any, marketAnalysis: any, pitchDocument: any, imageAnalysis: any, mvpData: any, experiments: any, targetMarket: string, industry: string, userLocation: string, collegeContext: boolean) {
  const currentDate = new Date().toLocaleDateString()
  
  return NextResponse.json({
    success: true,
    mvpDocument: {
      executiveSummary: {
        problemStatement: problemStatement,
        solutionOverview: `A comprehensive solution to address ${problemStatement.substring(0, 100)}... This MVP focuses on implementing the core features identified in our analysis: ${generatedSolutions?.slice(0, 3).map((s: any) => s.title).join(', ') || 'core functionality'}.`,
        marketOpportunity: `Targeting ${targetMarket || 'college campuses in India'} with significant growth potential. ${collegeContext ? 'College implementation provides access to a concentrated user base and testing environment.' : ''}`,
        valuePropositions: generatedSolutions?.slice(0, 3).map((s: any) => s.title) || [
          "Solves a critical problem efficiently",
          "User-friendly and accessible solution",
          "Cost-effective compared to alternatives"
        ],
        teamOverview: `Team of ${teamData?.teamMembers?.length || 1} members with diverse expertise. ${teamData?.founder?.name ? `Led by ${teamData.founder.name} as ${teamData.founder.title || 'Founder'}.` : ''}`,
        mvpGoals: mvpData?.goal ? [mvpData.goal] : [
          "Validate core assumptions",
          "Achieve product-market fit",
          "Build sustainable user base"
        ],
        successMetrics: mvpData?.successMetrics ? [mvpData.successMetrics] : [
          "User engagement metrics",
          "Conversion rates",
          "Customer satisfaction scores"
        ]
      },
      marketAnalysis: {
        targetMarket: targetMarket || "Primary target market to be defined",
        marketSize: "Market size analysis pending detailed research",
        competitiveLandscape: "Competitive analysis to be conducted",
        customerSegments: ["Primary segment", "Secondary segment", "Tertiary segment"]
      },
      productOverview: {
        featureSet: mvpData?.features?.map((f: any) => f.name) || ["Core feature 1", "Core feature 2", "Core feature 3"],
        userStories: [
          "As a user, I want to solve my problem efficiently",
          "As a user, I want an intuitive interface",
          "As a user, I want reliable performance"
        ],
        technicalArchitecture: "Technical architecture to be defined based on requirements",
        userExperienceFlow: "User experience flow to be designed and validated"
      },
      teamOrganization: {
        teamStructure: `Current team structure with ${teamData?.teamMembers?.length || 1} members`,
        keyMembers: teamData?.teamMembers?.map((m: any) => `${m.name} - ${m.role}`) || ["Founder/CEO"],
        organizationalChart: "Organizational chart to be developed",
        hiringPlan: "Hiring plan based on growth requirements"
      },
      businessModel: {
        revenueStreams: ["Primary revenue stream", "Secondary revenue stream"],
        pricingStrategy: "Pricing strategy to be validated through experiments",
        costStructure: "Cost structure analysis pending",
        keyPartnerships: ["Strategic partnership 1", "Strategic partnership 2"]
      },
      validationStrategy: {
        experimentPlan: "Validation experiments as defined in experiment plan",
        successMetrics: ["User acquisition", "Engagement", "Retention"],
        riskMitigation: "Risk mitigation strategies to be implemented",
        iterationPlan: "Iterative development based on user feedback"
      },
      developmentPlan: {
        technicalRequirements: "Technical requirements based on feature set",
        developmentTimeline: "6-8 week development timeline",
        resourceAllocation: "Resource allocation based on team capacity",
        launchStrategy: "Phased launch strategy with beta testing"
      },
      financialProjections: {
        developmentCosts: "Development costs estimated based on team and timeline",
        operatingExpenses: "Operating expenses for first 6 months",
        revenueProjections: "Revenue projections based on market analysis",
        fundingRequirements: "Funding requirements for MVP development and initial operations"
      }
    },
    analysisTime: 1.5,
    aiModel: 'Fallback Document Generator',
    documentGenerated: {
      problemStatement: problemStatement.substring(0, 100) + '...',
      teamSize: teamData?.teamMembers?.length || 0,
      featuresCount: mvpData?.features?.length || 0,
      experimentsCount: experiments ? Object.keys(experiments).length : 0,
      generatedDate: currentDate
    }
  })
}
