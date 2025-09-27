'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Edit, Trash2, Archive, Package, Box,
  Monitor, DollarSign, Calendar, Shield, Tag,
  User, Building, Phone, Mail, MapPin, Clock,
  TrendingUp, AlertCircle, CheckCircle, Copy,
  QrCode, FileText, Download, Share2, MoreVertical,
  Activity, ShoppingCart, Users, BarChart3
} from 'lucide-react'

// Mock product data
const mockProduct = {
  id: 'prod1',
  name: 'Dell UltraSharp 27" Monitor',
  category: 'Monitor',
  type: 'hardware',
  serialNumber: 'DL-MON-2024-001',
  barcode: '1234567890123',
  vendor: {
    id: 'v1',
    name: 'Dell Technologies',
    contact: 'John Smith',
    email: 'john@dell.com',
    phone: '+1 555-123-4567',
    address: '123 Tech Street, Austin, TX'
  },
  purchaseInfo: {
    date: '2024-01-15',
    orderNumber: 'PO-2024-001',
    invoice: 'INV-2024-001',
    price: 599.99,
    quantity: 20,
    totalCost: 11999.80
  },
  pricing: {
    purchasePrice: 599.99,
    sellingPrice: 899.99,
    margin: 300.00,
    marginPercentage: 50.01
  },
  stock: {
    current: 12,
    allocated: 5,
    available: 7,
    minimum: 5,
    maximum: 25,
    reorderPoint: 8
  },
  warranty: {
    period: '3 years',
    startDate: '2024-01-15',
    endDate: '2027-01-15',
    type: 'Manufacturer',
    coverage: 'Parts and Labor'
  },
  status: 'in_stock',
  specifications: {
    size: '27 inches',
    resolution: '4K UHD (3840x2160)',
    refreshRate: '60Hz',
    panelType: 'IPS',
    connectivity: 'HDMI 2.0, DisplayPort 1.4, USB-C',
    brightness: '350 cd/m²',
    contrastRatio: '1000:1',
    responseTime: '5ms',
    colorGamut: '99% sRGB'
  },
  assignedClients: [
    { id: 'c1', name: 'TechCorp Solutions', quantity: 3, date: '2024-02-01' },
    { id: 'c2', name: 'StartupHub', quantity: 2, date: '2024-02-15' }
  ],
  purchaseHistory: [
    { date: '2024-01-15', quantity: 20, price: 599.99, vendor: 'Dell Technologies' },
    { date: '2023-11-10', quantity: 15, price: 649.99, vendor: 'Dell Technologies' },
    { date: '2023-08-05', quantity: 10, price: 699.99, vendor: 'Dell Technologies' }
  ],
  notes: 'Premium monitor with excellent color accuracy. Popular with design teams.',
  images: []
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Package },
    { id: 'specifications', label: 'Specifications', icon: FileText },
    { id: 'stock', label: 'Stock & Inventory', icon: Box },
    { id: 'clients', label: 'Assigned Clients', icon: Users, count: mockProduct.assignedClients.length },
    { id: 'history', label: 'Purchase History', icon: Clock, count: mockProduct.purchaseHistory.length },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ]

  const stockPercentage = (mockProduct.stock.current / mockProduct.stock.maximum) * 100
  const isLowStock = mockProduct.stock.current <= mockProduct.stock.reorderPoint

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/products"
            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">{mockProduct.name}</h1>
            <div className="flex items-center space-x-4 mt-1">
              <span className="text-gray-400">{mockProduct.category}</span>
              <span className="text-gray-600">•</span>
              <span className="font-mono text-sm text-gray-400">{mockProduct.serialNumber}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all flex items-center space-x-2">
            <Share2 className="h-4 w-4" />
            <span>Share</span>
          </button>
          <Link
            href={`/dashboard/products/${params.id}/edit`}
            className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Product</span>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Current Stock</span>
            <Box className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{mockProduct.stock.current}</p>
          <p className="text-xs text-gray-500 mt-1">
            {mockProduct.stock.available} available
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Selling Price</span>
            <DollarSign className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">${mockProduct.pricing.sellingPrice}</p>
          <p className="text-xs text-green-400 mt-1">
            +{mockProduct.pricing.marginPercentage.toFixed(0)}% margin
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Warranty</span>
            <Shield className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{mockProduct.warranty.period}</p>
          <p className="text-xs text-gray-500 mt-1">Until {new Date(mockProduct.warranty.endDate).toLocaleDateString()}</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Assigned</span>
            <Users className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{mockProduct.stock.allocated}</p>
          <p className="text-xs text-gray-500 mt-1">To {mockProduct.assignedClients.length} clients</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Status</span>
            {isLowStock ? (
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            ) : (
              <CheckCircle className="h-5 w-5 text-green-400" />
            )}
          </div>
          <p className={`text-sm font-medium ${isLowStock ? 'text-yellow-400' : 'text-green-400'}`}>
            {isLowStock ? 'Low Stock' : 'In Stock'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {isLowStock ? 'Reorder needed' : 'Stock healthy'}
          </p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Tab Navigation */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-1">
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
                  {tab.count && (
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Product Info */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Product Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Serial Number</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-white">{mockProduct.serialNumber}</span>
                          <button className="p-1 rounded hover:bg-gray-800 transition-colors">
                            <Copy className="h-3 w-3 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Barcode</span>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-white">{mockProduct.barcode}</span>
                          <button className="p-1 rounded hover:bg-gray-800 transition-colors">
                            <QrCode className="h-3 w-3 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Category</span>
                        <span className="text-white">{mockProduct.category}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Type</span>
                        <span className="text-white capitalize">{mockProduct.type}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Purchase Date</span>
                        <span className="text-white">{new Date(mockProduct.purchaseInfo.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Order Number</span>
                        <span className="text-white">{mockProduct.purchaseInfo.orderNumber}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Invoice</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-white">{mockProduct.purchaseInfo.invoice}</span>
                          <button className="p-1 rounded hover:bg-gray-800 transition-colors">
                            <Download className="h-3 w-3 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Initial Quantity</span>
                        <span className="text-white">{mockProduct.purchaseInfo.quantity} units</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing Information */}
                <div className="border-t border-gray-800 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Pricing Details</h3>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <span className="text-sm text-gray-400 block mb-1">Purchase Price</span>
                      <p className="text-xl font-bold text-white">${mockProduct.pricing.purchasePrice}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <span className="text-sm text-gray-400 block mb-1">Selling Price</span>
                      <p className="text-xl font-bold text-green-400">${mockProduct.pricing.sellingPrice}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <span className="text-sm text-gray-400 block mb-1">Profit Margin</span>
                      <p className="text-xl font-bold text-blue-400">${mockProduct.pricing.margin}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <span className="text-sm text-gray-400 block mb-1">Margin %</span>
                      <p className="text-xl font-bold text-purple-400">{mockProduct.pricing.marginPercentage.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {mockProduct.notes && (
                  <div className="border-t border-gray-800 pt-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Notes</h3>
                    <p className="text-gray-300">{mockProduct.notes}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white mb-4">Technical Specifications</h3>
                <div className="grid grid-cols-2 gap-6">
                  {Object.entries(mockProduct.specifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
                      <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'stock' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Stock Levels</h3>

                  {/* Stock Progress */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Current Stock Level</span>
                      <span className="text-sm text-white">{mockProduct.stock.current} / {mockProduct.stock.maximum}</span>
                    </div>
                    <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          isLowStock ? 'bg-gradient-to-r from-yellow-600 to-orange-600' : 'bg-gradient-to-r from-green-600 to-emerald-600'
                        }`}
                        style={{ width: `${stockPercentage}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">Minimum: {mockProduct.stock.minimum}</span>
                      <span className="text-xs text-yellow-400">Reorder: {mockProduct.stock.reorderPoint}</span>
                      <span className="text-xs text-gray-500">Maximum: {mockProduct.stock.maximum}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Box className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-gray-400">Total Stock</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{mockProduct.stock.current}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Users className="h-4 w-4 text-purple-400" />
                        <span className="text-sm text-gray-400">Allocated</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{mockProduct.stock.allocated}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-sm text-gray-400">Available</span>
                      </div>
                      <p className="text-2xl font-bold text-white">{mockProduct.stock.available}</p>
                    </div>
                  </div>
                </div>

                {isLowStock && (
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5 text-yellow-400" />
                      <div>
                        <p className="text-yellow-400 font-medium">Low Stock Alert</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Stock level is below reorder point. Consider placing a new order with the vendor.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'clients' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Assigned to Clients</h3>
                  <button className="px-3 py-1 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors">
                    Assign to Client
                  </button>
                </div>

                <div className="space-y-3">
                  {mockProduct.assignedClients.map((client) => (
                    <div key={client.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                          <Building className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <Link href={`/dashboard/clients/${client.id}`} className="text-white font-medium hover:text-purple-400 transition-colors">
                            {client.name}
                          </Link>
                          <p className="text-sm text-gray-400">Assigned on {new Date(client.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{client.quantity} units</p>
                        <p className="text-sm text-gray-400">${(client.quantity * mockProduct.pricing.sellingPrice).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white mb-4">Purchase History</h3>

                <div className="space-y-3">
                  {mockProduct.purchaseHistory.map((purchase, index) => (
                    <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
                          <ShoppingCart className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{purchase.vendor}</p>
                          <p className="text-sm text-gray-400">{new Date(purchase.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{purchase.quantity} units</p>
                        <p className="text-sm text-gray-400">${purchase.price} per unit</p>
                        <p className="text-sm text-green-400">${(purchase.quantity * purchase.price).toFixed(2)} total</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white mb-4">Product Analytics</h3>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400">Total Revenue</span>
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-white">
                      ${(mockProduct.stock.allocated * mockProduct.pricing.sellingPrice).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">From {mockProduct.stock.allocated} units sold</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400">Total Profit</span>
                      <DollarSign className="h-5 w-5 text-purple-400" />
                    </div>
                    <p className="text-3xl font-bold text-white">
                      ${(mockProduct.stock.allocated * mockProduct.pricing.margin).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">{mockProduct.pricing.marginPercentage.toFixed(1)}% margin</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400">Turnover Rate</span>
                      <Activity className="h-5 w-5 text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold text-white">2.5x</p>
                    <p className="text-sm text-gray-400 mt-2">Per quarter</p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-gray-400">Avg. Order Size</span>
                      <Package className="h-5 w-5 text-yellow-400" />
                    </div>
                    <p className="text-3xl font-bold text-white">15</p>
                    <p className="text-sm text-gray-400 mt-2">Units per order</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-6">
          {/* Vendor Information */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Vendor Information</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-600 to-yellow-600 flex items-center justify-center">
                  <Building className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{mockProduct.vendor.name}</p>
                  <p className="text-sm text-gray-400">Primary Vendor</p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-gray-800">
                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{mockProduct.vendor.contact}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{mockProduct.vendor.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{mockProduct.vendor.phone}</span>
                </div>
                <div className="flex items-start space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-300">{mockProduct.vendor.address}</span>
                </div>
              </div>

              <button className="w-full py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm">
                Contact Vendor
              </button>
            </div>
          </div>

          {/* Warranty Information */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Warranty Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Type</span>
                <span className="text-sm text-white">{mockProduct.warranty.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Coverage</span>
                <span className="text-sm text-white">{mockProduct.warranty.coverage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Start Date</span>
                <span className="text-sm text-white">{new Date(mockProduct.warranty.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">End Date</span>
                <span className="text-sm text-white">{new Date(mockProduct.warranty.endDate).toLocaleDateString()}</span>
              </div>

              <div className="pt-3 border-t border-gray-800">
                <div className="flex items-center space-x-2 text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Warranty Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm flex items-center justify-center space-x-2">
                <ShoppingCart className="h-4 w-4" />
                <span>Create Purchase Order</span>
              </button>
              <button className="w-full py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm flex items-center justify-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Assign to Client</span>
              </button>
              <button className="w-full py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm flex items-center justify-center space-x-2">
                <QrCode className="h-4 w-4" />
                <span>Generate Barcode</span>
              </button>
              <button className="w-full py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm flex items-center justify-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>View Documents</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}