'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MessageCircle, Clock, CheckCircle, AlertTriangle, XCircle, Plus,
  Search, Filter, Grid, List, Star, User, Calendar, MessageSquare,
  Phone, Mail, MoreVertical, TrendingUp, TrendingDown, Zap, Bug,
  HelpCircle, Settings, Archive, Tag, Eye, Edit, ArrowUpRight
} from 'lucide-react'

// Mock support data
const mockSupportData = {
  stats: {
    totalTickets: 156,
    openTickets: 23,
    resolvedToday: 12,
    avgResponseTime: 2.4,
    customerSatisfaction: 4.6,
    previousMonthTickets: 142,
    previousResponseTime: 2.8,
    previousSatisfaction: 4.4
  },
  tickets: [
    {
      id: 'SUP-2024-001',
      title: 'Login Issues with New Update',
      client: 'TechCorp Solutions',
      clientId: 'c1',
      assignee: 'Sarah Johnson',
      priority: 'high',
      status: 'open',
      category: 'technical',
      tags: ['authentication', 'urgent'],
      createdAt: '2024-03-20T10:30:00Z',
      lastUpdated: '2024-03-20T14:15:00Z',
      description: 'Users unable to login after the latest system update. Multiple authentication failures reported.',
      messages: 8,
      rating: null
    },
    {
      id: 'SUP-2024-002',
      title: 'Feature Request: Dark Mode Support',
      client: 'FinanceHub',
      clientId: 'c2',
      assignee: 'Mike Chen',
      priority: 'medium',
      status: 'in_progress',
      category: 'feature_request',
      tags: ['ui', 'enhancement'],
      createdAt: '2024-03-19T15:20:00Z',
      lastUpdated: '2024-03-20T09:45:00Z',
      description: 'Request to implement dark mode theme for better user experience during night work.',
      messages: 12,
      rating: null
    },
    {
      id: 'SUP-2024-003',
      title: 'Data Export Functionality Not Working',
      client: 'GlobalHR Solutions',
      clientId: 'c3',
      assignee: 'Emily Davis',
      priority: 'high',
      status: 'pending',
      category: 'bug',
      tags: ['export', 'data', 'critical'],
      createdAt: '2024-03-19T11:45:00Z',
      lastUpdated: '2024-03-19T16:30:00Z',
      description: 'CSV export function returns empty files. Users unable to export their data reports.',
      messages: 5,
      rating: null
    },
    {
      id: 'SUP-2024-004',
      title: 'Performance Issues with Large Datasets',
      client: 'RetailChain Pro',
      clientId: 'c4',
      assignee: 'David Wilson',
      priority: 'medium',
      status: 'resolved',
      category: 'performance',
      tags: ['optimization', 'database'],
      createdAt: '2024-03-18T14:20:00Z',
      lastUpdated: '2024-03-20T11:00:00Z',
      description: 'System becomes slow when processing datasets with over 10,000 records.',
      messages: 15,
      rating: 5
    },
    {
      id: 'SUP-2024-005',
      title: 'Integration Setup Assistance Needed',
      client: 'InnovateTech',
      clientId: 'c5',
      assignee: 'Jennifer Lee',
      priority: 'low',
      status: 'resolved',
      category: 'support',
      tags: ['integration', 'api', 'setup'],
      createdAt: '2024-03-17T09:15:00Z',
      lastUpdated: '2024-03-19T13:45:00Z',
      description: 'Need assistance setting up third-party API integration for CRM system.',
      messages: 22,
      rating: 4
    },
    {
      id: 'SUP-2024-006',
      title: 'Mobile App Crashes on iOS 17',
      client: 'MediCare Plus',
      clientId: 'c6',
      assignee: 'Tom Rodriguez',
      priority: 'high',
      status: 'escalated',
      category: 'bug',
      tags: ['mobile', 'ios', 'crash'],
      createdAt: '2024-03-16T16:40:00Z',
      lastUpdated: '2024-03-20T08:20:00Z',
      description: 'Mobile application crashes immediately on launch for iOS 17 devices.',
      messages: 18,
      rating: null
    }
  ],
  categories: [
    { name: 'Technical', count: 45, color: 'from-red-600 to-pink-600', icon: Bug },
    { name: 'Feature Request', count: 28, color: 'from-blue-600 to-cyan-600', icon: Zap },
    { name: 'Bug Report', count: 35, color: 'from-orange-600 to-yellow-600', icon: AlertTriangle },
    { name: 'General Support', count: 32, color: 'from-green-600 to-emerald-600', icon: HelpCircle },
    { name: 'Account Issues', count: 16, color: 'from-purple-600 to-pink-600', icon: User }
  ],
  team: [
    { name: 'Sarah Johnson', role: 'Senior Support Engineer', activeTickets: 8, resolvedToday: 3, avatar: 'SJ' },
    { name: 'Mike Chen', role: 'Technical Support Specialist', activeTickets: 6, resolvedToday: 4, avatar: 'MC' },
    { name: 'Emily Davis', role: 'Customer Success Manager', activeTickets: 5, resolvedToday: 2, avatar: 'ED' },
    { name: 'David Wilson', role: 'Support Engineer', activeTickets: 4, resolvedToday: 3, avatar: 'DW' }
  ]
}

const priorityColors = {
  'low': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  'medium': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'high': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'critical': 'bg-red-500/20 text-red-400 border-red-500/30'
}

const statusColors = {
  'open': 'bg-red-500/20 text-red-400 border-red-500/30',
  'in_progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'pending': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  'resolved': 'bg-green-500/20 text-green-400 border-green-500/30',
  'escalated': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'closed': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
}

const categoryIcons = {
  'technical': Bug,
  'feature_request': Zap,
  'bug': AlertTriangle,
  'support': HelpCircle,
  'performance': TrendingUp
}

export default function SupportPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedPriority, setSelectedPriority] = useState('all')
  const [selectedAssignee, setSelectedAssignee] = useState('all')

  const { stats, tickets, categories, team } = mockSupportData

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || ticket.status === selectedStatus
    const matchesPriority = selectedPriority === 'all' || ticket.priority === selectedPriority
    const matchesAssignee = selectedAssignee === 'all' || ticket.assignee === selectedAssignee
    return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
  })

  // Calculate percentage changes
  const ticketChange = ((stats.totalTickets - stats.previousMonthTickets) / stats.previousMonthTickets * 100)
  const responseTimeChange = ((stats.avgResponseTime - stats.previousResponseTime) / stats.previousResponseTime * 100)
  const satisfactionChange = ((stats.customerSatisfaction - stats.previousSatisfaction) / stats.previousSatisfaction * 100)

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'open': return XCircle
      case 'in_progress': return Clock
      case 'pending': return AlertTriangle
      case 'resolved': return CheckCircle
      case 'escalated': return TrendingUp
      default: return MessageCircle
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Support Dashboard</h1>
          <p className="text-gray-400">Manage customer support tickets and requests</p>
        </div>

        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-800 transition-colors flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
          <button className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Ticket</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-blue">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${ticketChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {ticketChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{Math.abs(ticketChange).toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.totalTickets}</p>
          <p className="text-gray-400 text-sm">Total Tickets</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-red">
              <XCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.openTickets}</span>
          </div>
          <p className="text-gray-400 text-sm">Open Tickets</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-green">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.resolvedToday}</span>
          </div>
          <p className="text-gray-400 text-sm">Resolved Today</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-orange">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${responseTimeChange <= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {responseTimeChange <= 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
              <span>{Math.abs(responseTimeChange).toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.avgResponseTime}h</p>
          <p className="text-gray-400 text-sm">Avg Response</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-purple">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${satisfactionChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {satisfactionChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              <span>{Math.abs(satisfactionChange).toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-white">{stats.customerSatisfaction}</p>
          <p className="text-gray-400 text-sm">Satisfaction</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Support Categories */}
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Categories</h3>
          <div className="space-y-3">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <div key={category.name} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${category.color} flex items-center justify-center`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-white font-medium">{category.name}</span>
                  </div>
                  <span className="text-gray-400">{category.count}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Tickets List/Grid */}
        <div className="lg:col-span-3 space-y-4">
          {/* Filters */}
          <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="escalated">Escalated</option>
                </select>

                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>

                <div className="flex items-center bg-gray-800/50 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tickets */}
          {viewMode === 'list' ? (
            <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800">
              <table className="w-full">
                <thead className="border-b border-gray-800">
                  <tr>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Ticket</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Client</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Assignee</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Priority</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Updated</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => {
                    const StatusIcon = getStatusIcon(ticket.status)
                    const CategoryIcon = categoryIcons[ticket.category] || MessageCircle

                    return (
                      <tr key={ticket.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <CategoryIcon className="h-4 w-4 text-gray-400" />
                            <div>
                              <Link href={`/dashboard/support/${ticket.id}`} className="text-white font-medium hover:text-purple-400 transition-colors">
                                {ticket.title}
                              </Link>
                              <p className="text-xs text-gray-400 font-mono">{ticket.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <Link href={`/dashboard/clients/${ticket.clientId}`} className="text-white hover:text-purple-400 transition-colors">
                            {ticket.client}
                          </Link>
                        </td>
                        <td className="py-4 px-6 text-gray-300">{ticket.assignee}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-1 rounded-lg text-xs border ${priorityColors[ticket.priority]}`}>
                            {ticket.priority.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <StatusIcon className="h-4 w-4 text-gray-400" />
                            <span className={`px-2 py-1 rounded-lg text-xs border ${statusColors[ticket.status]}`}>
                              {ticket.status.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-300 text-sm">
                          {new Date(ticket.lastUpdated).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <Link
                              href={`/dashboard/support/${ticket.id}`}
                              className="p-1 rounded hover:bg-gray-700 transition-colors"
                            >
                              <Eye className="h-4 w-4 text-gray-400" />
                            </Link>
                            <button className="p-1 rounded hover:bg-gray-700 transition-colors">
                              <Edit className="h-4 w-4 text-gray-400" />
                            </button>
                            <button className="p-1 rounded hover:bg-gray-700 transition-colors">
                              <MoreVertical className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTickets.map((ticket) => {
                const StatusIcon = getStatusIcon(ticket.status)
                const CategoryIcon = categoryIcons[ticket.category] || MessageCircle

                return (
                  <Link
                    key={ticket.id}
                    href={`/dashboard/support/${ticket.id}`}
                    className="rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6 hover:border-purple-500/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <CategoryIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                            {ticket.title}
                          </h3>
                          <p className="text-xs text-gray-400 font-mono">{ticket.id}</p>
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                    </div>

                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">{ticket.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="text-sm">
                        <p className="text-white font-medium">{ticket.client}</p>
                        <p className="text-gray-400">Assigned to {ticket.assignee}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageSquare className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400 text-sm">{ticket.messages}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-lg text-xs border ${priorityColors[ticket.priority]}`}>
                          {ticket.priority.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded-lg text-xs border ${statusColors[ticket.status]}`}>
                          {ticket.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(ticket.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>

                    {ticket.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {ticket.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-lg bg-gray-800/50 text-xs text-gray-400">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Team Performance */}
      <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Team Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {team.map((member, index) => (
            <div key={member.name} className="p-4 rounded-lg bg-gray-800/30">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full gradient-purple flex items-center justify-center text-white font-bold">
                  {member.avatar}
                </div>
                <div>
                  <p className="text-white font-medium">{member.name}</p>
                  <p className="text-xs text-gray-400">{member.role}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Active Tickets</span>
                  <span className="text-white">{member.activeTickets}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Resolved Today</span>
                  <span className="text-green-400">{member.resolvedToday}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}