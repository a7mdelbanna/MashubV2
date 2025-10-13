'use client'

import { useState } from 'react'
import {
  DollarSign,
  TrendingUp,
  Target,
  Award,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Building2,
  Clock,
  CheckCircle,
  X,
  MoreVertical,
  Edit2,
  Trash2,
  ArrowRight
} from 'lucide-react'

type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'
type DealPriority = 'low' | 'medium' | 'high' | 'urgent'

interface Deal {
  id: string
  clientId: string
  clientName: string
  title: string
  value: number
  stage: DealStage
  priority: DealPriority
  probability: number
  expectedCloseDate: string
  owner: string
  createdAt: string
  lastActivity: string
  description: string
  tags: string[]
}

const mockDeals: Deal[] = [
  {
    id: 'd1',
    clientId: 'c1',
    clientName: 'TechCorp Inc.',
    title: 'Enterprise Platform Upgrade',
    value: 485000,
    stage: 'negotiation',
    priority: 'high',
    probability: 75,
    expectedCloseDate: '2024-03-15',
    owner: 'Sarah Johnson',
    createdAt: '2024-02-01',
    lastActivity: '2024-03-01',
    description: 'Upgrade to enterprise tier with custom integrations and dedicated support',
    tags: ['enterprise', 'upgrade', 'high-value']
  },
  {
    id: 'd2',
    clientId: 'c7',
    clientName: 'StartupVentures',
    title: 'Initial Platform Setup',
    value: 45000,
    stage: 'qualified',
    priority: 'medium',
    probability: 60,
    expectedCloseDate: '2024-03-20',
    owner: 'Michael Chen',
    createdAt: '2024-02-10',
    lastActivity: '2024-02-28',
    description: 'New client onboarding for startup package',
    tags: ['new-client', 'startup']
  },
  {
    id: 'd3',
    clientId: 'c3',
    clientName: 'GlobalHR Solutions',
    title: 'HR Module Expansion',
    value: 125000,
    stage: 'proposal',
    priority: 'high',
    probability: 70,
    expectedCloseDate: '2024-03-25',
    owner: 'Emily Davis',
    createdAt: '2024-02-05',
    lastActivity: '2024-02-29',
    description: 'Add recruitment and performance management modules',
    tags: ['expansion', 'hr-tech']
  },
  {
    id: 'd4',
    clientId: 'c8',
    clientName: 'SecureFinance Co.',
    title: 'Security Compliance Package',
    value: 285000,
    stage: 'qualified',
    priority: 'urgent',
    probability: 65,
    expectedCloseDate: '2024-03-10',
    owner: 'David Wilson',
    createdAt: '2024-02-12',
    lastActivity: '2024-03-02',
    description: 'SOC 2 compliance and security audit services',
    tags: ['security', 'compliance', 'financial']
  },
  {
    id: 'd5',
    clientId: 'c4',
    clientName: 'RetailChain Pro',
    title: 'Multi-location Deployment',
    value: 195000,
    stage: 'negotiation',
    priority: 'high',
    probability: 80,
    expectedCloseDate: '2024-03-18',
    owner: 'Sarah Johnson',
    createdAt: '2024-01-28',
    lastActivity: '2024-03-01',
    description: 'Deploy platform across 15 retail locations',
    tags: ['retail', 'multi-location']
  },
  {
    id: 'd6',
    clientId: 'c9',
    clientName: 'EduTech Academy',
    title: 'Learning Management System',
    value: 78000,
    stage: 'proposal',
    priority: 'medium',
    probability: 55,
    expectedCloseDate: '2024-03-30',
    owner: 'Michael Chen',
    createdAt: '2024-02-15',
    lastActivity: '2024-02-27',
    description: 'Custom LMS for online education platform',
    tags: ['education', 'lms']
  },
  {
    id: 'd7',
    clientId: 'c10',
    clientName: 'HealthPlus Network',
    title: 'HIPAA Compliant Platform',
    value: 385000,
    stage: 'lead',
    priority: 'high',
    probability: 40,
    expectedCloseDate: '2024-04-15',
    owner: 'Emily Davis',
    createdAt: '2024-02-20',
    lastActivity: '2024-02-26',
    description: 'Healthcare data management with HIPAA compliance',
    tags: ['healthcare', 'hipaa', 'enterprise']
  },
  {
    id: 'd8',
    clientId: 'c2',
    clientName: 'FinanceHub',
    title: 'API Integration Package',
    value: 95000,
    stage: 'closed_won',
    priority: 'medium',
    probability: 100,
    expectedCloseDate: '2024-02-28',
    owner: 'David Wilson',
    createdAt: '2024-01-15',
    lastActivity: '2024-02-28',
    description: 'Custom API integrations with banking systems',
    tags: ['api', 'integration', 'finance']
  }
]

const stages: { value: DealStage; label: string; color: string }[] = [
  { value: 'lead', label: 'Lead', color: 'bg-blue-500' },
  { value: 'qualified', label: 'Qualified', color: 'bg-cyan-500' },
  { value: 'proposal', label: 'Proposal', color: 'bg-purple-500' },
  { value: 'negotiation', label: 'Negotiation', color: 'bg-orange-500' },
  { value: 'closed_won', label: 'Closed Won', color: 'bg-green-500' },
  { value: 'closed_lost', label: 'Closed Lost', color: 'bg-red-500' }
]

export default function ClientDealsPage() {
  const [deals, setDeals] = useState<Deal[]>(mockDeals)
  const [viewMode, setViewMode] = useState<'pipeline' | 'list'>('pipeline')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStage, setFilterStage] = useState<DealStage | 'all'>('all')

  // Calculate stats
  const stats = {
    totalValue: deals.reduce((sum, d) => sum + d.value, 0),
    weightedValue: deals.reduce((sum, d) => sum + (d.value * (d.probability / 100)), 0),
    activeDeals: deals.filter(d => !d.stage.startsWith('closed')).length,
    wonThisMonth: deals.filter(d => d.stage === 'closed_won').length,
    avgDealSize: deals.reduce((sum, d) => sum + d.value, 0) / deals.length,
    winRate: (deals.filter(d => d.stage === 'closed_won').length / deals.filter(d => d.stage.startsWith('closed')).length) * 100
  }

  // Filter deals
  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStage = filterStage === 'all' || deal.stage === filterStage

    return matchesSearch && matchesStage
  })

  const getDealsByStage = (stage: DealStage) => {
    return filteredDeals.filter(d => d.stage === stage)
  }

  const getPriorityColor = (priority: DealPriority) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'medium': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Sales Pipeline</h1>
          <p className="text-gray-400">Manage deals and track revenue opportunities</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'pipeline'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              List
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            <Plus className="w-5 h-5" />
            New Deal
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">${(stats.totalValue / 1000).toFixed(0)}k</p>
          <p className="text-sm text-gray-400">Total Pipeline</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">${(stats.weightedValue / 1000).toFixed(0)}k</p>
          <p className="text-sm text-gray-400">Weighted Value</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.activeDeals}</p>
          <p className="text-sm text-gray-400">Active Deals</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.wonThisMonth}</p>
          <p className="text-sm text-gray-400">Won This Month</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">${(stats.avgDealSize / 1000).toFixed(0)}k</p>
          <p className="text-sm text-gray-400">Avg Deal Size</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.winRate.toFixed(0)}%</p>
          <p className="text-sm text-gray-400">Win Rate</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          {viewMode === 'list' && (
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value as DealStage | 'all')}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Stages</option>
              {stages.map((stage) => (
                <option key={stage.value} value={stage.value}>
                  {stage.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Pipeline View */}
      {viewMode === 'pipeline' && (
        <div className="grid grid-cols-5 gap-4">
          {stages.filter(s => !s.value.startsWith('closed')).map((stage) => {
            const stageDeals = getDealsByStage(stage.value)
            const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0)

            return (
              <div key={stage.value} className="flex flex-col h-full">
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{stage.label}</h3>
                    <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                      {stageDeals.length}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    ${(stageValue / 1000).toFixed(0)}k
                  </p>
                </div>

                <div className="space-y-3 flex-1">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4 hover:bg-gray-700/50 transition-colors cursor-pointer"
                    >
                      <h4 className="font-medium text-white mb-2">{deal.title}</h4>
                      <p className="text-sm text-gray-400 mb-3">{deal.clientName}</p>

                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-green-400">
                          ${(deal.value / 1000).toFixed(0)}k
                        </span>
                        <span className="text-sm text-gray-400">{deal.probability}%</span>
                      </div>

                      <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden mb-3">
                        <div
                          className={`h-full ${stage.color}`}
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {deal.owner.split(' ')[0]}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(deal.expectedCloseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="space-y-4">
          {filteredDeals.map((deal) => {
            const stage = stages.find(s => s.value === deal.stage)

            return (
              <div
                key={deal.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:bg-gray-700/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{deal.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(deal.priority)}`}>
                        {deal.priority}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${stage?.color} text-white`}>
                        {stage?.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {deal.clientName}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {deal.owner}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Close: {new Date(deal.expectedCloseDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        Updated {new Date(deal.lastActivity).toLocaleDateString()}
                      </div>
                    </div>

                    <p className="text-gray-300 mb-4">{deal.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {deal.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start gap-4 ml-6">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white mb-1">
                        ${(deal.value / 1000).toFixed(0)}k
                      </p>
                      <div className="flex items-center gap-1 text-sm text-gray-400">
                        <Target className="w-4 h-4" />
                        {deal.probability}% probability
                      </div>
                      <p className="text-sm text-green-400 mt-1">
                        ${((deal.value * deal.probability) / 100 / 1000).toFixed(0)}k weighted
                      </p>
                    </div>
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <MoreVertical className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="w-2/3">
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                        <span>Deal Progress</span>
                        <span>{deal.probability}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${stage?.color}`}
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
