import { NextRequest, NextResponse } from 'next/server'
import { generateOTP, storeOTP, canResendOTP } from '@/lib/otp'
import { sendOTPEmail } from '@/lib/email'
import { prisma } from '@/lib/db'

// Ensure this route runs in a Node.js serverless function (not Edge),
// because it uses Prisma and Nodemailer which require Node APIs.
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Check if OTP can be resent (1 minute cooldown)
    const resendCheck = await canResendOTP(email)
    if (!resendCheck.canResend) {
      return NextResponse.json(
        { 
          error: `Please wait ${resendCheck.waitTime} seconds before requesting a new OTP`,
          waitTime: resendCheck.waitTime
        },
        { status: 429 }
      )
    }

    // Generate and store OTP
    const otp = generateOTP()
    await storeOTP(email, otp, 5) // 5 minutes expiration

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, name)

    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully to your email address'
    })

  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
