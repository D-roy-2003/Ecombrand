import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyOTP, deleteOTP } from '@/lib/otp'
import { generateToken } from '@/lib/auth'

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
    const isValidOTP = await verifyOTP(email, otp)
    
    if (!isValidOTP) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 401 }
      )
    }

    // Find admin by email
    const admin = await prisma.admin.findUnique({
      where: { email }
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      )
    }

    // Generate JWT token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: 'ADMIN'
    })

    // Update last login
    await prisma.admin.update({
      where: { id: admin.id },
      data: { lastLoginAt: new Date() }
    })

    // Clean up OTP after successful verification
    await deleteOTP(email)

    // Create response with token cookie
    const response = NextResponse.json({
      message: 'OTP verification successful! You are now logged in.',
      success: true,
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        role: 'ADMIN'
      }
    })

    // Set token as cookie
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    })

    return response

  } catch (error) {
    console.error('Admin forgot password verify error:', error)
    return NextResponse.json(
      { error: 'An error occurred during verification' },
      { status: 500 }
    )
  }
}
