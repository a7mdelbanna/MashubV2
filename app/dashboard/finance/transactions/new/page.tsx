'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, FileText, Upload, X, AlertCircle } from 'lucide-react'
import Select from '@/components/ui/select'
import { transactionTypeOptions, transactionStateOptions, popularCurrenciesOptions } from '@/lib/select-options'
import { isValidAmount } from '@/lib/finance-utils'

export default function NewTransactionPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    currency: 'EGP',
    accountId: '',
    categoryId: '',
    contactId: '',
    paymentMethodId: '',
    description: '',
    notes: '',
    reference: '',
    state: 'draft',
    requiresApproval: false,
    taxRate: '',
    // Transfer specific
    sourceAccountId: '',
    destinationAccountId: '',
    feeAmount: ''
  })

  // Mock data - TODO: Replace with API calls
  const accounts = [
    { id: '1', name: 'CIB - EGP Main Account', currency: 'EGP', balance: 285600.50 },
    { id: '2', name: 'Stripe USD', currency: 'USD', balance: 12450.75 },
    { id: '3', name: 'Cash - Cairo Office', currency: 'EGP', balance: 8500 },
    { id: '4', name: 'Wise - USD Account', currency: 'USD', balance: 5230.40 },
    { id: '5', name: 'Paymob EGP', currency: 'EGP', balance: 45800 }
  ]

  const categories = [
    { id: '1', name: 'Income/Services/Development', type: 'income' },
    { id: '2', name: 'Income/Services/Consulting', type: 'income' },
    { id: '3', name: 'Income/Products', type: 'income' },
    { id: '4', name: 'Expense/Office/Rent', type: 'expense' },
    { id: '5', name: 'Expense/Office/Utilities', type: 'expense' },
    { id: '6', name: 'Expense/Salaries', type: 'expense' },
    { id: '7', name: 'Expense/Marketing/Digital Ads', type: 'expense' }
  ]

  const contacts = [
    { id: '1', name: 'Tech Corp Ltd', type: 'client' },
    { id: '2', name: 'Cairo Properties', type: 'vendor' },
    { id: '3', name: 'Dell Technologies', type: 'vendor' },
    { id: '4', name: 'Marketing Solutions Co', type: 'partner' }
  ]

  const paymentMethods = [
    { id: '1', name: 'Stripe - Credit/Debit Cards' },
    { id: '2', name: 'Paymob - Local Payment Gateway' },
    { id: '3', name: 'Bank Transfer - CIB' },
    { id: '4', name: 'Cash Payment' }
  ]

  // Filter accounts by selected currency
  const filteredAccounts = accounts.filter(acc => acc.currency === formData.currency)

  // Filter categories by transaction type
  const filteredCategories = categories.filter(cat => {
    if (formData.type === 'transfer') return false
    return cat.type === formData.type
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }

      // Reset account when currency changes
      if (field === 'currency') {
        updated.accountId = ''
        updated.sourceAccountId = ''
        updated.destinationAccountId = ''
      }

      // Reset category when type changes
      if (field === 'type') {
        updated.categoryId = ''
      }

      return updated
    })

    // Clear error
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

    if (!formData.type) {
      newErrors.type = 'Transaction type is required'
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required'
    } else if (!isValidAmount(parseFloat(formData.amount))) {
      newErrors.amount = 'Invalid amount'
    }

    if (!formData.currency) {
      newErrors.currency = 'Currency is required'
    }

    if (formData.type === 'transfer') {
      if (!formData.sourceAccountId) {
        newErrors.sourceAccountId = 'Source account is required'
      }
      if (!formData.destinationAccountId) {
        newErrors.destinationAccountId = 'Destination account is required'
      }
      if (formData.sourceAccountId === formData.destinationAccountId) {
        newErrors.destinationAccountId = 'Source and destination accounts must be different'
      }
    } else {
      if (!formData.accountId) {
        newErrors.accountId = 'Account is required'
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (formData.taxRate && isNaN(parseFloat(formData.taxRate))) {
      newErrors.taxRate = 'Invalid tax rate'
    }

    if (formData.feeAmount && isNaN(parseFloat(formData.feeAmount))) {
      newErrors.feeAmount = 'Invalid fee amount'
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
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      console.log('Transaction created:', formData)

      // Redirect to transactions list
      router.push('/dashboard/finance/transactions')
    } catch (error) {
      console.error('Error creating transaction:', error)
      setErrors({ submit: 'Failed to create transaction. Please try again.' })
    } finally {
      setIsSubmitting(false)
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
        <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
          New Transaction
        </h1>
        <p className="text-gray-400">
          Record a new income, expense, or transfer transaction
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl">
        {/* Error Alert */}
        {errors.submit && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400">{errors.submit}</p>
          </div>
        )}

        {/* Transaction Type & Currency Warning */}
        <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-300">
              <p className="mb-2">
                <strong className="text-white">Select currency first:</strong> The account dropdown will show only accounts matching the selected currency.
              </p>
              <p>
                <strong className="text-white">FX Snapshot:</strong> If the currency differs from your default currency (EGP), the current exchange rate will be captured when you post this transaction.
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Transaction Type */}
            <Select
              label="Transaction Type"
              options={transactionTypeOptions}
              value={formData.type}
              onChange={(value) => handleChange('type', value)}
              required
              error={errors.type}
            />

            {/* Currency */}
            <Select
              label="Currency"
              options={popularCurrenciesOptions}
              value={formData.currency}
              onChange={(value) => handleChange('currency', value)}
              required
              error={errors.currency}
            />

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
                Amount <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="amount"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errors.amount ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="0.00"
                required
              />
              {errors.amount && <p className="text-red-400 text-sm mt-1">{errors.amount}</p>}
            </div>

            {/* Tax Rate (Optional) */}
            <div>
              <label htmlFor="taxRate" className="block text-sm font-medium text-gray-300 mb-2">
                Tax Rate % (Optional)
              </label>
              <input
                type="text"
                id="taxRate"
                value={formData.taxRate}
                onChange={(e) => handleChange('taxRate', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errors.taxRate ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="14"
              />
              {errors.taxRate && <p className="text-red-400 text-sm mt-1">{errors.taxRate}</p>}
              <p className="text-gray-400 text-xs mt-1">e.g., 14 for 14% VAT</p>
            </div>
          </div>
        </div>

        {/* Account Selection */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            {formData.type === 'transfer' ? 'Transfer Details' : 'Account'}
          </h2>

          {formData.type === 'transfer' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Source Account */}
              <Select
                label="From Account (Source)"
                options={filteredAccounts.map(acc => ({
                  value: acc.id,
                  label: `${acc.name} (${acc.currency} ${acc.balance.toFixed(2)})`
                }))}
                value={formData.sourceAccountId}
                onChange={(value) => handleChange('sourceAccountId', value)}
                placeholder="Select source account..."
                required
                error={errors.sourceAccountId}
              />

              {/* Destination Account */}
              <Select
                label="To Account (Destination)"
                options={filteredAccounts.map(acc => ({
                  value: acc.id,
                  label: `${acc.name} (${acc.currency} ${acc.balance.toFixed(2)})`
                }))}
                value={formData.destinationAccountId}
                onChange={(value) => handleChange('destinationAccountId', value)}
                placeholder="Select destination account..."
                required
                error={errors.destinationAccountId}
              />

              {/* Transfer Fee (Optional) */}
              <div>
                <label htmlFor="feeAmount" className="block text-sm font-medium text-gray-300 mb-2">
                  Transfer Fee (Optional)
                </label>
                <input
                  type="text"
                  id="feeAmount"
                  value={formData.feeAmount}
                  onChange={(e) => handleChange('feeAmount', e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-900 border ${
                    errors.feeAmount ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="0.00"
                />
                {errors.feeAmount && <p className="text-red-400 text-sm mt-1">{errors.feeAmount}</p>}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account */}
              <Select
                label={formData.type === 'income' ? 'To Account (Deposit)' : 'From Account (Withdraw)'}
                options={filteredAccounts.map(acc => ({
                  value: acc.id,
                  label: `${acc.name} (${acc.currency} ${acc.balance.toFixed(2)})`
                }))}
                value={formData.accountId}
                onChange={(value) => handleChange('accountId', value)}
                placeholder="Select account..."
                required
                error={errors.accountId}
              />

              {filteredAccounts.length === 0 && (
                <div className="md:col-span-2">
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                    <p className="text-yellow-400 text-sm">
                      No accounts available for {formData.currency}. Please create an account in this currency first.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Classification */}
        {formData.type !== 'transfer' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-6">Classification</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Category */}
              <Select
                label="Category"
                options={[
                  { value: '', label: 'Select category...' },
                  ...filteredCategories.map(cat => ({ value: cat.id, label: cat.name }))
                ]}
                value={formData.categoryId}
                onChange={(value) => handleChange('categoryId', value)}
                placeholder="Select category..."
              />

              {/* Contact */}
              <Select
                label="Contact"
                options={[
                  { value: '', label: 'Select contact...' },
                  ...contacts.map(c => ({ value: c.id, label: c.name }))
                ]}
                value={formData.contactId}
                onChange={(value) => handleChange('contactId', value)}
                placeholder="Select contact..."
              />

              {/* Payment Method */}
              <Select
                label="Payment Method"
                options={[
                  { value: '', label: 'Select payment method...' },
                  ...paymentMethods.map(pm => ({ value: pm.id, label: pm.name }))
                ]}
                value={formData.paymentMethodId}
                onChange={(value) => handleChange('paymentMethodId', value)}
                placeholder="Select payment method..."
              />
            </div>
          </div>
        )}

        {/* Description & Details */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Description & Details</h2>

          <div className="space-y-6">
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errors.description ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="e.g., Office rent - March 2024"
                required
              />
              {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Reference */}
            <div>
              <label htmlFor="reference" className="block text-sm font-medium text-gray-300 mb-2">
                Reference Number (Optional)
              </label>
              <input
                type="text"
                id="reference"
                value={formData.reference}
                onChange={(e) => handleChange('reference', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., INV-2024-001, Receipt #123"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Additional notes or comments..."
              />
            </div>
          </div>
        </div>

        {/* Status & Workflow */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Status & Workflow</h2>

          <div className="space-y-4">
            {/* State */}
            <Select
              label="Status"
              options={transactionStateOptions.filter(opt => ['draft', 'pending-approval', 'posted'].includes(opt.value))}
              value={formData.state}
              onChange={(value) => handleChange('state', value)}
            />

            {/* Requires Approval */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="requiresApproval"
                checked={formData.requiresApproval}
                onChange={(e) => handleChange('requiresApproval', e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-900 border-gray-700 rounded focus:ring-purple-500 mt-1"
              />
              <div>
                <label htmlFor="requiresApproval" className="text-gray-300 font-medium">
                  Requires Approval
                </label>
                <p className="text-gray-400 text-sm mt-1">
                  Transaction must be approved before it can be posted
                </p>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p className="mb-2">
                    <strong className="text-white">Draft:</strong> Saved but doesn't affect account balances or reports.
                  </p>
                  <p className="mb-2">
                    <strong className="text-white">Pending Approval:</strong> Submitted for approval. Must be approved before posting.
                  </p>
                  <p>
                    <strong className="text-white">Posted:</strong> Immediately affects account balances and reports. FX snapshot is captured.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span>{isSubmitting ? 'Creating...' : 'Create Transaction'}</span>
          </button>
          <Link
            href="/dashboard/finance/transactions"
            className="px-6 py-3 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
