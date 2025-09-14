import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime'

// Validate required environment variables
const validateEnvironment = () => {
  const required = ['BEDROCK_ACCESS_KEY_ID', 'BEDROCK_SECRET_ACCESS_KEY']
  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing.join(', '))
    throw new Error(`Missing AWS Bedrock credentials: ${missing.join(', ')}`)
  }

  console.log('AWS Bedrock environment check passed')
  console.log('Region:', process.env.BEDROCK_REGION || 'us-east-1')
  console.log('Access Key ID available:', !!process.env.BEDROCK_ACCESS_KEY_ID)
  console.log('Secret Access Key available:', !!process.env.BEDROCK_SECRET_ACCESS_KEY)
}

// Validate environment on module load
validateEnvironment()

// Create a Bedrock Runtime client for US East 1 (required for Bedrock models)
export const bedrockClient = new BedrockRuntimeClient({
  region: process.env.BEDROCK_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.BEDROCK_ACCESS_KEY_ID!,
    secretAccessKey: process.env.BEDROCK_SECRET_ACCESS_KEY!,
  },
})

// Available AWS models
export const AWS_MODELS = {
  // Nova models
  NOVA_LITE: 'amazon.nova-lite-v1:0',
  NOVA_CANVAS: 'amazon.nova-canvas-v1:0',
  // Titan models
  TITAN_TEXT_G1_EXPRESS: 'amazon.titan-text-express-v1',
  TITAN_IMAGE_G1: 'amazon.titan-image-generator-v1',
  // Claude models (if needed)
  CLAUDE_3_SONNET: 'anthropic.claude-3-sonnet-20240229-v1:0',
} as const

// Legacy Nova models export for backward compatibility
export const NOVA_MODELS = {
  LITE: AWS_MODELS.NOVA_LITE,
  CANVAS: AWS_MODELS.NOVA_CANVAS
} as const

export type AWSModel = typeof AWS_MODELS[keyof typeof AWS_MODELS]
export type NovaModel = typeof NOVA_MODELS[keyof typeof NOVA_MODELS]