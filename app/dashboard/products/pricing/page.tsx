'use client'

import { useState } from 'react'
import { DollarSign, Plus, TrendingUp, Package, Tag, Edit2, Copy, AlertCircle, Check } from 'lucide-react'

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

const mockVariants: ProductVariant[] = [
  {
    id: 'v1',
    productId: 'p1',
    productName: 'Enterprise License',
    sku: 'ENT-001-STD',
    variantName: 'Standard',
    basePrice: 299,
    currentPrice: 299,
    cost: 150,
    margin: 49.8,
    stockLevel: 150,
    status: 'active',
    pricingTiers: [
      { id: 't1', name: 'Volume 10+', minQuantity: 10, maxQuantity: 49, discount: 10, price: 269 },
      { id: 't2', name: 'Volume 50+', minQuantity: 50, maxQuantity: 99, discount: 15, price: 254 },
      { id: 't3', name: 'Volume 100+', minQuantity: 100, maxQuantity: null, discount: 20, price: 239 }
    ]
  },
  {
    id: 'v2',
    productId: 'p1',
    productName: 'Enterprise License',
    sku: 'ENT-001-PRO',
    variantName: 'Professional',
    basePrice: 499,
    currentPrice: 449,
    cost: 250,
    margin: 44.3,
    stockLevel: 85,
    status: 'active',
    pricingTiers: [
      { id: 't4', name: 'Volume 10+', minQuantity: 10, maxQuantity: 49, discount: 10, price: 404 },
      { id: 't5', name: 'Volume 50+', minQuantity: 50, maxQuantity: null, discount: 15, price: 382 }
    ]
  },
  {
    id: 'v3',
    productId: 'p2',
    productName: 'Cloud Storage',
    sku: 'CLD-001-100GB',
    variantName: '100GB Plan',
    basePrice: 49,
    currentPrice: 49,
    cost: 15,
    margin: 69.4,
    stockLevel: 0,
    status: 'active',
    pricingTiers: [
      { id: 't6', name: 'Annual', minQuantity: 12, maxQuantity: null, discount: 20, price: 39 }
    ]
  },
  {
    id: 'v4',
    productId: 'p2',
    productName: 'Cloud Storage',
    sku: 'CLD-001-1TB',
    variantName: '1TB Plan',
    basePrice: 99,
    currentPrice: 99,
    cost: 30,
    margin: 69.7,
    stockLevel: 0,
    status: 'active',
    pricingTiers: [
      { id: 't7', name: 'Annual', minQuantity: 12, maxQuantity: null, discount: 25, price: 74 }
    ]
  },
  {
    id: 'v5',
    productId: 'p3',
    productName: 'Hardware Device',
    sku: 'HW-001-BLK',
    variantName: 'Black',
    basePrice: 599,
    currentPrice: 549,
    cost: 350,
    margin: 36.2,
    stockLevel: 15,
    status: 'active',
    pricingTiers: []
  },
  {
    id: 'v6',
    productId: 'p3',
    productName: 'Hardware Device',
    sku: 'HW-001-WHT',
    variantName: 'White',
    basePrice: 599,
    currentPrice: 549,
    cost: 350,
    margin: 36.2,
    stockLevel: 8,
    status: 'active',
    pricingTiers: []
  }
]

interface PriceChange {
  id: string
  variantId: string
  productName: string
  variantName: string
  oldPrice: number
  newPrice: number
  changePercent: number
  reason: string
  effectiveDate: string
  createdBy: string
}

const mockPriceHistory: PriceChange[] = [
  {
    id: 'ph1',
    variantId: 'v2',
    productName: 'Enterprise License',
    variantName: 'Professional',
    oldPrice: 499,
    newPrice: 449,
    changePercent: -10,
    reason: 'Promotional pricing for Q4',
    effectiveDate: '2024-10-01',
    createdBy: 'John Smith'
  },
  {
    id: 'ph2',
    variantId: 'v5',
    productName: 'Hardware Device',
    variantName: 'Black',
    oldPrice: 599,
    newPrice: 549,
    changePercent: -8.3,
    reason: 'Competitive price adjustment',
    effectiveDate: '2024-11-15',
    createdBy: 'Sarah Johnson'
  }
]

export default function PricingPage() {
  const [variants, setVariants] = useState<ProductVariant[]>(mockVariants)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [priceHistory] = useState<PriceChange[]>(mockPriceHistory)
  const [showPriceModal, setShowPriceModal] = useState(false)

  const stats = {
    totalVariants: variants.length,
    avgMargin: variants.reduce((sum, v) => sum + v.margin, 0) / variants.length,
    totalValue: variants.reduce((sum, v) => sum + (v.currentPrice * v.stockLevel), 0),
    discountedItems: variants.filter(v => v.currentPrice < v.basePrice).length
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Pricing & Variants</h1>
          <p className="text-gray-400">Manage product pricing, variants, and discounts</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
          Add Variant
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.totalVariants}</p>
          <p className="text-sm text-gray-400">Total Variants</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.avgMargin.toFixed(1)}%</p>
          <p className="text-sm text-gray-400">Avg Margin</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">${(stats.totalValue / 1000).toFixed(0)}k</p>
          <p className="text-sm text-gray-400">Inventory Value</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Tag className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.discountedItems}</p>
          <p className="text-sm text-gray-400">Discounted Items</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Product Variants</h3>
            <div className="space-y-3">
              {variants.map((variant) => (
                <div
                  key={variant.id}
                  className="bg-gray-900/50 rounded-lg p-4 hover:bg-gray-700/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedVariant(variant)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-white">{variant.productName}</h4>
                        <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-medium">
                          {variant.variantName}
                        </span>
                        {variant.currentPrice < variant.basePrice && (
                          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-medium">
                            On Sale
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">SKU: {variant.sku}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedVariant(variant)
                          setShowPriceModal(true)
                        }}
                        className="p-2 bg-gray-700 hover:bg-purple-600 text-white rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                        className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-4 text-sm">
                    <div>
                      <p className="text-gray-400 mb-1">Base Price</p>
                      <p className="font-medium text-white">${variant.basePrice}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Current Price</p>
                      <p className="font-medium text-white">${variant.currentPrice}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Cost</p>
                      <p className="font-medium text-white">${variant.cost}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Margin</p>
                      <p className="font-medium text-green-400">{variant.margin.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-400 mb-1">Stock</p>
                      <p className="font-medium text-white">
                        {variant.stockLevel > 0 ? variant.stockLevel : 'Digital'}
                      </p>
                    </div>
                  </div>

                  {variant.pricingTiers.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-700">
                      <p className="text-xs text-gray-400 mb-2">Volume Pricing Tiers:</p>
                      <div className="flex flex-wrap gap-2">
                        {variant.pricingTiers.map((tier) => (
                          <div
                            key={tier.id}
                            className="px-3 py-1 bg-gray-700 rounded-full text-xs text-gray-300"
                          >
                            {tier.name}: ${tier.price} ({tier.discount}% off)
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Price History</h3>
            <div className="space-y-3">
              {priceHistory.map((change) => (
                <div key={change.id} className="bg-gray-900/50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-white text-sm">{change.productName}</h4>
                      <p className="text-xs text-gray-400">{change.variantName}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        change.changePercent < 0
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {change.changePercent > 0 ? '+' : ''}
                      {change.changePercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2 text-sm">
                    <span className="text-gray-400 line-through">${change.oldPrice}</span>
                    <span className="text-white font-medium">${change.newPrice}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{change.reason}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(change.effectiveDate).toLocaleDateString()}</span>
                    <span>by {change.createdBy}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedVariant && (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Pricing Calculator</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Selected Variant</label>
                  <p className="text-white font-medium">
                    {selectedVariant.productName} - {selectedVariant.variantName}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Quantity</label>
                  <input
                    type="number"
                    defaultValue="1"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="p-4 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Base Price</span>
                    <span className="text-white">${selectedVariant.currentPrice}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Discount</span>
                    <span className="text-green-400">-$0</span>
                  </div>
                  <div className="pt-2 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">Total</span>
                      <span className="text-lg font-bold text-white">
                        ${selectedVariant.currentPrice}
                      </span>
                    </div>
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                  <Check className="w-4 h-4" />
                  Apply Pricing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Pricing Recommendations</h3>
        </div>
        <div className="space-y-3">
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-400 mb-1">
              <strong>Low Margin Alert:</strong> Hardware Device variants have margins below 40%
            </p>
            <p className="text-xs text-gray-400">
              Consider reviewing supplier costs or adjusting pricing strategy
            </p>
          </div>
          <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-400 mb-1">
              <strong>Pricing Opportunity:</strong> Cloud Storage annual plans show high conversion
            </p>
            <p className="text-xs text-gray-400">
              Consider creating similar annual discounts for other subscription products
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
