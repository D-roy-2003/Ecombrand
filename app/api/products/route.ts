import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

// Ensure Node.js runtime for Prisma compatibility
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    const where: any = {}
    
    if (category && category !== 'ALL') {
      where.category = category
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.product.count({ where })
    ])

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { name, description, price, originalPrice, stock, category, imageUrls, sizes, isFeatured, discount, isActive, displayOrder } = body

    // Fix validation - check for required fields but allow empty imageUrls
    if (!name || !description || !price || !stock || !category) {
      return NextResponse.json(
        { error: 'Name, description, price, stock, and category are required' },
        { status: 400 }
      )
    }

    // Filter out empty image URLs
    const validImageUrls = Array.isArray(imageUrls) 
      ? imageUrls.filter(url => url && url.trim() !== '')
      : []

    // Ensure sizes is an array
    const validSizes = Array.isArray(sizes) ? sizes : []

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        stock: parseInt(stock),
        category,
        imageUrls: validImageUrls,
        sizes: validSizes,
        isFeatured: isFeatured || false,
        discount: discount ? parseFloat(discount) : 0,
        isActive: isActive !== undefined ? isActive : true,
        displayOrder: displayOrder ? parseInt(displayOrder) : 0
      } as any
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
