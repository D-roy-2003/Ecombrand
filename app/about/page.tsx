'use client'

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import MobileTimeline from '@/components/MobileTimeline'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Award, Heart, Leaf, Shield, Sparkles, Users, Skull, Zap, Moon, Star } from 'lucide-react'
import { useRef } from 'react'

export default function AboutPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const parallaxY = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <main className="min-h-screen bg-black overflow-hidden">
      <Navigation />

      {/* Hero with Distorted Typography */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-fuchsia-900/20" />
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg%3E%3Cpolygon fill="%23000" points="0,0 30,0 15,30"/%3E%3Cpolygon fill="%23111" points="30,0 60,0 45,30"/%3E%3Cpolygon fill="%23000" points="15,30 45,30 30,60"/%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: '60px 60px',
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 container-custom px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, type: "spring", stiffness: 50 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="inline-block mb-8"
            >
              <Skull className="w-16 h-16 text-purple-500 mx-auto" />
            </motion.div>
            
            <h1 className="text-5xl md:text-8xl lg:text-9xl font-display font-black mb-6">
              <motion.span
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="block text-white"
                style={{ 
                  textShadow: '3px 3px 0 #a855f7, -3px -3px 0 #00ffff',
                  letterSpacing: '-0.05em'
                }}
              >
                DEFY
              </motion.span>
              <motion.span
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="block bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent"
                style={{ 
                  textShadow: '0 0 40px rgba(168,85,247,0.5)',
                  letterSpacing: '0.1em'
                }}
              >
                EVERYTHING
              </motion.span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-gray-400 text-xl md:text-2xl max-w-2xl mx-auto font-light tracking-wide"
            >
              Alternative fashion for the fearless. Embrace chaos. Reject conformity.
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-3 bg-white rounded-full animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* Mission with Glitch Effect */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        
        <div className="relative container-custom px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-display font-black mb-4 sm:mb-6 relative">
                <span className="text-white">OUR</span>
                <br />
                <span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500"
                  style={{ WebkitTextStroke: '2px #fff' }}
                >
                  MANIFESTO
                </span>
              </h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 px-1">
                We don't just make clothes. We craft armor for the modern rebel. 
                Each piece is a statement, a middle finger to the mainstream, 
                a badge of honor for those who dare to be different.
              </p>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed px-1">
                Born from underground culture. Raised on rebellion. 
                We exist for those who refuse to blend in.
              </p>
            </motion.div>

            <motion.div
              ref={containerRef}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <motion.div
                style={{ y: parallaxY }}
                className="grid grid-cols-2 gap-3 sm:gap-4"
              >
                {[
                  { num: '2019', label: 'BORN', icon: <Zap /> },
                  { num: '50K+', label: 'REBELS', icon: <Star /> },
                  { num: '666', label: 'DESIGNS', icon: <Moon /> },
                  { num: '∞', label: 'ATTITUDE', icon: <Skull /> },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
                    className="bg-gradient-to-br from-purple-900/50 to-fuchsia-900/50 backdrop-blur-sm border border-fuchsia-500/30 p-4 sm:p-6 rounded-lg relative overflow-hidden group"
                  >
                    <div className="absolute top-1.5 sm:top-2 right-1.5 sm:right-2 text-fuchsia-500/30 group-hover:text-fuchsia-500 transition-colors">
                      {stat.icon}
                    </div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1">{stat.num}</div>
                    <div className="text-xs sm:text-sm text-fuchsia-400 uppercase tracking-widest">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values with Dark Cards */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-black to-fuchsia-900/20" />
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)',
            }}
          />
        </div>

        <div className="relative container-custom px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-center mb-8 sm:mb-16"
          >
            <span className="text-white">CORE</span>{' '}
            <span className="text-fuchsia-400">VALUES</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Sparkles className="w-10 h-10" />,
                title: 'ORIGINALITY',
                desc: 'No copies. No trends. Just raw, unfiltered creativity.',
                gradient: 'from-purple-600 to-pink-600',
              },
              {
                icon: <Shield className="w-10 h-10" />,
                title: 'QUALITY',
                desc: 'Built to survive mosh pits and midnight adventures.',
                gradient: 'from-fuchsia-600 to-purple-600',
              },
              {
                icon: <Skull className="w-10 h-10" />,
                title: 'REBELLION',
                desc: 'Question everything. Challenge norms. Stay dangerous.',
                gradient: 'from-cyan-600 to-blue-600',
              },
            ].map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-opacity rounded-2xl blur-xl"
                  style={{
                    background: `linear-gradient(135deg, ${value.gradient.replace('from-', '').replace('to-', ', ')})`
                  }}
                />
                <div className="relative bg-black/80 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-8 hover:border-white/20 transition-colors">
                  <div className={`bg-gradient-to-br ${value.gradient} w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-4 sm:mb-6`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2 sm:mb-3">{value.title}</h3>
                  <p className="text-gray-400 text-sm sm:text-base">{value.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline with Cyberpunk Style */}
      <section className="relative py-16 sm:py-32 overflow-hidden">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-center mb-12 sm:mb-20"
          >
            <span className="text-white">THE</span>{' '}
            <span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500"
            >
              EVOLUTION
            </span>
          </motion.h2>

          <div className="relative">
            {/* Central Line - Hidden on mobile */}
            <div className="hidden sm:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-fuchsia-500 to-cyan-500" />

            <div className="space-y-12 sm:space-y-20">
              {[
                { 
                  year: '2019', 
                  title: 'GENESIS', 
                  desc: 'Born in a garage with nothing but rebellion and a screen printer.',
                  color: 'fuchsia'
                },
                { 
                  year: '2021', 
                  title: 'EXPANSION', 
                  desc: 'Worldwide chaos. From underground to everywhere.',
                  color: 'purple'
                },
                { 
                  year: '2024', 
                  title: 'REVOLUTION', 
                  desc: 'Sustainable rebellion. Even punks care about the planet.',
                  color: 'cyan'
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className={`relative flex items-center ${idx % 2 === 0 ? 'justify-start' : 'justify-end'} sm:${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`w-full sm:w-1/2 ${idx % 2 === 0 ? 'sm:pr-16 sm:text-right' : 'sm:pl-16'} px-2 sm:px-0`}>
                    <div className={`inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-${item.color}-500/20 border border-${item.color}-500/50 rounded-full mb-3 sm:mb-4`}>
                      <span className={`text-${item.color}-400 font-black text-lg sm:text-xl`}>{item.year}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400 text-sm sm:text-base">{item.desc}</p>
                  </div>
                  <div className={`hidden sm:block absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-${item.color}-500 rounded-full border-4 border-black animate-pulse`} />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section with Glitch Cards */}
      <section className="relative py-16 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-900/10 to-black" />
        
        <div className="relative container-custom px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-center mb-8 sm:mb-16"
          >
            <span className="text-white">THE</span>{' '}
            <span className="text-fuchsia-400">COLLECTIVE</span>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { name: 'ALEX VOID', role: 'Creative Chaos', color: 'fuchsia' },
              { name: 'RILEY HEX', role: 'Design Demon', color: 'purple' },
              { name: 'JORDAN FLUX', role: 'Production Punk', color: 'cyan' },
              { name: 'CASEY VENOM', role: 'Community Cult Leader', color: 'green' },
            ].map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ 
                  scale: 1.05,
                  rotate: [0, -2, 2, 0],
                  transition: { duration: 0.3 }
                }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-${member.color}-500/30 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all`} />
                <div className="relative bg-black/90 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 text-center hover:border-white/30 transition-colors">
                  <div className={`w-16 h-16 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-br from-${member.color}-500 to-${member.color}-700 flex items-center justify-center mb-3 sm:mb-4 relative overflow-hidden`}>
                    <span className="text-lg sm:text-2xl font-black text-white">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white mb-1">{member.name}</h3>
                  <p className={`text-${member.color}-400 text-xs sm:text-sm uppercase tracking-wider`}>{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA with Aggressive Style */}
      <section className="relative py-16 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/30 via-fuchsia-900/30 to-purple-900/30 animate-gradient" />
        </div>
        
        <div className="relative container-custom px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h3 className="text-3xl sm:text-5xl md:text-7xl font-display font-black mb-4 sm:mb-6">
              <span className="text-white">JOIN THE</span>
              <br />
              <span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-500 to-cyan-500 animate-gradient-text"
              >
                RESISTANCE
              </span>
            </h3>
            <p className="text-base sm:text-xl text-gray-400 mb-6 sm:mb-10 px-2">
              Get exclusive drops, underground events, and join our rebellion.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-lg mx-auto px-2 sm:px-0">
              <input 
                type="email" 
                placeholder="YOUR EMAIL" 
                className="flex-1 bg-black/50 border-2 border-white/20 rounded-lg px-4 sm:px-6 py-3 sm:py-4 text-white placeholder-gray-500 focus:border-fuchsia-500 focus:outline-none transition-colors backdrop-blur-sm text-sm sm:text-base"
              />
              <button 
                type="button" 
                className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-black uppercase tracking-wider rounded-lg hover:from-purple-500 hover:to-fuchsia-500 transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                SUBMIT
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
