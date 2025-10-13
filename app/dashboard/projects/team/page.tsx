'use client'

import { useState } from 'react'
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  User,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
  TrendingUp,
  Activity,
  Grid3x3,
  List,
  Users,
  Shield,
  Code,
  Palette,
  Settings,
  Star
} from 'lucide-react'

// Types
type TeamRole = 'project_manager' | 'lead_developer' | 'developer' | 'designer' | 'qa_engineer' | 'devops'
type MemberStatus = 'active' | 'inactive' | 'on_leave'
type ViewMode = 'grid' | 'list'

interface TeamMember {
  id: string
  name: string
  email: string
  phone?: string
  role: TeamRole
  status: MemberStatus
  avatar?: string
  joinedAt: string
  hourlyRate?: number
  hoursLogged: number
  tasksAssigned: number
  tasksCompleted: number
  tasksInProgress: number
  performanceScore?: number
  lastActive: string
  skills: string[]
  certifications?: string[]
}

// Mock data
const mockTeamMembers: TeamMember[] = [
  {
    id: 'member-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    phone: '+1 (555) 123-4567',
    role: 'project_manager',
    status: 'active',
    joinedAt: '2025-01-15T10:00:00Z',
    hourlyRate: 85,
    hoursLogged: 142,
    tasksAssigned: 8,
    tasksCompleted: 6,
    tasksInProgress: 2,
    performanceScore: 94,
    lastActive: '2025-10-13T16:30:00Z',
    skills: ['Project Management', 'Agile', 'Scrum', 'Leadership'],
    certifications: ['PMP', 'Scrum Master']
  },
  {
    id: 'member-2',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    phone: '+1 (555) 234-5678',
    role: 'lead_developer',
    status: 'active',
    joinedAt: '2025-02-01T10:00:00Z',
    hourlyRate: 95,
    hoursLogged: 168,
    tasksAssigned: 12,
    tasksCompleted: 8,
    tasksInProgress: 3,
    performanceScore: 91,
    lastActive: '2025-10-13T15:45:00Z',
    skills: ['Node.js', 'React', 'TypeScript', 'Architecture'],
    certifications: ['AWS Solutions Architect']
  },
  {
    id: 'member-3',
    name: 'Alex Rivera',
    email: 'alex.rivera@company.com',
    phone: '+1 (555) 345-6789',
    role: 'designer',
    status: 'active',
    joinedAt: '2025-02-10T10:00:00Z',
    hourlyRate: 75,
    hoursLogged: 124,
    tasksAssigned: 10,
    tasksCompleted: 7,
    tasksInProgress: 2,
    performanceScore: 88,
    lastActive: '2025-10-13T14:20:00Z',
    skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'Prototyping'],
    certifications: ['Google UX Design']
  },
  {
    id: 'member-4',
    name: 'Emma Wilson',
    email: 'emma.wilson@company.com',
    phone: '+1 (555) 456-7890',
    role: 'developer',
    status: 'active',
    joinedAt: '2025-03-01T10:00:00Z',
    hourlyRate: 80,
    hoursLogged: 156,
    tasksAssigned: 15,
    tasksCompleted: 11,
    tasksInProgress: 4,
    performanceScore: 89,
    lastActive: '2025-10-13T16:00:00Z',
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    certifications: []
  },
  {
    id: 'member-5',
    name: 'David Park',
    email: 'david.park@company.com',
    phone: '+1 (555) 567-8901',
    role: 'qa_engineer',
    status: 'active',
    joinedAt: '2025-03-15T10:00:00Z',
    hourlyRate: 70,
    hoursLogged: 98,
    tasksAssigned: 9,
    tasksCompleted: 6,
    tasksInProgress: 2,
    performanceScore: 92,
    lastActive: '2025-10-13T13:30:00Z',
    skills: ['Test Automation', 'Selenium', 'Jest', 'Cypress'],
    certifications: ['ISTQB']
  },
  {
    id: 'member-6',
    name: 'Lisa Martinez',
    email: 'lisa.martinez@company.com',
    phone: '+1 (555) 678-9012',
    role: 'devops',
    status: 'on_leave',
    joinedAt: '2025-04-01T10:00:00Z',
    hourlyRate: 90,
    hoursLogged: 86,
    tasksAssigned: 6,
    tasksCompleted: 4,
    tasksInProgress: 1,
    performanceScore: 85,
    lastActive: '2025-10-10T10:00:00Z',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'],
    certifications: ['AWS DevOps Professional']
  }
]

// Helper functions
function getRoleIcon(role: TeamRole) {
  switch (role) {
    case 'project_manager':
      return <Shield className="w-5 h-5" />
    case 'lead_developer':
      return <Code className="w-5 h-5" />
    case 'developer':
      return <Code className="w-5 h-5" />
    case 'designer':
      return <Palette className="w-5 h-5" />
    case 'qa_engineer':
      return <CheckCircle2 className="w-5 h-5" />
    case 'devops':
      return <Settings className="w-5 h-5" />
  }
}

function getRoleColor(role: TeamRole): string {
  switch (role) {
    case 'project_manager':
      return 'bg-purple-500/20 text-purple-400'
    case 'lead_developer':
      return 'bg-blue-500/20 text-blue-400'
    case 'developer':
      return 'bg-cyan-500/20 text-cyan-400'
    case 'designer':
      return 'bg-pink-500/20 text-pink-400'
    case 'qa_engineer':
      return 'bg-green-500/20 text-green-400'
    case 'devops':
      return 'bg-orange-500/20 text-orange-400'
  }
}

function getStatusColor(status: MemberStatus): string {
  switch (status) {
    case 'active':
      return 'bg-green-500/20 text-green-400'
    case 'inactive':
      return 'bg-gray-500/20 text-gray-400'
    case 'on_leave':
      return 'bg-yellow-500/20 text-yellow-400'
  }
}

function formatRole(role: TeamRole): string {
  return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

function getPerformanceLevel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Excellent', color: 'text-green-400' }
  if (score >= 80) return { label: 'Good', color: 'text-blue-400' }
  if (score >= 70) return { label: 'Average', color: 'text-yellow-400' }
  return { label: 'Needs Improvement', color: 'text-red-400' }
}

function getTaskCompletionRate(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

function getTimeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export default function ProjectTeamPage() {
  const [members] = useState<TeamMember[]>(mockTeamMembers)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRoles, setSelectedRoles] = useState<TeamRole[]>([])
  const [showFilters, setShowFilters] = useState(false)

  // Filter members
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(member.role)
    return matchesSearch && matchesRole
  })

  const activeMembers = members.filter(m => m.status === 'active').length
  const totalHours = members.reduce((sum, m) => sum + m.hoursLogged, 0)
  const totalTasksCompleted = members.reduce((sum, m) => sum + m.tasksCompleted, 0)
  const avgPerformance = Math.round(
    members.reduce((sum, m) => sum + (m.performanceScore || 0), 0) / members.length
  )

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent">
              Project Team
            </h1>
            <p className="text-gray-400 mt-1">Manage team members and track performance</p>
          </div>

          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            Add Member
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Team Members</div>
            <div className="text-2xl font-bold text-white">{members.length}</div>
            <div className="text-xs text-gray-500 mt-1">{activeMembers} active</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Total Hours</div>
            <div className="text-2xl font-bold text-purple-400">{totalHours}h</div>
            <div className="text-xs text-gray-500 mt-1">This project</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Tasks Completed</div>
            <div className="text-2xl font-bold text-green-400">{totalTasksCompleted}</div>
            <div className="text-xs text-gray-500 mt-1">Across all members</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Avg Performance</div>
            <div className="text-2xl font-bold text-yellow-400">{avgPerformance}%</div>
            <div className="text-xs text-gray-500 mt-1">{getPerformanceLevel(avgPerformance).label}</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              showFilters ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-400">Role:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['project_manager', 'lead_developer', 'developer', 'designer', 'qa_engineer', 'devops'] as TeamRole[]).map(role => (
                <button
                  key={role}
                  onClick={() => {
                    setSelectedRoles(prev =>
                      prev.includes(role)
                        ? prev.filter(r => r !== role)
                        : [...prev, role]
                    )
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedRoles.includes(role)
                      ? getRoleColor(role)
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {formatRole(role)}
                </button>
              ))}
              {selectedRoles.length > 0 && (
                <button
                  onClick={() => setSelectedRoles([])}
                  className="px-3 py-1 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Members Grid/List */}
      {filteredMembers.length === 0 ? (
        <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No team members found</h3>
          <p className="text-gray-400 mb-6">Add team members to get started</p>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 mx-auto transition-colors">
            <Plus className="w-4 h-4" />
            Add Member
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-3 gap-6">
          {filteredMembers.map(member => {
            const completionRate = getTaskCompletionRate(member.tasksCompleted, member.tasksAssigned)
            const performance = member.performanceScore ? getPerformanceLevel(member.performanceScore) : null

            return (
              <div
                key={member.id}
                className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 hover:border-purple-500 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg">
                      {getInitials(member.name)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{member.name}</h3>
                      <div className={`px-2 py-0.5 rounded text-xs font-medium inline-flex items-center gap-1 mt-1 ${getRoleColor(member.role)}`}>
                        {getRoleIcon(member.role)}
                        <span>{formatRole(member.role)}</span>
                      </div>
                    </div>
                  </div>

                  <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-700">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(member.status)}`}>
                    {member.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400">
                    <Activity className="w-3 h-3 inline mr-1" />
                    {getTimeAgo(member.lastActive)}
                  </span>
                </div>

                {/* Contact */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-gray-900 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-400 mb-1">Hours</div>
                    <div className="text-lg font-semibold text-white">{member.hoursLogged}</div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-400 mb-1">Tasks</div>
                    <div className="text-lg font-semibold text-white">{member.tasksCompleted}/{member.tasksAssigned}</div>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-2 text-center">
                    <div className="text-xs text-gray-400 mb-1">Rate</div>
                    <div className="text-lg font-semibold text-purple-400">{completionRate}%</div>
                  </div>
                </div>

                {/* Performance */}
                {member.performanceScore && performance && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-gray-400">Performance Score</span>
                      <span className={`font-medium ${performance.color}`}>
                        {member.performanceScore}% - {performance.label}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                        style={{ width: `${member.performanceScore}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Skills */}
                {member.skills.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-400 mb-2">Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 3).map(skill => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                      {member.skills.length > 3 && (
                        <span className="px-2 py-0.5 text-gray-500 text-xs">
                          +{member.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {member.certifications && member.certifications.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Award className="w-3 h-3" />
                    <span>{member.certifications.join(', ')}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-gray-800/30 rounded-lg border border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-400">
            <div className="col-span-3">Member</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Tasks</div>
            <div className="col-span-2">Performance</div>
            <div className="col-span-1"></div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-700">
            {filteredMembers.map(member => {
              const completionRate = getTaskCompletionRate(member.tasksCompleted, member.tasksAssigned)
              const performance = member.performanceScore ? getPerformanceLevel(member.performanceScore) : null

              return (
                <div
                  key={member.id}
                  className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="col-span-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {getInitials(member.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-white truncate">{member.name}</div>
                      <div className="text-xs text-gray-400 truncate">{member.email}</div>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <div className={`px-2 py-1 rounded text-xs font-medium inline-flex items-center gap-1 ${getRoleColor(member.role)}`}>
                      {getRoleIcon(member.role)}
                      <span>{formatRole(member.role)}</span>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <div className="space-y-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(member.status)}`}>
                        {member.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <div className="text-xs text-gray-500">
                        {getTimeAgo(member.lastActive)}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <div className="space-y-1">
                      <div className="text-sm text-white font-medium">
                        {member.tasksCompleted}/{member.tasksAssigned} completed
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{completionRate}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center">
                    {member.performanceScore && performance ? (
                      <div className="space-y-1 w-full">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${performance.color}`}>
                            {member.performanceScore}%
                          </span>
                          <span className="text-xs text-gray-400">{performance.label}</span>
                        </div>
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                            style={{ width: `${member.performanceScore}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">N/A</span>
                    )}
                  </div>
                  <div className="col-span-1 flex items-center justify-end">
                    <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
