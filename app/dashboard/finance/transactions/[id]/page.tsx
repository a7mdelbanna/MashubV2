'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Edit2, FileText, Calendar, DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, XCircle, Building, User, CreditCard, Hash, MessageSquare, Paperclip } from 'lucide-react'
import { FinanceTransaction } from '@/types/finance'
import { formatWithCurrency, formatDate } from '@/lib/finance-utils'

// Mock currency
const currencies = {
  'EGP': { code: 'EGP', symbol: 'E£', symbolPosition: 'before' as const, decimalPlaces: 2 },
  'USD': { code: 'USD', symbol: '$', symbolPosition: 'before' as const, decimalPlaces: 2 }
}

export default function TransactionDetailPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [transaction, setTransaction] = useState<FinanceTransaction | null>(null)

  useEffect(() => {
    const fetchTransaction = async () => {
      setIsLoading(true)
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500))

        // Mock transaction data
        const mockTransaction: FinanceTransaction = {
          id: params.id,
          tenantId: 'tenant1',
          type: 'expense',
          amount: 8500,
          currency: 'EGP',
          accountId: 'acc1',
          accountName: 'CIB - EGP Main Account',
          categoryId: 'cat1',
          categoryPath: 'Expense/Office/Rent',
          contactId: 'contact1',
          contactName: 'Cairo Properties',
          paymentMethodId: 'pm1',
          paymentMethodName: 'Bank Transfer - CIB',
          description: 'Office rent - March 2024',
          notes: 'Monthly rent payment for Cairo office space. Includes utilities.',
          reference: 'INV-2024-003',
          state: 'posted',
          postedAt: new Date('2024-03-08'),
          requiresApproval: false,
          taxRate: 14,
          taxAmount: 1036.96,
          attachments: [],
          fxSnapshot: {
            fromCurrency: 'EGP',
            toCurrency: 'EGP',
            rate: 1,
            snapshotAt: new Date('2024-03-08')
          },
          createdBy: 'user1',
          createdAt: new Date('2024-03-07'),
          updatedAt: new Date('2024-03-08')
        }

        setTransaction(mockTransaction)
      } catch (error) {
        console.error('Error fetching transaction:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransaction()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading transaction...</p>
        </div>
      </div>
    )
  }

  if (!transaction) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-2xl mx-auto">
          <p className="text-red-400">Transaction not found</p>
          <Link
            href="/dashboard/finance/transactions"
            className="text-purple-400 hover:text-purple-300 mt-4 inline-block"
          >
            Back to Transactions
          </Link>
        </div>
      </div>
    )
  }

  const currency = currencies[transaction.currency as keyof typeof currencies]
  const isEditable = transaction.state === 'draft' || transaction.state === 'pending-approval'
  const isPosted = transaction.state === 'posted'

  const getStateIcon = () => {
    switch (transaction.state) {
      case 'draft':
        return <FileText className="w-5 h-5 text-gray-400" />
      case 'pending-approval':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'posted':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'void':
        return <XCircle className="w-5 h-5 text-red-400" />
      case 'rejected':
        return <AlertCircle className="w-5 h-5 text-red-400" />
      default:
        return <FileText className="w-5 h-5 text-gray-400" />
    }
  }

  const getStateColor = () => {
    switch (transaction.state) {
      case 'draft':
        return 'bg-gray-400/10 text-gray-400 border-gray-500'
      case 'pending-approval':
        return 'bg-yellow-400/10 text-yellow-400 border-yellow-500'
      case 'posted':
        return 'bg-green-400/10 text-green-400 border-green-500'
      case 'void':
        return 'bg-red-400/10 text-red-400 border-red-500'
      case 'rejected':
        return 'bg-red-400/10 text-red-400 border-red-500'
      default:
        return 'bg-gray-400/10 text-gray-400 border-gray-500'
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/finance/transactions"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Transactions
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
              Transaction Details
            </h1>
            <p className="text-gray-400">{transaction.description}</p>
          </div>
          {isEditable && (
            <Link
              href={`/dashboard/finance/transactions/${transaction.id}/edit`}
              className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit Transaction</span>
            </Link>
          )}
        </div>
      </div>

      {/* Status Banner */}
      {transaction.state === 'void' && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">
            This transaction has been <strong>voided</strong> and does not affect account balances or reports.
          </p>
        </div>
      )}

      {transaction.state === 'pending-approval' && (
        <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-yellow-400" />
            <p className="text-yellow-400">
              This transaction is <strong>awaiting approval</strong> before it can be posted.
            </p>
          </div>
        </div>
      )}

      {/* Amount & Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Amount */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Amount</span>
            {transaction.type === 'income' ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : transaction.type === 'expense' ? (
              <TrendingDown className="w-4 h-4 text-red-400" />
            ) : (
              <DollarSign className="w-4 h-4 text-blue-400" />
            )}
          </div>
          <p className={`text-3xl font-bold mb-1 ${
            transaction.type === 'income' ? 'text-green-400' :
            transaction.type === 'expense' ? 'text-red-400' :
            'text-blue-400'
          }`}>
            {transaction.type === 'income' ? '+' : transaction.type === 'expense' ? '-' : ''}
            {formatWithCurrency(transaction.amount, currency)}
          </p>
          <p className="text-gray-400 text-sm capitalize">{transaction.type}</p>
        </div>

        {/* Status */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Status</span>
            {getStateIcon()}
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStateColor()}`}>
              {transaction.state.replace('-', ' ')}
            </span>
          </div>
          {transaction.postedAt && (
            <p className="text-gray-400 text-sm">
              Posted {formatDate(transaction.postedAt, 'short')}
            </p>
          )}
        </div>

        {/* Tax Information */}
        {transaction.taxRate && transaction.taxAmount ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Tax</span>
              <Calendar className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {formatWithCurrency(transaction.taxAmount, currency)}
            </p>
            <p className="text-gray-400 text-sm">{transaction.taxRate}% tax rate</p>
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Created</span>
              <Calendar className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {formatDate(transaction.createdAt, 'short')}
            </p>
            <p className="text-gray-400 text-sm">by {transaction.createdBy}</p>
          </div>
        )}
      </div>

      {/* Transaction Details */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-6">Transaction Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-gray-400" />
              <p className="text-gray-400 text-sm">Account</p>
            </div>
            <p className="text-white font-medium">{transaction.accountName}</p>
          </div>

          {/* Currency */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <p className="text-gray-400 text-sm">Currency</p>
            </div>
            <p className="text-white font-medium font-mono">{transaction.currency}</p>
          </div>

          {/* Category */}
          {transaction.categoryPath && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <p className="text-gray-400 text-sm">Category</p>
              </div>
              <p className="text-white font-medium font-mono text-sm">{transaction.categoryPath}</p>
            </div>
          )}

          {/* Contact */}
          {transaction.contactName && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <User className="w-4 h-4 text-gray-400" />
                <p className="text-gray-400 text-sm">Contact</p>
              </div>
              <p className="text-white font-medium">{transaction.contactName}</p>
            </div>
          )}

          {/* Payment Method */}
          {transaction.paymentMethodName && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-gray-400" />
                <p className="text-gray-400 text-sm">Payment Method</p>
              </div>
              <p className="text-white font-medium">{transaction.paymentMethodName}</p>
            </div>
          )}

          {/* Reference */}
          {transaction.reference && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-gray-400" />
                <p className="text-gray-400 text-sm">Reference</p>
              </div>
              <p className="text-white font-medium font-mono">{transaction.reference}</p>
            </div>
          )}
        </div>

        {/* Notes */}
        {transaction.notes && (
          <>
            <div className="border-t border-gray-700 my-6"></div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <p className="text-gray-400 text-sm">Notes</p>
              </div>
              <p className="text-white whitespace-pre-wrap">{transaction.notes}</p>
            </div>
          </>
        )}
      </div>

      {/* FX Snapshot */}
      {transaction.fxSnapshot && transaction.fxSnapshot.fromCurrency !== transaction.fxSnapshot.toCurrency && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Exchange Rate Snapshot</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">From Currency</p>
              <p className="text-white font-medium font-mono">{transaction.fxSnapshot.fromCurrency}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">To Currency</p>
              <p className="text-white font-medium font-mono">{transaction.fxSnapshot.toCurrency}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Exchange Rate</p>
              <p className="text-white font-medium">{transaction.fxSnapshot.rate.toFixed(6)}</p>
            </div>

            <div>
              <p className="text-gray-400 text-sm mb-1">Snapshot Date</p>
              <p className="text-white font-medium">{formatDate(transaction.fxSnapshot.snapshotAt, 'short')}</p>
            </div>
          </div>

          <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-blue-400 text-sm">
              This exchange rate was captured when the transaction was posted and is used for historical accuracy in reports.
            </p>
          </div>
        </div>
      )}

      {/* Transfer Details */}
      {transaction.type === 'transfer' && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Transfer Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {transaction.sourceAccountName && (
              <div>
                <p className="text-gray-400 text-sm mb-1">From Account</p>
                <p className="text-white font-medium">{transaction.sourceAccountName}</p>
              </div>
            )}

            {transaction.destinationAccountName && (
              <div>
                <p className="text-gray-400 text-sm mb-1">To Account</p>
                <p className="text-white font-medium">{transaction.destinationAccountName}</p>
              </div>
            )}

            {transaction.feeAmount && transaction.feeAmount > 0 && (
              <div>
                <p className="text-gray-400 text-sm mb-1">Transfer Fee</p>
                <p className="text-white font-medium">{formatWithCurrency(transaction.feeAmount, currency)}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Attachments */}
      {transaction.attachments && transaction.attachments.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Paperclip className="w-5 h-5" />
            Attachments ({transaction.attachments.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {transaction.attachments.map((attachment, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors"
              >
                <FileText className="w-5 h-5 text-purple-400" />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{attachment.filename}</p>
                  <p className="text-gray-400 text-xs">{attachment.size}</p>
                </div>
                <a
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 text-sm"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-6">System Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-400 text-sm mb-1">Created By</p>
            <p className="text-white font-medium">{transaction.createdBy}</p>
            <p className="text-gray-400 text-xs mt-1">{formatDate(transaction.createdAt, 'full')}</p>
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-1">Last Updated</p>
            <p className="text-white font-medium">{formatDate(transaction.updatedAt, 'short')}</p>
          </div>

          <div>
            <p className="text-gray-400 text-sm mb-1">Transaction ID</p>
            <p className="text-white font-medium font-mono text-sm">{transaction.id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
