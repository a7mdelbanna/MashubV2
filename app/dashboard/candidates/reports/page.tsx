'use client'

import { useState } from 'react'
import {
  FileText,
  Download,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  DollarSign,
  CheckCircle2,
  XCircle,
  BarChart3,
  PieChart,
  Activity,
  Award,
  AlertTriangle,
  Zap
} from 'lucide-react'

type ReportType = 'overview' | 'pipeline' | 'sources' | 'recruiters' | 'diversity' | 'time_metrics'

interface Report {
  id: string
  name: string
  description: string
  type: ReportType
  icon: any
  color: string
}

const availableReports: Report[] = [
  {
    id: 'rep-1',
    name: 'Recruitment Overview',
    description: 'Comprehensive summary of recruitment activities and key metrics',
    type: 'overview',
    icon: Activity,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'rep-2',
    name: 'Pipeline Performance',
    description: 'Detailed analysis of candidate flow through hiring stages',
    type: 'pipeline',
    icon: BarChart3,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'rep-3',
    name: 'Source Effectiveness',
    description: 'ROI and performance metrics for each candidate source',
    type: 'sources',
    icon: Target,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'rep-4',
    name: 'Recruiter Performance',
    description: 'Individual recruiter metrics and performance comparisons',
    type: 'recruiters',
    icon: Award,
    color: 'from-yellow-500 to-orange-500'
  },
  {
    id: 'rep-5',
    name: 'Diversity Metrics',
    description: 'Track diversity goals and representation across pipeline',
    type: 'diversity',
    icon: Users,
    color: 'from-pink-500 to-rose-500'
  },
  {
    id: 'rep-6',
    name: 'Time & Velocity Metrics',
    description: 'Time-to-hire, stage durations, and hiring velocity trends',
    type: 'time_metrics',
    icon: Clock,
    color: 'from-indigo-500 to-purple-500'
  }
]

// Mock metrics data
const mockMetrics = {
  summary: {
    totalCandidates: 428,
    activeInPipeline: 156,
    hiredThisQuarter: 34,
    avgTimeToHire: 35,
    costPerHire: 3420,
    offerAcceptanceRate: 87,
    quarterlyGrowth: 12,
    pipelineHealthScore: 82
  },
  stageMetrics: [
    { stage: 'New Applications', count: 428, converted: 325, rate: 76, avgDays: 2 },
    { stage: 'Screening', count: 325, converted: 198, rate: 61, avgDays: 5 },
    { stage: 'Interview', count: 198, converted: 89, rate: 45, avgDays: 12 },
    { stage: 'Assessment', count: 89, converted: 52, rate: 58, avgDays: 7 },
    { stage: 'Offer', count: 52, converted: 34, rate: 65, avgDays: 3 },
    { stage: 'Hired', count: 34, converted: 34, rate: 100, avgDays: 0 }
  ],
  sourceMetrics: [
    { source: 'LinkedIn', applications: 156, hired: 18, cost: 2400, roi: 245 },
    { source: 'Referrals', applications: 89, hired: 24, cost: 800, roi: 412 },
    { source: 'Job Boards', applications: 124, hired: 14, cost: 1800, roi: 189 },
    { source: 'Website', applications: 42, hired: 6, cost: 200, roi: 523 },
    { source: 'Agencies', applications: 17, hired: 3, cost: 5000, roi: 98 }
  ],
  timeMetrics: {
    avgTimeToHire: 35,
    avgTimeToOffer: 29,
    avgOfferAcceptance: 6,
    avgScreeningTime: 5,
    avgInterviewTime: 12,
    avgAssessmentTime: 7
  },
  quarterlyTrends: [
    { period: 'Q1 2025', applications: 245, hires: 22, timeToHire: 42 },
    { period: 'Q2 2025', applications: 298, hires: 28, timeToHire: 38 },
    { period: 'Q3 2025', applications: 342, hires: 31, timeToHire: 35 },
    { period: 'Q4 2025', applications: 428, hires: 34, timeToHire: 35 }
  ],
  topPositions: [
    { title: 'Senior Full Stack Developer', applications: 156, hires: 8, avgDays: 38 },
    { title: 'Product Designer', applications: 89, hires: 6, avgDays: 32 },
    { title: 'Data Scientist', applications: 67, hires: 5, avgDays: 41 },
    { title: 'DevOps Engineer', applications: 54, hires: 4, avgDays: 45 },
    { title: 'Frontend Developer', applications: 62, hires: 11, avgDays: 28 }
  ]
}

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<ReportType>('overview')
  const [dateRange, setDateRange] = useState('last_quarter')

  const metrics = mockMetrics

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Pipeline Metrics & Reports</h1>
          <p className="text-gray-400">Track and analyze recruitment performance</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="last_week">Last Week</option>
            <option value="last_month">Last Month</option>
            <option value="last_quarter">Last Quarter</option>
            <option value="last_year">Last Year</option>
            <option value="all_time">All Time</option>
          </select>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              +{metrics.summary.quarterlyGrowth}%
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{metrics.summary.totalCandidates}</div>
          <div className="text-sm text-gray-400">Total Candidates</div>
          <div className="text-xs text-gray-500 mt-2">{metrics.summary.activeInPipeline} in active pipeline</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              +15%
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{metrics.summary.hiredThisQuarter}</div>
          <div className="text-sm text-gray-400">Hired This Quarter</div>
          <div className="text-xs text-gray-500 mt-2">Target: 40 hires</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingDown className="w-4 h-4" />
              -3d
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{metrics.summary.avgTimeToHire}d</div>
          <div className="text-sm text-gray-400">Avg Time to Hire</div>
          <div className="text-xs text-gray-500 mt-2">Industry avg: 42 days</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingDown className="w-4 h-4" />
              -8%
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">${metrics.summary.costPerHire.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Cost Per Hire</div>
          <div className="text-xs text-gray-500 mt-2">Industry avg: $4,200</div>
        </div>
      </div>

      {/* Report Selector */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {availableReports.map((report) => {
          const Icon = report.icon
          const isSelected = selectedReport === report.type

          return (
            <button
              key={report.id}
              onClick={() => setSelectedReport(report.type)}
              className={`bg-gray-800/50 rounded-lg border p-4 text-left transition-all ${
                isSelected
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 hover:border-gray-600'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${report.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-1">{report.name}</h3>
              <p className="text-xs text-gray-400">{report.description}</p>
            </button>
          )
        })}
      </div>

      {/* Report Content */}
      {selectedReport === 'overview' && (
        <div className="space-y-6">
          {/* Pipeline Health Score */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Pipeline Health Score</h2>
              <div className="flex items-center gap-2">
                <div className="text-4xl font-bold text-white">{metrics.summary.pipelineHealthScore}</div>
                <div className="text-sm text-gray-400">/100</div>
              </div>
            </div>
            <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden mb-4">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${metrics.summary.pipelineHealthScore}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-sm text-gray-400">Conversion Rate</div>
                  <div className="text-white font-medium">Excellent</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-sm text-gray-400">Time to Hire</div>
                  <div className="text-white font-medium">On Target</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="text-sm text-gray-400">Pipeline Volume</div>
                  <div className="text-white font-medium">Needs Attention</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quarterly Trends */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h2 className="text-xl font-bold text-white mb-6">Quarterly Trends</h2>
            <div className="space-y-4">
              {metrics.quarterlyTrends.map((quarter, index) => (
                <div key={quarter.period} className="flex items-center gap-4">
                  <div className="w-24 text-sm font-medium text-gray-400">{quarter.period}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Applications</span>
                      <span className="text-white font-medium">{quarter.applications}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${(quarter.applications / 450) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Hires</span>
                      <span className="text-white font-medium">{quarter.hires}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500"
                        style={{ width: `${(quarter.hires / 40) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-24 text-right">
                    <div className="text-sm text-gray-400">Time to Hire</div>
                    <div className="text-white font-medium">{quarter.timeToHire}d</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedReport === 'pipeline' && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Pipeline Stage Performance</h2>
          <div className="space-y-4">
            {metrics.stageMetrics.map((stage, index) => (
              <div key={stage.stage} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <span className="text-white font-medium">{stage.stage}</span>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="text-gray-400">Candidates: </span>
                      <span className="text-white font-medium">{stage.count}</span>
                    </div>
                    {stage.converted < stage.count && (
                      <>
                        <div>
                          <span className="text-gray-400">Converted: </span>
                          <span className="text-white font-medium">{stage.converted}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Rate: </span>
                          <span className={`font-medium ${
                            stage.rate >= 60 ? 'text-green-400' :
                            stage.rate >= 40 ? 'text-yellow-400' : 'text-red-400'
                          }`}>{stage.rate}%</span>
                        </div>
                      </>
                    )}
                    <div>
                      <span className="text-gray-400">Avg Days: </span>
                      <span className="text-white font-medium">{stage.avgDays}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-11">
                  <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        stage.rate >= 60 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        stage.rate >= 40 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-red-500 to-pink-500'
                      }`}
                      style={{ width: `${stage.rate}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedReport === 'sources' && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Source Effectiveness & ROI</h2>
          <div className="space-y-4">
            {metrics.sourceMetrics.map((source) => (
              <div key={source.source} className="bg-gray-900/50 rounded-lg border border-gray-700 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">{source.source}</h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    source.roi >= 300 ? 'bg-green-500/20 text-green-400' :
                    source.roi >= 200 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    ROI: {source.roi}%
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Applications</div>
                    <div className="text-xl font-bold text-white">{source.applications}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Hired</div>
                    <div className="text-xl font-bold text-green-400">{source.hired}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Cost/Hire</div>
                    <div className="text-xl font-bold text-white">${source.cost}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Conversion</div>
                    <div className="text-xl font-bold text-purple-400">
                      {((source.hired / source.applications) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedReport === 'time_metrics' && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Time & Velocity Metrics</h2>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(metrics.timeMetrics).map(([key, value]) => (
              <div key={key} className="bg-gray-900/50 rounded-lg border border-gray-700 p-4">
                <div className="flex items-center justify-between mb-3">
                  <Clock className="w-8 h-8 text-purple-400" />
                  <div className="text-3xl font-bold text-white">{value}d</div>
                </div>
                <div className="text-sm text-gray-400">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
