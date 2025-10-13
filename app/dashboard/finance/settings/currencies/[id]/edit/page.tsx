'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2, Info, AlertTriangle } from 'lucide-react'
import Select from '@/components/ui/select'
import { symbolPositionOptions, fxProviderOptions } from '@/lib/select-options'
import { isValidCurrencyCode } from '@/lib/finance-utils'
import { Currency } from '@/types/finance'

export default function EditCurrencyPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [originalCurrency, setOriginalCurrency] = useState<Currency | null>(null)
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

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchCurrency = async () => {
      setIsLoading(true)
      try {
        // Mock data - simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500))

        // Mock currency data
        const mockCurrency: Currency = {
          id: params.id,
          code: 'USD',
          name: 'US Dollar',
          symbol: '$',
          symbolPosition: 'before',
          decimalPlaces: 2,
          isDefault: false,
          isActive: true,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-01-15')
        }

        setOriginalCurrency(mockCurrency)
        setFormData({
          code: mockCurrency.code,
          name: mockCurrency.name,
          symbol: mockCurrency.symbol,
          symbolPosition: mockCurrency.symbolPosition,
          decimalPlaces: mockCurrency.decimalPlaces.toString(),
          isDefault: mockCurrency.isDefault,
          isActive: mockCurrency.isActive,
          fxProvider: 'exchangerate-api',
          autoSync: true,
          manualRate: ''
        })
      } catch (error) {
        console.error('Error fetching currency:', error)
        setErrors({ fetch: 'Failed to load currency. Please try again.' })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCurrency()
  }, [params.id])

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
      console.log('Currency updated:', formData)

      // Redirect to currencies list
      router.push('/dashboard/finance/settings/currencies')
    } catch (error) {
      console.error('Error updating currency:', error)
      setErrors({ submit: 'Failed to update currency. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!originalCurrency || originalCurrency.isDefault) {
      return
    }

    setIsDeleting(true)

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock success
      console.log('Currency deleted:', params.id)

      // Redirect to currencies list
      router.push('/dashboard/finance/settings/currencies')
    } catch (error) {
      console.error('Error deleting currency:', error)
      setErrors({ delete: 'Failed to delete currency. Please try again.' })
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading currency...</p>
        </div>
      </div>
    )
  }

  if (errors.fetch) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-2xl mx-auto">
          <p className="text-red-400">{errors.fetch}</p>
          <Link
            href="/dashboard/finance/settings/currencies"
            className="text-purple-400 hover:text-purple-300 mt-4 inline-block"
          >
            Back to Currencies
          </Link>
        </div>
      </div>
    )
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
              Edit Currency
            </h1>
            <p className="text-gray-400">
              Update currency settings and exchange rate configuration
            </p>
          </div>
          {originalCurrency && !originalCurrency.isDefault && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Currency
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Delete Currency</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <strong>{originalCurrency?.name}</strong>? This action cannot be undone.
              All transactions using this currency will remain intact but you won't be able to create new ones.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-3xl">
        {/* Error Alert */}
        {errors.submit && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400">{errors.submit}</p>
          </div>
        )}

        {errors.delete && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-400">{errors.delete}</p>
          </div>
        )}

        {/* Default Currency Warning */}
        {originalCurrency?.isDefault && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-300">
                <p>
                  <strong className="text-white">This is the default currency.</strong> It cannot be deactivated
                  or deleted. To change the default currency, first set another currency as default.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>

          <div className="space-y-6">
            {/* Currency Code (Read-only) */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
                Currency Code
              </label>
              <input
                type="text"
                id="code"
                value={formData.code}
                disabled
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-500 uppercase font-mono cursor-not-allowed"
              />
              <p className="text-gray-400 text-sm mt-2">
                Currency code cannot be changed after creation
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
                Preview: {formData.symbolPosition === 'before' ? `${formData.symbol}100` : `100${formData.symbol}`}
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
                placeholder="Leave empty for automatic rates"
              />
              {errors.manualRate && <p className="text-red-400 text-sm mt-1">{errors.manualRate}</p>}
              <p className="text-gray-400 text-sm mt-2">
                Set a fixed exchange rate to override automatic updates
              </p>
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
                  Make this the default currency for consolidated reporting
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
                disabled={originalCurrency?.isDefault}
                className="w-4 h-4 text-purple-600 bg-gray-900 border-gray-700 rounded focus:ring-purple-500 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div>
                <label htmlFor="isActive" className="text-gray-300 font-medium">
                  Active
                </label>
                <p className="text-gray-400 text-sm mt-1">
                  {originalCurrency?.isDefault
                    ? 'Default currency cannot be deactivated'
                    : 'Deactivating prevents this currency from being used in new transactions'}
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
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
