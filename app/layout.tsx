import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ROT KIT | Streetwear & Urban Style',
  description: 'Discover the latest in edgy streetwear fashion. Premium quality clothing with bold designs for the urban rebel.',
  keywords: 'streetwear, urban fashion, edgy clothing, street style, fashion brand',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1a1a1a',
              color: '#fafafa',
              border: '1px solid #374151',
            },
          }}
        />
      </body>
    </html>
  )
}
