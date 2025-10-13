'use client'

import { useState } from 'react'
import { TrendingUp, DollarSign, Users, Package, Clock, Star, ArrowUp, ArrowDown, BarChart3 } from 'lucide-react'

const mockAnalytics = {
  overview: {
    totalServices: 24,
    activeServices: 18,
    totalRevenue: 887000,
    mrr: 45000,
    arr: 540000,
    activeSubscriptions: 156,
    avgRating: 4.7,
    churnRate: 2.3
  },
  revenueByType: [
    { type: 'Subscription', revenue: 540000, percentage: 60.9, growth: 24.5 },
    { type: 'One-Time', revenue: 245000, percentage: 27.6, growth: 12.3 },
    { type: 'Recurring', revenue: 102000, percentage: 11.5, growth: 8.7 }
  ],
  topServices: [
    { id: 's1', name: 'ShopLeez POS', type: 'Software', clients: 45, revenue: 224000, mrr: 12000, growth: 28.5, rating: 4.8 },
    { id: 's2', name: 'Mobile Banking App', type: 'Software', clients: 12, revenue: 180000, mrr: 9000, growth: 35.2, rating: 4.9 },
    { id: 's3', name: 'CRM System', type: 'Software', clients: 38, revenue: 156000, mrr: 8500, growth: 18.4, rating: 4.7 },
    { id: 's4', name: 'E-Commerce Platform', type: 'Software', clients: 28, revenue: 142000, mrr: 7200, growth: 22.1, rating: 4.6 },
    { id: 's5', name: 'Restaurant Management', type: 'Software', clients: 15, revenue: 89000, mrr: 4500, growth: 15.8, rating: 4.5 }
  ],
  monthlyTrends: [
    { month: 'Jul', revenue: 68000, subscriptions: 145, deliveries: 22 },
    { month: 'Aug', revenue: 72000, subscriptions: 148, deliveries: 25 },
    { month: 'Sep', revenue: 75000, subscriptions: 151, deliveries: 28 },
    { month: 'Oct', revenue: 78000, subscriptions: 153, deliveries: 24 },
    { month: 'Nov', revenue: 82000, subscriptions: 156, deliveries: 30 },
    { month: 'Dec', revenue: 88000, subscriptions: 162, deliveries: 32 }
  ],
  deliveryMetrics: {
    totalDeliveries: 161,
    onTimeDelivery: 87.5,
    avgDeliveryTime: 12.5,
    clientSatisfaction: 4.7,
    pendingDeliveries: 18,
    overdueDeliveries: 3
  },
  subscriptionMetrics: {
    newThisMonth: 12,
    cancelled: 4,
    renewed: 28,
    mrr: 45000,
    churnRate: 2.3,
    ltv: 12500
  }
}

export default function ServiceAnalyticsPage() {
  const [dateRange, setDateRange] = useState('last_6_months')
  const [viewType, setViewType] = useState<'revenue' | 'subscriptions' | 'deliveries'>('revenue')

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Service Analytics</h1>
          <p className="text-gray-400">Performance metrics and insights</p>
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

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{mockAnalytics.overview.totalServices}</p>
          <p className="text-sm text-gray-400 mb-2">Total Services</p>
          <p className="text-xs text-gray-500">{mockAnalytics.overview.activeServices} active</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            <span className="flex items-center gap-1 text-sm text-green-400">
              <ArrowUp className="w-4 h-4" />
              24.5%
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            ${(mockAnalytics.overview.totalRevenue / 1000).toFixed(0)}k
          </p>
          <p className="text-sm text-gray-400 mb-2">Total Revenue</p>
          <p className="text-xs text-gray-500">MRR: ${(mockAnalytics.overview.mrr / 1000).toFixed(0)}k</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{mockAnalytics.overview.activeSubscriptions}</p>
          <p className="text-sm text-gray-400 mb-2">Active Subscriptions</p>
          <p className="text-xs text-gray-500">ARR: ${(mockAnalytics.overview.arr / 1000).toFixed(0)}k</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Star className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{mockAnalytics.overview.avgRating}</p>
          <p className="text-sm text-gray-400 mb-2">Avg Rating</p>
          <p className="text-xs text-gray-500">Churn: {mockAnalytics.overview.churnRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Monthly Trends</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewType('revenue')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    viewType === 'revenue'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setViewType('subscriptions')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    viewType === 'subscriptions'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  Subscriptions
                </button>
                <button
                  onClick={() => setViewType('deliveries')}
                  className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                    viewType === 'deliveries'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  }`}
                >
                  Deliveries
                </button>
              </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-2">
              {mockAnalytics.monthlyTrends.map((data) => {
                const maxValue = Math.max(
                  ...mockAnalytics.monthlyTrends.map((d) =>
                    viewType === 'revenue' ? d.revenue : viewType === 'subscriptions' ? d.subscriptions : d.deliveries
                  )
                )
                const value =
                  viewType === 'revenue' ? data.revenue : viewType === 'subscriptions' ? data.subscriptions : data.deliveries
                const height = (value / maxValue) * 100

                return (
                  <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-purple-500 rounded-t hover:bg-purple-600 transition-colors relative group"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {viewType === 'revenue'
                          ? `$${(value / 1000).toFixed(0)}k`
                          : value.toLocaleString()}
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{data.month}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="col-span-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Revenue by Type</h3>
            <div className="space-y-4">
              {mockAnalytics.revenueByType.map((item) => (
                <div key={item.type}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{item.type}</span>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-400">${(item.revenue / 1000).toFixed(0)}k</span>
                      <span className="text-green-400">+{item.growth}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Delivery Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-blue-400" />
                <p className="text-xs text-gray-400">Avg Delivery Time</p>
              </div>
              <p className="text-2xl font-bold text-white">{mockAnalytics.deliveryMetrics.avgDeliveryTime} days</p>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <p className="text-xs text-gray-400">On-Time Rate</p>
              </div>
              <p className="text-2xl font-bold text-green-400">{mockAnalytics.deliveryMetrics.onTimeDelivery}%</p>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-purple-400" />
                <p className="text-xs text-gray-400">Total Deliveries</p>
              </div>
              <p className="text-2xl font-bold text-white">{mockAnalytics.deliveryMetrics.totalDeliveries}</p>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <p className="text-xs text-gray-400">Satisfaction</p>
              </div>
              <p className="text-2xl font-bold text-white">{mockAnalytics.deliveryMetrics.clientSatisfaction}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Subscription Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-green-400" />
                <p className="text-xs text-gray-400">New This Month</p>
              </div>
              <p className="text-2xl font-bold text-green-400">+{mockAnalytics.subscriptionMetrics.newThisMonth}</p>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDown className="w-4 h-4 text-red-400" />
                <p className="text-xs text-gray-400">Cancelled</p>
              </div>
              <p className="text-2xl font-bold text-red-400">-{mockAnalytics.subscriptionMetrics.cancelled}</p>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-purple-400" />
                <p className="text-xs text-gray-400">MRR</p>
              </div>
              <p className="text-2xl font-bold text-white">
                ${(mockAnalytics.subscriptionMetrics.mrr / 1000).toFixed(0)}k
              </p>
            </div>
            <div className="p-4 bg-gray-900/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <p className="text-xs text-gray-400">LTV</p>
              </div>
              <p className="text-2xl font-bold text-white">
                ${(mockAnalytics.subscriptionMetrics.ltv / 1000).toFixed(1)}k
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Performing Services</h3>
        <div className="space-y-3">
          {mockAnalytics.topServices.map((service, index) => (
            <div key={service.id} className="bg-gray-900/50 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-white">{service.name}</h4>
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">{service.type}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{service.clients} clients</span>
                    <span>•</span>
                    <span>MRR: ${(service.mrr / 1000).toFixed(1)}k</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{service.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-white">${(service.revenue / 1000).toFixed(0)}k</p>
                  <p className="text-sm text-green-400">+{service.growth}%</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
