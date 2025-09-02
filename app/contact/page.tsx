"use client"

import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { motion } from 'framer-motion'
import { Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")

  const handleSend = () => {
    const to = "info@edgyfashion.com"
    const subject = encodeURIComponent(`Contact from ${name || 'Customer'}`)
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)
    const href = `mailto:${to}?subject=${subject}&body=${body}`
    window.location.href = href
  }

  return (
    <main className="min-h-screen bg-black">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-28 md:pt-32 pb-16 border-b border-primary-800 bg-gradient-to-b from-black via-primary-900/40 to-black">
        <div className="container-custom px-4">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
              <span className="text-white">CONTACT</span> <span className="text-gradient">US</span>
            </h1>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed">
              Questions, collaborations, or feedback—drop us a line.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 card"
            >
              <h2 className="text-2xl font-semibold text-white mb-6">Send us a message</h2>
              <div className="space-y-5">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Name</label>
                  <input
                    className="input-field w-full"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email</label>
                  <input
                    className="input-field w-full"
                    placeholder="you@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Message</label>
                  <textarea
                    className="input-field w-full min-h-[140px]"
                    placeholder="Tell us what’s on your mind..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
                <div className="pt-2">
                  <button onClick={handleSend} className="btn-primary">Send Email</button>
                </div>
              </div>
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="card"
            >
              <h2 className="text-2xl font-semibold text-white mb-6">Contact info</h2>
              <div className="space-y-5 text-gray-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-accent-400 mt-0.5" />
                  <div>
                    123 Street Style Ave
                    <br /> Urban District, City 12345
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-accent-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-accent-400" />
                  <a href="mailto:info@edgyfashion.com" className="hover:text-accent-400 transition-colors">info@edgyfashion.com</a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}


