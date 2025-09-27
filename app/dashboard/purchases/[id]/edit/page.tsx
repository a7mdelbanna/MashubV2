'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Save, X, Plus, Trash2, Building, User, Mail,
  Phone, MapPin, Package, Calendar, DollarSign, FileText,
  CheckCircle, Clock, AlertTriangle, Calculator, Percent,
  Hash, Tag, CreditCard, Truck, Settings, Eye, ChevronRight
} from 'lucide-react'

// Types
interface LineItem {
  id: string
  product: string
  sku: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface Vendor {
  id: string
  name: string
  email: string
  phone: string
  address: string
}

interface Address {
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
}

interface PurchaseOrderData {
  id: string
  number: string
  date: string
  expectedDelivery: string
  vendor: Vendor
  items: LineItem[]
  subtotal: number
  tax: number
  taxRate: number
  shipping: number
  discount: number
  discountType: 'percentage' | 'fixed'
  total: number
  status: 'draft' | 'pending' | 'approved' | 'sent' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
  paymentTerms: string
  paymentMethod: string
  currency: string
  shippingAddress: Address
  billingAddress: Address
  notes: string
  internalNotes: string
  approvalRequired: boolean
  priority: 'low' | 'medium' | 'high' | 'urgent'
  department: string
  project?: string
  budgetCode?: string
  requestedBy: string
  tags: string[]
}

// Mock data
const mockPurchaseOrder: PurchaseOrderData = {
  id: 'PO-2024-001',
  number: 'PO-2024-001',
  date: '2024-03-20',
  expectedDelivery: '2024-03-30',
  vendor: {
    id: 'v1',
    name: 'Dell Technologies',
    email: 'sales@dell.com',
    phone: '+1 (555) 123-4567',
    address: '1 Dell Way, Round Rock, TX 78682'
  },
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
    }
  ],
  subtotal: 6299.80,
  taxRate: 8.5,
  tax: 535.48,
  shipping: 50.00,
  discount: 0,
  discountType: 'percentage',
  total: 6885.28,
  status: 'draft',
  paymentTerms: 'Net 30',
  paymentMethod: 'Bank Transfer',
  currency: 'USD',
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
  notes: 'Urgent order for new office setup. Please ensure delivery by March 30th.',
  internalNotes: 'Equipment for new team members starting April 1st.',
  approvalRequired: true,
  priority: 'high',
  department: 'IT',
  project: 'Office Expansion Q1 2024',
  budgetCode: 'IT-EQUIP-2024-001',
  requestedBy: 'Mike Chen',
  tags: ['Urgent', 'Office Equipment', 'IT']
}

const vendors = [
  { id: 'v1', name: 'Dell Technologies' },
  { id: 'v2', name: 'HP Inc.' },
  { id: 'v3', name: 'Lenovo' },
  { id: 'v4', name: 'Apple Inc.' }
]

const paymentTerms = ['Due on Receipt', 'Net 15', 'Net 30', 'Net 45', 'Net 60']
const paymentMethods = ['Bank Transfer', 'Credit Card', 'ACH', 'Check', 'Wire Transfer']
const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
const priorities = ['low', 'medium', 'high', 'urgent']
const departments = ['IT', 'Marketing', 'Operations', 'Finance', 'HR', 'Sales']

export default function EditPurchaseOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState<PurchaseOrderData>(mockPurchaseOrder)
  const [activeSection, setActiveSection] = useState('details')
  const [loading, setLoading] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const sections = [
    { id: 'details', label: 'Order Details', icon: FileText },
    { id: 'vendor', label: 'Vendor Information', icon: Building },
    { id: 'items', label: 'Items Management', icon: Package },
    { id: 'shipping', label: 'Shipping Details', icon: Truck },
    { id: 'payment', label: 'Payment Terms', icon: CreditCard },
    { id: 'additional', label: 'Additional Info', icon: Settings }
  ]

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      setAutoSaving(true)
      // Simulate auto-save
      setTimeout(() => {
        setAutoSaving(false)
        setLastSaved(new Date())
      }, 1000)
    }, 30000) // Auto-save every 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [])

  // Calculate totals
  useEffect(() => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0)
    const discountAmount = formData.discountType === 'percentage'
      ? (subtotal * formData.discount) / 100
      : formData.discount
    const afterDiscount = subtotal - discountAmount
    const tax = (afterDiscount * formData.taxRate) / 100
    const total = afterDiscount + tax + formData.shipping

    setFormData(prev => ({
      ...prev,
      subtotal,
      tax,
      total
    }))
  }, [formData.items, formData.discount, formData.discountType, formData.taxRate, formData.shipping])

  const handleAddItem = () => {
    const newItem: LineItem = {
      id: `item${Date.now()}`,
      product: '',
      sku: '',
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }))
  }

  const handleRemoveItem = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }))
  }

  const handleItemChange = (itemId: string, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === itemId) {
          const updatedItem = { ...item, [field]: value }
          if (field === 'quantity' || field === 'unitPrice') {
            updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
          }
          return updatedItem
        }
        return item
      })
    }))
  }

  const handleSave = async () => {
    setLoading(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    router.push(`/dashboard/purchases/${params.id}`)
  }

  const handleSubmitForApproval = async () => {
    setLoading(true)
    // Update status to pending approval
    setFormData(prev => ({ ...prev, status: 'pending' }))
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    router.push(`/dashboard/purchases/${params.id}`)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'sent': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'low': return 'bg-gray-500/20 text-gray-400'
      case 'medium': return 'bg-blue-500/20 text-blue-400'
      case 'high': return 'bg-orange-500/20 text-orange-400'
      case 'urgent': return 'bg-red-500/20 text-red-400'
      default: return 'bg-gray-500/20 text-gray-400'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href={`/dashboard/purchases/${params.id}`}
            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Purchase Order</h1>
            <div className="flex items-center space-x-4 mt-1">
              <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(formData.status)}`}>
                {formData.status.toUpperCase()}
              </span>
              <span className="text-gray-400">{formData.number}</span>
              {autoSaving && (
                <span className="text-purple-400 text-sm flex items-center space-x-1">
                  <Clock className="h-3 w-3 animate-spin" />
                  <span>Auto-saving...</span>
                </span>
              )}
              {lastSaved && !autoSaving && (
                <span className="text-gray-500 text-sm">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/dashboard/purchases/${params.id}`}
            className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </Link>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white font-medium hover:bg-gray-700 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Saving...' : 'Save Draft'}</span>
          </button>
          {formData.approvalRequired && formData.status === 'draft' && (
            <button
              onClick={handleSubmitForApproval}
              disabled={loading}
              className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Submit for Approval</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className="w-80">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-2 space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <section.icon className="h-5 w-5" />
                <span className="font-medium">{section.label}</span>
                <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${
                  activeSection === section.id ? 'rotate-90' : ''
                }`} />
              </button>
            ))}
          </div>

          {/* Quick Summary */}
          <div className="mt-6 bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Items</span>
                <span className="text-white">{formData.items.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">${formData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tax</span>
                <span className="text-white">${formData.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span className="text-white">${formData.shipping.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-700 pt-3 flex justify-between">
                <span className="text-white font-medium">Total</span>
                <span className="text-green-400 font-bold">${formData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Priority & Status */}
          <div className="mt-6 bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Status & Priority</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Priority</label>
                <div className="grid grid-cols-2 gap-2">
                  {priorities.map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setFormData(prev => ({ ...prev, priority: priority as any }))}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        formData.priority === priority
                          ? getPriorityColor(priority)
                          : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
                      }`}
                    >
                      {priority.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Department</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors text-sm"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="approval"
                  checked={formData.approvalRequired}
                  onChange={(e) => setFormData(prev => ({ ...prev, approvalRequired: e.target.checked }))}
                  className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="approval" className="text-sm text-gray-300">
                  Requires Approval
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            {/* Order Details Section */}
            {activeSection === 'details' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Order Details</h2>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Purchase Order Number</label>
                    <input
                      type="text"
                      value={formData.number}
                      onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Order Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Expected Delivery</label>
                    <input
                      type="date"
                      value={formData.expectedDelivery}
                      onChange={(e) => setFormData(prev => ({ ...prev, expectedDelivery: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Requested By</label>
                    <input
                      type="text"
                      value={formData.requestedBy}
                      onChange={(e) => setFormData(prev => ({ ...prev, requestedBy: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Project (Optional)</label>
                    <input
                      type="text"
                      value={formData.project || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, project: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Associated project"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Budget Code (Optional)</label>
                    <input
                      type="text"
                      value={formData.budgetCode || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, budgetCode: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Budget allocation code"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-sm flex items-center space-x-2">
                        <Tag className="h-3 w-3" />
                        <span>{tag}</span>
                        <button
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            tags: prev.tags.filter((_, i) => i !== index)
                          }))}
                          className="ml-1 hover:text-purple-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <button className="px-3 py-1 rounded-lg border border-dashed border-gray-700 text-gray-400 text-sm hover:border-purple-500 hover:text-purple-400 transition-colors">
                      + Add Tag
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Vendor Information Section */}
            {activeSection === 'vendor' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Vendor Information</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Select Vendor</label>
                  <select
                    value={formData.vendor.id}
                    onChange={(e) => {
                      const selectedVendor = vendors.find(v => v.id === e.target.value)
                      if (selectedVendor) {
                        setFormData(prev => ({
                          ...prev,
                          vendor: {
                            ...prev.vendor,
                            id: selectedVendor.id,
                            name: selectedVendor.name
                          }
                        }))
                      }
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    {vendors.map(vendor => (
                      <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Vendor Name</label>
                    <input
                      type="text"
                      value={formData.vendor.name}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        vendor: { ...prev.vendor, name: e.target.value }
                      }))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Contact Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="email"
                        value={formData.vendor.email}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          vendor: { ...prev.vendor, email: e.target.value }
                        }))}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Contact Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="tel"
                        value={formData.vendor.phone}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          vendor: { ...prev.vendor, phone: e.target.value }
                        }))}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Vendor Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                    <textarea
                      value={formData.vendor.address}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        vendor: { ...prev.vendor, address: e.target.value }
                      }))}
                      rows={3}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Items Management Section */}
            {activeSection === 'items' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Items Management</h2>
                  <button
                    onClick={handleAddItem}
                    className="px-4 py-2 rounded-lg gradient-purple text-white hover:opacity-90 transition-all flex items-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.items.map((item, index) => (
                    <div key={item.id} className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-white font-medium">Item {index + 1}</h4>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 rounded hover:bg-gray-700 transition-colors text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Product Name</label>
                          <input
                            type="text"
                            value={item.product}
                            onChange={(e) => handleItemChange(item.id, 'product', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                            placeholder="Product name"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">SKU</label>
                          <input
                            type="text"
                            value={item.sku}
                            onChange={(e) => handleItemChange(item.id, 'sku', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                            placeholder="Product SKU"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                          placeholder="Product description"
                        />
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Quantity</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                            min="1"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Unit Price</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                              className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                              step="0.01"
                              min="0"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Total</label>
                          <div className="px-3 py-2 rounded-lg bg-gray-900/30 border border-gray-700 text-green-400 font-medium">
                            ${item.total.toFixed(2)}
                          </div>
                        </div>

                        <div className="flex items-end">
                          <button className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors flex items-center justify-center space-x-1">
                            <Calculator className="h-4 w-4" />
                            <span className="text-sm">Calculate</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals Section */}
                <div className="border-t border-gray-700 pt-6">
                  <div className="flex justify-end">
                    <div className="w-80 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Discount</label>
                          <div className="flex space-x-2">
                            <input
                              type="number"
                              value={formData.discount}
                              onChange={(e) => setFormData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                              className="flex-1 px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                              step="0.01"
                              min="0"
                            />
                            <select
                              value={formData.discountType}
                              onChange={(e) => setFormData(prev => ({ ...prev, discountType: e.target.value as 'percentage' | 'fixed' }))}
                              className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                            >
                              <option value="percentage">%</option>
                              <option value="fixed">$</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Tax Rate (%)</label>
                          <div className="relative">
                            <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                              type="number"
                              value={formData.taxRate}
                              onChange={(e) => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                              className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                              step="0.01"
                              min="0"
                              max="100"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Shipping Cost</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <input
                            type="number"
                            value={formData.shipping}
                            onChange={(e) => setFormData(prev => ({ ...prev, shipping: parseFloat(e.target.value) || 0 }))}
                            className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                            step="0.01"
                            min="0"
                          />
                        </div>
                      </div>

                      <div className="border border-gray-700 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Subtotal</span>
                          <span className="text-white">${formData.subtotal.toFixed(2)}</span>
                        </div>
                        {formData.discount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Discount ({formData.discount}{formData.discountType === 'percentage' ? '%' : ' USD'})
                            </span>
                            <span className="text-red-400">
                              -${formData.discountType === 'percentage'
                                ? ((formData.subtotal * formData.discount) / 100).toFixed(2)
                                : formData.discount.toFixed(2)
                              }
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tax ({formData.taxRate}%)</span>
                          <span className="text-white">${formData.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Shipping</span>
                          <span className="text-white">${formData.shipping.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-700 pt-2 flex justify-between">
                          <span className="text-lg font-semibold text-white">Total</span>
                          <span className="text-lg font-bold text-green-400">${formData.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shipping Details Section */}
            {activeSection === 'shipping' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Shipping Details</h2>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Shipping Address</h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={formData.shippingAddress.name}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          shippingAddress: { ...prev.shippingAddress, name: e.target.value }
                        }))}
                        placeholder="Company/Recipient Name"
                        className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                      <input
                        type="text"
                        value={formData.shippingAddress.street}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          shippingAddress: { ...prev.shippingAddress, street: e.target.value }
                        }))}
                        placeholder="Street Address"
                        className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={formData.shippingAddress.city}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            shippingAddress: { ...prev.shippingAddress, city: e.target.value }
                          }))}
                          placeholder="City"
                          className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        />
                        <input
                          type="text"
                          value={formData.shippingAddress.state}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            shippingAddress: { ...prev.shippingAddress, state: e.target.value }
                          }))}
                          placeholder="State"
                          className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        />
                        <input
                          type="text"
                          value={formData.shippingAddress.zipCode}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            shippingAddress: { ...prev.shippingAddress, zipCode: e.target.value }
                          }))}
                          placeholder="ZIP Code"
                          className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.shippingAddress.country}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          shippingAddress: { ...prev.shippingAddress, country: e.target.value }
                        }))}
                        placeholder="Country"
                        className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Billing Address</h3>
                    <div className="mb-4">
                      <label className="flex items-center space-x-2 text-sm text-gray-300">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                billingAddress: { ...prev.shippingAddress }
                              }))
                            }
                          }}
                          className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                        />
                        <span>Same as shipping address</span>
                      </label>
                    </div>
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={formData.billingAddress.name}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          billingAddress: { ...prev.billingAddress, name: e.target.value }
                        }))}
                        placeholder="Company/Billing Name"
                        className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                      <input
                        type="text"
                        value={formData.billingAddress.street}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          billingAddress: { ...prev.billingAddress, street: e.target.value }
                        }))}
                        placeholder="Street Address"
                        className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                      <div className="grid grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={formData.billingAddress.city}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            billingAddress: { ...prev.billingAddress, city: e.target.value }
                          }))}
                          placeholder="City"
                          className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        />
                        <input
                          type="text"
                          value={formData.billingAddress.state}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            billingAddress: { ...prev.billingAddress, state: e.target.value }
                          }))}
                          placeholder="State"
                          className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        />
                        <input
                          type="text"
                          value={formData.billingAddress.zipCode}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            billingAddress: { ...prev.billingAddress, zipCode: e.target.value }
                          }))}
                          placeholder="ZIP Code"
                          className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        />
                      </div>
                      <input
                        type="text"
                        value={formData.billingAddress.country}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          billingAddress: { ...prev.billingAddress, country: e.target.value }
                        }))}
                        placeholder="Country"
                        className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Terms Section */}
            {activeSection === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Payment Terms</h2>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Payment Terms</label>
                    <select
                      value={formData.paymentTerms}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    >
                      {paymentTerms.map(term => (
                        <option key={term} value={term}>{term}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Payment Method</label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    >
                      {paymentMethods.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    >
                      {currencies.map(currency => (
                        <option key={currency} value={currency}>{currency}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Information Section */}
            {activeSection === 'additional' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Additional Information</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Vendor Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                    placeholder="Notes to be shared with the vendor..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Internal Notes</label>
                  <textarea
                    value={formData.internalNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, internalNotes: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                    placeholder="Internal notes (not shared with vendor)..."
                  />
                </div>

                <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                  <h4 className="text-white font-medium mb-3">Approval Workflow</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Requires Approval</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.approvalRequired}
                          onChange={(e) => setFormData(prev => ({ ...prev, approvalRequired: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                    {formData.approvalRequired && (
                      <div className="text-sm text-gray-400 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        This purchase order will be sent for approval before being submitted to the vendor.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}