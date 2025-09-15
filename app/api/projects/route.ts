import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getUserProjects, createProject } from '@/lib/db/schema'

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
    if (user instanceof NextResponse) {
      return user // Return error response
    }

    const projects = await getUserProjects(user.id)

    return NextResponse.json({
      success: true,
      projects
    })

  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: 'Failed to get projects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request)
    
    if (user instanceof NextResponse) {
      return user // Return error response
    }

    const { name, description, problemStatement } = await request.json()

    if (!name || !problemStatement) {
      return NextResponse.json(
        { error: 'Name and problem statement are required' },
        { status: 400 }
      )
    }

    const project = await createProject(
      user.id,
      name,
      description || '',
      problemStatement
    )

    return NextResponse.json({
      success: true,
      project
    })

  } catch (error) {
    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    )
  }
}
