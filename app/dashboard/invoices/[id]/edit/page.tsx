'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Save, X, Plus, Trash2, Building, User, Mail,
  Phone, MapPin, FileText, Calendar, DollarSign, Percent,
  Calculator, Eye, Send, Copy, Settings, CheckCircle,
  Clock, Tag, CreditCard, Receipt, Globe, Hash, ChevronRight
} from 'lucide-react'

// Types
interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  taxRate: number
  amount: number
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }
  taxId?: string
}

interface InvoiceData {
  id: string
  number: string
  issueDate: string
  dueDate: string
  client: Client
  project?: {
    id: string
    name: string
    description: string
  }
  items: InvoiceItem[]
  subtotal: number
  discountType: 'percentage' | 'fixed'
  discountValue: number
  discountAmount: number
  taxAmount: number
  total: number
  currency: string
  paymentTerms: string
  paymentMethods: string[]
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  notes: string
  terms: string
  footer: string
  language: string
  template: string
  sendReminders: boolean
  allowOnlinePayment: boolean
  latePaymentFee: number
  earlyPaymentDiscount: number
  recurringInterval?: 'monthly' | 'quarterly' | 'yearly'
  tags: string[]
}

// Mock data
const mockInvoice: InvoiceData = {
  id: 'INV-2024-001',
  number: 'INV-2024-001',
  issueDate: '2024-03-01',
  dueDate: '2024-03-31',
  client: {
    id: 'c1',
    name: 'TechCorp Solutions',
    email: 'contact@techcorp.com',
    phone: '+1 (555) 123-4567',
    address: {
      street: '123 Business Ave',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'United States'
    },
    taxId: 'TC-123456789'
  },
  project: {
    id: 'p1',
    name: 'E-commerce Platform Redesign',
    description: 'Complete redesign and rebuild of the client\'s e-commerce platform'
  },
  items: [
    {
      id: 'item1',
      description: 'Frontend Development - React Components',
      quantity: 80,
      rate: 75,
      taxRate: 0,
      amount: 6000
    },
    {
      id: 'item2',
      description: 'Backend API Development',
      quantity: 60,
      rate: 85,
      taxRate: 0,
      amount: 5100
    }
  ],
  subtotal: 11100,
  discountType: 'percentage',
  discountValue: 5,
  discountAmount: 555,
  taxAmount: 889.25,
  total: 11434.25,
  currency: 'USD',
  paymentTerms: 'Net 30',
  paymentMethods: ['Bank Transfer', 'Credit Card'],
  status: 'draft',
  notes: 'Thank you for choosing our development services. We look forward to working with you again.',
  terms: 'Payment is due within 30 days of invoice date. Late payments may incur additional charges of 1.5% per month.',
  footer: 'Thank you for your business!',
  language: 'English',
  template: 'Professional',
  sendReminders: true,
  allowOnlinePayment: true,
  latePaymentFee: 1.5,
  earlyPaymentDiscount: 2,
  tags: ['Development', 'Web Design', 'E-commerce']
}

const clients = [
  { id: 'c1', name: 'TechCorp Solutions' },
  { id: 'c2', name: 'StartupXYZ' },
  { id: 'c3', name: 'Enterprise Inc.' },
  { id: 'c4', name: 'Digital Agency' }
]

const projects = [
  { id: 'p1', name: 'E-commerce Platform Redesign' },
  { id: 'p2', name: 'Mobile App Development' },
  { id: 'p3', name: 'Brand Identity Design' },
  { id: 'p4', name: 'Marketing Website' }
]

const paymentTermsList = ['Due on Receipt', 'Net 15', 'Net 30', 'Net 45', 'Net 60']
const paymentMethodsList = ['Bank Transfer', 'Credit Card', 'PayPal', 'Check', 'Wire Transfer', 'Cryptocurrency']
const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY']
const languages = ['English', 'Spanish', 'French', 'German', 'Italian']
const templates = ['Professional', 'Modern', 'Classic', 'Minimal', 'Creative']
const taxRates = [
  { label: 'No Tax', value: 0 },
  { label: 'Standard Rate (8.5%)', value: 8.5 },
  { label: 'Reduced Rate (5%)', value: 5 },
  { label: 'Higher Rate (10%)', value: 10 },
  { label: 'Custom', value: -1 }
]

export default function EditInvoicePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState<InvoiceData>(mockInvoice)
  const [activeSection, setActiveSection] = useState('client')
  const [loading, setLoading] = useState(false)
  const [autoSaving, setAutoSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [customTaxRate, setCustomTaxRate] = useState(8.5)

  const sections = [
    { id: 'client', label: 'Client Information', icon: Building },
    { id: 'items', label: 'Invoice Items', icon: Receipt },
    { id: 'payment', label: 'Payment Terms', icon: CreditCard },
    { id: 'notes', label: 'Notes & Terms', icon: FileText },
    { id: 'settings', label: 'Invoice Settings', icon: Settings }
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
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0)
    const discountAmount = formData.discountType === 'percentage'
      ? (subtotal * formData.discountValue) / 100
      : formData.discountValue
    const afterDiscount = subtotal - discountAmount

    // Calculate tax on items with individual tax rates
    const taxAmount = formData.items.reduce((sum, item) => {
      return sum + ((item.amount * item.taxRate) / 100)
    }, 0)

    const total = afterDiscount + taxAmount

    setFormData(prev => ({
      ...prev,
      subtotal,
      discountAmount,
      taxAmount,
      total
    }))
  }, [formData.items, formData.discountValue, formData.discountType])

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: `item${Date.now()}`,
      description: '',
      quantity: 1,
      rate: 0,
      taxRate: 0,
      amount: 0
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
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate
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
    router.push(`/dashboard/invoices/${params.id}`)
  }

  const handleSendInvoice = async () => {
    setLoading(true)
    // Update status to sent
    setFormData(prev => ({ ...prev, status: 'sent' }))
    await new Promise(resolve => setTimeout(resolve, 1000))
    setLoading(false)
    router.push(`/dashboard/invoices/${params.id}`)
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'draft': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      case 'sent': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'paid': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  const calculateDueDate = (issueDate: string, paymentTerms: string) => {
    const date = new Date(issueDate)
    const days = parseInt(paymentTerms.replace(/\D/g, '')) || 0
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0]
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href={`/dashboard/invoices/${params.id}`}
            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Invoice</h1>
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
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </button>
          <Link
            href={`/dashboard/invoices/${params.id}`}
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
          <button
            onClick={handleSendInvoice}
            disabled={loading}
            className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            <span>Send Invoice</span>
          </button>
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

          {/* Invoice Summary */}
          <div className="mt-6 bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Invoice Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Items</span>
                <span className="text-white">{formData.items.length}</span>
              </div>
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
                <span className="text-gray-400">Tax</span>
                <span className="text-white">${formData.taxAmount.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-700 pt-3 flex justify-between">
                <span className="text-white font-medium">Total</span>
                <span className="text-green-400 font-bold">${formData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm flex items-center justify-center space-x-2">
                <Copy className="h-4 w-4" />
                <span>Duplicate Invoice</span>
              </button>
              <button className="w-full py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm flex items-center justify-center space-x-2">
                <Calculator className="h-4 w-4" />
                <span>Estimate Calculator</span>
              </button>
              <button className="w-full py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm flex items-center justify-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>Client Portal Link</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            {/* Client Information Section */}
            {activeSection === 'client' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Client Information</h2>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Invoice Number</label>
                    <input
                      type="text"
                      value={formData.number}
                      onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Issue Date</label>
                    <input
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => {
                        const newIssueDate = e.target.value
                        const newDueDate = calculateDueDate(newIssueDate, formData.paymentTerms)
                        setFormData(prev => ({
                          ...prev,
                          issueDate: newIssueDate,
                          dueDate: newDueDate
                        }))
                      }}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Due Date</label>
                    <input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
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

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Select Client</label>
                  <select
                    value={formData.client.id}
                    onChange={(e) => {
                      const selectedClient = clients.find(c => c.id === e.target.value)
                      if (selectedClient) {
                        setFormData(prev => ({
                          ...prev,
                          client: {
                            ...prev.client,
                            id: selectedClient.id,
                            name: selectedClient.name
                          }
                        }))
                      }
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>{client.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Client Name</label>
                    <input
                      type="text"
                      value={formData.client.name}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        client: { ...prev.client, name: e.target.value }
                      }))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Tax ID (Optional)</label>
                    <input
                      type="text"
                      value={formData.client.taxId || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        client: { ...prev.client, taxId: e.target.value }
                      }))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Client tax identification"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="email"
                        value={formData.client.email}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          client: { ...prev.client, email: e.target.value }
                        }))}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="tel"
                        value={formData.client.phone}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          client: { ...prev.client, phone: e.target.value }
                        }))}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Client Address</label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={formData.client.address.street}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        client: {
                          ...prev.client,
                          address: { ...prev.client.address, street: e.target.value }
                        }
                      }))}
                      placeholder="Street Address"
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={formData.client.address.city}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          client: {
                            ...prev.client,
                            address: { ...prev.client.address, city: e.target.value }
                          }
                        }))}
                        placeholder="City"
                        className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                      <input
                        type="text"
                        value={formData.client.address.state}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          client: {
                            ...prev.client,
                            address: { ...prev.client.address, state: e.target.value }
                          }
                        }))}
                        placeholder="State"
                        className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                      <input
                        type="text"
                        value={formData.client.address.zip}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          client: {
                            ...prev.client,
                            address: { ...prev.client.address, zip: e.target.value }
                          }
                        }))}
                        placeholder="ZIP Code"
                        className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.client.address.country}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        client: {
                          ...prev.client,
                          address: { ...prev.client.address, country: e.target.value }
                        }
                      }))}
                      placeholder="Country"
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Associated Project (Optional)</label>
                  <select
                    value={formData.project?.id || ''}
                    onChange={(e) => {
                      const selectedProject = projects.find(p => p.id === e.target.value)
                      setFormData(prev => ({
                        ...prev,
                        project: selectedProject ? {
                          id: selectedProject.id,
                          name: selectedProject.name,
                          description: ''
                        } : undefined
                      }))
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select Project (Optional)</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
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

            {/* Invoice Items Section */}
            {activeSection === 'items' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Invoice Items</h2>
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

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                        <textarea
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                          placeholder="Service or product description"
                        />
                      </div>

                      <div className="grid grid-cols-5 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Quantity</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                            min="1"
                            step="0.01"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Rate</label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                              type="number"
                              value={item.rate}
                              onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value) || 0)}
                              className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                              step="0.01"
                              min="0"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Tax Rate (%)</label>
                          <select
                            value={item.taxRate === -1 ? 'custom' : item.taxRate}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value === 'custom') {
                                handleItemChange(item.id, 'taxRate', customTaxRate)
                              } else {
                                handleItemChange(item.id, 'taxRate', parseFloat(value))
                              }
                            }}
                            className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors text-sm"
                          >
                            {taxRates.map(rate => (
                              <option key={rate.value} value={rate.value === -1 ? 'custom' : rate.value}>
                                {rate.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-1">Amount</label>
                          <div className="px-3 py-2 rounded-lg bg-gray-900/30 border border-gray-700 text-green-400 font-medium">
                            ${item.amount.toFixed(2)}
                          </div>
                        </div>

                        <div className="flex items-end">
                          <button className="w-full px-3 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors flex items-center justify-center space-x-1">
                            <Calculator className="h-4 w-4" />
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
                              value={formData.discountValue}
                              onChange={(e) => setFormData(prev => ({ ...prev, discountValue: parseFloat(e.target.value) || 0 }))}
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
                      </div>

                      <div className="border border-gray-700 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Subtotal</span>
                          <span className="text-white">${formData.subtotal.toFixed(2)}</span>
                        </div>
                        {formData.discountAmount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">
                              Discount ({formData.discountValue}{formData.discountType === 'percentage' ? '%' : ' USD'})
                            </span>
                            <span className="text-red-400">-${formData.discountAmount.toFixed(2)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tax</span>
                          <span className="text-white">${formData.taxAmount.toFixed(2)}</span>
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

            {/* Payment Terms Section */}
            {activeSection === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Payment Terms</h2>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Payment Terms</label>
                    <select
                      value={formData.paymentTerms}
                      onChange={(e) => {
                        const newTerms = e.target.value
                        const newDueDate = calculateDueDate(formData.issueDate, newTerms)
                        setFormData(prev => ({
                          ...prev,
                          paymentTerms: newTerms,
                          dueDate: newDueDate
                        }))
                      }}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    >
                      {paymentTermsList.map(term => (
                        <option key={term} value={term}>{term}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Late Payment Fee (%)</label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="number"
                        value={formData.latePaymentFee}
                        onChange={(e) => setFormData(prev => ({ ...prev, latePaymentFee: parseFloat(e.target.value) || 0 }))}
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        step="0.1"
                        min="0"
                        max="25"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Early Payment Discount (%)</label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <input
                        type="number"
                        value={formData.earlyPaymentDiscount}
                        onChange={(e) => setFormData(prev => ({ ...prev, earlyPaymentDiscount: parseFloat(e.target.value) || 0 }))}
                        className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                        step="0.1"
                        min="0"
                        max="15"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Accepted Payment Methods</label>
                  <div className="grid grid-cols-3 gap-3">
                    {paymentMethodsList.map(method => (
                      <label key={method} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.paymentMethods.includes(method)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                paymentMethods: [...prev.paymentMethods, method]
                              }))
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                paymentMethods: prev.paymentMethods.filter(m => m !== method)
                              }))
                            }
                          }}
                          className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-white text-sm">{method}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="online-payment"
                      checked={formData.allowOnlinePayment}
                      onChange={(e) => setFormData(prev => ({ ...prev, allowOnlinePayment: e.target.checked }))}
                      className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="online-payment" className="text-white">
                      Allow Online Payment
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="send-reminders"
                      checked={formData.sendReminders}
                      onChange={(e) => setFormData(prev => ({ ...prev, sendReminders: e.target.checked }))}
                      className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                    />
                    <label htmlFor="send-reminders" className="text-white">
                      Send Payment Reminders
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Notes & Terms Section */}
            {activeSection === 'notes' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Notes & Terms</h2>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Invoice Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                    placeholder="Thank you message or special instructions..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Terms & Conditions</label>
                  <textarea
                    value={formData.terms}
                    onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                    rows={6}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                    placeholder="Payment terms, conditions, and policies..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Footer Message</label>
                  <input
                    type="text"
                    value={formData.footer}
                    onChange={(e) => setFormData(prev => ({ ...prev, footer: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Footer message..."
                  />
                </div>
              </div>
            )}

            {/* Invoice Settings Section */}
            {activeSection === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Invoice Settings</h2>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    >
                      {languages.map(language => (
                        <option key={language} value={language}>{language}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Template</label>
                    <select
                      value={formData.template}
                      onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    >
                      {templates.map(template => (
                        <option key={template} value={template}>{template}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Recurring Interval</label>
                    <select
                      value={formData.recurringInterval || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        recurringInterval: e.target.value as 'monthly' | 'quarterly' | 'yearly' | undefined
                      }))}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    >
                      <option value="">One-time Invoice</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                  <h4 className="text-white font-medium mb-4">Automation Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Send Automatic Reminders</p>
                        <p className="text-sm text-gray-400">Send payment reminders before and after due date</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.sendReminders}
                          onChange={(e) => setFormData(prev => ({ ...prev, sendReminders: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Enable Online Payments</p>
                        <p className="text-sm text-gray-400">Allow clients to pay directly through invoice</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.allowOnlinePayment}
                          onChange={(e) => setFormData(prev => ({ ...prev, allowOnlinePayment: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                {formData.recurringInterval && (
                  <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-blue-400" />
                      <span className="text-blue-400 font-medium">Recurring Invoice</span>
                    </div>
                    <p className="text-sm text-gray-400">
                      This invoice will be automatically generated and sent {formData.recurringInterval}.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}