'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Building, Plus, Search, Filter, Grid, List,
  Phone, Mail, MapPin, Globe, User, Calendar,
  DollarSign, Package, TrendingUp, AlertCircle,
  CheckCircle, Star, MoreVertical, Edit, Eye,
  Archive, FileText, ShoppingCart, Clock,
  Download, Upload, ChevronLeft, ChevronRight,
  Box, Truck
} from 'lucide-react'

// Mock vendors data with product relationships
const mockVendors = [
  {
    id: 'v1',
    name: 'Dell Technologies',
    category: 'Hardware',
    status: 'active',
    rating: 4.8,
    contact: {
      name: 'John Smith',
      role: 'Account Manager',
      email: 'john@dell.com',
      phone: '+1 555-123-4567',
      alternatePhone: '+1 555-123-4568'
    },
    address: {
      street: '1 Dell Way',
      city: 'Round Rock',
      state: 'TX',
      zipCode: '78682',
      country: 'United States'
    },
    website: 'https://dell.com',
    taxId: 'XX-XXXXXXX',
    paymentTerms: 'Net 30',
    creditLimit: 50000,
    totalPurchases: 125000,
    outstandingBalance: 12500,
    lastOrder: '2024-03-15',
    productsSupplied: [
      { id: 'prod1', name: 'Dell UltraSharp Monitors', category: 'Monitors', quantity: 45 },
      { id: 'prod2', name: 'Dell Latitude Laptops', category: 'Laptops', quantity: 28 },
      { id: 'prod3', name: 'PowerEdge Servers', category: 'Servers', quantity: 12 },
      { id: 'prod4', name: 'Storage Arrays', category: 'Storage', quantity: 8 }
    ],
    recentOrders: [
      { id: 'ord1', date: '2024-03-15', amount: 15000, status: 'delivered' },
      { id: 'ord2', date: '2024-03-01', amount: 8500, status: 'delivered' }
    ],
    notes: 'Preferred vendor for all computer equipment. Good discounts on bulk orders.',
    documents: 5,
    orders: 42,
    onTimeDelivery: 95
  },
  {
    id: 'v2',
    name: 'HP Inc.',
    category: 'Hardware',
    status: 'active',
    rating: 4.6,
    contact: {
      name: 'Jane Doe',
      role: 'Sales Director',
      email: 'jane@hp.com',
      phone: '+1 555-234-5678',
      alternatePhone: null
    },
    address: {
      street: '1501 Page Mill Road',
      city: 'Palo Alto',
      state: 'CA',
      zipCode: '94304',
      country: 'United States'
    },
    website: 'https://hp.com',
    taxId: 'YY-YYYYYYY',
    paymentTerms: 'Net 45',
    creditLimit: 75000,
    totalPurchases: 89000,
    outstandingBalance: 8900,
    lastOrder: '2024-03-10',
    productsSupplied: [
      { id: 'prod5', name: 'HP LaserJet Printers', category: 'Printers', quantity: 35 },
      { id: 'prod6', name: 'ScanJet Scanners', category: 'Scanners', quantity: 18 },
      { id: 'prod7', name: 'Original Ink Cartridges', category: 'Ink & Toner', quantity: 200 }
    ],
    recentOrders: [
      { id: 'ord3', date: '2024-03-10', amount: 4500, status: 'pending' },
      { id: 'ord4', date: '2024-02-25', amount: 6200, status: 'delivered' }
    ],
    notes: 'Reliable for printing solutions. Extended warranty available.',
    documents: 8,
    orders: 38,
    onTimeDelivery: 92
  },
  {
    id: 'v3',
    name: 'Microsoft',
    category: 'Software',
    status: 'active',
    rating: 4.9,
    contact: {
      name: 'Mike Chen',
      role: 'Partner Manager',
      email: 'mike@microsoft.com',
      phone: '+1 555-345-6789',
      alternatePhone: '+1 555-345-6790'
    },
    address: {
      street: 'One Microsoft Way',
      city: 'Redmond',
      state: 'WA',
      zipCode: '98052',
      country: 'United States'
    },
    website: 'https://microsoft.com',
    taxId: 'ZZ-ZZZZZZZ',
    paymentTerms: 'Net 30',
    creditLimit: 100000,
    totalPurchases: 250000,
    outstandingBalance: 0,
    lastOrder: '2024-03-20',
    productsSupplied: [
      { id: 'prod8', name: 'Windows 11 Pro Licenses', category: 'Operating Systems', quantity: 150 },
      { id: 'prod9', name: 'Microsoft 365 Business', category: 'Productivity', quantity: 200 },
      { id: 'prod10', name: 'Azure Cloud Services', category: 'Cloud', quantity: 1 },
      { id: 'prod11', name: 'Visual Studio Licenses', category: 'Development', quantity: 25 }
    ],
    recentOrders: [
      { id: 'ord5', date: '2024-03-20', amount: 25000, status: 'delivered' },
      { id: 'ord6', date: '2024-03-01', amount: 18000, status: 'delivered' }
    ],
    notes: 'Volume licensing partner. Excellent support for enterprise solutions.',
    documents: 12,
    orders: 56,
    onTimeDelivery: 100
  },
  {
    id: 'v4',
    name: 'Amazon Web Services',
    category: 'Cloud Services',
    status: 'active',
    rating: 4.7,
    contact: {
      name: 'Sarah Lee',
      role: 'Solutions Architect',
      email: 'sarah@aws.amazon.com',
      phone: '+1 555-456-7890',
      alternatePhone: null
    },
    address: {
      street: '410 Terry Avenue N',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98109',
      country: 'United States'
    },
    website: 'https://aws.amazon.com',
    taxId: 'AA-AAAAAAA',
    paymentTerms: 'Monthly billing',
    creditLimit: 0,
    totalPurchases: 180000,
    outstandingBalance: 15000,
    lastOrder: '2024-03-22',
    productsSupplied: ['Cloud Computing', 'Storage', 'Database', 'AI Services'],
    notes: 'Primary cloud infrastructure provider. Usage-based billing.',
    documents: 15,
    orders: 124,
    onTimeDelivery: 99
  },
  {
    id: 'v5',
    name: 'Adobe Systems',
    category: 'Software',
    status: 'active',
    rating: 4.5,
    contact: {
      name: 'Tom Wilson',
      role: 'Enterprise Account Executive',
      email: 'tom@adobe.com',
      phone: '+1 555-567-8901',
      alternatePhone: null
    },
    address: {
      street: '345 Park Avenue',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95110',
      country: 'United States'
    },
    website: 'https://adobe.com',
    taxId: 'BB-BBBBBBB',
    paymentTerms: 'Annual subscription',
    creditLimit: 25000,
    totalPurchases: 45000,
    outstandingBalance: 0,
    lastOrder: '2024-02-28',
    productsSupplied: ['Creative Cloud', 'Document Cloud', 'Experience Cloud'],
    notes: 'Design and creative software provider. Team licenses available.',
    documents: 6,
    orders: 18,
    onTimeDelivery: 100
  },
  {
    id: 'v6',
    name: 'Cisco Systems',
    category: 'Networking',
    status: 'on_hold',
    rating: 4.4,
    contact: {
      name: 'Emily Brown',
      role: 'Channel Partner Manager',
      email: 'emily@cisco.com',
      phone: '+1 555-678-9012',
      alternatePhone: null
    },
    address: {
      street: '170 West Tasman Drive',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95134',
      country: 'United States'
    },
    website: 'https://cisco.com',
    taxId: 'CC-CCCCCCC',
    paymentTerms: 'Net 60',
    creditLimit: 150000,
    totalPurchases: 320000,
    outstandingBalance: 45000,
    lastOrder: '2024-01-15',
    productsSupplied: ['Routers', 'Switches', 'Security Appliances', 'Wireless'],
    notes: 'Network infrastructure. Currently reviewing contract terms.',
    documents: 20,
    orders: 67,
    onTimeDelivery: 88
  }
]

const categoryColors = {
  'Hardware': 'from-blue-600 to-cyan-600',
  'Software': 'from-purple-600 to-pink-600',
  'Cloud Services': 'from-green-600 to-emerald-600',
  'Networking': 'from-orange-600 to-yellow-600',
  'Office Supplies': 'from-gray-600 to-slate-600',
  'Services': 'from-indigo-600 to-purple-600'
}

const statusColors = {
  'active': 'bg-green-500/20 text-green-400 border-green-500/30',
  'on_hold': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'inactive': 'bg-red-500/20 text-red-400 border-red-500/30',
  'pending': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
}

export default function VendorsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const categories = ['all', ...new Set(mockVendors.map(v => v.category))]

  const filteredVendors = mockVendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          vendor.contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || vendor.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || vendor.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedVendors = filteredVendors.slice(startIndex, startIndex + itemsPerPage)

  // Handle export
  const handleExport = () => {
    const csvContent = [
      ['Name', 'Category', 'Contact Person', 'Email', 'Phone', 'Status', 'Total Purchases', 'Outstanding Balance'].join(','),
      ...filteredVendors.map(v => [
        v.name,
        v.category,
        v.contact.name,
        v.contact.email,
        v.contact.phone,
        v.status,
        `$${v.totalPurchases}`,
        `$${v.outstandingBalance}`
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vendors.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const totalPurchases = mockVendors.reduce((sum, v) => sum + v.totalPurchases, 0)
  const totalOutstanding = mockVendors.reduce((sum, v) => sum + v.outstandingBalance, 0)
  const activeVendors = mockVendors.filter(v => v.status === 'active').length
  const averageRating = mockVendors.reduce((sum, v) => sum + v.rating, 0) / mockVendors.length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Vendors</h1>
          <p className="text-gray-400">Manage suppliers and service providers</p>
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
            href="/dashboard/vendors/new"
            className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Vendor</span>
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
            <span className="text-gray-400">Total Vendors</span>
            <Building className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{mockVendors.length}</p>
          <p className="text-xs text-gray-500 mt-1">{activeVendors} active</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Total Purchases</span>
            <DollarSign className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">${(totalPurchases / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-500 mt-1">All time</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Outstanding</span>
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">${(totalOutstanding / 1000).toFixed(1)}K</p>
          <p className="text-xs text-yellow-400 mt-1">Pending payment</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Avg Rating</span>
            <Star className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{averageRating.toFixed(1)}</p>
          <div className="flex items-center space-x-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search vendors..."
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
          <option value="active">Active</option>
          <option value="on_hold">On Hold</option>
          <option value="inactive">Inactive</option>
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

      {/* Vendors Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-6">
          {paginatedVendors.map((vendor) => {
            const gradientColor = categoryColors[vendor.category] || 'from-gray-600 to-gray-500'

            return (
              <Link
                key={vendor.id}
                href={`/dashboard/vendors/${vendor.id}`}
                className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6 hover:border-purple-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradientColor} flex items-center justify-center`}>
                      <Building className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{vendor.name}</h3>
                      <p className="text-sm text-gray-400">{vendor.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-800 transition-all"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{vendor.contact.name}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">{vendor.contact.role}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300 truncate">{vendor.contact.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{vendor.contact.phone}</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Total Purchases</p>
                    <p className="text-lg font-semibold text-white">${(vendor.totalPurchases / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Outstanding</p>
                    <p className="text-lg font-semibold text-yellow-400">${(vendor.outstandingBalance / 1000).toFixed(1)}k</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Orders</p>
                    <p className="text-lg font-semibold text-white">{vendor.orders}</p>
                  </div>
                </div>

                {/* Products */}
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2">Products Supplied:</p>
                  <div className="flex flex-wrap gap-2">
                    {vendor.productsSupplied.slice(0, 2).map((product) => (
                      <div
                        key={product.id}
                        className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 text-xs flex items-center space-x-1"
                        title={`${product.name} (Qty: ${product.quantity})`}
                      >
                        <Package className="h-3 w-3" />
                        <span className="truncate max-w-20">{product.name}</span>
                      </div>
                    ))}
                    {vendor.productsSupplied.length > 2 && (
                      <div className="px-2 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs">
                        +{vendor.productsSupplied.length - 2} more
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Orders */}
                {vendor.recentOrders && vendor.recentOrders.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Recent Orders:</p>
                    <div className="space-y-2">
                      {vendor.recentOrders.slice(0, 2).map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50"
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              order.status === 'delivered' ? 'bg-green-400' :
                              order.status === 'pending' ? 'bg-yellow-400' : 'bg-gray-400'
                            }`} />
                            <span className="text-xs text-gray-300">
                              {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                          <span className="text-xs text-white font-medium">
                            ${(order.amount / 1000).toFixed(1)}k
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-lg text-xs border ${statusColors[vendor.status]}`}>
                      {vendor.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-white">{vendor.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Package className="h-3 w-3 text-green-400" />
                      <span>{vendor.productsSupplied.length} products</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Truck className="h-3 w-3" />
                      <span>{vendor.onTimeDelivery}% on-time</span>
                    </div>
                  </div>
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
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Vendor</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Category</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Contact</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Total Purchases</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Outstanding</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Rating</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedVendors.map((vendor) => (
                <tr key={vendor.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-6">
                    <Link href={`/dashboard/vendors/${vendor.id}`} className="text-white hover:text-purple-400 transition-colors">
                      {vendor.name}
                    </Link>
                  </td>
                  <td className="py-4 px-6 text-gray-300">{vendor.category}</td>
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-gray-300">{vendor.contact.name}</p>
                      <p className="text-xs text-gray-500">{vendor.contact.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-white font-medium">${(vendor.totalPurchases / 1000).toFixed(0)}k</td>
                  <td className="py-4 px-6">
                    <span className={vendor.outstandingBalance > 0 ? 'text-yellow-400 font-medium' : 'text-gray-400'}>
                      ${(vendor.outstandingBalance / 1000).toFixed(1)}k
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white">{vendor.rating}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 rounded-lg text-xs border ${statusColors[vendor.status]}`}>
                      {vendor.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/vendors/${vendor.id}`}
                        className="p-1 rounded hover:bg-gray-700 transition-colors"
                      >
                        <Eye className="h-4 w-4 text-gray-400" />
                      </Link>
                      <Link
                        href={`/dashboard/vendors/${vendor.id}/edit`}
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-6">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredVendors.length)} of {filteredVendors.length} vendors
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