'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Users,
  Search,
  Filter,
  Download,
  Mail,
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  Award,
  TrendingUp,
  Calendar,
  Eye,
  UserPlus
} from 'lucide-react'

// Mock data
const mockCourse = {
  id: 'c1',
  title: 'Complete Web Development Bootcamp',
  totalStudents: 156,
  activeStudents: 142,
  completedStudents: 28
}

const mockEnrollments = [
  {
    id: 'e1',
    student: {
      id: 'u1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      avatar: null
    },
    enrolledAt: '2024-01-15T10:00:00Z',
    lastAccessedAt: '2024-02-10T14:30:00Z',
    status: 'active' as const,
    progress: 65,
    completedLessons: 18,
    totalLessons: 28,
    timeSpent: 1240, // minutes
    currentLesson: 'Introduction to JavaScript',
    quizScores: [85, 92, 78],
    averageScore: 85,
    certificateIssued: false
  },
  {
    id: 'e2',
    student: {
      id: 'u2',
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      avatar: null
    },
    enrolledAt: '2024-01-10T09:00:00Z',
    lastAccessedAt: '2024-02-12T16:45:00Z',
    status: 'completed' as const,
    progress: 100,
    completedLessons: 28,
    totalLessons: 28,
    timeSpent: 1890,
    currentLesson: null,
    quizScores: [95, 88, 92, 90],
    averageScore: 91,
    certificateIssued: true,
    certificateIssuedAt: '2024-02-12T16:45:00Z'
  },
  {
    id: 'e3',
    student: {
      id: 'u3',
      name: 'Emma Davis',
      email: 'emma.davis@example.com',
      avatar: null
    },
    enrolledAt: '2024-02-01T11:30:00Z',
    lastAccessedAt: '2024-02-08T10:15:00Z',
    status: 'active' as const,
    progress: 25,
    completedLessons: 7,
    totalLessons: 28,
    timeSpent: 420,
    currentLesson: 'HTML Basics',
    quizScores: [78, 82],
    averageScore: 80,
    certificateIssued: false
  },
  {
    id: 'e4',
    student: {
      id: 'u4',
      name: 'James Wilson',
      email: 'james.wilson@example.com',
      avatar: null
    },
    enrolledAt: '2024-01-20T14:00:00Z',
    lastAccessedAt: '2024-01-25T09:20:00Z',
    status: 'expired' as const,
    progress: 10,
    completedLessons: 3,
    totalLessons: 28,
    timeSpent: 180,
    currentLesson: 'Setting Up Environment',
    quizScores: [],
    averageScore: 0,
    certificateIssued: false
  }
]

export default function CourseStudentsPage() {
  const params = useParams()
  const courseId = params.id as string

  const [enrollments, setEnrollments] = useState(mockEnrollments)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'expired'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'enrolled' | 'lastAccessed'>('enrolled')

  // Filter and sort enrollments
  const filteredEnrollments = enrollments
    .filter(enrollment => {
      const matchesSearch =
        enrollment.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        enrollment.student.email.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || enrollment.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.student.name.localeCompare(b.student.name)
        case 'progress':
          return b.progress - a.progress
        case 'enrolled':
          return new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime()
        case 'lastAccessed':
          return new Date(b.lastAccessedAt).getTime() - new Date(a.lastAccessedAt).getTime()
        default:
          return 0
      }
    })

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/20 flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>Active</span>
          </span>
        )
      case 'completed':
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center space-x-1">
            <Award className="w-3 h-3" />
            <span>Completed</span>
          </span>
        )
      case 'expired':
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-gray-700 text-gray-400 border border-gray-600 flex items-center space-x-1">
            <XCircle className="w-3 h-3" />
            <span>Expired</span>
          </span>
        )
      default:
        return null
    }
  }

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Get relative time
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return formatDate(dateString)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link href="/dashboard/courses" className="hover:text-purple-400 transition-colors">
            Courses
          </Link>
          <span>/</span>
          <Link href={`/dashboard/courses/${courseId}`} className="hover:text-purple-400 transition-colors">
            {mockCourse.title}
          </Link>
          <span>/</span>
          <span className="text-white">Students</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
              Enrolled Students
            </h1>
            <p className="text-gray-400">
              {mockCourse.totalStudents} total · {mockCourse.activeStudents} active · {mockCourse.completedStudents} completed
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email All</span>
            </button>

            <button className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>

            <Link
              href={`/dashboard/courses/${courseId}/students/enroll`}
              className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll Students</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            {['all', 'active', 'completed', 'expired'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                  statusFilter === status
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-gray-800/50 text-gray-400 hover:text-gray-300 border border-gray-700'
                }`}
              >
                {status}
                {status === 'all' && ` (${enrollments.length})`}
                {status === 'active' && ` (${enrollments.filter(e => e.status === 'active').length})`}
                {status === 'completed' && ` (${enrollments.filter(e => e.status === 'completed').length})`}
                {status === 'expired' && ` (${enrollments.filter(e => e.status === 'expired').length})`}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="enrolled">Sort by: Enrolled Date</option>
            <option value="name">Sort by: Name</option>
            <option value="progress">Sort by: Progress</option>
            <option value="lastAccessed">Sort by: Last Access</option>
          </select>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
            />
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Student</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Progress</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Avg Score</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Time Spent</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Last Access</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Certificate</th>
                <th className="text-right p-4 text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 mb-2">No students found</p>
                    <p className="text-sm text-gray-500">Try adjusting your filters or search query</p>
                  </td>
                </tr>
              ) : (
                filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-purple flex items-center justify-center text-white font-semibold">
                          {enrollment.student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-white font-medium">{enrollment.student.name}</p>
                          <p className="text-sm text-gray-400">{enrollment.student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(enrollment.status)}
                    </td>
                    <td className="p-4">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-white font-medium">{enrollment.progress}%</span>
                          <span className="text-sm text-gray-400">
                            ({enrollment.completedLessons}/{enrollment.totalLessons})
                          </span>
                        </div>
                        <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-purple"
                            style={{ width: `${enrollment.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {enrollment.averageScore > 0 ? (
                        <div className="flex items-center space-x-2">
                          <span className={`font-medium ${
                            enrollment.averageScore >= 80 ? 'text-green-400' :
                            enrollment.averageScore >= 60 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {enrollment.averageScore}%
                          </span>
                          <span className="text-sm text-gray-400">
                            ({enrollment.quizScores.length} quizzes)
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="text-white">{formatDuration(enrollment.timeSpent)}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-400 text-sm">
                        {getRelativeTime(enrollment.lastAccessedAt)}
                      </span>
                    </td>
                    <td className="p-4">
                      {enrollment.certificateIssued ? (
                        <Award className="w-5 h-5 text-yellow-400" />
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/dashboard/courses/${courseId}/students/${enrollment.id}`}
                          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                          title="More actions"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
