'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingBag, Menu, X, User } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const router = useRouter()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-primary-800">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-display font-bold text-gradient">
              ROT
            </span>
            <span className="text-xl font-display font-medium text-white">
              KIT
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-white hover:text-accent-400 transition-colors duration-300 font-medium"
            >
              HOME
            </Link>
            <Link 
              href="/shop" 
              className="text-white hover:text-accent-400 transition-colors duration-300 font-medium"
            >
              SHOP
            </Link>
            <Link 
              href="/about" 
              className="text-white hover:text-accent-400 transition-colors duration-300 font-medium"
            >
              ABOUT
            </Link>
            <Link 
              href="/contact" 
              className="text-white hover:text-accent-400 transition-colors duration-300 font-medium"
            >
              CONTACT
            </Link>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/admin" className="hidden md:block">
              <User className="w-6 h-6 text-white hover:text-accent-400 transition-colors duration-300" />
            </Link>
            
            <Link href="/cart" className="relative">
              <ShoppingBag className="w-6 h-6 text-white hover:text-accent-400 transition-colors duration-300" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-white hover:text-accent-400 transition-colors duration-300"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-primary-800 bg-black/95 backdrop-blur-md">
            <div className="py-4 space-y-4">
              <Link 
                href="/" 
                className="block px-4 py-2 text-white hover:text-accent-400 transition-colors duration-300 font-medium"
                onClick={toggleMenu}
              >
                HOME
              </Link>
              <Link 
                href="/shop" 
                className="block px-4 py-2 text-white hover:text-accent-400 transition-colors duration-300 font-medium"
                onClick={toggleMenu}
              >
                SHOP
              </Link>
              <Link 
                href="/about" 
                className="block px-4 py-2 text-white hover:text-accent-400 transition-colors duration-300 font-medium"
                onClick={toggleMenu}
              >
                ABOUT
              </Link>
              <Link 
                href="/contact" 
                className="block px-4 py-2 text-white hover:text-accent-400 transition-colors duration-300 font-medium"
                onClick={toggleMenu}
              >
                CONTACT
              </Link>
              <Link 
                href="/admin" 
                className="block px-4 py-2 text-white hover:text-accent-400 transition-colors duration-300 font-medium"
                onClick={toggleMenu}
              >
                ADMIN
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
