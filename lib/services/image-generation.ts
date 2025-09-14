// Image Generation Service - Future-proof design for easy model switching

export interface ImageGenerationRequest {
  prompt: string
  productName?: string
  description?: string
  keyIngredients?: string[]
  width?: number
  height?: number
  language?: 'en' | 'th'
}

export interface ImageGenerationResponse {
  imageBase64: string
  seed?: number
  provider: 'nova-canvas' | 'google-nanobanana'
  metadata?: any
}

export interface ImageProvider {
  name: string
  generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse>
}

// Nova Canvas Provider (Current)
class NovaCanvasProvider implements ImageProvider {
  name = 'nova-canvas'

  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    const { generateCosmeticsProductImage } = await import('../aws/nova-canvas')

    if (request.productName && request.description && request.keyIngredients) {
      // Use the cosmetics-specific function
      const result = await generateCosmeticsProductImage(
        request.productName,
        request.description,
        request.keyIngredients,
        request.language
      )

      return {
        imageBase64: result.imageBase64,
        seed: result.seed,
        provider: 'nova-canvas',
        metadata: {
          inputTokens: result.inputTokens,
          outputTokens: result.outputTokens
        }
      }
    } else {
      // Use direct prompt
      const { generateImageWithNovaCanvas } = await import('../aws/nova-canvas')
      const result = await generateImageWithNovaCanvas({
        prompt: request.prompt,
        width: request.width,
        height: request.height
      })

      return {
        imageBase64: result.imageBase64,
        seed: result.seed,
        provider: 'nova-canvas',
        metadata: {
          inputTokens: result.inputTokens,
          outputTokens: result.outputTokens
        }
      }
    }
  }
}

// Google Nanobanana Provider (Future implementation)
class GoogleNanobananaProvider implements ImageProvider {
  name = 'google-nanobanana'

  async generateImage(request: ImageGenerationRequest): Promise<ImageGenerationResponse> {
    // TODO: Implement Google Nanobanana integration
    // This will use Google's Gemini API for image generation

    // Placeholder implementation for future upgrade
    throw new Error('Google Nanobanana provider not yet implemented. Please use Nova Canvas for now.')

    // Future implementation structure:
    /*
    const { Client } = require('@google/genai') // Future dependency
    const client = new Client()

    const response = await client.models.generate_content({
      model: "gemini-2.5-flash-image-preview",
      contents: [request.prompt],
      // Additional Nanobanana-specific parameters
    })

    return {
      imageBase64: response.imageData,
      provider: 'google-nanobanana',
      metadata: response.usage
    }
    */
  }
}

// Provider Registry
const providers = {
  'nova-canvas': new NovaCanvasProvider(),
  'google-nanobanana': new GoogleNanobananaProvider(),
}

// Configuration - easily switch between providers
const DEFAULT_PROVIDER: keyof typeof providers = 'nova-canvas'

export async function generateProductImage(
  request: ImageGenerationRequest,
  providerName?: keyof typeof providers
): Promise<ImageGenerationResponse> {
  const provider = providers[providerName || DEFAULT_PROVIDER]

  if (!provider) {
    throw new Error(`Image provider '${providerName}' not found`)
  }

  try {
    return await provider.generateImage(request)
  } catch (error) {
    console.error(`Image generation failed with ${provider.name}:`, error)

    // Fallback to Nova Canvas if other provider fails
    if (providerName !== 'nova-canvas') {
      console.log('Falling back to Nova Canvas...')
      return await providers['nova-canvas'].generateImage(request)
    }

    throw error
  }
}

// Export providers for direct access if needed
export { NovaCanvasProvider, GoogleNanobananaProvider, providers }