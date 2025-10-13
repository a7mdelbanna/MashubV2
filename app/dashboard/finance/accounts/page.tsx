'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Eye, Power, PowerOff, Wallet, Building2, Banknote, CreditCard, TrendingUp, DollarSign } from 'lucide-react'
import { Account, AccountType } from '@/types/finance'
import { formatWithCurrency, formatDate } from '@/lib/finance-utils'

// Mock currency data
const currencies = {
  'EGP': { code: 'EGP', symbol: 'E£', symbolPosition: 'before' as const, decimalPlaces: 2 },
  'USD': { code: 'USD', symbol: '$', symbolPosition: 'before' as const, decimalPlaces: 2 },
  'EUR': { code: 'EUR', symbol: '€', symbolPosition: 'before' as const, decimalPlaces: 2 },
  'SAR': { code: 'SAR', symbol: 'SR', symbolPosition: 'before' as const, decimalPlaces: 2 }
}

export default function AccountsPage() {
  // Mock data - will be replaced with actual API calls
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      tenantId: 'tenant1',
      name: 'CIB - EGP Main Account',
      description: 'Primary bank account for EGP transactions',
      type: 'bank',
      currency: 'EGP',
      balance: 285600.50,
      initialBalance: 100000,
      bankDetails: {
        bankName: 'Commercial International Bank',
        accountNumber: '****1234',
        iban: 'EG380021000000012345678901234',
        accountHolder: 'MasHub Ltd'
      },
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-10'),
      lastReconciledAt: new Date('2024-03-01'),
      lastReconciledBalance: 280000
    },
    {
      id: '2',
      tenantId: 'tenant1',
      name: 'Stripe USD',
      description: 'Stripe payment processor - USD balance',
      type: 'psp-stripe',
      currency: 'USD',
      balance: 12450.75,
      initialBalance: 0,
      pspDetails: {
        provider: 'stripe',
        accountId: 'acct_1234567890',
        isLive: true
      },
      isActive: true,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-03-10')
    },
    {
      id: '3',
      tenantId: 'tenant1',
      name: 'Cash - Cairo Office',
      description: 'Petty cash for office expenses',
      type: 'cash',
      currency: 'EGP',
      balance: 8500,
      initialBalance: 10000,
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-08')
    },
    {
      id: '4',
      tenantId: 'tenant1',
      name: 'Wise - USD Account',
      description: 'Wise multi-currency account - USD',
      type: 'wallet',
      currency: 'USD',
      balance: 5230.40,
      initialBalance: 5000,
      isActive: true,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-03-09')
    },
    {
      id: '5',
      tenantId: 'tenant1',
      name: 'Paymob EGP',
      description: 'Paymob payment gateway',
      type: 'psp-paymob',
      currency: 'EGP',
      balance: 45800,
      initialBalance: 0,
      pspDetails: {
        provider: 'paymob',
        accountId: 'paymob_merchant_123',
        isLive: true
      },
      isActive: true,
      createdAt: new Date('2024-01-25'),
      updatedAt: new Date('2024-03-10')
    },
    {
      id: '6',
      tenantId: 'tenant1',
      name: 'Corporate Credit Card',
      description: 'Company Visa card',
      type: 'credit-card',
      currency: 'EGP',
      balance: -15000,
      initialBalance: 0,
      isActive: false,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-20')
    }
  ])

  const handleToggleStatus = (id: string) => {
    setAccounts(accounts.map(acc =>
      acc.id === id ? { ...acc, isActive: !acc.isActive, updatedAt: new Date() } : acc
    ))
  }

  const getAccountTypeIcon = (type: AccountType) => {
    switch (type) {
      case 'bank':
        return <Building2 className="w-5 h-5" />
      case 'cash':
        return <Banknote className="w-5 h-5" />
      case 'psp-stripe':
      case 'psp-paymob':
        return <CreditCard className="w-5 h-5" />
      case 'wallet':
        return <Wallet className="w-5 h-5" />
      case 'credit-card':
        return <CreditCard className="w-5 h-5" />
      default:
        return <DollarSign className="w-5 h-5" />
    }
  }

  const getAccountTypeLabel = (type: AccountType): string => {
    const labels: Record<AccountType, string> = {
      'bank': 'Bank Account',
      'cash': 'Cash',
      'psp-stripe': 'Stripe',
      'psp-paymob': 'Paymob',
      'wallet': 'Wallet',
      'investment': 'Investment',
      'loan': 'Loan',
      'credit-card': 'Credit Card'
    }
    return labels[type] || type
  }

  // Group accounts by type
  const accountsByType: Record<AccountType, Account[]> = accounts.reduce((acc, account) => {
    if (!acc[account.type]) {
      acc[account.type] = []
    }
    acc[account.type].push(account)
    return acc
  }, {} as Record<AccountType, Account[]>)

  // Calculate totals
  const totalBalance = accounts
    .filter(acc => acc.isActive)
    .reduce((sum, acc) => sum + acc.balance, 0)

  const activeAccounts = accounts.filter(acc => acc.isActive).length
  const accountsByCurrency = accounts.reduce((acc, account) => {
    acc[account.currency] = (acc[account.currency] || 0) + account.balance
    return acc
  }, {} as Record<string, number>)

  const needsReconciliation = accounts.filter(acc => {
    if (!acc.lastReconciledAt) return true
    const daysSince = Math.floor(
      (new Date().getTime() - acc.lastReconciledAt.getTime()) / (1000 * 60 * 60 * 24)
    )
    return daysSince > 30
  }).length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
            Accounts
          </h1>
          <p className="text-gray-400">
            Manage your financial accounts across multiple currencies
          </p>
        </div>
        <Link
          href="/dashboard/finance/accounts/new"
          className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Account</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Accounts</span>
            <Wallet className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{accounts.length}</p>
          <p className="text-gray-400 text-xs mt-1">{activeAccounts} active</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Balance</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {formatWithCurrency(totalBalance, currencies['EGP'])}
          </p>
          <p className="text-gray-400 text-xs mt-1">In default currency</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Currencies</span>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {Object.keys(accountsByCurrency).length}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            {Object.keys(accountsByCurrency).join(', ')}
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Needs Reconciliation</span>
            <Building2 className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{needsReconciliation}</p>
          <p className="text-gray-400 text-xs mt-1">Over 30 days old</p>
        </div>
      </div>

      {/* Accounts by Type */}
      {Object.entries(accountsByType).map(([type, typeAccounts]) => (
        <div key={type} className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 mb-6">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              {getAccountTypeIcon(type as AccountType)}
              {getAccountTypeLabel(type as AccountType)}
              <span className="text-gray-400 text-sm ml-2">({typeAccounts.length})</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Account Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Currency
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Reconciled
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {typeAccounts.map((account) => {
                  const currency = currencies[account.currency as keyof typeof currencies]
                  const daysSinceReconciliation = account.lastReconciledAt
                    ? Math.floor((new Date().getTime() - account.lastReconciledAt.getTime()) / (1000 * 60 * 60 * 24))
                    : null

                  return (
                    <tr key={account.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{account.name}</div>
                          {account.description && (
                            <div className="text-gray-400 text-sm mt-1">{account.description}</div>
                          )}
                          {account.bankDetails && (
                            <div className="text-gray-500 text-xs mt-1 font-mono">
                              {account.bankDetails.accountNumber}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-gray-300 font-mono font-semibold">
                          {account.currency}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className={`font-semibold text-lg ${
                          account.balance >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {currency && formatWithCurrency(account.balance, currency)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {account.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-400/10 text-red-400">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {account.lastReconciledAt ? (
                          <div>
                            <div className="text-gray-300 text-sm">
                              {formatDate(account.lastReconciledAt, 'short')}
                            </div>
                            {daysSinceReconciliation !== null && daysSinceReconciliation > 30 && (
                              <div className="text-yellow-400 text-xs mt-1">
                                {daysSinceReconciliation} days ago
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-yellow-400 text-sm">Never</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/dashboard/finance/accounts/${account.id}`}
                            className="p-2 text-purple-400 hover:bg-purple-400/10 rounded-lg transition-colors"
                            title="View Account"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/dashboard/finance/accounts/${account.id}/edit`}
                            className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                            title="Edit Account"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleToggleStatus(account.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              account.isActive
                                ? 'text-red-400 hover:bg-red-400/10'
                                : 'text-green-400 hover:bg-green-400/10'
                            }`}
                            title={account.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {account.isActive ? (
                              <PowerOff className="w-4 h-4" />
                            ) : (
                              <Power className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Help Text */}
      <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-blue-400" />
          About Accounts
        </h3>
        <div className="text-gray-300 space-y-2 text-sm">
          <p>
            <strong className="text-white">Single Currency:</strong> Each account holds transactions in one currency only.
            Create separate accounts for different currencies (e.g., "CIB - EGP" and "Wise - USD").
          </p>
          <p>
            <strong className="text-white">Account Types:</strong> Bank accounts, cash, PSPs (Stripe/Paymob), wallets, credit cards, etc.
            Each type has specific features and reconciliation requirements.
          </p>
          <p>
            <strong className="text-white">Reconciliation:</strong> Regularly reconcile your accounts to ensure your records match
            bank/PSP statements. Accounts highlighted in yellow need reconciliation.
          </p>
          <p>
            <strong className="text-white">Balance:</strong> Account balance updates automatically when transactions are posted.
            The balance shown is in the account's native currency.
          </p>
        </div>
      </div>
    </div>
  )
}
