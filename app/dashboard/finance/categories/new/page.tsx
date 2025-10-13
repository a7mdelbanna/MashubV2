'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'
import Select from '@/components/ui/select'
import { Category } from '@/types/finance'
import { isValidAmount } from '@/lib/finance-utils'

const categoryTypeOptions = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' }
]

const budgetPeriodOptions = [
  { value: '', label: 'No Budget' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'annual', label: 'Annual' }
]

export default function NewCategoryPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: '',
    type: 'expense',
    parentId: '',
    description: '',
    budgetAmount: '',
    budgetPeriod: '',
    order: '',
    isActive: true
  })

  // Mock data - TODO: Replace with API calls
  const existingCategories: Category[] = [
    { id: '1', tenantId: 'tenant1', name: 'Services', type: 'income', path: 'Income/Services', level: 1, order: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: '2', tenantId: 'tenant1', name: 'Development', type: 'income', parentId: '1', path: 'Income/Services/Development', level: 2, order: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: '3', tenantId: 'tenant1', name: 'Products', type: 'income', path: 'Income/Products', level: 1, order: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: '4', tenantId: 'tenant1', name: 'Office', type: 'expense', path: 'Expense/Office', level: 1, order: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: '5', tenantId: 'tenant1', name: 'Rent', type: 'expense', parentId: '4', path: 'Expense/Office/Rent', level: 2, order: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: '6', tenantId: 'tenant1', name: 'Salaries', type: 'expense', path: 'Expense/Salaries', level: 1, order: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { id: '7', tenantId: 'tenant1', name: 'Marketing', type: 'expense', path: 'Expense/Marketing', level: 1, order: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() }
  ]

  // Filter parent categories by selected type
  const filteredParentCategories = existingCategories.filter(cat => cat.type === formData.type)

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }

      // Reset parent when type changes
      if (field === 'type') {
        updated.parentId = ''
      }

      // Clear budget period if no budget amount
      if (field === 'budgetAmount' && !value) {
        updated.budgetPeriod = ''
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

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required'
    }

    if (!formData.type) {
      newErrors.type = 'Category type is required'
    }

    if (formData.budgetAmount) {
      if (!isValidAmount(parseFloat(formData.budgetAmount))) {
        newErrors.budgetAmount = 'Invalid budget amount'
      }
      if (!formData.budgetPeriod) {
        newErrors.budgetPeriod = 'Budget period is required when budget amount is set'
      }
    }

    if (formData.order && isNaN(parseInt(formData.order))) {
      newErrors.order = 'Invalid order number'
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

      console.log('Category created:', formData)

      // Redirect to categories list
      router.push('/dashboard/finance/categories')
    } catch (error) {
      console.error('Error creating category:', error)
      setErrors({ submit: 'Failed to create category. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/finance/categories"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Categories
        </Link>
        <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
          New Category
        </h1>
        <p className="text-gray-400">
          Create a new income or expense category
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
                <strong className="text-white">Nested Categories:</strong> You can create subcategories by selecting a parent category. For example, "Rent" can be a subcategory of "Office".
              </p>
              <p>
                <strong className="text-white">Budgets:</strong> Set budgets at any category level. Budget tracking includes all subcategories.
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>

          <div className="space-y-6">
            {/* Category Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Category Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errors.name ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="e.g., Office Rent, Consulting Services"
                required
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Category Type */}
            <Select
              label="Category Type"
              options={categoryTypeOptions}
              value={formData.type}
              onChange={(value) => handleChange('type', value)}
              required
              error={errors.type}
            />

            {/* Parent Category */}
            <Select
              label="Parent Category (Optional)"
              options={[
                { value: '', label: 'None - Top Level Category' },
                ...filteredParentCategories.map(cat => ({ value: cat.id, label: cat.path }))
              ]}
              value={formData.parentId}
              onChange={(value) => handleChange('parentId', value)}
              placeholder="Select parent category..."
            />

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
                placeholder="Brief description of this category..."
              />
            </div>
          </div>
        </div>

        {/* Budget Settings */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Budget Settings (Optional)</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Budget Amount */}
            <div>
              <label htmlFor="budgetAmount" className="block text-sm font-medium text-gray-300 mb-2">
                Budget Amount
              </label>
              <input
                type="text"
                id="budgetAmount"
                value={formData.budgetAmount}
                onChange={(e) => handleChange('budgetAmount', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errors.budgetAmount ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="0.00"
              />
              {errors.budgetAmount && <p className="text-red-400 text-sm mt-1">{errors.budgetAmount}</p>}
              <p className="text-gray-400 text-xs mt-1">Leave empty if no budget tracking needed</p>
            </div>

            {/* Budget Period */}
            <Select
              label="Budget Period"
              options={budgetPeriodOptions}
              value={formData.budgetPeriod}
              onChange={(value) => handleChange('budgetPeriod', value)}
              error={errors.budgetPeriod}
              disabled={!formData.budgetAmount}
            />
          </div>

          {formData.budgetAmount && formData.budgetPeriod && (
            <div className="mt-4 bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-400 text-sm">
                Budget: <strong>{parseFloat(formData.budgetAmount).toFixed(2)}</strong> per <strong>{formData.budgetPeriod}</strong> period
              </p>
            </div>
          )}
        </div>

        {/* Display Settings */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6">Display Settings</h2>

          <div className="space-y-4">
            {/* Order */}
            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-300 mb-2">
                Display Order (Optional)
              </label>
              <input
                type="text"
                id="order"
                value={formData.order}
                onChange={(e) => handleChange('order', e.target.value)}
                className={`w-full px-4 py-2 bg-gray-900 border ${
                  errors.order ? 'border-red-500' : 'border-gray-700'
                } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                placeholder="e.g., 1, 2, 3"
              />
              {errors.order && <p className="text-red-400 text-sm mt-1">{errors.order}</p>}
              <p className="text-gray-400 text-xs mt-1">Lower numbers appear first. Leave empty for automatic ordering.</p>
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
                  Active categories can be used in new transactions. Inactive categories are hidden from selection.
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
            <span>{isSubmitting ? 'Creating...' : 'Create Category'}</span>
          </button>
          <Link
            href="/dashboard/finance/categories"
            className="px-6 py-3 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
