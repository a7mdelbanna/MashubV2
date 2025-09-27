'use client'

import { useState } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Calendar, Plus, Search, Filter, Grid, List,
  MapPin, Video, Users, Clock, DollarSign,
  Building, User, Phone, Mail, FileText,
  CheckCircle, AlertCircle, XCircle, Star,
  MessageSquare, Target, MoreVertical, Edit,
  Eye, Trash2, TrendingUp, Activity, Globe,
  Download, Upload, ChevronLeft, ChevronRight
} from 'lucide-react'

// Mock visits data
const mockVisits = [
  {
    id: 'VIS-2024-001',
    date: '2024-03-22',
    time: '10:00 AM',
    client: {
      id: 'c1',
      name: 'TechCorp Solutions',
      contact: 'John Smith'
    },
    service: {
      id: 's1',
      name: 'ShopLeez POS',
      type: 'Software Implementation'
    },
    type: 'onsite',
    status: 'completed',
    duration: '2 hours',
    reason: 'Initial Setup & Training',
    description: 'Install and configure POS system, train staff on basic operations',
    location: '123 Tech Street, San Francisco, CA',
    attendees: ['John Smith', 'Jane Doe', 'Mike Chen'],
    accountManager: 'Sarah Wilson',
    cost: 500,
    paid: true,
    followUp: true,
    rating: 5,
    notes: 'Client very satisfied with the setup. Requested additional training session for new staff next month.',
    documents: ['Setup_Guide.pdf', 'Training_Materials.pdf']
  },
  {
    id: 'VIS-2024-002',
    date: '2024-03-23',
    time: '2:00 PM',
    client: {
      id: 'c2',
      name: 'StartupHub',
      contact: 'Emily Brown'
    },
    service: {
      id: 's2',
      name: 'E-Commerce Platform',
      type: 'Technical Support'
    },
    type: 'online',
    status: 'scheduled',
    duration: '1 hour',
    reason: 'Bug Fix & Optimization',
    description: 'Address reported checkout issues and optimize page loading speed',
    location: null,
    meetingLink: 'https://zoom.us/j/123456789',
    attendees: ['Emily Brown', 'Dev Team'],
    accountManager: 'Tom Anderson',
    cost: 0,
    paid: true,
    followUp: false,
    rating: null,
    notes: 'Priority issue - checkout failing for international customers',
    documents: ['Bug_Report.pdf']
  },
  {
    id: 'VIS-2024-003',
    date: '2024-03-21',
    time: '11:00 AM',
    client: {
      id: 'c3',
      name: 'MegaStore Inc',
      contact: 'Michael Chen'
    },
    service: {
      id: 's3',
      name: 'CRM System',
      type: 'Consultation'
    },
    type: 'hybrid',
    status: 'completed',
    duration: '3 hours',
    reason: 'Quarterly Business Review',
    description: 'Review system performance, discuss upgrades, plan for Q2',
    location: '456 Business Ave, New York, NY',
    meetingLink: 'https://teams.microsoft.com/meet/abc123',
    attendees: ['Michael Chen', 'Sales Team', 'IT Director'],
    accountManager: 'Sarah Wilson',
    cost: 750,
    paid: false,
    followUp: true,
    rating: 4,
    notes: 'Client interested in API integration with their inventory system',
    documents: ['Q1_Report.pdf', 'Q2_Proposal.pdf']
  },
  {
    id: 'VIS-2024-004',
    date: '2024-03-20',
    time: '3:30 PM',
    client: {
      id: 'c4',
      name: 'Local Boutique',
      contact: 'Lisa Johnson'
    },
    service: {
      id: 's1',
      name: 'ShopLeez POS',
      type: 'Training'
    },
    type: 'onsite',
    status: 'completed',
    duration: '1.5 hours',
    reason: 'Staff Training',
    description: 'Train new employees on POS system operations',
    location: '789 Fashion Street, Los Angeles, CA',
    attendees: ['Lisa Johnson', 'Store Staff'],
    accountManager: 'Tom Anderson',
    cost: 250,
    paid: true,
    followUp: false,
    rating: 5,
    notes: 'Very smooth training session. Staff picked up quickly.',
    documents: ['Training_Completion.pdf']
  },
  {
    id: 'VIS-2024-005',
    date: '2024-03-25',
    time: '9:00 AM',
    client: {
      id: 'c5',
      name: 'Enterprise Solutions Ltd',
      contact: 'David Lee'
    },
    service: {
      id: 's4',
      name: 'Mobile Banking App',
      type: 'Sales Demo'
    },
    type: 'online',
    status: 'scheduled',
    duration: '2 hours',
    reason: 'Product Demonstration',
    description: 'Demo mobile banking features for potential enterprise client',
    location: null,
    meetingLink: 'https://meet.google.com/xyz-abc-123',
    attendees: ['David Lee', 'CTO', 'Security Team'],
    accountManager: 'Sarah Wilson',
    cost: 0,
    paid: true,
    followUp: true,
    rating: null,
    notes: 'High-value prospect. Focus on security features and compliance.',
    documents: ['Demo_Presentation.pdf', 'Security_Whitepaper.pdf']
  },
  {
    id: 'VIS-2024-006',
    date: '2024-03-19',
    time: '1:00 PM',
    client: {
      id: 'c1',
      name: 'TechCorp Solutions',
      contact: 'John Smith'
    },
    service: {
      id: 's1',
      name: 'ShopLeez POS',
      type: 'Emergency Support'
    },
    type: 'online',
    status: 'cancelled',
    duration: '30 minutes',
    reason: 'System Down',
    description: 'Emergency support for POS system failure',
    location: null,
    meetingLink: null,
    attendees: ['John Smith'],
    accountManager: 'Sarah Wilson',
    cost: 0,
    paid: true,
    followUp: false,
    rating: null,
    notes: 'Issue resolved before visit. Client restarted system successfully.',
    documents: []
  }
]

const visitTypeIcons = {
  'onsite': MapPin,
  'online': Video,
  'hybrid': Globe
}

const visitTypeColors = {
  'onsite': 'from-blue-600 to-cyan-600',
  'online': 'from-purple-600 to-pink-600',
  'hybrid': 'from-green-600 to-emerald-600'
}

const statusColors = {
  'scheduled': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'completed': 'bg-green-500/20 text-green-400 border-green-500/30',
  'cancelled': 'bg-red-500/20 text-red-400 border-red-500/30',
  'rescheduled': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
}

export default function VisitsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [dateRange, setDateRange] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const filteredVisits = mockVisits.filter(visit => {
    const matchesSearch = visit.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          visit.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          visit.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || visit.type === selectedType
    const matchesStatus = selectedStatus === 'all' || visit.status === selectedStatus
    return matchesSearch && matchesType && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredVisits.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedVisits = filteredVisits.slice(startIndex, startIndex + itemsPerPage)

  // Handle export
  const handleExport = () => {
    const csvContent = [
      ['ID', 'Date', 'Client', 'Service', 'Type', 'Status', 'Duration', 'Cost', 'Rating'].join(','),
      ...filteredVisits.map(v => [
        v.id,
        v.date,
        v.client.name,
        v.service.name,
        v.type,
        v.status,
        v.duration,
        `$${v.cost}`,
        v.rating || 'N/A'
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'visits.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const totalVisits = mockVisits.length
  const completedVisits = mockVisits.filter(v => v.status === 'completed').length
  const scheduledVisits = mockVisits.filter(v => v.status === 'scheduled').length
  const totalRevenue = mockVisits.reduce((sum, v) => sum + v.cost, 0)
  const averageRating = mockVisits
    .filter(v => v.rating !== null)
    .reduce((sum, v, _, arr) => sum + (v.rating || 0) / arr.length, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Visit Management</h1>
          <p className="text-gray-400">Track and manage client visits and meetings</p>
        </div>

        <Link
          href="/dashboard/visits/new"
          className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Schedule Visit</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Total Visits</span>
            <Calendar className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totalVisits}</p>
          <p className="text-xs text-gray-500 mt-1">This month</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Completed</span>
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{completedVisits}</p>
          <p className="text-xs text-green-400 mt-1">{((completedVisits/totalVisits)*100).toFixed(0)}% success rate</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Scheduled</span>
            <Clock className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{scheduledVisits}</p>
          <p className="text-xs text-gray-500 mt-1">Upcoming</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Revenue</span>
            <DollarSign className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">${(totalRevenue / 1000).toFixed(1)}K</p>
          <p className="text-xs text-gray-500 mt-1">From visits</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Avg Rating</span>
            <Star className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{averageRating.toFixed(1)}</p>
          <div className="flex items-center space-x-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < Math.floor(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search visits, clients, or reasons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
        >
          <option value="all">All Types</option>
          <option value="onsite">Onsite</option>
          <option value="online">Online</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
        >
          <option value="all">All Status</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        <div className="flex items-center bg-gray-800/50 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Visits Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-6">
          {filteredVisits.map((visit) => {
            const TypeIcon = visitTypeIcons[visit.type]
            const typeGradient = visitTypeColors[visit.type]

            return (
              <Link
                key={visit.id}
                href={`/dashboard/visits/${visit.id}`}
                className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6 hover:border-purple-500/50 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${typeGradient} flex items-center justify-center`}>
                      <TypeIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{visit.reason}</h3>
                      <p className="text-sm text-gray-400">{visit.id}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-lg text-xs border ${statusColors[visit.status]}`}>
                    {visit.status.toUpperCase()}
                  </span>
                </div>

                {/* Client Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-gray-400" />
                    <span className="text-white">{visit.client.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{visit.client.contact}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-300">{new Date(visit.date).toLocaleDateString()}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-300">{visit.time}</span>
                  </div>
                  {visit.type === 'onsite' || visit.type === 'hybrid' ? (
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="text-gray-300 text-sm">{visit.location}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Video className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-300 text-sm">Online Meeting</span>
                    </div>
                  )}
                </div>

                {/* Service & Cost */}
                <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400">Service</span>
                    <span className="text-xs text-gray-400">Duration</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">{visit.service.name}</span>
                    <span className="text-sm text-gray-300">{visit.duration}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div>
                    {visit.cost > 0 ? (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <span className="text-white font-medium">${visit.cost}</span>
                        {visit.paid ? (
                          <span className="text-xs text-green-400">(Paid)</span>
                        ) : (
                          <span className="text-xs text-yellow-400">(Pending)</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Free</span>
                    )}
                  </div>
                  {visit.rating && (
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < visit.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800">
          <table className="w-full">
            <thead className="border-b border-gray-800">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Visit ID</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Date & Time</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Client</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Reason</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Type</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Cost</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVisits.map((visit) => {
                const TypeIcon = visitTypeIcons[visit.type]

                return (
                  <tr key={visit.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="py-4 px-6">
                      <Link href={`/dashboard/visits/${visit.id}`} className="text-white font-mono hover:text-purple-400 transition-colors">
                        {visit.id}
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white">{new Date(visit.date).toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500">{visit.time}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-white">{visit.client.name}</p>
                        <p className="text-xs text-gray-500">{visit.client.contact}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-300">{visit.reason}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-300 capitalize">{visit.type}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {visit.cost > 0 ? (
                        <span className={`font-medium ${visit.paid ? 'text-green-400' : 'text-yellow-400'}`}>
                          ${visit.cost}
                        </span>
                      ) : (
                        <span className="text-gray-400">Free</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2 py-1 rounded-lg text-xs border ${statusColors[visit.status]}`}>
                        {visit.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/dashboard/visits/${visit.id}`}
                          className="p-1 rounded hover:bg-gray-700 transition-colors"
                        >
                          <Eye className="h-4 w-4 text-gray-400" />
                        </Link>
                        <Link
                          href={`/dashboard/visits/${visit.id}/edit`}
                          className="p-1 rounded hover:bg-gray-700 transition-colors"
                        >
                          <Edit className="h-4 w-4 text-gray-400" />
                        </Link>
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
      )}
    </div>
  )
}