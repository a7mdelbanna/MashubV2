'use client'

import { useState } from 'react'
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Target,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Clock,
  AlertTriangle,
  CheckCircle,
  Filter,
  RefreshCw
} from 'lucide-react'

type ReportType = 'overview' | 'revenue' | 'health' | 'activity' | 'segmentation' | 'forecasting'

interface Report {
  id: string
  name: string
  type: ReportType
  description: string
  icon: any
  lastGenerated?: string
}

const availableReports: Report[] = [
  {
    id: 'rep-1',
    name: 'Client Overview Report',
    type: 'overview',
    description: 'Comprehensive overview of all clients, including status distribution, key metrics, and trends',
    icon: Users,
    lastGenerated: '2024-03-01'
  },
  {
    id: 'rep-2',
    name: 'Revenue Analysis',
    type: 'revenue',
    description: 'Detailed revenue breakdown by client, industry, and time period with growth analysis',
    icon: DollarSign,
    lastGenerated: '2024-02-28'
  },
  {
    id: 'rep-3',
    name: 'Client Health Score',
    type: 'health',
    description: 'Health scores for all clients with at-risk identification and engagement metrics',
    icon: Activity,
    lastGenerated: '2024-03-02'
  },
  {
    id: 'rep-4',
    name: 'Activity & Engagement',
    type: 'activity',
    description: 'Communication frequency, response times, and engagement levels across all clients',
    icon: Clock,
    lastGenerated: '2024-03-01'
  },
  {
    id: 'rep-5',
    name: 'Client Segmentation',
    type: 'segmentation',
    description: 'Segmentation analysis by industry, size, revenue, and custom criteria',
    icon: Target,
    lastGenerated: '2024-02-25'
  },
  {
    id: 'rep-6',
    name: 'Revenue Forecasting',
    type: 'forecasting',
    description: 'Projected revenue based on pipeline, renewal dates, and historical growth patterns',
    icon: TrendingUp,
    lastGenerated: '2024-02-29'
  }
]

// Mock report data for "Client Overview"
const overviewReportData = {
  summary: {
    totalClients: 428,
    activeClients: 356,
    newClients: 24,
    churnedClients: 3,
    retentionRate: 94.2,
    churnRate: 0.7
  },
  byStatus: [
    { status: 'Active', count: 356, percentage: 83.2, change: '+5.2%' },
    { status: 'Lead', count: 42, percentage: 9.8, change: '+12.3%' },
    { status: 'Prospect', count: 18, percentage: 4.2, change: '+8.1%' },
    { status: 'Inactive', count: 9, percentage: 2.1, change: '-2.5%' },
    { status: 'Churned', count: 3, percentage: 0.7, change: '-1.8%' }
  ],
  byIndustry: [
    { industry: 'Technology', clients: 128, revenue: 1240000, avgValue: 9687 },
    { industry: 'Finance', clients: 86, revenue: 980000, avgValue: 11395 },
    { industry: 'Healthcare', clients: 72, revenue: 845000, avgValue: 11736 },
    { industry: 'Retail', clients: 58, revenue: 645000, avgValue: 11120 },
    { industry: 'Manufacturing', clients: 42, revenue: 520000, avgValue: 12380 }
  ],
  topPerformers: [
    { name: 'TechCorp Inc.', revenue: 485000, growth: 24.5, health: 95 },
    { name: 'FinanceHub', revenue: 425000, growth: 18.2, health: 92 },
    { name: 'MediCare Plus', revenue: 410000, growth: 31.8, health: 88 }
  ],
  atRisk: [
    { name: 'BudgetSystems', health: 38, lastContact: 62, reason: 'Payment overdue' },
    { name: 'LegacySolutions', health: 42, lastContact: 45, reason: 'Inactive projects' },
    { name: 'StartupVentures', health: 35, lastContact: 71, reason: 'Long contact gap' }
  ]
}

export default function ClientReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType | null>('overview')
  const [dateRange, setDateRange] = useState('last_30_days')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateReport = (reportType: ReportType) => {
    setIsGenerating(true)
    setSelectedReport(reportType)
    setTimeout(() => setIsGenerating(false), 1500)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-400'
      case 'lead': return 'text-blue-400'
      case 'prospect': return 'text-purple-400'
      case 'inactive': return 'text-gray-400'
      case 'churned': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Client Reports</h1>
          <p className="text-gray-400">
            Generate comprehensive reports and insights about your client base
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="last_7_days">Last 7 days</option>
            <option value="last_30_days">Last 30 days</option>
            <option value="last_90_days">Last 90 days</option>
            <option value="last_365_days">Last 365 days</option>
            <option value="this_month">This Month</option>
            <option value="this_quarter">This Quarter</option>
            <option value="this_year">This Year</option>
            <option value="all_time">All Time</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            <Download className="w-5 h-5" />
            Export All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Report Selection Sidebar */}
        <div className="col-span-3 space-y-3">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Available Reports</h3>
            <div className="space-y-2">
              {availableReports.map((report) => {
                const Icon = report.icon
                return (
                  <button
                    key={report.id}
                    onClick={() => handleGenerateReport(report.type)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors ${
                      selectedReport === report.type
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-900/50 hover:bg-gray-700/50 text-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div className="text-left flex-1">
                      <p className="text-sm font-medium">{report.name}</p>
                      {report.lastGenerated && (
                        <p className="text-xs opacity-75 mt-1">
                          Last: {new Date(report.lastGenerated).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/50 p-4">
            <h3 className="text-sm font-semibold text-white mb-2">Schedule Reports</h3>
            <p className="text-xs text-gray-400 mb-3">
              Get reports delivered to your inbox automatically
            </p>
            <button className="w-full px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors">
              Set Up Schedule
            </button>
          </div>
        </div>

        {/* Report Content */}
        <div className="col-span-9">
          {isGenerating ? (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-12 flex flex-col items-center justify-center">
              <RefreshCw className="w-12 h-12 text-purple-400 mb-4 animate-spin" />
              <h3 className="text-xl font-semibold text-white mb-2">Generating Report...</h3>
              <p className="text-gray-400">Please wait while we compile your data</p>
            </div>
          ) : selectedReport === 'overview' ? (
            <div className="space-y-6">
              {/* Report Header */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Client Overview Report</h2>
                    <p className="text-gray-400">Comprehensive overview of your client base</p>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    Export PDF
                  </button>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Generated: {new Date().toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Period: {dateRange.replace('_', ' ')}
                  </div>
                </div>
              </div>

              {/* Summary Stats */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Summary Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      <span className="text-2xl font-bold text-white">{overviewReportData.summary.totalClients}</span>
                    </div>
                    <p className="text-sm text-gray-400">Total Clients</p>
                  </div>
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span className="text-2xl font-bold text-white">{overviewReportData.summary.activeClients}</span>
                    </div>
                    <p className="text-sm text-gray-400">Active Clients</p>
                  </div>
                  <div className="p-4 bg-gray-900/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      <span className="text-2xl font-bold text-white">{overviewReportData.summary.retentionRate}%</span>
                    </div>
                    <p className="text-sm text-gray-400">Retention Rate</p>
                  </div>
                </div>
              </div>

              {/* Client Distribution */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Client Distribution by Status</h3>
                <div className="space-y-4">
                  {overviewReportData.byStatus.map((item) => (
                    <div key={item.status}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                          <span className="text-xs text-gray-500">({item.count} clients)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400">{item.percentage}%</span>
                          <span className={`text-xs ${
                            item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {item.change}
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            item.status === 'Active' ? 'bg-green-500' :
                            item.status === 'Lead' ? 'bg-blue-500' :
                            item.status === 'Prospect' ? 'bg-purple-500' :
                            item.status === 'Inactive' ? 'bg-gray-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Industry Breakdown */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Top Industries</h3>
                  <div className="space-y-4">
                    {overviewReportData.byIndustry.map((item) => (
                      <div key={item.industry} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                        <div>
                          <p className="font-medium text-white">{item.industry}</p>
                          <p className="text-sm text-gray-400">{item.clients} clients</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-white">${(item.revenue / 1000).toFixed(0)}k</p>
                          <p className="text-sm text-gray-400">${(item.avgValue / 1000).toFixed(1)}k avg</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Performers */}
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Top Performing Clients</h3>
                  <div className="space-y-4">
                    {overviewReportData.topPerformers.map((client, index) => (
                      <div key={client.name} className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">{client.name}</p>
                          <p className="text-sm text-gray-400">${(client.revenue / 1000).toFixed(0)}k revenue</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-green-400">+{client.growth}%</p>
                          <p className="text-sm text-gray-400">Health: {client.health}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* At-Risk Clients */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  <h3 className="text-lg font-semibold text-white">Clients Requiring Attention</h3>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {overviewReportData.atRisk.map((client) => (
                    <div key={client.name} className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="font-medium text-white mb-2">{client.name}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Health:</span>
                          <span className="text-red-400">{client.health}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400">Last Contact:</span>
                          <span className="text-yellow-400">{client.lastContact} days</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{client.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Footer */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">
                      Report generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Data accuracy: 99.8% | Last sync: {new Date().toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                      Save as Template
                    </button>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                      Schedule Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-12 text-center">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Select a Report</h3>
              <p className="text-gray-400">
                Choose a report from the sidebar to view detailed insights
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
