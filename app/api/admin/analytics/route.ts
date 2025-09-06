import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days
    const days = parseInt(period)

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Get analytics data
    const [
      totalUsers,
      totalOrders,
      totalRevenue,
      recentOrders,
      topProducts,
      monthlyGrowth,
      dailyStats
    ] = await Promise.all([
      // Total users
      prisma.user.count(),
      
      // Total orders
      prisma.order.count(),
      
      // Total revenue
      prisma.order.aggregate({
        _sum: { totalPrice: true }
      }),
      
      // Recent orders (last 30 days)
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: startDate
          }
        },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          items: {
            include: {
              product: {
                select: {
                  name: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),
      
      // Top selling products
      prisma.orderItem.groupBy({
        by: ['productId'],
        _sum: {
          quantity: true
        },
        orderBy: {
          _sum: {
            quantity: 'desc'
          }
        },
        take: 5
      }),
      
      // Monthly growth calculation
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 1))
          }
        },
        _sum: { totalPrice: true }
      }),
      
      // Daily stats for the period
      prisma.order.groupBy({
        by: ['createdAt'],
        where: {
          createdAt: {
            gte: startDate
          }
        },
        _sum: {
          totalPrice: true
        },
        _count: {
          id: true
        }
      })
    ])

    // Get product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            name: true,
            price: true,
            imageUrls: true
          }
        })
        return {
          ...item,
          product
        }
      })
    )

    // Calculate growth percentage
    const currentMonthRevenue = totalRevenue._sum.totalPrice || 0
    const previousMonthRevenue = monthlyGrowth._sum.totalPrice || 0
    const growthPercentage = previousMonthRevenue > 0 
      ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
      : 0

    return NextResponse.json({
      overview: {
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        monthlyGrowth: Math.round(growthPercentage * 100) / 100
      },
      recentOrders,
      topProducts: topProductsWithDetails,
      dailyStats: dailyStats.map(stat => ({
        date: stat.createdAt.toISOString().split('T')[0],
        revenue: stat._sum.totalPrice || 0,
        orders: stat._count.id
      }))
    })
  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
