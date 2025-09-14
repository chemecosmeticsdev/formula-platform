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
try {
  validateEnvironment()
} catch (error) {
  console.error('Environment validation failed during module load:', error)
  // Don't throw here to allow the module to load, but log the issue
}

// Create a Bedrock Runtime client with smart credential handling
const createBedrockClient = () => {
  const clientConfig: any = {
    region: process.env.BEDROCK_REGION || 'us-east-1',
  }

  // Only add explicit credentials if running locally
  const isLocalDevelopment = process.env.NODE_ENV !== 'production' ||
    (!process.env.AWS_EXECUTION_ENV && !process.env.LAMBDA_RUNTIME_DIR)

  if (process.env.BEDROCK_ACCESS_KEY_ID &&
      process.env.BEDROCK_SECRET_ACCESS_KEY &&
      isLocalDevelopment) {
    console.log('Using explicit credentials for local development')
    clientConfig.credentials = {
      accessKeyId: process.env.BEDROCK_ACCESS_KEY_ID!,
      secretAccessKey: process.env.BEDROCK_SECRET_ACCESS_KEY!,
    }
  } else {
    console.log('Using AWS default credential provider chain')
  }

  return new BedrockRuntimeClient(clientConfig)
}

export const bedrockClient = createBedrockClient()

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