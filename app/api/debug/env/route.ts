import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Only allow this in development or for admin users
    const token = request.cookies.get('admin-token')?.value
    
    if (!token && process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET',
      JWT_SECRET: process.env.JWT_SECRET ? 'SET' : 'NOT SET',
      VERCEL: process.env.VERCEL ? 'true' : 'false',
      VERCEL_ENV: process.env.VERCEL_ENV || 'not set',
      timestamp: new Date().toISOString(),
      runtime: 'nodejs'
    }

    console.log('Environment check:', envCheck)

    return NextResponse.json({
      status: 'ok',
      environment: envCheck,
      message: 'Environment variables check completed'
    })
  } catch (error) {
    console.error('Environment check error:', error)
    return NextResponse.json(
      { 
        error: 'Environment check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
