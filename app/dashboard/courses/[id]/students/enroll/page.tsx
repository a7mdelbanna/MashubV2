'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Search,
  UserPlus,
  Users,
  Mail,
  X,
  Check,
  Upload,
  Download,
  AlertCircle
} from 'lucide-react'

// Mock data
const mockCourse = {
  id: 'c1',
  title: 'Complete Web Development Bootcamp',
  price: 49.99,
  currency: 'USD'
}

const mockAvailableUsers = [
  {
    id: 'u5',
    name: 'John Smith',
    email: 'john.smith@example.com',
    avatar: null,
    isAlreadyEnrolled: false
  },
  {
    id: 'u6',
    name: 'Emily Brown',
    email: 'emily.brown@example.com',
    avatar: null,
    isAlreadyEnrolled: false
  },
  {
    id: 'u7',
    name: 'David Lee',
    email: 'david.lee@example.com',
    avatar: null,
    isAlreadyEnrolled: true
  },
  {
    id: 'u8',
    name: 'Lisa Taylor',
    email: 'lisa.taylor@example.com',
    avatar: null,
    isAlreadyEnrolled: false
  },
  {
    id: 'u9',
    name: 'Robert Martinez',
    email: 'robert.martinez@example.com',
    avatar: null,
    isAlreadyEnrolled: false
  }
]

interface EnrollmentOption {
  enrollmentType: 'paid' | 'free' | 'trial'
  duration: number | null // days, null for unlimited
  accessLevel: 'full' | 'preview'
  sendEmail: boolean
  customMessage: string
}

export default function EnrollStudentsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [enrollmentOptions, setEnrollmentOptions] = useState<EnrollmentOption>({
    enrollmentType: 'free',
    duration: null,
    accessLevel: 'full',
    sendEmail: true,
    customMessage: ''
  })

  const [bulkEmailInput, setBulkEmailInput] = useState('')

  // Filter users by search query
  const filteredUsers = mockAvailableUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Toggle user selection
  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(userId)) {
        newSet.delete(userId)
      } else {
        newSet.add(userId)
      }
      return newSet
    })
  }

  // Select all filtered users
  const selectAllUsers = () => {
    const eligibleUsers = filteredUsers.filter(u => !u.isAlreadyEnrolled)
    const newSet = new Set(selectedUsers)
    eligibleUsers.forEach(u => newSet.add(u.id))
    setSelectedUsers(newSet)
  }

  // Clear selection
  const clearSelection = () => {
    setSelectedUsers(new Set())
  }

  // Parse bulk emails
  const handleBulkEmailParse = () => {
    const emails = bulkEmailInput
      .split(/[\n,;]/)
      .map(e => e.trim())
      .filter(e => e && e.includes('@'))

    console.log('Parsed emails:', emails)
    // Here you would typically:
    // 1. Validate emails
    // 2. Check if users exist
    // 3. Add them to selection
    alert(`Found ${emails.length} valid email(s). In production, these would be validated and added to selection.`)
  }

  // Submit enrollment
  const handleEnroll = async () => {
    if (selectedUsers.size === 0) {
      alert('Please select at least one student to enroll')
      return
    }

    console.log('Enrolling students:', {
      studentIds: Array.from(selectedUsers),
      options: enrollmentOptions
    })

    // API call would go here
    alert(`Successfully enrolled ${selectedUsers.size} student(s)!`)

    // Navigate back to students list
    router.push(`/dashboard/courses/${courseId}/students`)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/dashboard/courses/${courseId}/students`}
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students</span>
        </Link>

        <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
          Enroll Students
        </h1>
        <p className="text-gray-400">Add students to {mockCourse.title}</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left Column - User Selection */}
        <div className="col-span-2 space-y-6">
          {/* Search and Select Users */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Select Students</h2>
              {selectedUsers.size > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">
                    {selectedUsers.size} selected
                  </span>
                  <button
                    onClick={clearSelection}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2 mb-4">
              <button
                onClick={selectAllUsers}
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
              >
                Select all
              </button>
            </div>

            {/* User List */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <div className="py-12 text-center">
                  <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">No users found</p>
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <label
                    key={user.id}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${
                      user.isAlreadyEnrolled
                        ? 'bg-gray-800/30 border-gray-700 opacity-50 cursor-not-allowed'
                        : selectedUsers.has(user.id)
                        ? 'bg-purple-500/10 border-purple-500/30'
                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={() => !user.isAlreadyEnrolled && toggleUserSelection(user.id)}
                      disabled={user.isAlreadyEnrolled}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900 disabled:opacity-50"
                    />

                    <div className="w-10 h-10 rounded-full bg-gradient-purple flex items-center justify-center text-white font-semibold text-sm">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{user.name}</p>
                      <p className="text-sm text-gray-400 truncate">{user.email}</p>
                    </div>

                    {user.isAlreadyEnrolled && (
                      <span className="px-2 py-1 rounded text-xs bg-gray-700 text-gray-400 border border-gray-600">
                        Already Enrolled
                      </span>
                    )}
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Bulk Enrollment */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Bulk Enrollment</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Paste email addresses
                </label>
                <textarea
                  value={bulkEmailInput}
                  onChange={(e) => setBulkEmailInput(e.target.value)}
                  placeholder="Enter email addresses separated by commas, semicolons, or new lines&#10;example@domain.com, user@example.com&#10;admin@company.com"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleBulkEmailParse}
                  className="px-4 py-2 rounded-lg gradient-purple text-white hover:opacity-90 transition-all"
                >
                  Parse & Add
                </button>

                <button className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all flex items-center space-x-2">
                  <Upload className="w-4 h-4" />
                  <span>Upload CSV</span>
                </button>

                <button className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Template</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Enrollment Options */}
        <div className="space-y-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Enrollment Options</h2>

            <div className="space-y-6">
              {/* Enrollment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Enrollment Type
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'free', label: 'Free Enrollment', desc: 'No payment required' },
                    { value: 'paid', label: 'Paid Enrollment', desc: `Charge $${mockCourse.price}` },
                    { value: 'trial', label: 'Trial Access', desc: 'Limited time access' }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        enrollmentOptions.enrollmentType === option.value
                          ? 'bg-purple-500/10 border-purple-500/30'
                          : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="enrollmentType"
                        value={option.value}
                        checked={enrollmentOptions.enrollmentType === option.value}
                        onChange={(e) =>
                          setEnrollmentOptions(prev => ({
                            ...prev,
                            enrollmentType: e.target.value as any
                          }))
                        }
                        className="mt-0.5 w-4 h-4 border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                      />
                      <div>
                        <p className="text-white font-medium text-sm">{option.label}</p>
                        <p className="text-xs text-gray-400">{option.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Access Duration
                </label>
                <select
                  value={enrollmentOptions.duration || ''}
                  onChange={(e) =>
                    setEnrollmentOptions(prev => ({
                      ...prev,
                      duration: e.target.value ? parseInt(e.target.value) : null
                    }))
                  }
                  className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Unlimited</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="90">90 days</option>
                  <option value="365">1 year</option>
                </select>
              </div>

              {/* Access Level */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Access Level
                </label>
                <select
                  value={enrollmentOptions.accessLevel}
                  onChange={(e) =>
                    setEnrollmentOptions(prev => ({
                      ...prev,
                      accessLevel: e.target.value as any
                    }))
                  }
                  className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="full">Full Access</option>
                  <option value="preview">Preview Only</option>
                </select>
              </div>

              {/* Send Email */}
              <label className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 cursor-pointer hover:bg-gray-800/70 transition-colors">
                <div>
                  <p className="text-white font-medium text-sm">Send Welcome Email</p>
                  <p className="text-xs text-gray-400">Notify students via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={enrollmentOptions.sendEmail}
                  onChange={(e) =>
                    setEnrollmentOptions(prev => ({
                      ...prev,
                      sendEmail: e.target.checked
                    }))
                  }
                  className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                />
              </label>

              {/* Custom Message */}
              {enrollmentOptions.sendEmail && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Custom Message (Optional)
                  </label>
                  <textarea
                    value={enrollmentOptions.customMessage}
                    onChange={(e) =>
                      setEnrollmentOptions(prev => ({
                        ...prev,
                        customMessage: e.target.value
                      }))
                    }
                    placeholder="Add a personal message to the welcome email..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Summary</h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Students selected:</span>
                <span className="text-white font-medium">{selectedUsers.size}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Enrollment type:</span>
                <span className="text-white font-medium capitalize">
                  {enrollmentOptions.enrollmentType}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Duration:</span>
                <span className="text-white font-medium">
                  {enrollmentOptions.duration ? `${enrollmentOptions.duration} days` : 'Unlimited'}
                </span>
              </div>
            </div>

            {selectedUsers.size > 0 && enrollmentOptions.enrollmentType === 'paid' && (
              <div className="mt-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-blue-400">
                    Manual enrollment will not charge students. Handle payments separately.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleEnroll}
              disabled={selectedUsers.size === 0}
              className="w-full px-6 py-3 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="w-5 h-5" />
              <span>Enroll {selectedUsers.size > 0 ? `${selectedUsers.size} ` : ''}Student{selectedUsers.size !== 1 ? 's' : ''}</span>
            </button>

            <Link
              href={`/dashboard/courses/${courseId}/students`}
              className="w-full px-6 py-3 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all flex items-center justify-center"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
