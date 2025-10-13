'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'
import Select from '@/components/ui/select'
import { transactionTypeOptions, popularCurrenciesOptions } from '@/lib/select-options'
import { isValidAmount } from '@/lib/finance-utils'

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annual', label: 'Annual' }
]

export default function NewRecurringTransactionPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    type: 'expense',
    description: '',
    amount: '',
    currency: 'EGP',
    accountId: '',
    categoryId: '',
    contactId: '',
    paymentMethodId: '',
    frequency: 'monthly',
    startDate: '',
    endDate: '',
    isActive: true,
    autoPost: false,
    notes: ''
  })

  // Mock data
  const accounts = [
    { id: '1', name: 'CIB - EGP Main Account', currency: 'EGP' },
    { id: '2', name: 'Stripe USD', currency: 'USD' },
    { id: '3', name: 'Cash - Cairo Office', currency: 'EGP' },
    { id: '4', name: 'Paymob EGP', currency: 'EGP' }
  ]

  const categories = [
    { id: '1', name: 'Income/Services/Development', type: 'income' },
    { id: '2', name: 'Income/Recurring', type: 'income' },
    { id: '3', name: 'Expense/Office/Rent', type: 'expense' },
    { id: '4', name: 'Expense/Salaries', type: 'expense' },
    { id: '5', name: 'Expense/Software', type: 'expense' }
  ]

  const contacts = [
    { id: '1', name: 'Tech Corp Ltd', type: 'client' },
    { id: '2', name: 'Cairo Properties', type: 'vendor' },
    { id: '3', name: 'Dell Technologies', type: 'vendor' }
  ]

  const paymentMethods = [
    { id: '1', name: 'Stripe - Credit/Debit Cards' },
    { id: '2', name: 'Bank Transfer - CIB' },
    { id: '3', name: 'Cash Payment' }
  ]

  const filteredAccounts = accounts.filter(acc => acc.currency === formData.currency)
  const filteredCategories = categories.filter(cat => cat.type === formData.type)

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }

      if (field === 'currency') {
        updated.accountId = ''
      }

      if (field === 'type') {
        updated.categoryId = ''
      }

      return updated
    })

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

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (!formData.amount) {
      newErrors.amount = 'Amount is required'
    } else if (!isValidAmount(parseFloat(formData.amount))) {
      newErrors.amount = 'Invalid amount'
    }

    if (!formData.accountId) {
      newErrors.accountId = 'Account is required'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }

    if (formData.endDate && formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date'
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
      console.log('Recurring transaction created:', formData)
      router.push('/dashboard/finance/recurring')
    } catch (error) {
      console.error('Error creating recurring transaction:', error)
      setErrors({ submit: 'Failed to create recurring transaction. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/finance/recurring"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Recurring Transactions
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
          New Recurring Transaction
        </h1>
        <p className="text-gray-400">
          Set up automatic recurring income or expense
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
              <p>
                <strong className="text-white">Recurring Transactions:</strong> Automatically create transactions on a schedule. Perfect for rent, subscriptions, salaries, and other regular payments.
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Transaction Type"
              options={transactionTypeOptions.filter(opt => opt.value !== 'transfer')}
              value={formData.type}
              onChange={(value) => handleChange('type', value)}
              required
              error={errors.type}
            />

            <Select
              label="Currency"
              options={popularCurrenciesOptions}
              value={formData.currency}
              onChange={(value) => handleChange('currency', value)}
              required
            />

            <div className="md:col-span-2">
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
                placeholder="e.g., Office Rent - Monthly"
                required
              />
              {errors.description && <p className="text-red-400 text-sm mt-1">{errors.description}</p>}
            </div>

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

            <Select
              label={formData.type === 'income' ? 'To Account' : 'From Account'}
              options={filteredAccounts.map(acc => ({
                value: acc.id,
                label: acc.name
              }))}
              value={formData.accountId}
              onChange={(value) => handleChange('accountId', value)}
              placeholder="Select account..."
              required
              error={errors.accountId}
            />
          </div>
        </div>

        {/* Schedule Settings */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Schedule Settings</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Frequency"
              options={frequencyOptions}
              value={formData.frequency}
              onChange={(value) => handleChange('frequency', value)}
              required
            />

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">
                Start Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                value={formData.startDate}
                onChange={(e) => handleChange('startDate', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errors.startDate ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                required
              />
              {errors.startDate && <p className="text-red-400 text-sm mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                id="endDate"
                value={formData.endDate}
                onChange={(e) => handleChange('endDate', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errors.endDate ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
              {errors.endDate && <p className="text-red-400 text-sm mt-1">{errors.endDate}</p>}
              <p className="text-gray-400 text-xs mt-1">Leave empty for indefinite recurring</p>
            </div>
          </div>
        </div>

        {/* Classification */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Classification (Optional)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Select
              label="Category"
              options={[
                { value: '', label: 'Select category...' },
                ...filteredCategories.map(cat => ({ value: cat.id, label: cat.name }))
              ]}
              value={formData.categoryId}
              onChange={(value) => handleChange('categoryId', value)}
            />

            <Select
              label="Contact"
              options={[
                { value: '', label: 'Select contact...' },
                ...contacts.map(c => ({ value: c.id, label: c.name }))
              ]}
              value={formData.contactId}
              onChange={(value) => handleChange('contactId', value)}
            />

            <Select
              label="Payment Method"
              options={[
                { value: '', label: 'Select payment method...' },
                ...paymentMethods.map(pm => ({ value: pm.id, label: pm.name }))
              ]}
              value={formData.paymentMethodId}
              onChange={(value) => handleChange('paymentMethodId', value)}
            />
          </div>
        </div>

        {/* Additional Settings */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Additional Settings</h2>

          <div className="space-y-6">
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="autoPost"
                checked={formData.autoPost}
                onChange={(e) => handleChange('autoPost', e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-900 border-gray-700 rounded focus:ring-purple-500 mt-1"
              />
              <div>
                <label htmlFor="autoPost" className="text-gray-300 font-medium">
                  Automatically Post Transactions
                </label>
                <p className="text-gray-400 text-sm mt-1">
                  When enabled, transactions will be automatically posted to accounts. Disable for manual review.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-900 border-gray-700 rounded focus:ring-purple-500 mt-1"
              />
              <div>
                <label htmlFor="isActive" className="text-gray-300 font-medium">
                  Active
                </label>
                <p className="text-gray-400 text-sm mt-1">
                  Inactive recurring transactions will not create new transactions
                </p>
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
            <span>{isSubmitting ? 'Creating...' : 'Create Recurring Transaction'}</span>
          </button>
          <Link
            href="/dashboard/finance/recurring"
            className="px-6 py-3 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
