import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedAdmin() {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash('Admin@69', 12)

    // Create admin
    const admin = await prisma.admin.upsert({
      where: { email: 'admin1@email.com' },
      update: {},
      create: {
        email: 'admin1@email.com',
        password: hashedPassword,
        firstName: 'Admin',
        lastName: 'User',
        phoneNumber: '+1234567890',
        address: '123 Admin Street',
        city: 'Admin City',
        state: 'Admin State',
        zipCode: '12345',
        country: 'Admin Country',
        bio: 'Main administrator of Edgy Fashion e-commerce platform',
        department: 'Management',
        permissions: ['all'],
        isActive: true
      }
    })

    console.log('Admin seeded successfully:', admin)
  } catch (error) {
    console.error('Error seeding admin:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedAdmin() 