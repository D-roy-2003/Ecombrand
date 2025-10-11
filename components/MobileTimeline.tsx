'use client'

import { motion } from 'framer-motion'

interface TimelineItem {
  year: string
  title: string
  desc: string
  color: string
  bgColor: string
}

const timelineData: TimelineItem[] = [
  { 
    year: '2019', 
    title: 'GENESIS', 
    desc: 'Born in a garage with nothing but rebellion and a screen printer.',
    color: 'fuchsia',
    bgColor: 'bg-fuchsia-500'
  },
  { 
    year: '2021', 
    title: 'EXPANSION', 
    desc: 'Worldwide chaos. From underground to everywhere.',
    color: 'purple',
    bgColor: 'bg-purple-500'
  },
  { 
    year: '2024', 
    title: 'REVOLUTION', 
    desc: 'Sustainable rebellion. Even punks care about the planet.',
    color: 'cyan',
    bgColor: 'bg-cyan-500'
  },
]

export default function MobileTimeline() {
  return (
    <div className="block sm:hidden relative">
      {/* Mobile Central Line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-fuchsia-500 to-cyan-500" />
      
      <div className="space-y-8">
        {timelineData.map((item, idx) => (
          <motion.div
            key={item.year}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            className="relative flex items-start"
          >
            {/* Timeline Node */}
            <motion.div 
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.2 + 0.3 }}
              className={`relative z-10 w-6 h-6 ${item.bgColor} rounded-full border-4 border-black flex-shrink-0 mt-2`}
            >
              <div className={`absolute inset-0 ${item.bgColor} rounded-full animate-ping opacity-75`} />
            </motion.div>
            
            {/* Branch Line */}
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: '2rem' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 + 0.4 }}
              className={`h-0.5 ${item.bgColor} mt-3 -ml-3`}
            />
            
            {/* Content Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.2 + 0.5 }}
              className="ml-4 flex-1"
            >
              <div className="bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                <div className={`inline-block px-3 py-1.5 bg-${item.color}-500/20 border border-${item.color}-500/50 rounded-full mb-3`}>
                  <span className={`text-${item.color}-400 font-black text-lg`}>{item.year}</span>
                </div>
                <h3 className="text-xl font-black text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
