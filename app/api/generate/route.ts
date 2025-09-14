
import { NextRequest, NextResponse } from 'next/server'
import { generateProductConcepts } from '../../../lib/services/text-generation'
import { generateProductImage } from '../../../lib/services/image-generation'
import SessionStorage from '../../../lib/session-storage'

export async function POST(request: NextRequest) {
  try {
    const { productSpec, language = 'en' } = await request.json()

    if (!productSpec?.trim()) {
      return NextResponse.json(
        { error: 'Product specification is required' },
        { status: 400 }
      )
    }

    // Generate AI-powered product concepts using Nova Lite
    const textResult = await generateProductConcepts({
      productSpec: productSpec.trim(),
      language,
      maxConcepts: 4
    })

    if (!textResult.concepts || textResult.concepts.length === 0) {
      throw new Error('No concepts were generated')
    }

    // Generate images for each concept using Nova Canvas
    const conceptsWithImages = await Promise.allSettled(
      textResult.concepts.map(async (concept) => {
        try {
          const imageResult = await generateProductImage({
            productName: concept.productName,
            description: concept.description,
            keyIngredients: concept.keyIngredients,
            language,
            width: 512,
            height: 512
          })

          return {
            ...concept,
            imageBase64: imageResult.imageBase64
          }
        } catch (imageError) {
          console.error(`Image generation failed for ${concept.productName}:`, imageError)
          // Return concept without image if image generation fails
          return concept
        }
      })
    )

    // Extract successful results
    const finalConcepts = conceptsWithImages.map(result =>
      result.status === 'fulfilled' ? result.value : null
    ).filter(Boolean)

    // Store in session storage
    const submissionId = SessionStorage.storeSubmission(
      productSpec.trim(),
      finalConcepts,
      language
    )

    return NextResponse.json({
      submissionId,
      message: 'Concepts generated successfully',
      count: finalConcepts.length,
      provider: {
        text: textResult.provider,
        images: 'nova-canvas'
      }
    })

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate product concepts. Please try again.' },
      { status: 500 }
    )
  }
}
