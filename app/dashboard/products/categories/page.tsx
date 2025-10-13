'use client'

import { useState } from 'react'
import { Plus, Search, Edit2, Trash2, Folder, Package, TrendingUp } from 'lucide-react'

interface Category {
  id: string
  name: string
  description: string
  productCount: number
  revenue: number
  parentId?: string
}

const mockCategories: Category[] = [
  { id: 'c1', name: 'Software', description: 'Digital software products and licenses', productCount: 24, revenue: 485000, parentId: undefined },
  { id: 'c2', name: 'Hardware', description: 'Physical computing hardware', productCount: 18, revenue: 325000, parentId: undefined },
  { id: 'c3', name: 'Services', description: 'Professional services and consulting', productCount: 32, revenue: 645000, parentId: undefined },
  { id: 'c4', name: 'SaaS', description: 'Software as a Service subscriptions', productCount: 15, revenue: 780000, parentId: 'c1' },
  { id: 'c5', name: 'Enterprise Software', description: 'Enterprise-grade software solutions', productCount: 9, revenue: 420000, parentId: 'c1' }
]

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories)
  const [searchQuery, setSearchQuery] = useState('')

  const stats = {
    total: categories.length,
    totalProducts: categories.reduce((sum, c) => sum + c.productCount, 0),
    totalRevenue: categories.reduce((sum, c) => sum + c.revenue, 0)
  }

  const filteredCategories = categories.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Product Categories</h1>
          <p className="text-gray-400">Organize your products into categories</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
          New Category
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Folder className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.total}</p>
          <p className="text-sm text-gray-400">Total Categories</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.totalProducts}</p>
          <p className="text-sm text-gray-400">Total Products</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">${(stats.totalRevenue / 1000000).toFixed(1)}M</p>
          <p className="text-sm text-gray-400">Total Revenue</p>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {filteredCategories.map((category) => (
          <div key={category.id} className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:bg-gray-700/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-2">{category.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{category.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Package className="w-4 h-4" />
                    <span>{category.productCount} products</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>${(category.revenue / 1000).toFixed(0)}k revenue</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 bg-gray-700 hover:bg-red-600 text-white rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
