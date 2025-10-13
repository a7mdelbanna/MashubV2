'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Info } from 'lucide-react'
import Select from '@/components/ui/select'
import { allCurrenciesOptions, symbolPositionOptions, fxProviderOptions } from '@/lib/select-options'
import { isValidCurrencyCode } from '@/lib/finance-utils'

export default function NewCurrencyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    symbol: '',
    symbolPosition: 'before',
    decimalPlaces: '2',
    isDefault: false,
    isActive: true,
    // FX Provider Settings
    fxProvider: 'exchangerate-api',
    autoSync: true,
    manualRate: ''
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

    if (!formData.code.trim()) {
      newErrors.code = 'Currency code is required'
    } else if (!isValidCurrencyCode(formData.code)) {
      newErrors.code = 'Invalid currency code (must be 3 uppercase letters)'
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Currency name is required'
    }

    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Currency symbol is required'
    }

    const decimals = parseInt(formData.decimalPlaces)
    if (isNaN(decimals) || decimals < 0 || decimals > 4) {
      newErrors.decimalPlaces = 'Decimal places must be between 0 and 4'
    }

    if (formData.manualRate && isNaN(parseFloat(formData.manualRate))) {
      newErrors.manualRate = 'Manual rate must be a valid number'
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
      console.log('Currency created:', formData)

      // Redirect to currencies list
      router.push('/dashboard/finance/settings/currencies')
    } catch (error) {
      console.error('Error creating currency:', error)
      setErrors({ submit: 'Failed to create currency. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  // When a currency is selected from the dropdown, auto-fill the details
  const handleCurrencySelect = (code: string) => {
    const selected = allCurrenciesOptions.find(opt => opt.value === code)
    if (selected) {
      // Parse the label to extract name and symbol
      // Format: "USD - US Dollar ($)"
      const parts = selected.label.split(' - ')
      const codePart = parts[0]
      const rest = parts[1] || ''
      const symbolMatch = rest.match(/\(([^)]+)\)/)
      const symbol = symbolMatch ? symbolMatch[1] : '$'
      const name = rest.replace(/\s*\([^)]+\)/, '').trim()

      setFormData(prev => ({
        ...prev,
        code: codePart,
        name: name || codePart,
        symbol: symbol
      }))
    } else {
      setFormData(prev => ({ ...prev, code }))
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/finance/settings/currencies"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Currencies
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
          Add New Currency
        </h1>
        <p className="text-gray-400">
          Enable a new currency for multi-currency transactions and reporting
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

        {/* Basic Information */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>

          <div className="space-y-6">
            {/* Quick Select from Common Currencies */}
            <div>
              <Select
                label="Quick Select Currency"
                options={allCurrenciesOptions}
                value={formData.code}
                onChange={handleCurrencySelect}
                placeholder="Select a currency to auto-fill details..."
              />
              <p className="text-gray-400 text-sm mt-2">
                Select a currency from the list to automatically populate the fields below, or enter details manually.
              </p>
            </div>

            <div className="border-t border-gray-700 pt-6"></div>

            {/* Currency Code */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
                Currency Code <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="code"
                value={formData.code}
                onChange={(e) => handleChange('code', e.target.value.toUpperCase())}
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errors.code ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase font-mono`}
                placeholder="USD"
                maxLength={3}
                required
              />
              {errors.code && <p className="text-red-400 text-sm mt-1">{errors.code}</p>}
              <p className="text-gray-400 text-sm mt-2">
                3-letter ISO 4217 code (e.g., USD, EUR, EGP)
              </p>
            </div>

            {/* Currency Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Currency Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errors.name ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="US Dollar"
                required
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Currency Symbol */}
            <div>
              <label htmlFor="symbol" className="block text-sm font-medium text-gray-300 mb-2">
                Currency Symbol <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="symbol"
                value={formData.symbol}
                onChange={(e) => handleChange('symbol', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errors.symbol ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg`}
                placeholder="$"
                required
              />
              {errors.symbol && <p className="text-red-400 text-sm mt-1">{errors.symbol}</p>}
            </div>

            {/* Symbol Position */}
            <div>
              <Select
                label="Symbol Position"
                options={symbolPositionOptions}
                value={formData.symbolPosition}
                onChange={(value) => handleChange('symbolPosition', value)}
                required
              />
              <p className="text-gray-400 text-sm mt-2">
                Choose where the symbol appears: {formData.symbolPosition === 'before' ? `${formData.symbol}100` : `100${formData.symbol}`}
              </p>
            </div>

            {/* Decimal Places */}
            <div>
              <label htmlFor="decimalPlaces" className="block text-sm font-medium text-gray-300 mb-2">
                Decimal Places <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                id="decimalPlaces"
                value={formData.decimalPlaces}
                onChange={(e) => handleChange('decimalPlaces', e.target.value)}
                min="0"
                max="4"
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errors.decimalPlaces ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                required
              />
              {errors.decimalPlaces && <p className="text-red-400 text-sm mt-1">{errors.decimalPlaces}</p>}
              <p className="text-gray-400 text-sm mt-2">
                Most currencies use 2 decimals. Use 0 for currencies like JPY (¥).
              </p>
            </div>
          </div>
        </div>

        {/* Exchange Rate Configuration */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Exchange Rate Configuration</h2>

          <div className="space-y-6">
            {/* FX Provider */}
            <div>
              <Select
                label="Exchange Rate Provider"
                options={fxProviderOptions}
                value={formData.fxProvider}
                onChange={(value) => handleChange('fxProvider', value)}
              />
              <p className="text-gray-400 text-sm mt-2">
                Select the API provider for automatic exchange rate updates
              </p>
            </div>

            {/* Auto Sync */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="autoSync"
                checked={formData.autoSync}
                onChange={(e) => handleChange('autoSync', e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-900 border-gray-700 rounded focus:ring-purple-500"
              />
              <label htmlFor="autoSync" className="text-gray-300">
                Automatically sync exchange rates daily
              </label>
            </div>

            {/* Manual Rate Override */}
            <div>
              <label htmlFor="manualRate" className="block text-sm font-medium text-gray-300 mb-2">
                Manual Rate Override (Optional)
              </label>
              <input
                type="text"
                id="manualRate"
                value={formData.manualRate}
                onChange={(e) => handleChange('manualRate', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errors.manualRate ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="1.0"
              />
              {errors.manualRate && <p className="text-red-400 text-sm mt-1">{errors.manualRate}</p>}
              <p className="text-gray-400 text-sm mt-2">
                Set a fixed exchange rate instead of using automatic updates (e.g., 1 USD = 30.95 to default currency)
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p className="mb-2">
                    <strong className="text-white">Important:</strong> Exchange rates are fetched based on
                    the default currency set in your system.
                  </p>
                  <p>
                    When a transaction is posted, the current rate is saved as an immutable snapshot,
                    ensuring historical reports remain accurate even when rates change.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status & Settings */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Status & Settings</h2>

          <div className="space-y-4">
            {/* Is Default */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData.isDefault}
                onChange={(e) => handleChange('isDefault', e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-900 border-gray-700 rounded focus:ring-purple-500 mt-1"
              />
              <div>
                <label htmlFor="isDefault" className="text-gray-300 font-medium">
                  Set as default currency
                </label>
                <p className="text-gray-400 text-sm mt-1">
                  The default currency is used for consolidated reporting. All transactions in other
                  currencies will be converted to this currency for unified reports.
                </p>
              </div>
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
                  Only active currencies can be selected for new transactions and accounts.
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
            className="px-6 py-3 bg-gradient-purple text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Creating...' : 'Create Currency'}
          </button>
          <Link
            href="/dashboard/finance/settings/currencies"
            className="px-6 py-3 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
