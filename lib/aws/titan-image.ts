import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { bedrockClient, AWS_MODELS } from './bedrock-client'

export interface TitanImageRequest {
  prompt: string
  negativePrompt?: string
  width?: number
  height?: number
  cfgScale?: number
  seed?: number
}

export interface TitanImageResponse {
  imageBase64: string
  seed: number
  inputTokens: number
  outputTokens: number
}

export async function generateImageWithTitan(
  request: TitanImageRequest
): Promise<TitanImageResponse> {
  const payload = {
    taskType: 'TEXT_IMAGE',
    textToImageParams: {
      text: request.prompt,
      negativeText: request.negativePrompt || ''
    },
    imageGenerationConfig: {
      numberOfImages: 1,
      width: request.width || 512,
      height: request.height || 512,
      cfgScale: request.cfgScale || 8.0,
      seed: request.seed || Math.floor(Math.random() * 1000000)
    }
  }

  const command = new InvokeModelCommand({
    modelId: AWS_MODELS.TITAN_IMAGE_G1,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(payload),
  })

  try {
    console.log('Sending request to Titan Image Generator...')
    console.log('Model ID:', AWS_MODELS.TITAN_IMAGE_G1)
    console.log('Payload:', JSON.stringify(payload, null, 2))

    const response = await bedrockClient.send(command)
    console.log('Response status:', response.$metadata.httpStatusCode)

    const responseBody = JSON.parse(new TextDecoder().decode(response.body))
    console.log('Response body keys:', Object.keys(responseBody))

    // Titan returns images in a different format than Nova
    const imageData = responseBody.images?.[0] || ''

    if (!imageData) {
      console.error('No image data received from Titan')
      throw new Error('No image data received from Titan Image Generator')
    }

    return {
      imageBase64: imageData,
      seed: responseBody.seed || payload.imageGenerationConfig.seed,
      inputTokens: responseBody.inputTokenCount || 0,
      outputTokens: responseBody.outputTokenCount || 0,
    }
  } catch (error) {
    console.error('Titan Image generation error:', error)

    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }

    throw new Error(`Failed to generate image with Titan: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Convenience function for cosmetics product visualization using Titan
export async function generateCosmeticsProductImageWithTitan(
  productName: string,
  description: string,
  keyIngredients: string[],
  language: 'en' | 'th' = 'en'
): Promise<TitanImageResponse> {
  const ingredientsText = keyIngredients.join(', ')

  const prompt = language === 'th'
    ? `ภาพผลิตภัณฑ์เครื่องสำอางคุณภาพสูงสำหรับ "${productName}". ${description}. ส่วนผสมหลัก: ${ingredientsText}. ภาพสไตล์มืออาชีพ สะอาด มีแบรนด์หรู บรรจุภัณฑ์ที่สวยงาม แสงที่นุ่มนวล พื้นหลังสีขาวสะอาด`
    : `High-quality cosmetic product image for "${productName}". ${description}. Key ingredients: ${ingredientsText}. Professional, clean styling, luxury branding, elegant packaging, soft lighting, clean white background`

  const negativePrompt = language === 'th'
    ? 'คุณภาพต่ำ เบลอ บิดเบี้ยว ข้อความ โลโก้ ลายน้ำ'
    : 'low quality, blurry, distorted, text, logos, watermarks'

  return generateImageWithTitan({
    prompt,
    negativePrompt,
    width: 768,
    height: 768,
    cfgScale: 8.0
  })
}