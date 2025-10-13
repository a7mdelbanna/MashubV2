'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, DollarSign, Calendar, AlertCircle, Check } from 'lucide-react'
import { formatWithCurrency, formatDate } from '@/lib/finance-utils'

const currency = { code: 'EGP', symbol: 'E£', symbolPosition: 'before' as const, decimalPlaces: 2 }

interface Transaction {
  id: string
  date: Date
  description: string
  amount: number
  type: 'income' | 'expense'
  isMatched: boolean
}

export default function ReconciliationDetailPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedTxns, setSelectedTxns] = useState<Set<string>>(new Set())

  const [reconciliation, setReconciliation] = useState({
    id: params.id,
    accountName: 'CIB - EGP Main Account',
    statementDate: new Date('2024-03-31'),
    statementBalance: 285600.50,
    bookBalance: 285600.50,
    difference: 0,
    status: 'completed' as const,
    notes: 'March 2024 reconciliation'
  })

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      date: new Date('2024-03-28'),
      description: 'Client Payment - Invoice #123',
      amount: 15000,
      type: 'income',
      isMatched: true
    },
    {
      id: '2',
      date: new Date('2024-03-29'),
      description: 'Office Supplies Purchase',
      amount: -850,
      type: 'expense',
      isMatched: true
    },
    {
      id: '3',
      date: new Date('2024-03-30'),
      description: 'Consulting Fee - TechCorp',
      amount: 12000,
      type: 'income',
      isMatched: true
    },
    {
      id: '4',
      date: new Date('2024-03-31'),
      description: 'Software License Renewal',
      amount: -299,
      type: 'expense',
      isMatched: false
    },
    {
      id: '5',
      date: new Date('2024-03-31'),
      description: 'Wire Transfer Fee',
      amount: -50,
      type: 'expense',
      isMatched: false
    }
  ])

  useEffect(() => {
    const fetchReconciliation = async () => {
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        // Data already set above
      } catch (error) {
        console.error('Error fetching reconciliation:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReconciliation()
  }, [params.id])

  const handleToggleMatch = (txnId: string) => {
    setTransactions(transactions.map(txn =>
      txn.id === txnId ? { ...txn, isMatched: !txn.isMatched } : txn
    ))
  }

  const handleBulkMatch = () => {
    if (selectedTxns.size === 0) return

    setTransactions(transactions.map(txn =>
      selectedTxns.has(txn.id) ? { ...txn, isMatched: true } : txn
    ))
    setSelectedTxns(new Set())
  }

  const handleToggleSelect = (txnId: string) => {
    const newSelected = new Set(selectedTxns)
    if (newSelected.has(txnId)) {
      newSelected.delete(txnId)
    } else {
      newSelected.add(txnId)
    }
    setSelectedTxns(newSelected)
  }

  const matchedCount = transactions.filter(t => t.isMatched).length
  const unmatchedCount = transactions.filter(t => !t.isMatched).length
  const matchedTotal = transactions
    .filter(t => t.isMatched)
    .reduce((sum, t) => sum + t.amount, 0)
  const unmatchedTotal = transactions
    .filter(t => !t.isMatched)
    .reduce((sum, t) => sum + t.amount, 0)

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading reconciliation...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/finance/reconciliation"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Reconciliations
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
              Reconciliation Details
            </h1>
            <p className="text-gray-400">{reconciliation.accountName}</p>
          </div>
          <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${
            reconciliation.status === 'completed'
              ? 'bg-green-400/10 text-green-400 border-green-500'
              : 'bg-yellow-400/10 text-yellow-400 border-yellow-500'
          }`}>
            {reconciliation.status === 'completed' ? (
              <CheckCircle className="w-4 h-4 mr-2" />
            ) : (
              <AlertCircle className="w-4 h-4 mr-2" />
            )}
            {reconciliation.status.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Statement Balance</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {formatWithCurrency(reconciliation.statementBalance, currency)}
          </p>
          <p className="text-gray-400 text-xs mt-1">{formatDate(reconciliation.statementDate, 'short')}</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Book Balance</span>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {formatWithCurrency(reconciliation.bookBalance, currency)}
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Difference</span>
            {Math.abs(reconciliation.difference) < 0.01 ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
          </div>
          <p className={`text-2xl font-bold ${
            Math.abs(reconciliation.difference) < 0.01 ? 'text-green-400' : 'text-red-400'
          }`}>
            {reconciliation.difference > 0 ? '+' : ''}
            {formatWithCurrency(reconciliation.difference, currency)}
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Transactions</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="space-y-1">
            <p className="text-lg font-bold text-green-400">{matchedCount} matched</p>
            {unmatchedCount > 0 && (
              <p className="text-sm text-yellow-400">{unmatchedCount} unmatched</p>
            )}
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedTxns.size > 0 && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <p className="text-white">
              <strong>{selectedTxns.size}</strong> transaction{selectedTxns.size !== 1 ? 's' : ''} selected
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleBulkMatch}
                className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors text-sm"
              >
                Mark as Matched
              </button>
              <button
                onClick={() => setSelectedTxns(new Set())}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transactions List */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Transactions to Match</h2>
          <p className="text-gray-400 text-sm mt-1">
            Check transactions that appear on your bank statement
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={selectedTxns.size === transactions.filter(t => !t.isMatched).length && transactions.filter(t => !t.isMatched).length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedTxns(new Set(transactions.filter(t => !t.isMatched).map(t => t.id)))
                      } else {
                        setSelectedTxns(new Set())
                      }
                    }}
                    className="w-4 h-4 text-purple-600 bg-gray-900 border-gray-700 rounded focus:ring-purple-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Description
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
              {transactions.map((txn) => (
                <tr
                  key={txn.id}
                  className={`hover:bg-gray-700/30 transition-colors ${
                    txn.isMatched ? 'opacity-60' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    {!txn.isMatched && (
                      <input
                        type="checkbox"
                        checked={selectedTxns.has(txn.id)}
                        onChange={() => handleToggleSelect(txn.id)}
                        className="w-4 h-4 text-purple-600 bg-gray-900 border-gray-700 rounded focus:ring-purple-500"
                      />
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">
                    {formatDate(txn.date, 'short')}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{txn.description}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`font-semibold ${
                      txn.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {txn.amount > 0 ? '+' : ''}
                      {formatWithCurrency(txn.amount, currency)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {txn.isMatched ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Matched
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-400/10 text-yellow-400">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Unmatched
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleMatch(txn.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        txn.isMatched
                          ? 'text-red-400 hover:bg-red-400/10'
                          : 'text-green-400 hover:bg-green-400/10'
                      }`}
                      title={txn.isMatched ? 'Unmatch' : 'Match'}
                    >
                      {txn.isMatched ? <XCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-900/50 border-t border-gray-700">
              <tr>
                <td colSpan={3} className="px-6 py-4 text-right">
                  <span className="text-white font-semibold">Matched Total:</span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-green-400 font-bold text-lg">
                    {formatWithCurrency(matchedTotal, currency)}
                  </span>
                </td>
                <td colSpan={2}></td>
              </tr>
              {unmatchedCount > 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-right">
                    <span className="text-white font-semibold">Unmatched Total:</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-yellow-400 font-bold text-lg">
                      {formatWithCurrency(unmatchedTotal, currency)}
                    </span>
                  </td>
                  <td colSpan={2}></td>
                </tr>
              )}
            </tfoot>
          </table>
        </div>
      </div>

      {/* Notes */}
      {reconciliation.notes && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Notes</h2>
          <p className="text-gray-300">{reconciliation.notes}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4">
        {reconciliation.status !== 'completed' && (
          <button className="px-6 py-3 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Complete Reconciliation</span>
          </button>
        )}
        <Link
          href="/dashboard/finance/reconciliation"
          className="px-6 py-3 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back to List
        </Link>
      </div>
    </div>
  )
}
