'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Instagram, Twitter, Facebook, Mail, MapPin, Phone } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#160f22] border-t border-[#2a1f3b]">
      <div className="container-custom px-4 sm:px-6 lg:px-8">
        <div className="py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-8">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-1"
            >
              <div className="mb-4 sm:mb-6">
                <span className="text-xl sm:text-2xl font-display font-bold bg-gradient-to-r from-fuchsia-400 to-violet-500 bg-clip-text text-transparent">ROT</span>
                <span className="text-lg sm:text-xl font-display font-medium text-white ml-2">KIT</span>
              </div>
              <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
                Defy convention. Embrace the edge. Streetwear for the urban rebel who dares to be different.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-fuchsia-400 transition-colors duration-300" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-fuchsia-400 transition-colors duration-300" aria-label="Twitter">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-fuchsia-400 transition-colors duration-300" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-6">QUICK LINKS</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/shop" className="text-gray-300 hover:text-fuchsia-400 transition-colors duration-300">
                    Shop All
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=tshirts" className="text-gray-300 hover:text-fuchsia-400 transition-colors duration-300">
                    T-Shirts
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=hoodies" className="text-gray-300 hover:text-fuchsia-400 transition-colors duration-300">
                    Hoodies
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=pants" className="text-gray-300 hover:text-fuchsia-400 transition-colors duration-300">
                    Pants
                  </Link>
                </li>
                <li>
                  <Link href="/shop?category=shoes" className="text-gray-300 hover:text-fuchsia-400 transition-colors duration-300">
                    Shoes
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-6">SUPPORT</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/contact" className="text-gray-300 hover:text-fuchsia-400 transition-colors duration-300">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="text-gray-300 hover:text-fuchsia-400 transition-colors duration-300">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="text-gray-300 hover:text-fuchsia-400 transition-colors duration-300">
                    Returns
                  </Link>
                </li>
                <li>
                  <Link href="/size-guide" className="text-gray-300 hover:text-fuchsia-400 transition-colors duration-300">
                    Size Guide
                  </Link>
                </li>
                <li>
                  <Link href="/help" className="text-gray-300 hover:text-fuchsia-400 transition-colors duration-300">
                    FAQ
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-6">CONTACT</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-fuchsia-400 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-300 text-sm">
                    123 Street Style Ave<br />
                    Urban District, City 12345
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-fuchsia-400" />
                  <p className="text-gray-300 text-sm">+1 (555) 123-4567</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-fuchsia-400" />
                  <p className="text-gray-300 text-sm">intellicraft.solutions25@gmail.com</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-[#2a1f3b] py-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 ROT KIT. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-fuchsia-400 transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-fuchsia-400 transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/admin" className="text-gray-400 hover:text-fuchsia-400 transition-colors duration-300">
                Admin
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
