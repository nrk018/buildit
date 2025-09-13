import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { 
      problemStatement,
      businessModel,
      targetMarket,
      mvpGoal,
      features
    } = await request.json()
    
    if (!problemStatement || !mvpGoal) {
      return NextResponse.json(
        { error: 'Problem statement and MVP goal are required' },
        { status: 400 }
      )
    }

    // Check if we have the API key
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.warn('Google Gemini API key not found, using fallback experiments')
      return await fallbackExperiments(problemStatement, mvpGoal, targetMarket, features)
    }

    try {
      // Initialize the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      // Create a comprehensive prompt for experiment generation
      const prompt = `
        Generate 3 low-cost experiments to validate the MVP for this startup:

        PROBLEM STATEMENT:
        ${problemStatement}

        MVP GOAL:
        ${mvpGoal}

        TARGET MARKET:
        ${targetMarket || 'Not specified'}

        BUSINESS MODEL:
        ${businessModel ? JSON.stringify(businessModel, null, 2) : 'Not provided'}

        CORE FEATURES:
        ${features ? features.map((f: any) => `${f.name}: ${f.description}`).join('\n') : 'Not specified'}

        Generate 3 specific, actionable, low-cost experiments that can validate key assumptions:

        1. SURVEY EXPERIMENT:
           - Target audience and sample size
           - Key questions to ask
           - Expected insights
           - Cost estimate (under $500)
           - Timeline (1-2 weeks)
           - Tools/platforms to use

        2. LANDING PAGE EXPERIMENT:
           - Landing page concept and messaging
           - Key metrics to track
           - Call-to-action strategy
           - Cost estimate (under $200)
           - Timeline (1 week)
           - Tools/platforms to use

        3. PAID ADS EXPERIMENT:
           - Ad campaign concept
           - Target audience and platforms
           - Key metrics to measure
           - Cost estimate (under $300)
           - Timeline (1-2 weeks)
           - Tools/platforms to use

        Return the response as a JSON object with the following structure:
        {
          "surveyExperiment": {
            "title": "Survey Title",
            "description": "Detailed description of the survey experiment",
            "targetAudience": "Who to survey",
            "sampleSize": "Number of respondents",
            "keyQuestions": ["Question 1", "Question 2", "Question 3"],
            "expectedInsights": ["Insight 1", "Insight 2", "Insight 3"],
            "cost": "Cost estimate in USD",
            "timeline": "Timeline for execution",
            "tools": ["Tool 1", "Tool 2", "Tool 3"],
            "successMetrics": ["Metric 1", "Metric 2"]
          },
          "landingPageExperiment": {
            "title": "Landing Page Title",
            "description": "Detailed description of the landing page experiment",
            "concept": "Landing page concept and value proposition",
            "messaging": "Key messaging and copy",
            "callToAction": "Primary CTA strategy",
            "metricsToTrack": ["Metric 1", "Metric 2", "Metric 3"],
            "cost": "Cost estimate in USD",
            "timeline": "Timeline for execution",
            "tools": ["Tool 1", "Tool 2", "Tool 3"],
            "successMetrics": ["Metric 1", "Metric 2"]
          },
          "paidAdsExperiment": {
            "title": "Paid Ads Title",
            "description": "Detailed description of the paid ads experiment",
            "campaignConcept": "Ad campaign concept and creative approach",
            "targetAudience": "Target audience demographics and interests",
            "platforms": ["Platform 1", "Platform 2"],
            "metricsToMeasure": ["Metric 1", "Metric 2", "Metric 3"],
            "cost": "Cost estimate in USD",
            "timeline": "Timeline for execution",
            "tools": ["Tool 1", "Tool 2", "Tool 3"],
            "successMetrics": ["Metric 1", "Metric 2"]
          },
          "overallValidation": {
            "totalCost": "Total cost for all experiments",
            "totalTimeline": "Total timeline for all experiments",
            "keyAssumptions": ["Assumption 1", "Assumption 2", "Assumption 3"],
            "successCriteria": "What constitutes successful validation"
          }
        }

        Make these experiments specific to the exact problem and MVP provided, not generic advice.
        Focus on practical, actionable experiments that can be executed with minimal resources.
      `

      // Generate content using Gemini
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Parse the JSON response
      let experiments
      try {
        // Extract JSON from the response (in case there's extra text)
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          experiments = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('No JSON found in response')
        }
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError)
        console.log('Raw response:', text)
        return await fallbackExperiments(problemStatement, mvpGoal, targetMarket, features)
      }

      return NextResponse.json({
        success: true,
        experiments,
        analysisTime: 2.5,
        aiModel: 'Google Gemini 1.5 Flash',
        problemAnalyzed: {
          problemStatement: problemStatement.substring(0, 100) + '...',
          mvpGoal: mvpGoal.substring(0, 100) + '...',
          featuresCount: features ? features.length : 0
        }
      })

    } catch (geminiError) {
      console.error('Gemini API error:', geminiError)
      return await fallbackExperiments(problemStatement, mvpGoal, targetMarket, features)
    }

  } catch (error) {
    console.error('Error generating experiments:', error)
    return NextResponse.json(
      { error: 'Failed to generate experiments' },
      { status: 500 }
    )
  }
}

// Fallback experiments when Gemini API is not available
async function fallbackExperiments(problemStatement: string, mvpGoal: string, targetMarket: string, features: any[]) {
  // Extract keywords from problem statement for basic analysis
  const keywords = problemStatement.toLowerCase().split(' ').filter(word => 
    word.length > 3 && !['the', 'and', 'for', 'with', 'this', 'that'].includes(word)
  )

  // Determine if it's a B2B or B2C startup
  const isB2B = keywords.some(keyword => 
    ['business', 'enterprise', 'company', 'organization', 'corporate', 'professional'].includes(keyword)
  )

  const isTechStartup = keywords.some(keyword => 
    ['ai', 'software', 'app', 'platform', 'tech', 'digital', 'online'].includes(keyword)
  )

  return NextResponse.json({
    success: true,
    experiments: {
      surveyExperiment: {
        title: "Market Validation Survey",
        description: `Conduct a targeted survey to validate key assumptions about ${problemStatement.substring(0, 50)}...`,
        targetAudience: isB2B ? "Business professionals and decision makers" : "General consumers aged 18-45",
        sampleSize: "100-200 respondents",
        keyQuestions: [
          "How often do you experience this problem?",
          "What solutions have you tried before?",
          "How much would you pay for a solution?",
          "What features are most important to you?",
          "Would you recommend this to others?"
        ],
        expectedInsights: [
          "Problem frequency and severity",
          "Willingness to pay",
          "Feature preferences",
          "Market size estimation"
        ],
        cost: "₹12,450-24,900",
        timeline: "1-2 weeks",
        tools: ["Google Forms", "SurveyMonkey", "Typeform"],
        successMetrics: ["Response rate >20%", "Positive feedback >60%"]
      },
      landingPageExperiment: {
        title: "MVP Landing Page Test",
        description: `Create a landing page to test interest and collect early signups for the ${mvpGoal.substring(0, 30)}...`,
        concept: "Simple landing page with value proposition and signup form",
        messaging: `"Solve ${problemStatement.substring(0, 40)}... with our innovative solution"`,
        callToAction: "Get Early Access / Join Waitlist",
        metricsToTrack: [
          "Page views and bounce rate",
          "Signup conversion rate",
          "Time spent on page",
          "Traffic sources"
        ],
        cost: "₹4,150-12,450",
        timeline: "3-5 days",
        tools: ["Unbounce", "Leadpages", "Carrd", "Webflow"],
        successMetrics: ["Conversion rate >5%", "Low bounce rate <60%"]
      },
      paidAdsExperiment: {
        title: "Targeted Ad Campaign",
        description: `Run targeted ads to test market demand and drive traffic to landing page`,
        campaignConcept: "Problem-focused ads highlighting pain points and solution",
        targetAudience: isB2B ? "Business owners and professionals" : "General consumers with relevant interests",
        platforms: isB2B ? ["LinkedIn", "Google Ads"] : ["Facebook", "Instagram", "Google Ads"],
        metricsToMeasure: [
          "Click-through rate (CTR)",
          "Cost per click (CPC)",
          "Conversion rate",
          "Cost per acquisition (CPA)"
        ],
        cost: "₹16,600-33,200",
        timeline: "1-2 weeks",
        tools: ["Facebook Ads Manager", "Google Ads", "LinkedIn Campaign Manager"],
        successMetrics: ["CTR >2%", "CPA under ₹4,150"]
      }
    },
    overallValidation: {
      totalCost: "₹33,200-70,550",
      totalTimeline: "2-3 weeks",
      keyAssumptions: [
        "Problem exists and is significant enough",
        "Target market is willing to pay for solution",
        "Proposed features address core needs",
        "Market size is sufficient for business viability"
      ],
      successCriteria: "At least 2 out of 3 experiments show positive results with clear market demand"
    },
    analysisTime: 1.0,
    aiModel: 'Fallback Analysis',
    problemAnalyzed: {
      problemStatement: problemStatement.substring(0, 100) + '...',
      mvpGoal: mvpGoal.substring(0, 100) + '...',
      featuresCount: features ? features.length : 0,
      startupType: isB2B ? 'B2B' : 'B2C',
      techFocus: isTechStartup ? 'Tech' : 'Non-Tech'
    }
  })
}
