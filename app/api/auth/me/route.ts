import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const token = request.cookies.get('user-token')?.value || request.cookies.get('admin-token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token found' },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Get user from database - using any type to avoid TypeScript issues
    const user: any = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        orders: {
          select: {
            id: true,
            totalPrice: true,
            status: true,
            createdAt: true,
            items: {
              select: {
                quantity: true,
                price: true,
                product: {
                  select: {
                    name: true,
                    imageUrls: true
                  }
                }
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Calculate user stats
    const totalOrders = user.orders.length
    const totalSpent = user.orders.reduce((sum: number, order: any) => sum + order.totalPrice, 0)
    
    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber || null,
        countryCode: user.countryCode || null,
        address: user.address || null,
        city: user.city || null,
        state: user.state || null,
        zipCode: user.zipCode || null,
        country: user.country || null,
        profileImage: user.profileImage || null,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      stats: {
        totalOrders,
        totalSpent,
        wishlistItems: 0, // TODO: Implement wishlist
        loyaltyPoints: Math.floor(totalSpent / 10) // Simple loyalty points calculation
      },
      recentOrders: user.orders
    })

  } catch (error) {
    console.error('Get user data error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 