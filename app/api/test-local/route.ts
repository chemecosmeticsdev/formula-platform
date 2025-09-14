import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('=== Local Bedrock Test ===')

  try {
    // Test environment variables
    console.log('Environment variables:')
    console.log('BEDROCK_ACCESS_KEY_ID:', process.env.BEDROCK_ACCESS_KEY_ID ? 'SET' : 'NOT SET')
    console.log('BEDROCK_SECRET_ACCESS_KEY:', process.env.BEDROCK_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET')
    console.log('BEDROCK_REGION:', process.env.BEDROCK_REGION || 'us-east-1')

    // Test importing the AWS services
    const { generateWithNovaLite } = await import('../../../lib/aws/nova-lite')

    console.log('Successfully imported Nova Lite service')

    // Test a simple Nova Lite call
    console.log('Testing Nova Lite with simple message...')

    const result = await generateWithNovaLite({
      messages: [
        { role: 'user', content: 'Say "bedrock test successful"' }
      ],
      temperature: 0.1,
      maxTokens: 20
    })

    console.log('Nova Lite test successful!')
    console.log('Response:', result.content)

    return NextResponse.json({
      success: true,
      message: 'Local Bedrock test successful',
      environment: {
        BEDROCK_ACCESS_KEY_ID: process.env.BEDROCK_ACCESS_KEY_ID ? 'SET' : 'NOT SET',
        BEDROCK_SECRET_ACCESS_KEY: process.env.BEDROCK_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET',
        BEDROCK_REGION: process.env.BEDROCK_REGION || 'us-east-1'
      },
      novaLite: {
        success: true,
        response: result.content,
        inputTokens: result.inputTokens,
        outputTokens: result.outputTokens
      }
    })

  } catch (error) {
    console.error('=== Local Bedrock Test Error ===')
    console.error('Error:', error)

    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)

      // Check for specific AWS errors
      if ('Code' in error) {
        console.error('AWS Error Code:', (error as any).Code)
      }
      if ('$metadata' in error) {
        console.error('AWS Metadata:', (error as any).$metadata)
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Local Bedrock test failed',
        environment: {
          BEDROCK_ACCESS_KEY_ID: process.env.BEDROCK_ACCESS_KEY_ID ? 'SET' : 'NOT SET',
          BEDROCK_SECRET_ACCESS_KEY: process.env.BEDROCK_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET',
          BEDROCK_REGION: process.env.BEDROCK_REGION || 'us-east-1'
        },
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