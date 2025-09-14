import { NextRequest, NextResponse } from 'next/server'
import { bedrockClient, NOVA_MODELS } from '../../../lib/aws/bedrock-client'

export async function GET(request: NextRequest) {
  console.log('=== Testing AWS Bedrock Connection ===')

  try {
    // Test basic connection by trying to use Nova Lite model
    const { generateWithNovaLite } = await import('../../../lib/aws/nova-lite')

    console.log('Testing Nova Lite connection...')

    // Simple test message
    const response = await generateWithNovaLite({
      messages: [
        { role: 'user', content: 'Say "test successful"' }
      ],
      temperature: 0.1,
      maxTokens: 10
    })

    console.log('Response received:', {
      contentLength: response.content.length,
      inputTokens: response.inputTokens,
      outputTokens: response.outputTokens
    })

    return NextResponse.json({
      success: true,
      message: 'AWS Bedrock connection successful',
      modelId: NOVA_MODELS.LITE,
      testResponse: response.content,
      region: process.env.BEDROCK_REGION || 'us-east-1'
    })

  } catch (error) {
    console.error('=== AWS Bedrock Test Error ===')
    console.error('Error:', error)

    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
    }

    return NextResponse.json(
      {
        success: false,
        error: 'AWS Bedrock connection failed',
        debug: {
          message: error instanceof Error ? error.message : 'Unknown error',
          name: error instanceof Error ? error.name : 'Unknown',
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    )
  }
}