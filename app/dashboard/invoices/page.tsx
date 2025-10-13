'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus, Search, Filter, Download, Eye, Edit, Send,
  FileText, Calendar, DollarSign, Clock, CheckCircle,
  AlertCircle, XCircle, Building, User, MoreVertical,
  ArrowUpDown, RefreshCw, TrendingUp, TrendingDown,
  CreditCard, Archive, Copy, Trash2, Mail
} from 'lucide-react'
import Select from '@/components/ui/select'
import { dateRangeOptions } from '@/lib/select-options'

// Mock invoice data
const mockInvoices = [
  {
    id: 'inv1',
    number: 'INV-2024-001',
    client: { id: 'c1', name: 'TechCorp Solutions', email: 'contact@techcorp.com' },
    project: { id: 'p1', name: 'E-commerce Platform' },
    amount: 12500,
    status: 'paid',
    issueDate: '2024-03-01',
    dueDate: '2024-03-31',
    paidDate: '2024-03-28',
    items: 5,
    currency: 'USD'
  },
  {
    id: 'inv2',
    number: 'INV-2024-002',
    client: { id: 'c2', name: 'FinanceHub', email: 'info@financehub.com' },
    project: { id: 'p2', name: 'Financial Dashboard' },
    amount: 8750,
    status: 'sent',
    issueDate: '2024-03-15',
    dueDate: '2024-04-15',
    paidDate: null,
    items: 3,
    currency: 'USD'
  },
  {
    id: 'inv3',
    number: 'INV-2024-003',
    client: { id: 'c3', name: 'GlobalHR Solutions', email: 'contact@globalhr.com' },
    project: { id: 'p3', name: 'HR Management System' },
    amount: 15000,
    status: 'overdue',
    issueDate: '2024-02-15',
    dueDate: '2024-03-15',
    paidDate: null,
    items: 7,
    currency: 'USD'
  },
  {
    id: 'inv4',
    number: 'INV-2024-004',
    client: { id: 'c4', name: 'RetailChain Pro', email: 'support@retailchain.com' },
    project: null,
    amount: 5500,
    status: 'draft',
    issueDate: '2024-03-20',
    dueDate: '2024-04-20',
    paidDate: null,
    items: 2,
    currency: 'USD'
  },
  {
    id: 'inv5',
    number: 'INV-2024-005',
    client: { id: 'c1', name: 'TechCorp Solutions', email: 'contact@techcorp.com' },
    project: { id: 'p4', name: 'Mobile App Development' },
    amount: 22000,
    status: 'sent',
    issueDate: '2024-03-22',
    dueDate: '2024-04-22',
    paidDate: null,
    items: 8,
    currency: 'USD'
  },
  {
    id: 'inv6',
    number: 'INV-2024-006',
    client: { id: 'c5', name: 'MediCare Plus', email: 'admin@medicare.com' },
    project: { id: 'p5', name: 'Patient Management System' },
    amount: 18500,
    status: 'paid',
    issueDate: '2024-03-10',
    dueDate: '2024-04-10',
    paidDate: '2024-04-05',
    items: 6,
    currency: 'USD'
  }
]

export default function InvoicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date_desc')
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [dateRange, setDateRange] = useState('this-month')
  const [clientFilter, setClientFilter] = useState('all')
  const [amountRange, setAmountRange] = useState('all')

  // Local select options
  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'sent', label: 'Sent' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' }
  ]

  const sortOptions = [
    { value: 'date_desc', label: 'Date (Newest)' },
    { value: 'date_asc', label: 'Date (Oldest)' },
    { value: 'amount_desc', label: 'Amount (High to Low)' },
    { value: 'amount_asc', label: 'Amount (Low to High)' },
    { value: 'status', label: 'Status' },
    { value: 'client', label: 'Client Name' }
  ]

  const clientOptions = [
    { value: 'all', label: 'All Clients' },
    { value: 'techcorp', label: 'TechCorp Solutions' },
    { value: 'financehub', label: 'FinanceHub' },
    { value: 'globalhr', label: 'GlobalHR Solutions' }
  ]

  const amountRangeOptions = [
    { value: 'all', label: 'All Amounts' },
    { value: '0-5000', label: '$0 - $5,000' },
    { value: '5000-15000', label: '$5,000 - $15,000' },
    { value: '15000+', label: '$15,000+' }
  ]

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'draft': return 'text-gray-400 bg-gray-400/10'
      case 'sent': return 'text-blue-400 bg-blue-400/10'
      case 'paid': return 'text-green-400 bg-green-400/10'
      case 'overdue': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
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

  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch =
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.project?.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter

    return matchesSearch && matchesStatus
  }).sort((a, b) => {
    switch(sortBy) {
      case 'date_desc':
        return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
      case 'date_asc':
        return new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime()
      case 'amount_desc':
        return b.amount - a.amount
      case 'amount_asc':
        return a.amount - b.amount
      case 'status':
        return a.status.localeCompare(b.status)
      case 'client':
        return a.client.name.localeCompare(b.client.name)
      default:
        return 0
    }
  })

  const toggleInvoiceSelection = (invoiceId: string) => {
    setSelectedInvoices(prev =>
      prev.includes(invoiceId)
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    )
  }

  const toggleSelectAll = () => {
    setSelectedInvoices(
      selectedInvoices.length === filteredInvoices.length
        ? []
        : filteredInvoices.map(inv => inv.id)
    )
  }

  // Calculate stats
  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0)
  const paidAmount = filteredInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0)
  const pendingAmount = filteredInvoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + inv.amount, 0)
  const overdueAmount = filteredInvoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getDaysOverdue = (dueDate: string, status: string) => {
    if (status !== 'overdue') return 0
    const today = new Date()
    const due = new Date(dueDate)
    return Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Invoices</h1>
          <p className="text-gray-400">Manage and track your client invoices</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <Link
            href="/dashboard/invoices/new"
            className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Create Invoice</span>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Total Invoiced</span>
            <DollarSign className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">${totalAmount.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{filteredInvoices.length} invoices</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Paid</span>
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">${paidAmount.toLocaleString()}</p>
          <p className="text-xs text-green-400 mt-1">
            {filteredInvoices.filter(inv => inv.status === 'paid').length} invoices
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Pending</span>
            <Clock className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">${pendingAmount.toLocaleString()}</p>
          <p className="text-xs text-yellow-400 mt-1">
            {filteredInvoices.filter(inv => inv.status === 'sent').length} invoices
          </p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Overdue</span>
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-white">${overdueAmount.toLocaleString()}</p>
          <p className="text-xs text-red-400 mt-1">
            {filteredInvoices.filter(inv => inv.status === 'overdue').length} invoices
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Search invoices..."
              />
            </div>

            <div className="w-48">
              <Select
                options={statusOptions}
                value={statusFilter}
                onChange={setStatusFilter}
              />
            </div>

            <div className="w-56">
              <Select
                options={sortOptions}
                value={sortBy}
                onChange={setSortBy}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {selectedInvoices.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">
                  {selectedInvoices.length} selected
                </span>
                <button className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors">
                  Send Reminder
                </button>
                <button className="px-3 py-1 rounded-lg bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 transition-colors">
                  Export Selected
                </button>
              </div>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:bg-gray-800 transition-colors"
            >
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="grid grid-cols-3 gap-4">
              <Select
                label="Date Range"
                options={dateRangeOptions}
                value={dateRange}
                onChange={setDateRange}
              />
              <Select
                label="Client"
                options={clientOptions}
                value={clientFilter}
                onChange={setClientFilter}
              />
              <Select
                label="Amount Range"
                options={amountRangeOptions}
                value={amountRange}
                onChange={setAmountRange}
              />
            </div>
          </div>
        )}
      </div>

      {/* Invoices Table */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-400">
                  <input
                    type="checkbox"
                    checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Invoice</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Client</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Project</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Amount</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Issue Date</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Due Date</th>
                <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredInvoices.map((invoice) => {
                const StatusIcon = getStatusIcon(invoice.status)
                const isOverdue = invoice.status === 'overdue'
                const daysOverdue = getDaysOverdue(invoice.dueDate, invoice.status)

                return (
                  <tr key={invoice.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={() => toggleInvoiceSelection(invoice.id)}
                        className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                    <td className="p-4">
                      <div>
                        <Link
                          href={`/dashboard/invoices/${invoice.id}`}
                          className="text-white font-medium hover:text-purple-400 transition-colors"
                        >
                          {invoice.number}
                        </Link>
                        <p className="text-xs text-gray-500">{invoice.items} items</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                          <Building className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{invoice.client.name}</p>
                          <p className="text-xs text-gray-500">{invoice.client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {invoice.project ? (
                        <Link
                          href={`/dashboard/projects/${invoice.project.id}`}
                          className="text-gray-300 hover:text-white transition-colors"
                        >
                          {invoice.project.name}
                        </Link>
                      ) : (
                        <span className="text-gray-500">No project</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-white font-medium">
                        ${invoice.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center space-x-1 ${getStatusColor(invoice.status)}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span className="capitalize">{invoice.status}</span>
                        </span>
                        {isOverdue && (
                          <span className="text-xs text-red-400">
                            {daysOverdue}d overdue
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-300">{formatDate(invoice.issueDate)}</span>
                    </td>
                    <td className="p-4">
                      <div>
                        <span className={`text-gray-300 ${isOverdue ? 'text-red-400' : ''}`}>
                          {formatDate(invoice.dueDate)}
                        </span>
                        {invoice.status === 'paid' && invoice.paidDate && (
                          <p className="text-xs text-green-400">
                            Paid {formatDate(invoice.paidDate)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/dashboard/invoices/${invoice.id}`}
                          className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                          title="View Invoice"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        {invoice.status === 'draft' && (
                          <Link
                            href={`/dashboard/invoices/${invoice.id}/edit`}
                            className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                            title="Edit Invoice"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        )}
                        {(invoice.status === 'draft' || invoice.status === 'overdue') && (
                          <button
                            className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                            title="Send Invoice"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No invoices found</h3>
            <p className="text-gray-400 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Create your first invoice to get started'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <Link
                href="/dashboard/invoices/new"
                className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all inline-flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Invoice</span>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredInvoices.length > 0 && (
        <div className="flex items-center justify-between bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-4">
          <div className="text-sm text-gray-400">
            Showing 1 to {filteredInvoices.length} of {filteredInvoices.length} invoices
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 rounded border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors">
              Previous
            </button>
            <span className="px-3 py-1 rounded bg-purple-600 text-white">1</span>
            <button className="px-3 py-1 rounded border border-gray-700 text-gray-400 hover:bg-gray-800 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}