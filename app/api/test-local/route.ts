import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('=== Local Bedrock Test ===')

  try {
    // Test environment variables
    console.log('Environment variables:')
    console.log('BEDROCK_ACCESS_KEY_ID:', process.env.BEDROCK_ACCESS_KEY_ID ? 'SET' : 'NOT SET')
    console.log('BEDROCK_SECRET_ACCESS_KEY:', process.env.BEDROCK_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET')
    console.log('BEDROCK_REGION:', process.env.BEDROCK_REGION || 'us-east-1')

    // Test importing AWS SDK directly first
    console.log('Importing AWS SDK...')
    const { BedrockRuntimeClient, InvokeModelCommand } = await import('@aws-sdk/client-bedrock-runtime')
    console.log('✅ AWS SDK imported successfully')

    // Test creating Bedrock client
    console.log('Creating Bedrock client...')
    const bedrockClient = new BedrockRuntimeClient({
      region: process.env.BEDROCK_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.BEDROCK_ACCESS_KEY_ID!,
        secretAccessKey: process.env.BEDROCK_SECRET_ACCESS_KEY!,
      },
    })
    console.log('✅ Bedrock client created successfully')

    // Test Nova Lite directly
    console.log('Testing Nova Lite directly...')
    const payload = {
      messages: [
        { role: 'user', content: 'Say "bedrock test successful"' }
      ],
      inferenceConfig: {
        temperature: 0.1,
        max_new_tokens: 20,
        top_p: 0.95,
      },
    }

    const command = new InvokeModelCommand({
      modelId: 'amazon.nova-lite-v1:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify(payload),
    })

    console.log('Sending request to Nova Lite...')
    console.log('Payload:', JSON.stringify(payload, null, 2))

    const response = await bedrockClient.send(command)
    console.log('✅ Nova Lite responded! Status:', response.$metadata.httpStatusCode)

    const responseBody = JSON.parse(new TextDecoder().decode(response.body))
    console.log('Response body:', JSON.stringify(responseBody, null, 2))

    const content = responseBody.output?.message?.content || responseBody.content || ''

    console.log('Nova Lite test successful!')
    console.log('Response:', content)

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
        response: content,
        fullResponse: responseBody,
        httpStatus: response.$metadata.httpStatusCode
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