'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Users,
  Plus,
  X,
  Search,
  Star,
  TrendingUp,
  Clock,
  DollarSign,
  Award,
  Briefcase,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Minus,
  ArrowRight,
  FileText,
  Video,
  MessageSquare
} from 'lucide-react'
import { Candidate } from '@/types/candidates'
import {
  formatExperienceLevel,
  getExperienceLevelColor,
  calculateOverallScore,
  formatSalaryRange,
  calculateDaysInProcess
} from '@/lib/candidates-utils'

// Mock candidates for comparison
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
    currentCompany: 'Tech Corp',
    yearsOfExperience: 8,
    experienceLevel: 'senior',
    expectedSalary: { min: 140000, max: 160000, currency: 'USD' },
    noticePeriod: 30,
    positionId: 'pos-1',
    positionTitle: 'Senior Full Stack Developer',
    department: 'Engineering',
    status: 'interview',
    applicationDate: '2025-09-15',
    source: 'linkedin',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'PostgreSQL'],
    certifications: ['AWS Certified Solutions Architect', 'Google Cloud Professional'],
    education: [
      {
        id: 'edu-1',
        degree: 'Master of Science',
        field: 'Computer Science',
        institution: 'Stanford University',
        location: 'Stanford, CA',
        startDate: '2013-09-01',
        endDate: '2015-06-01',
        isCurrent: false
      }
    ],
    interviews: [
      {
        id: 'int-1',
        candidateId: 'cand-1',
        stage: 'phone_screen',
        status: 'completed',
        scheduledAt: '2025-09-20T10:00:00Z',
        duration: 30,
        timezone: 'EST',
        interviewers: [],
        overallRating: 5,
        recommendation: 'strong_yes',
        createdAt: '2025-09-18',
        updatedAt: '2025-09-20',
        createdBy: 'user-1'
      },
      {
        id: 'int-2',
        candidateId: 'cand-1',
        stage: 'technical',
        status: 'scheduled',
        scheduledAt: '2025-10-14T14:00:00Z',
        duration: 90,
        timezone: 'EST',
        interviewers: [],
        createdAt: '2025-10-10',
        updatedAt: '2025-10-10',
        createdBy: 'user-1'
      }
    ],
    assessments: [
      {
        id: 'assess-1',
        candidateId: 'cand-1',
        type: 'technical',
        title: 'Full Stack Coding Challenge',
        assignedAt: '2025-09-22',
        completedAt: '2025-09-24',
        score: 92,
        maxScore: 100,
        percentage: 92,
        passed: true,
        createdAt: '2025-09-22'
      }
    ],
    screeningScore: 5,
    cultureFitScore: 4.5,
    overallScore: 4.7,
    notes: [],
    emails: [],
    calls: [],
    tags: ['strong-technical', 'culture-fit', 'senior-level'],
    priority: 'high',
    isBookmarked: true,
    createdAt: '2025-09-15',
    updatedAt: '2025-10-10',
    lastActivityAt: '2025-10-10'
  },
  {
    id: 'cand-2',
    tenantId: 'tenant-1',
    firstName: 'Michael',
    lastName: 'Chen',
    fullName: 'Michael Chen',
    email: 'michael.chen@email.com',
    phone: '+1 (555) 234-5678',
    location: { city: 'Austin', state: 'TX', country: 'USA' },
    currentJobTitle: 'Full Stack Developer',
    currentCompany: 'Software Inc',
    yearsOfExperience: 6,
    experienceLevel: 'mid',
    expectedSalary: { min: 120000, max: 140000, currency: 'USD' },
    noticePeriod: 14,
    positionId: 'pos-1',
    positionTitle: 'Senior Full Stack Developer',
    department: 'Engineering',
    status: 'interview',
    applicationDate: '2025-09-18',
    source: 'referral',
    referredBy: {
      employeeId: 'emp-1',
      employeeName: 'Jane Smith',
      bonus: 2000
    },
    skills: ['React', 'Python', 'TypeScript', 'MongoDB', 'Kubernetes'],
    certifications: ['Certified Kubernetes Administrator'],
    education: [
      {
        id: 'edu-2',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        institution: 'UC Berkeley',
        location: 'Berkeley, CA',
        startDate: '2012-09-01',
        endDate: '2016-06-01',
        isCurrent: false
      }
    ],
    interviews: [
      {
        id: 'int-3',
        candidateId: 'cand-2',
        stage: 'phone_screen',
        status: 'completed',
        scheduledAt: '2025-09-22T11:00:00Z',
        duration: 30,
        timezone: 'EST',
        interviewers: [],
        overallRating: 4,
        recommendation: 'yes',
        createdAt: '2025-09-20',
        updatedAt: '2025-09-22',
        createdBy: 'user-1'
      }
    ],
    assessments: [
      {
        id: 'assess-2',
        candidateId: 'cand-2',
        type: 'technical',
        title: 'Full Stack Coding Challenge',
        assignedAt: '2025-09-24',
        completedAt: '2025-09-26',
        score: 85,
        maxScore: 100,
        percentage: 85,
        passed: true,
        createdAt: '2025-09-24'
      }
    ],
    screeningScore: 4,
    cultureFitScore: 5,
    overallScore: 4.3,
    notes: [],
    emails: [],
    calls: [],
    tags: ['referral', 'quick-start', 'team-player'],
    priority: 'high',
    isBookmarked: false,
    createdAt: '2025-09-18',
    updatedAt: '2025-10-08',
    lastActivityAt: '2025-10-08'
  },
  {
    id: 'cand-3',
    tenantId: 'tenant-1',
    firstName: 'Emily',
    lastName: 'Rodriguez',
    fullName: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    phone: '+1 (555) 345-6789',
    location: { city: 'Seattle', state: 'WA', country: 'USA' },
    currentJobTitle: 'Software Engineer',
    currentCompany: 'Startup XYZ',
    yearsOfExperience: 5,
    experienceLevel: 'mid',
    expectedSalary: { min: 130000, max: 150000, currency: 'USD' },
    noticePeriod: 21,
    positionId: 'pos-1',
    positionTitle: 'Senior Full Stack Developer',
    department: 'Engineering',
    status: 'assessment',
    applicationDate: '2025-09-20',
    source: 'website',
    skills: ['Vue.js', 'Node.js', 'JavaScript', 'GraphQL', 'Redis'],
    certifications: [],
    education: [
      {
        id: 'edu-3',
        degree: 'Bachelor of Science',
        field: 'Software Engineering',
        institution: 'University of Washington',
        location: 'Seattle, WA',
        startDate: '2013-09-01',
        endDate: '2017-06-01',
        isCurrent: false
      }
    ],
    interviews: [
      {
        id: 'int-4',
        candidateId: 'cand-3',
        stage: 'phone_screen',
        status: 'completed',
        scheduledAt: '2025-09-25T09:00:00Z',
        duration: 30,
        timezone: 'EST',
        interviewers: [],
        overallRating: 4.5,
        recommendation: 'yes',
        createdAt: '2025-09-23',
        updatedAt: '2025-09-25',
        createdBy: 'user-1'
      }
    ],
    assessments: [
      {
        id: 'assess-3',
        candidateId: 'cand-3',
        type: 'technical',
        title: 'Full Stack Coding Challenge',
        assignedAt: '2025-09-27',
        score: 88,
        maxScore: 100,
        percentage: 88,
        passed: true,
        createdAt: '2025-09-27'
      }
    ],
    screeningScore: 4.5,
    cultureFitScore: 4,
    overallScore: 4.2,
    notes: [],
    emails: [],
    calls: [],
    tags: ['fast-learner', 'startup-exp'],
    priority: 'medium',
    isBookmarked: false,
    createdAt: '2025-09-20',
    updatedAt: '2025-10-05',
    lastActivityAt: '2025-10-05'
  }
]

export default function CompareCandidatesPage() {
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([mockCandidates[0], mockCandidates[1]])
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const addCandidate = (candidate: Candidate) => {
    if (selectedCandidates.length < 4 && !selectedCandidates.find(c => c.id === candidate.id)) {
      setSelectedCandidates([...selectedCandidates, candidate])
      setShowSearch(false)
      setSearchQuery('')
    }
  }

  const removeCandidate = (candidateId: string) => {
    setSelectedCandidates(selectedCandidates.filter(c => c.id !== candidateId))
  }

  const availableCandidates = mockCandidates.filter(
    c => !selectedCandidates.find(sc => sc.id === c.id) &&
         c.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getComparisonIcon = (value: number, comparedTo: number) => {
    if (value > comparedTo) return <TrendingUp className="w-4 h-4 text-green-400" />
    if (value < comparedTo) return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const getBestValue = (values: number[]) => Math.max(...values)

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Compare Candidates</h1>
        <p className="text-gray-400">Side-by-side comparison of candidate qualifications and performance</p>
      </div>

      {/* Selection Bar */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 flex-1">
            <Users className="w-5 h-5 text-purple-400" />
            <span className="text-white font-medium">Selected: {selectedCandidates.length}/4</span>
          </div>
          {selectedCandidates.length < 4 && (
            <div className="relative flex-1">
              {showSearch ? (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search candidates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onBlur={() => {
                      if (!searchQuery) setShowSearch(false)
                    }}
                    className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {availableCandidates.length > 0 && searchQuery && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden z-10">
                      {availableCandidates.map((candidate) => (
                        <button
                          key={candidate.id}
                          onClick={() => addCandidate(candidate)}
                          className="w-full p-3 text-left hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0"
                        >
                          <div className="text-white font-medium">{candidate.fullName}</div>
                          <div className="text-sm text-gray-400">{candidate.currentJobTitle} at {candidate.currentCompany}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Candidate
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Comparison Grid */}
      {selectedCandidates.length >= 2 ? (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-4 text-left text-sm font-medium text-gray-400 w-64">Criteria</th>
                {selectedCandidates.map((candidate) => (
                  <th key={candidate.id} className="p-4 border-l border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link
                          href={`/dashboard/candidates/${candidate.id}`}
                          className="text-lg font-semibold text-white hover:text-purple-400 transition-colors"
                        >
                          {candidate.fullName}
                        </Link>
                        <div className="text-sm text-gray-400 mt-1">{candidate.currentJobTitle}</div>
                        <div className="text-xs text-gray-500">{candidate.currentCompany}</div>
                      </div>
                      <button
                        onClick={() => removeCandidate(candidate.id)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Overall Score */}
              <tr className="border-b border-gray-700 bg-purple-500/5">
                <td className="p-4 font-medium text-white">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-purple-400" />
                    Overall Score
                  </div>
                </td>
                {selectedCandidates.map((candidate) => {
                  const bestScore = getBestValue(selectedCandidates.map(c => c.overallScore || 0))
                  const isBest = (candidate.overallScore || 0) === bestScore

                  return (
                    <td key={candidate.id} className="p-4 border-l border-gray-700">
                      <div className="flex items-center gap-2">
                        <div className={`text-2xl font-bold ${isBest ? 'text-purple-400' : 'text-white'}`}>
                          {candidate.overallScore?.toFixed(1) || 'N/A'}
                        </div>
                        <span className="text-gray-400">/5.0</span>
                        {isBest && <Award className="w-5 h-5 text-yellow-400" />}
                      </div>
                    </td>
                  )
                })}
              </tr>

              {/* Experience */}
              <tr className="border-b border-gray-700">
                <td className="p-4 font-medium text-white">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-400" />
                    Experience
                  </div>
                </td>
                {selectedCandidates.map((candidate) => {
                  const bestExp = getBestValue(selectedCandidates.map(c => c.yearsOfExperience))
                  const isBest = candidate.yearsOfExperience === bestExp

                  return (
                    <td key={candidate.id} className="p-4 border-l border-gray-700">
                      <div className={`text-lg font-semibold ${isBest ? 'text-blue-400' : 'text-white'}`}>
                        {candidate.yearsOfExperience} years
                      </div>
                      <span className={`mt-1 inline-block px-2 py-1 rounded-full text-xs font-medium ${getExperienceLevelColor(candidate.experienceLevel)}`}>
                        {formatExperienceLevel(candidate.experienceLevel)}
                      </span>
                    </td>
                  )
                })}
              </tr>

              {/* Education */}
              <tr className="border-b border-gray-700">
                <td className="p-4 font-medium text-white">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-green-400" />
                    Education
                  </div>
                </td>
                {selectedCandidates.map((candidate) => (
                  <td key={candidate.id} className="p-4 border-l border-gray-700">
                    {candidate.education.length > 0 ? (
                      <div>
                        <div className="text-white font-medium">{candidate.education[0].degree}</div>
                        <div className="text-sm text-gray-400">{candidate.education[0].field}</div>
                        <div className="text-xs text-gray-500 mt-1">{candidate.education[0].institution}</div>
                      </div>
                    ) : (
                      <span className="text-gray-500">Not specified</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Skills */}
              <tr className="border-b border-gray-700">
                <td className="p-4 font-medium text-white">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400" />
                    Skills
                  </div>
                </td>
                {selectedCandidates.map((candidate) => (
                  <td key={candidate.id} className="p-4 border-l border-gray-700">
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.slice(0, 6).map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {candidate.skills.length > 6 && (
                        <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded text-xs">
                          +{candidate.skills.length - 6} more
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Salary Expectations */}
              <tr className="border-b border-gray-700">
                <td className="p-4 font-medium text-white">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    Salary Range
                  </div>
                </td>
                {selectedCandidates.map((candidate) => (
                  <td key={candidate.id} className="p-4 border-l border-gray-700">
                    {candidate.expectedSalary ? (
                      <div className="text-white font-medium">
                        {formatSalaryRange(
                          candidate.expectedSalary.min,
                          candidate.expectedSalary.max,
                          candidate.expectedSalary.currency
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">Not specified</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Notice Period */}
              <tr className="border-b border-gray-700">
                <td className="p-4 font-medium text-white">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    Notice Period
                  </div>
                </td>
                {selectedCandidates.map((candidate) => {
                  const bestNotice = Math.min(...selectedCandidates.map(c => c.noticePeriod || 999))
                  const isBest = candidate.noticePeriod === bestNotice

                  return (
                    <td key={candidate.id} className="p-4 border-l border-gray-700">
                      <div className={`text-white font-medium ${isBest ? 'text-green-400' : ''}`}>
                        {candidate.noticePeriod ? `${candidate.noticePeriod} days` : 'Not specified'}
                      </div>
                    </td>
                  )
                })}
              </tr>

              {/* Interview Performance */}
              <tr className="border-b border-gray-700">
                <td className="p-4 font-medium text-white">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-400" />
                    Interviews
                  </div>
                </td>
                {selectedCandidates.map((candidate) => {
                  const completed = candidate.interviews.filter(i => i.status === 'completed').length
                  const avgRating = candidate.interviews
                    .filter(i => i.overallRating)
                    .reduce((sum, i) => sum + (i.overallRating || 0), 0) / completed || 0

                  return (
                    <td key={candidate.id} className="p-4 border-l border-gray-700">
                      <div className="text-white font-medium">{completed} completed</div>
                      {avgRating > 0 && (
                        <div className="text-sm text-gray-400 mt-1">
                          Avg rating: {avgRating.toFixed(1)}/5
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>

              {/* Assessments */}
              <tr className="border-b border-gray-700">
                <td className="p-4 font-medium text-white">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-cyan-400" />
                    Assessments
                  </div>
                </td>
                {selectedCandidates.map((candidate) => {
                  const completed = candidate.assessments.filter(a => a.completedAt).length
                  const avgScore = candidate.assessments
                    .filter(a => a.percentage)
                    .reduce((sum, a) => sum + (a.percentage || 0), 0) / completed || 0

                  const bestScore = getBestValue(
                    selectedCandidates.map(c =>
                      c.assessments.filter(a => a.percentage).reduce((sum, a) => sum + (a.percentage || 0), 0) /
                      (c.assessments.filter(a => a.completedAt).length || 1)
                    )
                  )
                  const isBest = avgScore === bestScore && avgScore > 0

                  return (
                    <td key={candidate.id} className="p-4 border-l border-gray-700">
                      <div className="text-white font-medium">{completed} completed</div>
                      {avgScore > 0 && (
                        <div className={`text-sm mt-1 ${isBest ? 'text-green-400' : 'text-gray-400'}`}>
                          Avg score: {avgScore.toFixed(0)}%
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>

              {/* Days in Process */}
              <tr className="border-b border-gray-700">
                <td className="p-4 font-medium text-white">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-400" />
                    Days in Process
                  </div>
                </td>
                {selectedCandidates.map((candidate) => {
                  const days = calculateDaysInProcess(candidate.applicationDate)
                  return (
                    <td key={candidate.id} className="p-4 border-l border-gray-700">
                      <div className="text-white font-medium">{days} days</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Since {new Date(candidate.applicationDate).toLocaleDateString()}
                      </div>
                    </td>
                  )
                })}
              </tr>

              {/* Source */}
              <tr className="border-b border-gray-700">
                <td className="p-4 font-medium text-white">Application Source</td>
                {selectedCandidates.map((candidate) => (
                  <td key={candidate.id} className="p-4 border-l border-gray-700">
                    <div className="text-white font-medium capitalize">{candidate.source.replace('_', ' ')}</div>
                    {candidate.referredBy && (
                      <div className="text-sm text-green-400 mt-1">
                        Referred by {candidate.referredBy.employeeName}
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Actions */}
              <tr>
                <td className="p-4 font-medium text-white">Actions</td>
                {selectedCandidates.map((candidate) => (
                  <td key={candidate.id} className="p-4 border-l border-gray-700">
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/dashboard/candidates/${candidate.id}`}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                      >
                        View Profile
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        Send Message
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-12 text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Select candidates to compare</h3>
          <p className="text-gray-400 mb-6">Choose at least 2 candidates to see a side-by-side comparison</p>
        </div>
      )}
    </div>
  )
}
