import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

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

    console.log('Testing database connection...')
    
    // Test basic connection
    const connectionTest = await prisma.$queryRaw`SELECT 1 as test`
    console.log('Basic connection test:', connectionTest)

    // Test simple queries
    const userCount = await prisma.user.count()
    const productCount = await prisma.product.count()
    const orderCount = await prisma.order.count()

    console.log('Database counts:', { userCount, productCount, orderCount })

    return NextResponse.json({
      status: 'ok',
      connection: 'successful',
      counts: {
        users: userCount,
        products: productCount,
        orders: orderCount
      },
      timestamp: new Date().toISOString(),
      message: 'Database connection test completed successfully'
    })
  } catch (error) {
    console.error('Database connection test error:', error)
    return NextResponse.json(
      { 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
