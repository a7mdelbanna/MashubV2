'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Award,
  BookOpen,
  Clock,
  CheckCircle,
  BarChart3,
  Calendar,
  ArrowUp,
  ArrowDown,
  Eye
} from 'lucide-react'

// Mock data
const mockAnalytics = {
  overview: {
    totalStudents: 1247,
    studentGrowth: 12.5,
    totalRevenue: 89456,
    revenueGrowth: 18.3,
    completionRate: 68.4,
    completionChange: -2.1,
    avgRating: 4.6,
    ratingChange: 0.3
  },

  enrollmentTrend: [
    { month: 'Jan', enrollments: 142, revenue: 7890 },
    { month: 'Feb', enrollments: 165, revenue: 8234 },
    { month: 'Mar', enrollments: 189, revenue: 9456 },
    { month: 'Apr', enrollments: 178, revenue: 8901 },
    { month: 'May', enrollments: 203, revenue: 10234 },
    { month: 'Jun', enrollments: 195, revenue: 9789 }
  ],

  topCourses: [
    {
      id: 'c1',
      title: 'Complete Web Development Bootcamp',
      students: 342,
      revenue: 24567,
      completionRate: 72,
      rating: 4.8,
      growth: 15.2
    },
    {
      id: 'c2',
      title: 'Advanced React & TypeScript',
      students: 287,
      revenue: 18945,
      completionRate: 68,
      rating: 4.7,
      growth: 12.8
    },
    {
      id: 'c3',
      title: 'Full Stack JavaScript',
      students: 256,
      revenue: 16234,
      completionRate: 65,
      rating: 4.6,
      growth: 8.3
    },
    {
      id: 'c4',
      title: 'Python for Data Science',
      students: 198,
      revenue: 12890,
      completionRate: 71,
      rating: 4.5,
      growth: -3.2
    },
    {
      id: 'c5',
      title: 'UI/UX Design Fundamentals',
      students: 164,
      revenue: 9876,
      completionRate: 69,
      rating: 4.7,
      growth: 22.5
    }
  ],

  recentActivity: [
    {
      id: 'a1',
      type: 'enrollment',
      student: 'John Doe',
      course: 'Complete Web Development Bootcamp',
      timestamp: '2 minutes ago'
    },
    {
      id: 'a2',
      type: 'completion',
      student: 'Sarah Johnson',
      course: 'Advanced React & TypeScript',
      timestamp: '15 minutes ago'
    },
    {
      id: 'a3',
      type: 'certificate',
      student: 'Michael Chen',
      course: 'Full Stack JavaScript',
      timestamp: '1 hour ago'
    },
    {
      id: 'a4',
      type: 'enrollment',
      student: 'Emily Brown',
      course: 'Python for Data Science',
      timestamp: '2 hours ago'
    },
    {
      id: 'a5',
      type: 'review',
      student: 'David Lee',
      course: 'UI/UX Design Fundamentals',
      rating: 5,
      timestamp: '3 hours ago'
    }
  ],

  studentEngagement: {
    dailyActiveUsers: 487,
    avgSessionDuration: 42, // minutes
    avgLessonsPerDay: 3.2,
    mostActiveTime: '7 PM - 9 PM'
  }
}

export default function CoursesAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Format number
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`
    }
    return num.toString()
  }

  // Get activity icon
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment':
        return <Users className="w-4 h-4 text-blue-400" />
      case 'completion':
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case 'certificate':
        return <Award className="w-4 h-4 text-yellow-400" />
      case 'review':
        return <BarChart3 className="w-4 h-4 text-purple-400" />
      default:
        return <BookOpen className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
              Courses Analytics
            </h1>
            <p className="text-gray-400">Track performance and growth of your courses</p>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center space-x-2">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === range
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-gray-800/50 text-gray-400 hover:text-gray-300 border border-gray-700'
                }`}
              >
                {range === '7d' && 'Last 7 days'}
                {range === '30d' && 'Last 30 days'}
                {range === '90d' && 'Last 90 days'}
                {range === '1y' && 'Last year'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${
              mockAnalytics.overview.studentGrowth >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {mockAnalytics.overview.studentGrowth >= 0 ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              <span>{Math.abs(mockAnalytics.overview.studentGrowth)}%</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {formatNumber(mockAnalytics.overview.totalStudents)}
          </p>
          <p className="text-sm text-gray-400">Total Students</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${
              mockAnalytics.overview.revenueGrowth >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {mockAnalytics.overview.revenueGrowth >= 0 ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              <span>{Math.abs(mockAnalytics.overview.revenueGrowth)}%</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {formatCurrency(mockAnalytics.overview.totalRevenue)}
          </p>
          <p className="text-sm text-gray-400">Total Revenue</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-400" />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${
              mockAnalytics.overview.completionChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {mockAnalytics.overview.completionChange >= 0 ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              <span>{Math.abs(mockAnalytics.overview.completionChange)}%</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {mockAnalytics.overview.completionRate}%
          </p>
          <p className="text-sm text-gray-400">Completion Rate</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-400" />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${
              mockAnalytics.overview.ratingChange >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {mockAnalytics.overview.ratingChange >= 0 ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              <span>{Math.abs(mockAnalytics.overview.ratingChange)}</span>
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {mockAnalytics.overview.avgRating}
          </p>
          <p className="text-sm text-gray-400">Average Rating</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Enrollment Trend */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Enrollment Trend</h3>

          <div className="space-y-4">
            {mockAnalytics.enrollmentTrend.map((data, index) => (
              <div key={data.month} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{data.month}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-white font-medium">{data.enrollments} students</span>
                    <span className="text-gray-400">{formatCurrency(data.revenue)}</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-purple rounded-full"
                    style={{
                      width: `${(data.enrollments / Math.max(...mockAnalytics.enrollmentTrend.map(d => d.enrollments))) * 100}%`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Engagement */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Student Engagement</h3>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">Daily Active Users</span>
              </div>
              <span className="text-white font-semibold text-xl">
                {mockAnalytics.studentEngagement.dailyActiveUsers}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-green-400" />
                <span className="text-gray-400">Avg Session Duration</span>
              </div>
              <span className="text-white font-semibold text-xl">
                {mockAnalytics.studentEngagement.avgSessionDuration} min
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-purple-400" />
                <span className="text-gray-400">Avg Lessons/Day</span>
              </div>
              <span className="text-white font-semibold text-xl">
                {mockAnalytics.studentEngagement.avgLessonsPerDay}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-yellow-400" />
                <span className="text-gray-400">Most Active Time</span>
              </div>
              <span className="text-white font-semibold text-xl">
                {mockAnalytics.studentEngagement.mostActiveTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Courses & Recent Activity */}
      <div className="grid grid-cols-3 gap-8">
        {/* Top Performing Courses */}
        <div className="col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Top Performing Courses</h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3 text-sm font-semibold text-gray-300">Course</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-300">Students</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-300">Revenue</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-300">Completion</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-300">Rating</th>
                  <th className="text-left p-3 text-sm font-semibold text-gray-300">Growth</th>
                  <th className="text-right p-3 text-sm font-semibold text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {mockAnalytics.topCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="p-3">
                      <p className="text-white font-medium">{course.title}</p>
                    </td>
                    <td className="p-3">
                      <span className="text-gray-300">{course.students}</span>
                    </td>
                    <td className="p-3">
                      <span className="text-gray-300">{formatCurrency(course.revenue)}</span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-purple rounded-full"
                            style={{ width: `${course.completionRate}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-400">{course.completionRate}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4 text-yellow-400" />
                        <span className="text-gray-300">{course.rating}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className={`flex items-center space-x-1 ${
                        course.growth >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {course.growth >= 0 ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">{Math.abs(course.growth)}%</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/dashboard/courses/${course.id}`}
                        className="flex items-center justify-end text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-6">Recent Activity</h3>

          <div className="space-y-4">
            {mockAnalytics.recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                <div className="mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm">
                    <span className="font-medium">{activity.student}</span>
                    {activity.type === 'enrollment' && ' enrolled in'}
                    {activity.type === 'completion' && ' completed'}
                    {activity.type === 'certificate' && ' earned certificate for'}
                    {activity.type === 'review' && ' reviewed'}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5 truncate">{activity.course}</p>
                  {activity.type === 'review' && activity.rating && (
                    <div className="flex items-center space-x-1 mt-1">
                      {[...Array(activity.rating)].map((_, i) => (
                        <Award key={i} className="w-3 h-3 text-yellow-400" />
                      ))}
                    </div>
                  )}
                  <p className="text-gray-500 text-xs mt-1">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/dashboard/courses/activity"
            className="mt-6 w-full flex items-center justify-center px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all text-sm"
          >
            View All Activity
          </Link>
        </div>
      </div>
    </div>
  )
}
