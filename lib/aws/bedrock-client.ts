import { BedrockRuntimeClient } from '@aws-sdk/client-bedrock-runtime'

// Create a Bedrock Runtime client for US East 1 (required for Bedrock models)
export const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_BEDROCK_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// Available AWS Nova models
export const NOVA_MODELS = {
  LITE: 'amazon.nova-lite-v1:0',
  CANVAS: 'amazon.nova-canvas-v1:0'
} as const

export type NovaModel = typeof NOVA_MODELS[keyof typeof NOVA_MODELS]