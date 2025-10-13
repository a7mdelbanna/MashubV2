'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Info, AlertCircle } from 'lucide-react'
import Select from '@/components/ui/select'
import { accountTypeOptions, popularCurrenciesOptions, pspProviderOptions } from '@/lib/select-options'
import { isValidAmount, isValidIBAN } from '@/lib/finance-utils'
import { AccountType } from '@/types/finance'

export default function NewAccountPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'bank' as AccountType,
    currency: 'EGP',
    initialBalance: '',
    isActive: true,
    // Bank Details
    bankName: '',
    accountNumber: '',
    iban: '',
    swiftCode: '',
    branch: '',
    accountHolder: '',
    // PSP Details
    pspProvider: 'stripe' as 'stripe' | 'paymob' | 'paypal' | 'other',
    pspAccountId: '',
    pspIsLive: true
  })

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
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

    if (!formData.name.trim()) {
      newErrors.name = 'Account name is required'
    }

    if (!formData.type) {
      newErrors.type = 'Account type is required'
    }

    if (!formData.currency) {
      newErrors.currency = 'Currency is required'
    }

    if (formData.initialBalance) {
      const balance = parseFloat(formData.initialBalance)
      if (isNaN(balance) || !isFinite(balance)) {
        newErrors.initialBalance = 'Invalid balance amount'
      }
    }

    // Bank-specific validation
    if (formData.type === 'bank') {
      if (!formData.bankName.trim()) {
        newErrors.bankName = 'Bank name is required for bank accounts'
      }
      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = 'Account number is required for bank accounts'
      }
      if (formData.iban && !isValidIBAN(formData.iban)) {
        newErrors.iban = 'Invalid IBAN format'
      }
    }

    // PSP-specific validation
    if (formData.type.startsWith('psp-')) {
      if (!formData.pspAccountId.trim()) {
        newErrors.pspAccountId = 'PSP account ID is required'
      }
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

      // Mock success
      console.log('Account created:', formData)

      // Redirect to accounts list
      router.push('/dashboard/finance/accounts')
    } catch (error) {
      console.error('Error creating account:', error)
      setErrors({ submit: 'Failed to create account. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const needsBankDetails = formData.type === 'bank'
  const needsPSPDetails = formData.type.startsWith('psp-')

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
        <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
          Add New Account
        </h1>
        <p className="text-gray-400">
          Create a new financial account for tracking transactions and balances
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl">
        {/* Error Alert */}
        {errors.submit && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400">{errors.submit}</p>
          </div>
        )}

        {/* Single Currency Warning */}
        <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-300">
              <p className="mb-2">
                <strong className="text-white">Important:</strong> Each account holds transactions in a single currency only.
              </p>
              <p>
                If you need to manage multiple currencies, create separate accounts for each currency
                (e.g., "CIB - EGP Account" and "Wise - USD Account").
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>

          <div className="space-y-6">
            {/* Account Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Account Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errors.name ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="CIB - EGP Main Account"
                required
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
              <p className="text-gray-400 text-sm mt-2">
                Choose a descriptive name that includes the currency (e.g., "CIB - EGP Main")
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Primary bank account for EGP transactions..."
              />
            </div>

            {/* Account Type */}
            <div>
              <Select
                label="Account Type"
                options={accountTypeOptions}
                value={formData.type}
                onChange={(value) => handleChange('type', value)}
                required
              />
              <p className="text-gray-400 text-sm mt-2">
                Select the type of account (bank, cash, payment processor, etc.)
              </p>
            </div>

            {/* Currency */}
            <div>
              <Select
                label="Currency"
                options={popularCurrenciesOptions}
                value={formData.currency}
                onChange={(value) => handleChange('currency', value)}
                required
              />
              <p className="text-gray-400 text-sm mt-2">
                <strong className="text-white">Important:</strong> This currency cannot be changed after creating the account.
                All transactions in this account must use this currency.
              </p>
            </div>

            {/* Initial Balance */}
            <div>
              <label htmlFor="initialBalance" className="block text-sm font-medium text-gray-300 mb-2">
                Initial Balance (Optional)
              </label>
              <input
                type="text"
                id="initialBalance"
                value={formData.initialBalance}
                onChange={(e) => handleChange('initialBalance', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errors.initialBalance ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="0.00"
              />
              {errors.initialBalance && <p className="text-red-400 text-sm mt-1">{errors.initialBalance}</p>}
              <p className="text-gray-400 text-sm mt-2">
                The opening balance of this account. Leave empty or 0 for new accounts.
              </p>
            </div>
          </div>
        </div>

        {/* Bank Details (conditional) */}
        {needsBankDetails && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-6">Bank Details</h2>

            <div className="space-y-6">
              {/* Bank Name */}
              <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-gray-300 mb-2">
                  Bank Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => handleChange('bankName', e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-900 border ${
                    errors.bankName ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  placeholder="Commercial International Bank"
                  required={needsBankDetails}
                />
                {errors.bankName && <p className="text-red-400 text-sm mt-1">{errors.bankName}</p>}
              </div>

              {/* Account Number */}
              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-300 mb-2">
                  Account Number <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => handleChange('accountNumber', e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-900 border ${
                    errors.accountNumber ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono`}
                  placeholder="1234567890"
                  required={needsBankDetails}
                />
                {errors.accountNumber && <p className="text-red-400 text-sm mt-1">{errors.accountNumber}</p>}
              </div>

              {/* Account Holder */}
              <div>
                <label htmlFor="accountHolder" className="block text-sm font-medium text-gray-300 mb-2">
                  Account Holder
                </label>
                <input
                  type="text"
                  id="accountHolder"
                  value={formData.accountHolder}
                  onChange={(e) => handleChange('accountHolder', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="MasHub Ltd"
                />
              </div>

              {/* IBAN */}
              <div>
                <label htmlFor="iban" className="block text-sm font-medium text-gray-300 mb-2">
                  IBAN (Optional)
                </label>
                <input
                  type="text"
                  id="iban"
                  value={formData.iban}
                  onChange={(e) => handleChange('iban', e.target.value.toUpperCase())}
                  className={`w-full px-4 py-2 bg-gray-900 border ${
                    errors.iban ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono`}
                  placeholder="EG380021000000012345678901234"
                />
                {errors.iban && <p className="text-red-400 text-sm mt-1">{errors.iban}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* SWIFT Code */}
                <div>
                  <label htmlFor="swiftCode" className="block text-sm font-medium text-gray-300 mb-2">
                    SWIFT/BIC Code (Optional)
                  </label>
                  <input
                    type="text"
                    id="swiftCode"
                    value={formData.swiftCode}
                    onChange={(e) => handleChange('swiftCode', e.target.value.toUpperCase())}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                    placeholder="CIBEEGCX"
                  />
                </div>

                {/* Branch */}
                <div>
                  <label htmlFor="branch" className="block text-sm font-medium text-gray-300 mb-2">
                    Branch (Optional)
                  </label>
                  <input
                    type="text"
                    id="branch"
                    value={formData.branch}
                    onChange={(e) => handleChange('branch', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="New Cairo Branch"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PSP Details (conditional) */}
        {needsPSPDetails && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-6">Payment Service Provider Details</h2>

            <div className="space-y-6">
              {/* PSP Provider */}
              <div>
                <Select
                  label="Provider"
                  options={pspProviderOptions}
                  value={formData.pspProvider}
                  onChange={(value) => handleChange('pspProvider', value)}
                  required
                />
              </div>

              {/* PSP Account ID */}
              <div>
                <label htmlFor="pspAccountId" className="block text-sm font-medium text-gray-300 mb-2">
                  Account/Merchant ID <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  id="pspAccountId"
                  value={formData.pspAccountId}
                  onChange={(e) => handleChange('pspAccountId', e.target.value)}
                  className={`w-full px-4 py-2 bg-gray-900 border ${
                    errors.pspAccountId ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono`}
                  placeholder="acct_1234567890 or merchant_id"
                  required={needsPSPDetails}
                />
                {errors.pspAccountId && <p className="text-red-400 text-sm mt-1">{errors.pspAccountId}</p>}
                <p className="text-gray-400 text-sm mt-2">
                  Your {formData.pspProvider === 'stripe' ? 'Stripe' : 'PSP'} account or merchant ID
                </p>
              </div>

              {/* Is Live */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="pspIsLive"
                  checked={formData.pspIsLive}
                  onChange={(e) => handleChange('pspIsLive', e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-900 border-gray-700 rounded focus:ring-purple-500"
                />
                <label htmlFor="pspIsLive" className="text-gray-300">
                  Production/Live Mode (uncheck for test/sandbox mode)
                </label>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-300">
                    <p>
                      API keys and webhook secrets should be configured separately in the Payment Methods
                      section for security reasons. This account will track the balance only.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Status</h2>

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
                Only active accounts can be selected for new transactions
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-gradient-purple text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </button>
          <Link
            href="/dashboard/finance/accounts"
            className="px-6 py-3 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
