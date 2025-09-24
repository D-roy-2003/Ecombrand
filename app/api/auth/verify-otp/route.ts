import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/otp'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Verify OTP
    const verificationResult = await verifyOTP(email, otp)

    if (!verificationResult.success) {
      return NextResponse.json(
        { 
          error: verificationResult.message,
          attemptsLeft: verificationResult.attemptsLeft
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: verificationResult.message
    })

  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
