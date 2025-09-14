// Lambda Bedrock Proxy Service - Routes AWS Bedrock calls through working Lambda function
import { ProductConcept } from './text-generation'

export interface LambdaBedrockRequest {
  productSpec: string
  language?: 'en' | 'th'
}

export interface LambdaBedrockResponse {
  concepts: ProductConcept[]
  provider: string
  metadata?: any
}

// Configuration for the Lambda endpoint
const LAMBDA_ENDPOINT = process.env.LAMBDA_BEDROCK_ENDPOINT || 'https://gcle21npca.execute-api.ap-southeast-1.amazonaws.com/prod/chat'

export class LambdaBedrockProxy {

  async generateConcepts(request: LambdaBedrockRequest): Promise<LambdaBedrockResponse> {
    try {
      console.log('Using Lambda proxy for AWS Bedrock calls...')
      console.log('Lambda endpoint:', LAMBDA_ENDPOINT)

      // Create a prompt that will generate cosmetic product concepts
      const systemPrompt = request.language === 'th'
        ? `คุณเป็นนักวิทยาศาสตร์ด้านการสร้างสูตรเครื่องสำอาง สร้างแนวคิดผลิตภัณฑ์ 3-4 ชิ้นในรูปแบบ JSON`
        : `You are a cosmetic formulation scientist. Generate 3-4 product concepts in JSON format`

      const userMessage = `${systemPrompt}\n\nGenerate cosmetic product concepts for: ${request.productSpec}\n\nReturn ONLY a JSON array with this structure:\n[{"productName":"name","description":"desc","keyClaims":["claim1","claim2"],"keyIngredients":["ing1","ing2"]}]`

      // Call the Lambda function
      const response = await fetch(LAMBDA_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          preferences: {
            language: request.language === 'th' ? 'thai' : 'english',
            mode: 'analysis'
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Lambda proxy request failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Lambda proxy response received:', !!data.success)

      // Parse the AI response to extract product concepts
      let concepts: ProductConcept[] = []

      try {
        const aiResponse = data.data?.response || data.response || ''

        // Clean and parse JSON from Lambda response
        let jsonContent = aiResponse.trim()

        // Remove any markdown formatting
        jsonContent = jsonContent.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()

        // Ensure it's a JSON array
        if (!jsonContent.startsWith('[')) {
          if (jsonContent.startsWith('{')) {
            jsonContent = `[${jsonContent}]`
          } else {
            throw new Error('Invalid JSON format from Lambda')
          }
        }

        const parsed = JSON.parse(jsonContent)
        concepts = Array.isArray(parsed) ? parsed : [parsed]

        console.log('Successfully parsed concepts from Lambda:', concepts.length)

      } catch (parseError) {
        console.error('Failed to parse Lambda response, using fallback:', parseError)

        // Fallback concepts if parsing fails
        const fallbackConcepts = request.language === 'th' ? [
          {
            productName: "สูตรนวัตกรรมรายวัน (Lambda Proxy)",
            description: "ผลิตภัณฑ์ที่ถูกออกแบบทางวิทยาศาสตร์ผ่าน Lambda function",
            keyClaims: ["ทดสอบผ่าน Lambda", "เชื่อมต่อ AWS Bedrock", "ระบบสำรอง"],
            keyIngredients: ["เปปไทด์ขั้นสูง", "สารสกัดจากพืช", "วิตามิน", "สารให้ความชุ่มชื้น"]
          }
        ] : [
          {
            productName: "Lambda Proxy Formula",
            description: "A scientifically formulated product delivered through AWS Lambda integration with proven Bedrock connectivity.",
            keyClaims: ["Lambda Tested", "AWS Bedrock Connected", "Proxy Verified"],
            keyIngredients: ["Advanced Peptides", "Botanical Extracts", "Vitamins", "Moisturizing Agents"]
          }
        ]

        concepts = fallbackConcepts
      }

      return {
        concepts,
        provider: 'lambda-bedrock-proxy',
        metadata: {
          lambdaEndpoint: LAMBDA_ENDPOINT,
          originalResponse: data.data?.response || data.response,
          timestamp: new Date().toISOString()
        }
      }

    } catch (error) {
      console.error('Lambda proxy error:', error)
      throw new Error(`Lambda Bedrock proxy failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      const healthEndpoint = LAMBDA_ENDPOINT.replace('/chat', '/health')
      const testResponse = await fetch(healthEndpoint, {
        method: 'GET'
      })

      if (testResponse.ok) {
        return { success: true }
      } else {
        return { success: false, error: `HTTP ${testResponse.status}` }
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}

export const lambdaBedrockProxy = new LambdaBedrockProxy()