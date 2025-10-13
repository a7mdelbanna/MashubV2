'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Eye, CheckCircle, Clock, AlertCircle, Calendar, DollarSign } from 'lucide-react'
import Select from '@/components/ui/select'
import { formatWithCurrency, formatDate } from '@/lib/finance-utils'

const currency = { code: 'EGP', symbol: 'E£', symbolPosition: 'before' as const, decimalPlaces: 2 }

interface Reconciliation {
  id: string
  accountId: string
  accountName: string
  statementDate: Date
  statementBalance: number
  bookBalance: number
  difference: number
  matchedTransactions: number
  unmatchedTransactions: number
  status: 'in-progress' | 'completed' | 'needs-review'
  reconciledBy?: string
  reconciledAt?: Date
  createdAt: Date
}

export default function ReconciliationPage() {
  const [reconciliations, setReconciliations] = useState<Reconciliation[]>([
    {
      id: '1',
      accountId: 'acc1',
      accountName: 'CIB - EGP Main Account',
      statementDate: new Date('2024-03-31'),
      statementBalance: 285600.50,
      bookBalance: 285600.50,
      difference: 0,
      matchedTransactions: 45,
      unmatchedTransactions: 0,
      status: 'completed',
      reconciledBy: 'Ahmed Hassan',
      reconciledAt: new Date('2024-04-01'),
      createdAt: new Date('2024-04-01')
    },
    {
      id: '2',
      accountId: 'acc2',
      accountName: 'Stripe USD',
      statementDate: new Date('2024-03-31'),
      statementBalance: 12450.75,
      bookBalance: 12380.25,
      difference: 70.50,
      matchedTransactions: 38,
      unmatchedTransactions: 3,
      status: 'needs-review',
      createdAt: new Date('2024-04-02')
    },
    {
      id: '3',
      accountId: 'acc4',
      accountName: 'Paymob EGP',
      statementDate: new Date('2024-03-31'),
      statementBalance: 45800,
      bookBalance: 45800,
      difference: 0,
      matchedTransactions: 52,
      unmatchedTransactions: 0,
      status: 'completed',
      reconciledBy: 'Sarah Mohamed',
      reconciledAt: new Date('2024-04-01'),
      createdAt: new Date('2024-04-01')
    },
    {
      id: '4',
      accountId: 'acc1',
      accountName: 'CIB - EGP Main Account',
      statementDate: new Date('2024-02-29'),
      statementBalance: 280000,
      bookBalance: 280000,
      difference: 0,
      matchedTransactions: 42,
      unmatchedTransactions: 0,
      status: 'completed',
      reconciledBy: 'Ahmed Hassan',
      reconciledAt: new Date('2024-03-01'),
      createdAt: new Date('2024-03-01')
    },
    {
      id: '5',
      accountId: 'acc3',
      accountName: 'Cash - Cairo Office',
      statementDate: new Date('2024-03-31'),
      statementBalance: 8500,
      bookBalance: 8520,
      difference: -20,
      matchedTransactions: 15,
      unmatchedTransactions: 1,
      status: 'in-progress',
      createdAt: new Date('2024-04-03')
    }
  ])

  const [statusFilter, setStatusFilter] = useState<string>('')
  const [searchText, setSearchText] = useState('')

  // Filter reconciliations
  const filteredReconciliations = reconciliations.filter(recon => {
    if (statusFilter && recon.status !== statusFilter) return false
    if (searchText) {
      const search = searchText.toLowerCase()
      return recon.accountName.toLowerCase().includes(search)
    }
    return true
  })

  // Statistics
  const completedCount = reconciliations.filter(r => r.status === 'completed').length
  const needsReviewCount = reconciliations.filter(r => r.status === 'needs-review').length
  const inProgressCount = reconciliations.filter(r => r.status === 'in-progress').length
  const totalDifferences = Math.abs(reconciliations
    .filter(r => r.status !== 'completed')
    .reduce((sum, r) => sum + r.difference, 0))

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'needs-review':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-400/10 text-green-400 border-green-500'
      case 'in-progress':
        return 'bg-yellow-400/10 text-yellow-400 border-yellow-500'
      case 'needs-review':
        return 'bg-red-400/10 text-red-400 border-red-500'
      default:
        return 'bg-gray-400/10 text-gray-400 border-gray-500'
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
            Bank Reconciliation
          </h1>
          <p className="text-gray-400">
            Match your internal records with bank statements
          </p>
        </div>
        <Link
          href="/dashboard/finance/reconciliation/new"
          className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Reconciliation</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Reconciliations</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{reconciliations.length}</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Completed</span>
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-400">{completedCount}</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Needs Review</span>
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400">{needsReviewCount}</p>
          <p className="text-gray-400 text-xs mt-1">{inProgressCount} in progress</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Differences</span>
            <DollarSign className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-400">
            {formatWithCurrency(totalDifferences, currency)}
          </p>
          <p className="text-gray-400 text-xs mt-1">Pending resolution</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Status"
            options={[
              { value: '', label: 'All Status' },
              { value: 'completed', label: 'Completed' },
              { value: 'in-progress', label: 'In Progress' },
              { value: 'needs-review', label: 'Needs Review' }
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search account name..."
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {(statusFilter || searchText) && (
          <div className="mt-4">
            <button
              onClick={() => {
                setStatusFilter('')
                setSearchText('')
              }}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Clear filters
            </button>
            <span className="text-gray-400 text-sm ml-4">
              Showing {filteredReconciliations.length} of {reconciliations.length} reconciliations
            </span>
          </div>
        )}
      </div>

      {/* Reconciliations Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Account
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Statement Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Statement Balance
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Book Balance
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Difference
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Transactions
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
              {filteredReconciliations.map((recon) => (
                <tr key={recon.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-white font-medium">{recon.accountName}</div>
                      {recon.reconciledBy && (
                        <div className="text-gray-400 text-xs mt-1">
                          by {recon.reconciledBy}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {formatDate(recon.statementDate, 'short')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-300">
                    {formatWithCurrency(recon.statementBalance, currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-gray-300">
                    {formatWithCurrency(recon.bookBalance, currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {recon.difference !== 0 ? (
                      <span className={`font-semibold ${
                        recon.difference > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {recon.difference > 0 ? '+' : ''}
                        {formatWithCurrency(recon.difference, currency)}
                      </span>
                    ) : (
                      <span className="text-green-400 font-semibold">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <span className="text-green-400 font-semibold">{recon.matchedTransactions}</span>
                      <span className="text-gray-400"> matched</span>
                    </div>
                    {recon.unmatchedTransactions > 0 && (
                      <div className="text-sm mt-1">
                        <span className="text-yellow-400 font-semibold">{recon.unmatchedTransactions}</span>
                        <span className="text-gray-400"> unmatched</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(recon.status)}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(recon.status)}`}>
                        {recon.status.replace('-', ' ')}
                      </span>
                    </div>
                    {recon.reconciledAt && (
                      <div className="text-gray-500 text-xs mt-1">
                        {formatDate(recon.reconciledAt, 'short')}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/dashboard/finance/reconciliation/${recon.id}`}
                      className="p-2 text-purple-400 hover:bg-purple-400/10 rounded-lg transition-colors inline-flex"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-blue-400" />
          About Bank Reconciliation
        </h3>
        <div className="text-gray-300 space-y-2 text-sm">
          <p>
            <strong className="text-white">Purpose:</strong> Ensure your internal transaction records match your bank statements to catch errors, fraud, or missing transactions.
          </p>
          <p>
            <strong className="text-white">Process:</strong> Compare your book balance with the bank statement balance, match transactions, and investigate any differences.
          </p>
          <p>
            <strong className="text-white">Best Practice:</strong> Reconcile accounts monthly to maintain accurate financial records.
          </p>
        </div>
      </div>
    </div>
  )
}
