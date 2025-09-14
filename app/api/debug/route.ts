import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      BEDROCK_REGION: process.env.BEDROCK_REGION || 'not-set',
      BEDROCK_ACCESS_KEY_ID: process.env.BEDROCK_ACCESS_KEY_ID ? 'set' : 'not-set',
      BEDROCK_SECRET_ACCESS_KEY: process.env.BEDROCK_SECRET_ACCESS_KEY ? 'set' : 'not-set',
    },
    message: 'Debug endpoint working correctly'
  })
}