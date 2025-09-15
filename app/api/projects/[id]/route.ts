import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getProjectById, saveProjectData, getProjectData } from '@/lib/db/schema'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request)
    
    if (user instanceof NextResponse) {
      return user // Return error response
    }

    const project = await getProjectById(params.id, user.id)

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Get project data for all sections
    const projectData = await getProjectData(params.id)

    return NextResponse.json({
      success: true,
      project: {
        ...project,
        data: projectData
      }
    })

  } catch (error) {
    console.error('Get project error:', error)
    return NextResponse.json(
      { error: 'Failed to get project' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request)
    
    if (user instanceof NextResponse) {
      return user // Return error response
    }

    const { section, data } = await request.json()

    if (!section || !data) {
      return NextResponse.json(
        { error: 'Section and data are required' },
        { status: 400 }
      )
    }

    // Verify project belongs to user
    const project = await getProjectById(params.id, user.id)
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Save project data
    await saveProjectData(params.id, section, data)

    return NextResponse.json({
      success: true,
      message: 'Project data saved successfully'
    })

  } catch (error) {
    console.error('Save project data error:', error)
    return NextResponse.json(
      { error: 'Failed to save project data' },
      { status: 500 }
    )
  }
}
