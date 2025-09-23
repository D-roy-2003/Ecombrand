import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    // Verify user authentication - check both user and admin tokens
    const token = request.cookies.get('user-token')?.value || request.cookies.get('admin-token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
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


    const body = await request.json()
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderData // Cart items, total, user info for creating DB order
    } = body

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification data' },
        { status: 400 }
      )
    }

    // Verify payment signature
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) {
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      )
    }

    const body_to_verify = razorpay_order_id + '|' + razorpay_payment_id
    const expected_signature = crypto
      .createHmac('sha256', keySecret)
      .update(body_to_verify.toString())
      .digest('hex')

    if (expected_signature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }

    // Payment verified successfully - now create order in database
    if (orderData && orderData.items && orderData.totalPrice) {
      try {
        // Call existing order creation API
        const orderResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `user-token=${token}` // Forward auth token
          },
          body: JSON.stringify({
            items: orderData.items,
            totalPrice: orderData.totalPrice,
            userId: decoded.id,
            paymentId: razorpay_payment_id,
            paymentOrderId: razorpay_order_id
          })
        })

        if (!orderResponse.ok) {
          const errorData = await orderResponse.json()
          console.error('Order creation failed after payment:', errorData)
          return NextResponse.json(
            { error: 'Payment successful but order creation failed. Please contact support.' },
            { status: 500 }
          )
        }

        const order = await orderResponse.json()

        return NextResponse.json({
          success: true,
          message: 'Payment verified and order created successfully',
          orderId: order.id,
          paymentId: razorpay_payment_id
        })

      } catch (orderError) {
        console.error('Order creation error after payment:', orderError)
        return NextResponse.json(
          { error: 'Payment successful but order creation failed. Please contact support.' },
          { status: 500 }
        )
      }
    }

    // If no order data provided, just verify payment
    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id
    })

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
