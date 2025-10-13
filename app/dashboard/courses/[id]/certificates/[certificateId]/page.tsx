'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  Download,
  Mail,
  Share2,
  CheckCircle,
  XCircle,
  Award,
  Calendar,
  User,
  BookOpen,
  Clock,
  Link as LinkIcon,
  Copy,
  ExternalLink,
  AlertCircle
} from 'lucide-react'

// Mock data
const mockCertificate = {
  id: 'cert1',
  certificateNumber: 'WDB-2024-001',
  course: {
    id: 'c1',
    title: 'Complete Web Development Bootcamp',
    duration: 24,
    totalLessons: 28
  },
  student: {
    id: 'u2',
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    avatar: null
  },
  instructor: {
    id: 'i1',
    name: 'Dr. Jane Smith',
    title: 'Senior Web Developer',
    signature: null
  },
  issuedAt: '2024-02-12T16:45:00Z',
  completedAt: '2024-02-12T16:45:00Z',
  status: 'issued' as const,
  grade: 91,
  validUntil: null,
  downloadCount: 3,
  lastDownloadedAt: '2024-02-13T10:20:00Z',
  verificationUrl: 'https://example.com/verify/cert1',
  verificationCode: 'WDB2024001VERIFY',
  template: 'modern',
  metadata: {
    completedLessons: 28,
    totalLessons: 28,
    timeSpent: 1890, // minutes
    quizzesPassed: 12,
    averageScore: 91
  }
}

export default function CertificateDetailPage() {
  const params = useParams()
  const courseId = params.id as string
  const certificateId = params.certificateId as string

  const [copied, setCopied] = useState(false)

  // Copy verification link
  const copyVerificationLink = () => {
    navigator.clipboard.writeText(mockCertificate.verificationUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    return `${hours} hours`
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/dashboard/courses/${courseId}/certificates`}
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Certificates</span>
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Certificate #{mockCertificate.certificateNumber}
            </h1>
            <p className="text-gray-400">
              Issued to {mockCertificate.student.name} on {formatDate(mockCertificate.issuedAt)}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Send Email</span>
            </button>

            <button className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all flex items-center space-x-2">
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>

            <button className="px-4 py-2 rounded-lg gradient-purple text-white hover:opacity-90 transition-all flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Left Column - Certificate Preview */}
        <div className="col-span-2 space-y-6">
          {/* Certificate Preview */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-8">
            <div className="aspect-[1.414/1] bg-gradient-to-br from-purple-600/10 via-gray-900 to-blue-600/10 border-4 border-gray-700 rounded-lg p-12 flex flex-col items-center justify-center">
              {/* Decorative corners */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-yellow-400/50 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-yellow-400/50 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-yellow-400/50 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-yellow-400/50 rounded-br-lg" />

              {/* Award Icon */}
              <Award className="w-24 h-24 text-yellow-400 mb-8" />

              {/* Certificate Text */}
              <h2 className="text-4xl font-bold text-center mb-4 bg-gradient-purple bg-clip-text text-transparent">
                Certificate of Completion
              </h2>

              <p className="text-gray-400 text-center mb-8">This certifies that</p>

              <h3 className="text-3xl font-bold text-white text-center mb-8">
                {mockCertificate.student.name}
              </h3>

              <p className="text-gray-400 text-center mb-4">
                has successfully completed
              </p>

              <h4 className="text-2xl font-semibold text-white text-center mb-8">
                {mockCertificate.course.title}
              </h4>

              <div className="flex items-center justify-center space-x-12 mb-8">
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">Grade</p>
                  <p className="text-xl font-bold text-green-400">{mockCertificate.grade}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">Date</p>
                  <p className="text-xl font-bold text-white">{formatDate(mockCertificate.issuedAt)}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400 mb-1">Duration</p>
                  <p className="text-xl font-bold text-white">{formatDuration(mockCertificate.metadata.timeSpent)}</p>
                </div>
              </div>

              {/* Signatures */}
              <div className="flex items-end justify-center space-x-16 mt-auto pt-8 border-t border-gray-700">
                <div className="text-center">
                  <div className="w-40 h-12 mb-2 flex items-end justify-center">
                    <p className="text-2xl font-signature text-purple-400">{mockCertificate.instructor.name}</p>
                  </div>
                  <p className="text-sm text-gray-400">{mockCertificate.instructor.title}</p>
                  <p className="text-xs text-gray-500 mt-1">Instructor</p>
                </div>
              </div>

              {/* Certificate Number */}
              <p className="text-xs text-gray-500 mt-8 font-mono">
                Certificate ID: {mockCertificate.certificateNumber}
              </p>
            </div>
          </div>

          {/* Completion Details */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Completion Details</h3>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <BookOpen className="w-5 h-5 text-purple-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Lessons Completed</p>
                  <p className="text-white font-semibold">
                    {mockCertificate.metadata.completedLessons} / {mockCertificate.metadata.totalLessons}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Time Spent</p>
                  <p className="text-white font-semibold">
                    {formatDuration(mockCertificate.metadata.timeSpent)}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Quizzes Passed</p>
                  <p className="text-white font-semibold">
                    {mockCertificate.metadata.quizzesPassed}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Award className="w-5 h-5 text-yellow-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-400 mb-1">Average Score</p>
                  <p className="text-white font-semibold">
                    {mockCertificate.metadata.averageScore}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Info & Actions */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Status</h3>

            {mockCertificate.status === 'issued' ? (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center space-x-3 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <p className="text-sm text-gray-400">
                  This certificate is valid and can be verified
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center space-x-3 mb-2">
                  <XCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 font-medium">Revoked</span>
                </div>
                <p className="text-sm text-gray-400">
                  This certificate has been revoked and is no longer valid
                </p>
              </div>
            )}
          </div>

          {/* Student Info */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Student Information</h3>

            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-purple flex items-center justify-center text-white font-semibold">
                {mockCertificate.student.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-white font-medium">{mockCertificate.student.name}</p>
                <p className="text-sm text-gray-400">{mockCertificate.student.email}</p>
              </div>
            </div>

            <Link
              href={`/dashboard/courses/${courseId}/students/${mockCertificate.student.id}`}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors flex items-center space-x-1"
            >
              <span>View student profile</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Course Info */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Course Information</h3>

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Course Name</p>
                <p className="text-white font-medium">{mockCertificate.course.title}</p>
              </div>

              <div>
                <p className="text-gray-400 mb-1">Completed On</p>
                <p className="text-white">{formatDate(mockCertificate.completedAt)}</p>
              </div>

              <div>
                <p className="text-gray-400 mb-1">Final Grade</p>
                <p className="text-green-400 font-semibold">{mockCertificate.grade}%</p>
              </div>
            </div>
          </div>

          {/* Verification */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Verification</h3>

            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-xs mb-2">Verification Code</p>
                <div className="p-3 rounded-lg bg-gray-900 border border-gray-700">
                  <p className="text-white font-mono text-sm">{mockCertificate.verificationCode}</p>
                </div>
              </div>

              <div>
                <p className="text-gray-400 text-xs mb-2">Verification Link</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={mockCertificate.verificationUrl}
                    readOnly
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white text-xs"
                  />
                  <button
                    onClick={copyVerificationLink}
                    className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-all"
                    title="Copy link"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <a
                href={mockCertificate.verificationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all text-sm"
              >
                <LinkIcon className="w-4 h-4" />
                <span>Open Verification Page</span>
              </a>
            </div>
          </div>

          {/* Download Stats */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Download History</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Total Downloads</span>
                <span className="text-white font-semibold">{mockCertificate.downloadCount}</span>
              </div>

              {mockCertificate.lastDownloadedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Last Downloaded</span>
                  <span className="text-white text-sm">{formatDate(mockCertificate.lastDownloadedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {mockCertificate.status === 'issued' && (
            <button className="w-full px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center justify-center space-x-2">
              <XCircle className="w-4 h-4" />
              <span>Revoke Certificate</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
