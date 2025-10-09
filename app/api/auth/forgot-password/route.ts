import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateOTP, storeOTP, canResendOTP } from '@/lib/otp'
import { sendForgotPasswordOTPEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 404 }
      )
    }

    // Check if OTP can be resent (1 minute cooldown)
    const { canResend, waitTime } = await canResendOTP(email)
    
    if (!canResend && waitTime) {
      return NextResponse.json(
        { 
          error: `Please wait ${waitTime} seconds before requesting another OTP`,
          waitTime 
        },
        { status: 429 }
      )
    }

    // Generate and store OTP
    const otp = generateOTP()
    await storeOTP(email, otp, 5) // 5 minutes expiration

    // Send OTP email
    const emailResult = await sendForgotPasswordOTPEmail(email, otp, user.name)
    
    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Login OTP sent to your email address',
      success: true
    })

  } catch (error) {
    console.error('Forgot password OTP error:', error)
    return NextResponse.json(
      { error: 'An error occurred while sending the OTP' },
      { status: 500 }
    )
  }
}
