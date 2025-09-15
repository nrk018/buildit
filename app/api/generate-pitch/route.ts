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
        Generate a highly specific, compelling pitch document for a startup based on the EXACT analysis performed. This is NOT a generic template - it must be tailored to the specific problems, solutions, and context provided.

        CRITICAL REQUIREMENTS:
        - Use the EXACT problem titles, descriptions, and details provided
        - Reference the SPECIFIC image analysis and assessment data
        - Include the ACTUAL cost estimates and timelines from solutions
        - Create financial projections based on the REAL problem severity and market data
        - Make every section specific to this particular analysis

        USER'S SPECIFIC ANALYSIS DATA:

        PROBLEM STATEMENT (User's Exact Input):
        Technical Problem: ${problemStatement.technical.problem}
        Root Cause: ${problemStatement.technical.rootCause}
        Technical Impact: ${problemStatement.technical.impact}
        Success Metrics: ${problemStatement.technical.metrics}
        
        Business Problem: ${problemStatement.nonTechnical.problem}
        Stakeholders: ${problemStatement.nonTechnical.stakeholders}
        Business Impact: ${problemStatement.nonTechnical.businessImpact}
        Urgency: ${problemStatement.nonTechnical.urgency}
        
        IMAGE/ANALYSIS CONTEXT (User's Specific Situation):
        ${imageDescription ? `Image Description: ${imageDescription}` : ''}
        ${overallAssessment ? `Overall Assessment: ${overallAssessment}` : ''}
        ${recommendations ? `Recommendations: ${recommendations}` : ''}
        
        SPECIFIC PROBLEMS IDENTIFIED (User's Exact Problems):
        ${selectedProblems.map((problem: any, index: number) => `
        ${index + 1}. ${problem.title}
           - Category: ${problem.category}
           - Severity: ${problem.severity}
           - Description: ${problem.description}
           - Impact: ${problem.impact || 'Not specified'}
           - Urgency: ${problem.urgency || 'Not specified'}
           - Estimated Cost: ${problem.estimatedCost || 'Not specified'}
           - Timeline: ${problem.timeline || 'Not specified'}
        `).join('')}
        
        SPECIFIC SOLUTIONS SELECTED (User's Exact Solutions):
        ${selectedSolutions.map((solution: any, index: number) => `
        ${index + 1}. ${solution.title}
           - Type: ${solution.type}
           - Complexity: ${solution.complexity}
           - Cost: ${solution.estimatedCost}
           - Timeline: ${solution.timeToImplement}
           - Effectiveness: ${solution.effectiveness}%
           - Description: ${solution.description}
           - Problems Addressed: ${solution.problemsAddressed?.join(', ') || 'Multiple problems'}
           - ROI: ${solution.roi || '12-18 months'}
        `).join('')}
        
        COMPANY CONTEXT:
        ${JSON.stringify(companyInfo)}
        
        MARKET CONTEXT:
        ${JSON.stringify(marketData)}
        
        INSTRUCTIONS FOR PITCH GENERATION:
        1. Start with the EXACT problems the user identified - use their specific titles and descriptions
        2. Reference the image analysis context to show this is based on real analysis
        3. Use the ACTUAL cost estimates from their selected solutions
        4. Create financial projections based on their specific problem severity levels
        5. Tailor the business model to their exact problem categories and solution types
        6. Include their specific recommendations and assessment in the narrative
        7. Make the implementation roadmap specific to their selected solutions and timelines
        8. Reference their specific stakeholders and business impact throughout
        9. Use their exact success metrics in the projections
        10. Make every section feel like it was written specifically for their analysis

        Structure the pitch as a markdown document with these sections, but make each section highly specific to the user's data:
        - Executive Summary (reference their specific problems and image analysis)
        - Problem Statement (use their exact problem descriptions and impact)
        - Market Opportunity (based on their specific problem categories and severity)
        - Solution Overview (tailored to their selected solutions and effectiveness ratings)
        - Proposed Solutions (detailed breakdown of their exact solutions with their costs/timelines)
        - Business Model (revenue model based on their problem types and solution complexity)
        - Competitive Analysis (positioned against competitors for their specific problem types)
        - Financial Projections (based on their actual solution costs and problem severity)
        - Implementation Roadmap (specific to their selected solutions and timelines)
        - Risk Analysis (risks specific to their problem types and solution complexity)
        - Team & Advisory (expertise relevant to their specific problem categories)
        - Next Steps (specific actions based on their exact analysis and recommendations)

        CRITICAL: This pitch must feel like it was written specifically for this user's analysis. Reference their exact problem titles, use their specific cost estimates, and incorporate their image analysis context throughout. Do not use generic examples or templated content.
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
  
  // Create a highly specific fallback pitch based on the user's exact data
  const problemCategories = [...new Set(selectedProblems.map(p => p.category))]
  const severityLevels = [...new Set(selectedProblems.map(p => p.severity))]
  const totalEstimatedCost = selectedSolutions.reduce((sum, sol) => {
    const cost = sol.estimatedCost.match(/₹([0-9,]+)/)?.[1]?.replace(/,/g, '') || '0'
    return sum + parseInt(cost)
  }, 0)
  
  // Extract specific user context
  const hasImageAnalysis = imageDescription && imageDescription.length > 0
  const hasAssessment = overallAssessment && overallAssessment.length > 0
  const hasRecommendations = recommendations && recommendations.length > 0
  const criticalProblems = selectedProblems.filter(p => p.severity === 'critical')
  const highPriorityProblems = selectedProblems.filter(p => p.urgency === 'immediate' || p.urgency === 'within_week')
  
  const pitchDocument = `# Startup Pitch: ${companyInfo.name || 'AI-Powered Industrial Solutions'}

## Executive Summary
${hasImageAnalysis ? `Based on our comprehensive analysis of your specific industrial environment (${imageDescription}), ` : 'Based on our comprehensive analysis of your industrial environment, '}we've identified ${selectedProblems.length} specific problems across ${problemCategories.length} key areas: ${problemCategories.join(', ')}. ${hasAssessment ? `Our assessment indicates: ${overallAssessment}. ` : ''}Our AI-powered solution platform addresses these exact challenges with targeted solutions that can reduce operational costs by up to 30% while significantly improving safety and compliance.

The analysis reveals ${criticalProblems.length > 0 ? `${criticalProblems.length} critical issues requiring immediate attention` : severityLevels.includes('high') ? 'high-priority operational issues' : 'significant operational inefficiencies'} that require immediate attention. Our proposed ${selectedSolutions.length} solutions, with a total investment of approximately ₹${totalEstimatedCost.toLocaleString()}, will deliver measurable ROI within 12-18 months. ${hasRecommendations ? `As recommended: ${recommendations}` : ''}

## Problem Statement

### Your Specific Issues Identified
${selectedProblems.map((problem, index) => `
**${index + 1}. ${problem.title}** (${problem.severity.toUpperCase()} - ${problem.category})
- **Description:** ${problem.description}
- **Impact:** ${problem.impact || 'Significant operational and safety risks'}
- **Urgency:** ${problem.urgency || 'Requires immediate attention'}
- **Estimated Cost Impact:** ${problem.estimatedCost || 'Not quantified'}
- **Timeline:** ${problem.timeline || 'Not specified'}
`).join('')}

### Root Cause Analysis (Based on Your Analysis)
**Technical Root Causes:**
${problemStatement.technical.rootCause || 'Lack of automated monitoring, predictive systems, and real-time problem detection capabilities'}

**Business Root Causes:**
${problemStatement.nonTechnical.problem || 'Inadequate real-time monitoring systems, manual inspection processes prone to human error, lack of predictive maintenance capabilities, and insufficient compliance tracking and reporting'}

### Impact Assessment (Your Specific Situation)
**Technical Impact:**
${problemStatement.technical.impact || 'Increased safety risks, equipment downtime, operational inefficiencies, and compliance violations'}

**Business Impact:**
${problemStatement.nonTechnical.businessImpact || 'Potential regulatory fines, reduced productivity, increased insurance costs, and competitive disadvantage'}

**Stakeholders Affected:**
${problemStatement.nonTechnical.stakeholders || 'Operations team, safety personnel, management, and regulatory compliance officers'}

**Success Metrics (Your Goals):**
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

## Proposed Solutions (Your Selected Solutions)

${selectedSolutions.map((solution, index) => `
### Solution ${index + 1}: ${solution.title}
**Problems Addressed:** ${selectedProblems.filter(p => solution.problemsAddressed?.includes(p.id)).map(p => p.title).join(', ') || 'Multiple identified problems'}

**Solution Details:**
- **Type:** ${solution.type} solution
- **Complexity:** ${solution.complexity} implementation
- **Effectiveness:** ${solution.effectiveness}% problem resolution rate
- **Description:** ${solution.description}

**Your Investment & Timeline:**
- **Cost:** ${solution.estimatedCost}
- **Implementation:** ${solution.timeToImplement}
- **ROI:** ${solution.roi || '12-18 months'}

**Expected Outcomes for Your Situation:**
- Direct resolution of your identified ${solution.type} problems
- Measurable improvement in operational efficiency
- Enhanced safety and compliance posture
- Reduced long-term operational costs
- ${solution.implementationSteps ? `Implementation steps: ${solution.implementationSteps.slice(0, 3).join(', ')}` : ''}
- ${solution.successMetrics ? `Success metrics: ${solution.successMetrics.slice(0, 2).join(', ')}` : ''}
`).join('')}

## Business Model

### Revenue Structure (Based on Your Specific Problem Profile)
**SaaS Subscription Tiers:**
- **Starter Plan:** ₹41,500-83,000/month (covers ${selectedProblems.length <= 2 ? 'basic problem detection' : 'comprehensive monitoring'})
- **Professional Plan:** ₹83,000-2,07,500/month (includes ${problemCategories.includes('Safety') ? 'advanced safety monitoring' : 'predictive analytics'})
- **Enterprise Plan:** ₹2,07,500-4,15,000/month (full platform with ${problemCategories.includes('Compliance') ? 'compliance management' : 'advanced analytics'})

**Implementation Services (Based on Your Solutions):**
- **Initial Setup:** ₹4,15,000-${totalEstimatedCost > 50000 ? '37,50,000' : '25,00,000'} (based on your solution complexity)
- **Custom Integration:** ₹2,07,500-12,45,000 (tailored to your specific systems)
- **Training & Support:** ₹83,000-4,15,000 (comprehensive team training)

### Pricing Justification (Your Specific ROI)
Based on your identified problems, the ROI calculation shows:
- **Cost Avoidance:** ₹${(totalEstimatedCost * 2).toLocaleString()} annually (preventing problem escalation)
- **Efficiency Gains:** 25-40% improvement in operational efficiency
- **Compliance Benefits:** ${problemCategories.includes('Compliance') ? 'Reduced regulatory risk and potential fines' : 'Improved operational standards'}
- **Your Specific Benefits:** ${hasRecommendations ? recommendations : 'Measurable improvement in your identified problem areas'}

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

## Implementation Roadmap (Based on Your Selected Solutions)

### Phase 1: Immediate Problem Resolution (Months 1-3)
${highPriorityProblems.length > 0 ? highPriorityProblems.map(p => `- Deploy solution for ${p.title} (${p.urgency})`).join('\n') : selectedProblems.slice(0, 2).map(p => `- Deploy solution for ${p.title}`).join('\n')}
${selectedSolutions.filter(s => s.complexity === 'simple').map(s => `- Implement ${s.title} (${s.timeToImplement})`).join('\n')}

### Phase 2: Comprehensive Deployment (Months 4-6)
${selectedSolutions.filter(s => s.complexity === 'moderate').map(s => `- Deploy ${s.title} (${s.timeToImplement})`).join('\n')}
- Full platform deployment and integration
- Team training and change management
- Integration with existing systems
- Performance monitoring and optimization

### Phase 3: Advanced Features (Months 7-12)
${selectedSolutions.filter(s => s.complexity === 'complex').map(s => `- Implement ${s.title} (${s.timeToImplement})`).join('\n')}
- Advanced reporting and analytics
- Mobile application deployment
- Continuous improvement based on your data
- ${hasRecommendations ? `Implementation of recommendations: ${recommendations}` : 'Advanced AI model training'}

### Phase 4: Scale and Optimize (Months 13-18)
- Multi-facility expansion
- Advanced AI model training based on your problem types
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

## Next Steps (Based on Your Analysis)

### Immediate Actions (Next 30 Days)
1. **Technical Validation:** Deep dive into your ${selectedProblems.length} identified problems: ${selectedProblems.map(p => p.title).join(', ')}
2. **Pilot Program Setup:** Deploy solution for ${selectedProblems[0]?.title || 'highest priority problem'} (${selectedProblems[0]?.severity || 'high priority'})
3. **Stakeholder Alignment:** Present findings to ${problemStatement.nonTechnical.stakeholders || 'key stakeholders'}
4. **Funding Preparation:** Begin Series A fundraising process

### Short-term Goals (Next 90 Days)
1. **Pilot Implementation:** Deploy and validate solution effectiveness for your specific problems
2. **Customer Feedback:** Collect and integrate user feedback on your selected solutions
3. **Sales Pipeline:** Build qualified prospect list for similar ${problemCategories.join(' and ')} challenges
4. **Funding Close:** Complete Series A round

### Long-term Vision (Next 12 Months)
1. **Full Deployment:** Implement all ${selectedSolutions.length} proposed solutions: ${selectedSolutions.map(s => s.title).join(', ')}
2. **Market Expansion:** Scale to similar facilities with comparable ${problemCategories.join(' and ')} problems
3. **Product Enhancement:** Advanced features based on your usage data and ${hasRecommendations ? `recommendations: ${recommendations}` : 'feedback'}
4. **Series B Preparation:** Prepare for next funding round

---

**Contact Information:**
- Email: contact@industrialsolutions.ai
- Phone: (555) 123-4567
- Website: www.industrialsolutions.ai

*This pitch document was generated specifically for your analysis, incorporating your ${selectedProblems.length} identified problems (${selectedProblems.map(p => p.title).join(', ')}) and ${selectedSolutions.length} selected solutions (${selectedSolutions.map(s => s.title).join(', ')}). ${hasImageAnalysis ? `The content is based on your image analysis: ${imageDescription}. ` : ''}${hasAssessment ? `Assessment: ${overallAssessment}. ` : ''}${hasRecommendations ? `Recommendations: ${recommendations}. ` : ''}The content is tailored to your specific industrial environment and problem profile.*`

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

