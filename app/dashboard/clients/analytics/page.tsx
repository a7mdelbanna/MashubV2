'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  AlertTriangle,
  Award,
  Activity,
  BarChart3,
  PieChart,
  Calendar,
  ArrowUp,
  ArrowDown,
  Minus,
  Building2,
  UserCheck,
  UserX,
  Clock,
  Zap,
  Heart,
  AlertCircle
} from 'lucide-react'

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalClients: 428,
    activeClients: 356,
    newThisMonth: 24,
    churnedThisMonth: 3,
    totalRevenue: 2845000,
    avgRevenuePerClient: 6648,
    lifetimeValue: 45200,
    retentionRate: 94.2,
    churnRate: 0.7,
    avgProjectsPerClient: 3.2,
    totalProjects: 1370,
    avgClientTenure: 18.5 // months
  },
  revenueGrowth: {
    monthOverMonth: 12.5,
    yearOverYear: 48.3,
    quarterOverQuarter: 23.7
  },
  clientAcquisition: {
    thisMonth: 24,
    lastMonth: 19,
    growthRate: 26.3,
    costPerAcquisition: 1250,
    avgOnboardingDays: 12
  },
  clientHealth: {
    excellent: 234, // 80-100
    good: 98,       // 60-79
    atRisk: 18,     // 40-59
    critical: 6     // 0-39
  },
  revenueByMonth: [
    { month: 'Jan', revenue: 215000, clients: 42 },
    { month: 'Feb', revenue: 198000, clients: 38 },
    { month: 'Mar', revenue: 225000, clients: 45 },
    { month: 'Apr', revenue: 242000, clients: 48 },
    { month: 'May', revenue: 268000, clients: 52 },
    { month: 'Jun', revenue: 285000, clients: 54 },
    { month: 'Jul', revenue: 295000, clients: 56 },
    { month: 'Aug', revenue: 312000, clients: 59 },
    { month: 'Sep', revenue: 289000, clients: 57 },
    { month: 'Oct', revenue: 301000, clients: 58 },
    { month: 'Nov', revenue: 315000, clients: 61 },
    { month: 'Dec', revenue: 325000, clients: 62 }
  ],
  clientsByStatus: [
    { status: 'Active', count: 356, percentage: 83.2, color: 'bg-green-500' },
    { status: 'Lead', count: 42, percentage: 9.8, color: 'bg-blue-500' },
    { status: 'Prospect', count: 18, percentage: 4.2, color: 'bg-purple-500' },
    { status: 'Inactive', count: 9, percentage: 2.1, color: 'bg-gray-500' },
    { status: 'Churned', count: 3, percentage: 0.7, color: 'bg-red-500' }
  ],
  clientsByIndustry: [
    { industry: 'Technology', count: 128, revenue: 1240000, avgValue: 9687 },
    { industry: 'Finance', count: 86, revenue: 980000, avgValue: 11395 },
    { industry: 'Healthcare', count: 72, revenue: 845000, avgValue: 11736 },
    { industry: 'Retail', count: 58, revenue: 645000, avgValue: 11120 },
    { industry: 'Manufacturing', count: 42, revenue: 520000, avgValue: 12380 },
    { industry: 'Education', count: 24, revenue: 285000, avgValue: 11875 },
    { industry: 'Other', count: 18, revenue: 215000, avgValue: 11944 }
  ],
  topClients: [
    { id: 'c1', name: 'TechCorp Inc.', revenue: 485000, growth: 24.5, projects: 12, health: 95 },
    { id: 'c2', name: 'FinanceHub', revenue: 425000, growth: 18.2, projects: 10, health: 92 },
    { id: 'c3', name: 'MediCare Plus', revenue: 410000, growth: 31.8, projects: 9, health: 88 },
    { id: 'c4', name: 'RetailChain Pro', revenue: 385000, growth: 15.4, projects: 11, health: 90 },
    { id: 'c5', name: 'GlobalManufacturing', revenue: 365000, growth: 22.1, projects: 8, health: 85 },
    { id: 'c6', name: 'DataInsights Corp', revenue: 342000, growth: 19.8, projects: 10, health: 93 },
    { id: 'c7', name: 'CloudServices Ltd', revenue: 328000, growth: 28.5, projects: 9, health: 91 },
    { id: 'c8', name: 'SmartLogistics', revenue: 315000, growth: 12.7, projects: 7, health: 87 },
    { id: 'c9', name: 'SecurePayments', revenue: 298000, growth: 20.3, projects: 8, health: 89 },
    { id: 'c10', name: 'InnovateAI', revenue: 285000, growth: 35.2, projects: 6, health: 94 }
  ],
  atRiskClients: [
    { id: 'c45', name: 'BudgetSystems', health: 38, lastContact: 62, outstand: 45000, reason: 'Payment overdue, no recent contact' },
    { id: 'c67', name: 'LegacySolutions', health: 42, lastContact: 45, outstand: 28000, reason: 'Inactive projects, payment delays' },
    { id: 'c89', name: 'StartupVentures', health: 35, lastContact: 71, outstand: 15000, reason: 'Long contact gap, budget concerns' },
    { id: 'c12', name: 'OldSchool Inc', health: 48, lastContact: 38, outstand: 12000, reason: 'Declining engagement' },
    { id: 'c34', name: 'SlowPay Co', health: 41, lastContact: 52, outstand: 32000, reason: 'Consistent payment delays' },
    { id: 'c56', name: 'ReducingBudget Ltd', health: 45, lastContact: 41, outstand: 8000, reason: 'Budget reduction signals' }
  ],
  clientLifecycle: [
    { stage: 'Lead', count: 42, avgDuration: 14, conversionRate: 62 },
    { stage: 'Prospect', count: 18, avgDuration: 21, conversionRate: 78 },
    { stage: 'Onboarding', count: 12, avgDuration: 12, conversionRate: 95 },
    { stage: 'Active', count: 356, avgDuration: 540, conversionRate: 94 },
    { stage: 'At Risk', count: 24, avgDuration: 90, conversionRate: 45 }
  ],
  communicationStats: {
    totalCommunications: 8450,
    avgPerClient: 19.7,
    emailsSent: 5230,
    callsMade: 1850,
    meetingsHeld: 1370,
    avgResponseTime: 4.2 // hours
  }
}

export default function ClientAnalyticsPage() {
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month')

  const getTrendIcon = (value: number) => {
    if (value > 0) return <ArrowUp className="w-4 h-4" />
    if (value < 0) return <ArrowDown className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  const getTrendColor = (value: number) => {
    if (value > 0) return 'text-green-400'
    if (value < 0) return 'text-red-400'
    return 'text-gray-400'
  }

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-400'
    if (health >= 60) return 'text-blue-400'
    if (health >= 40) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Client Analytics</h1>
          <p className="text-gray-400">
            Comprehensive insights into your client relationships and revenue
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="week">Last 7 days</option>
            <option value="month">Last 30 days</option>
            <option value="quarter">Last 3 months</option>
            <option value="year">Last 12 months</option>
          </select>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span className={`flex items-center gap-1 text-sm ${getTrendColor(mockAnalytics.clientAcquisition.growthRate)}`}>
              {getTrendIcon(mockAnalytics.clientAcquisition.growthRate)}
              {mockAnalytics.clientAcquisition.growthRate}%
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{mockAnalytics.overview.totalClients}</p>
          <p className="text-sm text-gray-400">Total Clients</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <UserCheck className="w-5 h-5 text-green-400" />
            <span className="flex items-center gap-1 text-sm text-green-400">
              <ArrowUp className="w-4 h-4" />
              {mockAnalytics.overview.retentionRate}%
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{mockAnalytics.overview.activeClients}</p>
          <p className="text-sm text-gray-400">Active Clients</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-purple-400" />
            <span className={`flex items-center gap-1 text-sm ${getTrendColor(mockAnalytics.revenueGrowth.monthOverMonth)}`}>
              {getTrendIcon(mockAnalytics.revenueGrowth.monthOverMonth)}
              {mockAnalytics.revenueGrowth.monthOverMonth}%
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            ${(mockAnalytics.overview.totalRevenue / 1000).toFixed(0)}k
          </p>
          <p className="text-sm text-gray-400">Total Revenue</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-gray-400">AVG</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            ${(mockAnalytics.overview.avgRevenuePerClient / 1000).toFixed(1)}k
          </p>
          <p className="text-sm text-gray-400">Per Client</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Heart className="w-5 h-5 text-pink-400" />
            <span className="text-sm text-gray-400">LTV</span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            ${(mockAnalytics.overview.lifetimeValue / 1000).toFixed(0)}k
          </p>
          <p className="text-sm text-gray-400">Lifetime Value</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
            <span className="flex items-center gap-1 text-sm text-red-400">
              <AlertTriangle className="w-4 h-4" />
              {mockAnalytics.clientHealth.atRisk + mockAnalytics.clientHealth.critical}
            </span>
          </div>
          <p className="text-3xl font-bold text-white mb-1">{mockAnalytics.overview.churnRate}%</p>
          <p className="text-sm text-gray-400">Churn Rate</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Revenue Trend */}
        <div className="col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Revenue & Client Growth</h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-gray-400">Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-gray-400">Clients</span>
              </div>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {mockAnalytics.revenueByMonth.map((data, index) => {
              const maxRevenue = Math.max(...mockAnalytics.revenueByMonth.map(d => d.revenue))
              const revenueHeight = (data.revenue / maxRevenue) * 100
              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col gap-1">
                    <div
                      className="w-full bg-purple-500/30 rounded-t hover:bg-purple-500/50 transition-colors relative group"
                      style={{ height: `${revenueHeight}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        ${(data.revenue / 1000).toFixed(0)}k
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{data.month}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Client Health Distribution */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Client Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm text-gray-300">Excellent</span>
                </div>
                <span className="text-sm font-medium text-white">{mockAnalytics.clientHealth.excellent}</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${(mockAnalytics.clientHealth.excellent / mockAnalytics.overview.totalClients) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span className="text-sm text-gray-300">Good</span>
                </div>
                <span className="text-sm font-medium text-white">{mockAnalytics.clientHealth.good}</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${(mockAnalytics.clientHealth.good / mockAnalytics.overview.totalClients) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-sm text-gray-300">At Risk</span>
                </div>
                <span className="text-sm font-medium text-white">{mockAnalytics.clientHealth.atRisk}</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500"
                  style={{ width: `${(mockAnalytics.clientHealth.atRisk / mockAnalytics.overview.totalClients) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm text-gray-300">Critical</span>
                </div>
                <span className="text-sm font-medium text-white">{mockAnalytics.clientHealth.critical}</span>
              </div>
              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${(mockAnalytics.clientHealth.critical / mockAnalytics.overview.totalClients) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Average Health Score</span>
              <span className="text-lg font-bold text-green-400">87.2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Clients Need Attention</span>
              <span className="text-lg font-bold text-yellow-400">24</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Top Clients by Revenue */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Top 10 Clients by Revenue</h3>
            <Link href="/dashboard/clients" className="text-sm text-purple-400 hover:text-purple-300">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {mockAnalytics.topClients.map((client, index) => (
              <div key={client.id} className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-700/30 transition-colors">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-white">{client.name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{client.projects} projects</span>
                    <span>•</span>
                    <span className={getHealthColor(client.health)}>Health: {client.health}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">${(client.revenue / 1000).toFixed(0)}k</p>
                  <div className="flex items-center justify-end gap-1 text-xs text-green-400">
                    <TrendingUp className="w-3 h-3" />
                    {client.growth}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* At-Risk Clients */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              At-Risk Clients
            </h3>
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
              {mockAnalytics.atRiskClients.length} clients
            </span>
          </div>
          <div className="space-y-3">
            {mockAnalytics.atRiskClients.map((client) => (
              <div key={client.id} className="p-4 bg-gray-900/50 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-white">{client.name}</p>
                  <span className={`text-sm font-medium ${getHealthColor(client.health)}`}>
                    Health: {client.health}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-3">{client.reason}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-3 h-3" />
                    {client.lastContact} days since contact
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <DollarSign className="w-3 h-3" />
                    ${(client.outstand / 1000).toFixed(0)}k outstanding
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs transition-colors">
                    Contact Now
                  </button>
                  <button className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded text-xs transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Clients by Industry */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Clients by Industry</h3>
          <div className="space-y-4">
            {mockAnalytics.clientsByIndustry.map((industry) => (
              <div key={industry.industry}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">{industry.industry}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">{industry.count} clients</span>
                    <span className="text-sm font-medium text-white">
                      ${(industry.revenue / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{
                      width: `${(industry.revenue / mockAnalytics.overview.totalRevenue) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Client Lifecycle */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Client Lifecycle Funnel</h3>
          <div className="space-y-4">
            {mockAnalytics.clientLifecycle.map((stage, index) => {
              const totalClients = mockAnalytics.overview.totalClients
              const widthPercentage = (stage.count / totalClients) * 100
              return (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-white">{stage.stage}</span>
                      <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-400">
                        {stage.count}
                      </span>
                    </div>
                    <span className="text-sm text-green-400">{stage.conversionRate}% conversion</span>
                  </div>
                  <div className="relative">
                    <div className="w-full h-8 bg-gray-700 rounded-lg overflow-hidden">
                      <div
                        className={`h-full flex items-center px-3 text-sm font-medium text-white transition-all ${
                          index === 0 ? 'bg-blue-500' :
                          index === 1 ? 'bg-purple-500' :
                          index === 2 ? 'bg-cyan-500' :
                          index === 3 ? 'bg-green-500' :
                          'bg-yellow-500'
                        }`}
                        style={{ width: `${Math.max(widthPercentage, 15)}%` }}
                      >
                        {stage.avgDuration} days avg
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
