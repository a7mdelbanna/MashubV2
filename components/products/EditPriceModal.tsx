'use client'

import { useState, useEffect } from 'react'
import { X, Save, Plus, Trash2, DollarSign, Percent, TrendingUp } from 'lucide-react'

interface PricingTier {
  id: string
  name: string
  minQuantity: number
  maxQuantity: number | null
  discount: number
  price: number
}

interface ProductVariant {
  id: string
  productId: string
  productName: string
  sku: string
  variantName: string
  basePrice: number
  currentPrice: number
  cost: number
  margin: number
  stockLevel: number
  pricingTiers: PricingTier[]
  status: 'active' | 'inactive'
}

interface EditPriceModalProps {
  isOpen: boolean
  variant: ProductVariant | null
  onClose: () => void
  onUpdate: () => void
}

export default function EditPriceModal({ isOpen, variant, onClose, onUpdate }: EditPriceModalProps) {
  const [formData, setFormData] = useState({
    basePrice: 0,
    currentPrice: 0,
    cost: 0,
    reason: ''
  })
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (variant) {
      setFormData({
        basePrice: variant.basePrice,
        currentPrice: variant.currentPrice,
        cost: variant.cost,
        reason: ''
      })
      setPricingTiers(variant.pricingTiers)
    }
  }, [variant])

  if (!isOpen || !variant) return null

  const calculateMargin = (price: number, cost: number) => {
    if (cost === 0) return 0
    return ((price - cost) / price * 100).toFixed(1)
  }

  const margin = calculateMargin(formData.currentPrice, formData.cost)

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (formData.basePrice <= 0) {
      newErrors.basePrice = 'Base price must be greater than 0'
    }

    if (formData.currentPrice <= 0) {
      newErrors.currentPrice = 'Current price must be greater than 0'
    }

    if (formData.cost < 0) {
      newErrors.cost = 'Cost cannot be negative'
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'Please provide a reason for the price change'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    // Here you would save the price changes
    console.log('Updating price:', { variantId: variant.id, ...formData, pricingTiers })

    onUpdate()
    onClose()
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const addTier = () => {
    const newTier: PricingTier = {
      id: `tier_${Date.now()}`,
      name: `Volume ${pricingTiers.length + 1}`,
      minQuantity: pricingTiers.length > 0 ? (pricingTiers[pricingTiers.length - 1].maxQuantity || 0) + 1 : 1,
      maxQuantity: null,
      discount: 0,
      price: formData.currentPrice
    }
    setPricingTiers([...pricingTiers, newTier])
  }

  const removeTier = (id: string) => {
    setPricingTiers(pricingTiers.filter(t => t.id !== id))
  }

  const updateTier = (id: string, field: string, value: any) => {
    setPricingTiers(pricingTiers.map(tier => {
      if (tier.id === id) {
        const updatedTier = { ...tier, [field]: value }

        // Auto-calculate price based on discount
        if (field === 'discount') {
          updatedTier.price = formData.currentPrice * (1 - value / 100)
        }

        return updatedTier
      }
      return tier
    }))
  }

  const isOnSale = formData.currentPrice < formData.basePrice
  const discount = isOnSale ? (((formData.basePrice - formData.currentPrice) / formData.basePrice) * 100).toFixed(1) : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4 bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <div>
            <h2 className="text-xl font-bold text-white">Edit Pricing</h2>
            <p className="text-sm text-gray-400">
              {variant.productName} - {variant.variantName} ({variant.sku})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Current Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
              <p className="text-sm text-gray-400 mb-1">Current Margin</p>
              <p className="text-2xl font-bold text-green-400">{variant.margin.toFixed(1)}%</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
              <p className="text-sm text-gray-400 mb-1">Stock Level</p>
              <p className="text-2xl font-bold text-white">
                {variant.stockLevel > 0 ? variant.stockLevel : 'Digital'}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
              <p className="text-sm text-gray-400 mb-1">Status</p>
              <p className="text-2xl font-bold text-purple-400 capitalize">{variant.status}</p>
            </div>
          </div>

          {/* Basic Pricing */}
          <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Basic Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Base Price <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.basePrice}
                    onChange={(e) => handleChange('basePrice', parseFloat(e.target.value))}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border ${
                      errors.basePrice ? 'border-red-500' : 'border-gray-700'
                    } text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all`}
                    placeholder="0.00"
                  />
                </div>
                {errors.basePrice && (
                  <p className="mt-1 text-xs text-red-400">{errors.basePrice}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Current/Sale Price <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.currentPrice}
                    onChange={(e) => handleChange('currentPrice', parseFloat(e.target.value))}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border ${
                      errors.currentPrice ? 'border-red-500' : 'border-gray-700'
                    } text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all`}
                    placeholder="0.00"
                  />
                </div>
                {errors.currentPrice && (
                  <p className="mt-1 text-xs text-red-400">{errors.currentPrice}</p>
                )}
                {isOnSale && (
                  <p className="mt-1 text-xs text-orange-400">
                    {discount}% discount from base price
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Cost
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => handleChange('cost', parseFloat(e.target.value))}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border ${
                      errors.cost ? 'border-red-500' : 'border-gray-700'
                    } text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all`}
                    placeholder="0.00"
                  />
                </div>
                {errors.cost && (
                  <p className="mt-1 text-xs text-red-400">{errors.cost}</p>
                )}
              </div>

              <div className="flex items-end">
                <div className="flex-1 bg-gray-800/50 rounded-xl border border-gray-700 p-4">
                  <p className="text-sm text-gray-400 mb-1">New Margin</p>
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`h-5 w-5 ${parseFloat(margin) >= variant.margin ? 'text-green-400' : 'text-red-400'}`} />
                    <p className={`text-2xl font-bold ${parseFloat(margin) >= variant.margin ? 'text-green-400' : 'text-red-400'}`}>
                      {margin}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Tiers */}
          <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-300">Volume Pricing Tiers</h3>
              <button
                type="button"
                onClick={addTier}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Tier
              </button>
            </div>

            {pricingTiers.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                No volume pricing tiers. Add tiers to offer discounts for bulk purchases.
              </p>
            ) : (
              <div className="space-y-3">
                {pricingTiers.map((tier, index) => (
                  <div key={tier.id} className="bg-gray-900/50 rounded-lg border border-gray-700 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-sm font-medium text-white">Tier {index + 1}</p>
                      <button
                        type="button"
                        onClick={() => removeTier(tier.id)}
                        className="p-1 rounded hover:bg-red-600 text-gray-400 hover:text-white transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Name</label>
                        <input
                          type="text"
                          value={tier.name}
                          onChange={(e) => updateTier(tier.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Min Qty</label>
                        <input
                          type="number"
                          value={tier.minQuantity}
                          onChange={(e) => updateTier(tier.id, 'minQuantity', parseInt(e.target.value))}
                          className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Max Qty</label>
                        <input
                          type="number"
                          value={tier.maxQuantity || ''}
                          onChange={(e) => updateTier(tier.id, 'maxQuantity', e.target.value ? parseInt(e.target.value) : null)}
                          className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                          placeholder="∞"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Discount %</label>
                        <div className="relative">
                          <input
                            type="number"
                            step="0.1"
                            value={tier.discount}
                            onChange={(e) => updateTier(tier.id, 'discount', parseFloat(e.target.value))}
                            className="w-full pl-3 pr-7 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm focus:border-purple-500 focus:outline-none"
                          />
                          <Percent className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Price</label>
                        <div className="relative">
                          <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input
                            type="number"
                            step="0.01"
                            value={tier.price.toFixed(2)}
                            readOnly
                            className="w-full pl-7 pr-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-400 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reason for Change */}
          <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-6">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Change Reason</h3>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Reason for Price Change <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                rows={3}
                className={`w-full px-4 py-3 rounded-xl bg-gray-800/50 border ${
                  errors.reason ? 'border-red-500' : 'border-gray-700'
                } text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none`}
                placeholder="e.g., Seasonal promotion, Competitive adjustment, Cost increase..."
              />
              {errors.reason && (
                <p className="mt-1 text-xs text-red-400">{errors.reason}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-colors flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Update Pricing</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
