import Link from 'next/link'

export const metadata = {
  title: 'Returns & Exchanges | ROT KIT',
  description: 'Return and exchange policy for ROT KIT products. Learn about our hassle-free return process, conditions, and timelines for streetwear items.'
}

export default function ReturnsPage() {
  const updated = new Date().toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <main className="min-h-screen bg-black text-gray-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Header with Cyberpunk Styling */}
        <div className="text-center mb-8 sm:mb-12 relative">
          {/* Back to Home Button */}
          <Link
            href="/"
            className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-fuchsia-400 transition-colors duration-300 flex items-center space-x-2 text-sm sm:text-base"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back to Home</span>
            <span className="sm:hidden">Home</span>
          </Link>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-black mb-4">
            <span className="text-white">RETURN</span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500">
              POLICY
            </span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Not satisfied? No problem. We believe in second chances.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-purple-500 mx-auto mt-4"></div>
        </div>

        <div className="space-y-6 sm:space-y-8 text-sm sm:text-base leading-7">
          {/* Return Window */}
          <div className="bg-gradient-to-br from-red-900/20 to-purple-900/20 border border-red-500/30 rounded-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 flex items-center">
              <span className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3 text-sm font-bold">30</span>
              Return Window
            </h2>
            <p className="text-gray-300">
              You have 30 days from the date of delivery to return or exchange your items. Items must be in their
              original condition with tags attached and original packaging intact.
            </p>
          </div>

          {/* Eligible Items */}
          <div className="bg-gradient-to-br from-purple-900/20 to-fuchsia-900/20 border border-purple-500/30 rounded-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Eligible Items</h2>
            <div className="space-y-3 text-gray-300">
              <p>• All unworn, unwashed items with original tags</p>
              <p>• Items in original packaging</p>
              <p>• Items without any signs of wear or damage</p>
              <p>• Items purchased within the last 30 days</p>
            </div>
          </div>

          {/* Non-Returnable Items */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/50 border border-gray-700/50 rounded-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4 text-red-400">Non-Returnable Items</h2>
            <div className="space-y-3 text-gray-400">
              <p>• Items showing signs of wear or damage</p>
              <p>• Items without original tags and packaging</p>
              <p>• Underwear, socks, and intimate apparel (for hygiene reasons)</p>
              <p>• Items purchased more than 30 days ago</p>
              <p>• Customized or personalized items</p>
            </div>
          </div>

          {/* Return Process */}
          <div className="bg-gradient-to-br from-fuchsia-900/20 to-cyan-900/20 border border-fuchsia-500/30 rounded-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Return Process</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                <div>
                  <h3 className="text-white font-medium">Contact Us</h3>
                  <p className="text-gray-300 text-sm">Email us at returns@rotkit.com or use the contact form</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                <div>
                  <h3 className="text-white font-medium">Get Return Label</h3>
                  <p className="text-gray-300 text-sm">We'll send you a prepaid return shipping label</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                <div>
                  <h3 className="text-white font-medium">Pack & Ship</h3>
                  <p className="text-gray-300 text-sm">Pack items securely and drop off at nearest shipping location</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-fuchsia-500 rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                <div>
                  <h3 className="text-white font-medium">Refund Processed</h3>
                  <p className="text-gray-300 text-sm">Once received and inspected, refund will be processed within 3-5 business days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Information */}
          <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Refund Information</h2>
            <div className="space-y-3 text-gray-300">
              <p>• Original shipping charges are non-refundable</p>
              <p>• Refunds will be processed to the original payment method</p>
              <p>• Processing time: 3-5 business days after we receive the item</p>
              <p>• You will receive an email confirmation once the refund is processed</p>
            </div>
          </div>

          {/* Exchanges */}
          <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg p-6 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Exchanges</h2>
            <p className="text-gray-300 mb-4">
              We offer exchanges for different sizes or colors within 30 days. Simply return the original item and place a new order for the desired variant.
            </p>
            <div className="bg-green-900/30 border border-green-500/20 rounded-lg p-4">
              <p className="text-green-300 text-sm">
                💡 <strong>Pro Tip:</strong> Place your exchange order first to ensure availability, then return the original item for a refund.
              </p>
            </div>
          </div>

          {/* Contact Support */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-gray-600/50 rounded-lg p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-4">Need Help?</h2>
            <p className="text-gray-300 mb-6">
              Our support team is here to help with any return or exchange questions.
            </p>
            <div className="space-y-3">
              <p className="text-gray-400">
                📧 Email: <a href="mailto:intellicraft.solutions25@gmail.com" className="text-purple-400 hover:text-purple-300">intellicraft.solutions25@gmail.com</a>
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
