'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  Award,
  Calendar,
  DollarSign,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowUpRight,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { Candidate, JobPosition, ApplicationSource } from '@/types/candidates'
import {
  calculateAverageTimeToHire,
  getCandidatesByStage,
  getCandidatesBySource,
  calculateConversionRate
} from '@/lib/candidates-utils'

// Mock data for analytics
const mockAnalyticsData = {
  overview: {
    totalCandidates: 428,
    activeCandidates: 156,
    newThisMonth: 67,
    hiredThisMonth: 12,
    avgTimeToHire: 35,
    offerAcceptanceRate: 87,
    candidateSatisfaction: 4.6,
    sourceEffectiveness: 78
  },
  trends: {
    candidatesOverTime: [
      { month: 'Apr', total: 245, hired: 8 },
      { month: 'May', total: 298, hired: 11 },
      { month: 'Jun', total: 342, hired: 9 },
      { month: 'Jul', total: 376, hired: 13 },
      { month: 'Aug', total: 392, hired: 10 },
      { month: 'Sep', total: 428, hired: 12 }
    ],
    timeToHireByMonth: [
      { month: 'Apr', days: 42 },
      { month: 'May', days: 38 },
      { month: 'Jun', days: 41 },
      { month: 'Jul', days: 36 },
      { month: 'Aug', days: 33 },
      { month: 'Sep', days: 35 }
    ]
  },
  pipeline: {
    stages: [
      { name: 'New', count: 45, percentage: 100 },
      { name: 'Screening', count: 38, percentage: 84 },
      { name: 'Interview', count: 28, percentage: 62 },
      { name: 'Assessment', count: 18, percentage: 40 },
      { name: 'Offer', count: 12, percentage: 27 },
      { name: 'Hired', count: 8, percentage: 18 }
    ],
    dropoffReasons: [
      { reason: 'Skills mismatch', count: 42, percentage: 35 },
      { reason: 'Salary expectations', count: 28, percentage: 23 },
      { reason: 'Location/Remote', count: 21, percentage: 17 },
      { reason: 'Better offer', count: 18, percentage: 15 },
      { reason: 'Failed assessment', count: 12, percentage: 10 }
    ]
  },
  sources: [
    { name: 'LinkedIn', candidates: 156, hired: 18, hireRate: 11.5, avgCost: 2400, color: 'from-blue-500 to-cyan-500' },
    { name: 'Referrals', candidates: 89, hired: 24, hireRate: 27.0, avgCost: 800, color: 'from-green-500 to-emerald-500' },
    { name: 'Job Boards', candidates: 124, hired: 14, hireRate: 11.3, avgCost: 1800, color: 'from-purple-500 to-pink-500' },
    { name: 'Website', candidates: 42, hired: 6, hireRate: 14.3, avgCost: 200, color: 'from-orange-500 to-red-500' },
    { name: 'Recruiter', candidates: 17, hired: 3, hireRate: 17.6, avgCost: 5000, color: 'from-yellow-500 to-orange-500' }
  ],
  recruiters: [
    {
      id: 'rec-1',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      activeCandidates: 42,
      placementsThisMonth: 5,
      avgTimeToFill: 32,
      offerAcceptanceRate: 92,
      satisfaction: 4.8
    },
    {
      id: 'rec-2',
      name: 'Michael Chen',
      avatar: 'MC',
      activeCandidates: 38,
      placementsThisMonth: 4,
      avgTimeToFill: 35,
      offerAcceptanceRate: 85,
      satisfaction: 4.6
    },
    {
      id: 'rec-3',
      name: 'Emily Davis',
      avatar: 'ED',
      activeCandidates: 36,
      placementsThisMonth: 3,
      avgTimeToFill: 38,
      offerAcceptanceRate: 88,
      satisfaction: 4.7
    },
    {
      id: 'rec-4',
      name: 'David Wilson',
      avatar: 'DW',
      activeCandidates: 28,
      placementsThisMonth: 2,
      avgTimeToFill: 41,
      offerAcceptanceRate: 80,
      satisfaction: 4.5
    }
  ],
  topPositions: [
    { title: 'Senior Full Stack Developer', applicants: 156, hired: 3, avgDays: 38 },
    { title: 'Product Designer', applicants: 89, hired: 2, avgDays: 32 },
    { title: 'DevOps Engineer', applicants: 67, hired: 1, avgDays: 45 },
    { title: 'Data Scientist', applicants: 54, hired: 2, avgDays: 36 },
    { title: 'Frontend Developer', applicants: 62, hired: 4, avgDays: 28 }
  ]
}

export default function CandidatesAnalyticsPage() {
  const [dateRange, setDateRange] = useState('last_30_days')
  const [comparisonPeriod, setComparisonPeriod] = useState('previous_period')

  const data = mockAnalyticsData

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Recruitment Analytics</h1>
          <p className="text-gray-400">Track hiring performance and optimize your recruitment process</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="last_90_days">Last 90 Days</option>
            <option value="last_year">Last Year</option>
            <option value="custom">Custom Range</option>
          </select>
          <button className="px-4 py-2 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              +12%
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{data.overview.totalCandidates}</div>
          <div className="text-sm text-gray-400">Total Candidates</div>
          <div className="text-xs text-gray-500 mt-2">{data.overview.newThisMonth} new this month</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              +8%
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{data.overview.hiredThisMonth}</div>
          <div className="text-sm text-gray-400">Hired This Month</div>
          <div className="text-xs text-gray-500 mt-2">{data.overview.activeCandidates} in pipeline</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingDown className="w-4 h-4" />
              -5%
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{data.overview.avgTimeToHire}d</div>
          <div className="text-sm text-gray-400">Avg. Time to Hire</div>
          <div className="text-xs text-gray-500 mt-2">Target: 30 days</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-600 flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              +3%
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{data.overview.offerAcceptanceRate}%</div>
          <div className="text-sm text-gray-400">Offer Acceptance</div>
          <div className="text-xs text-gray-500 mt-2">Industry avg: 82%</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Pipeline Funnel */}
        <div className="col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recruitment Funnel</h2>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-400">Conversion Rates</span>
            </div>
          </div>
          <div className="space-y-4">
            {data.pipeline.stages.map((stage, index) => (
              <div key={stage.name}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <span className="text-white font-medium">{stage.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-white">{stage.count}</span>
                    <span className="text-sm text-gray-400 w-16 text-right">{stage.percentage}%</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${stage.percentage}%` }}
                  />
                </div>
                {index < data.pipeline.stages.length - 1 && (
                  <div className="flex items-center gap-2 mt-2 ml-11 text-xs text-gray-500">
                    <TrendingDown className="w-3 h-3" />
                    Drop-off: {stage.count - data.pipeline.stages[index + 1].count} candidates
                    ({Math.round(((stage.count - data.pipeline.stages[index + 1].count) / stage.count) * 100)}%)
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Drop-off Reasons */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Top Drop-off Reasons</h2>
          <div className="space-y-4">
            {data.pipeline.dropoffReasons.map((reason, index) => (
              <div key={reason.reason}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-300">{reason.reason}</span>
                  <span className="text-sm font-medium text-white">{reason.count}</span>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      index === 0 ? 'bg-red-500' :
                      index === 1 ? 'bg-orange-500' :
                      'bg-yellow-500'
                    }`}
                    style={{ width: `${reason.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">{reason.percentage}% of total</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Source Effectiveness */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6">Source Effectiveness</h2>
        <div className="grid grid-cols-5 gap-4">
          {data.sources.map((source) => (
            <div
              key={source.name}
              className="bg-gray-900/50 rounded-lg border border-gray-700 p-4 hover:border-purple-500/50 transition-all"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${source.color} flex items-center justify-center mb-3`}>
                <Activity className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-3">{source.name}</h3>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Total Candidates</div>
                  <div className="text-xl font-bold text-white">{source.candidates}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Hired</div>
                  <div className="text-lg font-bold text-green-400">{source.hired}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Hire Rate</div>
                  <div className="text-lg font-bold text-purple-400">{source.hireRate}%</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Avg Cost/Hire</div>
                  <div className="text-sm font-medium text-gray-300">${source.avgCost.toLocaleString()}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Recruiter Performance */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recruiter Performance</h2>
          <div className="space-y-4">
            {data.recruiters.map((recruiter, index) => (
              <div
                key={recruiter.id}
                className="bg-gray-900/50 rounded-lg border border-gray-700 p-4 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white">
                      {recruiter.avatar}
                    </div>
                    <div>
                      <div className="text-white font-medium">{recruiter.name}</div>
                      <div className="text-xs text-gray-400">{recruiter.activeCandidates} active candidates</div>
                    </div>
                  </div>
                  {index === 0 && (
                    <Award className="w-5 h-5 text-yellow-400" />
                  )}
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Placements</div>
                    <div className="text-lg font-bold text-white">{recruiter.placementsThisMonth}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Avg Days</div>
                    <div className="text-lg font-bold text-white">{recruiter.avgTimeToFill}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Acceptance</div>
                    <div className="text-lg font-bold text-white">{recruiter.offerAcceptanceRate}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Rating</div>
                    <div className="text-lg font-bold text-white">{recruiter.satisfaction}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Positions */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Top Hiring Positions</h2>
          <div className="space-y-4">
            {data.topPositions.map((position, index) => (
              <div
                key={position.title}
                className="bg-gray-900/50 rounded-lg border border-gray-700 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-purple-400">#{index + 1}</span>
                      <h3 className="text-white font-medium">{position.title}</h3>
                    </div>
                    <div className="text-xs text-gray-400">{position.applicants} applicants</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Hired</div>
                    <div className="text-lg font-bold text-green-400">{position.hired}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Avg Days</div>
                    <div className="text-lg font-bold text-white">{position.avgDays}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Hire Rate</div>
                    <div className="text-lg font-bold text-purple-400">
                      {((position.hired / position.applicants) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trends Chart Placeholder */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-bold text-white mb-6">Hiring Trends</h2>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-700 rounded-lg">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Chart visualization placeholder</p>
            <p className="text-sm text-gray-500">Candidates over time, time-to-hire trends, conversion rates</p>
          </div>
        </div>
      </div>
    </div>
  )
}
