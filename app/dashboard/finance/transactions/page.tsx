'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Filter, Download, TrendingUp, TrendingDown, DollarSign, FileText, Eye, Edit2 } from 'lucide-react'
import Select from '@/components/ui/select'
import { FinanceTransaction, TransactionType, TransactionState } from '@/types/finance'
import { formatWithCurrency, formatDate } from '@/lib/finance-utils'
import { transactionTypeOptions, transactionStateOptions } from '@/lib/select-options'

// Mock currency
const currencies = {
  'EGP': { code: 'EGP', symbol: 'E£', symbolPosition: 'before' as const, decimalPlaces: 2 },
  'USD': { code: 'USD', symbol: '$', symbolPosition: 'before' as const, decimalPlaces: 2 }
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<FinanceTransaction[]>([
    {
      id: '1',
      tenantId: 'tenant1',
      type: 'income',
      amount: 15000,
      currency: 'EGP',
      accountId: 'acc1',
      accountName: 'CIB - EGP Main Account',
      description: 'Client payment - Project XYZ',
      categoryPath: 'Income/Services/Development',
      contactName: 'Tech Corp Ltd',
      state: 'posted',
      postedAt: new Date('2024-03-10'),
      requiresApproval: false,
      attachments: [],
      createdBy: 'user1',
      createdAt: new Date('2024-03-10')
    },
    {
      id: '2',
      tenantId: 'tenant1',
      type: 'expense',
      amount: 8500,
      currency: 'EGP',
      accountId: 'acc1',
      accountName: 'CIB - EGP Main Account',
      description: 'Office rent - March 2024',
      categoryPath: 'Expense/Office/Rent',
      contactName: 'Cairo Properties',
      state: 'posted',
      postedAt: new Date('2024-03-08'),
      requiresApproval: false,
      attachments: [{ id: '1', fileName: 'invoice.pdf', fileUrl: '#', fileType: 'application/pdf', fileSize: 125000, uploadedBy: 'user1', uploadedAt: new Date() }],
      createdBy: 'user1',
      createdAt: new Date('2024-03-08')
    },
    {
      id: '3',
      tenantId: 'tenant1',
      type: 'income',
      amount: 2800,
      currency: 'USD',
      accountId: 'acc2',
      accountName: 'Stripe USD',
      description: 'Subscription payment - Client ABC',
      categoryPath: 'Income/Recurring/Subscriptions',
      state: 'posted',
      postedAt: new Date('2024-03-09'),
      requiresApproval: false,
      attachments: [],
      createdBy: 'system',
      createdAt: new Date('2024-03-09'),
      amountInDefaultCurrency: 86600,
      fxSnapshot: {
        baseCurrency: 'USD',
        targetCurrency: 'EGP',
        rate: 30.93,
        source: 'exchangerate-api',
        timestamp: new Date('2024-03-09')
      }
    },
    {
      id: '4',
      tenantId: 'tenant1',
      type: 'expense',
      amount: 12000,
      currency: 'EGP',
      accountId: 'acc1',
      accountName: 'CIB - EGP Main Account',
      description: 'Marketing campaign - Social media ads',
      categoryPath: 'Expense/Marketing/Digital Ads',
      state: 'pending-approval',
      requiresApproval: true,
      attachments: [],
      createdBy: 'user2',
      createdAt: new Date('2024-03-11')
    },
    {
      id: '5',
      tenantId: 'tenant1',
      type: 'transfer',
      amount: 5000,
      currency: 'USD',
      sourceAccountId: 'acc2',
      destinationAccountId: 'acc3',
      accountId: 'acc2',
      accountName: 'Stripe USD',
      description: 'Transfer from Stripe to Wise',
      state: 'posted',
      postedAt: new Date('2024-03-07'),
      requiresApproval: false,
      attachments: [],
      createdBy: 'user1',
      createdAt: new Date('2024-03-07')
    },
    {
      id: '6',
      tenantId: 'tenant1',
      type: 'expense',
      amount: 3500,
      currency: 'EGP',
      accountId: 'acc5',
      accountName: 'Cash - Cairo Office',
      description: 'Office supplies and equipment',
      categoryPath: 'Expense/Office/Supplies',
      state: 'draft',
      requiresApproval: false,
      attachments: [],
      createdBy: 'user1',
      createdAt: new Date('2024-03-11')
    }
  ])

  // Filters
  const [filters, setFilters] = useState({
    type: '',
    state: '',
    searchText: ''
  })

  // Filter transactions
  const filteredTransactions = transactions.filter(txn => {
    if (filters.type && txn.type !== filters.type) return false
    if (filters.state && txn.state !== filters.state) return false
    if (filters.searchText) {
      const search = filters.searchText.toLowerCase()
      return (
        txn.description.toLowerCase().includes(search) ||
        txn.accountName.toLowerCase().includes(search) ||
        txn.contactName?.toLowerCase().includes(search) ||
        txn.categoryPath?.toLowerCase().includes(search)
      )
    }
    return true
  })

  // Calculate statistics
  const totalIncome = transactions
    .filter(t => t.type === 'income' && t.state === 'posted')
    .reduce((sum, t) => sum + (t.amountInDefaultCurrency || t.amount), 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && t.state === 'posted')
    .reduce((sum, t) => sum + (t.amountInDefaultCurrency || t.amount), 0)

  const pendingApprovals = transactions.filter(t => t.state === 'pending-approval').length
  const draftCount = transactions.filter(t => t.state === 'draft').length

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case 'income':
        return <TrendingUp className="w-5 h-5 text-green-400" />
      case 'expense':
        return <TrendingDown className="w-5 h-5 text-red-400" />
      case 'transfer':
        return <DollarSign className="w-5 h-5 text-blue-400" />
    }
  }

  const getStateColor = (state: TransactionState) => {
    switch (state) {
      case 'posted':
        return 'bg-green-400/10 text-green-400'
      case 'pending-approval':
        return 'bg-yellow-400/10 text-yellow-400'
      case 'approved':
        return 'bg-blue-400/10 text-blue-400'
      case 'draft':
        return 'bg-gray-400/10 text-gray-400'
      case 'void':
        return 'bg-red-400/10 text-red-400'
      case 'rejected':
        return 'bg-red-400/10 text-red-400'
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
            Transactions
          </h1>
          <p className="text-gray-400">
            Track all income, expenses, and transfers across your accounts
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-700 transition-all duration-300 flex items-center">
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
          <Link
            href="/dashboard/finance/transactions/new"
            className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Transaction</span>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Income</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-400">
            {formatWithCurrency(totalIncome, currencies['EGP'])}
          </p>
          <p className="text-gray-400 text-xs mt-1">Posted transactions</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Expenses</span>
            <TrendingDown className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400">
            {formatWithCurrency(totalExpenses, currencies['EGP'])}
          </p>
          <p className="text-gray-400 text-xs mt-1">Posted transactions</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Net Profit</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {formatWithCurrency(totalIncome - totalExpenses, currencies['EGP'])}
          </p>
          <p className="text-gray-400 text-xs mt-1">Income - Expenses</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Pending Actions</span>
            <FileText className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{pendingApprovals + draftCount}</p>
          <p className="text-gray-400 text-xs mt-1">{pendingApprovals} approvals, {draftCount} drafts</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Type Filter */}
          <Select
            label="Transaction Type"
            options={[{ value: '', label: 'All Types' }, ...transactionTypeOptions]}
            value={filters.type}
            onChange={(value) => setFilters(prev => ({ ...prev, type: value }))}
          />

          {/* State Filter */}
          <Select
            label="Status"
            options={[{ value: '', label: 'All Status' }, ...transactionStateOptions]}
            value={filters.state}
            onChange={(value) => setFilters(prev => ({ ...prev, state: value }))}
          />

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              value={filters.searchText}
              onChange={(e) => setFilters(prev => ({ ...prev, searchText: e.target.value }))}
              placeholder="Search description, account, contact..."
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {(filters.type || filters.state || filters.searchText) && (
          <div className="mt-4">
            <button
              onClick={() => setFilters({ type: '', state: '', searchText: '' })}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Clear all filters
            </button>
            <span className="text-gray-400 text-sm ml-4">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </span>
          </div>
        )}
      </div>

      {/* Transactions Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                    No transactions found. Try adjusting your filters or create a new transaction.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((txn) => {
                  const currency = currencies[txn.currency as keyof typeof currencies]
                  const displayAmount = txn.amountInDefaultCurrency || txn.amount

                  return (
                    <tr key={txn.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">
                        {txn.postedAt ? formatDate(txn.postedAt, 'short') : formatDate(txn.createdAt, 'short')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(txn.type)}
                          <span className="text-gray-300 capitalize">{txn.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{txn.description}</div>
                          {txn.contactName && (
                            <div className="text-gray-400 text-xs mt-1">{txn.contactName}</div>
                          )}
                          {txn.attachments.length > 0 && (
                            <div className="text-blue-400 text-xs mt-1 flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {txn.attachments.length} attachment{txn.attachments.length > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300 text-sm">{txn.accountName}</div>
                      </td>
                      <td className="px-6 py-4">
                        {txn.categoryPath && (
                          <div className="text-gray-400 text-xs">{txn.categoryPath}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div>
                          <div className={`font-semibold ${
                            txn.type === 'income' ? 'text-green-400' :
                            txn.type === 'expense' ? 'text-red-400' :
                            'text-blue-400'
                          }`}>
                            {txn.type === 'income' ? '+' : txn.type === 'expense' ? '-' : ''}
                            {currency && formatWithCurrency(txn.amount, currency)}
                          </div>
                          {txn.fxSnapshot && (
                            <div className="text-gray-500 text-xs mt-1">
                              Rate: {txn.fxSnapshot.rate.toFixed(4)}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStateColor(txn.state)}`}>
                          {txn.state}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dashboard/finance/transactions/${txn.id}`}
                            className="p-2 text-purple-400 hover:bg-purple-400/10 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {(txn.state === 'draft' || txn.state === 'pending-approval') && (
                            <Link
                              href={`/dashboard/finance/transactions/${txn.id}/edit`}
                              className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                              title="Edit Transaction"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          About Transactions
        </h3>
        <div className="text-gray-300 space-y-2 text-sm">
          <p>
            <strong className="text-white">Transaction States:</strong> Draft → Pending Approval → Approved → Posted.
            Only posted transactions affect account balances and reports.
          </p>
          <p>
            <strong className="text-white">FX Conversions:</strong> When a transaction is posted in a non-default currency,
            the current exchange rate is captured as an immutable snapshot. Historical reports remain accurate.
          </p>
          <p>
            <strong className="text-white">Transfers:</strong> Transfer transactions move money between accounts.
            Both accounts must use the same currency.
          </p>
          <p>
            <strong className="text-white">Attachments:</strong> Upload invoices, receipts, and supporting documents.
            Attachments are preserved even if a transaction is voided.
          </p>
        </div>
      </div>
    </div>
  )
}
