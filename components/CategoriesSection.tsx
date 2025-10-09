'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const CATEGORIES = [
  {
    name: 'STREET ESSENTIALS',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=600&fit=crop&crop=center',
    count: 127,
    color: 'from-purple-600 to-fuchsia-600',
  },
  {
    name: 'URBAN DENIM',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&h=600&fit=crop&crop=center',
    count: 89,
    color: 'from-blue-600 to-indigo-600',
  },
  {
    name: 'GRAPHIC REVOLUTION',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&h=600&fit=crop&crop=center',
    count: 156,
    color: 'from-green-600 to-teal-600',
  },
  {
    name: 'MINIMAL EDGE',
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&h=600&fit=crop&crop=center',
    count: 73,
    color: 'from-gray-600 to-slate-600',
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
          className="text-center mb-10"
        >
          <h2 className="text-4xl md:text-5xl font-black uppercase mb-2">Collections</h2>
          <p className="text-gray-400 text-base md:text-lg">Curated fashion for the urban edge</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {CATEGORIES.map((category, i) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -8 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link href={`/shop?category=${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="relative overflow-hidden rounded-xl bg-[#1a1224] border border-[#2a1f3b] hover:border-white/30 transition-all duration-300 hover:scale-105">
                  <div className="aspect-[4/5] relative">
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-40`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="text-white font-semibold text-sm md:text-base">{category.name}</h3>
                    <p className="text-gray-400 text-xs md:text-sm">{category.count} items</p>
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