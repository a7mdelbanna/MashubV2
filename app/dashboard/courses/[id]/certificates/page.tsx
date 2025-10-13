'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Award,
  Search,
  Filter,
  Download,
  Mail,
  Eye,
  Calendar,
  User,
  FileText,
  Settings,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

// Mock data
const mockCourse = {
  id: 'c1',
  title: 'Complete Web Development Bootcamp',
  totalCertificates: 28,
  activeCertificates: 28,
  revokedCertificates: 0
}

const mockCertificates = [
  {
    id: 'cert1',
    certificateNumber: 'WDB-2024-001',
    student: {
      id: 'u2',
      name: 'Michael Chen',
      email: 'michael.chen@example.com'
    },
    issuedAt: '2024-02-12T16:45:00Z',
    completedAt: '2024-02-12T16:45:00Z',
    status: 'issued' as const,
    grade: 91,
    validUntil: null,
    downloadCount: 3,
    lastDownloadedAt: '2024-02-13T10:20:00Z',
    verificationUrl: 'https://example.com/verify/cert1'
  },
  {
    id: 'cert2',
    certificateNumber: 'WDB-2024-002',
    student: {
      id: 'u10',
      name: 'Jennifer Wilson',
      email: 'jennifer.wilson@example.com'
    },
    issuedAt: '2024-02-10T14:30:00Z',
    completedAt: '2024-02-10T14:20:00Z',
    status: 'issued' as const,
    grade: 88,
    validUntil: null,
    downloadCount: 1,
    lastDownloadedAt: '2024-02-10T15:00:00Z',
    verificationUrl: 'https://example.com/verify/cert2'
  },
  {
    id: 'cert3',
    certificateNumber: 'WDB-2024-003',
    student: {
      id: 'u11',
      name: 'Thomas Anderson',
      email: 'thomas.anderson@example.com'
    },
    issuedAt: '2024-02-08T11:15:00Z',
    completedAt: '2024-02-08T11:00:00Z',
    status: 'issued' as const,
    grade: 95,
    validUntil: null,
    downloadCount: 5,
    lastDownloadedAt: '2024-02-11T09:45:00Z',
    verificationUrl: 'https://example.com/verify/cert3'
  },
  {
    id: 'cert4',
    certificateNumber: 'WDB-2024-004',
    student: {
      id: 'u12',
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com'
    },
    issuedAt: '2024-02-05T16:20:00Z',
    completedAt: '2024-02-05T16:00:00Z',
    status: 'revoked' as const,
    grade: 82,
    validUntil: null,
    downloadCount: 0,
    lastDownloadedAt: null,
    verificationUrl: 'https://example.com/verify/cert4'
  }
]

export default function CourseCertificatesPage() {
  const params = useParams()
  const courseId = params.id as string

  const [certificates, setCertificates] = useState(mockCertificates)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'issued' | 'revoked'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'grade'>('recent')

  // Filter and sort certificates
  const filteredCertificates = certificates
    .filter(cert => {
      const matchesSearch =
        cert.student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === 'all' || cert.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.student.name.localeCompare(b.student.name)
        case 'grade':
          return b.grade - a.grade
        case 'recent':
        default:
          return new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime()
      }
    })

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'issued':
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-green-500/10 text-green-400 border border-green-500/20 flex items-center space-x-1">
            <CheckCircle className="w-3 h-3" />
            <span>Issued</span>
          </span>
        )
      case 'revoked':
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-red-500/10 text-red-400 border border-red-500/20 flex items-center space-x-1">
            <XCircle className="w-3 h-3" />
            <span>Revoked</span>
          </span>
        )
      default:
        return null
    }
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
          <span className="text-white">Certificates</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
              Certificates
            </h1>
            <p className="text-gray-400">
              {mockCourse.totalCertificates} total · {mockCourse.activeCertificates} active · {mockCourse.revokedCertificates} revoked
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href={`/dashboard/courses/${courseId}/certificates/settings`}
              className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>

            <button className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Issued</span>
            <Award className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white">{mockCourse.totalCertificates}</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">This Month</span>
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white">12</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Avg Grade</span>
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white">89%</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Downloads</span>
            <Download className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white">42</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            {['all', 'issued', 'revoked'].map((status) => (
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
                {status === 'all' && ` (${certificates.length})`}
                {status === 'issued' && ` (${certificates.filter(c => c.status === 'issued').length})`}
                {status === 'revoked' && ` (${certificates.filter(c => c.status === 'revoked').length})`}
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
            <option value="recent">Sort by: Recent</option>
            <option value="name">Sort by: Name</option>
            <option value="grade">Sort by: Grade</option>
          </select>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search certificates..."
              className="pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent w-64"
            />
          </div>
        </div>
      </div>

      {/* Certificates List */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Certificate #</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Student</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Grade</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Issued Date</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-300">Downloads</th>
                <th className="text-right p-4 text-sm font-semibold text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredCertificates.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <Award className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400 mb-2">No certificates found</p>
                    <p className="text-sm text-gray-500">Try adjusting your filters or search query</p>
                  </td>
                </tr>
              ) : (
                filteredCertificates.map((certificate) => (
                  <tr key={certificate.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="text-white font-mono text-sm">{certificate.certificateNumber}</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          ID: {certificate.id}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-purple flex items-center justify-center text-white font-semibold">
                          {certificate.student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-white font-medium">{certificate.student.name}</p>
                          <p className="text-sm text-gray-400">{certificate.student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(certificate.status)}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        certificate.grade >= 90 ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        certificate.grade >= 80 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                      }`}>
                        {certificate.grade}%
                      </span>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-white text-sm">{formatDate(certificate.issuedAt)}</p>
                        <p className="text-xs text-gray-400">{getRelativeTime(certificate.issuedAt)}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-white">{certificate.downloadCount}x</p>
                        {certificate.lastDownloadedAt && (
                          <p className="text-xs text-gray-400">
                            Last: {getRelativeTime(certificate.lastDownloadedAt)}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/dashboard/courses/${courseId}/certificates/${certificate.id}`}
                          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                          title="View certificate"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <button
                          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <button
                          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                          title="Send via email"
                        >
                          <Mail className="w-4 h-4" />
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
