// import { motion } from 'framer-motion'

import Link from 'next/link'

export const metadata = {
  title: 'Size Guide | ROT KIT',
  description: 'Complete size guide for ROT KIT streetwear. Find your perfect fit with detailed measurements for t-shirts, hoodies, pants, and more.'
}

export default function SizeGuidePage() {
  const updated = new Date().toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <main className="min-h-screen bg-black text-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Header with Cyberpunk Styling */}
        <div className="text-center mb-8 sm:mb-12 relative">
          {/* Back to Home Button */}
          <Link
            href="/"
            className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center space-x-2 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </Link>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-4">
            <span className="text-white">SIZE</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              GUIDE
            </span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Find your perfect fit. Measure twice, rebel once.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-500 mx-auto mt-4"></div>
        </div>

        {/* Size Guide Content */}
        <div className="space-y-8 sm:space-y-12">
          {/* How to Measure */}
          <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">How to Measure</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-cyan-400 font-medium mb-2">Chest Measurement</h3>
                <p className="text-gray-300 text-sm">
                  Measure around the fullest part of your chest, keeping the tape level under your arms and across your shoulder blades.
                </p>
              </div>
              <div>
                <h3 className="text-cyan-400 font-medium mb-2">Waist Measurement</h3>
                <p className="text-gray-300 text-sm">
                  Measure around your natural waistline, keeping the tape comfortably loose.
                </p>
              </div>
            </div>
          </div>

          {/* T-Shirts Size Chart */}
          <div className="bg-gradient-to-br from-purple-900/20 to-fuchsia-900/20 border border-purple-500/30 rounded-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6">T-Shirts</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-purple-500/30">
                    <th className="text-left py-3 text-purple-400 font-medium">Size</th>
                    <th className="text-left py-3 text-purple-400 font-medium">Chest (inches)</th>
                    <th className="text-left py-3 text-purple-400 font-medium">Length (inches)</th>
                    <th className="text-left py-3 text-purple-400 font-medium">Shoulder (inches)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-purple-500/20">
                    <td className="py-3 font-medium">XS</td>
                    <td className="py-3">34-36</td>
                    <td className="py-3">26</td>
                    <td className="py-3">16</td>
                  </tr>
                  <tr className="border-b border-purple-500/20">
                    <td className="py-3 font-medium">S</td>
                    <td className="py-3">36-38</td>
                    <td className="py-3">27</td>
                    <td className="py-3">17</td>
                  </tr>
                  <tr className="border-b border-purple-500/20">
                    <td className="py-3 font-medium">M</td>
                    <td className="py-3">38-40</td>
                    <td className="py-3">28</td>
                    <td className="py-3">18</td>
                  </tr>
                  <tr className="border-b border-purple-500/20">
                    <td className="py-3 font-medium">L</td>
                    <td className="py-3">40-42</td>
                    <td className="py-3">29</td>
                    <td className="py-3">19</td>
                  </tr>
                  <tr className="border-b border-purple-500/20">
                    <td className="py-3 font-medium">XL</td>
                    <td className="py-3">42-44</td>
                    <td className="py-3">30</td>
                    <td className="py-3">20</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">XXL</td>
                    <td className="py-3">44-46</td>
                    <td className="py-3">31</td>
                    <td className="py-3">21</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Hoodies Size Chart */}
          <div className="bg-gradient-to-br from-fuchsia-900/20 to-pink-900/20 border border-fuchsia-500/30 rounded-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6">Hoodies</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-fuchsia-500/30">
                    <th className="text-left py-3 text-fuchsia-400 font-medium">Size</th>
                    <th className="text-left py-3 text-fuchsia-400 font-medium">Chest (inches)</th>
                    <th className="text-left py-3 text-fuchsia-400 font-medium">Length (inches)</th>
                    <th className="text-left py-3 text-fuchsia-400 font-medium">Sleeve (inches)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-fuchsia-500/20">
                    <td className="py-3 font-medium">XS</td>
                    <td className="py-3">34-36</td>
                    <td className="py-3">26</td>
                    <td className="py-3">32</td>
                  </tr>
                  <tr className="border-b border-fuchsia-500/20">
                    <td className="py-3 font-medium">S</td>
                    <td className="py-3">36-38</td>
                    <td className="py-3">27</td>
                    <td className="py-3">33</td>
                  </tr>
                  <tr className="border-b border-fuchsia-500/20">
                    <td className="py-3 font-medium">M</td>
                    <td className="py-3">38-40</td>
                    <td className="py-3">28</td>
                    <td className="py-3">34</td>
                  </tr>
                  <tr className="border-b border-fuchsia-500/20">
                    <td className="py-3 font-medium">L</td>
                    <td className="py-3">40-42</td>
                    <td className="py-3">29</td>
                    <td className="py-3">35</td>
                  </tr>
                  <tr className="border-b border-fuchsia-500/20">
                    <td className="py-3 font-medium">XL</td>
                    <td className="py-3">42-44</td>
                    <td className="py-3">30</td>
                    <td className="py-3">36</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">XXL</td>
                    <td className="py-3">44-46</td>
                    <td className="py-3">31</td>
                    <td className="py-3">37</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pants Size Chart */}
          <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6">Pants</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-green-500/30">
                    <th className="text-left py-3 text-green-400 font-medium">Size</th>
                    <th className="text-left py-3 text-green-400 font-medium">Waist (inches)</th>
                    <th className="text-left py-3 text-green-400 font-medium">Inseam (inches)</th>
                    <th className="text-left py-3 text-green-400 font-medium">Hip (inches)</th>
                  </tr>
                </thead>
                <tbody className="text-gray-300">
                  <tr className="border-b border-green-500/20">
                    <td className="py-3 font-medium">XS</td>
                    <td className="py-3">28-30</td>
                    <td className="py-3">30</td>
                    <td className="py-3">34-36</td>
                  </tr>
                  <tr className="border-b border-green-500/20">
                    <td className="py-3 font-medium">S</td>
                    <td className="py-3">30-32</td>
                    <td className="py-3">31</td>
                    <td className="py-3">36-38</td>
                  </tr>
                  <tr className="border-b border-green-500/20">
                    <td className="py-3 font-medium">M</td>
                    <td className="py-3">32-34</td>
                    <td className="py-3">32</td>
                    <td className="py-3">38-40</td>
                  </tr>
                  <tr className="border-b border-green-500/20">
                    <td className="py-3 font-medium">L</td>
                    <td className="py-3">34-36</td>
                    <td className="py-3">33</td>
                    <td className="py-3">40-42</td>
                  </tr>
                  <tr className="border-b border-green-500/20">
                    <td className="py-3 font-medium">XL</td>
                    <td className="py-3">36-38</td>
                    <td className="py-3">34</td>
                    <td className="py-3">42-44</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-medium">XXL</td>
                    <td className="py-3">38-40</td>
                    <td className="py-3">35</td>
                    <td className="py-3">44-46</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Fit Guide */}
          <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6">Fit Guide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">👕</span>
                </div>
                <h3 className="text-yellow-400 font-medium mb-2">Slim Fit</h3>
                <p className="text-gray-300 text-sm">Fitted through chest and waist for a modern, tailored look</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧥</span>
                </div>
                <h3 className="text-yellow-400 font-medium mb-2">Regular Fit</h3>
                <p className="text-gray-300 text-sm">Comfortable fit with room to move, perfect for everyday wear</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛍️</span>
                </div>
                <h3 className="text-yellow-400 font-medium mb-2">Oversized Fit</h3>
                <p className="text-gray-300 text-sm">Relaxed, baggy fit for maximum comfort and street style</p>
              </div>
            </div>
          </div>

          {/* Size Tips */}
          <div className="bg-gradient-to-br from-red-900/20 to-pink-900/20 border border-red-500/30 rounded-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-6">Size Tips</h2>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-start space-x-3">
                <span className="text-red-400 mt-1">•</span>
                <p className="text-sm">If you're between sizes, we recommend sizing up for a more comfortable fit</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-red-400 mt-1">•</span>
                <p className="text-sm">Our hoodies and t-shirts have a slightly longer fit for that streetwear look</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-red-400 mt-1">•</span>
                <p className="text-sm">Pants are designed with a mid-rise waist for comfort and style</p>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-red-400 mt-1">•</span>
                <p className="text-sm">All measurements are in inches and taken from the garment laid flat</p>
              </div>
            </div>
          </div>

          {/* Still Need Help */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-600/50 rounded-lg p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Still Need Help?</h2>
            <p className="text-gray-300 mb-6">
              Can't find your size or need help with measurements? Our team is here to help.
            </p>
            <div className="space-y-3">
              <p className="text-gray-400">
                📧 Email: <a href="mailto:support@rotkit.com" className="text-purple-400 hover:text-purple-300">support@rotkit.com</a>
              </p>
              <p className="text-gray-400">
                💬 Live Chat: Available 24/7 on our website
              </p>
              <p className="text-gray-400">
                📞 Phone: <a href="tel:+15551234567" className="text-purple-400 hover:text-purple-300">+1 (555) 123-4567</a>
              </p>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-8 sm:mt-12 pt-6 border-t border-gray-700/50">
          <p className="text-xs sm:text-sm text-gray-500 text-center">
            Last updated: {updated}
          </p>
        </div>
      </div>
    </main>
  )
}
