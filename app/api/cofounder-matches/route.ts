import { NextRequest, NextResponse } from 'next/server'
import collegeProjects from '../../../data/college-projects.json'

export async function POST(request: NextRequest) {
  try {
    const { 
      problemKeywords = [],
      problemCategory = '',
      searchQuery = '',
      location = 'India'
    } = await request.json()

    // Extract all team members from college projects
    const allTeamMembers = collegeProjects.projects.flatMap(project => 
      project.team_members.map(member => ({
        ...member,
        projectTitle: project.title,
        projectDescription: project.description,
        projectCategory: project.category,
        projectTechnologies: project.technologies,
        projectKeywords: project.keywords
      }))
    )

    // Filter based on problem keywords and category
    let filteredMembers = allTeamMembers

    if (problemKeywords.length > 0 || problemCategory) {
      filteredMembers = allTeamMembers.filter(member => {
        // Check if member's project keywords match problem keywords
        const keywordMatch = problemKeywords.some(keyword => 
          member.projectKeywords.some(projectKeyword => 
            projectKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(projectKeyword.toLowerCase())
          )
        )

        // Check if member's project category matches problem category
        const categoryMatch = problemCategory && 
          member.projectCategory.toLowerCase().includes(problemCategory.toLowerCase())

        // Check if member's skills match problem keywords
        const skillMatch = problemKeywords.some(keyword =>
          member.skills.some(skill =>
            skill.toLowerCase().includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(skill.toLowerCase())
          )
        )

        return keywordMatch || categoryMatch || skillMatch
      })
    }

    // Apply search query filter
    if (searchQuery) {
      filteredMembers = filteredMembers.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Calculate match scores based on relevance
    const scoredMembers = filteredMembers.map(member => {
      let score = member.match_score || 70

      // Boost score for exact keyword matches
      if (problemKeywords.length > 0) {
        const keywordMatches = problemKeywords.filter(keyword =>
          member.projectKeywords.some(projectKeyword =>
            projectKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(projectKeyword.toLowerCase())
          )
        ).length

        score += keywordMatches * 5
      }

      // Boost score for category match
      if (problemCategory && member.projectCategory.toLowerCase().includes(problemCategory.toLowerCase())) {
        score += 10
      }

      // Boost score for skill relevance
      if (problemKeywords.length > 0) {
        const skillMatches = problemKeywords.filter(keyword =>
          member.skills.some(skill =>
            skill.toLowerCase().includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(skill.toLowerCase())
          )
        ).length

        score += skillMatches * 3
      }

      return {
        ...member,
        match_score: Math.min(score, 100)
      }
    })

    // Sort by match score
    scoredMembers.sort((a, b) => b.match_score - a.match_score)

    // Limit results
    const limitedResults = scoredMembers.slice(0, 20)

    return NextResponse.json({
      success: true,
      cofounders: limitedResults,
      totalFound: scoredMembers.length,
      searchCriteria: {
        problemKeywords,
        problemCategory,
        searchQuery,
        location
      }
    })

  } catch (error) {
    console.error('Error fetching co-founder matches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch co-founder matches' },
      { status: 500 }
    )
  }
}

// Fallback function for external API integration (SIH, Y Combinator)
async function fetchExternalCofounders(keywords: string[], category: string) {
  // This would integrate with external APIs
  // For now, returning mock data
  return [
    {
      id: 'ext_001',
      name: 'Alex Chen',
      title: 'Senior Software Engineer',
      skills: ['Python', 'Machine Learning', 'AI', 'Computer Vision'],
      experience: '5 years at Google, 2 years at startup',
      location: 'San Francisco, CA',
      availability: 'Part-time (20hrs/week)',
      matchScore: 85,
      source: 'Y Combinator Network',
      complementarySkills: ['Business Development', 'Product Management'],
      interests: ['AI', 'EdTech', 'Computer Vision'],
      portfolio: 'alexchen.dev',
      linkedin: 'linkedin.com/in/alexchen',
      email: 'alex@example.com'
    },
    {
      id: 'ext_002',
      name: 'Maria Rodriguez',
      title: 'Product Manager',
      skills: ['Product Strategy', 'User Research', 'Analytics', 'AI Integration'],
      experience: '4 years at Microsoft, led AI product launches',
      location: 'Seattle, WA',
      availability: 'Part-time (15hrs/week)',
      matchScore: 82,
      source: 'SIH Alumni Network',
      complementarySkills: ['Technical Development', 'Marketing'],
      interests: ['AI', 'Product Innovation', 'EdTech'],
      portfolio: 'mariarodriguez.pm',
      linkedin: 'linkedin.com/in/mariarodriguez',
      email: 'maria@example.com'
    }
  ]
}