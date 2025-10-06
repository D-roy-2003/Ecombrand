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

    // Get analytics data sequentially to avoid connection pool exhaustion
    console.log('Fetching analytics data sequentially...')
    
    // Basic counts first
    console.log('Fetching basic counts...')
    const totalUsers = await prisma.user.count()
    const totalOrders = await prisma.order.count()
    const totalRevenue = await prisma.order.aggregate({
      _sum: { totalPrice: true }
    })
    
    console.log('Basic counts completed:', { totalUsers, totalOrders, revenue: totalRevenue._sum.totalPrice })
    
    // Orders this week
    const ordersThisWeek = await prisma.order.count({
      where: {
        createdAt: {
          gte: oneWeekAgo
        }
      }
    })
    
    // Orders last week
    const ordersLastWeek = await prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(oneWeekAgo.getTime() - 7 * 24 * 60 * 60 * 1000),
          lt: oneWeekAgo
        }
      }
    })
    
    console.log('Weekly order data completed:', { ordersThisWeek, ordersLastWeek })
    
    // Revenue data
    console.log('Fetching revenue data...')
    const revenueThisWeek = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: oneWeekAgo
        }
      },
      _sum: { totalPrice: true }
    })
    
    const revenueLastWeek = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: new Date(oneWeekAgo.getTime() - 7 * 24 * 60 * 60 * 1000),
          lt: oneWeekAgo
        }
      },
      _sum: { totalPrice: true }
    })
    
    // Monthly data
    console.log('Fetching monthly data...')
    const ordersThisMonth = await prisma.order.count({
      where: {
        createdAt: {
          gte: oneMonthAgo
        }
      }
    })
    
    const ordersLastMonth = await prisma.order.count({
      where: {
        createdAt: {
          gte: twoMonthsAgo,
          lt: oneMonthAgo
        }
      }
    })
    
    const revenueThisMonth = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: oneMonthAgo
        }
      },
      _sum: { totalPrice: true }
    })
    
    const revenueLastMonth = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: twoMonthsAgo,
          lt: oneMonthAgo
        }
      },
      _sum: { totalPrice: true }
    })
    
    // Product growth data
    console.log('Fetching product growth data...')
    const productsThisMonth = await prisma.product.count({
      where: {
        createdAt: {
          gte: oneMonthAgo
        }
      }
    })
    
    const productsLastMonth = await prisma.product.count({
      where: {
        createdAt: {
          gte: twoMonthsAgo,
          lt: oneMonthAgo
        }
      }
    })
    
    // Recent orders (simplified)
    console.log('Fetching recent orders...')
    const recentOrders = await prisma.order.findMany({
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
    })
    
    // Top selling products
    console.log('Fetching top selling products...')
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      _sum: {
        quantity: true
      },
      _count: {
        productId: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    })

    console.log('Top products raw data:', topProducts)

    // Get product details for top selling products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: {
            id: true,
            name: true,
            price: true,
            imageUrls: true,
            category: true
          }
        })
        
        return {
          productId: item.productId,
          product,
          _sum: {
            quantity: item._sum.quantity || 0
          },
          orderCount: item._count.productId
        }
      })
    )

    console.log('Top products with details:', topProductsWithDetails)

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
      dailyStats: []
    }

    console.log('Analytics response prepared:', {
      totalUsers,
      totalOrders,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      recentOrdersCount: recentOrders.length,
      topProductsCount: topProductsWithDetails.length
    })

    // Cleanup connection
    await prisma.$disconnect()
    
    return NextResponse.json(analyticsResponse)
  } catch (error) {
    console.error('Analytics fetch error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })
    
    // Cleanup connection on error
    try {
      await prisma.$disconnect()
    } catch (disconnectError) {
      console.error('Error disconnecting prisma:', disconnectError)
    }
    
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
