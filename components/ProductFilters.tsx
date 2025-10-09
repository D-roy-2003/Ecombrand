'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, X } from 'lucide-react'

interface Filters {
  category: string
  priceRange: [number, number]
  search: string
}

interface ProductFiltersProps {
  filters: Filters
  onFilterChange: (filters: Partial<Filters>) => void
}

const categories = [
  { value: 'ALL', label: 'All Categories' },
  { value: 'TSHIRTS', label: 'T-Shirts' },
  { value: 'HOODIES', label: 'Hoodies' },
  { value: 'PANTS', label: 'Pants' },
  { value: 'SHOES', label: 'Shoes' },
  { value: 'ACCESSORIES', label: 'Accessories' }
]

export default function ProductFilters({ filters, onFilterChange }: ProductFiltersProps) {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const handleCategoryChange = (category: string) => {
    onFilterChange({ category })
  }

  const handlePriceChange = (min: number, max: number) => {
    onFilterChange({ priceRange: [min, max] })
  }

  const handleSearchChange = (search: string) => {
    onFilterChange({ search })
  }

  const clearFilters = () => {
    onFilterChange({
      category: 'ALL',
      priceRange: [0, 10000],
      search: ''
    })
  }

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#1a1224] to-[#0f0818] border border-[#2a1f3b] rounded-xl hover:border-fuchsia-500 transition-all duration-300 shadow-lg hover:shadow-fuchsia-500/20"
        >
          <span className="text-white font-semibold flex items-center gap-2">
            <Filter className="w-5 h-5 text-fuchsia-400" />
            Filters & Search
          </span>
          <div className="p-1.5 bg-fuchsia-500/10 rounded-lg">
            <Filter className="w-4 h-4 text-fuchsia-400" />
          </div>
        </button>
      </div>

      {/* Mobile Filters Overlay */}
      {isMobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", damping: 25 }}
            className="absolute right-0 top-0 h-full w-80 max-w-[90vw] bg-gradient-to-br from-[#1a1224] to-[#0f0818] border-l border-[#2a1f3b] p-6 overflow-y-auto shadow-2xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <div className="p-2 bg-fuchsia-500/10 rounded-lg">
                  <Filter className="w-5 h-5 text-fuchsia-400" />
                </div>
                Filters
              </h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-[#2a1f3b] rounded-lg transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Mobile Filter Content */}
            <div className="space-y-6">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#221733] border border-[#2e2146] text-white rounded-lg focus:border-fuchsia-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">Category</label>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.value} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={category.value}
                        checked={filters.category === category.value}
                        onChange={() => handleCategoryChange(category.value)}
                        className="mr-3 text-fuchsia-500 focus:ring-fuchsia-500"
                      />
                      <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">{category.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">
                  Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
                </label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={filters.priceRange[1]}
                    onChange={(e) => handlePriceChange(filters.priceRange[0], parseInt(e.target.value))}
                    className="w-full h-2 bg-[#2a1f3b] rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>₹0</span>
                    <span>₹10000</span>
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  clearFilters()
                  setIsMobileFiltersOpen(false)
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700 text-white rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-fuchsia-500/50 hover:scale-105"
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden lg:block">
        <div className="bg-gradient-to-br from-[#1a1224] to-[#0f0818] border border-[#2a1f3b] rounded-xl p-6 shadow-2xl sticky top-20">
          <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-3">
            <div className="p-2 bg-fuchsia-500/10 rounded-lg">
              <Filter className="w-5 h-5 text-fuchsia-400" />
            </div>
            <span className="bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">Filters</span>
          </h3>
          
          <div className="space-y-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#221733] border border-[#2e2146] text-white rounded-lg focus:border-fuchsia-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">Category</label>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category.value} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={filters.category === category.value}
                      onChange={() => handleCategoryChange(category.value)}
                      className="mr-3 text-fuchsia-500 focus:ring-fuchsia-500"
                    />
                    <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">{category.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-white mb-3">
                Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="10000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handlePriceChange(filters.priceRange[0], parseInt(e.target.value))}
                  className="w-full h-2 bg-[#2a1f3b] rounded-lg appearance-none cursor-pointer accent-fuchsia-500 slider"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>₹0</span>
                  <span>₹10000</span>
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="w-full py-3 px-4 bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-700 hover:to-violet-700 text-white rounded-lg transition-all duration-300 font-semibold shadow-lg hover:shadow-fuchsia-500/50 hover:scale-105"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
