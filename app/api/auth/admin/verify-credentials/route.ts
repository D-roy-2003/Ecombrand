import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyPassword } from '@/lib/auth'
import { generateOTP, storeOTP } from '@/lib/otp'
import { sendAdminOTPEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { adminId, password } = await request.json()

    if (!adminId || !password) {
      return NextResponse.json(
        { error: 'Admin ID and password are required' },
        { status: 400 }
      )
    }

    // Find admin by adminId field (not database id)
    const admin = await prisma.$queryRaw`
      SELECT * FROM "admins" WHERE "adminId" = ${adminId} LIMIT 1
    ` as any[]
    
    const adminRecord = admin.length > 0 ? admin[0] : null

    if (!adminRecord) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      )
    }

    // Check if admin is active
    if (!adminRecord.isActive) {
      return NextResponse.json(
        { error: 'Admin account is deactivated' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, adminRecord.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid admin credentials' },
        { status: 401 }
      )
    }

    // Generate and store OTP
    const otp = generateOTP()
    
    try {
      await storeOTP(adminRecord.email, otp)
    } catch (error) {
      return NextResponse.json(
        { error: 'Please wait before requesting another OTP' },
        { status: 429 }
      )
    }

    // Send OTP email
    const emailResult = await sendAdminOTPEmail(adminRecord.email, otp, `${adminRecord.firstName} ${adminRecord.lastName}`)
    
    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: 'Credentials verified. OTP sent to your email address.',
      success: true,
      email: adminRecord.email // Return email for frontend display (masked)
    })

  } catch (error) {
    console.error('Admin credential verification error:', error)
    return NextResponse.json(
      { error: 'An error occurred while verifying credentials' },
      { status: 500 }
    )
  }
}
