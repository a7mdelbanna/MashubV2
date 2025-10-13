'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Play, Pause, Calendar, DollarSign, TrendingUp, TrendingDown, Repeat } from 'lucide-react'
import Select from '@/components/ui/select'
import { formatWithCurrency, formatDate } from '@/lib/finance-utils'

const currency = { code: 'EGP', symbol: 'E£', symbolPosition: 'before' as const, decimalPlaces: 2 }

interface RecurringTransaction {
  id: string
  type: 'income' | 'expense'
  description: string
  amount: number
  currency: string
  accountName: string
  categoryPath?: string
  contactName?: string
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual'
  startDate: Date
  endDate?: Date
  nextRun: Date
  isActive: boolean
  autoPost: boolean
  lastRun?: Date
  executionCount: number
  createdAt: Date
}

export default function RecurringTransactionsPage() {
  const [recurringTxns, setRecurringTxns] = useState<RecurringTransaction[]>([
    {
      id: '1',
      type: 'expense',
      description: 'Office Rent - Monthly',
      amount: 8500,
      currency: 'EGP',
      accountName: 'CIB - EGP Main Account',
      categoryPath: 'Expense/Office/Rent',
      contactName: 'Cairo Properties',
      frequency: 'monthly',
      startDate: new Date('2024-01-01'),
      nextRun: new Date('2024-04-01'),
      isActive: true,
      autoPost: true,
      lastRun: new Date('2024-03-01'),
      executionCount: 3,
      createdAt: new Date('2023-12-15')
    },
    {
      id: '2',
      type: 'income',
      description: 'SaaS Subscription - Monthly',
      amount: 29.99,
      currency: 'USD',
      accountName: 'Stripe USD',
      categoryPath: 'Income/Recurring',
      frequency: 'monthly',
      startDate: new Date('2024-01-15'),
      nextRun: new Date('2024-04-15'),
      isActive: true,
      autoPost: true,
      lastRun: new Date('2024-03-15'),
      executionCount: 3,
      createdAt: new Date('2024-01-10')
    },
    {
      id: '3',
      type: 'expense',
      description: 'Paymob Service Fee',
      amount: 150,
      currency: 'EGP',
      accountName: 'Paymob EGP',
      categoryPath: 'Expense/Fees',
      contactName: 'Paymob',
      frequency: 'monthly',
      startDate: new Date('2024-02-01'),
      nextRun: new Date('2024-04-01'),
      isActive: true,
      autoPost: false,
      lastRun: new Date('2024-03-01'),
      executionCount: 2,
      createdAt: new Date('2024-01-25')
    },
    {
      id: '4',
      type: 'expense',
      description: 'Annual Software License',
      amount: 1200,
      currency: 'USD',
      accountName: 'Stripe USD',
      categoryPath: 'Expense/Software',
      frequency: 'annual',
      startDate: new Date('2024-01-01'),
      nextRun: new Date('2025-01-01'),
      isActive: true,
      autoPost: false,
      executionCount: 0,
      createdAt: new Date('2023-12-20')
    },
    {
      id: '5',
      type: 'income',
      description: 'Quarterly Retainer - TechCorp',
      amount: 45000,
      currency: 'EGP',
      accountName: 'CIB - EGP Main Account',
      categoryPath: 'Income/Services/Consulting',
      contactName: 'Tech Corp Ltd',
      frequency: 'quarterly',
      startDate: new Date('2024-01-01'),
      nextRun: new Date('2024-04-01'),
      isActive: false,
      autoPost: false,
      lastRun: new Date('2024-01-01'),
      executionCount: 1,
      createdAt: new Date('2023-12-01')
    }
  ])

  const [statusFilter, setStatusFilter] = useState<string>('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [searchText, setSearchText] = useState('')

  // Filter recurring transactions
  const filteredTxns = recurringTxns.filter(txn => {
    if (statusFilter === 'active' && !txn.isActive) return false
    if (statusFilter === 'inactive' && txn.isActive) return false
    if (typeFilter && txn.type !== typeFilter) return false
    if (searchText) {
      const search = searchText.toLowerCase()
      return (
        txn.description.toLowerCase().includes(search) ||
        txn.accountName.toLowerCase().includes(search) ||
        txn.contactName?.toLowerCase().includes(search)
      )
    }
    return true
  })

  // Statistics
  const activeTxns = recurringTxns.filter(t => t.isActive)
  const monthlyIncome = recurringTxns
    .filter(t => t.isActive && t.type === 'income' && t.frequency === 'monthly')
    .reduce((sum, t) => sum + t.amount, 0)
  const monthlyExpenses = recurringTxns
    .filter(t => t.isActive && t.type === 'expense' && t.frequency === 'monthly')
    .reduce((sum, t) => sum + t.amount, 0)
  const autoPostedCount = recurringTxns.filter(t => t.autoPost && t.isActive).length

  const getFrequencyBadge = (frequency: string) => {
    const colors: Record<string, string> = {
      daily: 'bg-blue-400/10 text-blue-400',
      weekly: 'bg-green-400/10 text-green-400',
      monthly: 'bg-purple-400/10 text-purple-400',
      quarterly: 'bg-yellow-400/10 text-yellow-400',
      annual: 'bg-red-400/10 text-red-400'
    }
    return colors[frequency] || 'bg-gray-400/10 text-gray-400'
  }

  const handleToggleStatus = (id: string) => {
    setRecurringTxns(recurringTxns.map(txn =>
      txn.id === id ? { ...txn, isActive: !txn.isActive } : txn
    ))
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
            Recurring Transactions
          </h1>
          <p className="text-gray-400">
            Manage subscriptions, recurring payments, and automated transactions
          </p>
        </div>
        <Link
          href="/dashboard/finance/recurring/new"
          className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Recurring</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Active Recurring</span>
            <Repeat className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{activeTxns.length}</p>
          <p className="text-gray-400 text-xs mt-1">of {recurringTxns.length} total</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Monthly Income</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-400">
            {formatWithCurrency(monthlyIncome, currency)}
          </p>
          <p className="text-gray-400 text-xs mt-1">Recurring monthly</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Monthly Expenses</span>
            <TrendingDown className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400">
            {formatWithCurrency(monthlyExpenses, currency)}
          </p>
          <p className="text-gray-400 text-xs mt-1">Recurring monthly</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Auto-Posted</span>
            <Play className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{autoPostedCount}</p>
          <p className="text-gray-400 text-xs mt-1">Automatic posting enabled</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            label="Status"
            options={[
              { value: '', label: 'All Status' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' }
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
          />

          <Select
            label="Type"
            options={[
              { value: '', label: 'All Types' },
              { value: 'income', label: 'Income' },
              { value: 'expense', label: 'Expense' }
            ]}
            value={typeFilter}
            onChange={setTypeFilter}
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search description, account..."
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {(statusFilter || typeFilter || searchText) && (
          <div className="mt-4">
            <button
              onClick={() => {
                setStatusFilter('')
                setTypeFilter('')
                setSearchText('')
              }}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Clear filters
            </button>
            <span className="text-gray-400 text-sm ml-4">
              Showing {filteredTxns.length} of {recurringTxns.length} recurring transactions
            </span>
          </div>
        )}
      </div>

      {/* Recurring Transactions Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Next Run
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
              {filteredTxns.map((txn) => (
                <tr key={txn.id} className={`hover:bg-gray-700/30 transition-colors ${!txn.isActive ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-white font-medium">{txn.description}</div>
                      <div className="text-gray-400 text-xs mt-1">
                        {txn.accountName}
                        {txn.contactName && <span> • {txn.contactName}</span>}
                      </div>
                      {txn.categoryPath && (
                        <div className="text-gray-500 text-xs mt-1 font-mono">{txn.categoryPath}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      txn.type === 'income'
                        ? 'bg-green-400/10 text-green-400'
                        : 'bg-red-400/10 text-red-400'
                    }`}>
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`font-semibold ${
                      txn.type === 'income' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {txn.type === 'income' ? '+' : '-'}
                      {formatWithCurrency(txn.amount, currency)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getFrequencyBadge(txn.frequency)}`}>
                      {txn.frequency}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{formatDate(txn.nextRun, 'short')}</span>
                    </div>
                    {txn.executionCount > 0 && (
                      <div className="text-gray-500 text-xs mt-1">
                        {txn.executionCount} execution{txn.executionCount !== 1 ? 's' : ''}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        txn.isActive
                          ? 'bg-green-400/10 text-green-400'
                          : 'bg-gray-400/10 text-gray-400'
                      }`}>
                        {txn.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {txn.autoPost && txn.isActive && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-400/10 text-blue-400">
                          Auto-post
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/finance/recurring/${txn.id}/edit`}
                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(txn.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          txn.isActive
                            ? 'text-yellow-400 hover:bg-yellow-400/10'
                            : 'text-green-400 hover:bg-green-400/10'
                        }`}
                        title={txn.isActive ? 'Pause' : 'Activate'}
                      >
                        {txn.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                    </div>
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
          <Repeat className="w-5 h-5 text-blue-400" />
          About Recurring Transactions
        </h3>
        <div className="text-gray-300 space-y-2 text-sm">
          <p>
            <strong className="text-white">Automation:</strong> Set up recurring transactions for subscriptions, rent, salaries, and other regular payments. They'll be created automatically on schedule.
          </p>
          <p>
            <strong className="text-white">Auto-Post:</strong> Enable automatic posting to have transactions immediately affect account balances. Disable for manual review before posting.
          </p>
          <p>
            <strong className="text-white">Frequency:</strong> Choose from daily, weekly, monthly, quarterly, or annual schedules.
          </p>
        </div>
      </div>
    </div>
  )
}
