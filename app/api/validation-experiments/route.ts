import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { startupIdea, targetMarket, problemStatement, budget } = await request.json()
    
    if (!startupIdea) {
      return NextResponse.json(
        { error: 'Startup idea is required' },
        { status: 400 }
      )
    }

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Generate validation experiments based on startup idea
    const validationExperiments = [
      {
        id: '1',
        title: 'Customer Discovery Survey',
        description: 'Survey 100+ potential customers about their pain points and willingness to pay',
        cost: '$50',
        timeToComplete: '1 week',
        successMetrics: [
          '50+ responses',
          '80% completion rate',
          'Clear pain points identified',
          'Willingness to pay >$10/month'
        ],
        status: 'pending',
        type: 'survey',
        tools: ['Google Forms', 'Typeform', 'SurveyMonkey'],
        questions: [
          'What is your biggest challenge with [problem area]?',
          'How much time do you spend on this problem weekly?',
          'What solutions have you tried before?',
          'How much would you pay for a solution?',
          'What features would be most valuable?'
        ],
        targetAudience: targetMarket || 'College students aged 18-25',
        distribution: ['Social media', 'Campus forums', 'Student groups', 'Email lists']
      },
      {
        id: '2',
        title: 'Landing Page Test',
        description: 'Create a landing page to gauge interest and collect email signups',
        cost: '$100',
        timeToComplete: '2 weeks',
        successMetrics: [
          '5% conversion rate',
          '200+ signups',
          'Positive feedback',
          'Low bounce rate (<60%)'
        ],
        status: 'pending',
        type: 'landing_page',
        tools: ['Unbounce', 'Leadpages', 'Webflow', 'WordPress'],
        features: [
          'Clear value proposition',
          'Problem/solution fit',
          'Email capture form',
          'Social proof',
          'Call-to-action buttons'
        ],
        traffic: ['Google Ads', 'Facebook Ads', 'Campus promotion', 'Social media'],
        analytics: ['Google Analytics', 'Hotjar', 'Mixpanel']
      },
      {
        id: '3',
        title: 'Paid Ad Campaign',
        description: 'Run targeted Facebook/Instagram ads to test market demand',
        cost: '$200',
        timeToComplete: '1 week',
        successMetrics: [
          '$2 Customer Acquisition Cost',
          '10% Click-through Rate',
          'Positive ROI',
          'High engagement rate'
        ],
        status: 'pending',
        type: 'paid_ads',
        platforms: ['Facebook', 'Instagram', 'Google Ads', 'LinkedIn'],
        targeting: {
          demographics: '18-25 years old',
          interests: ['Education', 'Technology', 'Study tools'],
          locations: 'College campuses',
          behaviors: 'Active social media users'
        },
        adTypes: ['Image ads', 'Video ads', 'Carousel ads'],
        budget: '$50/day for 4 days'
      },
      {
        id: '4',
        title: 'MVP Prototype Test',
        description: 'Build a simple prototype and test with 20 potential users',
        cost: '$300',
        timeToComplete: '3 weeks',
        successMetrics: [
          '80% user satisfaction',
          '70% would recommend',
          'Clear feature requests',
          'Usage frequency >3x/week'
        ],
        status: 'pending',
        type: 'prototype',
        tools: ['Figma', 'InVision', 'Marvel', 'Adobe XD'],
        features: [
          'Core functionality only',
          'User onboarding flow',
          'Basic analytics',
          'Feedback collection'
        ],
        testing: ['User interviews', 'Usability testing', 'A/B testing'],
        participants: '20 target users'
      },
      {
        id: '5',
        title: 'Competitor Analysis',
        description: 'Analyze existing solutions and identify market gaps',
        cost: '$25',
        timeToComplete: '3 days',
        successMetrics: [
          '5+ competitors analyzed',
          'Clear differentiation identified',
          'Pricing strategy validated',
          'Feature gaps documented'
        ],
        status: 'pending',
        type: 'research',
        tools: ['Google', 'SimilarWeb', 'App Store', 'Crunchbase'],
        analysis: [
          'Feature comparison',
          'Pricing analysis',
          'User reviews',
          'Market positioning',
          'Strengths and weaknesses'
        ],
        deliverables: ['Competitor matrix', 'SWOT analysis', 'Market positioning map']
      }
    ]

    // Filter experiments based on budget
    let filteredExperiments = validationExperiments
    if (budget) {
      const budgetNum = parseInt(budget.replace(/[^0-9]/g, ''))
      filteredExperiments = validationExperiments.filter(exp => {
        const expCost = parseInt(exp.cost.replace(/[^0-9]/g, ''))
        return expCost <= budgetNum
      })
    }

    // Prioritize experiments based on startup type
    const prioritizedExperiments = filteredExperiments.map((exp, index) => ({
      ...exp,
      priority: index < 3 ? 'high' : 'medium',
      recommended: index < 3
    }))

    return NextResponse.json({
      success: true,
      experiments: prioritizedExperiments,
      totalExperiments: prioritizedExperiments.length,
      totalCost: prioritizedExperiments.reduce((sum, exp) => 
        sum + parseInt(exp.cost.replace(/[^0-9]/g, '')), 0
      ),
      timeline: '4-6 weeks for all experiments',
      recommendations: {
        startWith: prioritizedExperiments[0],
        parallel: [prioritizedExperiments[1], prioritizedExperiments[2]],
        followUp: prioritizedExperiments.slice(3)
      },
      successCriteria: {
        overall: 'At least 2 experiments show positive results',
        minimum: 'Customer survey shows 60%+ interest',
        ideal: 'Landing page converts at 5%+ and ads show positive ROI'
      }
    })

  } catch (error) {
    console.error('Error generating validation experiments:', error)
    return NextResponse.json(
      { error: 'Failed to generate validation experiments' },
      { status: 500 }
    )
  }
}

