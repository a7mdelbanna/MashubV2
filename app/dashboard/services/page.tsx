'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Zap, Plus, Search, Filter, Grid, List,
  Globe, Smartphone, ShoppingBag, Code, Database,
  Cloud, Shield, Layers, MoreVertical, Edit,
  Eye, Copy, Archive, DollarSign, Package,
  Users, TrendingUp, Star, CheckCircle, AlertCircle,
  Download, Upload, ChevronLeft, ChevronRight
} from 'lucide-react'

// Mock services data
const mockServices = [
  {
    id: 'srv1',
    name: 'ShopLeez POS',
    category: 'POS System',
    type: 'software',
    description: 'Complete point-of-sale solution with inventory management and analytics',
    image: null,
    status: 'active',
    rating: 4.8,
    clients: 24,
    revenue: 125000,
    packages: [
      { id: 'pkg1', name: 'Starter', price: 299, features: ['Basic POS', 'Inventory', '1 User'], popular: false },
      { id: 'pkg2', name: 'Professional', price: 599, features: ['Advanced POS', 'Multi-store', '5 Users', 'Analytics'], popular: true },
      { id: 'pkg3', name: 'Enterprise', price: 1299, features: ['Full Features', 'Unlimited Users', 'API Access', 'Custom Reports'], popular: false }
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    deploymentTime: '2-3 days',
    supportLevel: '24/7'
  },
  {
    id: 'srv2',
    name: 'E-Commerce Platform',
    category: 'Website',
    type: 'software',
    description: 'Full-featured online store with payment integration and shipping management',
    image: null,
    status: 'active',
    rating: 4.6,
    clients: 18,
    revenue: 89000,
    packages: [
      { id: 'pkg4', name: 'Basic Store', price: 799, features: ['50 Products', 'Payment Gateway', 'Basic Theme'], popular: false },
      { id: 'pkg5', name: 'Pro Store', price: 1499, features: ['Unlimited Products', 'Custom Theme', 'Marketing Tools'], popular: true },
      { id: 'pkg6', name: 'Enterprise', price: 2999, features: ['Multi-vendor', 'B2B Features', 'Advanced Analytics'], popular: false }
    ],
    technologies: ['Next.js', 'Stripe', 'MongoDB'],
    deploymentTime: '5-7 days',
    supportLevel: 'Business hours'
  },
  {
    id: 'srv3',
    name: 'Mobile Banking App',
    category: 'Mobile App',
    type: 'software',
    description: 'Secure mobile banking application with biometric authentication',
    image: null,
    status: 'active',
    rating: 4.9,
    clients: 8,
    revenue: 450000,
    packages: [
      { id: 'pkg7', name: 'Core Banking', price: 4999, features: ['Account Management', 'Transfers', 'Bill Pay'], popular: false },
      { id: 'pkg8', name: 'Advanced', price: 9999, features: ['Investment Tools', 'Loans', 'Cards Management'], popular: true },
      { id: 'pkg9', name: 'White Label', price: 19999, features: ['Full Customization', 'Your Branding', 'Dedicated Support'], popular: false }
    ],
    technologies: ['React Native', 'Node.js', 'AWS'],
    deploymentTime: '30-45 days',
    supportLevel: '24/7 Premium'
  },
  {
    id: 'srv4',
    name: 'CRM System',
    category: 'Application',
    type: 'software',
    description: 'Customer relationship management with sales pipeline and automation',
    image: null,
    status: 'active',
    rating: 4.7,
    clients: 32,
    revenue: 156000,
    packages: [
      { id: 'pkg10', name: 'Team', price: 399, features: ['10 Users', 'Basic CRM', 'Email Integration'], popular: false },
      { id: 'pkg11', name: 'Business', price: 799, features: ['50 Users', 'Automation', 'Reports'], popular: true },
      { id: 'pkg12', name: 'Enterprise', price: 1999, features: ['Unlimited Users', 'API', 'Custom Workflows'], popular: false }
    ],
    technologies: ['Vue.js', 'Laravel', 'MySQL'],
    deploymentTime: '3-5 days',
    supportLevel: 'Business hours'
  },
  {
    id: 'srv5',
    name: 'Restaurant Management',
    category: 'POS System',
    type: 'software',
    description: 'Complete restaurant solution with table management and kitchen display',
    image: null,
    status: 'active',
    rating: 4.5,
    clients: 15,
    revenue: 67000,
    packages: [
      { id: 'pkg13', name: 'Small Restaurant', price: 499, features: ['Table Management', 'Basic POS', 'Kitchen Display'], popular: false },
      { id: 'pkg14', name: 'Restaurant Chain', price: 999, features: ['Multi-location', 'Inventory', 'Analytics'], popular: true },
      { id: 'pkg15', name: 'Franchise', price: 2499, features: ['Unlimited Locations', 'Central Management', 'Franchisee Portal'], popular: false }
    ],
    technologies: ['Angular', 'Django', 'PostgreSQL'],
    deploymentTime: '7-10 days',
    supportLevel: '24/7'
  },
  {
    id: 'srv6',
    name: 'Learning Management System',
    category: 'Website',
    type: 'software',
    description: 'Online learning platform with video streaming and certification',
    image: null,
    status: 'development',
    rating: 0,
    clients: 0,
    revenue: 0,
    packages: [
      { id: 'pkg16', name: 'Educator', price: 299, features: ['100 Students', 'Video Courses', 'Quizzes'], popular: false },
      { id: 'pkg17', name: 'Institution', price: 999, features: ['1000 Students', 'Live Classes', 'Certificates'], popular: true },
      { id: 'pkg18', name: 'University', price: 4999, features: ['Unlimited Students', 'White Label', 'Analytics'], popular: false }
    ],
    technologies: ['React', 'Python', 'AWS S3'],
    deploymentTime: '14-21 days',
    supportLevel: 'Business hours'
  }
]

const categoryIcons = {
  'POS System': ShoppingBag,
  'Website': Globe,
  'Mobile App': Smartphone,
  'Application': Layers,
  'API Service': Code,
  'Cloud Service': Cloud,
  'Database': Database,
  'Security': Shield
}

const categoryColors = {
  'POS System': 'from-blue-600 to-cyan-600',
  'Website': 'from-purple-600 to-pink-600',
  'Mobile App': 'from-green-600 to-emerald-600',
  'Application': 'from-orange-600 to-yellow-600',
  'API Service': 'from-indigo-600 to-purple-600',
  'Cloud Service': 'from-teal-600 to-cyan-600',
  'Database': 'from-red-600 to-pink-600',
  'Security': 'from-gray-600 to-slate-600'
}

const statusColors = {
  'active': 'bg-green-500/20 text-green-400 border-green-500/30',
  'development': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'maintenance': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'deprecated': 'bg-red-500/20 text-red-400 border-red-500/30'
}

export default function ServicesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9

  const categories = ['all', ...new Set(mockServices.map(s => s.category))]

  const filteredServices = mockServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || service.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedServices = filteredServices.slice(startIndex, startIndex + itemsPerPage)

  // Handle export
  const handleExport = () => {
    const csvContent = [
      ['Name', 'Category', 'Status', 'Rating', 'Clients', 'Revenue', 'Technologies', 'Support Level'].join(','),
      ...filteredServices.map(s => [
        s.name,
        s.category,
        s.status,
        s.rating,
        s.clients,
        `$${s.revenue}`,
        s.technologies.join('; '),
        s.supportLevel
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'services.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const totalRevenue = mockServices.reduce((sum, s) => sum + s.revenue, 0)
  const totalClients = mockServices.reduce((sum, s) => sum + s.clients, 0)
  const activeServices = mockServices.filter(s => s.status === 'active').length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Services & Software</h1>
          <p className="text-gray-400">Manage software services and packages</p>
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
            href="/dashboard/services/new"
            className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Service</span>
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
            <span className="text-gray-400">Total Services</span>
            <Zap className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{mockServices.length}</p>
          <p className="text-xs text-gray-500 mt-1">{activeServices} active</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Total Revenue</span>
            <DollarSign className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">${(totalRevenue / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-500 mt-1">All time</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Active Clients</span>
            <Users className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totalClients}</p>
          <p className="text-xs text-gray-500 mt-1">Using services</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Avg. Rating</span>
            <Star className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">4.7</p>
          <div className="flex items-center space-x-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
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
            placeholder="Search services..."
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
          <option value="development">In Development</option>
          <option value="maintenance">Maintenance</option>
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

      {/* Services Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-6">
          {paginatedServices.map((service) => {
            const Icon = categoryIcons[service.category] || Layers
            const gradientColor = categoryColors[service.category] || 'from-gray-600 to-gray-500'

            return (
              <Link
                key={service.id}
                href={`/dashboard/services/${service.id}`}
                className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6 hover:border-purple-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradientColor} flex items-center justify-center`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{service.name}</h3>
                      <p className="text-sm text-gray-400">{service.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => e.preventDefault()}
                    className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-gray-800 transition-all"
                  >
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </button>
                </div>

                <p className="text-sm text-gray-300 mb-4 line-clamp-2">{service.description}</p>

                {/* Packages Preview */}
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2">Packages:</p>
                  <div className="flex flex-wrap gap-2">
                    {service.packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`px-2 py-1 rounded-lg text-xs ${
                          pkg.popular
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-gray-800 text-gray-400'
                        }`}
                      >
                        {pkg.name}: ${pkg.price}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Clients</p>
                    <p className="text-lg font-semibold text-white">{service.clients}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Revenue</p>
                    <p className="text-lg font-semibold text-green-400">${(service.revenue / 1000).toFixed(0)}k</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Rating</p>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-semibold">{service.rating || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-lg text-xs border ${statusColors[service.status]}`}>
                      {service.status.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-400">{service.supportLevel}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {service.technologies.slice(0, 2).map((tech, index) => (
                      <span key={index} className="px-2 py-1 rounded bg-gray-800 text-xs text-gray-400">
                        {tech}
                      </span>
                    ))}
                    {service.technologies.length > 2 && (
                      <span className="text-xs text-gray-500">+{service.technologies.length - 2}</span>
                    )}
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
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Service</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Category</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Packages</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Clients</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Revenue</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Rating</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedServices.map((service) => {
                const Icon = categoryIcons[service.category] || Layers

                return (
                  <tr key={service.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-gray-400" />
                        <Link href={`/dashboard/services/${service.id}`} className="text-white hover:text-purple-400 transition-colors">
                          {service.name}
                        </Link>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{service.category}</td>
                    <td className="py-4 px-6 text-gray-300">{service.packages.length} packages</td>
                    <td className="py-4 px-6 text-white font-medium">{service.clients}</td>
                    <td className="py-4 px-6 text-green-400 font-medium">${(service.revenue / 1000).toFixed(0)}k</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white">{service.rating || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-lg text-xs border ${statusColors[service.status]}`}>
                        {service.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/dashboard/services/${service.id}`}
                          className="p-1 rounded hover:bg-gray-700 transition-colors"
                        >
                          <Eye className="h-4 w-4 text-gray-400" />
                        </Link>
                        <Link
                          href={`/dashboard/services/${service.id}/edit`}
                          className="p-1 rounded hover:bg-gray-700 transition-colors"
                        >
                          <Edit className="h-4 w-4 text-gray-400" />
                        </Link>
                        <button className="p-1 rounded hover:bg-gray-700 transition-colors">
                          <Copy className="h-4 w-4 text-gray-400" />
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
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredServices.length)} of {filteredServices.length} services
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