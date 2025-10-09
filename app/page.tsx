import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import FeaturedProducts from '@/components/FeaturedProducts'
import CategoriesSection from '@/components/CategoriesSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      <div className="h-16" />
      <HeroSection />
      <FeaturedProducts />
      <CategoriesSection />
      <Footer />
    </main>
  )
}
