import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/db'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function POST(request: NextRequest) {
  try {
    // Check for both admin and user tokens
    const adminToken = request.cookies.get('admin-token')?.value
    const userToken = request.cookies.get('user-token')?.value
    const token = adminToken || userToken
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded || (decoded.role !== 'ADMIN' && decoded.role !== 'CUSTOMER')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || (decoded.role === 'ADMIN' ? 'admin' : 'users')

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 2MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${folder}/${fileName}`

    // Upload to Supabase
    const { data, error } = await supabase.storage
      .from('edgyfashion_rotkit')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      throw new Error(`Upload failed: ${error.message}`)
    }

    const { data: { publicUrl } } = supabase.storage
      .from('edgyfashion_rotkit')
      .getPublicUrl(data.path)

    // Update the database with the new profile image URL
    if (decoded.role === 'CUSTOMER') {
      await prisma.user.update({
        where: { id: decoded.id },
        data: { profileImage: publicUrl } as any
      })
    } else if (decoded.role === 'ADMIN') {
      await prisma.admin.update({
        where: { id: decoded.id },
        data: { profileImage: publicUrl } as any
      })
    }

    return NextResponse.json({ 
      imageUrl: publicUrl,
      url: publicUrl,
      path: data.path,
      bucket: 'edgyfashion_rotkit'
    })
  } catch (error) {
    console.error('Profile upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 