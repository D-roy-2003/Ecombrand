import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { generateOTP, storeOTP } from '@/lib/otp'
import { sendAdminForgotPasswordOTPEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if admin exists
    const admin = await prisma.admin.findUnique({
      where: { email }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'No admin account found with this email address' },
        { status: 404 }
      )
    }

    // Check if admin is active
    if (!admin.isActive) {
      return NextResponse.json(
        { error: 'Admin account is deactivated' },
        { status: 401 }
      )
    }

    // Generate and store OTP
    const otp = generateOTP()
    
    try {
      await storeOTP(email, otp)
    } catch (error) {
      return NextResponse.json(
        { error: 'Please wait before requesting another OTP' },
        { status: 429 }
      )
    }

    // Send OTP email
    const emailResult = await sendAdminForgotPasswordOTPEmail(email, otp, `${admin.firstName} ${admin.lastName}`)
    
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
    console.error('Admin forgot password OTP error:', error)
    return NextResponse.json(
      { error: 'An error occurred while sending the OTP' },
      { status: 500 }
    )
  }
}
