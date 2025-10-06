import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const revalidate = 0
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    console.log('Analytics API called')
    const token = request.cookies.get('admin-token')?.value
    
    if (!token) {
      console.log('No admin token found')
      return NextResponse.json(
        { error: 'Unauthorized - No token' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'ADMIN') {
      console.log('Invalid token or not admin role:', decoded)
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token or role' },
        { status: 401 }
      )
    }

    console.log('Admin authenticated, fetching analytics...')

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days
    const days = parseInt(period)

    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Calculate date ranges for comparisons
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

    // Test database connection first
    console.log('Testing database connection...')
    await prisma.$queryRaw`SELECT 1`
    console.log('Database connection successful')

    // Get analytics data
    console.log('Fetching analytics data...')
    const [
      totalUsers,
      totalOrders,
      totalRevenue,
      recentOrders,
      topProducts,
      // Weekly comparisons
      ordersThisWeek,
      ordersLastWeek,
      revenueThisWeek,
      revenueLastWeek,
      // Monthly comparisons
      ordersThisMonth,
      ordersLastMonth,
      revenueThisMonth,
      revenueLastMonth,
      // Product growth
      productsThisMonth,
      productsLastMonth,
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
      
      // Orders this week
      prisma.order.count({
        where: {
          createdAt: {
            gte: oneWeekAgo
          }
        }
      }),
      
      // Orders last week
      prisma.order.count({
        where: {
          createdAt: {
            gte: new Date(oneWeekAgo.getTime() - 7 * 24 * 60 * 60 * 1000),
            lt: oneWeekAgo
          }
        }
      }),
      
      // Revenue this week
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: oneWeekAgo
          }
        },
        _sum: { totalPrice: true }
      }),
      
      // Revenue last week
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: new Date(oneWeekAgo.getTime() - 7 * 24 * 60 * 60 * 1000),
            lt: oneWeekAgo
          }
        },
        _sum: { totalPrice: true }
      }),
      
      // Orders this month
      prisma.order.count({
        where: {
          createdAt: {
            gte: oneMonthAgo
          }
        }
      }),
      
      // Orders last month
      prisma.order.count({
        where: {
          createdAt: {
            gte: twoMonthsAgo,
            lt: oneMonthAgo
          }
        }
      }),
      
      // Revenue this month
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: oneMonthAgo
          }
        },
        _sum: { totalPrice: true }
      }),
      
      // Revenue last month
      prisma.order.aggregate({
        where: {
          createdAt: {
            gte: twoMonthsAgo,
            lt: oneMonthAgo
          }
        },
        _sum: { totalPrice: true }
      }),
      
      // Products added this month
      prisma.product.count({
        where: {
          createdAt: {
            gte: oneMonthAgo
          }
        }
      }),
      
      // Products added last month
      prisma.product.count({
        where: {
          createdAt: {
            gte: twoMonthsAgo,
            lt: oneMonthAgo
          }
        }
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

    console.log('Basic analytics data fetched successfully')

    // Get product details for top products
    console.log('Fetching product details for top products...')
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

    // Calculate growth percentages
    const weeklyOrderGrowth = ordersLastWeek > 0 
      ? ((ordersThisWeek - ordersLastWeek) / ordersLastWeek) * 100 
      : ordersThisWeek > 0 ? 100 : 0

    const weeklyRevenueGrowth = (revenueLastWeek._sum.totalPrice || 0) > 0 
      ? (((revenueThisWeek._sum.totalPrice || 0) - (revenueLastWeek._sum.totalPrice || 0)) / (revenueLastWeek._sum.totalPrice || 0)) * 100 
      : (revenueThisWeek._sum.totalPrice || 0) > 0 ? 100 : 0

    const monthlyOrderGrowth = ordersLastMonth > 0 
      ? ((ordersThisMonth - ordersLastMonth) / ordersLastMonth) * 100 
      : ordersThisMonth > 0 ? 100 : 0

    const monthlyRevenueGrowth = (revenueLastMonth._sum.totalPrice || 0) > 0 
      ? (((revenueThisMonth._sum.totalPrice || 0) - (revenueLastMonth._sum.totalPrice || 0)) / (revenueLastMonth._sum.totalPrice || 0)) * 100 
      : (revenueThisMonth._sum.totalPrice || 0) > 0 ? 100 : 0

    const monthlyProductGrowth = productsLastMonth > 0 
      ? ((productsThisMonth - productsLastMonth) / productsLastMonth) * 100 
      : productsThisMonth > 0 ? 100 : 0

    console.log('Calculating growth metrics...')
    
    const analyticsResponse = {
      overview: {
        totalUsers,
        totalOrders,
        totalRevenue: totalRevenue._sum.totalPrice || 0,
        monthlyGrowth: Math.round(monthlyRevenueGrowth * 100) / 100,
        weeklyOrderGrowth: Math.round(weeklyOrderGrowth * 100) / 100,
        monthlyOrderGrowth: Math.round(monthlyOrderGrowth * 100) / 100,
        monthlyRevenueGrowth: Math.round(monthlyRevenueGrowth * 100) / 100,
        monthlyProductGrowth: Math.round(monthlyProductGrowth * 100) / 100
      },
      recentOrders,
      topProducts: topProductsWithDetails,
      dailyStats: dailyStats.map(stat => ({
        date: stat.createdAt.toISOString().split('T')[0],
        revenue: stat._sum.totalPrice || 0,
        orders: stat._count.id
      }))
    }

    console.log('Analytics response prepared:', {
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      recentOrdersCount: recentOrders.length,
      topProductsCount: topProductsWithDetails.length
    })

    return NextResponse.json(analyticsResponse)
  } catch (error) {
    console.error('Analytics fetch error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    
    // Return more detailed error for debugging
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
