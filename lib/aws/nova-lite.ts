import { InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import { bedrockClient, NOVA_MODELS } from './bedrock-client'

export interface NovaLiteMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface NovaLiteRequest {
  messages: NovaLiteMessage[]
  temperature?: number
  maxTokens?: number
  topP?: number
}

export interface NovaLiteResponse {
  content: string
  inputTokens: number
  outputTokens: number
}

export async function generateWithNovaLite(
  request: NovaLiteRequest
): Promise<NovaLiteResponse> {
  const payload = {
    messages: request.messages,
    inferenceConfig: {
      temperature: request.temperature || 0.8,
      max_new_tokens: request.maxTokens || 2000,
      top_p: request.topP || 0.95,
    },
  }

  const command = new InvokeModelCommand({
    modelId: NOVA_MODELS.LITE,
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify(payload),
  })

  try {
    console.log('Sending request to Nova Lite...')
    console.log('Model ID:', NOVA_MODELS.LITE)
    console.log('Payload:', JSON.stringify(payload, null, 2))

    const response = await bedrockClient.send(command)
    console.log('Response status:', response.$metadata.httpStatusCode)

    const responseBody = JSON.parse(new TextDecoder().decode(response.body))
    console.log('Response body:', JSON.stringify(responseBody, null, 2))

    const content = responseBody.output?.message?.content || responseBody.content || ''

    if (!content) {
      console.error('No content received from Nova Lite')
      throw new Error('No content received from Nova Lite')
    }

    return {
      content,
      inputTokens: responseBody.usage?.input_tokens || 0,
      outputTokens: responseBody.usage?.output_tokens || 0,
    }
  } catch (error) {
    console.error('Nova Lite generation error:', error)

    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }

    throw new Error(`Failed to generate with Nova Lite: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Convenience function for cosmetics formula generation
export async function generateCosmeticsFormula(
  productSpec: string,
  language: 'en' | 'th' = 'en'
): Promise<NovaLiteResponse> {
  const systemPrompt = language === 'th'
    ? `คุณเป็นนักวิทยาศาสตร์ด้านการสร้างสูตรเครื่องสำอางที่เชี่ยวชาญ สร้างแนวคิดผลิตภัณฑ์ที่นวัตกรรม 3-4 ชิ้นตามข้อกำหนดของผู้ใช้

ส่งคืนเฉพาะ JSON array ของออบเจ็กต์ที่มีโครงสร้างดังนี้:
[
  {
    "productName": "ชื่อผลิตภัณฑ์ที่สร้างสรรค์",
    "description": "คำอธิบายผลิตภัณฑ์ 2-3 ประโยคที่อธิบายประโยชน์และการใช้งานที่ตั้งใจ",
    "keyClaims": ["ข้อเรียกร้อง 1", "ข้อเรียกร้อง 2", "ข้อเรียกร้อง 3"],
    "keyIngredients": ["ส่วนผสม 1", "ส่วนผสม 2", "ส่วนผสม 3", "ส่วนผสม 4"]
  }
]

ทำให้แนวคидมมีความสมจริง นวัตกรรม และเป็นไปได้ทางการค้า เน้นส่วนผสมที่เฉพาะเจาะจงและประโยชน์ทางวิทยาศาสตร์`
    : `You are an expert cosmetics formulation scientist. Generate 3-4 innovative product concepts based on user specifications.

Return ONLY a JSON array of objects with this exact structure:
[
  {
    "productName": "Creative product name",
    "description": "2-3 sentence product description explaining benefits and target use",
    "keyClaims": ["Claim 1", "Claim 2", "Claim 3"],
    "keyIngredients": ["Ingredient 1", "Ingredient 2", "Ingredient 3", "Ingredient 4"]
  }
]

Make the concepts realistic, innovative, and commercially viable. Focus on specific ingredients and scientific benefits.`

  const userPrompt = language === 'th'
    ? `สร้างแนวคิดผลิตภัณฑ์เครื่องสำอางสำหรับ: ${productSpec}`
    : `Generate cosmetic product concepts for: ${productSpec}`

  return generateWithNovaLite({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.8,
    maxTokens: 3000
  })
}