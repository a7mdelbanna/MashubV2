'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Package, Plus, Search, Filter, Grid, List,
  Box, Monitor, HardDrive, Printer, Scanner,
  Cpu, Mouse, Keyboard, Headphones, Camera,
  MoreVertical, Edit, Eye, Trash2, Archive,
  DollarSign, Tag, AlertCircle, CheckCircle,
  Download, Upload, ChevronLeft, ChevronRight,
  TrendingUp, BarChart3
} from 'lucide-react'

// Mock products data
const mockProducts = [
  {
    id: 'prod1',
    name: 'Dell UltraSharp 27" Monitor',
    category: 'Monitor',
    type: 'hardware',
    serialNumber: 'DL-MON-2024-001',
    vendor: 'Dell Technologies',
    purchasePrice: 599.99,
    sellingPrice: 899.99,
    stock: 12,
    warranty: '3 years',
    status: 'in_stock',
    image: null,
    specifications: {
      size: '27 inches',
      resolution: '4K UHD',
      refreshRate: '60Hz',
      connectivity: 'HDMI, DisplayPort, USB-C'
    }
  },
  {
    id: 'prod2',
    name: 'HP ScanJet Pro 3500',
    category: 'Scanner',
    type: 'hardware',
    serialNumber: 'HP-SCN-2024-002',
    vendor: 'HP Inc.',
    purchasePrice: 399.99,
    sellingPrice: 599.99,
    stock: 8,
    warranty: '1 year',
    status: 'in_stock',
    image: null,
    specifications: {
      type: 'Flatbed',
      dpi: '1200',
      speed: '25 ppm',
      connectivity: 'USB, Wi-Fi'
    }
  },
  {
    id: 'prod3',
    name: 'Logitech MX Master 3',
    category: 'Mouse',
    type: 'hardware',
    serialNumber: 'LG-MOU-2024-003',
    vendor: 'Logitech',
    purchasePrice: 79.99,
    sellingPrice: 129.99,
    stock: 25,
    warranty: '2 years',
    status: 'in_stock',
    image: null,
    specifications: {
      type: 'Wireless',
      dpi: '4000',
      battery: 'Rechargeable',
      connectivity: 'Bluetooth, USB'
    }
  },
  {
    id: 'prod4',
    name: 'Brother Laser Printer',
    category: 'Printer',
    type: 'hardware',
    serialNumber: 'BR-PRN-2024-004',
    vendor: 'Brother Industries',
    purchasePrice: 299.99,
    sellingPrice: 449.99,
    stock: 5,
    warranty: '1 year',
    status: 'low_stock',
    image: null,
    specifications: {
      type: 'Laser',
      printSpeed: '32 ppm',
      resolution: '2400x600 dpi',
      connectivity: 'USB, Wi-Fi, Ethernet'
    }
  },
  {
    id: 'prod5',
    name: 'Mechanical Keyboard RGB',
    category: 'Keyboard',
    type: 'hardware',
    serialNumber: 'KB-MEC-2024-005',
    vendor: 'Razer',
    purchasePrice: 89.99,
    sellingPrice: 149.99,
    stock: 0,
    warranty: '2 years',
    status: 'out_of_stock',
    image: null,
    specifications: {
      switches: 'Cherry MX Blue',
      backlight: 'RGB',
      layout: 'Full-size',
      connectivity: 'USB-C'
    }
  },
  {
    id: 'prod6',
    name: 'Webcam HD Pro',
    category: 'Camera',
    type: 'hardware',
    serialNumber: 'WC-CAM-2024-006',
    vendor: 'Logitech',
    purchasePrice: 59.99,
    sellingPrice: 99.99,
    stock: 18,
    warranty: '1 year',
    status: 'in_stock',
    image: null,
    specifications: {
      resolution: '1080p',
      fps: '30',
      fov: '78°',
      connectivity: 'USB'
    }
  }
]

const categoryIcons = {
  'Monitor': Monitor,
  'Scanner': Scanner,
  'Mouse': Mouse,
  'Printer': Printer,
  'Keyboard': Keyboard,
  'Camera': Camera,
  'Storage': HardDrive,
  'Computer': Cpu,
  'Audio': Headphones
}

const statusColors = {
  'in_stock': 'bg-green-500/20 text-green-400 border-green-500/30',
  'low_stock': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'out_of_stock': 'bg-red-500/20 text-red-400 border-red-500/30',
  'discontinued': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
}

const categoryColors = {
  'Monitor': 'from-blue-600 to-cyan-600',
  'Scanner': 'from-purple-600 to-pink-600',
  'Mouse': 'from-green-600 to-emerald-600',
  'Printer': 'from-orange-600 to-yellow-600',
  'Keyboard': 'from-indigo-600 to-purple-600',
  'Camera': 'from-red-600 to-pink-600',
  'Storage': 'from-gray-600 to-slate-600',
  'Computer': 'from-violet-600 to-purple-600',
  'Audio': 'from-teal-600 to-cyan-600'
}

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const categories = ['all', ...new Set(mockProducts.map(p => p.category))]

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.serialNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalStock = mockProducts.reduce((sum, p) => sum + p.stock, 0)
  const totalValue = mockProducts.reduce((sum, p) => sum + (p.stock * p.purchasePrice), 0)
  const lowStockCount = mockProducts.filter(p => p.status === 'low_stock').length
  const outOfStockCount = mockProducts.filter(p => p.status === 'out_of_stock').length

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage)

  // Handle export
  const handleExport = () => {
    const csvContent = [
      ['Name', 'Category', 'Serial Number', 'Vendor', 'Purchase Price', 'Selling Price', 'Stock', 'Status'].join(','),
      ...filteredProducts.map(p => [
        p.name,
        p.category,
        p.serialNumber,
        p.vendor,
        `$${p.purchasePrice}`,
        `$${p.sellingPrice}`,
        p.stock,
        p.status
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'products.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Products & Hardware</h1>
          <p className="text-gray-400">Manage hardware inventory and track serial numbers</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => document.getElementById('import-input')?.click()}
            className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-700 transition-all duration-300 flex items-center"
          >
            <Upload className="h-5 w-5 mr-2" />
            Import
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-700 transition-all duration-300 flex items-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
          <Link
            href="/dashboard/products/new"
            className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Link>
        </div>
        <input
          id="import-input"
          type="file"
          accept=".csv,.xlsx"
          className="hidden"
          onChange={(e) => {
            // Handle file import logic here
            console.log('Importing file:', e.target.files?.[0])
          }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Total Products</span>
            <Package className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{mockProducts.length}</p>
          <p className="text-xs text-gray-500 mt-1">Active items</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Total Stock</span>
            <Box className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totalStock}</p>
          <p className="text-xs text-gray-500 mt-1">Units in inventory</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Inventory Value</span>
            <DollarSign className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">${(totalValue / 1000).toFixed(1)}K</p>
          <p className="text-xs text-gray-500 mt-1">Purchase value</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Stock Alerts</span>
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{lowStockCount + outOfStockCount}</p>
          <div className="flex items-center space-x-2 text-xs mt-1">
            <span className="text-yellow-400">{lowStockCount} low</span>
            <span className="text-gray-500">•</span>
            <span className="text-red-400">{outOfStockCount} out</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or serial number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
        >
          <option value="all">All Status</option>
          <option value="in_stock">In Stock</option>
          <option value="low_stock">Low Stock</option>
          <option value="out_of_stock">Out of Stock</option>
        </select>

        <div className="flex items-center bg-gray-800/50 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Products Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-3 gap-6">
          {paginatedProducts.map((product) => {
            const Icon = categoryIcons[product.category] || Package
            const gradientColor = categoryColors[product.category] || 'from-gray-600 to-gray-500'

            return (
              <Link
                key={product.id}
                href={`/dashboard/products/${product.id}`}
                className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6 hover:border-purple-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradientColor} flex items-center justify-center`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-800 transition-all"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                </div>

                <h3 className="font-semibold text-white mb-1">{product.name}</h3>
                <p className="text-sm text-gray-400 mb-4">{product.serialNumber}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Stock</span>
                    <span className="text-sm font-medium text-white">{product.stock} units</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Price</span>
                    <span className="text-sm font-medium text-green-400">${product.sellingPrice}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Vendor</span>
                    <span className="text-sm text-white truncate max-w-[120px]">{product.vendor}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <span className={`px-2 py-1 rounded-lg text-xs border ${statusColors[product.status]}`}>
                    {product.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400">{product.warranty} warranty</span>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800">
          <table className="w-full">
            <thead className="border-b border-gray-800">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Product</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Serial Number</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Category</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Vendor</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Stock</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Price</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => {
                const Icon = categoryIcons[product.category] || Package

                return (
                  <tr key={product.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-gray-400" />
                        <Link href={`/dashboard/products/${product.id}`} className="text-white hover:text-purple-400 transition-colors">
                          {product.name}
                        </Link>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300 font-mono text-sm">{product.serialNumber}</td>
                    <td className="py-4 px-6 text-gray-300">{product.category}</td>
                    <td className="py-4 px-6 text-gray-300">{product.vendor}</td>
                    <td className="py-4 px-6">
                      <span className={`font-medium ${product.stock === 0 ? 'text-red-400' : product.stock < 10 ? 'text-yellow-400' : 'text-white'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-green-400 font-medium">${product.sellingPrice}</td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-lg text-xs border ${statusColors[product.status]}`}>
                        {product.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/dashboard/products/${product.id}`}
                          className="p-1 rounded hover:bg-gray-700 transition-colors"
                        >
                          <Eye className="h-4 w-4 text-gray-400" />
                        </Link>
                        <Link
                          href={`/dashboard/products/${product.id}/edit`}
                          className="p-1 rounded hover:bg-gray-700 transition-colors"
                        >
                          <Edit className="h-4 w-4 text-gray-400" />
                        </Link>
                        <button className="p-1 rounded hover:bg-gray-700 transition-colors">
                          <Archive className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-all"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                      pageNumber === currentPage
                        ? "gradient-purple text-white"
                        : "bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-700"
                    )}
                  >
                    {pageNumber}
                  </button>
                )
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return (
                  <span key={pageNumber} className="px-2 text-gray-500">
                    ...
                  </span>
                )
              }
              return null
            })}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-all"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}