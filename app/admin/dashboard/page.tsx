'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  LogOut
} from 'lucide-react'
import toast from 'react-hot-toast'
import AddProductModal from '@/components/admin/AddProductModal'
import EditProductModal from '@/components/admin/EditProductModal'

// Mock data for dashboard
const mockStats = {
  totalProducts: 156,
  totalOrders: 89,
  totalRevenue: 15420.50,
  monthlyGrowth: 12.5
}

const mockProducts = [
  {
    id: '1',
    name: 'REBEL HOODIE',
    price: 89.99,
    category: 'HOODIES',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&h=100&fit=crop'
  },
  {
    id: '2',
    name: 'URBAN TEE',
    price: 49.99,
    category: 'TSHIRTS',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop'
  },
  {
    id: '3',
    name: 'STREET PANTS',
    price: 129.99,
    category: 'PANTS',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&h=100&fit=crop'
  }
]

export default function AdminDashboard() {
  const [products, setProducts] = useState(mockProducts)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  const handleAddProduct = (newProduct: any) => {
    setProducts([...products, { ...newProduct, id: Date.now().toString() }])
    setIsAddModalOpen(false)
    toast.success('Product added successfully!')
  }

  const handleEditProduct = (updatedProduct: any) => {
    setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p))
    setIsEditModalOpen(false)
    setSelectedProduct(null)
    toast.success('Product updated successfully!')
  }

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== productId))
      toast.success('Product deleted successfully!')
    }
  }

  const openEditModal = (product: any) => {
    setSelectedProduct(product)
    setIsEditModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-primary-900 border-b border-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <span className="text-2xl font-display font-bold text-gradient">
                EDGY FASHION
              </span>
              <span className="text-gray-400">|</span>
              <span className="text-white font-medium">Admin Dashboard</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">admin@edgyfashion.com</span>
              <button className="text-gray-400 hover:text-white transition-colors duration-300">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 bg-primary-900 border border-primary-800 rounded-lg p-1 mb-8">
          {['overview', 'products', 'orders', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                activeTab === tab
                  ? 'bg-accent-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-primary-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-600/20 rounded-lg">
                    <Package className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total Products</p>
                    <p className="text-2xl font-bold text-white">{mockStats.totalProducts}</p>
                  </div>
                </div>
              </div>

              <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-600/20 rounded-lg">
                    <ShoppingCart className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total Orders</p>
                    <p className="text-2xl font-bold text-white">{mockStats.totalOrders}</p>
                  </div>
                </div>
              </div>

              <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-600/20 rounded-lg">
                    <DollarSign className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">${mockStats.totalRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-600/20 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-400">Monthly Growth</p>
                    <p className="text-2xl font-bold text-white">{mockStats.monthlyGrowth}%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-primary-900 border border-primary-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn-primary"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add New Product
                </button>
                <button className="btn-secondary">
                  <Package className="w-5 h-5 mr-2" />
                  View All Products
                </button>
                <button className="btn-secondary">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  View Orders
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Product Management</h2>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="btn-primary"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </button>
            </div>

            <div className="bg-primary-900 border border-primary-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-primary-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary-800">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-primary-800 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              className="h-10 w-10 rounded-lg object-cover"
                              src={product.imageUrl}
                              alt={product.name}
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-accent-600 text-white rounded-full">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          ${product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {product.stock}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => openEditModal(product)}
                              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Order Management</h2>
            <div className="bg-primary-900 border border-primary-800 rounded-lg p-6 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Order management features coming soon...</p>
            </div>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">Analytics Dashboard</h2>
            <div className="bg-primary-900 border border-primary-800 rounded-lg p-6 text-center">
              <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">Analytics dashboard features coming soon...</p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modals */}
      {isAddModalOpen && (
        <AddProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddProduct}
        />
      )}

      {isEditModalOpen && selectedProduct && (
        <EditProductModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onEdit={handleEditProduct}
          product={selectedProduct}
        />
      )}
    </div>
  )
}
