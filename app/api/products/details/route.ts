import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { productIds } = await request.json()

    if (!productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { error: 'Product IDs array is required' },
        { status: 400 }
      )
    }

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      },
      select: {
        id: true,
        price: true,
        originalPrice: true
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching product details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product details' },
      { status: 500 }
    )
  }
}
