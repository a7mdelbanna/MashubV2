'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, CheckCircle, AlertCircle, Calendar } from 'lucide-react'
import Select from '@/components/ui/select'
import { formatWithCurrency } from '@/lib/finance-utils'
import { isValidAmount } from '@/lib/finance-utils'

const currency = { code: 'EGP', symbol: 'E£', symbolPosition: 'before' as const, decimalPlaces: 2 }

export default function NewReconciliationPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    accountId: '',
    statementDate: '',
    statementBalance: '',
    openingBalance: '',
    closingBalance: '',
    notes: ''
  })

  // Mock accounts
  const accounts = [
    { id: '1', name: 'CIB - EGP Main Account', currency: 'EGP', balance: 285600.50 },
    { id: '2', name: 'Stripe USD', currency: 'USD', balance: 12450.75 },
    { id: '3', name: 'Cash - Cairo Office', currency: 'EGP', balance: 8500 },
    { id: '4', name: 'Paymob EGP', currency: 'EGP', balance: 45800 }
  ]

  // Mock unreconciled transactions
  const unreconciledTransactions = [
    { id: '1', date: '2024-03-28', description: 'Client Payment - Invoice #123', amount: 15000, type: 'income' },
    { id: '2', date: '2024-03-29', description: 'Office Supplies', amount: -850, type: 'expense' },
    { id: '3', date: '2024-03-30', description: 'Consulting Fee', amount: 12000, type: 'income' },
    { id: '4', date: '2024-03-31', description: 'Software License', amount: -299, type: 'expense' }
  ]

  const selectedAccount = accounts.find(acc => acc.id === formData.accountId)
  const calculatedDifference = formData.statementBalance && selectedAccount
    ? parseFloat(formData.statementBalance) - selectedAccount.balance
    : 0

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.accountId) {
      newErrors.accountId = 'Account is required'
    }

    if (!formData.statementDate) {
      newErrors.statementDate = 'Statement date is required'
    }

    if (!formData.statementBalance) {
      newErrors.statementBalance = 'Statement balance is required'
    } else if (!isValidAmount(parseFloat(formData.statementBalance))) {
      newErrors.statementBalance = 'Invalid balance amount'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Reconciliation created:', formData)

      // Redirect to reconciliation detail to continue matching
      router.push('/dashboard/finance/reconciliation/1')
    } catch (error) {
      console.error('Error creating reconciliation:', error)
      setErrors({ submit: 'Failed to create reconciliation. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
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
        <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
          New Bank Reconciliation
        </h1>
        <p className="text-gray-400">
          Start reconciling your account with bank statement
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl">
        {errors.submit && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400">{errors.submit}</p>
          </div>
        )}

        {/* Info Banner */}
        <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-300">
              <p className="mb-2">
                <strong className="text-white">Reconciliation Process:</strong>
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Select the account to reconcile</li>
                <li>Enter the statement date and ending balance from your bank statement</li>
                <li>Match transactions between your records and the statement</li>
                <li>Investigate and resolve any differences</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Account Selection */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Account Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Select
                label="Account to Reconcile"
                options={[
                  { value: '', label: 'Select account...' },
                  ...accounts.map(acc => ({
                    value: acc.id,
                    label: `${acc.name} - ${formatWithCurrency(acc.balance, currency)}`
                  }))
                ]}
                value={formData.accountId}
                onChange={(value) => handleChange('accountId', value)}
                placeholder="Select account..."
                required
                error={errors.accountId}
              />
            </div>

            {selectedAccount && (
              <div className="md:col-span-2 bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Current Book Balance</p>
                    <p className="text-white font-semibold text-lg">
                      {formatWithCurrency(selectedAccount.balance, currency)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Unreconciled Transactions</p>
                    <p className="text-white font-semibold text-lg">{unreconciledTransactions.length}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statement Information */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Bank Statement Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="statementDate" className="block text-sm font-medium text-gray-300 mb-2">
                Statement Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                id="statementDate"
                value={formData.statementDate}
                onChange={(e) => handleChange('statementDate', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errors.statementDate ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                required
              />
              {errors.statementDate && <p className="text-red-400 text-sm mt-1">{errors.statementDate}</p>}
              <p className="text-gray-400 text-xs mt-1">The ending date on your bank statement</p>
            </div>

            <div>
              <label htmlFor="statementBalance" className="block text-sm font-medium text-gray-300 mb-2">
                Statement Ending Balance <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="statementBalance"
                value={formData.statementBalance}
                onChange={(e) => handleChange('statementBalance', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errors.statementBalance ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="0.00"
                required
              />
              {errors.statementBalance && <p className="text-red-400 text-sm mt-1">{errors.statementBalance}</p>}
              <p className="text-gray-400 text-xs mt-1">The ending balance shown on your statement</p>
            </div>

            <div>
              <label htmlFor="openingBalance" className="block text-sm font-medium text-gray-300 mb-2">
                Statement Opening Balance (Optional)
              </label>
              <input
                type="text"
                id="openingBalance"
                value={formData.openingBalance}
                onChange={(e) => handleChange('openingBalance', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0.00"
              />
            </div>

            {/* Difference Indicator */}
            {formData.statementBalance && selectedAccount && (
              <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                <p className="text-gray-400 text-sm mb-1">Difference to Investigate</p>
                <p className={`font-bold text-2xl ${
                  Math.abs(calculatedDifference) < 0.01 ? 'text-green-400' :
                  Math.abs(calculatedDifference) < 100 ? 'text-yellow-400' :
                  'text-red-400'
                }`}>
                  {calculatedDifference > 0 ? '+' : ''}
                  {formatWithCurrency(calculatedDifference, currency)}
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  {Math.abs(calculatedDifference) < 0.01
                    ? 'Balances match! Ready to reconcile.'
                    : 'You\'ll need to match transactions to resolve this difference.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Additional Notes</h2>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Any notes about this reconciliation..."
            />
          </div>
        </div>

        {/* Unreconciled Transactions Preview */}
        {selectedAccount && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Unreconciled Transactions Preview</h2>
            <p className="text-gray-400 text-sm mb-4">
              These transactions will be available to match in the next step
            </p>

            <div className="space-y-2">
              {unreconciledTransactions.slice(0, 5).map((txn) => (
                <div key={txn.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">{txn.date}</span>
                    </div>
                    <p className="text-white text-sm mt-1">{txn.description}</p>
                  </div>
                  <span className={`font-semibold ${
                    txn.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {txn.amount > 0 ? '+' : ''}
                    {formatWithCurrency(txn.amount, currency)}
                  </span>
                </div>
              ))}
            </div>

            {unreconciledTransactions.length > 5 && (
              <p className="text-gray-400 text-sm mt-3">
                + {unreconciledTransactions.length - 5} more transactions to reconcile
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting || !formData.accountId}
            className="px-6 py-3 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <CheckCircle className="h-4 w-4" />
            <span>{isSubmitting ? 'Starting...' : 'Start Reconciliation'}</span>
          </button>
          <Link
            href="/dashboard/finance/reconciliation"
            className="px-6 py-3 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
