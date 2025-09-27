'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Save, X, Plus, Minus, Calendar, DollarSign,
  User, Building, Mail, Hash, FileText, Send, Eye,
  Calculator, Percent, Clock, Copy, Upload, Image
} from 'lucide-react'

interface InvoiceItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

interface InvoiceFormData {
  // Basic Information
  invoiceNumber: string
  issueDate: string
  dueDate: string
  status: string

  // Client Information
  clientId: string
  projectId: string

  // Invoice Items
  items: InvoiceItem[]

  // Financial Details
  subtotal: number
  taxRate: number
  taxAmount: number
  discountType: 'percentage' | 'fixed'
  discountValue: number
  discountAmount: number
  total: number

  // Payment Details
  paymentTerms: string
  currency: string

  // Additional Information
  notes: string
  terms: string
  footer: string

  // Settings
  sendCopy: boolean
  autoReminders: boolean
}

export default function NewInvoicePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<InvoiceFormData>({
    invoiceNumber: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'draft',
    clientId: '',
    projectId: '',
    items: [
      { description: '', quantity: 1, rate: 0, amount: 0 }
    ],
    subtotal: 0,
    taxRate: 10,
    taxAmount: 0,
    discountType: 'percentage',
    discountValue: 0,
    discountAmount: 0,
    total: 0,
    paymentTerms: 'Net 30',
    currency: 'USD',
    notes: '',
    terms: 'Payment is due within 30 days of invoice date. Late payments may incur additional charges.',
    footer: 'Thank you for your business!',
    sendCopy: true,
    autoReminders: true
  })

  // Mock data
  const clients = [
    { id: 'c1', name: 'TechCorp Solutions', email: 'contact@techcorp.com' },
    { id: 'c2', name: 'FinanceHub', email: 'info@financehub.com' },
    { id: 'c3', name: 'GlobalHR Solutions', email: 'contact@globalhr.com' },
    { id: 'c4', name: 'RetailChain Pro', email: 'support@retailchain.com' }
  ]

  const projects = [
    { id: 'proj1', name: 'Web Application Development', clientId: 'c1' },
    { id: 'proj2', name: 'Mobile App Design', clientId: 'c1' },
    { id: 'proj3', name: 'Financial Dashboard', clientId: 'c2' },
    { id: 'proj4', name: 'HR Management System', clientId: 'c3' }
  ]

  const steps = [
    { id: 1, title: 'Basic Details', icon: FileText },
    { id: 2, title: 'Invoice Items', icon: Calculator },
    { id: 3, title: 'Payment & Terms', icon: DollarSign },
    { id: 4, title: 'Review & Send', icon: Send }
  ]

  const paymentTermsOptions = [
    'Net 15', 'Net 30', 'Net 45', 'Net 60', 'Due on Receipt', 'Custom'
  ]

  const currencyOptions = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' }
  ]

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (action: 'save' | 'send') => {
    console.log(`${action === 'save' ? 'Saving' : 'Sending'} invoice:`, formData)
    router.push('/dashboard/invoices')
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    })
  }

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index)
      setFormData({ ...formData, items: newItems })
      calculateTotals(newItems, formData.taxRate, formData.discountType, formData.discountValue)
    }
  }

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...formData.items]
    newItems[index] = { ...newItems[index], [field]: value }

    // Calculate amount for this item
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate
    }

    setFormData({ ...formData, items: newItems })
    calculateTotals(newItems, formData.taxRate, formData.discountType, formData.discountValue)
  }

  const calculateTotals = (items: InvoiceItem[], taxRate: number, discountType: 'percentage' | 'fixed', discountValue: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0)

    let discountAmount = 0
    if (discountType === 'percentage') {
      discountAmount = (subtotal * discountValue) / 100
    } else {
      discountAmount = discountValue
    }

    const taxableAmount = subtotal - discountAmount
    const taxAmount = (taxableAmount * taxRate) / 100
    const total = taxableAmount + taxAmount

    setFormData(prev => ({
      ...prev,
      subtotal,
      discountAmount,
      taxAmount,
      total
    }))
  }

  const handleTaxChange = (newTaxRate: number) => {
    setFormData({ ...formData, taxRate: newTaxRate })
    calculateTotals(formData.items, newTaxRate, formData.discountType, formData.discountValue)
  }

  const handleDiscountChange = (type: 'percentage' | 'fixed', value: number) => {
    setFormData({ ...formData, discountType: type, discountValue: value })
    calculateTotals(formData.items, formData.taxRate, type, value)
  }

  const filteredProjects = projects.filter(p => p.clientId === formData.clientId)
  const selectedClient = clients.find(c => c.id === formData.clientId)
  const selectedProject = projects.find(p => p.id === formData.projectId)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/invoices">
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Create New Invoice</h1>
          <p className="text-gray-400">Generate and send professional invoices to clients</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    isActive ? 'gradient-purple' :
                    isCompleted ? 'gradient-green' :
                    'bg-gray-800'
                  }`}>
                    <Icon className={`h-5 w-5 ${isActive || isCompleted ? 'text-white' : 'text-gray-400'}`} />
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
                      Step {step.id}
                    </p>
                    <p className={`text-xs ${isActive ? 'text-purple-400' : 'text-gray-500'}`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    isCompleted ? 'bg-purple-500' : 'bg-gray-800'
                  }`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8">
        {/* Step 1: Basic Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Invoice Details</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Invoice Number *
                </label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                >
                  <option value="draft">Draft</option>
                  <option value="sent">Sent</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Issue Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Due Date *
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Client *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <select
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value, projectId: '' })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  >
                    <option value="">Select client</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project (Optional)
                </label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  disabled={!formData.clientId}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all disabled:opacity-50"
                >
                  <option value="">Select project</option>
                  {filteredProjects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {selectedClient && (
              <div className="p-4 rounded-lg bg-gray-800/30">
                <h3 className="text-lg font-medium text-white mb-2">Selected Client</h3>
                <div className="flex items-center space-x-3">
                  <Building className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-white font-medium">{selectedClient.name}</p>
                    <p className="text-gray-400 text-sm">{selectedClient.email}</p>
                  </div>
                </div>
                {selectedProject && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-sm text-gray-400">Project: <span className="text-white">{selectedProject.name}</span></p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Invoice Items */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Invoice Items</h2>
              <button
                onClick={addItem}
                className="px-4 py-2 rounded-lg gradient-purple text-white hover:opacity-90 transition-all flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="p-4 rounded-lg border border-gray-700 bg-gray-800/30">
                  <div className="grid grid-cols-12 gap-4 items-end">
                    <div className="col-span-5">
                      <label className="block text-sm text-gray-400 mb-1">Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                        placeholder="Item description"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-400 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-400 mb-1">Rate</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="number"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full pl-8 pr-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm text-gray-400 mb-1">Amount</label>
                      <div className="px-3 py-2 rounded-lg bg-gray-700/50 text-white font-medium">
                        ${item.amount.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-1">
                      {formData.items.length > 1 && (
                        <button
                          onClick={() => removeItem(index)}
                          className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                          <Minus className="h-4 w-4 text-red-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Section */}
            <div className="flex justify-end">
              <div className="w-80 space-y-4">
                <div className="p-4 rounded-lg bg-gray-800/30">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white font-medium">${formData.subtotal.toFixed(2)}</span>
                    </div>

                    {/* Discount */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Discount</span>
                        <div className="flex items-center space-x-2">
                          <select
                            value={formData.discountType}
                            onChange={(e) => handleDiscountChange(e.target.value as 'percentage' | 'fixed', formData.discountValue)}
                            className="px-2 py-1 rounded bg-gray-700 text-white text-sm"
                          >
                            <option value="percentage">%</option>
                            <option value="fixed">$</option>
                          </select>
                          <input
                            type="number"
                            step="0.01"
                            value={formData.discountValue}
                            onChange={(e) => handleDiscountChange(formData.discountType, parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 rounded bg-gray-700 text-white text-sm"
                          />
                        </div>
                      </div>
                      {formData.discountAmount > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">Discount Amount</span>
                          <span className="text-red-400">-${formData.discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>

                    {/* Tax */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Tax Rate</span>
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            step="0.1"
                            value={formData.taxRate}
                            onChange={(e) => handleTaxChange(parseFloat(e.target.value) || 0)}
                            className="w-16 px-2 py-1 rounded bg-gray-700 text-white text-sm"
                          />
                          <Percent className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Tax Amount</span>
                        <span className="text-white">${formData.taxAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="border-t border-gray-700 pt-3 flex items-center justify-between">
                      <span className="text-lg font-semibold text-white">Total</span>
                      <span className="text-lg font-bold text-green-400">${formData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment & Terms */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Payment & Terms</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Payment Terms</label>
                <select
                  value={formData.paymentTerms}
                  onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                >
                  {paymentTermsOptions.map(term => (
                    <option key={term} value={term}>{term}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                >
                  {currencyOptions.map(currency => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Notes (Internal)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none"
                placeholder="Internal notes (not visible to client)"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Terms & Conditions</label>
              <textarea
                value={formData.terms}
                onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none"
                placeholder="Terms and conditions for this invoice"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Footer Message</label>
              <input
                type="text"
                value={formData.footer}
                onChange={(e) => setFormData({ ...formData, footer: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                placeholder="Thank you message or footer text"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30">
                <div>
                  <p className="text-white font-medium">Send Copy to Me</p>
                  <p className="text-sm text-gray-400">Receive a copy of the invoice when sent</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sendCopy}
                    onChange={(e) => setFormData({ ...formData, sendCopy: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30">
                <div>
                  <p className="text-white font-medium">Auto Payment Reminders</p>
                  <p className="text-sm text-gray-400">Send automatic reminders for overdue payments</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoReminders}
                    onChange={(e) => setFormData({ ...formData, autoReminders: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review & Send */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Review Invoice</h2>

            <div className="grid grid-cols-2 gap-6">
              {/* Invoice Preview */}
              <div className="space-y-4">
                <div className="p-6 rounded-lg bg-white/5 border border-gray-700">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white">INVOICE</h3>
                    <p className="text-gray-400">{formData.invoiceNumber}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-gray-400 text-sm">Issue Date</p>
                      <p className="text-white">{new Date(formData.issueDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Due Date</p>
                      <p className="text-white">{new Date(formData.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {selectedClient && (
                    <div className="mb-6">
                      <p className="text-gray-400 text-sm">Bill To</p>
                      <p className="text-white font-medium">{selectedClient.name}</p>
                      <p className="text-gray-300">{selectedClient.email}</p>
                    </div>
                  )}

                  <div className="space-y-2 mb-6">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex justify-between">
                        <div>
                          <p className="text-white text-sm">{item.description}</p>
                          <p className="text-gray-400 text-xs">{item.quantity} × ${item.rate}</p>
                        </div>
                        <p className="text-white font-medium">${item.amount.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-700 pt-4 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Subtotal</span>
                      <span className="text-white">${formData.subtotal.toFixed(2)}</span>
                    </div>
                    {formData.discountAmount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Discount</span>
                        <span className="text-red-400">-${formData.discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tax ({formData.taxRate}%)</span>
                      <span className="text-white">${formData.taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-gray-700 pt-2">
                      <span className="text-white">Total</span>
                      <span className="text-green-400">${formData.total.toFixed(2)}</span>
                    </div>
                  </div>

                  {formData.footer && (
                    <div className="mt-6 pt-6 border-t border-gray-700 text-center">
                      <p className="text-gray-400 text-sm">{formData.footer}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Invoice Summary */}
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gray-800/30">
                  <h3 className="text-lg font-medium text-white mb-3">Invoice Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Invoice Number</span>
                      <span className="text-white">{formData.invoiceNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Client</span>
                      <span className="text-white">{selectedClient?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Items</span>
                      <span className="text-white">{formData.items.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment Terms</span>
                      <span className="text-white">{formData.paymentTerms}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span className="text-white">Total Amount</span>
                      <span className="text-green-400">${formData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <p className="text-green-400 font-medium">Ready to send</p>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">
                    Invoice is complete and ready to be sent to the client.
                  </p>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handleSubmit('send')}
                    className="w-full px-4 py-3 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>Send Invoice</span>
                  </button>

                  <button
                    onClick={() => handleSubmit('save')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all flex items-center justify-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save as Draft</span>
                  </button>

                  <button className="w-full px-4 py-3 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-800 transition-all flex items-center justify-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>Preview PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
              currentStep === 1
                ? 'bg-gray-800/50 text-gray-600 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          {currentStep < 5 ? (
            <button
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
              className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                validateStep(currentStep)
                  ? 'gradient-purple text-white hover:opacity-90'
                  : 'bg-gray-800/50 text-gray-500 cursor-not-allowed'
              }`}
            >
              {currentStep === 4 ? 'Review Invoice' : 'Continue'}
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={() => handleSubmit('save')}
                className="px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleSubmit('send')}
                className="px-6 py-3 rounded-xl gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send Invoice</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}