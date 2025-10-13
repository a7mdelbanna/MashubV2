'use client'

import { useState } from 'react'
import { Plus, Search, Filter, Users, TrendingUp, Clock, Award, Target, Grid3x3, List as ListIcon, Calendar, Mail, Phone, Star, MoreVertical, Eye, Heart } from 'lucide-react'
import Link from 'next/link'
import { Candidate, CandidateStatus, ApplicationSource } from '@/types/candidates'
import {
  getCandidateStatusColor,
  getExperienceLevelColor,
  formatCandidateStatus,
  formatExperienceLevel,
  formatApplicationSource,
  calculateDaysInProcess,
  calculateOverallScore,
  sortCandidatesByScore
} from '@/lib/candidates-utils'

// Mock data
const mockCandidates: Candidate[] = [
  {
    id: 'cand-1',
    tenantId: 'tenant-1',
    firstName: 'Sarah',
    lastName: 'Johnson',
    fullName: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    location: { city: 'San Francisco', state: 'CA', country: 'USA' },
    currentJobTitle: 'Senior Full Stack Developer',
    currentCompany: 'TechCorp Inc',
    yearsOfExperience: 8,
    experienceLevel: 'senior',
    positionId: 'pos-1',
    positionTitle: 'Lead Developer',
    department: 'Engineering',
    status: 'interview',
    applicationDate: '2025-10-01T10:00:00Z',
    source: 'linkedin',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
    education: [],
    interviews: [
      { id: 'int-1', candidateId: 'cand-1', stage: 'phone_screen', status: 'completed', duration: 60, timezone: 'PST', interviewers: [], createdAt: '2025-10-05', updatedAt: '2025-10-05', createdBy: 'rec-1', overallRating: 4.5 },
      { id: 'int-2', candidateId: 'cand-1', stage: 'technical', status: 'scheduled', duration: 90, timezone: 'PST', scheduledAt: '2025-10-20T14:00:00Z', interviewers: [], createdAt: '2025-10-10', updatedAt: '2025-10-10', createdBy: 'rec-1' }
    ],
    assessments: [],
    notes: [],
    emails: [],
    calls: [],
    tags: ['Hot Candidate', 'Senior'],
    priority: 'high',
    isBookmarked: true,
    screeningScore: 4.5,
    overallScore: 4.3,
    createdAt: '2025-10-01T10:00:00Z',
    updatedAt: '2025-10-13T16:00:00Z',
    lastActivityAt: '2025-10-13T16:00:00Z'
  },
  {
    id: 'cand-2',
    tenantId: 'tenant-1',
    firstName: 'Michael',
    lastName: 'Chen',
    fullName: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 234-5678',
    location: { city: 'Seattle', state: 'WA', country: 'USA' },
    currentJobTitle: 'Frontend Developer',
    currentCompany: 'StartupXYZ',
    yearsOfExperience: 5,
    experienceLevel: 'mid',
    positionId: 'pos-1',
    positionTitle: 'Lead Developer',
    department: 'Engineering',
    status: 'assessment',
    applicationDate: '2025-10-03T10:00:00Z',
    source: 'referral',
    referredBy: { employeeId: 'emp-1', employeeName: 'John Doe', bonus: 5000 },
    skills: ['React', 'Vue.js', 'JavaScript', 'CSS', 'Figma'],
    education: [],
    interviews: [
      { id: 'int-3', candidateId: 'cand-2', stage: 'phone_screen', status: 'completed', duration: 60, timezone: 'PST', interviewers: [], createdAt: '2025-10-07', updatedAt: '2025-10-07', createdBy: 'rec-1', overallRating: 4.0 }
    ],
    assessments: [
      { id: 'ass-1', candidateId: 'cand-2', type: 'technical', title: 'React Coding Challenge', assignedAt: '2025-10-10', dueDate: '2025-10-17', createdAt: '2025-10-10' }
    ],
    notes: [],
    emails: [],
    calls: [],
    tags: ['Referral'],
    priority: 'high',
    isBookmarked: false,
    screeningScore: 4.0,
    overallScore: 4.0,
    createdAt: '2025-10-03T10:00:00Z',
    updatedAt: '2025-10-13T14:00:00Z',
    lastActivityAt: '2025-10-13T14:00:00Z'
  },
  {
    id: 'cand-3',
    tenantId: 'tenant-1',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    fullName: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1 (555) 345-6789',
    location: { city: 'Austin', state: 'TX', country: 'USA' },
    currentJobTitle: 'Junior Developer',
    currentCompany: 'WebSolutions LLC',
    yearsOfExperience: 2,
    experienceLevel: 'junior',
    positionId: 'pos-2',
    positionTitle: 'Frontend Developer',
    department: 'Engineering',
    status: 'screening',
    applicationDate: '2025-10-08T10:00:00Z',
    source: 'website',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    education: [],
    interviews: [],
    assessments: [],
    notes: [],
    emails: [],
    calls: [],
    tags: ['Entry Level'],
    priority: 'medium',
    isBookmarked: false,
    screeningScore: 3.5,
    createdAt: '2025-10-08T10:00:00Z',
    updatedAt: '2025-10-12T10:00:00Z',
    lastActivityAt: '2025-10-12T10:00:00Z'
  },
  {
    id: 'cand-4',
    tenantId: 'tenant-1',
    firstName: 'David',
    lastName: 'Kim',
    fullName: 'David Kim',
    email: 'david.kim@email.com',
    phone: '+1 (555) 456-7890',
    location: { city: 'New York', state: 'NY', country: 'USA' },
    currentJobTitle: 'Senior Backend Engineer',
    currentCompany: 'BigTech Corp',
    yearsOfExperience: 10,
    experienceLevel: 'senior',
    positionId: 'pos-3',
    positionTitle: 'Backend Architect',
    department: 'Engineering',
    status: 'offer',
    applicationDate: '2025-09-25T10:00:00Z',
    source: 'recruiter',
    skills: ['Python', 'Go', 'Kubernetes', 'PostgreSQL', 'Redis'],
    education: [],
    interviews: [
      { id: 'int-4', candidateId: 'cand-4', stage: 'phone_screen', status: 'completed', duration: 60, timezone: 'EST', interviewers: [], createdAt: '2025-09-28', updatedAt: '2025-09-28', createdBy: 'rec-1', overallRating: 5.0 },
      { id: 'int-5', candidateId: 'cand-4', stage: 'technical', status: 'completed', duration: 90, timezone: 'EST', interviewers: [], createdAt: '2025-10-02', updatedAt: '2025-10-02', createdBy: 'rec-1', overallRating: 4.8 },
      { id: 'int-6', candidateId: 'cand-4', stage: 'final', status: 'completed', duration: 60, timezone: 'EST', interviewers: [], createdAt: '2025-10-08', updatedAt: '2025-10-08', createdBy: 'rec-1', overallRating: 4.9 }
    ],
    assessments: [],
    offer: {
      id: 'off-1',
      candidateId: 'cand-4',
      status: 'sent',
      positionTitle: 'Backend Architect',
      department: 'Engineering',
      employmentType: 'full_time',
      startDate: '2025-11-15',
      location: 'New York, NY',
      remote: true,
      baseSalary: 180000,
      currency: 'USD',
      benefits: ['Health Insurance', '401k', 'Stock Options'],
      sentAt: '2025-10-12T10:00:00Z',
      expiresAt: '2025-10-26T10:00:00Z',
      createdAt: '2025-10-12T10:00:00Z',
      createdBy: 'rec-1'
    },
    notes: [],
    emails: [],
    calls: [],
    tags: ['Senior', 'Hot Candidate'],
    priority: 'urgent',
    isBookmarked: true,
    screeningScore: 5.0,
    overallScore: 4.9,
    createdAt: '2025-09-25T10:00:00Z',
    updatedAt: '2025-10-12T10:00:00Z',
    lastActivityAt: '2025-10-12T10:00:00Z'
  },
  {
    id: 'cand-5',
    tenantId: 'tenant-1',
    firstName: 'Lisa',
    lastName: 'Wang',
    fullName: 'Lisa Wang',
    email: 'lisa.wang@email.com',
    location: { city: 'Boston', state: 'MA', country: 'USA' },
    yearsOfExperience: 1,
    experienceLevel: 'entry',
    positionId: 'pos-4',
    positionTitle: 'Junior Developer',
    department: 'Engineering',
    status: 'new',
    applicationDate: '2025-10-13T10:00:00Z',
    source: 'job_board',
    skills: ['Python', 'Django', 'SQL'],
    education: [],
    interviews: [],
    assessments: [],
    notes: [],
    emails: [],
    calls: [],
    tags: ['Fresh Graduate'],
    priority: 'low',
    isBookmarked: false,
    createdAt: '2025-10-13T10:00:00Z',
    updatedAt: '2025-10-13T10:00:00Z',
    lastActivityAt: '2025-10-13T10:00:00Z'
  }
]

export default function CandidatesPage() {
  const [candidates] = useState<Candidate[]>(mockCandidates)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<CandidateStatus | 'all'>('all')
  const [viewMode, setViewMode] = useState<'list' | 'pipeline'>('list')

  // Calculate stats
  const stats = {
    total: candidates.length,
    new: candidates.filter(c => c.status === 'new').length,
    interview: candidates.filter(c => c.status === 'interview').length,
    offer: candidates.filter(c => c.status === 'offer').length,
    avgScore: candidates.length > 0
      ? Math.round(candidates.reduce((sum, c) => sum + (c.overallScore || 0), 0) / candidates.length * 10) / 10
      : 0
  }

  // Filter candidates
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         candidate.positionTitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || candidate.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Pipeline view grouping
  const pipelineStages: { status: CandidateStatus; label: string; count: number }[] = [
    { status: 'new', label: 'New', count: candidates.filter(c => c.status === 'new').length },
    { status: 'screening', label: 'Screening', count: candidates.filter(c => c.status === 'screening').length },
    { status: 'interview', label: 'Interview', count: candidates.filter(c => c.status === 'interview').length },
    { status: 'assessment', label: 'Assessment', count: candidates.filter(c => c.status === 'assessment').length },
    { status: 'offer', label: 'Offer', count: candidates.filter(c => c.status === 'offer').length },
    { status: 'hired', label: 'Hired', count: candidates.filter(c => c.status === 'hired').length }
  ]

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent">
              Candidates
            </h1>
            <p className="text-gray-400 mt-1">Manage recruitment pipeline and candidates</p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/candidates/positions">
              <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors">
                <Target className="w-4 h-4" />
                Job Positions
              </button>
            </Link>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" />
              Add Candidate
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Total Candidates</div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">New Applications</div>
            <div className="text-2xl font-bold text-blue-400">{stats.new}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">In Interview</div>
            <div className="text-2xl font-bold text-purple-400">{stats.interview}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Offers Sent</div>
            <div className="text-2xl font-bold text-green-400">{stats.offer}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Avg Score</div>
            <div className="text-2xl font-bold text-yellow-400">{stats.avgScore}/5</div>
          </div>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as CandidateStatus | 'all')}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="screening">Screening</option>
            <option value="interview">Interview</option>
            <option value="assessment">Assessment</option>
            <option value="offer">Offer</option>
            <option value="hired">Hired</option>
          </select>

          <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('pipeline')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'pipeline' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredCandidates.map(candidate => (
            <Link key={candidate.id} href={`/dashboard/candidates/${candidate.id}`}>
              <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 hover:border-purple-500 transition-colors cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                      {candidate.firstName[0]}{candidate.lastName[0]}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-white">{candidate.fullName}</h3>
                        {candidate.isBookmarked && <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />}
                        {candidate.priority === 'urgent' && (
                          <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs font-medium">URGENT</span>
                        )}
                      </div>

                      <p className="text-gray-400 text-sm mb-2">
                        {candidate.currentJobTitle} at {candidate.currentCompany} • {candidate.yearsOfExperience} years exp
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span>{candidate.email}</span>
                        </div>
                        {candidate.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            <span>{candidate.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>Applied {calculateDaysInProcess(candidate.applicationDate)}d ago</span>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 5).map(skill => (
                          <span key={skill} className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 5 && (
                          <span className="px-2 py-0.5 text-gray-500 text-xs">
                            +{candidate.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Side */}
                  <div className="flex items-start gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-400 mb-1">Position</div>
                      <div className="text-white font-medium">{candidate.positionTitle}</div>
                      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium mt-2 ${getExperienceLevelColor(candidate.experienceLevel)}`}>
                        {formatExperienceLevel(candidate.experienceLevel)}
                      </span>
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-400 mb-1">Status</div>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCandidateStatusColor(candidate.status)}`}>
                        {formatCandidateStatus(candidate.status)}
                      </span>
                      {candidate.overallScore && (
                        <div className="mt-2">
                          <div className="flex items-center gap-1">
                            <Award className="w-3 h-3 text-yellow-400" />
                            <span className="text-sm text-white font-medium">{candidate.overallScore}/5</span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-sm text-gray-400 mb-1">Source</div>
                      <div className="text-white text-sm">{formatApplicationSource(candidate.source)}</div>
                      {candidate.referredBy && (
                        <span className="inline-block px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded text-xs mt-2">
                          Referral
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        /* Pipeline View */
        <div className="flex gap-4 overflow-x-auto pb-4">
          {pipelineStages.map(stage => (
            <div key={stage.status} className="flex-shrink-0 w-80">
              <div className="bg-gray-800/30 rounded-lg border border-gray-700">
                <div className="p-4 border-b border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white">{stage.label}</h3>
                    <span className="px-2 py-0.5 bg-gray-700 rounded text-xs text-gray-300">
                      {stage.count}
                    </span>
                  </div>
                </div>

                <div className="p-3 space-y-3 max-h-[600px] overflow-y-auto">
                  {candidates.filter(c => c.status === stage.status).map(candidate => (
                    <Link key={candidate.id} href={`/dashboard/candidates/${candidate.id}`}>
                      <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4 hover:border-purple-500 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                            {candidate.firstName[0]}{candidate.lastName[0]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm truncate">{candidate.fullName}</h4>
                            <p className="text-xs text-gray-400 truncate">{candidate.positionTitle}</p>
                          </div>
                          {candidate.isBookmarked && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />}
                        </div>

                        {candidate.overallScore && (
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-gray-400">Score</span>
                            <span className="text-white font-medium">{candidate.overallScore}/5</span>
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{calculateDaysInProcess(candidate.applicationDate)}d in process</span>
                          <span className={`px-2 py-0.5 rounded ${getExperienceLevelColor(candidate.experienceLevel)}`}>
                            {formatExperienceLevel(candidate.experienceLevel).split(' ')[0]}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredCandidates.length === 0 && (
        <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No candidates found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your filters or add a new candidate</p>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 mx-auto transition-colors">
            <Plus className="w-4 h-4" />
            Add Candidate
          </button>
        </div>
      )}
    </div>
  )
}
