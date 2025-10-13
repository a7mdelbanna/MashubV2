'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Briefcase,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  Search,
  Filter,
  Plus,
  MoreVertical,
  TrendingUp,
  Clock,
  CheckCircle2,
  PauseCircle,
  XCircle,
  Building2,
  Target,
  Award,
  ArrowUpRight,
  Edit,
  Eye,
  Trash2
} from 'lucide-react'
import { JobPosition, EmploymentType, ExperienceLevel, InterviewStage } from '@/types/candidates'
import {
  formatExperienceLevel,
  formatSalaryRange,
  getPositionFillRate,
  getExperienceLevelColor
} from '@/lib/candidates-utils'

// Mock job positions data
const mockPositions: JobPosition[] = [
  {
    id: 'pos-1',
    tenantId: 'tenant-1',
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    remote: true,
    employmentType: 'full_time',
    experienceLevel: 'senior',
    description: 'We are seeking an experienced Full Stack Developer to join our engineering team.',
    responsibilities: [
      'Design and implement scalable web applications',
      'Collaborate with product team on feature development',
      'Mentor junior developers and conduct code reviews',
      'Optimize application performance and security'
    ],
    requirements: [
      '5+ years of full stack development experience',
      'Expert knowledge of React, Node.js, and TypeScript',
      'Experience with AWS and containerization',
      'Strong problem-solving and communication skills'
    ],
    preferredQualifications: [
      'Experience with microservices architecture',
      'Contributions to open-source projects',
      'Experience leading technical initiatives'
    ],
    salaryRange: {
      min: 140000,
      max: 180000,
      currency: 'USD'
    },
    benefits: ['Health Insurance', 'Stock Options', '401k Match', 'Flexible PTO', 'Remote Work'],
    status: 'open',
    openings: 2,
    filledPositions: 0,
    hiringManager: {
      managerId: 'mgr-1',
      managerName: 'John Smith'
    },
    recruiters: ['rec-1', 'rec-2'],
    interviewStages: [
      { stage: 'phone_screen', order: 1, required: true },
      { stage: 'technical', order: 2, required: true },
      { stage: 'behavioral', order: 3, required: true },
      { stage: 'final', order: 4, required: true }
    ],
    applicantsCount: 45,
    interviewingCount: 8,
    offersCount: 1,
    timeToFill: 35,
    averageTimeToHire: 42,
    postedAt: '2025-09-15',
    createdAt: '2025-09-15',
    updatedAt: '2025-10-10',
    createdBy: 'user-1'
  },
  {
    id: 'pos-2',
    tenantId: 'tenant-1',
    title: 'Product Designer',
    department: 'Design',
    location: 'New York, NY',
    remote: true,
    employmentType: 'full_time',
    experienceLevel: 'mid',
    description: 'Join our design team to create beautiful and intuitive user experiences.',
    responsibilities: [
      'Design user interfaces for web and mobile applications',
      'Create prototypes and conduct user testing',
      'Collaborate with engineering and product teams',
      'Maintain and evolve design system'
    ],
    requirements: [
      '3+ years of product design experience',
      'Strong portfolio demonstrating UX/UI skills',
      'Proficiency in Figma and design tools',
      'Understanding of design systems and accessibility'
    ],
    salaryRange: {
      min: 100000,
      max: 130000,
      currency: 'USD'
    },
    benefits: ['Health Insurance', 'Stock Options', '401k Match', 'Professional Development', 'Remote Work'],
    status: 'open',
    openings: 1,
    filledPositions: 0,
    hiringManager: {
      managerId: 'mgr-2',
      managerName: 'Emily Chen'
    },
    recruiters: ['rec-1'],
    interviewStages: [
      { stage: 'phone_screen', order: 1, required: true },
      { stage: 'behavioral', order: 2, required: true },
      { stage: 'final', order: 3, required: true }
    ],
    applicantsCount: 67,
    interviewingCount: 12,
    offersCount: 2,
    timeToFill: 28,
    averageTimeToHire: 35,
    postedAt: '2025-09-20',
    createdAt: '2025-09-20',
    updatedAt: '2025-10-11',
    createdBy: 'user-1'
  },
  {
    id: 'pos-3',
    tenantId: 'tenant-1',
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Austin, TX',
    remote: false,
    employmentType: 'full_time',
    experienceLevel: 'senior',
    description: 'Looking for a DevOps Engineer to build and maintain our cloud infrastructure.',
    responsibilities: [
      'Design and implement CI/CD pipelines',
      'Manage AWS infrastructure and services',
      'Automate deployment and monitoring processes',
      'Ensure security and compliance standards'
    ],
    requirements: [
      '5+ years of DevOps experience',
      'Expert knowledge of AWS, Kubernetes, and Docker',
      'Experience with Infrastructure as Code (Terraform)',
      'Strong scripting skills (Python, Bash)'
    ],
    salaryRange: {
      min: 135000,
      max: 170000,
      currency: 'USD'
    },
    benefits: ['Health Insurance', 'Stock Options', '401k Match', 'Relocation Assistance'],
    status: 'on_hold',
    openings: 1,
    filledPositions: 0,
    hiringManager: {
      managerId: 'mgr-1',
      managerName: 'John Smith'
    },
    recruiters: ['rec-2'],
    interviewStages: [
      { stage: 'phone_screen', order: 1, required: true },
      { stage: 'technical', order: 2, required: true },
      { stage: 'final', order: 3, required: true }
    ],
    applicantsCount: 23,
    interviewingCount: 3,
    offersCount: 0,
    postedAt: '2025-08-10',
    createdAt: '2025-08-10',
    updatedAt: '2025-09-25',
    createdBy: 'user-1'
  },
  {
    id: 'pos-4',
    tenantId: 'tenant-1',
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'Remote',
    remote: true,
    employmentType: 'full_time',
    experienceLevel: 'senior',
    description: 'Seeking an experienced Marketing Manager to lead our growth initiatives.',
    responsibilities: [
      'Develop and execute marketing strategies',
      'Manage marketing budget and campaigns',
      'Lead a team of marketing specialists',
      'Analyze metrics and optimize performance'
    ],
    requirements: [
      '6+ years of marketing experience',
      'Proven track record in B2B SaaS marketing',
      'Experience with marketing automation tools',
      'Strong leadership and analytical skills'
    ],
    salaryRange: {
      min: 110000,
      max: 145000,
      currency: 'USD'
    },
    benefits: ['Health Insurance', 'Stock Options', '401k Match', 'Flexible PTO', 'Remote Work'],
    status: 'filled',
    openings: 1,
    filledPositions: 1,
    hiringManager: {
      managerId: 'mgr-3',
      managerName: 'Michael Brown'
    },
    recruiters: ['rec-1'],
    interviewStages: [
      { stage: 'phone_screen', order: 1, required: true },
      { stage: 'behavioral', order: 2, required: true },
      { stage: 'final', order: 3, required: true }
    ],
    applicantsCount: 89,
    interviewingCount: 0,
    offersCount: 1,
    timeToFill: 45,
    averageTimeToHire: 45,
    postedAt: '2025-07-01',
    closedAt: '2025-08-15',
    createdAt: '2025-07-01',
    updatedAt: '2025-08-15',
    createdBy: 'user-1'
  },
  {
    id: 'pos-5',
    tenantId: 'tenant-1',
    title: 'Junior Frontend Developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    remote: true,
    employmentType: 'full_time',
    experienceLevel: 'junior',
    description: 'Great opportunity for a junior developer to grow with our engineering team.',
    responsibilities: [
      'Build responsive web interfaces using React',
      'Collaborate with designers on UI implementation',
      'Write clean, maintainable code',
      'Participate in code reviews and team meetings'
    ],
    requirements: [
      '1-2 years of frontend development experience',
      'Knowledge of React, HTML, CSS, JavaScript',
      'Understanding of responsive design',
      'Eagerness to learn and grow'
    ],
    salaryRange: {
      min: 75000,
      max: 95000,
      currency: 'USD'
    },
    benefits: ['Health Insurance', 'Stock Options', '401k Match', 'Learning Budget', 'Remote Work'],
    status: 'open',
    openings: 3,
    filledPositions: 1,
    hiringManager: {
      managerId: 'mgr-1',
      managerName: 'John Smith'
    },
    recruiters: ['rec-2'],
    interviewStages: [
      { stage: 'phone_screen', order: 1, required: true },
      { stage: 'technical', order: 2, required: true },
      { stage: 'final', order: 3, required: true }
    ],
    applicantsCount: 156,
    interviewingCount: 15,
    offersCount: 3,
    timeToFill: 21,
    averageTimeToHire: 28,
    postedAt: '2025-09-25',
    createdAt: '2025-09-25',
    updatedAt: '2025-10-12',
    createdBy: 'user-1'
  },
  {
    id: 'pos-6',
    tenantId: 'tenant-1',
    title: 'Data Scientist',
    department: 'Data',
    location: 'Boston, MA',
    remote: true,
    employmentType: 'full_time',
    experienceLevel: 'mid',
    description: 'Join our data team to extract insights and build predictive models.',
    responsibilities: [
      'Analyze large datasets to identify trends',
      'Build and deploy machine learning models',
      'Collaborate with product team on data-driven features',
      'Present findings to stakeholders'
    ],
    requirements: [
      '3+ years of data science experience',
      'Strong knowledge of Python, SQL, and ML frameworks',
      'Experience with statistical analysis',
      'Excellent communication skills'
    ],
    salaryRange: {
      min: 115000,
      max: 150000,
      currency: 'USD'
    },
    benefits: ['Health Insurance', 'Stock Options', '401k Match', 'Conference Budget', 'Remote Work'],
    status: 'open',
    openings: 2,
    filledPositions: 0,
    hiringManager: {
      managerId: 'mgr-4',
      managerName: 'Sarah Williams'
    },
    recruiters: ['rec-1', 'rec-2'],
    interviewStages: [
      { stage: 'phone_screen', order: 1, required: true },
      { stage: 'technical', order: 2, required: true },
      { stage: 'behavioral', order: 3, required: true },
      { stage: 'final', order: 4, required: true }
    ],
    applicantsCount: 92,
    interviewingCount: 11,
    offersCount: 1,
    timeToFill: 38,
    averageTimeToHire: 40,
    postedAt: '2025-09-10',
    createdAt: '2025-09-10',
    updatedAt: '2025-10-11',
    createdBy: 'user-1'
  }
]

export default function PositionsPage() {
  const [positions] = useState<JobPosition[]>(mockPositions)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'on_hold' | 'filled' | 'closed'>('all')
  const [filterDepartment, setFilterDepartment] = useState<string>('all')
  const [filterExperience, setFilterExperience] = useState<ExperienceLevel | 'all'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Calculate stats
  const stats = {
    total: positions.length,
    open: positions.filter(p => p.status === 'open').length,
    filled: positions.filter(p => p.status === 'filled').length,
    onHold: positions.filter(p => p.status === 'on_hold').length,
    totalOpenings: positions.reduce((sum, p) => sum + p.openings, 0),
    totalApplicants: positions.reduce((sum, p) => sum + p.applicantsCount, 0),
    avgTimeToFill: Math.round(
      positions.filter(p => p.timeToFill).reduce((sum, p) => sum + (p.timeToFill || 0), 0) /
      positions.filter(p => p.timeToFill).length
    )
  }

  // Get unique departments
  const departments = Array.from(new Set(positions.map(p => p.department)))

  // Filter positions
  const filteredPositions = positions.filter(position => {
    const matchesSearch = position.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         position.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         position.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === 'all' || position.status === filterStatus
    const matchesDepartment = filterDepartment === 'all' || position.department === filterDepartment
    const matchesExperience = filterExperience === 'all' || position.experienceLevel === filterExperience

    return matchesSearch && matchesStatus && matchesDepartment && matchesExperience
  })

  const getStatusColor = (status: JobPosition['status']) => {
    const colors = {
      draft: 'bg-gray-500/20 text-gray-400',
      open: 'bg-green-500/20 text-green-400',
      on_hold: 'bg-yellow-500/20 text-yellow-400',
      filled: 'bg-blue-500/20 text-blue-400',
      closed: 'bg-red-500/20 text-red-400'
    }
    return colors[status]
  }

  const getStatusIcon = (status: JobPosition['status']) => {
    switch (status) {
      case 'open': return <CheckCircle2 className="w-4 h-4" />
      case 'on_hold': return <PauseCircle className="w-4 h-4" />
      case 'filled': return <CheckCircle2 className="w-4 h-4" />
      case 'closed': return <XCircle className="w-4 h-4" />
      default: return null
    }
  }

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Job Positions</h1>
          <p className="text-gray-400">Manage open positions and track recruitment pipeline</p>
        </div>
        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors">
          <Plus className="w-4 h-4" />
          Post New Position
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Total Positions</div>
            <Briefcase className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-xs text-gray-500 mt-1">{stats.totalOpenings} total openings</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Open Positions</div>
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.open}</div>
          <div className="text-xs text-gray-500 mt-1">Actively hiring</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Total Applicants</div>
            <Users className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalApplicants}</div>
          <div className="text-xs text-gray-500 mt-1">Across all positions</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Avg. Time to Fill</div>
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.avgTimeToFill}d</div>
          <div className="text-xs text-gray-500 mt-1">Average days</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700 p-4 mb-6">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search positions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="on_hold">On Hold</option>
            <option value="filled">Filled</option>
            <option value="closed">Closed</option>
          </select>

          {/* Department Filter */}
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>

          {/* Experience Filter */}
          <select
            value={filterExperience}
            onChange={(e) => setFilterExperience(e.target.value as any)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Levels</option>
            <option value="entry">Entry Level</option>
            <option value="junior">Junior</option>
            <option value="mid">Mid-Level</option>
            <option value="senior">Senior</option>
            <option value="lead">Lead</option>
            <option value="principal">Principal</option>
            <option value="executive">Executive</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-400 text-sm">
          Showing <span className="text-white font-medium">{filteredPositions.length}</span> of{' '}
          <span className="text-white font-medium">{positions.length}</span> positions
        </p>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPositions.map((position) => {
            const fillRate = getPositionFillRate(position)

            return (
              <div
                key={position.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:border-purple-500/50 transition-all"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-white">{position.title}</h3>
                      <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(position.status)}`}>
                        {getStatusIcon(position.status)}
                        {position.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {position.department}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {position.location}
                      </div>
                      {position.remote && (
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">Remote</span>
                      )}
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Experience Level</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceLevelColor(position.experienceLevel)}`}>
                      {formatExperienceLevel(position.experienceLevel)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Salary Range</span>
                    <span className="text-white font-medium">
                      {formatSalaryRange(position.salaryRange.min, position.salaryRange.max, position.salaryRange.currency)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Openings</span>
                    <span className="text-white font-medium">
                      {position.filledPositions}/{position.openings} filled
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>Fill Rate</span>
                    <span>{fillRate}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                      style={{ width: `${fillRate}%` }}
                    />
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-900/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{position.applicantsCount}</div>
                    <div className="text-xs text-gray-400">Applicants</div>
                  </div>
                  <div className="text-center border-x border-gray-700">
                    <div className="text-lg font-bold text-white">{position.interviewingCount}</div>
                    <div className="text-xs text-gray-400">Interviewing</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">{position.offersCount}</div>
                    <div className="text-xs text-gray-400">Offers</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/candidates?position=${position.id}`}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Users className="w-4 h-4" />
                    View Candidates
                  </Link>
                  <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Posted {new Date(position.postedAt).toLocaleDateString()}
                  </div>
                  {position.timeToFill && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {position.timeToFill} days to fill
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900/50 border-b border-gray-700">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Position</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Department</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Location</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Openings</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Applicants</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Salary</th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPositions.map((position, index) => (
                <tr
                  key={position.id}
                  className={`border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors ${
                    index === filteredPositions.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-white mb-1">{position.title}</div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getExperienceLevelColor(position.experienceLevel)}`}>
                        {formatExperienceLevel(position.experienceLevel)}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{position.department}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-gray-300">
                      {position.location}
                      {position.remote && (
                        <span className="ml-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded text-xs">Remote</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`flex items-center gap-1 w-fit px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(position.status)}`}>
                      {getStatusIcon(position.status)}
                      {position.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300">
                    {position.filledPositions}/{position.openings}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{position.applicantsCount}</span>
                      <span className="text-xs text-gray-400">
                        ({position.interviewingCount} interviewing)
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300 text-sm">
                    {formatSalaryRange(position.salaryRange.min, position.salaryRange.max, position.salaryRange.currency)}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/candidates?position=${position.id}`}
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs transition-colors"
                      >
                        View Candidates
                      </Link>
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

      {/* Empty State */}
      {filteredPositions.length === 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No positions found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your filters or search query</p>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}
