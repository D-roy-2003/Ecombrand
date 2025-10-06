import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    console.log('Admin orders API called')
    const token = request.cookies.get('admin-token')?.value
    
    if (!token) {
      console.log('No admin token found')
      return NextResponse.json(
        { error: 'Unauthorized - No admin token' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN') {
      console.log('Invalid token or not admin role:', decoded)
      return NextResponse.json(
        { error: 'Unauthorized - Invalid admin token' },
        { status: 401 }
      )
    }

    console.log('Admin authenticated, fetching all orders...')

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50') // Higher limit for admin
    const skip = (page - 1) * limit
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    // Build where clause for filtering
    let whereClause: any = {}
    
    if (status && status !== 'ALL') {
      whereClause.status = status
    }

    if (search) {
      whereClause.OR = [
        {
          id: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          user: {
            name: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          user: {
            email: {
              contains: search,
              mode: 'insensitive'
            }
          }
        }
      ]
    }

    console.log('Fetching orders with where clause:', whereClause)

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
              address: true,
              city: true,
              state: true,
              zipCode: true,
              country: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  imageUrls: true,
                  category: true,
                  price: true,
                  stock: true
                }
              }
            }
          }
        }
      }),
      prisma.order.count({ where: whereClause })
    ])

    console.log(`Found ${orders.length} orders out of ${total} total`)

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      summary: {
        totalOrders: total,
        currentPage: orders.length
      }
    })
  } catch (error) {
    console.error('Admin orders fetch error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
