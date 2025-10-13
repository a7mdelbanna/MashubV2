'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  CheckCircle,
  XCircle,
  Circle,
  Download,
  Send,
  BarChart3,
  BookOpen,
  Video,
  FileText,
  ClipboardList
} from 'lucide-react'

// Mock data
const mockEnrollment = {
  id: 'e1',
  courseId: 'c1',
  courseName: 'Complete Web Development Bootcamp',
  student: {
    id: 'u1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    avatar: null,
    timezone: 'EST (GMT-5)'
  },
  enrolledAt: '2024-01-15T10:00:00Z',
  lastAccessedAt: '2024-02-10T14:30:00Z',
  status: 'active' as const,
  progress: 65,
  completedLessons: 18,
  totalLessons: 28,
  timeSpent: 1240, // minutes
  averageScore: 85,
  certificateIssued: false,

  lessonProgress: [
    {
      section: 'Getting Started',
      lessons: [
        {
          id: 'l1',
          title: 'Welcome to the Course',
          type: 'video',
          status: 'completed',
          completedAt: '2024-01-15T11:00:00Z',
          timeSpent: 15,
          score: null
        },
        {
          id: 'l2',
          title: 'Setting Up Your Development Environment',
          type: 'video',
          status: 'completed',
          completedAt: '2024-01-15T12:30:00Z',
          timeSpent: 28,
          score: null
        },
        {
          id: 'l3',
          title: 'HTML Basics Quiz',
          type: 'quiz',
          status: 'completed',
          completedAt: '2024-01-16T10:00:00Z',
          timeSpent: 12,
          score: 85
        }
      ]
    },
    {
      section: 'HTML & CSS Fundamentals',
      lessons: [
        {
          id: 'l4',
          title: 'Introduction to HTML',
          type: 'video',
          status: 'completed',
          completedAt: '2024-01-17T14:00:00Z',
          timeSpent: 32,
          score: null
        },
        {
          id: 'l5',
          title: 'CSS Styling Basics',
          type: 'article',
          status: 'in_progress',
          completedAt: null,
          timeSpent: 18,
          score: null
        },
        {
          id: 'l6',
          title: 'Building Your First Page',
          type: 'assignment',
          status: 'not_started',
          completedAt: null,
          timeSpent: 0,
          score: null
        }
      ]
    }
  ],

  quizResults: [
    {
      id: 'q1',
      lessonTitle: 'HTML Basics Quiz',
      attemptedAt: '2024-01-16T10:00:00Z',
      score: 85,
      totalQuestions: 10,
      correctAnswers: 9,
      timeSpent: 12
    },
    {
      id: 'q2',
      lessonTitle: 'CSS Fundamentals Quiz',
      attemptedAt: '2024-01-18T15:30:00Z',
      score: 92,
      totalQuestions: 15,
      correctAnswers: 14,
      timeSpent: 18
    },
    {
      id: 'q3',
      lessonTitle: 'JavaScript Basics Quiz',
      attemptedAt: '2024-01-22T11:20:00Z',
      score: 78,
      totalQuestions: 12,
      correctAnswers: 9,
      timeSpent: 15
    }
  ],

  activityLog: [
    {
      id: 'a1',
      type: 'lesson_completed',
      description: 'Completed "CSS Styling Basics"',
      timestamp: '2024-02-10T14:30:00Z'
    },
    {
      id: 'a2',
      type: 'quiz_passed',
      description: 'Passed "JavaScript Basics Quiz" with 78%',
      timestamp: '2024-01-22T11:20:00Z'
    },
    {
      id: 'a3',
      type: 'lesson_started',
      description: 'Started "Building Your First Page"',
      timestamp: '2024-01-20T09:15:00Z'
    }
  ]
}

export default function StudentProgressPage() {
  const params = useParams()
  const courseId = params.id as string
  const enrollmentId = params.enrollmentId as string

  const [activeTab, setActiveTab] = useState<'progress' | 'quizzes' | 'activity'>('progress')

  // Get lesson icon
  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />
      case 'article':
        return <FileText className="w-4 h-4" />
      case 'quiz':
        return <CheckCircle className="w-4 h-4" />
      case 'assignment':
        return <ClipboardList className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  // Get lesson status icon
  const getLessonStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'in_progress':
        return <Clock className="w-5 h-5 text-yellow-400" />
      case 'not_started':
        return <Circle className="w-5 h-5 text-gray-600" />
      default:
        return null
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`
    }
    return `${minutes}m`
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
        <Link
          href={`/dashboard/courses/${courseId}/students`}
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students</span>
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            <div className="w-20 h-20 rounded-full bg-gradient-purple flex items-center justify-center text-white text-2xl font-bold">
              {mockEnrollment.student.name.split(' ').map(n => n[0]).join('')}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {mockEnrollment.student.name}
              </h1>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{mockEnrollment.student.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Enrolled {formatDate(mockEnrollment.enrolledAt)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Last access {getRelativeTime(mockEnrollment.lastAccessedAt)}</span>
                </div>
              </div>
              <p className="text-gray-400 mt-2">{mockEnrollment.courseName}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all flex items-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>

            <button className="px-4 py-2 rounded-lg gradient-purple text-white hover:opacity-90 transition-all flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Progress</span>
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{mockEnrollment.progress}%</p>
          <p className="text-sm text-gray-400">
            {mockEnrollment.completedLessons} of {mockEnrollment.totalLessons} lessons
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Avg Score</span>
            <BarChart3 className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{mockEnrollment.averageScore}%</p>
          <p className="text-sm text-gray-400">
            {mockEnrollment.quizResults.length} quizzes taken
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Time Spent</span>
            <Clock className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {formatDuration(mockEnrollment.timeSpent)}
          </p>
          <p className="text-sm text-gray-400">Total learning time</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Certificate</span>
            <Award className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {mockEnrollment.certificateIssued ? 'Issued' : 'Pending'}
          </p>
          <p className="text-sm text-gray-400">
            {mockEnrollment.certificateIssued ? 'Certificate earned' : 'Complete course to earn'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <div className="flex space-x-8">
          {[
            { id: 'progress', label: 'Lesson Progress', icon: BookOpen },
            { id: 'quizzes', label: 'Quiz Results', icon: CheckCircle },
            { id: 'activity', label: 'Activity Log', icon: Clock }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`pb-4 px-2 border-b-2 transition-all flex items-center space-x-2 ${
                activeTab === id
                  ? 'border-purple-500 text-purple-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          {mockEnrollment.lessonProgress.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-semibold text-white">{section.section}</h3>
              </div>

              <div className="divide-y divide-gray-700">
                {section.lessons.map((lesson) => (
                  <div key={lesson.id} className="p-4 hover:bg-gray-800/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      {getLessonStatusIcon(lesson.status)}

                      <div className="text-purple-400">
                        {getLessonIcon(lesson.type)}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <h4 className="text-white font-medium">{lesson.title}</h4>
                          <span className="text-sm text-gray-400 capitalize">
                            ({lesson.type})
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          {lesson.status === 'completed' && lesson.completedAt && (
                            <span>Completed {formatDate(lesson.completedAt)}</span>
                          )}
                          {lesson.timeSpent > 0 && (
                            <>
                              <span>·</span>
                              <span>{lesson.timeSpent} min spent</span>
                            </>
                          )}
                          {lesson.score !== null && (
                            <>
                              <span>·</span>
                              <span className={`font-medium ${
                                lesson.score >= 80 ? 'text-green-400' :
                                lesson.score >= 60 ? 'text-yellow-400' :
                                'text-red-400'
                              }`}>
                                Score: {lesson.score}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {lesson.status === 'in_progress' && (
                        <span className="px-3 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
                          In Progress
                        </span>
                      )}
                      {lesson.status === 'not_started' && (
                        <span className="px-3 py-1 rounded-full text-xs bg-gray-700 text-gray-400 border border-gray-600">
                          Not Started
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'quizzes' && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-sm font-semibold text-gray-300">Quiz</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-300">Date</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-300">Score</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-300">Correct Answers</th>
                  <th className="text-left p-4 text-sm font-semibold text-gray-300">Time Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {mockEnrollment.quizResults.map((quiz) => (
                  <tr key={quiz.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-4">
                      <p className="text-white font-medium">{quiz.lessonTitle}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-400">{formatDate(quiz.attemptedAt)}</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        quiz.score >= 80 ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                        quiz.score >= 60 ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                        'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {quiz.score}%
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-400">
                        {quiz.correctAnswers} / {quiz.totalQuestions}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-400">{quiz.timeSpent} min</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="space-y-6">
            {mockEnrollment.activityLog.map((activity, index) => (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className="w-2 h-2 rounded-full bg-purple-400 mt-2" />
                <div className="flex-1">
                  <p className="text-white">{activity.description}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {getRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
