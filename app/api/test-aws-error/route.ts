import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('=== AWS Error Test ===')

  try {
    // Test environment variables first
    console.log('Environment check:')
    console.log('BEDROCK_ACCESS_KEY_ID:', process.env.BEDROCK_ACCESS_KEY_ID ? 'SET' : 'NOT SET')
    console.log('BEDROCK_SECRET_ACCESS_KEY:', process.env.BEDROCK_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET')
    console.log('BEDROCK_REGION:', process.env.BEDROCK_REGION || 'us-east-1')

    if (!process.env.BEDROCK_ACCESS_KEY_ID || !process.env.BEDROCK_SECRET_ACCESS_KEY) {
      return NextResponse.json({
        error: 'Missing environment variables',
        environment: {
          hasAccessKey: !!process.env.BEDROCK_ACCESS_KEY_ID,
          hasSecretKey: !!process.env.BEDROCK_SECRET_ACCESS_KEY,
          region: process.env.BEDROCK_REGION || 'us-east-1'
        }
      }, { status: 500 })
    }

    // Test AWS SDK import
    console.log('Importing AWS SDK...')
    const { BedrockRuntimeClient, InvokeModelCommand } = await import('@aws-sdk/client-bedrock-runtime')
    console.log('✅ AWS SDK imported')

    // Test client creation
    console.log('Creating Bedrock client...')
    const client = new BedrockRuntimeClient({
      region: process.env.BEDROCK_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.BEDROCK_ACCESS_KEY_ID!,
        secretAccessKey: process.env.BEDROCK_SECRET_ACCESS_KEY!,
      },
    })
    console.log('✅ Bedrock client created')

    // Test actual API call
    console.log('Testing Nova Lite API call...')
    const command = new InvokeModelCommand({
      modelId: 'amazon.nova-lite-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Say "test"' }],
        inferenceConfig: { temperature: 0.1, max_new_tokens: 5 },
      }),
    })

    const response = await client.send(command)
    console.log('✅ API call successful!')
    console.log('Status code:', response.$metadata.httpStatusCode)

    const responseBody = JSON.parse(new TextDecoder().decode(response.body))
    const content = responseBody.output?.message?.content || responseBody.content || 'No content'

    return NextResponse.json({
      success: true,
      message: 'AWS Bedrock is working correctly',
      response: content,
      httpStatus: response.$metadata.httpStatusCode
    })

  } catch (error) {
    console.error('=== AWS Error Details ===')
    console.error('Error:', error)

    // Extract detailed error information
    const errorDetails: any = {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown',
      timestamp: new Date().toISOString()
    }

    if (error instanceof Error) {
      // AWS SDK specific error properties
      if ('Code' in error) {
        errorDetails.awsCode = (error as any).Code
      }
      if ('$metadata' in error) {
        errorDetails.awsMetadata = (error as any).$metadata
      }
      if ('$response' in error) {
        errorDetails.awsResponse = {
          statusCode: (error as any).$response?.statusCode,
          headers: (error as any).$response?.headers
        }
      }
      if ('$fault' in error) {
        errorDetails.awsFault = (error as any).$fault
      }
    }

    console.error('Detailed error info:', JSON.stringify(errorDetails, null, 2))

    return NextResponse.json({
      success: false,
      error: 'AWS Bedrock test failed',
      errorDetails,
      environment: {
        hasAccessKey: !!process.env.BEDROCK_ACCESS_KEY_ID,
        hasSecretKey: !!process.env.BEDROCK_SECRET_ACCESS_KEY,
        region: process.env.BEDROCK_REGION || 'us-east-1'
      }
    }, { status: 500 })
  }
}