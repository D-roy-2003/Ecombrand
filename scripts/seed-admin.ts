import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedAdmin() {
  try {
    console.log('🌱 Starting admin update/seeding...')
    
    // Hash the new password
    console.log('🔐 Hashing password...')
    const hashedPassword = await bcrypt.hash('Admin@69', 12)
    
    // First, clean up any duplicate admin records to avoid conflicts
    console.log('🧹 Cleaning up duplicate admin records...')
    await prisma.$executeRaw`
      DELETE FROM "admins" 
      WHERE "email" = 'admin1@email.com'
    `
    
    // Check if admin exists using raw SQL to avoid TypeScript issues
    console.log('🔍 Checking for existing admin...')
    const existingAdmins = await prisma.$queryRaw`
      SELECT * FROM "admins" 
      WHERE "email" = 'intellicraft.solutions25@gmail.com'
      OR "id" = 'cmflhi59s0000qmbca76vx244'
      LIMIT 1
    ` as any[]

    if (existingAdmins.length > 0) {
      const existingAdmin = existingAdmins[0]
      console.log('✅ Found existing admin, updating credentials...')
      console.log('📋 Current admin ID:', existingAdmin.id)
      console.log('📧 Current email:', existingAdmin.email)
      
      // Update the existing admin using raw SQL
      await prisma.$executeRaw`
        UPDATE "admins" 
        SET 
          "adminId" = 'bhogobanadmin2003',
          "email" = 'intellicraft.solutions25@gmail.com',
          "password" = ${hashedPassword},
          "firstName" = 'Admin',
          "lastName" = 'User',
          "phoneNumber" = '+91-9876543210',
          "address" = '123 Admin Street, Kolkata',
          "city" = 'Kolkata',
          "state" = 'West Bengal',
          "zipCode" = '700001',
          "country" = 'India',
          "bio" = 'Main administrator of ROT KIT e-commerce platform',
          "department" = 'Management',
          "permissions" = ARRAY['all'],
          "isActive" = true,
          "updatedAt" = NOW()
        WHERE "id" = ${existingAdmin.id}
      `
      
      console.log('✅ Admin updated successfully!')
      console.log('🆔 Admin ID: bhogobanadmin2003')
      console.log('📧 Email: intellicraft.solutions25@gmail.com')
      console.log('🔑 Password: Admin@69')
      console.log('🔢 Database ID:', existingAdmin.id)
      
      // Verify the update
      const updatedAdmin = await prisma.$queryRaw`
        SELECT "id", "adminId", "email", "firstName", "lastName" 
        FROM "admins" 
        WHERE "id" = ${existingAdmin.id}
      ` as any[]
      
      console.log('🔍 Verification:', updatedAdmin[0])
      return updatedAdmin[0]
    }

    // If no existing admin found, create a new one using raw SQL
    console.log('👤 No existing admin found, creating new admin user...')
    
    await prisma.$executeRaw`
      INSERT INTO "admins" (
        "adminId", "email", "password", "firstName", "lastName", 
        "phoneNumber", "address", "city", "state", "zipCode", "country",
        "bio", "department", "permissions", "isActive", "createdAt", "updatedAt"
      ) VALUES (
        'bhogobanadmin2003',
        'intellicraft.solutions25@gmail.com',
        ${hashedPassword},
        'Admin',
        'User',
        '+91-9876543210',
        '123 Admin Street, Kolkata',
        'Kolkata',
        'West Bengal',
        '700001',
        'India',
        'Main administrator of ROT KIT e-commerce platform',
        'Management',
        ARRAY['all'],
        true,
        NOW(),
        NOW()
      )
    `

    // Get the created admin
    const newAdmin = await prisma.$queryRaw`
      SELECT "id", "adminId", "email", "firstName", "lastName" 
      FROM "admins" 
      WHERE "email" = 'intellicraft.solutions25@gmail.com'
    ` as any[]

    console.log('✅ Admin created successfully!')
    console.log('🆔 Admin ID: bhogobanadmin2003')
    console.log('📧 Email: intellicraft.solutions25@gmail.com')
    console.log('🔑 Password: Admin@69')
    console.log('🔢 Database ID:', newAdmin[0].id)
    
    return newAdmin[0]
    
  } catch (error) {
    console.error('❌ Error seeding admin:', error)
    console.error('Error details:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the seeding
seedAdmin()
  .then(() => {
    console.log('🎉 Admin seeding completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Admin seeding failed:', error)
    process.exit(1)
  }) 