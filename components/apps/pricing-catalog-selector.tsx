'use client'

import { useState } from 'react'
import { PricingCatalogItem } from '@/types'
import { cn } from '@/lib/utils'
import {
  DollarSign, Check, Star, Package, Users,
  TrendingUp, Calendar, Edit, Plus, X
} from 'lucide-react'

interface PricingCatalogSelectorProps {
  catalog: PricingCatalogItem[]
  selectedItemId?: string
  onSelect: (itemId: string) => void
  onCreateCustom?: () => void
  showUsageStats?: boolean
  className?: string
}

function PricingCard({
  item,
  isSelected,
  onSelect,
  showUsageStats
}: {
  item: PricingCatalogItem
  isSelected: boolean
  onSelect: () => void
  showUsageStats?: boolean
}) {
  const isPopular = item.appsUsing >= 2

  return (
    <button
      onClick={onSelect}
      className={cn(
        'relative w-full rounded-2xl border-2 p-6 text-left transition-all duration-150',
        'hover:shadow-lg hover:scale-[1.02]',
        isSelected
          ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
          : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
      )}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-xs font-bold text-white flex items-center gap-1 shadow-lg">
          <Star className="h-3 w-3 fill-current" />
          Popular
        </div>
      )}

      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
          <Check className="h-4 w-4 text-white" />
        </div>
      )}

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Package className={cn(
            'h-5 w-5',
            isSelected ? 'text-purple-400' : 'text-gray-400'
          )} />
          <h3 className={cn(
            'text-lg font-bold',
            isSelected ? 'text-purple-400' : 'text-white'
          )}>
            {item.name}
          </h3>
        </div>
        {item.description && (
          <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
        )}
      </div>

      {/* Price */}
      <div className="mb-4 pb-4 border-b border-gray-700">
        <div className="flex items-baseline gap-2">
          <span className={cn(
            'text-3xl font-bold',
            isSelected ? 'text-purple-400' : 'text-white'
          )}>
            ${item.pricing.amount.toLocaleString()}
          </span>
          <span className="text-gray-400 text-sm">
            {item.pricing.currency}
            {item.pricing.interval && ` / ${item.pricing.interval}`}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1 capitalize">
          {item.pricing.model.replace('_', ' ')} pricing
        </p>
      </div>

      {/* Features */}
      <div className="mb-4">
        <p className="text-xs font-medium text-gray-400 mb-2">Features included:</p>
        <ul className="space-y-2">
          {item.features.slice(0, 5).map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className={cn(
                'h-4 w-4 flex-shrink-0 mt-0.5',
                isSelected ? 'text-purple-400' : 'text-green-400'
              )} />
              <span className="text-gray-300">{feature}</span>
            </li>
          ))}
          {item.features.length > 5 && (
            <li className="text-xs text-gray-500 pl-6">
              +{item.features.length - 5} more features
            </li>
          )}
        </ul>
      </div>

      {/* Limits */}
      {item.limits && (
        <div className="mb-4 p-3 rounded-lg bg-gray-900/50 border border-gray-700/50">
          <p className="text-xs font-medium text-gray-400 mb-2">Resource Limits:</p>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(item.limits).map(([key, value]) => {
              if (value === undefined) return null
              return (
                <div key={key} className="text-xs">
                  <span className="text-gray-500 capitalize">{key.replace('_', ' ')}:</span>
                  <span className="ml-1 text-white font-medium">
                    {value === -1 ? 'Unlimited' : value.toLocaleString()}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Usage Stats */}
      {showUsageStats && item.appsUsing > 0 && (
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Users className="h-3.5 w-3.5" />
          <span>{item.appsUsing} app{item.appsUsing !== 1 ? 's' : ''} using this plan</span>
        </div>
      )}

      {/* Migration Note */}
      {item.migratedFrom && (
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <p className="text-xs text-gray-500">
            Migrated from: <span className="text-gray-400">{item.migratedFrom.serviceName}</span>
          </p>
        </div>
      )}
    </button>
  )
}

export function PricingCatalogSelector({
  catalog,
  selectedItemId,
  onSelect,
  onCreateCustom,
  showUsageStats = true,
  className
}: PricingCatalogSelectorProps) {
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  // Get unique categories
  const categories = ['all', ...new Set(catalog.map(item => item.category))]

  // Filter by category
  const filteredCatalog = categoryFilter === 'all'
    ? catalog
    : catalog.filter(item => item.category === categoryFilter)

  // Sort by popularity (apps using) and price
  const sortedCatalog = [...filteredCatalog].sort((a, b) => {
    // Popular items first
    if (a.appsUsing !== b.appsUsing) {
      return b.appsUsing - a.appsUsing
    }
    // Then by price
    return a.pricing.amount - b.pricing.amount
  })

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Pricing Catalog</h3>
            <p className="text-sm text-gray-400">
              Select a package or create custom pricing
            </p>
          </div>
        </div>

        {onCreateCustom && (
          <button
            onClick={onCreateCustom}
            className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm font-medium hover:bg-gray-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Custom Package
          </button>
        )}
      </div>

      {/* Category Filters */}
      {categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setCategoryFilter(category)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                categoryFilter === category
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
              )}
            >
              {category === 'all' ? 'All Categories' : category}
              {category !== 'all' && (
                <span className="ml-2 text-xs opacity-60">
                  ({catalog.filter(item => item.category === category).length})
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Pricing Cards */}
      {sortedCatalog.length === 0 ? (
        <div className="rounded-2xl bg-gray-800/30 border border-gray-700/50 p-12 text-center">
          <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-white mb-2">No Packages Available</h4>
          <p className="text-sm text-gray-400 mb-4">
            {categoryFilter !== 'all'
              ? `No packages found in the "${categoryFilter}" category`
              : 'No packages have been added to the catalog yet'}
          </p>
          {onCreateCustom && (
            <button
              onClick={onCreateCustom}
              className="px-4 py-2 rounded-xl gradient-purple text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Create First Package
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCatalog.map((item) => (
            <PricingCard
              key={item.id}
              item={item}
              isSelected={selectedItemId === item.id}
              onSelect={() => onSelect(item.id)}
              showUsageStats={showUsageStats}
            />
          ))}
        </div>
      )}

      {/* Selected Package Info */}
      {selectedItemId && (
        <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4">
          <div className="flex items-start gap-3">
            <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-green-400 font-medium mb-1">Package Selected</p>
              <p className="text-xs text-gray-400">
                {sortedCatalog.find(item => item.id === selectedItemId)?.name} has been selected for this app.
                You can modify pricing details or features specific to this app in the next step.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Footer */}
      {showUsageStats && catalog.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl bg-gray-800/30 border border-gray-700/50 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Package className="h-4 w-4 text-purple-400" />
              <span className="text-xs text-gray-500">Total Packages</span>
            </div>
            <p className="text-2xl font-bold text-white">{catalog.length}</p>
          </div>

          <div className="rounded-xl bg-gray-800/30 border border-gray-700/50 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-blue-400" />
              <span className="text-xs text-gray-500">Apps Using</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {catalog.reduce((sum, item) => sum + item.appsUsing, 0)}
            </p>
          </div>

          <div className="rounded-xl bg-gray-800/30 border border-gray-700/50 p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-400" />
              <span className="text-xs text-gray-500">Avg. Price</span>
            </div>
            <p className="text-2xl font-bold text-white">
              ${Math.round(catalog.reduce((sum, item) => sum + item.pricing.amount, 0) / catalog.length).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
