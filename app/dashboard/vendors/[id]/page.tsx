'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Building, Phone, Mail, Globe, MapPin,
  Edit, Trash2, Package, DollarSign, TrendingUp,
  Calendar, Clock, CheckCircle, AlertCircle, Star,
  MoreVertical, Download, Share2, FileText, ShoppingCart,
  Briefcase, Users, Receipt, Activity, MessageSquare,
  BarChart3, PieChart, CreditCard, Truck, Tag,
  ExternalLink, Copy, Printer, Archive, Send,
  ChevronRight, Plus, Filter
} from 'lucide-react'

// Mock vendor data
const mockVendor = {
  id: 'VND-001',
  name: 'TechSupply Pro',
  category: 'Technology',
  logo: 'TS',
  status: 'active',
  rating: 4.8,

  contact: {
    email: 'sales@techsupplypro.com',
    phone: '+1 555-0200',
    website: 'www.techsupplypro.com',
    supportEmail: 'support@techsupplypro.com',
    supportPhone: '+1 555-0201'
  },

  address: {
    street: '456 Supply Avenue',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States'
  },

  accountManager: {
    name: 'Jessica Chen',
    role: 'Account Executive',
    email: 'jessica@techsupplypro.com',
    phone: '+1 555-0202',
    avatar: 'JC'
  },

  businessInfo: {
    taxId: 'XX-XXXXXXX',
    businessLicense: 'BL-2023-001',
    established: '2010',
    employees: '500+',
    annualRevenue: '$50M+'
  },

  paymentTerms: {
    terms: 'Net 30',
    currency: 'USD',
    methods: ['Wire Transfer', 'Credit Card', 'ACH'],
    creditLimit: 100000,
    discount: '2% 10 Net 30'
  },

  performance: {
    totalOrders: 156,
    totalSpent: 485000,
    avgOrderValue: 3109,
    onTimeDelivery: 98,
    qualityScore: 95,
    responseTime: '< 2 hours'
  },

  products: [
    {
      id: 'p1',
      name: 'Dell Laptop Pro',
      category: 'Computers',
      price: 1299,
      inStock: true,
      moq: 5
    },
    {
      id: 'p2',
      name: 'Office Chair Premium',
      category: 'Furniture',
      price: 599,
      inStock: true,
      moq: 10
    },
    {
      id: 'p3',
      name: 'Wireless Mouse',
      category: 'Accessories',
      price: 49,
      inStock: false,
      moq: 20
    }
  ],

  recentOrders: [
    {
      id: 'PO-2024-089',
      date: '2024-03-15',
      items: 12,
      total: 15600,
      status: 'delivered'
    },
    {
      id: 'PO-2024-076',
      date: '2024-03-01',
      items: 8,
      total: 8400,
      status: 'shipped'
    },
    {
      id: 'PO-2024-065',
      date: '2024-02-20',
      items: 15,
      total: 22500,
      status: 'delivered'
    }
  ],

  certifications: ['ISO 9001', 'ISO 14001', 'Authorized Reseller'],
  tags: ['Preferred', 'Technology', 'Fast Delivery', 'Premium'],

  joinedDate: '2023-01-15',
  lastOrderDate: '2024-03-15',
  nextReviewDate: '2024-06-01'
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: PieChart },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'orders', label: 'Orders', icon: ShoppingCart },
  { id: 'performance', label: 'Performance', icon: BarChart3 },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'notes', label: 'Notes', icon: MessageSquare }
]

export default function VendorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'inactive': return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
      case 'suspended': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'shipped': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'processing': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/vendors"
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
                {mockVendor.logo}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{mockVendor.name}</h1>
                <div className="flex items-center space-x-3 mt-1">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(mockVendor.status)}`}>
                    {mockVendor.status.toUpperCase()}
                  </span>
                  <span className="text-gray-400">{mockVendor.category}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-medium">{mockVendor.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white">
            <Printer className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white">
            <Share2 className="h-5 w-5" />
          </button>
          <Link
            href={`/dashboard/purchases/new?vendor=${mockVendor.id}`}
            className="px-4 py-2 bg-green-600/10 border border-green-600/20 rounded-xl text-green-400 font-medium hover:bg-green-600/20 transition-colors flex items-center"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Create Order
          </Link>
          <Link
            href={`/dashboard/vendors/${params.id}/edit`}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl text-white font-medium hover:opacity-90 transition-opacity flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Vendor
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-red-400"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <ShoppingCart className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-gray-500">Total Orders</span>
          </div>
          <p className="text-2xl font-bold text-white">{mockVendor.performance.totalOrders}</p>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-4 w-4 text-green-400" />
            <span className="text-xs text-gray-500">Total Spent</span>
          </div>
          <p className="text-2xl font-bold text-white">${(mockVendor.performance.totalSpent / 1000).toFixed(0)}K</p>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-gray-500">Avg Order</span>
          </div>
          <p className="text-2xl font-bold text-white">${mockVendor.performance.avgOrderValue}</p>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <Truck className="h-4 w-4 text-orange-400" />
            <span className="text-xs text-gray-500">On-Time</span>
          </div>
          <p className="text-2xl font-bold text-white">{mockVendor.performance.onTimeDelivery}%</p>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-xs text-gray-500">Quality</span>
          </div>
          <p className="text-2xl font-bold text-white">{mockVendor.performance.qualityScore}%</p>
        </div>

        <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl border border-gray-700/50 p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="h-4 w-4 text-cyan-400" />
            <span className="text-xs text-gray-500">Response</span>
          </div>
          <p className="text-lg font-bold text-white">{mockVendor.performance.responseTime}</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl border border-gray-700/50 p-1 mb-6">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Sales Email</p>
                        <p className="text-white">{mockVendor.contact.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Sales Phone</p>
                        <p className="text-white">{mockVendor.contact.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Support Email</p>
                        <p className="text-white">{mockVendor.contact.supportEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-xs text-gray-400">Website</p>
                        <a href={`https://${mockVendor.contact.website}`} className="text-purple-400 hover:text-purple-300 flex items-center">
                          {mockVendor.contact.website}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Address</h3>
                  <div className="flex items-start space-x-3 p-4 bg-gray-800/50 rounded-xl">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-white">{mockVendor.address.street}</p>
                      <p className="text-gray-300">
                        {mockVendor.address.city}, {mockVendor.address.state} {mockVendor.address.zip}
                      </p>
                      <p className="text-gray-300">{mockVendor.address.country}</p>
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Business Information</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Established</p>
                      <p className="text-white font-medium">{mockVendor.businessInfo.established}</p>
                    </div>
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Employees</p>
                      <p className="text-white font-medium">{mockVendor.businessInfo.employees}</p>
                    </div>
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Annual Revenue</p>
                      <p className="text-white font-medium">{mockVendor.businessInfo.annualRevenue}</p>
                    </div>
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {mockVendor.certifications.map((cert, index) => (
                      <span key={index} className="px-3 py-1 rounded-full bg-green-600/20 text-green-400 text-sm">
                        <CheckCircle className="inline h-3 w-3 mr-1" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Available Products</h3>
                  <button className="px-3 py-1 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors">
                    Request Catalog
                  </button>
                </div>
                <div className="space-y-3">
                  {mockVendor.products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-sm text-gray-400">{product.category} • MOQ: {product.moq} units</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-white font-medium">${product.price}</p>
                          <span className={`text-xs ${product.inStock ? 'text-green-400' : 'text-red-400'}`}>
                            {product.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                        <button className="px-3 py-1 rounded-lg bg-purple-600/20 text-purple-400 text-sm hover:bg-purple-600/30 transition-colors">
                          Add to Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Recent Orders</h3>
                  <Link
                    href={`/dashboard/purchases/new?vendor=${mockVendor.id}`}
                    className="px-3 py-1 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors"
                  >
                    New Order
                  </Link>
                </div>
                <div className="space-y-3">
                  {mockVendor.recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                      <div>
                        <p className="text-white font-medium">{order.id}</p>
                        <p className="text-sm text-gray-400">{order.date} • {order.items} items</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <p className="text-white font-medium">${order.total.toLocaleString()}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getOrderStatusColor(order.status)}`}>
                          {order.status.toUpperCase()}
                        </span>
                        <Link
                          href={`/dashboard/purchases/${order.id}`}
                          className="text-purple-400 hover:text-purple-300"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-800/50 rounded-xl">
                    <h4 className="text-white font-medium mb-3">Delivery Performance</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">On-Time Delivery</span>
                        <span className="text-green-400 font-medium">{mockVendor.performance.onTimeDelivery}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-400 h-2 rounded-full" style={{ width: `${mockVendor.performance.onTimeDelivery}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-800/50 rounded-xl">
                    <h4 className="text-white font-medium mb-3">Quality Score</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Product Quality</span>
                        <span className="text-blue-400 font-medium">{mockVendor.performance.qualityScore}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${mockVendor.performance.qualityScore}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-800/50 rounded-xl">
                  <h4 className="text-white font-medium mb-3">Response Metrics</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-400">Avg Response Time</p>
                      <p className="text-xl font-bold text-white mt-1">{mockVendor.performance.responseTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Resolution Rate</p>
                      <p className="text-xl font-bold text-white mt-1">98%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Support Rating</p>
                      <p className="text-xl font-bold text-white mt-1">4.9/5</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Documents</h3>
                  <button className="text-purple-400 hover:text-purple-300 text-sm">+ Upload Document</button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="text-white">Service Agreement 2024.pdf</p>
                        <p className="text-sm text-gray-400">2.4 MB • Updated 2024-01-15</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                        <Download className="h-4 w-4 text-gray-400" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                        <ExternalLink className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Notes & Communication</h3>
                <textarea
                  placeholder="Add notes about this vendor..."
                  className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                  rows={6}
                />
                <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl text-white font-medium hover:opacity-90 transition-opacity">
                  Save Note
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-6">
          {/* Account Manager */}
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Account Manager</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center text-white font-medium">
                {mockVendor.accountManager.avatar}
              </div>
              <div>
                <p className="text-white font-medium">{mockVendor.accountManager.name}</p>
                <p className="text-sm text-gray-400">{mockVendor.accountManager.role}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">{mockVendor.accountManager.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">{mockVendor.accountManager.phone}</span>
              </div>
            </div>
            <button className="w-full mt-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm">
              Contact Manager
            </button>
          </div>

          {/* Payment Terms */}
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Payment Terms</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Terms</span>
                <span className="text-white">{mockVendor.paymentTerms.terms}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Credit Limit</span>
                <span className="text-white">${(mockVendor.paymentTerms.creditLimit / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Discount</span>
                <span className="text-green-400">{mockVendor.paymentTerms.discount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Currency</span>
                <span className="text-white">{mockVendor.paymentTerms.currency}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800/30 backdrop-blur-xl rounded-xl border border-gray-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href={`/dashboard/purchases/new?vendor=${mockVendor.id}`}
                className="w-full py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Purchase Order</span>
              </Link>
              <button className="w-full py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm flex items-center justify-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Request Quote</span>
              </button>
              <button className="w-full py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm flex items-center justify-center space-x-2">
                <Receipt className="h-4 w-4" />
                <span>View Statements</span>
              </button>
              <button className="w-full py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm flex items-center justify-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>Send Message</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Delete Vendor</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to delete this vendor? This will remove all associated data and cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-800 rounded-xl text-white font-medium hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle deletion
                  router.push('/dashboard/vendors')
                }}
                className="flex-1 px-4 py-2 bg-red-600 rounded-xl text-white font-medium hover:bg-red-700 transition-colors"
              >
                Delete Vendor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}