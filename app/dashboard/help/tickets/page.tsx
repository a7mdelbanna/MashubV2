'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  User,
  Calendar,
  Tag,
  MoreVertical,
  ArrowUpRight,
  RefreshCw,
  Download,
  TrendingUp,
  Zap
} from 'lucide-react'
import { SupportTicket, TicketStatus, TicketPriority, TicketType } from '@/types/help'
import {
  getTicketStatusColor,
  getTicketPriorityColor,
  formatTicketStatus,
  formatTicketPriority,
  formatTicketType,
  formatResponseTime,
  calculateResponseTime,
  needsResponse,
  getTimeRemaining,
  getTicketDueDate
} from '@/lib/help-utils'

// Mock tickets data
const mockTickets: SupportTicket[] = [
  {
    id: 'tick-1',
    tenantId: 'tenant-1',
    ticketNumber: 'TICK-10245',
    subject: 'Unable to access team dashboard',
    description: 'I\'m getting a 403 error when trying to access the team dashboard page. This started happening this morning.',
    type: 'technical_issue',
    status: 'in_progress',
    priority: 'high',
    requesterId: 'user-1',
    requesterName: 'Sarah Johnson',
    requesterEmail: 'sarah.johnson@company.com',
    assignedTo: {
      agentId: 'agent-1',
      agentName: 'Michael Chen',
      agentEmail: 'michael@support.com'
    },
    team: 'Technical Support',
    messages: [
      {
        id: 'msg-1',
        ticketId: 'tick-1',
        senderId: 'user-1',
        senderName: 'Sarah Johnson',
        senderType: 'customer',
        content: 'I\'m getting a 403 error when trying to access the team dashboard page.',
        isPrivate: false,
        createdAt: '2025-10-13T08:30:00Z'
      },
      {
        id: 'msg-2',
        ticketId: 'tick-1',
        senderId: 'agent-1',
        senderName: 'Michael Chen',
        senderType: 'agent',
        content: 'Thanks for reaching out. I\'m looking into this issue now. Can you tell me which team you\'re trying to access?',
        isPrivate: false,
        createdAt: '2025-10-13T08:45:00Z'
      }
    ],
    internalNotes: [],
    attachments: [],
    tags: ['dashboard', 'permissions', 'error'],
    firstResponseAt: '2025-10-13T08:45:00Z',
    lastResponseAt: '2025-10-13T08:45:00Z',
    responseTime: 15,
    createdAt: '2025-10-13T08:30:00Z',
    updatedAt: '2025-10-13T08:45:00Z'
  },
  {
    id: 'tick-2',
    tenantId: 'tenant-1',
    ticketNumber: 'TICK-10244',
    subject: 'Feature Request: Export to Excel',
    description: 'Would love to see an option to export reports directly to Excel format instead of just CSV.',
    type: 'feature_request',
    status: 'open',
    priority: 'medium',
    requesterId: 'user-2',
    requesterName: 'David Wilson',
    requesterEmail: 'david.wilson@company.com',
    messages: [
      {
        id: 'msg-3',
        ticketId: 'tick-2',
        senderId: 'user-2',
        senderName: 'David Wilson',
        senderType: 'customer',
        content: 'Would love to see an option to export reports directly to Excel format.',
        isPrivate: false,
        createdAt: '2025-10-12T14:20:00Z'
      }
    ],
    internalNotes: [],
    attachments: [],
    tags: ['feature-request', 'export', 'reports'],
    createdAt: '2025-10-12T14:20:00Z',
    updatedAt: '2025-10-12T14:20:00Z'
  },
  {
    id: 'tick-3',
    tenantId: 'tenant-1',
    ticketNumber: 'TICK-10243',
    subject: 'Billing question about annual plan',
    description: 'I want to upgrade to the annual plan. Will I get a refund for my remaining monthly subscription?',
    type: 'billing',
    status: 'resolved',
    priority: 'low',
    requesterId: 'user-3',
    requesterName: 'Emily Davis',
    requesterEmail: 'emily.davis@company.com',
    assignedTo: {
      agentId: 'agent-2',
      agentName: 'Jessica Park',
      agentEmail: 'jessica@support.com'
    },
    team: 'Billing Support',
    messages: [
      {
        id: 'msg-4',
        ticketId: 'tick-3',
        senderId: 'user-3',
        senderName: 'Emily Davis',
        senderType: 'customer',
        content: 'I want to upgrade to the annual plan. Will I get a refund?',
        isPrivate: false,
        createdAt: '2025-10-11T10:15:00Z'
      },
      {
        id: 'msg-5',
        ticketId: 'tick-3',
        senderId: 'agent-2',
        senderName: 'Jessica Park',
        senderType: 'agent',
        content: 'Yes! When you upgrade, we\'ll prorate your remaining monthly subscription and apply it as credit.',
        isPrivate: false,
        createdAt: '2025-10-11T10:30:00Z'
      }
    ],
    internalNotes: [],
    attachments: [],
    tags: ['billing', 'upgrade', 'annual-plan'],
    resolution: 'Explained prorating policy for plan upgrades',
    resolvedAt: '2025-10-11T10:30:00Z',
    resolvedBy: 'agent-2',
    firstResponseAt: '2025-10-11T10:30:00Z',
    lastResponseAt: '2025-10-11T10:30:00Z',
    responseTime: 15,
    resolutionTime: 15,
    satisfaction: {
      rating: 5,
      feedback: 'Quick and helpful response!',
      submittedAt: '2025-10-11T11:00:00Z'
    },
    createdAt: '2025-10-11T10:15:00Z',
    updatedAt: '2025-10-11T10:30:00Z'
  },
  {
    id: 'tick-4',
    tenantId: 'tenant-1',
    ticketNumber: 'TICK-10242',
    subject: 'Critical: Cannot send emails',
    description: 'Email notifications have stopped working completely. None of our team members are receiving any emails from the system.',
    type: 'bug',
    status: 'open',
    priority: 'urgent',
    requesterId: 'user-4',
    requesterName: 'Robert Brown',
    requesterEmail: 'robert.brown@company.com',
    messages: [
      {
        id: 'msg-6',
        ticketId: 'tick-4',
        senderId: 'user-4',
        senderName: 'Robert Brown',
        senderType: 'customer',
        content: 'Email notifications have stopped working completely. This is urgent!',
        isPrivate: false,
        createdAt: '2025-10-13T09:00:00Z'
      }
    ],
    internalNotes: [],
    attachments: [],
    tags: ['email', 'notifications', 'critical'],
    createdAt: '2025-10-13T09:00:00Z',
    updatedAt: '2025-10-13T09:00:00Z'
  },
  {
    id: 'tick-5',
    tenantId: 'tenant-1',
    ticketNumber: 'TICK-10241',
    subject: 'API documentation unclear',
    description: 'The authentication section in the API docs doesn\'t explain how to refresh tokens.',
    type: 'question',
    status: 'waiting_response',
    priority: 'medium',
    requesterId: 'user-5',
    requesterName: 'Lisa Anderson',
    requesterEmail: 'lisa.anderson@company.com',
    assignedTo: {
      agentId: 'agent-3',
      agentName: 'Tom Richards',
      agentEmail: 'tom@support.com'
    },
    team: 'Developer Support',
    messages: [
      {
        id: 'msg-7',
        ticketId: 'tick-5',
        senderId: 'user-5',
        senderName: 'Lisa Anderson',
        senderType: 'customer',
        content: 'The authentication section doesn\'t explain how to refresh tokens.',
        isPrivate: false,
        createdAt: '2025-10-12T16:30:00Z'
      },
      {
        id: 'msg-8',
        ticketId: 'tick-5',
        senderId: 'agent-3',
        senderName: 'Tom Richards',
        senderType: 'agent',
        content: 'I\'ve sent you a detailed guide on token refresh. Please check your email and let me know if you have any questions.',
        isPrivate: false,
        createdAt: '2025-10-12T17:00:00Z'
      }
    ],
    internalNotes: [],
    attachments: [],
    tags: ['api', 'documentation', 'authentication'],
    firstResponseAt: '2025-10-12T17:00:00Z',
    lastResponseAt: '2025-10-12T17:00:00Z',
    responseTime: 30,
    createdAt: '2025-10-12T16:30:00Z',
    updatedAt: '2025-10-12T17:00:00Z'
  }
]

export default function TicketsPage() {
  const [tickets] = useState<SupportTicket[]>(mockTickets)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<TicketPriority | 'all'>('all')
  const [filterType, setFilterType] = useState<TicketType | 'all'>('all')

  // Calculate stats
  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open' || t.status === 'in_progress' || t.status === 'waiting_response').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    urgent: tickets.filter(t => t.priority === 'urgent' && t.status !== 'resolved' && t.status !== 'closed').length,
    avgResponseTime: Math.round(
      tickets.filter(t => t.responseTime).reduce((sum, t) => sum + (t.responseTime || 0), 0) /
      tickets.filter(t => t.responseTime).length
    )
  }

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.ticketNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.requesterName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus
    const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority
    const matchesType = filterType === 'all' || ticket.type === filterType

    return matchesSearch && matchesStatus && matchesPriority && matchesType
  })

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Support Tickets</h1>
          <p className="text-gray-400">Manage and track support requests</p>
        </div>
        <Link
          href="/dashboard/help/tickets/new"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Ticket
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Total Tickets</div>
            <MessageSquare className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Open</div>
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.open}</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Resolved</div>
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.resolved}</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Urgent</div>
            <Zap className="w-5 h-5 text-red-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.urgent}</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Avg Response</div>
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{formatResponseTime(stats.avgResponseTime)}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700 p-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search tickets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="waiting_response">Waiting Response</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Types</option>
            <option value="question">Question</option>
            <option value="bug">Bug</option>
            <option value="feature_request">Feature Request</option>
            <option value="technical_issue">Technical Issue</option>
            <option value="billing">Billing</option>
            <option value="account">Account</option>
            <option value="other">Other</option>
          </select>

          <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
            <RefreshCw className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Tickets List */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-900/50 border-b border-gray-700">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Ticket</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Requester</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Priority</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Type</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Assigned To</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Created</th>
              <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map((ticket, index) => {
              const dueDate = getTicketDueDate(ticket)
              const timeRemaining = dueDate ? getTimeRemaining(dueDate) : null

              return (
                <tr
                  key={ticket.id}
                  className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${
                    index === filteredTickets.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="p-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Link
                          href={`/dashboard/help/tickets/${ticket.id}`}
                          className="font-medium text-white hover:text-purple-400 transition-colors"
                        >
                          {ticket.ticketNumber}
                        </Link>
                        {needsResponse(ticket) && (
                          <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded">
                            Needs Response
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400 line-clamp-1">{ticket.subject}</div>
                      {ticket.tags.length > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          {ticket.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-2 py-0.5 bg-gray-700 text-gray-300 text-xs rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="text-sm font-medium text-white">{ticket.requesterName}</div>
                      <div className="text-xs text-gray-400">{ticket.requesterEmail}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTicketStatusColor(ticket.status)}`}>
                      {formatTicketStatus(ticket.status)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTicketPriorityColor(ticket.priority)}`}>
                      {formatTicketPriority(ticket.priority)}
                    </span>
                    {timeRemaining && (
                      <div className={`text-xs mt-1 ${
                        timeRemaining === 'Overdue' ? 'text-red-400' : 'text-gray-500'
                      }`}>
                        {timeRemaining}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-sm text-gray-300">{formatTicketType(ticket.type)}</td>
                  <td className="p-4">
                    {ticket.assignedTo ? (
                      <div>
                        <div className="text-sm text-white">{ticket.assignedTo.agentName}</div>
                        <div className="text-xs text-gray-400">{ticket.team}</div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Unassigned</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-300">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/help/tickets/${ticket.id}`}
                        className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                      >
                        <ArrowUpRight className="w-4 h-4 text-gray-400" />
                      </Link>
                      <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {filteredTickets.length === 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-12 text-center mt-6">
          <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No tickets found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your filters or create a new ticket</p>
          <Link
            href="/dashboard/help/tickets/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Ticket
          </Link>
        </div>
      )}
    </div>
  )
}
