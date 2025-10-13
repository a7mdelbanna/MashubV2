'use client'

import { useState } from 'react'
import { Package, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, Search, Filter, Download, Eye, Truck } from 'lucide-react'

interface OrderItem {
  id: string
  productId: string
  productName: string
  variantName: string
  sku: string
  quantity: number
  price: number
  total: number
}

interface Order {
  id: string
  orderNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  fulfillmentStatus: 'unfulfilled' | 'partially_fulfilled' | 'fulfilled'
  paymentStatus: 'pending' | 'paid' | 'refunded'
  shippingAddress: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  trackingNumber?: string
  createdAt: string
  shippedAt?: string
  deliveredAt?: string
}

const mockOrders: Order[] = [
  {
    id: 'o1',
    orderNumber: 'ORD-2024-001',
    customerId: 'c1',
    customerName: 'Acme Corporation',
    customerEmail: 'orders@acme.com',
    items: [
      { id: 'oi1', productId: 'p1', productName: 'Enterprise License', variantName: 'Professional', sku: 'ENT-001-PRO', quantity: 10, price: 449, total: 4490 },
      { id: 'oi2', productId: 'p2', productName: 'Cloud Storage', variantName: '1TB Plan', sku: 'CLD-001-1TB', quantity: 10, price: 99, total: 990 }
    ],
    subtotal: 5480,
    tax: 548,
    shipping: 0,
    total: 6028,
    status: 'delivered',
    fulfillmentStatus: 'fulfilled',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '123 Business Ave',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA'
    },
    trackingNumber: 'TRK-8372649283',
    createdAt: '2024-02-15',
    shippedAt: '2024-02-16',
    deliveredAt: '2024-02-20'
  },
  {
    id: 'o2',
    orderNumber: 'ORD-2024-002',
    customerId: 'c2',
    customerName: 'TechStart Inc',
    customerEmail: 'purchasing@techstart.io',
    items: [
      { id: 'oi3', productId: 'p3', productName: 'Hardware Device', variantName: 'Black', sku: 'HW-001-BLK', quantity: 5, price: 549, total: 2745 }
    ],
    subtotal: 2745,
    tax: 274.50,
    shipping: 25,
    total: 3044.50,
    status: 'shipped',
    fulfillmentStatus: 'fulfilled',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '456 Startup Blvd',
      city: 'Austin',
      state: 'TX',
      zip: '78701',
      country: 'USA'
    },
    trackingNumber: 'TRK-9284756392',
    createdAt: '2024-02-28',
    shippedAt: '2024-03-01'
  },
  {
    id: 'o3',
    orderNumber: 'ORD-2024-003',
    customerId: 'c3',
    customerName: 'Global Solutions Ltd',
    customerEmail: 'procurement@globalsolutions.com',
    items: [
      { id: 'oi4', productId: 'p1', productName: 'Enterprise License', variantName: 'Standard', sku: 'ENT-001-STD', quantity: 50, price: 254, total: 12700 },
      { id: 'oi5', productId: 'p4', productName: 'Premium Support', variantName: 'Annual', sku: 'SUP-001-ANN', quantity: 50, price: 199, total: 9950 }
    ],
    subtotal: 22650,
    tax: 2265,
    shipping: 0,
    total: 24915,
    status: 'processing',
    fulfillmentStatus: 'partially_fulfilled',
    paymentStatus: 'paid',
    shippingAddress: {
      street: '789 Enterprise Way',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    createdAt: '2024-03-02'
  },
  {
    id: 'o4',
    orderNumber: 'ORD-2024-004',
    customerId: 'c4',
    customerName: 'Innovation Labs',
    customerEmail: 'orders@innovationlabs.co',
    items: [
      { id: 'oi6', productId: 'p3', productName: 'Hardware Device', variantName: 'White', sku: 'HW-001-WHT', quantity: 2, price: 549, total: 1098 }
    ],
    subtotal: 1098,
    tax: 109.80,
    shipping: 15,
    total: 1222.80,
    status: 'pending',
    fulfillmentStatus: 'unfulfilled',
    paymentStatus: 'pending',
    shippingAddress: {
      street: '321 Innovation Dr',
      city: 'Seattle',
      state: 'WA',
      zip: '98101',
      country: 'USA'
    },
    createdAt: '2024-03-04'
  },
  {
    id: 'o5',
    orderNumber: 'ORD-2024-005',
    customerId: 'c5',
    customerName: 'Digital Ventures',
    customerEmail: 'admin@digitalventures.net',
    items: [
      { id: 'oi7', productId: 'p2', productName: 'Cloud Storage', variantName: '100GB Plan', sku: 'CLD-001-100GB', quantity: 20, price: 49, total: 980 }
    ],
    subtotal: 980,
    tax: 98,
    shipping: 0,
    total: 1078,
    status: 'cancelled',
    fulfillmentStatus: 'unfulfilled',
    paymentStatus: 'refunded',
    shippingAddress: {
      street: '555 Digital Plaza',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90012',
      country: 'USA'
    },
    createdAt: '2024-02-25'
  }
]

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const stats = {
    totalOrders: orders.length,
    totalRevenue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0),
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    avgOrderValue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0) / orders.filter(o => o.paymentStatus === 'paid').length || 0
  }

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          o.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || o.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400'
      case 'processing':
        return 'bg-blue-500/20 text-blue-400'
      case 'shipped':
        return 'bg-purple-500/20 text-purple-400'
      case 'delivered':
        return 'bg-green-500/20 text-green-400'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'processing':
        return <Package className="w-4 h-4" />
      case 'shipped':
        return <Truck className="w-4 h-4" />
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Product Orders</h1>
          <p className="text-gray-400">Track and manage product orders and fulfillment</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
          <Download className="w-5 h-5" />
          Export Orders
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.totalOrders}</p>
          <p className="text-sm text-gray-400">Total Orders</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">${(stats.totalRevenue / 1000).toFixed(1)}k</p>
          <p className="text-sm text-gray-400">Total Revenue</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.pending + stats.processing}</p>
          <p className="text-sm text-gray-400">Awaiting Fulfillment</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">${stats.avgOrderValue.toFixed(0)}</p>
          <p className="text-sm text-gray-400">Avg Order Value</p>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search orders by number or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:bg-gray-700/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{order.orderNumber}</h3>
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status.toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.paymentStatus === 'paid' ? 'bg-green-500/20 text-green-400' :
                    order.paymentStatus === 'refunded' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {order.paymentStatus.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                  <span>{order.customerName}</span>
                  <span>•</span>
                  <span>{order.customerEmail}</span>
                  <span>•</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="bg-gray-900/50 rounded-lg p-4 mb-3">
                  <h4 className="text-sm font-medium text-white mb-3">Order Items</h4>
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <div className="flex-1">
                          <p className="text-white">{item.productName} - {item.variantName}</p>
                          <p className="text-xs text-gray-400">SKU: {item.sku} • Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium text-white">${item.total.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-700 space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white">${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Tax</span>
                      <span className="text-white">${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Shipping</span>
                      <span className="text-white">${order.shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-base font-medium pt-2 border-t border-gray-700">
                      <span className="text-white">Total</span>
                      <span className="text-white">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-900/50 rounded-lg p-3">
                    <p className="text-gray-400 mb-1">Shipping Address</p>
                    <p className="text-white text-xs">
                      {order.shippingAddress.street}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
                      {order.shippingAddress.country}
                    </p>
                  </div>
                  {order.trackingNumber && (
                    <div className="bg-gray-900/50 rounded-lg p-3">
                      <p className="text-gray-400 mb-1">Tracking Number</p>
                      <p className="text-purple-400 font-mono text-xs">{order.trackingNumber}</p>
                      {order.shippedAt && (
                        <p className="text-gray-500 text-xs mt-1">
                          Shipped: {new Date(order.shippedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                </button>
                {order.status === 'pending' && (
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm">
                    Process
                  </button>
                )}
                {order.status === 'processing' && (
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                    Ship
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-12 text-center">
          <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No orders found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
