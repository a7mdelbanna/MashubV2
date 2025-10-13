'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Power, PowerOff, RefreshCw, Star, TrendingUp, Calendar } from 'lucide-react'
import { Currency } from '@/types/finance'
import { formatDate } from '@/lib/finance-utils'

export default function CurrenciesPage() {
  // Mock data - will be replaced with actual API calls
  const [currencies, setCurrencies] = useState<Currency[]>([
    {
      id: '1',
      code: 'EGP',
      name: 'Egyptian Pound',
      symbol: 'E£',
      symbolPosition: 'before',
      decimalPlaces: 2,
      isDefault: true,
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      symbolPosition: 'before',
      decimalPlaces: 2,
      isDefault: false,
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '3',
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      symbolPosition: 'before',
      decimalPlaces: 2,
      isDefault: false,
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '4',
      code: 'SAR',
      name: 'Saudi Riyal',
      symbol: 'SR',
      symbolPosition: 'before',
      decimalPlaces: 2,
      isDefault: false,
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '5',
      code: 'AED',
      name: 'UAE Dirham',
      symbol: 'د.إ',
      symbolPosition: 'before',
      decimalPlaces: 2,
      isDefault: false,
      isActive: false,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    }
  ])

  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleToggleStatus = (id: string) => {
    setCurrencies(currencies.map(c =>
      c.id === id ? { ...c, isActive: !c.isActive, updatedAt: new Date() } : c
    ))
  }

  const handleRefreshRates = async () => {
    setIsRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false)
      // Show success message
    }, 1500)
  }

  const activeCurrencies = currencies.filter(c => c.isActive)
  const inactiveCurrencies = currencies.filter(c => !c.isActive)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
            Currency Management
          </h1>
          <p className="text-gray-400">
            Manage currencies and exchange rates for multi-currency finance operations
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefreshRates}
            disabled={isRefreshing}
            className="px-4 py-2 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Rates'}
          </button>
          <Link
            href="/dashboard/finance/settings/currencies/new"
            className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Currency</span>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Currencies</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{currencies.length}</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Active</span>
            <Power className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{activeCurrencies.length}</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Default Currency</span>
            <Star className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {currencies.find(c => c.isDefault)?.code || 'None'}
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Last Rate Sync</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-sm font-semibold text-white">Just now</p>
        </div>
      </div>

      {/* Active Currencies */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 mb-6">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Power className="w-5 h-5 text-green-400" />
            Active Currencies
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Currency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Decimals
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {activeCurrencies.map((currency) => (
                <tr key={currency.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{currency.name}</span>
                      {currency.isDefault && (
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-300 font-mono font-semibold">
                      {currency.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-300 font-semibold text-lg">
                      {currency.symbol}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-400 capitalize">
                      {currency.symbolPosition}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-300">{currency.decimalPlaces}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                    {formatDate(currency.updatedAt, 'short')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/finance/settings/currencies/${currency.id}/edit`}
                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                        title="Edit Currency"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      {!currency.isDefault && (
                        <button
                          onClick={() => handleToggleStatus(currency.id)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          title="Deactivate Currency"
                        >
                          <PowerOff className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inactive Currencies */}
      {inactiveCurrencies.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <PowerOff className="w-5 h-5 text-red-400" />
              Inactive Currencies
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Currency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Symbol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {inactiveCurrencies.map((currency) => (
                  <tr key={currency.id} className="hover:bg-gray-700/30 transition-colors opacity-60">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-white font-medium">{currency.name}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-300 font-mono font-semibold">
                        {currency.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-300 font-semibold text-lg">
                        {currency.symbol}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-400/10 text-red-400">
                        Inactive
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                      {formatDate(currency.updatedAt, 'short')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/finance/settings/currencies/${currency.id}/edit`}
                          className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                          title="Edit Currency"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(currency.id)}
                          className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                          title="Activate Currency"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          About Currency Management
        </h3>
        <div className="text-gray-300 space-y-2 text-sm">
          <p>
            <strong className="text-white">Default Currency:</strong> Set one currency as default for unified reporting.
            All transactions in other currencies will be converted to the default currency for reports.
          </p>
          <p>
            <strong className="text-white">Exchange Rates:</strong> Rates are automatically fetched from your configured
            FX provider. Click "Refresh Rates" to get the latest rates manually.
          </p>
          <p>
            <strong className="text-white">FX Snapshots:</strong> When a transaction is posted, the current exchange rate
            is locked as an immutable snapshot, ensuring historical reports remain accurate.
          </p>
          <p>
            <strong className="text-white">Activation:</strong> Deactivating a currency prevents it from being selected
            for new transactions, but existing data remains intact.
          </p>
        </div>
      </div>
    </div>
  )
}
