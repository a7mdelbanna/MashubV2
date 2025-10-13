'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Phone,
  Mail,
  Video,
  MessageSquare,
  Calendar,
  FileText,
  User,
  Clock,
  Tag,
  Plus,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  X,
  Paperclip,
  Send,
  MoreVertical,
  Edit2,
  Trash2,
  Users,
  Building2,
  TrendingUp,
  Activity
} from 'lucide-react'
import { Communication, CommunicationType, CommunicationChannel } from '@/types/clients'

// Mock interactions data
const mockInteractions: Communication[] = [
  {
    id: 'comm-1',
    clientId: 'c1',
    contactPersonId: 'cp1',
    type: 'meeting',
    channel: 'video_call',
    subject: 'Q1 Business Review Meeting',
    content: 'Discussed project performance, upcoming initiatives, and budget allocation for Q2. Client expressed satisfaction with delivery timeline and requested additional features for the mobile app.',
    direction: 'outbound',
    userId: 'u1',
    userName: 'Sarah Johnson',
    attachments: [
      { id: 'a1', fileName: 'Q1_Performance_Report.pdf', fileType: 'pdf', fileSize: 2458000, fileUrl: '/files/q1-report.pdf' }
    ],
    scheduledFor: '2024-03-01T10:00:00Z',
    completedAt: '2024-03-01T11:30:00Z',
    requiresFollowUp: true,
    followUpDate: '2024-03-15',
    followUpCompleted: false,
    duration: 90,
    tags: ['quarterly-review', 'strategic'],
    createdAt: '2024-03-01T11:30:00Z',
    updatedAt: '2024-03-01T11:30:00Z'
  },
  {
    id: 'comm-2',
    clientId: 'c1',
    contactPersonId: 'cp1',
    type: 'email',
    channel: 'email',
    subject: 'Project Milestone Completed',
    content: 'Hi John, I\'m pleased to inform you that we\'ve completed the Phase 2 development milestone ahead of schedule. The new features are now ready for UAT. Please review the attached documentation and let us know if you have any questions.',
    direction: 'outbound',
    userId: 'u2',
    userName: 'Michael Chen',
    attachments: [
      { id: 'a2', fileName: 'Phase2_Documentation.pdf', fileType: 'pdf', fileSize: 1845000, fileUrl: '/files/phase2-docs.pdf' },
      { id: 'a3', fileName: 'UAT_Guide.docx', fileType: 'docx', fileSize: 485000, fileUrl: '/files/uat-guide.docx' }
    ],
    scheduledFor: undefined,
    completedAt: '2024-02-28T14:22:00Z',
    requiresFollowUp: true,
    followUpDate: '2024-03-05',
    followUpCompleted: true,
    duration: undefined,
    tags: ['milestone', 'development'],
    createdAt: '2024-02-28T14:22:00Z',
    updatedAt: '2024-02-28T14:22:00Z'
  },
  {
    id: 'comm-3',
    clientId: 'c2',
    type: 'call',
    channel: 'phone',
    subject: 'Technical Support Call',
    content: 'Client reported issues with login functionality. Identified the root cause as a session timeout configuration. Provided immediate workaround and scheduled system update for tonight.',
    direction: 'inbound',
    userId: 'u3',
    userName: 'Emily Davis',
    attachments: [],
    scheduledFor: undefined,
    completedAt: '2024-02-27T09:15:00Z',
    requiresFollowUp: false,
    followUpDate: undefined,
    followUpCompleted: false,
    duration: 25,
    tags: ['support', 'technical', 'urgent'],
    createdAt: '2024-02-27T09:15:00Z',
    updatedAt: '2024-02-27T09:15:00Z'
  },
  {
    id: 'comm-4',
    clientId: 'c3',
    type: 'meeting',
    channel: 'meeting',
    subject: 'Contract Renewal Discussion',
    content: 'Met with client to discuss contract renewal terms. Presented three options with different service levels. Client interested in upgrading to premium tier. Sent formal proposal via email.',
    direction: 'outbound',
    userId: 'u1',
    userName: 'Sarah Johnson',
    attachments: [
      { id: 'a4', fileName: 'Renewal_Proposal.pdf', fileType: 'pdf', fileSize: 1250000, fileUrl: '/files/renewal-proposal.pdf' }
    ],
    scheduledFor: '2024-02-25T14:00:00Z',
    completedAt: '2024-02-25T15:30:00Z',
    requiresFollowUp: true,
    followUpDate: '2024-03-10',
    followUpCompleted: false,
    duration: 90,
    tags: ['renewal', 'sales', 'premium'],
    createdAt: '2024-02-25T15:30:00Z',
    updatedAt: '2024-02-25T15:30:00Z'
  },
  {
    id: 'comm-5',
    clientId: 'c2',
    type: 'email',
    channel: 'email',
    subject: 'Monthly Progress Update',
    content: 'Here\'s your monthly progress update for February. Key highlights: 3 features delivered, 98.5% uptime, 12 support tickets resolved. Next month we\'ll focus on performance optimization and the new dashboard.',
    direction: 'outbound',
    userId: 'u4',
    userName: 'David Wilson',
    attachments: [
      { id: 'a5', fileName: 'February_Progress_Report.pdf', fileType: 'pdf', fileSize: 980000, fileUrl: '/files/feb-progress.pdf' }
    ],
    scheduledFor: undefined,
    completedAt: '2024-02-24T16:30:00Z',
    requiresFollowUp: false,
    followUpDate: undefined,
    followUpCompleted: false,
    duration: undefined,
    tags: ['update', 'monthly'],
    createdAt: '2024-02-24T16:30:00Z',
    updatedAt: '2024-02-24T16:30:00Z'
  },
  {
    id: 'comm-6',
    clientId: 'c4',
    type: 'note',
    channel: 'chat',
    subject: 'Client Feedback on New Features',
    content: 'Client provided positive feedback on the recently deployed analytics dashboard. Specifically mentioned the improved loading speed and intuitive UI. Requested additional export formats for reports.',
    direction: 'inbound',
    userId: 'u2',
    userName: 'Michael Chen',
    attachments: [],
    scheduledFor: undefined,
    completedAt: '2024-02-23T11:45:00Z',
    requiresFollowUp: true,
    followUpDate: '2024-03-08',
    followUpCompleted: false,
    duration: undefined,
    tags: ['feedback', 'enhancement'],
    createdAt: '2024-02-23T11:45:00Z',
    updatedAt: '2024-02-23T11:45:00Z'
  },
  {
    id: 'comm-7',
    clientId: 'c1',
    type: 'call',
    channel: 'phone',
    subject: 'Budget Discussion for New Features',
    content: 'Discussed budget allocation for the requested mobile app features. Client approved $45k additional budget. Will prepare detailed SOW and timeline estimate.',
    direction: 'outbound',
    userId: 'u1',
    userName: 'Sarah Johnson',
    attachments: [],
    scheduledFor: undefined,
    completedAt: '2024-02-22T10:30:00Z',
    requiresFollowUp: true,
    followUpDate: '2024-03-01',
    followUpCompleted: true,
    duration: 35,
    tags: ['budget', 'sales', 'mobile'],
    createdAt: '2024-02-22T10:30:00Z',
    updatedAt: '2024-02-22T10:30:00Z'
  },
  {
    id: 'comm-8',
    clientId: 'c5',
    type: 'meeting',
    channel: 'video_call',
    subject: 'Onboarding Session',
    content: 'Conducted initial onboarding session with new client. Covered platform overview, account setup, team invitations, and first project creation. Client was very engaged and asked excellent questions.',
    direction: 'outbound',
    userId: 'u3',
    userName: 'Emily Davis',
    attachments: [
      { id: 'a6', fileName: 'Onboarding_Checklist.pdf', fileType: 'pdf', fileSize: 650000, fileUrl: '/files/onboarding-checklist.pdf' }
    ],
    scheduledFor: '2024-02-20T13:00:00Z',
    completedAt: '2024-02-20T14:15:00Z',
    requiresFollowUp: true,
    followUpDate: '2024-02-27',
    followUpCompleted: true,
    duration: 75,
    tags: ['onboarding', 'new-client', 'training'],
    createdAt: '2024-02-20T14:15:00Z',
    updatedAt: '2024-02-20T14:15:00Z'
  },
  {
    id: 'comm-9',
    clientId: 'c3',
    type: 'email',
    channel: 'email',
    subject: 'Security Audit Completion',
    content: 'Our annual security audit has been completed. All systems passed with flying colors. Please find the detailed audit report attached. No action items required from your end.',
    direction: 'outbound',
    userId: 'u4',
    userName: 'David Wilson',
    attachments: [
      { id: 'a7', fileName: 'Security_Audit_2024.pdf', fileType: 'pdf', fileSize: 3120000, fileUrl: '/files/security-audit.pdf' }
    ],
    scheduledFor: undefined,
    completedAt: '2024-02-19T09:00:00Z',
    requiresFollowUp: false,
    followUpDate: undefined,
    followUpCompleted: false,
    duration: undefined,
    tags: ['security', 'compliance', 'audit'],
    createdAt: '2024-02-19T09:00:00Z',
    updatedAt: '2024-02-19T09:00:00Z'
  },
  {
    id: 'comm-10',
    clientId: 'c2',
    type: 'call',
    channel: 'phone',
    subject: 'Emergency Hotfix Discussion',
    content: 'Urgent call regarding critical bug in production. Confirmed the issue, provided ETA for hotfix (2 hours), and kept client updated throughout resolution. Issue resolved successfully.',
    direction: 'inbound',
    userId: 'u2',
    userName: 'Michael Chen',
    attachments: [],
    scheduledFor: undefined,
    completedAt: '2024-02-18T15:45:00Z',
    requiresFollowUp: true,
    followUpDate: '2024-02-19',
    followUpCompleted: true,
    duration: 18,
    tags: ['urgent', 'bug', 'hotfix'],
    createdAt: '2024-02-18T15:45:00Z',
    updatedAt: '2024-02-18T15:45:00Z'
  }
]

const clients = [
  { id: 'c1', name: 'TechCorp Inc.' },
  { id: 'c2', name: 'FinanceHub' },
  { id: 'c3', name: 'GlobalHR Solutions' },
  { id: 'c4', name: 'RetailChain Pro' },
  { id: 'c5', name: 'InnovateTech' }
]

type FilterType = 'all' | CommunicationType

export default function ClientInteractionsPage() {
  const [interactions, setInteractions] = useState<Communication[]>(mockInteractions)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<FilterType>('all')
  const [filterClient, setFilterClient] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)

  // Calculate stats
  const stats = {
    total: interactions.length,
    thisWeek: interactions.filter(i => {
      const days = Math.floor((Date.now() - new Date(i.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      return days <= 7
    }).length,
    followUps: interactions.filter(i => i.requiresFollowUp && !i.followUpCompleted).length,
    avgDuration: Math.round(
      interactions.filter(i => i.duration).reduce((sum, i) => sum + (i.duration || 0), 0) /
      interactions.filter(i => i.duration).length
    )
  }

  // Filter interactions
  const filteredInteractions = interactions.filter((interaction) => {
    const matchesSearch =
      interaction.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interaction.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      interaction.userName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesType = filterType === 'all' || interaction.type === filterType
    const matchesClient = filterClient === 'all' || interaction.clientId === filterClient

    return matchesSearch && matchesType && matchesClient
  })

  const getTypeIcon = (type: CommunicationType) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4" />
      case 'email': return <Mail className="w-4 h-4" />
      case 'meeting': return <Calendar className="w-4 h-4" />
      case 'note': return <FileText className="w-4 h-4" />
      default: return <MessageSquare className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: CommunicationType) => {
    switch (type) {
      case 'call': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'email': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'meeting': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'note': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    }
  }

  const getChannelIcon = (channel: CommunicationChannel) => {
    switch (channel) {
      case 'email': return <Mail className="w-3 h-3" />
      case 'phone': return <Phone className="w-3 h-3" />
      case 'video_call': return <Video className="w-3 h-3" />
      case 'meeting': return <Calendar className="w-3 h-3" />
      case 'chat': return <MessageSquare className="w-3 h-3" />
      default: return <MessageSquare className="w-3 h-3" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Client Interactions</h1>
          <p className="text-gray-400">
            Track all communications and activities with your clients
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Log Interaction
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.total}</p>
          <p className="text-sm text-gray-400">Total Interactions</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.thisWeek}</p>
          <p className="text-sm text-gray-400">This Week</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.followUps}</p>
          <p className="text-sm text-gray-400">Pending Follow-ups</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.avgDuration} min</p>
          <p className="text-sm text-gray-400">Avg Duration</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search interactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Types</option>
            <option value="call">Calls</option>
            <option value="email">Emails</option>
            <option value="meeting">Meetings</option>
            <option value="note">Notes</option>
          </select>

          <select
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Clients</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
          <span>Showing {filteredInteractions.length} of {stats.total} interactions</span>
          {(searchQuery || filterType !== 'all' || filterClient !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setFilterType('all')
                setFilterClient('all')
              }}
              className="text-purple-400 hover:text-purple-300"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Interactions Timeline */}
      <div className="space-y-4">
        {filteredInteractions.map((interaction) => {
          const clientName = clients.find(c => c.id === interaction.clientId)?.name || 'Unknown Client'

          return (
            <div
              key={interaction.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Timeline Indicator */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center ${getTypeColor(interaction.type)}`}>
                    {getTypeIcon(interaction.type)}
                  </div>
                  <div className="w-px h-full bg-gray-700 mt-2" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{interaction.subject}</h3>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Building2 className="w-3 h-3" />
                          {clientName}
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {interaction.userName}
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          {getChannelIcon(interaction.channel)}
                          {interaction.channel.replace('_', ' ')}
                        </div>
                        {interaction.duration && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {interaction.duration} min
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">{formatDate(interaction.createdAt)}</span>
                      <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-300 mb-4 leading-relaxed">{interaction.content}</p>

                  {/* Attachments */}
                  {interaction.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {interaction.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm"
                        >
                          <Paperclip className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-300">{attachment.fileName}</span>
                          <span className="text-gray-500">
                            ({(attachment.fileSize / 1024 / 1024).toFixed(1)}MB)
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags */}
                  {interaction.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {interaction.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Follow-up */}
                  {interaction.requiresFollowUp && (
                    <div className={`flex items-center justify-between p-3 rounded-lg ${
                      interaction.followUpCompleted
                        ? 'bg-green-500/10 border border-green-500/30'
                        : 'bg-yellow-500/10 border border-yellow-500/30'
                    }`}>
                      <div className="flex items-center gap-2">
                        {interaction.followUpCompleted ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                        )}
                        <span className={`text-sm ${
                          interaction.followUpCompleted ? 'text-green-400' : 'text-yellow-400'
                        }`}>
                          {interaction.followUpCompleted
                            ? 'Follow-up completed'
                            : `Follow-up needed by ${new Date(interaction.followUpDate || '').toLocaleDateString()}`
                          }
                        </span>
                      </div>
                      {!interaction.followUpCompleted && (
                        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors">
                          Complete Follow-up
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredInteractions.length === 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-12 text-center">
          <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No interactions found</h3>
          <p className="text-gray-400 mb-6">
            {searchQuery || filterType !== 'all' || filterClient !== 'all'
              ? 'Try adjusting your filters'
              : 'Start logging interactions with your clients'}
          </p>
          {!searchQuery && filterType === 'all' && filterClient === 'all' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Log First Interaction
            </button>
          )}
        </div>
      )}

      {/* Add Interaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Log New Interaction</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Type *
                  </label>
                  <select className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500">
                    <option value="call">Call</option>
                    <option value="email">Email</option>
                    <option value="meeting">Meeting</option>
                    <option value="note">Note</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Client *
                  </label>
                  <select className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500">
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  placeholder="Brief description of the interaction"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Details *
                </label>
                <textarea
                  rows={6}
                  placeholder="Detailed notes about the interaction"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="tag1, tag2, tag3"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="followUp"
                  className="w-4 h-4 rounded border-gray-700 bg-gray-900 text-purple-600 focus:ring-purple-500"
                />
                <label htmlFor="followUp" className="text-sm text-gray-300">
                  Requires follow-up
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
                Log Interaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
