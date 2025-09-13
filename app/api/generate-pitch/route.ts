import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const { 
      problemStatement, 
      selectedProblems, 
      selectedSolutions,
      companyInfo = {},
      marketData = {},
      imageDescription = '',
      overallAssessment = '',
      recommendations = ''
    } = await request.json()
    
    if (!problemStatement || !selectedProblems || !selectedSolutions) {
      return NextResponse.json(
        { error: 'Missing required data for pitch generation' },
        { status: 400 }
      )
    }

    // Check if we have the API key for AI-powered pitch generation
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.warn('Google Gemini API key not found, using fallback pitch generation')
      return await generateFallbackPitch(problemStatement, selectedProblems, selectedSolutions, companyInfo, marketData)
    }

    try {
      // Initialize the Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      
      // Create a comprehensive prompt for pitch generation
      const prompt = `
        Generate a professional, compelling pitch document for an AI-powered industrial problem-solving startup based on the following specific data:

        PROBLEM ANALYSIS:
        Technical Problem: ${problemStatement.technical.problem}
        Root Cause: ${problemStatement.technical.rootCause}
        Technical Impact: ${problemStatement.technical.impact}
        Success Metrics: ${problemStatement.technical.metrics}
        
        Business Problem: ${problemStatement.nonTechnical.problem}
        Stakeholders: ${problemStatement.nonTechnical.stakeholders}
        Business Impact: ${problemStatement.nonTechnical.businessImpact}
        Urgency: ${problemStatement.nonTechnical.urgency}
        
        IMAGE ANALYSIS CONTEXT:
        ${imageDescription ? `Image Description: ${imageDescription}` : ''}
        ${overallAssessment ? `Overall Assessment: ${overallAssessment}` : ''}
        ${recommendations ? `Recommendations: ${recommendations}` : ''}
        
        SELECTED PROBLEMS TO ADDRESS:
        ${selectedProblems.map((problem: any, index: number) => `
        ${index + 1}. ${problem.title}
           - Category: ${problem.category}
           - Severity: ${problem.severity}
           - Description: ${problem.description}
           - Impact: ${problem.impact || 'Not specified'}
           - Urgency: ${problem.urgency || 'Not specified'}
        `).join('')}
        
        PROPOSED SOLUTIONS:
        ${selectedSolutions.map((solution: any, index: number) => `
        ${index + 1}. ${solution.title}
           - Type: ${solution.type}
           - Complexity: ${solution.complexity}
           - Cost: ${solution.estimatedCost}
           - Timeline: ${solution.timeToImplement}
           - Effectiveness: ${solution.effectiveness}%
           - Description: ${solution.description}
        `).join('')}
        
        COMPANY INFO:
        ${JSON.stringify(companyInfo)}
        
        MARKET DATA:
        ${JSON.stringify(marketData)}
        
        Please generate a comprehensive, professional pitch document that:
        1. Creates a compelling narrative around the specific problems identified
        2. Positions the solutions as direct responses to these problems
        3. Uses the actual problem data to create realistic market sizing and financial projections
        4. Tailors the business model to the specific industry and problem types
        5. Creates specific, actionable next steps based on the problems and solutions
        6. Uses the image analysis context to add credibility and specificity
        7. Makes the pitch feel personalized and relevant to the actual analysis performed
        
        Structure the pitch as a markdown document with the following sections:
        - Executive Summary (compelling 2-3 paragraph overview)
        - Problem Statement (detailed analysis of the specific problems found)
        - Market Opportunity (tailored to the specific problems and industry)
        - Solution Overview (how our platform addresses these specific problems)
        - Proposed Solutions (detailed breakdown of the selected solutions)
        - Business Model (revenue model tailored to the problem types)
        - Competitive Analysis (positioning against competitors for these specific problems)
        - Financial Projections (realistic projections based on the problems and solutions)
        - Implementation Roadmap (specific steps to address the identified problems)
        - Risk Analysis (risks specific to these problems and solutions)
        - Team & Advisory (relevant expertise for these problem types)
        - Next Steps (specific actions based on the analysis)
        
        Make the pitch feel like it was created specifically for this analysis, not a generic template. Use the actual problem data throughout to create a compelling, data-driven narrative.
      `

      // Generate content using Gemini
      const result = await model.generateContent(prompt)
      const response = await result.response
      const text = response.text()
      
      // Clean up the response (remove any markdown formatting issues)
      const pitchDocument = text.replace(/^```markdown\n?/, '').replace(/\n?```$/, '').trim()
      
      return NextResponse.json({
        success: true,
        pitchDocument,
        generationTime: 3.2,
        wordCount: pitchDocument.split(' ').length,
        aiModel: 'Google Gemini 1.5 Flash',
        sections: [
          'Executive Summary',
          'Problem Statement', 
          'Market Opportunity',
          'Solution Overview',
          'Proposed Solutions',
          'Business Model',
          'Competitive Analysis',
          'Financial Projections',
          'Implementation Roadmap',
          'Risk Analysis',
          'Team & Advisory',
          'Next Steps'
        ]
      })

    } catch (geminiError) {
      console.error('Gemini API error:', geminiError)
      return await generateFallbackPitch(problemStatement, selectedProblems, selectedSolutions, companyInfo, marketData)
    }

  } catch (error) {
    console.error('Error generating pitch document:', error)
    return NextResponse.json(
      { error: 'Failed to generate pitch document' },
      { status: 500 }
    )
  }
}

// Fallback pitch generation when Gemini API is not available
async function generateFallbackPitch(problemStatement: any, selectedProblems: any[], selectedSolutions: any[], companyInfo: any, marketData: any) {
  await new Promise(resolve => setTimeout(resolve, 2000))
  
  // Create a more dynamic fallback pitch based on the actual data
  const problemCategories = [...new Set(selectedProblems.map(p => p.category))]
  const severityLevels = [...new Set(selectedProblems.map(p => p.severity))]
  const totalEstimatedCost = selectedSolutions.reduce((sum, sol) => {
    const cost = sol.estimatedCost.match(/\$([0-9,]+)/)?.[1]?.replace(/,/g, '') || '0'
    return sum + parseInt(cost)
  }, 0)
  
  const pitchDocument = `# AI-Powered Industrial Problem-Solving Solution Pitch

## Executive Summary
Based on our comprehensive analysis of your industrial environment, we've identified ${selectedProblems.length} critical problems across ${problemCategories.length} key areas: ${problemCategories.join(', ')}. Our AI-powered solution platform addresses these specific challenges with targeted solutions that can reduce operational costs by up to 30% while significantly improving safety and compliance.

The analysis reveals ${severityLevels.includes('critical') ? 'critical safety and operational issues' : 'significant operational inefficiencies'} that require immediate attention. Our proposed solutions, with a total investment of approximately $${totalEstimatedCost.toLocaleString()}, will deliver measurable ROI within 12-18 months.

## Problem Statement

### Critical Issues Identified
${selectedProblems.map((problem, index) => `
**${index + 1}. ${problem.title}** (${problem.severity.toUpperCase()} - ${problem.category})
- **Description:** ${problem.description}
- **Impact:** ${problem.impact || 'Significant operational and safety risks'}
- **Urgency:** ${problem.urgency || 'Requires immediate attention'}
- **Estimated Cost Impact:** ${problem.estimatedCost || 'Not quantified'}
`).join('')}

### Root Cause Analysis
**Technical Root Causes:**
${problemStatement.technical.rootCause || 'Lack of automated monitoring, predictive systems, and real-time problem detection capabilities'}

**Business Root Causes:**
- Inadequate real-time monitoring systems
- Manual inspection processes prone to human error
- Lack of predictive maintenance capabilities
- Insufficient compliance tracking and reporting

### Impact Assessment
**Technical Impact:**
${problemStatement.technical.impact || 'Increased safety risks, equipment downtime, operational inefficiencies, and compliance violations'}

**Business Impact:**
${problemStatement.nonTechnical.businessImpact || 'Potential regulatory fines, reduced productivity, increased insurance costs, and competitive disadvantage'}

**Success Metrics:**
${problemStatement.technical.metrics || '30% reduction in safety incidents, 25% decrease in maintenance costs, 40% improvement in compliance scores'}

## Market Opportunity

### Industry-Specific Market Analysis
Based on the problems identified in your ${problemCategories.includes('Safety') ? 'safety-critical' : 'operational'} environment:

- **Industrial Safety Market:** $15B+ annually, growing 12% CAGR
- **Predictive Maintenance Market:** $8B+ and growing 25% annually  
- **Industrial IoT Market:** $200B+ globally, with 8.5% CAGR
- **Compliance Management Software:** $4.5B market, driven by increasing regulations

### Target Market Segments
1. **Primary Target:** ${problemCategories.includes('Safety') ? 'Safety-critical manufacturing facilities' : 'Industrial manufacturing facilities'}
2. **Secondary Target:** ${problemCategories.includes('Compliance') ? 'Regulated industries requiring compliance monitoring' : 'Operations-focused industrial environments'}
3. **Tertiary Target:** ${problemCategories.includes('Maintenance') ? 'Facilities with aging equipment requiring predictive maintenance' : 'General industrial facilities seeking operational optimization'}

## Solution Overview

### AI-Powered Problem Detection Platform
Our platform specifically addresses the ${selectedProblems.length} problems identified in your analysis:

**Core Capabilities:**
- **Real-time Problem Detection:** AI-powered computer vision for instant identification of the specific issues found
- **Predictive Analytics:** Machine learning algorithms to prevent the types of problems identified
- **Automated Solution Recommendations:** Contextual solutions tailored to your specific problem categories
- **Compliance Monitoring:** Automated tracking for ${problemCategories.includes('Compliance') ? 'regulatory compliance requirements' : 'operational standards'}

### Technology Architecture
- **Computer Vision Models:** Trained specifically for ${problemCategories.join(' and ')} detection
- **Machine Learning Pipeline:** Optimized for the problem types identified in your environment
- **Cloud-Native Platform:** Scalable infrastructure for real-time processing
- **Mobile-First Interface:** Field-ready applications for immediate problem reporting

## Proposed Solutions

${selectedSolutions.map((solution, index) => `
### Solution ${index + 1}: ${solution.title}
**Problem Addressed:** ${selectedProblems.filter(p => solution.problemsAddressed?.includes(p.id)).map(p => p.title).join(', ') || 'Multiple identified problems'}

**Solution Details:**
- **Type:** ${solution.type} solution
- **Complexity:** ${solution.complexity} implementation
- **Effectiveness:** ${solution.effectiveness}% problem resolution rate
- **Description:** ${solution.description}

**Investment & Timeline:**
- **Cost:** ${solution.estimatedCost}
- **Implementation:** ${solution.timeToImplement}
- **ROI:** ${solution.roi || '12-18 months'}

**Expected Outcomes:**
- Direct resolution of identified ${solution.type} problems
- Measurable improvement in operational efficiency
- Enhanced safety and compliance posture
- Reduced long-term operational costs
`).join('')}

## Business Model

### Revenue Structure (Tailored to Your Problem Profile)
**SaaS Subscription Tiers:**
- **Starter Plan:** $500-1,000/month (covers ${selectedProblems.length <= 2 ? 'basic problem detection' : 'comprehensive monitoring'})
- **Professional Plan:** $1,000-2,500/month (includes ${problemCategories.includes('Safety') ? 'advanced safety monitoring' : 'predictive analytics'})
- **Enterprise Plan:** $2,500-5,000/month (full platform with ${problemCategories.includes('Compliance') ? 'compliance management' : 'advanced analytics'})

**Implementation Services:**
- **Initial Setup:** $10,000-${totalEstimatedCost > 50000 ? '75,000' : '50,000'} (based on solution complexity)
- **Custom Integration:** $5,000-25,000 (tailored to your specific systems)
- **Training & Support:** $2,000-10,000 (comprehensive team training)

### Pricing Justification
Based on your identified problems, the ROI calculation shows:
- **Cost Avoidance:** $${(totalEstimatedCost * 2).toLocaleString()} annually (preventing problem escalation)
- **Efficiency Gains:** 25-40% improvement in operational efficiency
- **Compliance Benefits:** ${problemCategories.includes('Compliance') ? 'Reduced regulatory risk and potential fines' : 'Improved operational standards'}

## Competitive Analysis

### Competitive Landscape for Your Problem Types
**Direct Competitors:**
1. **IBM Maximo** - Limited AI capabilities, complex implementation
2. **SAP EAM** - Enterprise-focused, high cost barrier
3. **GE Predix** - Industrial IoT platform, requires significant customization

**Our Competitive Advantages:**
- **Problem-Specific AI:** Models trained for your exact problem categories
- **Rapid Implementation:** ${selectedSolutions.some(s => s.complexity === 'simple') ? 'Quick wins available' : 'Comprehensive solution deployment'}
- **Cost-Effective:** Lower total cost of ownership than enterprise solutions
- **Industry Focus:** Specialized for ${problemCategories.join(' and ')} challenges

## Financial Projections

### Revenue Forecast (Based on Your Problem Profile)
**Year 1:** $750K revenue, 15 customers, $50K ARR per customer
**Year 2:** $2.5M revenue, 60 customers, $42K ARR per customer  
**Year 3:** $6M revenue, 180 customers, $33K ARR per customer

### Key Financial Metrics
- **Customer Acquisition Cost:** $12,000 (optimized for your market segment)
- **Customer Lifetime Value:** $250,000 (based on problem complexity)
- **LTV/CAC Ratio:** 20.8x
- **Gross Margin:** 87% (high-margin SaaS model)
- **Monthly Churn:** 1.5% (strong retention due to problem-specific value)

### Funding Requirements
**Series A:** $2.5M for accelerated growth
**Use of Funds:**
- Product development: 35% ($875K)
- Sales & marketing: 40% ($1M) 
- Operations: 15% ($375K)
- Working capital: 10% ($250K)

## Implementation Roadmap

### Phase 1: Immediate Problem Resolution (Months 1-3)
${selectedProblems.filter(p => p.urgency === 'immediate').map(p => `- Deploy solution for ${p.title}`).join('\n') || '- Implement high-priority safety and operational solutions'}

### Phase 2: Comprehensive Deployment (Months 4-6)
- Full platform deployment
- Team training and change management
- Integration with existing systems
- Performance monitoring and optimization

### Phase 3: Advanced Features (Months 7-12)
- Predictive analytics implementation
- Advanced reporting and analytics
- Mobile application deployment
- Continuous improvement based on data

### Phase 4: Scale and Optimize (Months 13-18)
- Multi-facility expansion
- Advanced AI model training
- Strategic partnerships
- International expansion planning

## Risk Analysis

### Risks Specific to Your Problem Profile
**Technical Risks:**
- **AI Model Accuracy:** Mitigated through ${selectedProblems.length > 3 ? 'comprehensive training data' : 'focused model training'} for your specific problem types
- **Integration Complexity:** Addressed through ${selectedSolutions.some(s => s.complexity === 'simple') ? 'phased implementation starting with simple solutions' : 'comprehensive integration planning'}

**Business Risks:**
- **Adoption Challenges:** Mitigated through ${problemCategories.includes('Safety') ? 'safety-focused training and change management' : 'operational efficiency demonstrations'}
- **Competition:** Differentiated through problem-specific AI models and rapid implementation

**Operational Risks:**
- **Data Quality:** Addressed through robust data validation and quality assurance processes
- **Scalability:** Cloud-native architecture ensures scalability for your facility size

## Team & Advisory

### Core Team (Relevant to Your Problem Types)
- **CEO/Founder:** ${problemCategories.includes('Safety') ? 'Industrial safety and compliance background' : 'Industrial operations and automation expertise'}
- **CTO:** AI/ML specialist with ${problemCategories.includes('Maintenance') ? 'predictive maintenance' : 'computer vision'} experience
- **VP Sales:** ${problemCategories.includes('Compliance') ? 'Regulated industry sales background' : 'Industrial B2B sales experience'}
- **VP Product:** Product management in ${problemCategories.includes('Operations') ? 'operational efficiency' : 'industrial automation'} solutions

### Advisory Board
- **Industry Expert:** ${problemCategories.includes('Safety') ? 'Former safety director at Fortune 500 manufacturer' : 'Former operations VP at industrial company'}
- **Technology Advisor:** AI/ML researcher specializing in ${problemCategories.join(' and ')}
- **Sales Advisor:** Former VP Sales at ${problemCategories.includes('Compliance') ? 'compliance software company' : 'industrial software company'}

## Next Steps

### Immediate Actions (Next 30 Days)
1. **Technical Validation:** Deep dive into the ${selectedProblems.length} identified problems
2. **Pilot Program Setup:** Deploy solution for ${selectedProblems[0]?.title || 'highest priority problem'}
3. **Stakeholder Alignment:** Present findings to ${problemStatement.nonTechnical.stakeholders || 'key stakeholders'}
4. **Funding Preparation:** Begin Series A fundraising process

### Short-term Goals (Next 90 Days)
1. **Pilot Implementation:** Deploy and validate solution effectiveness
2. **Customer Feedback:** Collect and integrate user feedback
3. **Sales Pipeline:** Build qualified prospect list
4. **Funding Close:** Complete Series A round

### Long-term Vision (Next 12 Months)
1. **Full Deployment:** Implement all ${selectedSolutions.length} proposed solutions
2. **Market Expansion:** Scale to similar facilities with comparable problems
3. **Product Enhancement:** Advanced features based on usage data
4. **Series B Preparation:** Prepare for next funding round

---

**Contact Information:**
- Email: contact@industrialsolutions.ai
- Phone: (555) 123-4567
- Website: www.industrialsolutions.ai

*This pitch document was generated specifically for your analysis, incorporating the ${selectedProblems.length} problems identified and ${selectedSolutions.length} solutions proposed. The content is tailored to your specific industrial environment and problem profile.*`

    return NextResponse.json({
      success: true,
      pitchDocument,
    generationTime: 2.1,
      wordCount: pitchDocument.split(' ').length,
    aiModel: 'Fallback Pitch Generation (Gemini API not available)',
      sections: [
        'Executive Summary',
        'Problem Statement',
        'Market Opportunity',
        'Solution Overview',
        'Proposed Solutions',
        'Business Model',
        'Competitive Analysis',
        'Financial Projections',
        'Implementation Roadmap',
        'Risk Analysis',
        'Team & Advisory',
        'Next Steps'
      ]
    })
}

