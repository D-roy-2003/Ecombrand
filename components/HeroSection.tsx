// HeroSection.tsx
'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, Skull, Zap, Star } from 'lucide-react'
import Link from 'next/link'
import { useRef } from 'react'

export default function HeroSection() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 300])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <>
    <section ref={containerRef} className="relative min-h-screen flex items-center justify-center overflow-hidden pb-24">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div 
          style={{ y }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#1b1327] via-[#120c18] to-[#241431]" />
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,0,0,.1) 35px, rgba(255,0,0,.1) 70px),
                repeating-linear-gradient(-45deg, transparent, transparent 35px, rgba(255,0,255,.1) 35px, rgba(255,0,255,.1) 70px)
              `,
            }}
          />
        </motion.div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-10 sm:top-20 left-4 sm:left-10 text-fuchsia-500/20"
        >
          <Skull className="w-16 h-16 sm:w-32 sm:h-32" />
        </motion.div>
        
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 text-violet-500/20"
        >
          <Star className="w-12 h-12 sm:w-24 sm:h-24" />
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div 
        style={{ opacity }}
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-block mb-8"
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-fuchsia-500/15 border border-fuchsia-500/40 rounded-full">
            <Zap className="w-4 h-4 text-fuchsia-400" />
            <span className="text-fuchsia-300 text-sm font-black uppercase tracking-wider">New Drop Live</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-none mb-4 sm:mb-6"
        >
          <span 
            className="block text-white"
            style={{ 
              textShadow: '4px 4px 0 rgba(217,70,239,0.45), -4px -4px 0 rgba(56,189,248,0.45)',
              letterSpacing: '-0.05em'
            }}
          >
            WEAR
          </span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-violet-500 to-cyan-400">
            REBELLION
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto"
        >
          Streetwear for those who refuse to conform. Join the resistance.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white font-black uppercase tracking-wider rounded-lg hover:from-fuchsia-500 hover:to-violet-500 transition-all"
            >
              Shop Now
            </motion.button>
          </Link>
          <Link href="/about">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white/20 text-white font-black uppercase tracking-wider rounded-lg hover:border-white/40 hover:bg-white/10 transition-all"
            >
              Our Story
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity }}
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <ChevronDown className="w-8 h-8 text-white/60" />
      </motion.div>

    </section>
    {/* Stats row placed after hero to avoid overlap */}
    <div className="px-4 -mt-12 mb-6">
      <div className="container-custom grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Happy Customers', value: '10k+' },
          { label: 'Unique Designs', value: '500+' },
          { label: 'Countries', value: '50+' }
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-6 bg-[#26183a]/80 backdrop-blur border border-[#3a2755] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <p className="text-sm text-gray-400">{s.label}</p>
            <p className="text-2xl font-bold mt-1 text-fuchsia-300">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}