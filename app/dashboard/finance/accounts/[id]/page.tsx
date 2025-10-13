'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Edit2, TrendingUp, TrendingDown, Calendar, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { Account, FinanceTransaction } from '@/types/finance'
import { formatWithCurrency, formatDate } from '@/lib/finance-utils'

// Mock currency
const currencies = {
  'EGP': { code: 'EGP', symbol: 'E£', symbolPosition: 'before' as const, decimalPlaces: 2 }
}

export default function AccountDetailPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [account, setAccount] = useState<Account | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<FinanceTransaction[]>([])

  useEffect(() => {
    const fetchAccountData = async () => {
      setIsLoading(true)
      try {
        // TODO: Replace with actual API calls
        await new Promise(resolve => setTimeout(resolve, 500))

        // Mock account data
        const mockAccount: Account = {
          id: params.id,
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
            accountHolder: 'MasHub Ltd',
            branch: 'New Cairo Branch'
          },
          isActive: true,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-03-10'),
          lastReconciledAt: new Date('2024-03-01'),
          lastReconciledBalance: 280000
        }

        // Mock recent transactions
        const mockTransactions: FinanceTransaction[] = [
          {
            id: '1',
            tenantId: 'tenant1',
            type: 'income',
            amount: 15000,
            currency: 'EGP',
            accountId: params.id,
            accountName: 'CIB - EGP Main Account',
            description: 'Client payment - Project XYZ',
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
            accountId: params.id,
            accountName: 'CIB - EGP Main Account',
            description: 'Office rent - March 2024',
            categoryPath: 'Expense/Office/Rent',
            state: 'posted',
            postedAt: new Date('2024-03-08'),
            requiresApproval: false,
            attachments: [],
            createdBy: 'user1',
            createdAt: new Date('2024-03-08')
          }
        ]

        setAccount(mockAccount)
        setRecentTransactions(mockTransactions)
      } catch (error) {
        console.error('Error fetching account:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAccountData()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading account...</p>
        </div>
      </div>
    )
  }

  if (!account) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-2xl mx-auto">
          <p className="text-red-400">Account not found</p>
          <Link
            href="/dashboard/finance/accounts"
            className="text-purple-400 hover:text-purple-300 mt-4 inline-block"
          >
            Back to Accounts
          </Link>
        </div>
      </div>
    )
  }

  const currency = currencies[account.currency as keyof typeof currencies]
  const balanceChange = account.balance - account.initialBalance
  const balanceChangePercent = account.initialBalance !== 0
    ? ((balanceChange / account.initialBalance) * 100).toFixed(1)
    : '0'

  const daysSinceReconciliation = account.lastReconciledAt
    ? Math.floor((new Date().getTime() - account.lastReconciledAt.getTime()) / (1000 * 60 * 60 * 24))
    : null

  const needsReconciliation = daysSinceReconciliation === null || daysSinceReconciliation > 30

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/finance/accounts"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Accounts
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
              {account.name}
            </h1>
            {account.description && (
              <p className="text-gray-400">{account.description}</p>
            )}
          </div>
          <Link
            href={`/dashboard/finance/accounts/${account.id}/edit`}
            className="px-4 py-2 bg-gradient-purple text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Edit Account
          </Link>
        </div>
      </div>

      {/* Status Banner */}
      {!account.isActive && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">
            This account is currently <strong>inactive</strong> and cannot be used for new transactions.
          </p>
        </div>
      )}

      {needsReconciliation && (
        <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <p className="text-yellow-400">
              This account needs reconciliation. Last reconciled {daysSinceReconciliation ? `${daysSinceReconciliation} days ago` : 'never'}.
            </p>
            <Link
              href={`/dashboard/finance/reconciliation/new?accountId=${account.id}`}
              className="ml-auto px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm"
            >
              Reconcile Now
            </Link>
          </div>
        </div>
      )}

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Current Balance */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Current Balance</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {currency && formatWithCurrency(account.balance, currency)}
          </p>
          <div className="flex items-center gap-2 text-sm">
            {balanceChange >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className={balanceChange >= 0 ? 'text-green-400' : 'text-red-400'}>
              {balanceChange >= 0 ? '+' : ''}{currency && formatWithCurrency(balanceChange, currency)} ({balanceChangePercent}%)
            </span>
          </div>
        </div>

        {/* Initial Balance */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Initial Balance</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {currency && formatWithCurrency(account.initialBalance, currency)}
          </p>
          <p className="text-gray-400 text-sm">
            {formatDate(account.createdAt, 'short')}
          </p>
        </div>

        {/* Last Reconciled */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Last Reconciled</span>
            <CheckCircle className="w-4 h-4 text-green-400" />
          </div>
          {account.lastReconciledAt ? (
            <>
              <p className="text-2xl font-bold text-white mb-1">
                {formatDate(account.lastReconciledAt, 'short')}
              </p>
              <p className="text-gray-400 text-sm">
                Balance: {currency && formatWithCurrency(account.lastReconciledBalance || 0, currency)}
              </p>
            </>
          ) : (
            <p className="text-2xl font-bold text-yellow-400">Never</p>
          )}
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-6">Account Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-400 text-sm mb-1">Account Type</p>
            <p className="text-white font-medium capitalize">{account.type.replace('-', ' ')}</p>
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-1">Currency</p>
            <p className="text-white font-medium font-mono">{account.currency}</p>
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-1">Status</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              account.isActive
                ? 'bg-green-400/10 text-green-400'
                : 'bg-red-400/10 text-red-400'
            }`}>
              {account.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-1">Created</p>
            <p className="text-white font-medium">{formatDate(account.createdAt, 'short')}</p>
          </div>
        </div>

        {/* Bank Details */}
        {account.bankDetails && (
          <>
            <div className="border-t border-gray-700 my-6"></div>
            <h3 className="text-lg font-semibold text-white mb-4">Bank Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Bank Name</p>
                <p className="text-white font-medium">{account.bankDetails.bankName}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">Account Number</p>
                <p className="text-white font-medium font-mono">{account.bankDetails.accountNumber}</p>
              </div>

              {account.bankDetails.accountHolder && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Account Holder</p>
                  <p className="text-white font-medium">{account.bankDetails.accountHolder}</p>
                </div>
              )}

              {account.bankDetails.iban && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">IBAN</p>
                  <p className="text-white font-medium font-mono text-sm">{account.bankDetails.iban}</p>
                </div>
              )}

              {account.bankDetails.swiftCode && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">SWIFT/BIC</p>
                  <p className="text-white font-medium font-mono">{account.bankDetails.swiftCode}</p>
                </div>
              )}

              {account.bankDetails.branch && (
                <div>
                  <p className="text-gray-400 text-sm mb-1">Branch</p>
                  <p className="text-white font-medium">{account.bankDetails.branch}</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* PSP Details */}
        {account.pspDetails && (
          <>
            <div className="border-t border-gray-700 my-6"></div>
            <h3 className="text-lg font-semibold text-white mb-4">Payment Service Provider</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Provider</p>
                <p className="text-white font-medium capitalize">{account.pspDetails.provider}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">Account ID</p>
                <p className="text-white font-medium font-mono">{account.pspDetails.accountId}</p>
              </div>

              <div>
                <p className="text-gray-400 text-sm mb-1">Mode</p>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  account.pspDetails.isLive
                    ? 'bg-green-400/10 text-green-400'
                    : 'bg-yellow-400/10 text-yellow-400'
                }`}>
                  {account.pspDetails.isLive ? 'Live' : 'Test'}
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Transactions
          </h2>
          <Link
            href={`/dashboard/finance/transactions?accountId=${account.id}`}
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            View All →
          </Link>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
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
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {recentTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">
                      {txn.postedAt && formatDate(txn.postedAt, 'short')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{txn.description}</div>
                      {txn.categoryPath && (
                        <div className="text-gray-400 text-xs mt-1">{txn.categoryPath}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        txn.type === 'income'
                          ? 'bg-green-400/10 text-green-400'
                          : txn.type === 'expense'
                          ? 'bg-red-400/10 text-red-400'
                          : 'bg-blue-400/10 text-blue-400'
                      }`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`font-semibold ${
                        txn.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {txn.type === 'income' ? '+' : '-'}
                        {currency && formatWithCurrency(txn.amount, currency)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                        {txn.state}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            No transactions found for this account
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href={`/dashboard/finance/transactions/new?accountId=${account.id}`}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors"
        >
          <h3 className="text-white font-semibold mb-2">New Transaction</h3>
          <p className="text-gray-400 text-sm">Record a new income or expense for this account</p>
        </Link>

        <Link
          href={`/dashboard/finance/reconciliation/new?accountId=${account.id}`}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors"
        >
          <h3 className="text-white font-semibold mb-2">Reconcile Account</h3>
          <p className="text-gray-400 text-sm">Match transactions with bank statement</p>
        </Link>

        <Link
          href={`/dashboard/finance/reports?accountId=${account.id}`}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors"
        >
          <h3 className="text-white font-semibold mb-2">Account Statement</h3>
          <p className="text-gray-400 text-sm">Generate detailed account statement report</p>
        </Link>
      </div>
    </div>
  )
}
