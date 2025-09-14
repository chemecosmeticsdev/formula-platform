import { NextRequest, NextResponse } from 'next/server'
import { bedrockClient } from '../../../lib/aws/bedrock-client'
import { ListFoundationModelsCommand } from '@aws-sdk/client-bedrock-runtime'

export async function GET(request: NextRequest) {
  console.log('=== Testing AWS Bedrock Connection ===')

  try {
    // Test basic connection by listing available models
    const command = new ListFoundationModelsCommand({})
    console.log('Sending ListFoundationModels command...')

    const response = await bedrockClient.send(command)
    console.log('Response received:', {
      httpStatusCode: response.$metadata.httpStatusCode,
      modelCount: response.modelSummaries?.length || 0
    })

    return NextResponse.json({
      success: true,
      message: 'AWS Bedrock connection successful',
      modelCount: response.modelSummaries?.length || 0,
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