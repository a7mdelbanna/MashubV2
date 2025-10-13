'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Users,
  MapPin,
  Video,
  Phone,
  Building,
  Filter,
  Search,
  Download,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit,
  Trash2
} from 'lucide-react'
import { Interview, InterviewStage, InterviewStatus } from '@/types/candidates'
import {
  getInterviewStageColor,
  getInterviewStatusColor,
  formatInterviewStage
} from '@/lib/candidates-utils'

// Mock interview data
const mockInterviews: (Interview & { candidateName: string; positionTitle: string })[] = [
  {
    id: 'int-1',
    candidateId: 'cand-1',
    candidateName: 'Sarah Johnson',
    positionTitle: 'Senior Full Stack Developer',
    stage: 'technical',
    status: 'scheduled',
    scheduledAt: '2025-10-14T10:00:00Z',
    duration: 60,
    timezone: 'EST',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    interviewers: [
      {
        userId: 'user-1',
        name: 'Michael Chen',
        email: 'michael@company.com',
        role: 'Engineering Manager',
        isPrimary: true
      },
      {
        userId: 'user-2',
        name: 'Emily Davis',
        email: 'emily@company.com',
        role: 'Senior Engineer',
        isPrimary: false
      }
    ],
    createdAt: '2025-10-10T09:00:00Z',
    updatedAt: '2025-10-10T09:00:00Z',
    createdBy: 'user-1'
  },
  {
    id: 'int-2',
    candidateId: 'cand-2',
    candidateName: 'David Wilson',
    positionTitle: 'Product Designer',
    stage: 'phone_screen',
    status: 'scheduled',
    scheduledAt: '2025-10-14T14:00:00Z',
    duration: 30,
    timezone: 'EST',
    interviewers: [
      {
        userId: 'user-3',
        name: 'Jessica Park',
        email: 'jessica@company.com',
        role: 'Design Lead',
        isPrimary: true
      }
    ],
    createdAt: '2025-10-11T10:00:00Z',
    updatedAt: '2025-10-11T10:00:00Z',
    createdBy: 'user-3'
  },
  {
    id: 'int-3',
    candidateId: 'cand-3',
    candidateName: 'Lisa Anderson',
    positionTitle: 'Data Scientist',
    stage: 'final',
    status: 'scheduled',
    scheduledAt: '2025-10-15T11:00:00Z',
    duration: 90,
    timezone: 'EST',
    location: 'Conference Room A',
    interviewers: [
      {
        userId: 'user-4',
        name: 'Robert Brown',
        email: 'robert@company.com',
        role: 'VP of Engineering',
        isPrimary: true
      },
      {
        userId: 'user-5',
        name: 'Tom Richards',
        email: 'tom@company.com',
        role: 'CTO',
        isPrimary: false
      }
    ],
    createdAt: '2025-10-09T15:00:00Z',
    updatedAt: '2025-10-09T15:00:00Z',
    createdBy: 'user-4'
  },
  {
    id: 'int-4',
    candidateId: 'cand-4',
    candidateName: 'Mark Thompson',
    positionTitle: 'DevOps Engineer',
    stage: 'technical',
    status: 'completed',
    scheduledAt: '2025-10-13T15:00:00Z',
    completedAt: '2025-10-13T16:00:00Z',
    duration: 60,
    timezone: 'EST',
    meetingLink: 'https://zoom.us/j/123456789',
    interviewers: [
      {
        userId: 'user-6',
        name: 'Alex Martinez',
        email: 'alex@company.com',
        role: 'DevOps Lead',
        isPrimary: true
      }
    ],
    overallRating: 4,
    recommendation: 'yes',
    createdAt: '2025-10-08T12:00:00Z',
    updatedAt: '2025-10-13T16:00:00Z',
    createdBy: 'user-6'
  },
  {
    id: 'int-5',
    candidateId: 'cand-5',
    candidateName: 'Jennifer Lee',
    positionTitle: 'Frontend Developer',
    stage: 'behavioral',
    status: 'scheduled',
    scheduledAt: '2025-10-16T09:30:00Z',
    duration: 45,
    timezone: 'EST',
    meetingLink: 'https://teams.microsoft.com/l/meetup/abc',
    interviewers: [
      {
        userId: 'user-7',
        name: 'Sarah Johnson',
        email: 'sarah@company.com',
        role: 'HR Manager',
        isPrimary: true
      }
    ],
    createdAt: '2025-10-12T11:00:00Z',
    updatedAt: '2025-10-12T11:00:00Z',
    createdBy: 'user-7'
  }
]

export default function InterviewSchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day' | 'list'>('week')
  const [interviews] = useState(mockInterviews)
  const [filterStatus, setFilterStatus] = useState<InterviewStatus | 'all'>('all')
  const [filterStage, setFilterStage] = useState<InterviewStage | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Navigation functions
  const goToPrevious = () => {
    const newDate = new Date(currentDate)
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7)
    } else if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() - 1)
    }
    setCurrentDate(newDate)
  }

  const goToNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7)
    } else if (viewMode === 'day') {
      newDate.setDate(newDate.getDate() + 1)
    }
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Generate calendar days for current month
  const getMonthDays = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days: Date[] = []

    // Add previous month's days
    for (let i = 0; i < startingDayOfWeek; i++) {
      const day = new Date(year, month, -startingDayOfWeek + i + 1)
      days.push(day)
    }

    // Add current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    // Add next month's days to complete the grid
    const remainingDays = 42 - days.length
    for (let i = 1; i <= remainingDays; i++) {
      days.push(new Date(year, month + 1, i))
    }

    return days
  }

  // Get week days
  const getWeekDays = () => {
    const days: Date[] = []
    const start = new Date(currentDate)
    start.setDate(start.getDate() - start.getDay())

    for (let i = 0; i < 7; i++) {
      const day = new Date(start)
      day.setDate(start.getDate() + i)
      days.push(day)
    }

    return days
  }

  // Get interviews for a specific date
  const getInterviewsForDate = (date: Date) => {
    return interviews.filter(interview => {
      if (!interview.scheduledAt) return false
      const interviewDate = new Date(interview.scheduledAt)
      return (
        interviewDate.getDate() === date.getDate() &&
        interviewDate.getMonth() === date.getMonth() &&
        interviewDate.getFullYear() === date.getFullYear()
      )
    })
  }

  // Filter interviews
  const filteredInterviews = interviews.filter(interview => {
    const matchesStatus = filterStatus === 'all' || interview.status === filterStatus
    const matchesStage = filterStage === 'all' || interview.stage === filterStage
    const matchesSearch = interview.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         interview.positionTitle.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesStage && matchesSearch
  })

  // Stats
  const stats = {
    total: interviews.length,
    scheduled: interviews.filter(i => i.status === 'scheduled').length,
    completed: interviews.filter(i => i.status === 'completed').length,
    today: interviews.filter(i => {
      if (!i.scheduledAt) return false
      const interviewDate = new Date(i.scheduledAt)
      const today = new Date()
      return interviewDate.toDateString() === today.toDateString()
    }).length
  }

  const getInterviewIcon = (interview: typeof mockInterviews[0]) => {
    if (interview.meetingLink) return <Video className="w-4 h-4" />
    if (interview.location) return <Building className="w-4 h-4" />
    return <Phone className="w-4 h-4" />
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Interview Schedule</h1>
          <p className="text-gray-400">Manage and coordinate candidate interviews</p>
        </div>
        <Link
          href="/dashboard/candidates/interviews/new"
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Schedule Interview
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Total Interviews</div>
            <CalendarIcon className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Scheduled</div>
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.scheduled}</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Completed</div>
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.completed}</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Today</div>
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.today}</div>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Navigation */}
            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevious}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
              >
                Today
              </button>
              <button
                onClick={goToNext}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Current Date Display */}
            <div className="text-xl font-bold text-white">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Filters */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value as any)}
              className="px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Stages</option>
              <option value="phone_screen">Phone Screen</option>
              <option value="technical">Technical</option>
              <option value="behavioral">Behavioral</option>
              <option value="final">Final</option>
              <option value="onsite">Onsite</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-gray-900/50 border border-gray-700 rounded-lg p-1">
              {(['month', 'week', 'day', 'list'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    viewMode === mode
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Views */}
      {viewMode === 'week' && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
          <div className="grid grid-cols-7 border-b border-gray-700">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-4 text-center text-sm font-medium text-gray-400 border-r border-gray-700 last:border-r-0">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {getWeekDays().map((day, index) => {
              const dayInterviews = getInterviewsForDate(day)
              const isToday = day.toDateString() === new Date().toDateString()

              return (
                <div
                  key={index}
                  className={`min-h-[200px] p-3 border-r border-b border-gray-700 last:border-r-0 ${
                    day.getMonth() !== currentDate.getMonth() ? 'bg-gray-900/30' : ''
                  }`}
                >
                  <div className={`text-sm font-medium mb-2 ${
                    isToday
                      ? 'w-7 h-7 rounded-full bg-purple-600 text-white flex items-center justify-center'
                      : 'text-gray-400'
                  }`}>
                    {day.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayInterviews.map((interview) => (
                      <Link
                        key={interview.id}
                        href={`/dashboard/candidates/${interview.candidateId}`}
                        className={`block p-2 rounded text-xs ${getInterviewStageColor(interview.stage)} hover:opacity-80 transition-opacity`}
                      >
                        <div className="font-medium truncate">{formatTime(interview.scheduledAt!)}</div>
                        <div className="truncate">{interview.candidateName}</div>
                        <div className="flex items-center gap-1 mt-1 text-xs opacity-75">
                          {getInterviewIcon(interview)}
                          {interview.duration}m
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {viewMode === 'list' && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900/50 border-b border-gray-700">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Date & Time</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Candidate</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Position</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Stage</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Interviewers</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Type</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInterviews.map((interview, index) => (
                <tr
                  key={interview.id}
                  className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${
                    index === filteredInterviews.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="p-4">
                    <div className="text-white font-medium">
                      {new Date(interview.scheduledAt!).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-400">
                      {formatTime(interview.scheduledAt!)} ({interview.duration}m)
                    </div>
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/dashboard/candidates/${interview.candidateId}`}
                      className="text-white hover:text-purple-400 transition-colors"
                    >
                      {interview.candidateName}
                    </Link>
                  </td>
                  <td className="p-4 text-gray-300">{interview.positionTitle}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInterviewStageColor(interview.stage)}`}>
                      {formatInterviewStage(interview.stage)}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getInterviewStatusColor(interview.status)}`}>
                      {interview.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-300">{interview.interviewers.length}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      {getInterviewIcon(interview)}
                      <span className="text-sm">
                        {interview.meetingLink ? 'Video' : interview.location ? 'In-person' : 'Phone'}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
                        <Edit className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredInterviews.length === 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-12 text-center">
          <CalendarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No interviews found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your filters or schedule a new interview</p>
          <Link
            href="/dashboard/candidates/interviews/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Schedule Interview
          </Link>
        </div>
      )}
    </div>
  )
}
