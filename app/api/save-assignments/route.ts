import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate the request body
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    // Here you would normally save to a database
    // For now, we'll just simulate a successful save
    console.log('Saving assignments:', {
      teamAssignments: body.teamAssignments,
      athleteStatuses: body.athleteStatuses,
    })

    // Simulate a small delay to make it feel realistic
    await new Promise(resolve => setTimeout(resolve, 300))

    return NextResponse.json(
      { 
        success: true,
        message: 'Assignments saved successfully',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error saving assignments:', error)
    return NextResponse.json(
      { 
        error: 'Failed to save assignments',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

