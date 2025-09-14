import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { bedrockClient, NOVA_MODELS } from './bedrock-client'

export interface NovaCanvasRequest {
  prompt: string
  width?: number
  height?: number
  cfgScale?: number
  seed?: number
  steps?: number
}

export interface NovaCanvasResponse {
  imageBase64: string
  seed: number
  inputTokens: number
  outputTokens: number
}

export async function generateImageWithNovaCanvas(
  request: NovaCanvasRequest
): Promise<NovaCanvasResponse> {
  const payload = {
    textToImageParams: {
      text: request.prompt,
    },
    taskType: 'TEXT_IMAGE',
    imageGenerationConfig: {
      width: request.width || 512,
      height: request.height || 512,
      cfgScale: request.cfgScale || 7.5,
      seed: request.seed || Math.floor(Math.random() * 1000000),
      steps: request.steps || 30,
    },
  }

  const command = new InvokeModelCommand({
    modelId: NOVA_MODELS.CANVAS,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(payload),
  })

  try {
    const response = await bedrockClient.send(command)
    const responseBody = JSON.parse(new TextDecoder().decode(response.body))

    // Nova Canvas returns images in base64 format
    const imageData = responseBody.images?.[0] || responseBody.image || ''

    return {
      imageBase64: imageData,
      seed: responseBody.seed || payload.imageGenerationConfig.seed,
      inputTokens: responseBody.usage?.input_tokens || 0,
      outputTokens: responseBody.usage?.output_tokens || 0,
    }
  } catch (error) {
    console.error('Nova Canvas generation error:', error)
    throw new Error(`Failed to generate image with Nova Canvas: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Convenience function for cosmetics product visualization
export async function generateCosmeticsProductImage(
  productName: string,
  description: string,
  keyIngredients: string[],
  language: 'en' | 'th' = 'en'
): Promise<NovaCanvasResponse> {
  const ingredientsText = keyIngredients.join(', ')

  const prompt = language === 'th'
    ? `ภาพผลิตภัณฑ์เครื่องสำอางคุณภาพสูงสำหรับ "${productName}". ${description}. ส่วนผสมหลัก: ${ingredientsText}. ภาพสไตล์มืออาชีพ สะอาด มีแบรนด์หรู บรรจุภัณฑ์ที่สวยงาม แสงที่นุ่มนวล พื้นหลังสีขาวสะอาด`
    : `High-quality cosmetic product image for "${productName}". ${description}. Key ingredients: ${ingredientsText}. Professional, clean styling, luxury branding, elegant packaging, soft lighting, clean white background`

  return generateImageWithNovaCanvas({
    prompt,
    width: 768,
    height: 768,
    cfgScale: 8.0,
    steps: 40
  })
}