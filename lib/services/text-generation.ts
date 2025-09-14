// Text Generation Service - Centralized interface for different AI models

export interface ProductConcept {
  productName: string
  description: string
  keyClaims: string[]
  keyIngredients: string[]
}

export interface TextGenerationRequest {
  productSpec: string
  language?: 'en' | 'th'
  temperature?: number
  maxConcepts?: number
}

export interface TextGenerationResponse {
  concepts: ProductConcept[]
  provider: string
  metadata?: any
}

export interface TextProvider {
  name: string
  generateConcepts(request: TextGenerationRequest): Promise<TextGenerationResponse>
}

// Nova Lite Provider (Current)
class NovaLiteProvider implements TextProvider {
  name = 'nova-lite'

  async generateConcepts(request: TextGenerationRequest): Promise<TextGenerationResponse> {
    const { generateCosmeticsFormula } = await import('../aws/nova-lite')

    try {
      const result = await generateCosmeticsFormula(
        request.productSpec,
        request.language || 'en'
      )

      // Parse the JSON response
      let concepts: ProductConcept[] = []
      try {
        // Clean up the response content
        let content = result.content.trim()

        // Remove any markdown code blocks
        content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim()

        // Ensure it starts with [ and ends with ]
        if (!content.startsWith('[')) {
          if (content.startsWith('{')) {
            content = `[${content}]`
          } else {
            throw new Error('Invalid JSON format')
          }
        }

        const parsed = JSON.parse(content)
        concepts = Array.isArray(parsed) ? parsed : [parsed]
      } catch (parseError) {
        console.error('JSON parsing error:', parseError)

        // Fallback concepts if AI response fails
        const fallbackName = request.language === 'th'
          ? 'สูตรนวัตกรรมรายวัน'
          : 'Innovative Daily Formula'

        const fallbackDesc = request.language === 'th'
          ? 'ผลิตภัณฑ์ที่ถูกออกแบบทางวิทยาศาสตร์เพื่อตอบสนองความต้องการเฉพาะของคุณด้วยส่วนผสมที่พิสูจน์แล้วและระบบการส่งมอบขั้นสูง'
          : 'A scientifically formulated product designed to meet your specific requirements with proven ingredients and advanced delivery systems.'

        const fallbackClaims = request.language === 'th'
          ? ['ทดสอบทางคลินิก', 'ได้รับการรับรองจากแพทย์ผิวหนัง', 'ผลลัพธ์ยาวนาน']
          : ['Clinically Tested', 'Dermatologist Approved', 'Long-lasting Results']

        const fallbackIngredients = request.language === 'th'
          ? ['เปปไทด์ขั้นสูง', 'สารสกัดจากพืช', 'วิตามิน', 'สารให้ความชุ่มชื้น']
          : ['Advanced Peptides', 'Botanical Extracts', 'Vitamins', 'Moisturizing Agents']

        concepts = [{
          productName: fallbackName,
          description: fallbackDesc,
          keyClaims: fallbackClaims,
          keyIngredients: fallbackIngredients
        }]
      }

      return {
        concepts,
        provider: 'nova-lite',
        metadata: {
          inputTokens: result.inputTokens,
          outputTokens: result.outputTokens
        }
      }
    } catch (error) {
      console.error('Nova Lite generation error:', error)
      throw new Error(`Failed to generate concepts: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}

// Provider Registry
const providers = {
  'nova-lite': new NovaLiteProvider(),
}

// Configuration
const DEFAULT_PROVIDER: keyof typeof providers = 'nova-lite'

export async function generateProductConcepts(
  request: TextGenerationRequest,
  providerName?: keyof typeof providers
): Promise<TextGenerationResponse> {
  const provider = providers[providerName || DEFAULT_PROVIDER]

  if (!provider) {
    throw new Error(`Text provider '${providerName}' not found`)
  }

  return await provider.generateConcepts(request)
}

// Export providers for direct access if needed
export { NovaLiteProvider, providers }