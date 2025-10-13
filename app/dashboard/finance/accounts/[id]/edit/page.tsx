'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Trash2, AlertTriangle, Info } from 'lucide-react'
import Select from '@/components/ui/select'
import { accountTypeOptions, pspProviderOptions } from '@/lib/select-options'
import { isValidIBAN } from '@/lib/finance-utils'
import { Account, AccountType } from '@/types/finance'

export default function EditAccountPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [originalAccount, setOriginalAccount] = useState<Account | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'bank' as AccountType,
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

  useEffect(() => {
    const fetchAccount = async () => {
      setIsLoading(true)
      try {
        // TODO: Replace with actual API call
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
            accountNumber: '1234567890',
            iban: 'EG380021000000012345678901234',
            swiftCode: 'CIBEEGCX',
            branch: 'New Cairo Branch',
            accountHolder: 'MasHub Ltd'
          },
          isActive: true,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-03-10'),
          lastReconciledAt: new Date('2024-03-01')
        }

        setOriginalAccount(mockAccount)
        setFormData({
          name: mockAccount.name,
          description: mockAccount.description || '',
          type: mockAccount.type,
          isActive: mockAccount.isActive,
          bankName: mockAccount.bankDetails?.bankName || '',
          accountNumber: mockAccount.bankDetails?.accountNumber || '',
          iban: mockAccount.bankDetails?.iban || '',
          swiftCode: mockAccount.bankDetails?.swiftCode || '',
          branch: mockAccount.bankDetails?.branch || '',
          accountHolder: mockAccount.bankDetails?.accountHolder || '',
          pspProvider: (mockAccount.pspDetails?.provider || 'stripe') as any,
          pspAccountId: mockAccount.pspDetails?.accountId || '',
          pspIsLive: mockAccount.pspDetails?.isLive || true
        })
      } catch (error) {
        console.error('Error fetching account:', error)
        setErrors({ fetch: 'Failed to load account. Please try again.' })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAccount()
  }, [params.id])

  const handleChange = (field: string, value: string | boolean) => {
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

    if (!formData.name.trim()) {
      newErrors.name = 'Account name is required'
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

      console.log('Account updated:', formData)
      router.push('/dashboard/finance/accounts')
    } catch (error) {
      console.error('Error updating account:', error)
      setErrors({ submit: 'Failed to update account. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      console.log('Account deleted:', params.id)
      router.push('/dashboard/finance/accounts')
    } catch (error) {
      console.error('Error deleting account:', error)
      setErrors({ delete: 'Failed to delete account. It may have associated transactions.' })
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
          <p className="text-gray-400">Loading account...</p>
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
            href="/dashboard/finance/accounts"
            className="text-purple-400 hover:text-purple-300 mt-4 inline-block"
          >
            Back to Accounts
          </Link>
        </div>
      </div>
    )
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
              Edit Account
            </h1>
            <p className="text-gray-400">
              Update account details and settings
            </p>
          </div>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Account
          </button>
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
              <h3 className="text-xl font-semibold text-white">Delete Account</h3>
            </div>
            <p className="text-gray-300 mb-6">
              Are you sure you want to delete <strong>{originalAccount?.name}</strong>? This action cannot be undone.
              All transactions in this account will be preserved but the account will be removed.
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
            {errors.delete && (
              <p className="text-red-400 text-sm mt-4">{errors.delete}</p>
            )}
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

        {/* Account Info (Read-Only) */}
        {originalAccount && (
          <div className="mb-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-300">
                <p className="mb-2">
                  <strong className="text-white">Currency:</strong> {originalAccount.currency} (cannot be changed)
                </p>
                <p className="mb-2">
                  <strong className="text-white">Current Balance:</strong> {originalAccount.currency} {originalAccount.balance.toFixed(2)}
                </p>
                <p>
                  <strong className="text-white">Initial Balance:</strong> {originalAccount.currency} {originalAccount.initialBalance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

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
                required
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
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
              />
            </div>

            {/* Account Type (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Account Type
              </label>
              <input
                type="text"
                value={accountTypeOptions.find(opt => opt.value === formData.type)?.label || formData.type}
                disabled
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-500 cursor-not-allowed"
              />
              <p className="text-gray-400 text-sm mt-2">
                Account type cannot be changed after creation
              </p>
            </div>
          </div>
        </div>

        {/* Bank Details (conditional) */}
        {needsBankDetails && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-6">Bank Details</h2>

            <div className="space-y-6">
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
                  required={needsBankDetails}
                />
                {errors.bankName && <p className="text-red-400 text-sm mt-1">{errors.bankName}</p>}
              </div>

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
                  required={needsBankDetails}
                />
                {errors.accountNumber && <p className="text-red-400 text-sm mt-1">{errors.accountNumber}</p>}
              </div>

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
                />
              </div>

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
                />
                {errors.iban && <p className="text-red-400 text-sm mt-1">{errors.iban}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="swiftCode" className="block text-sm font-medium text-gray-300 mb-2">
                    SWIFT/BIC Code
                  </label>
                  <input
                    type="text"
                    id="swiftCode"
                    value={formData.swiftCode}
                    onChange={(e) => handleChange('swiftCode', e.target.value.toUpperCase())}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label htmlFor="branch" className="block text-sm font-medium text-gray-300 mb-2">
                    Branch
                  </label>
                  <input
                    type="text"
                    id="branch"
                    value={formData.branch}
                    onChange={(e) => handleChange('branch', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PSP Details (conditional) */}
        {needsPSPDetails && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-6">PSP Details</h2>

            <div className="space-y-6">
              <div>
                <Select
                  label="Provider"
                  options={pspProviderOptions}
                  value={formData.pspProvider}
                  onChange={(value) => handleChange('pspProvider', value)}
                  required
                />
              </div>

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
                  required={needsPSPDetails}
                />
                {errors.pspAccountId && <p className="text-red-400 text-sm mt-1">{errors.pspAccountId}</p>}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="pspIsLive"
                  checked={formData.pspIsLive}
                  onChange={(e) => handleChange('pspIsLive', e.target.checked)}
                  className="w-4 h-4 text-purple-600 bg-gray-900 border-gray-700 rounded focus:ring-purple-500"
                />
                <label htmlFor="pspIsLive" className="text-gray-300">
                  Production/Live Mode
                </label>
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
                Deactivating prevents this account from being used in new transactions
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
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
