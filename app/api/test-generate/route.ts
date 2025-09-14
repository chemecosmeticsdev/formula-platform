import { NextRequest, NextResponse } from 'next/server'
import SessionStorage from '../../../lib/session-storage'

export async function POST(request: NextRequest) {
  console.log('=== Test Generate API Called ===')

  try {
    const body = await request.json()
    console.log('Request body:', JSON.stringify(body, null, 2))

    const { productSpec, language = 'en' } = body

    if (!productSpec?.trim()) {
      console.log('Missing product specification')
      return NextResponse.json(
        { error: 'Product specification is required' },
        { status: 400 }
      )
    }

    console.log('Generating test concepts...')
    console.log('Product spec:', productSpec.trim())
    console.log('Language:', language)

    // Generate test concepts without AWS
    const testConcepts = language === 'th' ? [
      {
        productName: "สูตรทดสอบ 1",
        description: `ผลิตภัณฑ์ทดสอบที่สร้างจากข้อกำหนด: "${productSpec.substring(0, 50)}..."`,
        keyClaims: ["ทดสอบระบบ", "ใช้งานได้", "แสดงผลสำเร็จ"],
        keyIngredients: ["ส่วนผสมทดสอบ 1", "ส่วนผสมทดสอบ 2", "ส่วนผสมทดสอบ 3"]
      },
      {
        productName: "สูตรทดสอบ 2",
        description: `ผลิตภัณฑ์ทดสอบที่สองสำหรับข้อกำหนดของคุณ`,
        keyClaims: ["คุณภาพดี", "ปลอดภัย", "มีประสิทธิภาพ"],
        keyIngredients: ["วิตามินซี", "ไฮยาลูโรนิก", "เปปไทด์", "สารสกัดธรรมชาติ"]
      }
    ] : [
      {
        productName: "Test Formula 1",
        description: `A test product concept generated from your specifications: "${productSpec.substring(0, 50)}..."`,
        keyClaims: ["System Test", "Functional", "Successfully Generated"],
        keyIngredients: ["Test Ingredient A", "Test Ingredient B", "Test Ingredient C"]
      },
      {
        productName: "Test Formula 2",
        description: "A second test product concept tailored to your requirements.",
        keyClaims: ["High Quality", "Safe", "Effective"],
        keyIngredients: ["Vitamin C", "Hyaluronic Acid", "Peptides", "Natural Extracts"]
      }
    ]

    console.log('Test concepts generated:', testConcepts.length)

    // Store in session storage
    const submissionId = SessionStorage.storeSubmission(
      productSpec.trim(),
      testConcepts,
      language
    )

    console.log('Stored with submission ID:', submissionId)

    return NextResponse.json({
      submissionId,
      message: 'Test concepts generated successfully',
      count: testConcepts.length,
      provider: {
        text: 'test-mode',
        images: 'none'
      },
      test: true
    })

  } catch (error) {
    console.error('=== Test Generation Error ===')
    console.error('Error:', error)

    return NextResponse.json(
      {
        error: 'Failed to generate test concepts. Please try again.',
        debug: {
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    )
  }
}