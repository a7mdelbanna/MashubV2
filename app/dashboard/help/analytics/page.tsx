'use client'

import { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  Eye,
  ThumbsUp,
  MessageSquare,
  Clock,
  Users,
  FileText,
  Search,
  Award,
  Target,
  Zap,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Download,
  Calendar
} from 'lucide-react'

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalArticles: 133,
    publishedArticles: 128,
    totalViews: 45623,
    totalSearches: 12456,
    avgHelpfulRate: 91,
    totalTickets: 428,
    resolvedTickets: 356,
    avgResponseTime: 12, // minutes
    avgResolutionTime: 180, // minutes
    customerSatisfaction: 4.7
  },
  trends: {
    viewsOverTime: [
      { month: 'Apr', views: 32145, searches: 8456 },
      { month: 'May', views: 35678, searches: 9234 },
      { month: 'Jun', views: 38932, searches: 10123 },
      { month: 'Jul', views: 41245, searches: 11245 },
      { month: 'Aug', views: 43156, searches: 11834 },
      { month: 'Sep', views: 45623, searches: 12456 }
    ],
    ticketsOverTime: [
      { month: 'Apr', total: 298, resolved: 245 },
      { month: 'May', total: 324, resolved: 276 },
      { month: 'Jun', total: 356, resolved: 298 },
      { month: 'Jul', total: 389, resolved: 324 },
      { month: 'Aug', total: 412, resolved: 342 },
      { month: 'Sep', total: 428, resolved: 356 }
    ]
  },
  topArticles: [
    { title: 'Getting Started Guide', views: 4523, helpful: 95, readTime: 5 },
    { title: 'Advanced Features', views: 3215, helpful: 92, readTime: 12 },
    { title: 'Slack Integration', views: 2876, helpful: 94, readTime: 10 },
    { title: 'API Documentation', views: 1987, helpful: 88, readTime: 15 },
    { title: 'Troubleshooting', views: 1654, helpful: 86, readTime: 8 }
  ],
  topSearches: [
    { query: 'how to reset password', count: 856, results: 5 },
    { query: 'api authentication', count: 623, results: 8 },
    { query: 'slack integration', count: 542, results: 6 },
    { query: 'billing question', count: 487, results: 4 },
    { query: 'mobile app', count: 398, results: 7 }
  ],
  categoryBreakdown: [
    { category: 'Getting Started', articles: 12, views: 8234, helpful: 94 },
    { category: 'Features', articles: 24, views: 12456, helpful: 91 },
    { category: 'Integrations', articles: 18, views: 9876, helpful: 93 },
    { category: 'Troubleshooting', articles: 15, views: 7654, helpful: 87 },
    { category: 'Billing', articles: 8, views: 3245, helpful: 92 },
    { category: 'API', articles: 32, views: 6789, helpful: 89 },
    { category: 'Security', articles: 10, views: 2987, helpful: 95 },
    { category: 'Mobile', articles: 14, views: 4521, helpful: 90 }
  ],
  agents: [
    {
      name: 'Michael Chen',
      activeTickets: 12,
      resolvedTickets: 89,
      avgResponseTime: 8,
      avgResolutionTime: 145,
      satisfaction: 4.9
    },
    {
      name: 'Emily Davis',
      activeTickets: 8,
      resolvedTickets: 76,
      avgResponseTime: 10,
      avgResolutionTime: 156,
      satisfaction: 4.8
    },
    {
      name: 'David Wilson',
      activeTickets: 15,
      resolvedTickets: 92,
      avgResponseTime: 12,
      avgResolutionTime: 178,
      satisfaction: 4.7
    },
    {
      name: 'Sarah Johnson',
      activeTickets: 10,
      resolvedTickets: 82,
      avgResponseTime: 9,
      avgResolutionTime: 152,
      satisfaction: 4.8
    }
  ],
  ticketsByType: [
    { type: 'Question', count: 156, avgTime: 120 },
    { type: 'Bug', count: 89, avgTime: 240 },
    { type: 'Feature Request', count: 67, avgTime: 180 },
    { type: 'Technical Issue', count: 54, avgTime: 210 },
    { type: 'Billing', count: 42, avgTime: 90 },
    { type: 'Account', count: 20, avgTime: 150 }
  ]
}

export default function HelpAnalyticsPage() {
  const [dateRange, setDateRange] = useState('last_30_days')

  const data = mockAnalytics

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Help Center Analytics</h1>
          <p className="text-gray-400">Track performance and optimize your support operations</p>
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
          </select>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              +15%
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{data.overview.totalViews.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Total Views</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              +12%
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{data.overview.totalSearches.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Searches</div>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              +3%
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{data.overview.avgHelpfulRate}%</div>
          <div className="text-sm text-gray-400">Helpful Rate</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-600 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingDown className="w-4 h-4" />
              -8%
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{data.overview.avgResponseTime}m</div>
          <div className="text-sm text-gray-400">Avg Response</div>
        </div>

        <div className="bg-gradient-to-br from-pink-500/20 to-rose-500/20 rounded-lg border border-pink-500/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-pink-600 flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              +0.2
            </div>
          </div>
          <div className="text-3xl font-bold text-white mb-1">{data.overview.customerSatisfaction}</div>
          <div className="text-sm text-gray-400">CSAT Score</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Views & Searches Trend */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Knowledge Base Activity</h2>
          <div className="space-y-4">
            {data.trends.viewsOverTime.map((month, index) => (
              <div key={month.month} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{month.month}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-blue-400">{month.views.toLocaleString()} views</span>
                    <span className="text-purple-400">{month.searches.toLocaleString()} searches</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: `${(month.views / 50000) * 100}%` }}
                    />
                  </div>
                  <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: `${(month.searches / 15000) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticket Resolution Trend */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Ticket Resolution Trend</h2>
          <div className="space-y-4">
            {data.trends.ticketsOverTime.map((month) => {
              const resolutionRate = Math.round((month.resolved / month.total) * 100)

              return (
                <div key={month.month} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{month.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-white">{month.total} total</span>
                      <span className="text-green-400">{month.resolved} resolved</span>
                      <span className="text-purple-400">{resolutionRate}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                      style={{ width: `${resolutionRate}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Top Articles */}
        <div className="col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Top Performing Articles</h2>
          <div className="space-y-4">
            {data.topArticles.map((article, index) => (
              <div key={article.title} className="flex items-center gap-4 p-4 bg-gray-900/50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                  index === 0 ? 'bg-yellow-500' :
                  index === 1 ? 'bg-gray-400' :
                  index === 2 ? 'bg-orange-500' :
                  'bg-gray-700'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-white mb-1">{article.title}</div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{article.views.toLocaleString()} views</span>
                    <span>•</span>
                    <span>{article.helpful}% helpful</span>
                    <span>•</span>
                    <span>{article.readTime} min read</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    article.helpful >= 90 ? 'bg-green-500/20 text-green-400' :
                    article.helpful >= 85 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {article.helpful}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Searches */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Popular Searches</h2>
          <div className="space-y-3">
            {data.topSearches.map((search, index) => (
              <div key={search.query} className="p-3 bg-gray-900/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-500 text-sm">#{index + 1}</span>
                  <span className="text-white font-medium flex-1">{search.query}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{search.count} searches</span>
                  <span>•</span>
                  <span>{search.results} results</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
        <h2 className="text-xl font-bold text-white mb-6">Content by Category</h2>
        <div className="grid grid-cols-4 gap-4">
          {data.categoryBreakdown.map((cat) => (
            <div key={cat.category} className="bg-gray-900/50 rounded-lg border border-gray-700 p-4">
              <h3 className="font-semibold text-white mb-3">{cat.category}</h3>
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-gray-400 mb-1">Articles</div>
                  <div className="text-2xl font-bold text-white">{cat.articles}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Views</div>
                  <div className="text-lg font-semibold text-purple-400">{cat.views.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400 mb-1">Helpful Rate</div>
                  <div className={`text-lg font-semibold ${
                    cat.helpful >= 90 ? 'text-green-400' :
                    cat.helpful >= 85 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {cat.helpful}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Agent Performance */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Agent Performance</h2>
          <div className="space-y-4">
            {data.agents.map((agent, index) => (
              <div key={agent.name} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                      {agent.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{agent.name}</div>
                      <div className="text-xs text-gray-400">{agent.activeTickets} active tickets</div>
                    </div>
                  </div>
                  {index === 0 && <Award className="w-5 h-5 text-yellow-400" />}
                </div>
                <div className="grid grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Resolved</div>
                    <div className="font-semibold text-white">{agent.resolvedTickets}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Response</div>
                    <div className="font-semibold text-white">{agent.avgResponseTime}m</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Resolution</div>
                    <div className="font-semibold text-white">{Math.round(agent.avgResolutionTime / 60)}h</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-1">CSAT</div>
                    <div className="font-semibold text-green-400">{agent.satisfaction}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tickets by Type */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-6">Tickets by Type</h2>
          <div className="space-y-4">
            {data.ticketsByType.map((type) => {
              const percentage = (type.count / data.overview.totalTickets) * 100

              return (
                <div key={type.type}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{type.type}</span>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-gray-400">{type.count} tickets</span>
                      <span className="text-purple-400">{Math.round(type.avgTime / 60)}h avg</span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% of total</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
