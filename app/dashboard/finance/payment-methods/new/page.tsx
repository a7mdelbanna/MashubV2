'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, AlertCircle, Plus, X } from 'lucide-react'
import Select from '@/components/ui/select'
import { popularCurrenciesOptions } from '@/lib/select-options'

const paymentMethodTypeOptions = [
  { value: 'stripe', label: 'Stripe' },
  { value: 'paymob', label: 'Paymob' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'bank-transfer', label: 'Bank Transfer' },
  { value: 'cash', label: 'Cash' },
  { value: 'check', label: 'Check' },
  { value: 'other', label: 'Other' }
]

const providerOptions = [
  { value: 'stripe', label: 'Stripe' },
  { value: 'paymob', label: 'Paymob' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'square', label: 'Square' },
  { value: 'razorpay', label: 'Razorpay' },
  { value: 'other', label: 'Other' }
]

export default function NewPaymentMethodPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'bank-transfer',
    isActive: true,
    isAutomated: false,
    displayOrder: '',
    // Account mappings
    accountMappings: [{ currency: 'EGP', accountId: '', accountName: '' }],
    // API Config (for automated methods)
    provider: '',
    apiKeyId: '',
    isLive: false,
    // Instructions
    instructionsEn: '',
    instructionsAr: '',
    // Display
    logoUrl: ''
  })

  // Mock accounts for dropdown
  const accounts = [
    { id: '1', name: 'CIB - EGP Main Account', currency: 'EGP' },
    { id: '2', name: 'Stripe USD', currency: 'USD' },
    { id: '3', name: 'Cash - Cairo Office', currency: 'EGP' },
    { id: '4', name: 'Paymob EGP', currency: 'EGP' }
  ]

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    // Clear error
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleAddMapping = () => {
    setFormData(prev => ({
      ...prev,
      accountMappings: [...prev.accountMappings, { currency: 'EGP', accountId: '', accountName: '' }]
    }))
  }

  const handleRemoveMapping = (index: number) => {
    setFormData(prev => ({
      ...prev,
      accountMappings: prev.accountMappings.filter((_, i) => i !== index)
    }))
  }

  const handleMappingChange = (index: number, field: string, value: string) => {
    setFormData(prev => {
      const newMappings = [...prev.accountMappings]
      newMappings[index] = { ...newMappings[index], [field]: value }

      // Auto-fill account name when account is selected
      if (field === 'accountId') {
        const account = accounts.find(acc => acc.id === value)
        if (account) {
          newMappings[index].accountName = account.name
          newMappings[index].currency = account.currency
        }
      }

      return { ...prev, accountMappings: newMappings }
    })
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Payment method name is required'
    }

    if (!formData.type) {
      newErrors.type = 'Payment method type is required'
    }

    if (formData.accountMappings.length === 0) {
      newErrors.accountMappings = 'At least one account mapping is required'
    } else {
      const hasEmptyMapping = formData.accountMappings.some(m => !m.accountId || !m.currency)
      if (hasEmptyMapping) {
        newErrors.accountMappings = 'All account mappings must have currency and account selected'
      }
    }

    if (formData.isAutomated && !formData.provider) {
      newErrors.provider = 'Provider is required for automated payment methods'
    }

    if (formData.displayOrder && isNaN(parseInt(formData.displayOrder))) {
      newErrors.displayOrder = 'Display order must be a number'
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

      console.log('Payment method created:', formData)

      // Redirect to payment methods list
      router.push('/dashboard/finance/payment-methods')
    } catch (error) {
      console.error('Error creating payment method:', error)
      setErrors({ submit: 'Failed to create payment method. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/finance/payment-methods"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Payment Methods
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
          New Payment Method
        </h1>
        <p className="text-gray-400">
          Add a new payment method for clients to use
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

        {/* Info Banner */}
        <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-gray-300">
              <p className="mb-2">
                <strong className="text-white">Client-Facing:</strong> Payment methods appear on invoices and checkout pages for clients to select.
              </p>
              <p>
                <strong className="text-white">Account Mapping:</strong> Map each currency to a specific account where payments will be recorded.
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Payment Method Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errors.name ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="e.g., Stripe - Credit/Debit Cards"
                required
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={2}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Brief description shown to clients"
              />
            </div>

            {/* Type */}
            <Select
              label="Payment Method Type"
              options={paymentMethodTypeOptions}
              value={formData.type}
              onChange={(value) => handleChange('type', value)}
              required
              error={errors.type}
            />

            {/* Display Order */}
            <div>
              <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-300 mb-2">
                Display Order
              </label>
              <input
                type="text"
                id="displayOrder"
                value={formData.displayOrder}
                onChange={(e) => handleChange('displayOrder', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errors.displayOrder ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="e.g., 1, 2, 3"
              />
              {errors.displayOrder && <p className="text-red-400 text-sm mt-1">{errors.displayOrder}</p>}
              <p className="text-gray-400 text-xs mt-1">Lower numbers appear first to clients</p>
            </div>
          </div>
        </div>

        {/* Account Mappings */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Account Mappings</h2>
            <button
              type="button"
              onClick={handleAddMapping}
              className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors text-sm flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Currency
            </button>
          </div>

          {errors.accountMappings && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-400 text-sm">{errors.accountMappings}</p>
            </div>
          )}

          <div className="space-y-4">
            {formData.accountMappings.map((mapping, index) => (
              <div key={index} className="flex gap-4 items-start p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="flex-1 grid grid-cols-2 gap-4">
                  {/* Currency */}
                  <Select
                    label="Currency"
                    options={popularCurrenciesOptions}
                    value={mapping.currency}
                    onChange={(value) => handleMappingChange(index, 'currency', value)}
                  />

                  {/* Account */}
                  <Select
                    label="Account"
                    options={[
                      { value: '', label: 'Select account...' },
                      ...accounts
                        .filter(acc => acc.currency === mapping.currency)
                        .map(acc => ({ value: acc.id, label: acc.name }))
                    ]}
                    value={mapping.accountId}
                    onChange={(value) => handleMappingChange(index, 'accountId', value)}
                  />
                </div>

                {formData.accountMappings.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMapping(index)}
                    className="mt-8 p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Remove mapping"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <p className="text-gray-400 text-sm mt-4">
            Payments received in each currency will be automatically posted to the corresponding account
          </p>
        </div>

        {/* Automation Settings */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Automation Settings</h2>

          <div className="space-y-6">
            {/* Is Automated */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="isAutomated"
                checked={formData.isAutomated}
                onChange={(e) => handleChange('isAutomated', e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-900 border-gray-700 rounded focus:ring-purple-500 mt-1"
              />
              <div>
                <label htmlFor="isAutomated" className="text-gray-300 font-medium">
                  Automated Payment Method
                </label>
                <p className="text-gray-400 text-sm mt-1">
                  Enables webhook-based automatic transaction posting (for Stripe, PayPal, etc.)
                </p>
              </div>
            </div>

            {formData.isAutomated && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7">
                {/* Provider */}
                <Select
                  label="Provider"
                  options={[{ value: '', label: 'Select provider...' }, ...providerOptions]}
                  value={formData.provider}
                  onChange={(value) => handleChange('provider', value)}
                  error={errors.provider}
                />

                {/* API Key ID */}
                <div>
                  <label htmlFor="apiKeyId" className="block text-sm font-medium text-gray-300 mb-2">
                    API Key / Account ID
                  </label>
                  <input
                    type="text"
                    id="apiKeyId"
                    value={formData.apiKeyId}
                    onChange={(e) => handleChange('apiKeyId', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="sk_live_*** or account ID"
                  />
                  <p className="text-gray-400 text-xs mt-1">For reference only (not stored)</p>
                </div>

                {/* Is Live */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="isLive"
                    checked={formData.isLive}
                    onChange={(e) => handleChange('isLive', e.target.checked)}
                    className="w-4 h-4 text-purple-600 bg-gray-900 border-gray-700 rounded focus:ring-purple-500 mt-1"
                  />
                  <div>
                    <label htmlFor="isLive" className="text-gray-300 font-medium">
                      Live Mode
                    </label>
                    <p className="text-gray-400 text-sm mt-1">
                      Uncheck for test/sandbox mode
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Client Instructions */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Client Instructions</h2>

          <div className="space-y-6">
            {/* English Instructions */}
            <div>
              <label htmlFor="instructionsEn" className="block text-sm font-medium text-gray-300 mb-2">
                Instructions (English)
              </label>
              <textarea
                id="instructionsEn"
                value={formData.instructionsEn}
                onChange={(e) => handleChange('instructionsEn', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Payment instructions shown to English-speaking clients..."
              />
            </div>

            {/* Arabic Instructions */}
            <div>
              <label htmlFor="instructionsAr" className="block text-sm font-medium text-gray-300 mb-2">
                Instructions (Arabic)
              </label>
              <textarea
                id="instructionsAr"
                value={formData.instructionsAr}
                onChange={(e) => handleChange('instructionsAr', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="تعليمات الدفع للعملاء الناطقين بالعربية..."
                dir="rtl"
              />
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Display Settings</h2>

          <div className="space-y-6">
            {/* Logo URL */}
            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-300 mb-2">
                Logo URL (Optional)
              </label>
              <input
                type="text"
                id="logoUrl"
                value={formData.logoUrl}
                onChange={(e) => handleChange('logoUrl', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://example.com/logo.png"
              />
            </div>

            {/* Is Active */}
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
                  Active payment methods are shown to clients during checkout
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
            <span>{isSubmitting ? 'Creating...' : 'Create Payment Method'}</span>
          </button>
          <Link
            href="/dashboard/finance/payment-methods"
            className="px-6 py-3 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
