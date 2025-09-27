'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Download, Printer, Edit, Trash2, RefreshCw,
  CheckCircle, Clock, Truck, Package, Building, User, Mail,
  Phone, MapPin, Calendar, DollarSign, Hash, FileText,
  AlertTriangle, XCircle, Copy, Archive, Eye, MoreVertical
} from 'lucide-react'

// Mock purchase order data
const mockPurchaseOrder = {
  id: 'PO-2024-001',
  number: 'PO-2024-001',
  date: '2024-03-20',
  vendor: {
    id: 'v1',
    name: 'Dell Technologies',
    contact: 'John Smith',
    email: 'john@dell.com',
    phone: '+1 (555) 123-4567',
    address: '1 Dell Way, Round Rock, TX 78682'
  },
  status: 'delivered',
  items: [
    {
      id: 'item1',
      product: 'Dell UltraSharp 27" Monitor',
      sku: 'DL-MON-27-4K',
      description: 'Professional 27-inch 4K UHD monitor',
      quantity: 10,
      unitPrice: 599.99,
      total: 5999.90
    },
    {
      id: 'item2',
      product: 'Dell Wireless Mouse',
      sku: 'DL-MOU-WL',
      description: 'Ergonomic wireless mouse',
      quantity: 10,
      unitPrice: 29.99,
      total: 299.90
    },
    {
      id: 'item3',
      product: 'Dell USB-C Hub',
      sku: 'DL-HUB-USC',
      description: '7-in-1 USB-C hub with HDMI',
      quantity: 5,
      unitPrice: 89.99,
      total: 449.95
    }
  ],
  subtotal: 6749.75,
  tax: 674.98,
  shipping: 50.00,
  discount: 0,
  total: 7474.73,
  paymentStatus: 'paid',
  paymentTerms: 'Net 30',
  paymentMethod: 'Bank Transfer',
  dueDate: '2024-04-19',
  paidDate: '2024-04-15',
  deliveryDate: '2024-03-25',
  expectedDelivery: '2024-03-24',
  trackingNumber: 'DL123456789',
  trackingUrl: 'https://tracking.dell.com/DL123456789',
  shippingAddress: {
    name: 'Mashub Technologies',
    street: '123 Tech Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'United States'
  },
  billingAddress: {
    name: 'Mashub Technologies',
    street: '123 Tech Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'United States'
  },
  notes: 'Urgent order for new office setup. Please ensure delivery by March 25th.',
  internalNotes: 'Equipment for new team members starting March 26th.',
  approvedBy: 'Sarah Johnson',
  approvedDate: '2024-03-20',
  createdBy: 'Mike Chen',
  createdAt: '2024-03-20T09:30:00Z',
  lastModified: '2024-03-25T16:45:00Z',
  history: [
    {
      date: '2024-03-20T09:30:00Z',
      action: 'created',
      user: 'Mike Chen',
      details: 'Purchase order created'
    },
    {
      date: '2024-03-20T10:15:00Z',
      action: 'approved',
      user: 'Sarah Johnson',
      details: 'Purchase order approved'
    },
    {
      date: '2024-03-20T14:30:00Z',
      action: 'sent',
      user: 'System',
      details: 'Purchase order sent to vendor'
    },
    {
      date: '2024-03-22T11:20:00Z',
      action: 'confirmed',
      user: 'John Smith (Dell)',
      details: 'Order confirmed by vendor'
    },
    {
      date: '2024-03-24T08:00:00Z',
      action: 'shipped',
      user: 'System',
      details: 'Order shipped - Tracking: DL123456789'
    },
    {
      date: '2024-03-25T16:45:00Z',
      action: 'delivered',
      user: 'System',
      details: 'Order delivered and received'
    }
  ],
  attachments: [
    { name: 'purchase_order_PO-2024-001.pdf', size: '234 KB', type: 'PDF' },
    { name: 'vendor_quote.pdf', size: '156 KB', type: 'PDF' },
    { name: 'delivery_receipt.jpg', size: '89 KB', type: 'Image' }
  ]
}

const statusColors = {
  'pending': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'approved': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'sent': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'confirmed': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'shipped': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'delivered': 'bg-green-500/20 text-green-400 border-green-500/30',
  'cancelled': 'bg-red-500/20 text-red-400 border-red-500/30'
}

const paymentStatusColors = {
  'pending': 'text-yellow-400',
  'paid': 'text-green-400',
  'overdue': 'text-red-400',
  'cancelled': 'text-gray-400'
}

export default function PurchaseOrderDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('details')
  const [showActions, setShowActions] = useState(false)

  const po = mockPurchaseOrder

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return Clock
      case 'approved': return CheckCircle
      case 'sent': return Mail
      case 'confirmed': return CheckCircle
      case 'shipped': return Truck
      case 'delivered': return Package
      case 'cancelled': return XCircle
      default: return AlertTriangle
    }
  }

  const tabs = [
    { id: 'details', label: 'Order Details' },
    { id: 'tracking', label: 'Tracking & Delivery' },
    { id: 'payment', label: 'Payment & Billing' },
    { id: 'history', label: 'Order History' },
    { id: 'attachments', label: 'Documents' }
  ]

  const StatusIcon = getStatusIcon(po.status)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/purchases"
            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">{po.number}</h1>
            <p className="text-gray-400">Purchase Order Details</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </button>
          <button className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors flex items-center space-x-2">
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </button>
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
            >
              <MoreVertical className="h-4 w-4" />
              <span>Actions</span>
            </button>
            {showActions && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-lg bg-gray-800 border border-gray-700 shadow-xl z-10">
                <div className="p-2">
                  <button className="w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors flex items-center space-x-2">
                    <Edit className="h-4 w-4" />
                    <span>Edit Order</span>
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors flex items-center space-x-2">
                    <Copy className="h-4 w-4" />
                    <span>Duplicate</span>
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors flex items-center space-x-2">
                    <RefreshCw className="h-4 w-4" />
                    <span>Reorder</span>
                  </button>
                  <div className="border-t border-gray-700 my-2"></div>
                  <button className="w-full text-left px-3 py-2 rounded-lg text-yellow-400 hover:bg-gray-700 transition-colors flex items-center space-x-2">
                    <Archive className="h-4 w-4" />
                    <span>Archive</span>
                  </button>
                  <button className="w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-gray-700 transition-colors flex items-center space-x-2">
                    <Trash2 className="h-4 w-4" />
                    <span>Cancel Order</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status Card */}
      <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl gradient-purple">
              <StatusIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{po.vendor.name}</h2>
              <p className="text-gray-400">Order placed on {new Date(po.date).toLocaleDateString()}</p>
            </div>
          </div>
          <div className="text-right">
            <span className={`inline-flex items-center px-3 py-1 rounded-lg text-sm border ${statusColors[po.status]}`}>
              {po.status.toUpperCase()}
            </span>
            <p className="text-2xl font-bold text-white mt-2">${po.total.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-gray-400 text-sm">Payment Status</p>
            <p className={`font-medium ${paymentStatusColors[po.paymentStatus]}`}>
              {po.paymentStatus.toUpperCase()}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Expected Delivery</p>
            <p className="text-white font-medium">{new Date(po.expectedDelivery).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Items</p>
            <p className="text-white font-medium">{po.items.length} items</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Quantity</p>
            <p className="text-white font-medium">{po.items.reduce((sum, item) => sum + item.quantity, 0)} units</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-1">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
        {/* Order Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Vendor Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Vendor Information</h3>
                <div className="p-4 rounded-lg bg-gray-800/30 space-y-3">
                  <div className="flex items-center space-x-3">
                    <Building className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-white font-medium">{po.vendor.name}</p>
                      <p className="text-gray-400 text-sm">Primary Vendor</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-white">{po.vendor.contact}</p>
                      <p className="text-gray-400 text-sm">Contact Person</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-white">{po.vendor.email}</p>
                      <p className="text-gray-400 text-sm">Email Address</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-white">{po.vendor.phone}</p>
                      <p className="text-gray-400 text-sm">Phone Number</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Order Information</h3>
                <div className="p-4 rounded-lg bg-gray-800/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Order Number</span>
                    <span className="text-white font-mono">{po.number}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Order Date</span>
                    <span className="text-white">{new Date(po.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Payment Terms</span>
                    <span className="text-white">{po.paymentTerms}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Due Date</span>
                    <span className="text-white">{new Date(po.dueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Created By</span>
                    <span className="text-white">{po.createdBy}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Approved By</span>
                    <span className="text-white">{po.approvedBy}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
              <div className="rounded-lg bg-gray-800/30 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Product</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">SKU</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Quantity</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Unit Price</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {po.items.map((item, index) => (
                      <tr key={item.id} className={index > 0 ? 'border-t border-gray-700' : ''}>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-white font-medium">{item.product}</p>
                            <p className="text-gray-400 text-sm">{item.description}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-300 font-mono text-sm">{item.sku}</td>
                        <td className="py-3 px-4 text-right text-white">{item.quantity}</td>
                        <td className="py-3 px-4 text-right text-white">${item.unitPrice.toFixed(2)}</td>
                        <td className="py-3 px-4 text-right text-white font-medium">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Summary */}
              <div className="mt-4 flex justify-end">
                <div className="w-80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">${po.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Tax</span>
                    <span className="text-white">${po.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-white">${po.shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 flex items-center justify-between">
                    <span className="text-lg font-semibold text-white">Total</span>
                    <span className="text-lg font-bold text-green-400">${po.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {(po.notes || po.internalNotes) && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Notes</h3>
                <div className="space-y-4">
                  {po.notes && (
                    <div className="p-4 rounded-lg bg-gray-800/30">
                      <p className="text-sm font-medium text-gray-400 mb-2">Vendor Notes</p>
                      <p className="text-white">{po.notes}</p>
                    </div>
                  )}
                  {po.internalNotes && (
                    <div className="p-4 rounded-lg bg-gray-800/30">
                      <p className="text-sm font-medium text-gray-400 mb-2">Internal Notes</p>
                      <p className="text-white">{po.internalNotes}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tracking & Delivery Tab */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            {/* Tracking Information */}
            {po.trackingNumber && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Tracking Information</h3>
                <div className="p-4 rounded-lg bg-gray-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white font-medium">Tracking Number</p>
                      <p className="text-gray-400 font-mono">{po.trackingNumber}</p>
                    </div>
                    <a
                      href={po.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg gradient-purple text-white hover:opacity-90 transition-all flex items-center space-x-2"
                    >
                      <Eye className="h-4 w-4" />
                      <span>Track Package</span>
                    </a>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Shipped Date</p>
                      <p className="text-white">{new Date('2024-03-24').toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Expected Delivery</p>
                      <p className="text-white">{new Date(po.expectedDelivery).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Delivery Addresses */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Shipping Address</h3>
                <div className="p-4 rounded-lg bg-gray-800/30">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-white font-medium">{po.shippingAddress.name}</p>
                      <p className="text-gray-300">{po.shippingAddress.street}</p>
                      <p className="text-gray-300">
                        {po.shippingAddress.city}, {po.shippingAddress.state} {po.shippingAddress.zipCode}
                      </p>
                      <p className="text-gray-300">{po.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Billing Address</h3>
                <div className="p-4 rounded-lg bg-gray-800/30">
                  <div className="flex items-start space-x-3">
                    <Building className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-white font-medium">{po.billingAddress.name}</p>
                      <p className="text-gray-300">{po.billingAddress.street}</p>
                      <p className="text-gray-300">
                        {po.billingAddress.city}, {po.billingAddress.state} {po.billingAddress.zipCode}
                      </p>
                      <p className="text-gray-300">{po.billingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Status */}
            {po.status === 'delivered' && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Delivery Confirmation</h3>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-400" />
                    <div>
                      <p className="text-green-400 font-medium">Order Delivered Successfully</p>
                      <p className="text-gray-400 text-sm">
                        Delivered on {new Date(po.deliveryDate).toLocaleDateString()} at 4:45 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Payment & Billing Tab */}
        {activeTab === 'payment' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Payment Information */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Payment Information</h3>
                <div className="p-4 rounded-lg bg-gray-800/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Payment Status</span>
                    <span className={`font-medium ${paymentStatusColors[po.paymentStatus]}`}>
                      {po.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Payment Method</span>
                    <span className="text-white">{po.paymentMethod}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Payment Terms</span>
                    <span className="text-white">{po.paymentTerms}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Due Date</span>
                    <span className="text-white">{new Date(po.dueDate).toLocaleDateString()}</span>
                  </div>
                  {po.paidDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Paid Date</span>
                      <span className="text-green-400">{new Date(po.paidDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Summary */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Financial Summary</h3>
                <div className="p-4 rounded-lg bg-gray-800/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">${po.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Tax (10%)</span>
                    <span className="text-white">${po.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-white">${po.shipping.toFixed(2)}</span>
                  </div>
                  {po.discount > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Discount</span>
                      <span className="text-green-400">-${po.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-700 pt-3 flex items-center justify-between">
                    <span className="text-lg font-semibold text-white">Total Amount</span>
                    <span className="text-lg font-bold text-green-400">${po.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Actions */}
            {po.paymentStatus === 'pending' && (
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-400 font-medium">Payment Required</p>
                    <p className="text-gray-400 text-sm">
                      Payment of ${po.total.toFixed(2)} is due by {new Date(po.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <button className="px-4 py-2 rounded-lg gradient-purple text-white hover:opacity-90 transition-all">
                    Record Payment
                  </button>
                </div>
              </div>
            )}

            {po.paymentStatus === 'paid' && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div>
                    <p className="text-green-400 font-medium">Payment Completed</p>
                    <p className="text-gray-400 text-sm">
                      Payment of ${po.total.toFixed(2)} was received on {new Date(po.paidDate!).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Order Activity Timeline</h3>
            <div className="space-y-4">
              {po.history.map((event, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-white font-medium capitalize">{event.action}</p>
                      <span className="text-gray-500">•</span>
                      <p className="text-gray-400 text-sm">{new Date(event.date).toLocaleString()}</p>
                    </div>
                    <p className="text-gray-400 text-sm">{event.details}</p>
                    <p className="text-gray-500 text-xs">By {event.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attachments Tab */}
        {activeTab === 'attachments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Order Documents</h3>
              <button className="px-4 py-2 rounded-lg gradient-purple text-white hover:opacity-90 transition-all flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Upload Document</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {po.attachments.map((file, index) => (
                <div key={index} className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                  <div className="flex items-center space-x-3 mb-3">
                    <FileText className="h-8 w-8 text-purple-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{file.name}</p>
                      <p className="text-gray-400 text-xs">{file.size} • {file.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="flex-1 px-3 py-1.5 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors text-sm">
                      <Download className="h-3 w-3 inline mr-1" />
                      Download
                    </button>
                    <button className="px-3 py-1.5 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                      <Eye className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}