
import { NextRequest, NextResponse } from 'next/server'
import { generateProductConcepts } from '../../../lib/services/text-generation'
import { generateProductImage } from '../../../lib/services/image-generation'
import SessionStorage from '../../../lib/session-storage'

export async function POST(request: NextRequest) {
  console.log('=== Generate API Route Called ===')

  try {
    const body = await request.json()
    console.log('Request body:', JSON.stringify(body, null, 2))

    const { productSpec, language = 'en' } = body

    if (!productSpec?.trim()) {
      console.log('Missing product specification')
      return NextResponse.json(
        { error: 'Product specification is required' },
        { status: 400 }
      )
    }

    console.log('Generating product concepts...')
    console.log('Product spec:', productSpec.trim())
    console.log('Language:', language)

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
            prompt: `A professional cosmetic product image of ${concept.productName}. ${concept.description}. Key ingredients: ${concept.keyIngredients.join(', ')}. High quality, professional lighting, cosmetic product photography.`,
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
    const finalConcepts = conceptsWithImages
      .map(result => result.status === 'fulfilled' ? result.value : null)
      .filter((concept): concept is NonNullable<typeof concept> => concept !== null)

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
        images: 'titan-image' // Default image provider
      }
    })

  } catch (error) {
    console.error('=== Generation Error ===')
    console.error('Error:', error)

    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }

    // Return more detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Failed to generate product concepts. Please try again.',
        debug: {
          message: errorMessage,
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    )
  }
}
