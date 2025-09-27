'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, ShoppingCart, Building, Package, Plus,
  Calendar, DollarSign, FileText, ChevronRight,
  Search, X, CheckCircle, AlertCircle, Truck,
  CreditCard, Clock, Hash, Save
} from 'lucide-react'

const vendors = [
  { id: 'v1', name: 'Dell Technologies', email: 'orders@dell.com', paymentTerms: 'Net 30' },
  { id: 'v2', name: 'HP Inc.', email: 'orders@hp.com', paymentTerms: 'Net 45' },
  { id: 'v3', name: 'Microsoft', email: 'licensing@microsoft.com', paymentTerms: 'Net 30' },
  { id: 'v4', name: 'Amazon Web Services', email: 'aws@amazon.com', paymentTerms: 'Monthly' },
  { id: 'v5', name: 'Adobe Systems', email: 'orders@adobe.com', paymentTerms: 'Annual' }
]

const products = [
  { id: 'p1', name: 'Dell UltraSharp 27" Monitor', sku: 'DL-MON-27', price: 599.99, vendor: 'v1' },
  { id: 'p2', name: 'HP LaserJet Pro Printer', sku: 'HP-PRN-LJ', price: 399.99, vendor: 'v2' },
  { id: 'p3', name: 'Logitech MX Master 3', sku: 'LG-MOU-MX3', price: 99.99, vendor: 'v1' },
  { id: 'p4', name: 'Office 365 Business', sku: 'MS-O365-BUS', price: 22.00, vendor: 'v3' },
  { id: 'p5', name: 'Creative Cloud Teams', sku: 'AD-CC-TEAM', price: 79.99, vendor: 'v5' }
]

export default function NewPurchaseOrderPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedVendor, setSelectedVendor] = useState('')
  const [orderItems, setOrderItems] = useState([
    { productId: '', quantity: 1, unitPrice: 0, total: 0 }
  ])
  const [formData, setFormData] = useState({
    orderNumber: `PO-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    deliveryDate: '',
    shippingAddress: '',
    notes: '',
    paymentTerms: '',
    taxRate: 10,
    shippingCost: 0
  })

  const steps = [
    { number: 1, title: 'Vendor Selection', icon: Building },
    { number: 2, title: 'Add Items', icon: Package },
    { number: 3, title: 'Delivery & Payment', icon: Truck },
    { number: 4, title: 'Review & Submit', icon: CheckCircle }
  ]

  const handleAddItem = () => {
    setOrderItems([...orderItems, { productId: '', quantity: 1, unitPrice: 0, total: 0 }])
  }

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...orderItems]
    if (field === 'productId') {
      const product = products.find(p => p.id === value)
      if (product) {
        newItems[index] = {
          ...newItems[index],
          productId: value,
          unitPrice: product.price,
          total: product.price * newItems[index].quantity
        }
      }
    } else if (field === 'quantity') {
      newItems[index] = {
        ...newItems[index],
        quantity: value,
        total: newItems[index].unitPrice * value
      }
    }
    setOrderItems(newItems)
  }

  const calculateTotals = () => {
    const subtotal = orderItems.reduce((sum, item) => sum + item.total, 0)
    const tax = subtotal * (formData.taxRate / 100)
    const total = subtotal + tax + formData.shippingCost
    return { subtotal, tax, total }
  }

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    // Handle form submission
    router.push('/dashboard/purchases')
  }

  const { subtotal, tax, total } = calculateTotals()
  const selectedVendorData = vendors.find(v => v.id === selectedVendor)
  const vendorProducts = products.filter(p => p.vendor === selectedVendor)

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
            <h1 className="text-3xl font-bold text-white">New Purchase Order</h1>
            <p className="text-gray-400">Create a new purchase order</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-gray-400">
          <Hash className="h-5 w-5" />
          <span className="font-mono text-white">{formData.orderNumber}</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center space-x-3 ${
                step.number === currentStep ? 'text-white' :
                step.number < currentStep ? 'text-green-400' : 'text-gray-500'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  step.number === currentStep ? 'border-purple-500 bg-purple-500' :
                  step.number < currentStep ? 'border-green-400 bg-green-400' : 'border-gray-600'
                }`}>
                  {step.number < currentStep ? (
                    <CheckCircle className="h-5 w-5 text-white" />
                  ) : (
                    <step.icon className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-gray-500">Step {step.number}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="h-5 w-5 text-gray-600 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
        {/* Step 1: Vendor Selection */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Select Vendor</h2>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search vendors..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {vendors.map((vendor) => (
                <button
                  key={vendor.id}
                  type="button"
                  onClick={() => {
                    setSelectedVendor(vendor.id)
                    setFormData({...formData, paymentTerms: vendor.paymentTerms})
                  }}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedVendor === vendor.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-600 to-yellow-600 flex items-center justify-center">
                        <Building className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium">{vendor.name}</p>
                        <p className="text-sm text-gray-400">{vendor.email}</p>
                        <p className="text-xs text-gray-500 mt-1">Terms: {vendor.paymentTerms}</p>
                      </div>
                    </div>
                    {selectedVendor === vendor.id && (
                      <CheckCircle className="h-5 w-5 text-purple-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Add Items */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Order Items</h2>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors flex items-center space-x-1"
              >
                <Plus className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            </div>

            {selectedVendorData && (
              <div className="p-4 rounded-lg bg-gray-800/50 mb-4">
                <p className="text-sm text-gray-400">Ordering from</p>
                <p className="text-white font-medium">{selectedVendorData.name}</p>
              </div>
            )}

            <div className="space-y-3">
              {orderItems.map((item, index) => (
                <div key={index} className="p-4 rounded-lg border border-gray-700">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-400 mb-1">Product</label>
                      <select
                        value={item.productId}
                        onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      >
                        <option value="">Select Product</option>
                        {vendorProducts.map(product => (
                          <option key={product.id} value={product.id}>
                            {product.name} - ${product.price}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Total</label>
                        <p className="text-white font-medium">${item.total.toFixed(2)}</p>
                      </div>
                      {orderItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <X className="h-4 w-4 text-red-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-700">
              <div className="flex items-center justify-between text-lg">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white font-semibold">${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Delivery & Payment */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Delivery & Payment Details</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({...formData, deliveryDate: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Payment Terms
                </label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({...formData, paymentTerms: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                >
                  <option value="Net 15">Net 15</option>
                  <option value="Net 30">Net 30</option>
                  <option value="Net 45">Net 45</option>
                  <option value="Net 60">Net 60</option>
                  <option value="Due on Receipt">Due on Receipt</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Shipping Address
                </label>
                <textarea
                  value={formData.shippingAddress}
                  onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                  placeholder="Enter shipping address..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => setFormData({...formData, taxRate: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Shipping Cost
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={formData.shippingCost}
                    onChange={(e) => setFormData({...formData, shippingCost: parseFloat(e.target.value)})}
                    className="w-full pl-8 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                  placeholder="Additional notes..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Submit */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Review Purchase Order</h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Vendor Information</h3>
                  <div className="p-4 rounded-lg bg-gray-800/50">
                    <p className="text-white font-medium">{selectedVendorData?.name}</p>
                    <p className="text-sm text-gray-400">{selectedVendorData?.email}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Delivery Information</h3>
                  <div className="p-4 rounded-lg bg-gray-800/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Delivery Date</span>
                      <span className="text-white">{formData.deliveryDate || 'Not specified'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Payment Terms</span>
                      <span className="text-white">{formData.paymentTerms}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Order Summary</h3>
                <div className="p-4 rounded-lg bg-gray-800/50 space-y-3">
                  {orderItems.filter(item => item.productId).map((item, index) => {
                    const product = products.find(p => p.id === item.productId)
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="text-white text-sm">{product?.name}</p>
                          <p className="text-xs text-gray-400">{item.quantity} × ${item.unitPrice}</p>
                        </div>
                        <span className="text-white">${item.total.toFixed(2)}</span>
                      </div>
                    )
                  })}

                  <div className="pt-3 border-t border-gray-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Tax ({formData.taxRate}%)</span>
                      <span className="text-white">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Shipping</span>
                      <span className="text-white">${formData.shippingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                      <span className="text-lg font-semibold text-white">Total</span>
                      <span className="text-lg font-bold text-green-400">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <p className="text-green-400 font-medium">Ready to submit purchase order</p>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Please review all information before submitting. The order will be sent to the vendor immediately.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/dashboard/purchases')}
          className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all"
        >
          Cancel
        </button>

        <div className="flex items-center space-x-3">
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
            >
              Previous
            </button>
          )}

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={currentStep === 1 && !selectedVendor}
              className="px-6 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Submit Order</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}