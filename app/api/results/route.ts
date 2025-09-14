
import { NextRequest, NextResponse } from 'next/server'
import SessionStorage from '../../../lib/session-storage'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const submissionId = searchParams.get('id')

    if (!submissionId) {
      return NextResponse.json(
        { error: 'Submission ID is required' },
        { status: 400 }
      )
    }

    // Fetch submission from session storage
    const submission = SessionStorage.getSubmission(submissionId)

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found or expired' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      originalSpec: submission.productSpec,
      language: submission.language,
      results: submission.concepts.map(concept => ({
        id: concept.id,
        productName: concept.productName,
        description: concept.description,
        keyClaims: concept.keyClaims,
        keyIngredients: concept.keyIngredients,
        imageBase64: concept.imageBase64,
      })),
      createdAt: submission.createdAt,
    })

  } catch (error) {
    console.error('Results fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    )
  }
}
