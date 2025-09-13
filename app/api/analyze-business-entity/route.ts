import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { 
      problemStatement,
      businessModel,
      teamData,
      targetMarket,
      industry,
      fundingPlans
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
      return await fallbackBusinessEntityAnalysis(problemStatement, businessModel, teamData, targetMarket, industry, fundingPlans)
    }

    try {
      // Initialize the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      // Create a comprehensive prompt for business entity analysis
      const prompt = `
        Analyze this startup and recommend the best business entity type for incorporation:

        PROBLEM STATEMENT:
        ${problemStatement}

        BUSINESS MODEL:
        ${businessModel ? JSON.stringify(businessModel, null, 2) : 'Not provided'}

        TEAM DATA:
        ${teamData ? JSON.stringify(teamData, null, 2) : 'Not provided'}

        TARGET MARKET:
        ${targetMarket || 'Not specified'}

        INDUSTRY:
        ${industry || 'Not specified'}

        FUNDING PLANS:
        ${fundingPlans || 'Not specified'}

        Based on this startup information, provide a comprehensive business entity analysis including:

        1. RECOMMENDED ENTITY TYPE:
           - Primary recommendation with detailed reasoning
           - Alternative options with pros/cons
           - State recommendations for incorporation

        2. ENTITY COMPARISON:
           - LLC vs Corporation vs Partnership vs Sole Proprietorship
           - Tax implications for each
           - Liability protection analysis
           - Funding and investment considerations

        3. INCORPORATION REQUIREMENTS:
           - Required documents and filings
           - Estimated timeline for incorporation
           - Key legal considerations

        4. COST ANALYSIS:
           - Incorporation costs by state
           - Ongoing compliance costs
           - Professional service fees

        Return the response as a JSON object with the following structure:
        {
          "recommendedEntity": {
            "type": "LLC",
            "reasoning": "Detailed explanation of why this entity type is best",
            "benefits": ["Benefit 1", "Benefit 2", "Benefit 3"],
            "drawbacks": ["Drawback 1", "Drawback 2"],
            "bestStates": ["State 1", "State 2", "State 3"],
            "recommendedState": "Delaware",
            "stateReasoning": "Why this state is recommended"
          },
          "entityComparison": {
            "llc": {
              "description": "LLC description",
              "pros": ["Pro 1", "Pro 2", "Pro 3"],
              "cons": ["Con 1", "Con 2"],
              "taxTreatment": "Pass-through taxation",
              "liabilityProtection": "Limited liability protection",
              "fundingConsiderations": "Funding considerations for LLC"
            },
            "corporation": {
              "description": "Corporation description",
              "pros": ["Pro 1", "Pro 2", "Pro 3"],
              "cons": ["Con 1", "Con 2"],
              "taxTreatment": "Double taxation",
              "liabilityProtection": "Full liability protection",
              "fundingConsiderations": "Funding considerations for Corporation"
            },
            "partnership": {
              "description": "Partnership description",
              "pros": ["Pro 1", "Pro 2"],
              "cons": ["Con 1", "Con 2"],
              "taxTreatment": "Pass-through taxation",
              "liabilityProtection": "Limited liability protection",
              "fundingConsiderations": "Funding considerations for Partnership"
            },
            "soleProprietorship": {
              "description": "Sole Proprietorship description",
              "pros": ["Pro 1", "Pro 2"],
              "cons": ["Con 1", "Con 2"],
              "taxTreatment": "Pass-through taxation",
              "liabilityProtection": "No liability protection",
              "fundingConsiderations": "Funding considerations for Sole Proprietorship"
            }
          },
          "incorporationRequirements": {
            "requiredDocuments": ["Document 1", "Document 2", "Document 3"],
            "filingRequirements": ["Requirement 1", "Requirement 2", "Requirement 3"],
            "estimatedTimeline": "2-4 weeks",
            "keyConsiderations": ["Consideration 1", "Consideration 2", "Consideration 3"]
          },
          "costAnalysis": {
            "incorporationCosts": {
              "delaware": "₹7,400-41,500",
              "california": "₹8,300-66,400",
              "newYork": "₹16,600-83,000",
              "texas": "₹24,900-62,250"
            },
            "ongoingCosts": {
              "annualFees": "₹4,150-41,500",
              "registeredAgent": "₹8,300-24,900/year",
              "complianceCosts": "₹16,600-83,000/year"
            },
            "professionalServices": {
              "attorneyFees": "₹83,000-4,15,000",
              "accountantFees": "₹41,500-1,66,000",
              "registeredAgent": "₹8,300-24,900/year"
            }
          }
        }

        Make this analysis specific to the exact startup provided, considering the industry, team size, funding plans, and business model.
        Focus on practical, actionable recommendations that align with the startup's goals and constraints.
      `

      // Generate content using Gemini
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Parse the JSON response
      let businessEntityAnalysis
      try {
        // Extract JSON from the response (in case there's extra text)
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          businessEntityAnalysis = JSON.parse(jsonMatch[0])
        } else {
          throw new Error('No JSON found in response')
        }
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError)
        console.log('Raw response:', text)
        return await fallbackBusinessEntityAnalysis(problemStatement, businessModel, teamData, targetMarket, industry, fundingPlans)
      }

      return NextResponse.json({
        success: true,
        businessEntityAnalysis,
        analysisTime: 3.0,
        aiModel: 'Google Gemini 1.5 Flash',
        startupAnalyzed: {
          problemStatement: problemStatement.substring(0, 100) + '...',
          teamSize: teamData?.teamMembers?.length || 1,
          industry: industry || 'Not specified',
          targetMarket: targetMarket || 'Not specified'
        }
      })

    } catch (geminiError) {
      console.error('Gemini API error:', geminiError)
      return await fallbackBusinessEntityAnalysis(problemStatement, businessModel, teamData, targetMarket, industry, fundingPlans)
    }

  } catch (error) {
    console.error('Error analyzing business entity:', error)
    return NextResponse.json(
      { error: 'Failed to analyze business entity' },
      { status: 500 }
    )
  }
}

// Fallback business entity analysis when Gemini API is not available
async function fallbackBusinessEntityAnalysis(problemStatement: string, businessModel: any, teamData: any, targetMarket: string, industry: string, fundingPlans: any) {
  // Extract keywords from problem statement for basic analysis
  const keywords = problemStatement.toLowerCase().split(' ').filter(word => 
    word.length > 3 && !['the', 'and', 'for', 'with', 'this', 'that'].includes(word)
  )

  // Determine if it's a tech startup
  const isTechStartup = keywords.some(keyword => 
    ['ai', 'software', 'app', 'platform', 'tech', 'digital', 'online', 'saas'].includes(keyword)
  )

  // Determine if it's a B2B startup
  const isB2B = keywords.some(keyword => 
    ['business', 'enterprise', 'company', 'organization', 'corporate', 'professional'].includes(keyword)
  )

  // Determine team size
  const teamSize = teamData?.teamMembers?.length || 1

  // Determine if seeking funding
  const seekingFunding = fundingPlans || teamSize > 2

  // Recommend entity type based on analysis (Indian entities)
  let recommendedEntity = 'LLP'
  let reasoning = 'LLP provides good liability protection with pass-through taxation and is suitable for most startups'
  
  if (isTechStartup && seekingFunding) {
    recommendedEntity = 'Private Limited Company'
    reasoning = 'Private Limited Company is preferred for tech startups seeking venture capital funding and investment'
  } else if (teamSize === 1) {
    recommendedEntity = 'One Person Company'
    reasoning = 'OPC provides liability protection while maintaining simplicity for solo entrepreneurs'
  } else if (teamSize > 3) {
    recommendedEntity = 'Private Limited Company'
    reasoning = 'Private Limited Company provides better structure for larger teams and potential investors'
  }

  return NextResponse.json({
    success: true,
    businessEntityAnalysis: {
      recommendedEntity: {
        type: recommendedEntity,
        reasoning: reasoning,
        benefits: [
          "Limited liability protection",
          "Professional credibility",
          "Tax flexibility",
          "Easier to raise capital"
        ],
        drawbacks: [
          "Higher compliance costs",
          "More complex tax filing",
          "Annual reporting requirements"
        ],
        bestStates: ["Delhi", "Mumbai", "Bangalore", "Chennai"],
        recommendedState: "Delhi",
        stateReasoning: "Delhi offers business-friendly environment and is preferred for startups due to ease of compliance"
      },
      entityComparison: {
        llp: {
          description: "Limited Liability Partnership - combines features of partnerships and companies, offering limited liability to partners",
          pros: [
            "Pass-through taxation",
            "Limited liability protection",
            "Flexible management structure",
            "Lower compliance requirements",
            "Suitable for professional services"
          ],
          cons: [
            "Limited life span",
            "Harder to raise capital",
            "Self-employment taxes"
          ],
          taxTreatment: "Pass-through taxation (no double taxation)",
          liabilityProtection: "Limited liability protection for partners",
          fundingConsiderations: "Can be challenging for VC funding, but good for angel investors"
        },
        "private-limited": {
          description: "Private Limited Company - separate legal entity with shareholders, directors, and officers",
          pros: [
            "Unlimited life span",
            "Easy to raise capital",
            "Stock options for employees",
            "Preferred by investors",
            "Limited liability protection"
          ],
          cons: [
            "Double taxation",
            "Complex compliance requirements",
            "Higher costs",
            "Annual filing requirements"
          ],
          taxTreatment: "Double taxation (corporate and individual)",
          liabilityProtection: "Full liability protection for shareholders",
          fundingConsiderations: "Preferred structure for venture capital and institutional investors"
        },
        "one-person-company": {
          description: "One Person Company - company with a single shareholder, offering limited liability and separate legal identity",
          pros: [
            "Limited liability protection",
            "Separate legal entity",
            "Pass-through taxation",
            "Corporate benefits for solo entrepreneurs"
          ],
          cons: [
            "Limited to one shareholder",
            "Higher compliance costs",
            "Limited growth potential"
          ],
          taxTreatment: "Pass-through taxation",
          liabilityProtection: "Limited liability protection",
          fundingConsiderations: "Limited funding options, mainly personal loans and angel investors"
        },
        "sole-proprietorship": {
          description: "Sole Proprietorship - business owned and operated by one person",
          pros: [
            "Simple to start",
            "Complete control",
            "Pass-through taxation",
            "Lowest costs",
            "Minimal compliance"
          ],
          cons: [
            "Unlimited personal liability",
            "Hard to raise capital",
            "Limited growth potential",
            "No separate legal entity"
          ],
          taxTreatment: "Pass-through taxation",
          liabilityProtection: "No liability protection",
          fundingConsiderations: "Limited to personal savings, loans, and credit cards"
        }
      },
      incorporationRequirements: {
        requiredDocuments: [
          "Memorandum of Association (MOA)",
          "Articles of Association (AOA)",
          "Digital Signature Certificate (DSC)",
          "Director Identification Number (DIN)",
          "PAN & TAN Registration",
          "GST Registration",
          "Business License"
        ],
        filingRequirements: [
          "File with Registrar of Companies (ROC)",
          "Pay government fees and stamp duty",
          "Obtain Digital Signature Certificate",
          "Register for PAN, TAN, and GST",
          "Appoint company secretary (if required)"
        ],
        estimatedTimeline: "7-15 business days",
        keyConsiderations: [
          "Choose appropriate state for incorporation",
          "Select unique business name",
          "Determine authorized capital",
          "Plan for ongoing compliance and annual filings"
        ]
      },
      costAnalysis: {
        incorporationCosts: {
          delhi: "₹5,000-15,000",
          mumbai: "₹6,000-18,000",
          bangalore: "₹5,000-15,000",
          chennai: "₹5,500-16,000"
        },
        ongoingCosts: {
          annualFees: "₹2,000-10,000",
          complianceCosts: "₹5,000-25,000/year",
          auditFees: "₹3,000-15,000/year"
        },
        professionalServices: {
          companySecretary: "₹10,000-50,000",
          charteredAccountant: "₹5,000-25,000",
          legalFees: "₹5,000-20,000"
        }
      }
    },
    analysisTime: 1.5,
    aiModel: 'Fallback Analysis',
    startupAnalyzed: {
      problemStatement: problemStatement.substring(0, 100) + '...',
      teamSize: teamSize,
      industry: industry || 'Not specified',
      targetMarket: targetMarket || 'Not specified',
      startupType: isTechStartup ? 'Tech' : 'Non-Tech',
      businessModel: isB2B ? 'B2B' : 'B2C',
      seekingFunding: seekingFunding
    }
  })
}
