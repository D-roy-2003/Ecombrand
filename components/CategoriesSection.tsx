'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = [
  {
    name: 'TEES',
    image: '/category-tees.jpg',
    count: 45,
    color: 'from-red-600 to-orange-600',
  },
  {
    name: 'HOODIES',
    image: '/category-hoodies.jpg',
    count: 32,
    color: 'from-purple-600 to-pink-600',
  },
  {
    name: 'JACKETS',
    image: '/category-jackets.jpg',
    count: 28,
    color: 'from-cyan-600 to-blue-600',
  },
  {
    name: 'ACCESSORIES',
    image: '/category-accessories.jpg',
    count: 56,
    color: 'from-green-600 to-teal-600',
  },
]

export default function CategoriesSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#120c18] via-[#1b1327]/40 to-[#120c18]" />

      <div className="relative container-custom px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-left mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-black uppercase">Collections</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CATEGORIES.slice(0, 2).map((category, i) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={`/shop?category=${category.name.toLowerCase()}`}>
                <div className="relative overflow-hidden rounded-xl bg-[#1a1224] border border-[#2a1f3b]">
                  <div className="aspect-[16/9] relative">
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-40`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold">{category.name}</h3>
                    <p className="text-gray-400 text-sm">{category.count} items</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}