'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Download, Print, Send, Edit, Copy, Archive,
  Eye, Mail, Phone, MapPin, Calendar, Clock, DollarSign,
  FileText, Building, User, CheckCircle, AlertCircle,
  XCircle, CreditCard, Receipt, RefreshCw, ExternalLink,
  Printer, Share2, MoreVertical, Banknote, Paperclip,
  Activity, MessageSquare, ChevronRight, Star, Filter,
  Search, SortDesc, Upload, Camera, FileImage, Trash2
} from 'lucide-react'

// Mock invoice data
const mockInvoice = {
  id: 'inv1',
  number: 'INV-2024-001',
  status: 'paid',
  issueDate: '2024-03-01',
  dueDate: '2024-03-31',
  paidDate: '2024-03-28',
  currency: 'USD',

  // Client information
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

  // Project information
  project: {
    id: 'p1',
    name: 'E-commerce Platform Redesign',
    description: 'Complete redesign and rebuild of the client\'s e-commerce platform'
  },

  // Invoice items
  items: [
    {
      id: 'item1',
      description: 'Frontend Development - React Components',
      quantity: 80,
      rate: 75,
      amount: 6000
    },
    {
      id: 'item2',
      description: 'Backend API Development',
      quantity: 60,
      rate: 85,
      amount: 5100
    },
    {
      id: 'item3',
      description: 'Database Design & Implementation',
      quantity: 20,
      rate: 90,
      amount: 1800
    },
    {
      id: 'item4',
      description: 'UI/UX Design Consultation',
      quantity: 15,
      rate: 100,
      amount: 1500
    },
    {
      id: 'item5',
      description: 'Testing & Quality Assurance',
      quantity: 25,
      rate: 70,
      amount: 1750
    }
  ],

  // Financial details
  subtotal: 16150,
  discountType: 'percentage',
  discountValue: 5,
  discountAmount: 807.50,
  taxRate: 8.5,
  taxAmount: 1304.24,
  total: 16646.74,

  // Payment details
  paymentTerms: 'Net 30',
  paymentMethod: 'Bank Transfer',
  paymentReference: 'TXN-2024-0328-001',

  // Additional information
  notes: 'Thank you for choosing our development services. We look forward to working with you again.',
  terms: 'Payment is due within 30 days of invoice date. Late payments may incur additional charges of 1.5% per month.',
  footer: 'Thank you for your business!',

  // Company information (your company)
  company: {
    name: 'Mashub Development',
    email: 'billing@mashub.dev',
    phone: '+1 (555) 987-6543',
    address: {
      street: '456 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      zip: '94102',
      country: 'United States'
    },
    website: 'www.mashub.dev',
    taxId: 'MD-987654321'
  },

  // History
  history: [
    {
      id: 'h1',
      action: 'payment_received',
      description: 'Payment received via bank transfer',
      amount: 16646.74,
      date: '2024-03-28T10:30:00Z',
      user: 'System'
    },
    {
      id: 'h2',
      action: 'reminder_sent',
      description: 'Payment reminder sent to client',
      date: '2024-03-25T09:00:00Z',
      user: 'Sarah Chen'
    },
    {
      id: 'h3',
      action: 'invoice_viewed',
      description: 'Invoice viewed by client (contact@techcorp.com)',
      date: '2024-03-24T15:30:00Z',
      user: 'Client'
    },
    {
      id: 'h4',
      action: 'invoice_sent',
      description: 'Invoice sent to client via email',
      date: '2024-03-01T14:15:00Z',
      user: 'Sarah Chen'
    },
    {
      id: 'h5',
      action: 'invoice_created',
      description: 'Invoice created and saved as draft',
      date: '2024-03-01T13:45:00Z',
      user: 'Sarah Chen'
    }
  ],

  // Attachments
  attachments: [
    {
      id: 'att1',
      name: 'project-specifications.pdf',
      type: 'document',
      size: '2.4 MB',
      uploadDate: '2024-03-01T13:50:00Z',
      uploadedBy: 'Sarah Chen'
    },
    {
      id: 'att2',
      name: 'wireframes-v2.jpg',
      type: 'image',
      size: '1.8 MB',
      uploadDate: '2024-03-01T14:00:00Z',
      uploadedBy: 'Sarah Chen'
    },
    {
      id: 'att3',
      name: 'technical-requirements.docx',
      type: 'document',
      size: '856 KB',
      uploadDate: '2024-03-01T14:10:00Z',
      uploadedBy: 'Mike Johnson'
    }
  ]
}

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('details')
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)

  const tabs = [
    { id: 'details', label: 'Invoice Details', icon: FileText },
    { id: 'payment', label: 'Payment Info', icon: CreditCard },
    { id: 'history', label: 'Activity History', icon: Activity },
    { id: 'attachments', label: 'Attachments', icon: Paperclip }
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'draft': return 'text-gray-400 bg-gray-400/10 border-gray-400/30'
      case 'sent': return 'text-blue-400 bg-blue-400/10 border-blue-400/30'
      case 'paid': return 'text-green-400 bg-green-400/10 border-green-400/30'
      case 'overdue': return 'text-red-400 bg-red-400/10 border-red-400/30'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'draft': return FileText
      case 'sent': return Send
      case 'paid': return CheckCircle
      case 'overdue': return AlertCircle
      default: return FileText
    }
  }

  const getActionIcon = (action: string) => {
    switch(action) {
      case 'payment_received': return CheckCircle
      case 'reminder_sent': return Mail
      case 'invoice_sent': return Send
      case 'invoice_created': return FileText
      case 'invoice_viewed': return Eye
      case 'attachment_added': return Paperclip
      case 'comment_added': return MessageSquare
      default: return Clock
    }
  }

  const getActionColor = (action: string) => {
    switch(action) {
      case 'payment_received': return 'text-green-400'
      case 'reminder_sent': return 'text-yellow-400'
      case 'invoice_sent': return 'text-blue-400'
      case 'invoice_created': return 'text-gray-400'
      case 'invoice_viewed': return 'text-purple-400'
      case 'attachment_added': return 'text-cyan-400'
      case 'comment_added': return 'text-pink-400'
      default: return 'text-gray-400'
    }
  }

  const getFileIcon = (type: string) => {
    switch(type) {
      case 'image': return FileImage
      case 'document': return FileText
      default: return Paperclip
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const StatusIcon = getStatusIcon(mockInvoice.status)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/invoices"
            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">{mockInvoice.number}</h1>
            <div className="flex items-center space-x-4 mt-1">
              <span className={`px-3 py-1 rounded-lg text-sm font-medium border flex items-center space-x-1 ${getStatusColor(mockInvoice.status)}`}>
                <StatusIcon className="h-3 w-3" />
                <span className="capitalize">{mockInvoice.status}</span>
              </span>
              <span className="text-gray-400">{mockInvoice.client.name}</span>
              {mockInvoice.project && (
                <>
                  <span className="text-gray-600">•</span>
                  <Link
                    href={`/dashboard/projects/${mockInvoice.project.id}`}
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {mockInvoice.project.name}
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all flex items-center space-x-2">
            <Print className="h-4 w-4" />
            <span>Print</span>
          </button>
          <button className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Download PDF</span>
          </button>
          {mockInvoice.status === 'draft' && (
            <Link
              href={`/dashboard/invoices/${params.id}/edit`}
              className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Link>
          )}
          {(mockInvoice.status === 'draft' || mockInvoice.status === 'overdue') && (
            <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all flex items-center space-x-2">
              <Send className="h-4 w-4" />
              <span>Send Invoice</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Total Amount</span>
            <DollarSign className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">${mockInvoice.total.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{mockInvoice.currency}</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Issue Date</span>
            <Calendar className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-lg font-bold text-white">{formatDate(mockInvoice.issueDate)}</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Due Date</span>
            <Clock className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-lg font-bold text-white">{formatDate(mockInvoice.dueDate)}</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Payment Terms</span>
            <Receipt className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-lg font-bold text-white">{mockInvoice.paymentTerms}</p>
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
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            {activeTab === 'details' && (
              <div className="space-y-6">
                {/* Invoice Items */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Invoice Items</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-3 text-sm font-medium text-gray-400">Description</th>
                          <th className="text-right py-3 text-sm font-medium text-gray-400">Qty</th>
                          <th className="text-right py-3 text-sm font-medium text-gray-400">Rate</th>
                          <th className="text-right py-3 text-sm font-medium text-gray-400">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {mockInvoice.items.map((item) => (
                          <tr key={item.id}>
                            <td className="py-4 text-white">{item.description}</td>
                            <td className="py-4 text-right text-gray-300">{item.quantity}</td>
                            <td className="py-4 text-right text-gray-300">${item.rate}</td>
                            <td className="py-4 text-right font-medium text-white">${item.amount.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-80 space-y-3">
                    <div className="border border-gray-800 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="text-white">${mockInvoice.subtotal.toLocaleString()}</span>
                      </div>
                      {mockInvoice.discountAmount > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">
                            Discount ({mockInvoice.discountValue}
                            {mockInvoice.discountType === 'percentage' ? '%' : ' USD'})
                          </span>
                          <span className="text-red-400">-${mockInvoice.discountAmount.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tax ({mockInvoice.taxRate}%)</span>
                        <span className="text-white">${mockInvoice.taxAmount.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-gray-800 pt-2 flex justify-between">
                        <span className="text-lg font-semibold text-white">Total</span>
                        <span className="text-lg font-bold text-green-400">${mockInvoice.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes and Terms */}
                {mockInvoice.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Notes</h4>
                    <p className="text-gray-300 bg-gray-800/30 rounded-lg p-4">{mockInvoice.notes}</p>
                  </div>
                )}

                {mockInvoice.terms && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Terms & Conditions</h4>
                    <p className="text-gray-300 bg-gray-800/30 rounded-lg p-4">{mockInvoice.terms}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Activity History</h3>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search activities..."
                        className="pl-9 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white text-sm focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                      />
                    </div>
                    <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                      <Filter className="h-4 w-4 text-gray-400" />
                    </button>
                    <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors">
                      <SortDesc className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-green-500 opacity-30"></div>
                  <div className="space-y-6">
                    {mockInvoice.history.map((event, index) => {
                      const ActionIcon = getActionIcon(event.action)
                      return (
                        <div key={event.id} className="relative flex items-start space-x-4">
                          <div className={`relative z-10 p-3 rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 ${getActionColor(event.action)}`}>
                            <ActionIcon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-white font-medium">{event.description}</p>
                                <div className="flex items-center space-x-4 mt-2">
                                  <span className="text-sm text-gray-400 flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>{formatDateTime(event.date)}</span>
                                  </span>
                                  <span className="text-sm text-gray-500 flex items-center space-x-1">
                                    <User className="h-3 w-3" />
                                    <span>{event.user}</span>
                                  </span>
                                  {event.amount && (
                                    <span className="text-sm font-medium text-green-400 flex items-center space-x-1">
                                      <DollarSign className="h-3 w-3" />
                                      <span>${event.amount.toLocaleString()}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button className="p-2 rounded-lg hover:bg-gray-800/50 transition-colors opacity-0 group-hover:opacity-100">
                                <MoreVertical className="h-4 w-4 text-gray-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'attachments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Attachments</h3>
                  <div className="flex items-center space-x-3">
                    <button className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all flex items-center space-x-2">
                      <Camera className="h-4 w-4" />
                      <span>Add Photo</span>
                    </button>
                    <button className="px-4 py-2 rounded-lg gradient-purple text-white hover:opacity-90 transition-all flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Upload File</span>
                    </button>
                  </div>
                </div>

                {mockInvoice.attachments && mockInvoice.attachments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mockInvoice.attachments.map((attachment) => {
                      const FileIcon = getFileIcon(attachment.type)
                      return (
                        <div key={attachment.id} className="group bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-4 hover:border-purple-500/30 transition-all">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 rounded-lg bg-purple-600/20">
                                <FileIcon className="h-5 w-5 text-purple-400" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-medium truncate">{attachment.name}</p>
                                <p className="text-sm text-gray-400">{attachment.size}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-1.5 rounded-lg hover:bg-gray-800/50 transition-colors">
                                <Download className="h-4 w-4 text-gray-400" />
                              </button>
                              <button className="p-1.5 rounded-lg hover:bg-gray-800/50 transition-colors">
                                <Trash2 className="h-4 w-4 text-red-400" />
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Uploaded by {attachment.uploadedBy}</span>
                            <span>{formatDateTime(attachment.uploadDate)}</span>
                          </div>
                          {attachment.type === 'image' && (
                            <div className="mt-3 aspect-video bg-gray-800/50 rounded-lg flex items-center justify-center">
                              <FileImage className="h-8 w-8 text-gray-500" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-800/50 flex items-center justify-center">
                      <Paperclip className="h-8 w-8 text-gray-500" />
                    </div>
                    <h4 className="text-lg font-medium text-white mb-2">No attachments yet</h4>
                    <p className="text-gray-400 mb-4">Upload files related to this invoice</p>
                    <button className="px-4 py-2 rounded-lg gradient-purple text-white hover:opacity-90 transition-all flex items-center space-x-2 mx-auto">
                      <Upload className="h-4 w-4" />
                      <span>Upload First File</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white">Payment Information</h3>

                {mockInvoice.status === 'paid' && (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <div className="flex items-center space-x-2 mb-2">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-green-400 font-medium">Payment Received</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Amount Paid</span>
                        <p className="text-white font-medium">${mockInvoice.total.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Payment Date</span>
                        <p className="text-white font-medium">{formatDate(mockInvoice.paidDate!)}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Payment Method</span>
                        <p className="text-white font-medium">{mockInvoice.paymentMethod}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Reference</span>
                        <p className="text-white font-medium">{mockInvoice.paymentReference}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Payment Terms</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Terms</span>
                        <span className="text-white">{mockInvoice.paymentTerms}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Currency</span>
                        <span className="text-white">{mockInvoice.currency}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-3">Amount Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="text-white">${mockInvoice.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tax</span>
                        <span className="text-white">${mockInvoice.taxAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between font-bold border-t border-gray-800 pt-2">
                        <span className="text-white">Total</span>
                        <span className="text-green-400">${mockInvoice.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {mockInvoice.status !== 'paid' && (
                  <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-400 font-medium">Payment Pending</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {mockInvoice.status === 'overdue'
                            ? 'This invoice is overdue and requires immediate attention'
                            : 'Awaiting payment from client'
                          }
                        </p>
                      </div>
                      <button
                        onClick={() => setShowPaymentDialog(true)}
                        className="px-4 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
                      >
                        Mark as Paid
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-6">
          {/* Client Information */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Client Information</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                  <Building className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <Link
                    href={`/dashboard/clients/${mockInvoice.client.id}`}
                    className="text-white font-medium hover:text-purple-400 transition-colors"
                  >
                    {mockInvoice.client.name}
                  </Link>
                  <p className="text-sm text-gray-400 mt-1">Tax ID: {mockInvoice.client.taxId}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <a href={`mailto:${mockInvoice.client.email}`} className="text-gray-300 hover:text-white transition-colors">
                    {mockInvoice.client.email}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <a href={`tel:${mockInvoice.client.phone}`} className="text-gray-300 hover:text-white transition-colors">
                    {mockInvoice.client.phone}
                  </a>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div className="text-gray-300">
                    <p>{mockInvoice.client.address.street}</p>
                    <p>{mockInvoice.client.address.city}, {mockInvoice.client.address.state} {mockInvoice.client.address.zip}</p>
                    <p>{mockInvoice.client.address.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">From</h3>
            <div className="space-y-4">
              <div>
                <p className="text-white font-medium">{mockInvoice.company.name}</p>
                <p className="text-sm text-gray-400">Tax ID: {mockInvoice.company.taxId}</p>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{mockInvoice.company.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{mockInvoice.company.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                  <a
                    href={`https://${mockInvoice.company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    {mockInvoice.company.website}
                  </a>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div className="text-gray-300">
                    <p>{mockInvoice.company.address.street}</p>
                    <p>{mockInvoice.company.address.city}, {mockInvoice.company.address.state} {mockInvoice.company.address.zip}</p>
                    <p>{mockInvoice.company.address.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm flex items-center justify-center space-x-2">
                <Copy className="h-4 w-4" />
                <span>Duplicate Invoice</span>
              </button>
              <button className="w-full py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm flex items-center justify-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Send Reminder</span>
              </button>
              <button className="w-full py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm flex items-center justify-center space-x-2">
                <Share2 className="h-4 w-4" />
                <span>Share Link</span>
              </button>
              <button className="w-full py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors text-sm flex items-center justify-center space-x-2">
                <Archive className="h-4 w-4" />
                <span>Archive</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}