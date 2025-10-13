'use client'

import { useState } from 'react'
import { TrendingUp, DollarSign, Package, Users, BarChart3, ArrowUp, ArrowDown } from 'lucide-react'

const mockAnalytics = {
  overview: {
    totalProducts: 98,
    activeProducts: 87,
    totalRevenue: 2640000,
    avgPrice: 425,
    topSelling: 'Enterprise License',
    revenueGrowth: 18.5
  },
  salesByCategory: [
    { category: 'Software', sales: 1240000, units: 2840, growth: 22.3 },
    { category: 'Services', sales: 845000, units: 1560, growth: 15.8 },
    { category: 'Hardware', sales: 555000, units: 980, growth: -5.2 }
  ],
  topProducts: [
    { name: 'Enterprise License', revenue: 485000, units: 1623, growth: 24.5 },
    { name: 'Professional Services', revenue: 425000, units: 892, growth: 18.2 },
    { name: 'Cloud Storage', revenue: 380000, units: 7755, growth: 31.8 }
  ],
  monthlyTrends: [
    { month: 'Jul', revenue: 195000, units: 4200 },
    { month: 'Aug', revenue: 215000, units: 4580 },
    { month: 'Sep', revenue: 225000, units: 4820 },
    { month: 'Oct', revenue: 242000, units: 5140 },
    { month: 'Nov', revenue: 268000, units: 5680 },
    { month: 'Dec', revenue: 285000, units: 6020 }
  ]
}

export default function ProductAnalyticsPage() {
  const [dateRange, setDateRange] = useState('last_6_months')

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Product Analytics</h1>
          <p className="text-gray-400">Sales performance and product insights</p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
        >
          <option value="last_30_days">Last 30 days</option>
          <option value="last_3_months">Last 3 months</option>
          <option value="last_6_months">Last 6 months</option>
          <option value="this_year">This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-5 gap-4 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{mockAnalytics.overview.totalProducts}</p>
          <p className="text-sm text-gray-400">Total Products</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="flex items-center gap-1 text-sm text-green-400">
              <ArrowUp className="w-4 h-4" />
              {mockAnalytics.overview.revenueGrowth}%
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            ${(mockAnalytics.overview.totalRevenue / 1000000).toFixed(1)}M
          </p>
          <p className="text-sm text-gray-400">Revenue</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">${mockAnalytics.overview.avgPrice}</p>
          <p className="text-sm text-gray-400">Avg Price</p>
        </div>

        <div className="col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-xl font-bold text-white mb-1">{mockAnalytics.overview.topSelling}</p>
          <p className="text-sm text-gray-400">Top Selling Product</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Monthly Revenue Trend</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {mockAnalytics.monthlyTrends.map((data) => {
              const maxRevenue = Math.max(...mockAnalytics.monthlyTrends.map(d => d.revenue))
              const height = (data.revenue / maxRevenue) * 100
              return (
                <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-purple-500 rounded-t hover:bg-purple-600 transition-colors relative group"
                    style={{ height: `${height}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ${(data.revenue / 1000).toFixed(0)}k
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{data.month}</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Products</h3>
          <div className="space-y-4">
            {mockAnalytics.topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{product.name}</p>
                  <p className="text-sm text-gray-400">{product.units} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">${(product.revenue / 1000).toFixed(0)}k</p>
                  <p className="text-sm text-green-400">+{product.growth}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Sales by Category</h3>
        <div className="space-y-4">
          {mockAnalytics.salesByCategory.map((cat) => (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">{cat.category}</span>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-400">{cat.units} units</span>
                  <span className="text-white">${(cat.sales / 1000).toFixed(0)}k</span>
                  <span className={cat.growth > 0 ? 'text-green-400' : 'text-red-400'}>
                    {cat.growth > 0 ? '+' : ''}{cat.growth}%
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${(cat.sales / mockAnalytics.overview.totalRevenue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
