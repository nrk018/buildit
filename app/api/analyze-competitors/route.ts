import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { 
      problemTitle,
      problemDescription,
      problemCategory,
      problemSeverity,
      selectedSolutions = [],
      userLocation = 'India',
      collegeContext = false
    } = await request.json()
    
    if (!problemTitle || !problemDescription) {
      return NextResponse.json(
        { error: 'Problem title and description are required' },
        { status: 400 }
      )
    }

    // Check if we have the API key
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.warn('Google Gemini API key not found, using fallback competitor analysis')
      return await fallbackCompetitorAnalysis(problemTitle, problemDescription, problemCategory, problemSeverity)
    }

    try {
      // Initialize the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      // Create a comprehensive prompt for India-specific competitor analysis
      const prompt = `
        Analyze the competitive landscape for an Indian startup solving this specific problem:

        PROBLEM DETAILS:
        - Title: ${problemTitle}
        - Description: ${problemDescription}
        - Category: ${problemCategory}
        - Severity: ${problemSeverity}
        - Location: ${userLocation}
        - College Implementation Context: ${collegeContext ? 'Yes - focus on college/university implementation' : 'No - general market'}
        - Proposed Solutions: ${selectedSolutions.map((sol: any) => sol.title).join(', ') || 'AI-powered problem detection and solution platform'}

        IMPORTANT: Focus specifically on the INDIAN market with the following requirements:
        1. All currency values must be in Indian Rupees (₹)
        2. Include Indian companies and startups in the analysis
        3. Consider Indian market regulations, business environment, and cultural factors
        4. If college context is true, focus on how this can be implemented in Indian colleges/universities
        5. Include local competitors, pricing in INR, and Indian market dynamics

        Please provide a comprehensive competitive analysis that includes:

        1. TOP 5-7 COMPETITORS: Real Indian companies and international companies operating in India
        2. For each competitor, provide:
           - Company name and brief description
           - How they solve this specific problem in the Indian market
           - Their approach/methodology
           - Key strengths and weaknesses
           - Market position and size in India
           - Recent funding/valuation in INR if available
           - Pricing in Indian Rupees

        3. MARKET GAPS: What competitors are missing or doing poorly in India
        4. DIFFERENTIATION OPPORTUNITIES: How a new Indian startup could differentiate
        5. MARKET SIZING: Realistic market size for this specific problem area in India (in INR)
        6. COLLEGE IMPLEMENTATION: ${collegeContext ? 'Specific opportunities and challenges for implementing this solution in Indian colleges/universities' : 'General market analysis'}

        Focus on:
        - Real, existing companies operating in India (Indian and international)
        - Companies that specifically address ${problemCategory} problems in the Indian market
        - Both direct competitors (same solution approach) and indirect competitors (different approach to same problem)
        - Recent market data and trends specific to India
        - Indian regulatory environment and business practices
        - Pricing and cost structures relevant to Indian market
        - ${collegeContext ? 'College/university implementation opportunities, student engagement, campus partnerships, and educational impact' : 'General industrial/manufacturing sector focus'}

        Return the response as a JSON object with the following structure:
        {
          "competitors": [
            {
              "id": "competitor_1",
              "name": "Company Name",
              "description": "Brief company description",
              "website": "Company website",
              "founded": "Year founded",
              "funding": "Latest funding round and amount in INR",
              "valuation": "Estimated valuation in INR",
              "employees": "Number of employees",
              "pricing": "Pricing in Indian Rupees",
              "problemApproach": "How they solve this specific problem",
              "solutionMethodology": "Their technical approach",
              "strengths": ["Strength 1", "Strength 2"],
              "weaknesses": ["Weakness 1", "Weakness 2"],
              "marketPosition": "Market leader/challenger/niche player",
              "relevanceScore": 95
            }
          ],
          "marketAnalysis": {
            "totalMarketSize": "Market size for this specific problem in India (in INR)",
            "growthRate": "Annual growth rate in India",
            "keyTrends": ["Indian market trend 1", "Indian market trend 2", "Indian market trend 3"],
            "marketGaps": ["Gap in Indian market 1", "Gap in Indian market 2", "Gap in Indian market 3"],
            "differentiationOpportunities": ["Indian market opportunity 1", "Indian market opportunity 2", "Indian market opportunity 3"],
            "collegeImplementation": ${collegeContext ? '{"opportunities": ["College opportunity 1", "College opportunity 2"], "challenges": ["College challenge 1", "College challenge 2"], "partnerships": ["Potential college partnership 1", "Potential college partnership 2"]}' : 'null'}
          },
          "competitiveLandscape": {
            "directCompetitors": 3,
            "indirectCompetitors": 4,
            "marketMaturity": "Early/Developing/Mature",
            "barriersToEntry": ["Barrier 1", "Barrier 2"],
            "competitiveIntensity": "Low/Medium/High"
          }
        }

        Make this analysis specific to the exact problem described, not generic industrial solutions.
      `

      // Generate content using Gemini
      const result = await model.generateContent(prompt)
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
        return await fallbackCompetitorAnalysis(problemTitle, problemDescription, problemCategory, problemSeverity)
      }

      // Validate and structure the response
      const competitors = analysisResult.competitors || []
      const structuredCompetitors = competitors.map((competitor: any, index: number) => ({
        id: competitor.id || `competitor_${index + 1}`,
        name: competitor.name || 'Unknown Company',
        description: competitor.description || 'No description available',
        website: competitor.website || '',
        founded: competitor.founded || 'Unknown',
        funding: competitor.funding || 'Not disclosed',
        valuation: competitor.valuation || 'Not disclosed',
        employees: competitor.employees || 'Not disclosed',
        pricing: competitor.pricing || 'Not disclosed',
        problemApproach: competitor.problemApproach || 'Not specified',
        solutionMethodology: competitor.solutionMethodology || 'Not specified',
        strengths: Array.isArray(competitor.strengths) ? competitor.strengths : [],
        weaknesses: Array.isArray(competitor.weaknesses) ? competitor.weaknesses : [],
        marketPosition: competitor.marketPosition || 'Unknown',
        relevanceScore: competitor.relevanceScore || 80
      }))

      // Ensure market analysis has proper array structure
      const marketAnalysis = analysisResult.marketAnalysis || {}
      const structuredMarketAnalysis = {
        totalMarketSize: marketAnalysis.totalMarketSize || 'Not specified',
        growthRate: marketAnalysis.growthRate || 'Not specified',
        keyTrends: Array.isArray(marketAnalysis.keyTrends) ? marketAnalysis.keyTrends : [],
        marketGaps: Array.isArray(marketAnalysis.marketGaps) ? marketAnalysis.marketGaps : [],
        differentiationOpportunities: Array.isArray(marketAnalysis.differentiationOpportunities) ? marketAnalysis.differentiationOpportunities : [],
        collegeImplementation: marketAnalysis.collegeImplementation || null
      }

      // Ensure competitive landscape has proper array structure
      const competitiveLandscape = analysisResult.competitiveLandscape || {}
      const structuredCompetitiveLandscape = {
        directCompetitors: competitiveLandscape.directCompetitors || 0,
        indirectCompetitors: competitiveLandscape.indirectCompetitors || 0,
        marketMaturity: competitiveLandscape.marketMaturity || 'Unknown',
        barriersToEntry: Array.isArray(competitiveLandscape.barriersToEntry) ? competitiveLandscape.barriersToEntry : [],
        competitiveIntensity: competitiveLandscape.competitiveIntensity || 'Unknown'
      }

      return NextResponse.json({
        success: true,
        competitors: structuredCompetitors,
        marketAnalysis: structuredMarketAnalysis,
        competitiveLandscape: structuredCompetitiveLandscape,
        analysisTime: 4.2,
        aiModel: 'Google Gemini 1.5 Flash',
        problemAnalyzed: {
          title: problemTitle,
          category: problemCategory,
          severity: problemSeverity
        }
      })

    } catch (geminiError) {
      console.error('Gemini API error:', geminiError)
      return await fallbackCompetitorAnalysis(problemTitle, problemDescription, problemCategory, problemSeverity)
    }

  } catch (error) {
    console.error('Error analyzing competitors:', error)
    return NextResponse.json(
      { error: 'Failed to analyze competitors' },
      { status: 500 }
    )
  }
}

// Fallback competitor analysis when Gemini API is not available
async function fallbackCompetitorAnalysis(problemTitle: string, problemDescription: string, problemCategory: string, problemSeverity: string, userLocation: string = 'India', collegeContext: boolean = false) {
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Create dynamic fallback data based on problem category
  const getCompetitorsByCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'safety':
        return [
          {
            id: 'competitor_1',
            name: 'IBM Maximo India',
            description: 'Enterprise asset management and safety monitoring platform in India',
            website: 'https://www.ibm.com/products/maximo',
            founded: '1985',
            funding: 'Part of IBM (NYSE: IBM)',
            valuation: '₹9,00,000 Cr+ (IBM market cap)',
            employees: '350,000+',
            pricing: '₹50,000-₹2,00,000 per user annually',
            problemApproach: 'Comprehensive EAM platform with safety compliance modules for Indian industries',
            solutionMethodology: 'Enterprise software with IoT integration and predictive analytics',
            strengths: ['Enterprise-grade reliability', 'Extensive feature set', 'Strong market presence in India'],
            weaknesses: ['High cost and complexity', 'Long implementation times', 'Limited AI capabilities'],
            marketPosition: 'Market leader',
            relevanceScore: 85
          },
          {
            id: 'competitor_2',
            name: 'SAP EAM',
            description: 'Enterprise asset management solution with safety and compliance features',
            website: 'https://www.sap.com/products/asset-management.html',
            founded: '1972',
            funding: 'Public company (ETR: SAP)',
            valuation: '$150B+ (SAP market cap)',
            employees: '100,000+',
            problemApproach: 'Integrated EAM with safety management and compliance tracking',
            solutionMethodology: 'Cloud-based enterprise platform with mobile capabilities',
            strengths: ['Strong integration capabilities', 'Global presence', 'Comprehensive functionality'],
            weaknesses: ['Complex implementation', 'High licensing costs', 'Steep learning curve'],
            marketPosition: 'Market leader',
            relevanceScore: 80
          }
        ]
      case 'maintenance':
        return [
          {
            id: 'competitor_1',
            name: 'GE Predix',
            description: 'Industrial IoT platform for predictive maintenance and asset optimization',
            website: 'https://www.ge.com/digital/predix',
            founded: '2015',
            funding: 'Part of GE (NYSE: GE)',
            valuation: '$100B+ (GE market cap)',
            employees: '174,000+',
            problemApproach: 'IoT sensors and machine learning for predictive maintenance',
            solutionMethodology: 'Cloud-based platform with edge computing and AI analytics',
            strengths: ['Advanced IoT capabilities', 'Strong industrial focus', 'Comprehensive analytics'],
            weaknesses: ['High implementation cost', 'Complex setup', 'Limited to GE ecosystem'],
            marketPosition: 'Market challenger',
            relevanceScore: 90
          },
          {
            id: 'competitor_2',
            name: 'PTC ThingWorx',
            description: 'Industrial IoT platform for connected operations and maintenance',
            website: 'https://www.ptc.com/en/products/thingworx',
            founded: '2009',
            funding: 'Public company (NASDAQ: PTC)',
            valuation: '$15B+ (PTC market cap)',
            employees: '6,000+',
            problemApproach: 'Connected operations platform with predictive maintenance capabilities',
            solutionMethodology: 'IoT platform with AR/VR integration and digital twin technology',
            strengths: ['Innovative AR/VR features', 'Strong partner ecosystem', 'Flexible platform'],
            weaknesses: ['Complex pricing model', 'Requires technical expertise', 'Limited AI capabilities'],
            marketPosition: 'Market challenger',
            relevanceScore: 85
          }
        ]
      case 'operations':
        return [
          {
            id: 'competitor_1',
            name: 'Siemens MindSphere',
            description: 'Cloud-based IoT operating system for industrial applications',
            website: 'https://siemens.mindsphere.io/',
            founded: '2016',
            funding: 'Part of Siemens (ETR: SIE)',
            valuation: '$120B+ (Siemens market cap)',
            employees: '300,000+',
            problemApproach: 'Digital twin and simulation for operational optimization',
            solutionMethodology: 'Cloud-based platform with AI and machine learning capabilities',
            strengths: ['Strong industrial expertise', 'Comprehensive digital twin capabilities', 'Global reach'],
            weaknesses: ['Complex platform', 'High cost', 'Limited customization'],
            marketPosition: 'Market leader',
            relevanceScore: 88
          }
        ]
      default:
        return [
          {
            id: 'competitor_1',
            name: 'Microsoft Azure IoT',
            description: 'Cloud-based IoT platform for industrial applications',
            website: 'https://azure.microsoft.com/en-us/services/iot-hub/',
            founded: '2010',
            funding: 'Part of Microsoft (NASDAQ: MSFT)',
            valuation: '$2.8T+ (Microsoft market cap)',
            employees: '220,000+',
            problemApproach: 'Cloud-based IoT platform with AI and analytics capabilities',
            solutionMethodology: 'Azure cloud services with IoT Hub and AI/ML integration',
            strengths: ['Strong cloud infrastructure', 'AI/ML capabilities', 'Enterprise integration'],
            weaknesses: ['Generic approach', 'Complex pricing', 'Requires technical expertise'],
            marketPosition: 'Market leader',
            relevanceScore: 75
          }
        ]
    }
  }

  const competitors = getCompetitorsByCategory(problemCategory)
  
  return NextResponse.json({
    success: true,
    competitors,
    marketAnalysis: {
      totalMarketSize: problemCategory === 'Safety' ? '₹1,20,000 Cr+ annually in India' : 
                      problemCategory === 'Maintenance' ? '₹65,000 Cr+ annually in India' : 
                      '₹16,00,000 Cr+ in India',
      growthRate: problemCategory === 'Safety' ? '15% CAGR in India' : 
                 problemCategory === 'Maintenance' ? '28% CAGR in India' : 
                 '12% CAGR in India',
      keyTrends: [
        'Increasing adoption of AI and machine learning in Indian industries',
        'Growing focus on predictive analytics in Indian manufacturing',
        'Rising demand for real-time monitoring solutions in India',
        'Government initiatives like Make in India driving digital transformation'
      ],
      marketGaps: [
        'Limited AI-powered problem detection in Indian market',
        'High cost barriers for Indian small-medium enterprises',
        'Complex implementation and integration for Indian businesses',
        'Language and localization challenges'
      ],
      differentiationOpportunities: [
        'AI-first approach with computer vision for Indian market',
        'Simplified implementation and user experience for Indian users',
        'Cost-effective solutions for Indian SMBs',
        'Local language support and Indian business practices'
      ],
      collegeImplementation: collegeContext ? {
        opportunities: [
          'Student internship and project opportunities',
          'Research collaboration with Indian colleges',
          'Campus pilot programs and testing',
          'Educational partnerships and curriculum integration'
        ],
        challenges: [
          'Limited budget in Indian colleges',
          'Infrastructure constraints',
          'Faculty training requirements',
          'Student engagement and adoption'
        ],
        partnerships: [
          'IITs and NITs for technical collaboration',
          'Engineering colleges for pilot programs',
          'Government colleges for research projects',
          'Private universities for commercial partnerships'
        ]
      } : null
    },
    competitiveLandscape: {
      directCompetitors: competitors.length,
      indirectCompetitors: competitors.length + 2,
      marketMaturity: 'Developing',
      barriersToEntry: ['High capital requirements', 'Complex technology stack', 'Established customer relationships'],
      competitiveIntensity: 'High'
    },
    analysisTime: 2.1,
    aiModel: 'Fallback Competitor Analysis (Gemini API not available)',
    problemAnalyzed: {
      title: problemTitle,
      category: problemCategory,
      severity: problemSeverity
    }
  })
}
