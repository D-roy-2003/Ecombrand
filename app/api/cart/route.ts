import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('user-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { productId, quantity } = await request.json()

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Product ID and valid quantity are required' },
        { status: 400 }
      )
    }

    // Check if product exists and calculate available stock
    const product = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Calculate reserved stock (items in carts)
    const reservedStock = await prisma.cart.aggregate({
      where: { productId: productId },
      _sum: { quantity: true }
    })

    const totalReserved = reservedStock._sum.quantity || 0
    const availableStock = product.stock - totalReserved

    if (availableStock < quantity) {
      return NextResponse.json(
        { error: `Only ${availableStock} items available in stock` },
        { status: 400 }
      )
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cart.findUnique({
      where: {
        userId_productId: {
          userId: decoded.id,
          productId: productId
        }
      }
    })

    if (existingCartItem) {
      // Update quantity and timestamp
      const newQuantity = existingCartItem.quantity + quantity
      
      if (product.stock < newQuantity) {
        return NextResponse.json(
          { error: 'Insufficient stock for requested quantity' },
          { status: 400 }
        )
      }

      const updatedCartItem = await prisma.cart.update({
        where: {
          userId_productId: {
            userId: decoded.id,
            productId: productId
          }
        },
        data: {
          quantity: newQuantity,
          addedAt: new Date()
        }
      })

      return NextResponse.json(updatedCartItem)
    } else {
      // Create new cart item
      const cartItem = await prisma.cart.create({
        data: {
          userId: decoded.id,
          productId: productId,
          quantity: quantity
        }
      })

      return NextResponse.json(cartItem)
    }
  } catch (error) {
    console.error('Cart operation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('user-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    // Clean expired cart items first
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    await prisma.cart.deleteMany({
      where: {
        addedAt: {
          lt: twoHoursAgo
        }
      }
    })

    // Get current cart items with product details
    const cartItems = await prisma.cart.findMany({
      where: {
        userId: decoded.id
      },
      include: {
        product: true
      }
    })

    return NextResponse.json({ cartItems })
  } catch (error) {
    console.error('Cart fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get('user-token')?.value
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }

    const { productId } = await request.json()

    if (productId) {
      // Remove specific item
      await prisma.cart.delete({
        where: {
          userId_productId: {
            userId: decoded.id,
            productId: productId
          }
        }
      })
    } else {
      // Clear entire cart
      await prisma.cart.deleteMany({
        where: {
          userId: decoded.id
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Cart delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
