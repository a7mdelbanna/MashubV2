'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ShoppingCart, Plus, Search, Filter, Grid, List,
  FileText, Calendar, DollarSign, Package, Building,
  Clock, CheckCircle, AlertCircle, XCircle, Truck,
  Download, Eye, Edit, Trash2, MoreVertical,
  TrendingUp, RefreshCw, Send, Printer
} from 'lucide-react'

// Mock purchase orders data
const mockPurchaseOrders = [
  {
    id: 'PO-2024-001',
    date: '2024-03-20',
    vendor: {
      id: 'v1',
      name: 'Dell Technologies',
      contact: 'John Smith'
    },
    status: 'delivered',
    items: [
      { product: 'Dell UltraSharp 27" Monitor', quantity: 10, unitPrice: 599.99, total: 5999.90 },
      { product: 'Dell Wireless Mouse', quantity: 10, unitPrice: 29.99, total: 299.90 }
    ],
    subtotal: 6299.80,
    tax: 629.98,
    shipping: 50.00,
    total: 6979.78,
    paymentStatus: 'paid',
    paymentTerms: 'Net 30',
    dueDate: '2024-04-19',
    deliveryDate: '2024-03-25',
    trackingNumber: 'DL123456789',
    notes: 'Urgent order for new office setup'
  },
  {
    id: 'PO-2024-002',
    date: '2024-03-18',
    vendor: {
      id: 'v2',
      name: 'HP Inc.',
      contact: 'Jane Doe'
    },
    status: 'shipped',
    items: [
      { product: 'HP LaserJet Pro', quantity: 5, unitPrice: 399.99, total: 1999.95 },
      { product: 'HP Toner Cartridge', quantity: 20, unitPrice: 89.99, total: 1799.80 }
    ],
    subtotal: 3799.75,
    tax: 379.98,
    shipping: 35.00,
    total: 4214.73,
    paymentStatus: 'pending',
    paymentTerms: 'Net 45',
    dueDate: '2024-05-02',
    deliveryDate: '2024-03-28',
    trackingNumber: 'HP987654321',
    notes: 'Replacement for old printers'
  },
  {
    id: 'PO-2024-003',
    date: '2024-03-15',
    vendor: {
      id: 'v3',
      name: 'Microsoft',
      contact: 'Mike Chen'
    },
    status: 'pending',
    items: [
      { product: 'Office 365 Business Premium', quantity: 50, unitPrice: 22.00, total: 1100.00 },
      { product: 'Windows 11 Pro License', quantity: 25, unitPrice: 199.99, total: 4999.75 }
    ],
    subtotal: 6099.75,
    tax: 609.98,
    shipping: 0,
    total: 6709.73,
    paymentStatus: 'pending',
    paymentTerms: 'Net 30',
    dueDate: '2024-04-14',
    deliveryDate: null,
    trackingNumber: null,
    notes: 'Annual license renewal'
  },
  {
    id: 'PO-2024-004',
    date: '2024-03-12',
    vendor: {
      id: 'v1',
      name: 'Dell Technologies',
      contact: 'John Smith'
    },
    status: 'cancelled',
    items: [
      { product: 'Dell Latitude Laptop', quantity: 3, unitPrice: 1299.99, total: 3899.97 }
    ],
    subtotal: 3899.97,
    tax: 389.99,
    shipping: 0,
    total: 4289.96,
    paymentStatus: 'cancelled',
    paymentTerms: 'Net 30',
    dueDate: '2024-04-11',
    deliveryDate: null,
    trackingNumber: null,
    notes: 'Order cancelled - found better pricing'
  },
  {
    id: 'PO-2024-005',
    date: '2024-03-10',
    vendor: {
      id: 'v4',
      name: 'Amazon Web Services',
      contact: 'Sarah Lee'
    },
    status: 'approved',
    items: [
      { product: 'AWS Reserved Instances', quantity: 10, unitPrice: 500.00, total: 5000.00 },
      { product: 'AWS Storage (TB)', quantity: 100, unitPrice: 23.00, total: 2300.00 }
    ],
    subtotal: 7300.00,
    tax: 0,
    shipping: 0,
    total: 7300.00,
    paymentStatus: 'pending',
    paymentTerms: 'Monthly billing',
    dueDate: '2024-04-01',
    deliveryDate: '2024-03-10',
    trackingNumber: null,
    notes: 'Cloud infrastructure for Q2'
  },
  {
    id: 'PO-2024-006',
    date: '2024-03-08',
    vendor: {
      id: 'v5',
      name: 'Adobe Systems',
      contact: 'Tom Wilson'
    },
    status: 'delivered',
    items: [
      { product: 'Creative Cloud Teams', quantity: 15, unitPrice: 79.99, total: 1199.85 }
    ],
    subtotal: 1199.85,
    tax: 119.99,
    shipping: 0,
    total: 1319.84,
    paymentStatus: 'paid',
    paymentTerms: 'Annual subscription',
    dueDate: '2024-03-08',
    deliveryDate: '2024-03-08',
    trackingNumber: null,
    notes: 'Design team licenses'
  }
]

const statusColors = {
  'pending': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'approved': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'shipped': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'delivered': 'bg-green-500/20 text-green-400 border-green-500/30',
  'cancelled': 'bg-red-500/20 text-red-400 border-red-500/30'
}

const paymentStatusColors = {
  'paid': 'text-green-400',
  'pending': 'text-yellow-400',
  'overdue': 'text-red-400',
  'cancelled': 'text-gray-400'
}

export default function PurchasesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedVendor, setSelectedVendor] = useState('all')

  const vendors = ['all', ...new Set(mockPurchaseOrders.map(po => po.vendor.name))]

  const filteredOrders = mockPurchaseOrders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.vendor.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus
    const matchesVendor = selectedVendor === 'all' || order.vendor.name === selectedVendor
    return matchesSearch && matchesStatus && matchesVendor
  })

  const totalOrders = mockPurchaseOrders.length
  const totalSpent = mockPurchaseOrders.reduce((sum, po) => po.status !== 'cancelled' ? sum + po.total : sum, 0)
  const pendingOrders = mockPurchaseOrders.filter(po => po.status === 'pending').length
  const overduePayments = mockPurchaseOrders.filter(po =>
    po.paymentStatus === 'pending' && new Date(po.dueDate) < new Date()
  ).length

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return Clock
      case 'approved': return CheckCircle
      case 'shipped': return Truck
      case 'delivered': return Package
      case 'cancelled': return XCircle
      default: return AlertCircle
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Purchase Orders</h1>
          <p className="text-gray-400">Manage vendor orders and procurement</p>
        </div>

        <Link
          href="/dashboard/purchases/new"
          className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Purchase Order</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Total Orders</span>
            <ShoppingCart className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totalOrders}</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Total Spent</span>
            <DollarSign className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">${(totalSpent / 1000).toFixed(1)}K</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Pending Orders</span>
            <Clock className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{pendingOrders}</p>
          <p className="text-xs text-yellow-400 mt-1">Awaiting approval</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Overdue Payments</span>
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-white">{overduePayments}</p>
          <p className="text-xs text-red-400 mt-1">Requires attention</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order number or vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={selectedVendor}
          onChange={(e) => setSelectedVendor(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
        >
          {vendors.map(vendor => (
            <option key={vendor} value={vendor}>
              {vendor === 'all' ? 'All Vendors' : vendor}
            </option>
          ))}
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

      {/* Orders List */}
      {viewMode === 'list' ? (
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800">
          <table className="w-full">
            <thead className="border-b border-gray-800">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Order ID</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Date</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Vendor</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Items</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Total</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Payment</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const StatusIcon = getStatusIcon(order.status)
                const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)

                return (
                  <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <Link href={`/dashboard/purchases/${order.id}`} className="text-white font-mono hover:text-purple-400 transition-colors">
                        {order.id}
                      </Link>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white">{order.vendor.name}</p>
                        <p className="text-xs text-gray-500">{order.vendor.contact}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white">{order.items.length} items</p>
                        <p className="text-xs text-gray-500">{totalItems} units total</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-white font-medium">${order.total.toLocaleString()}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`font-medium ${paymentStatusColors[order.paymentStatus]}`}>
                        {order.paymentStatus.toUpperCase()}
                      </span>
                      {order.paymentStatus === 'pending' && (
                        <p className="text-xs text-gray-500">Due {new Date(order.dueDate).toLocaleDateString()}</p>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className={`h-4 w-4 ${
                          order.status === 'delivered' ? 'text-green-400' :
                          order.status === 'cancelled' ? 'text-red-400' :
                          order.status === 'shipped' ? 'text-purple-400' :
                          order.status === 'approved' ? 'text-blue-400' :
                          'text-gray-400'
                        }`} />
                        <span className={`px-2 py-1 rounded-lg text-xs border ${statusColors[order.status]}`}>
                          {order.status.toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/dashboard/purchases/${order.id}`}
                          className="p-1 rounded hover:bg-gray-700 transition-colors"
                        >
                          <Eye className="h-4 w-4 text-gray-400" />
                        </Link>
                        <button className="p-1 rounded hover:bg-gray-700 transition-colors">
                          <Download className="h-4 w-4 text-gray-400" />
                        </button>
                        <button className="p-1 rounded hover:bg-gray-700 transition-colors">
                          <Printer className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {filteredOrders.map((order) => {
            const StatusIcon = getStatusIcon(order.status)
            const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)

            return (
              <Link
                key={order.id}
                href={`/dashboard/purchases/${order.id}`}
                className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6 hover:border-purple-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-mono text-white font-semibold">{order.id}</h3>
                    <p className="text-sm text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusIcon className={`h-5 w-5 ${
                      order.status === 'delivered' ? 'text-green-400' :
                      order.status === 'cancelled' ? 'text-red-400' :
                      order.status === 'shipped' ? 'text-purple-400' :
                      order.status === 'approved' ? 'text-blue-400' :
                      'text-gray-400'
                    }`} />
                    <span className={`px-2 py-1 rounded-lg text-xs border ${statusColors[order.status]}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-white">{order.vendor.name}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">{order.vendor.contact}</span>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-2">Order Items:</p>
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-300 truncate">{item.product}</span>
                        <span className="text-white">{item.quantity}x</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <p className="text-xs text-gray-500 mt-1">+{order.items.length - 2} more items</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div>
                    <p className="text-xs text-gray-400">Total Amount</p>
                    <p className="text-xl font-bold text-white">${order.total.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Payment Status</p>
                    <p className={`font-medium ${paymentStatusColors[order.paymentStatus]}`}>
                      {order.paymentStatus.toUpperCase()}
                    </p>
                  </div>
                </div>

                {order.trackingNumber && (
                  <div className="mt-3 pt-3 border-t border-gray-800">
                    <div className="flex items-center space-x-2 text-sm">
                      <Truck className="h-4 w-4 text-purple-400" />
                      <span className="text-gray-400">Tracking:</span>
                      <span className="text-white font-mono">{order.trackingNumber}</span>
                    </div>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}