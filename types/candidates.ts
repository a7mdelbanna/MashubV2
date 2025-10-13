// Candidate Management Types
// Comprehensive recruitment and hiring workflow system

export type CandidateStatus = 'new' | 'screening' | 'interview' | 'assessment' | 'offer' | 'hired' | 'rejected' | 'withdrawn'
export type InterviewStage = 'phone_screen' | 'technical' | 'behavioral' | 'final' | 'onsite'
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled' | 'no_show'
export type OfferStatus = 'pending' | 'sent' | 'accepted' | 'rejected' | 'expired' | 'withdrawn'
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern' | 'temporary' | 'freelance'
export type ExperienceLevel = 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'principal' | 'executive'
export type ApplicationSource = 'website' | 'linkedin' | 'referral' | 'recruiter' | 'job_board' | 'social' | 'direct'
export type AssessmentType = 'technical' | 'behavioral' | 'cognitive' | 'personality' | 'skills' | 'culture_fit'
export type RejectionReason = 'qualifications' | 'experience' | 'culture_fit' | 'salary' | 'location' | 'withdrawn' | 'other'

// Main Candidate Interface
export interface Candidate {
  id: string
  tenantId: string

  // Personal Information
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone?: string
  alternatePhone?: string
  location: {
    city: string
    state?: string
    country: string
  }
  timezone?: string

  // Professional Information
  currentJobTitle?: string
  currentCompany?: string
  yearsOfExperience: number
  experienceLevel: ExperienceLevel
  expectedSalary?: {
    min: number
    max: number
    currency: string
  }
  noticePeriod?: number // in days

  // Application Details
  positionId: string
  positionTitle: string
  department: string
  status: CandidateStatus
  applicationDate: string
  source: ApplicationSource
  referredBy?: {
    employeeId: string
    employeeName: string
    bonus?: number
  }

  // Documents
  resumeUrl?: string
  coverLetterUrl?: string
  portfolioUrl?: string
  linkedinUrl?: string
  githubUrl?: string
  otherUrls?: string[]

  // Skills & Qualifications
  skills: string[]
  certifications?: string[]
  education: Education[]
  languages?: Language[]

  // Recruitment Process
  interviews: Interview[]
  assessments: Assessment[]
  screeningScore?: number
  cultureFitScore?: number
  overallScore?: number

  // Offer Details
  offer?: Offer

  // Tracking
  assignedTo?: {
    recruiterId: string
    recruiterName: string
    recruiterEmail: string
  }
  hiringManager?: {
    managerId: string
    managerName: string
    managerEmail: string
  }

  // Communication
  lastContactedAt?: string
  nextFollowUpAt?: string
  notes: Note[]
  emails: EmailLog[]
  calls: CallLog[]

  // Metadata
  tags: string[]
  priority: 'low' | 'medium' | 'high' | 'urgent'
  isBookmarked: boolean
  customFields?: Record<string, any>

  // Rejection (if applicable)
  rejectionReason?: RejectionReason
  rejectionNotes?: string
  rejectedAt?: string
  rejectedBy?: string

  // Timestamps
  createdAt: string
  updatedAt: string
  lastActivityAt: string
}

// Education
export interface Education {
  id: string
  degree: string
  field: string
  institution: string
  location: string
  startDate: string
  endDate?: string
  isCurrent: boolean
  grade?: string
  achievements?: string[]
}

// Language
export interface Language {
  language: string
  proficiency: 'basic' | 'conversational' | 'fluent' | 'native'
}

// Interview
export interface Interview {
  id: string
  candidateId: string
  stage: InterviewStage
  status: InterviewStatus

  // Scheduling
  scheduledAt?: string
  duration: number // in minutes
  timezone: string
  location?: string
  meetingLink?: string

  // Participants
  interviewers: Interviewer[]

  // Results
  completedAt?: string
  feedback?: InterviewFeedback[]
  overallRating?: number
  recommendation?: 'strong_yes' | 'yes' | 'maybe' | 'no' | 'strong_no'

  // Notes
  notes?: string
  recordingUrl?: string

  // Metadata
  createdAt: string
  updatedAt: string
  createdBy: string
}

// Interviewer
export interface Interviewer {
  userId: string
  name: string
  email: string
  role: string
  isPrimary: boolean
}

// Interview Feedback
export interface InterviewFeedback {
  interviewerId: string
  interviewerName: string
  rating: number // 1-5
  categories: {
    technical?: number
    communication?: number
    problemSolving?: number
    cultureFit?: number
    leadership?: number
  }
  strengths: string[]
  weaknesses: string[]
  comments: string
  recommendation: 'strong_yes' | 'yes' | 'maybe' | 'no' | 'strong_no'
  submittedAt: string
}

// Assessment
export interface Assessment {
  id: string
  candidateId: string
  type: AssessmentType
  title: string
  description?: string

  // Execution
  assignedAt: string
  startedAt?: string
  completedAt?: string
  dueDate?: string
  duration?: number // in minutes

  // Results
  score?: number
  maxScore?: number
  percentage?: number
  passed?: boolean

  // Details
  assessmentUrl?: string
  resultsUrl?: string
  evaluatedBy?: string
  notes?: string

  // Metadata
  createdAt: string
}

// Offer
export interface Offer {
  id: string
  candidateId: string
  status: OfferStatus

  // Position Details
  positionTitle: string
  department: string
  employmentType: EmploymentType
  startDate: string
  location: string
  remote: boolean

  // Compensation
  baseSalary: number
  currency: string
  bonus?: number
  equity?: {
    shares: number
    vestingPeriod: number
  }
  benefits: string[]

  // Offer Lifecycle
  sentAt?: string
  expiresAt?: string
  acceptedAt?: string
  rejectedAt?: string
  withdrawnAt?: string

  // Documents
  offerLetterUrl?: string

  // Negotiation
  negotiationHistory?: NegotiationRound[]

  // Notes
  notes?: string

  // Metadata
  createdAt: string
  createdBy: string
  approvedBy?: string[]
}

// Negotiation Round
export interface NegotiationRound {
  round: number
  date: string
  requestedBy: 'candidate' | 'company'
  changes: {
    field: string
    previousValue: any
    newValue: any
  }[]
  notes?: string
}

// Job Position
export interface JobPosition {
  id: string
  tenantId: string

  // Basic Information
  title: string
  department: string
  location: string
  remote: boolean
  employmentType: EmploymentType
  experienceLevel: ExperienceLevel

  // Details
  description: string
  responsibilities: string[]
  requirements: string[]
  preferredQualifications?: string[]

  // Compensation
  salaryRange: {
    min: number
    max: number
    currency: string
  }
  benefits: string[]

  // Status
  status: 'draft' | 'open' | 'on_hold' | 'filled' | 'closed'
  openings: number
  filledPositions: number

  // Hiring Team
  hiringManager: {
    managerId: string
    managerName: string
  }
  recruiters: string[]

  // Process
  interviewStages: {
    stage: InterviewStage
    order: number
    required: boolean
  }[]

  // Tracking
  applicantsCount: number
  interviewingCount: number
  offersCount: number

  // Metrics
  timeToFill?: number // days
  averageTimeToHire?: number

  // Metadata
  postedAt?: string
  closedAt?: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

// Note
export interface Note {
  id: string
  content: string
  createdBy: string
  createdByName: string
  createdAt: string
  isPrivate: boolean
}

// Email Log
export interface EmailLog {
  id: string
  subject: string
  from: string
  to: string
  sentAt: string
  opened?: boolean
  openedAt?: string
}

// Call Log
export interface CallLog {
  id: string
  type: 'incoming' | 'outgoing'
  duration: number // in seconds
  date: string
  notes?: string
  recordingUrl?: string
}

// Candidate Pipeline Analytics
export interface PipelineAnalytics {
  totalCandidates: number
  newThisWeek: number
  byStatus: Record<CandidateStatus, number>
  bySource: Record<ApplicationSource, number>
  averageTimeToHire: number
  conversionRates: {
    applicationToInterview: number
    interviewToOffer: number
    offerToHire: number
  }
  topSources: {
    source: ApplicationSource
    count: number
    hireRate: number
  }[]
}

// Recruiter Performance
export interface RecruiterPerformance {
  recruiterId: string
  recruiterName: string
  activeCandidates: number
  placementsThisMonth: number
  averageTimeToFill: number
  offerAcceptanceRate: number
  candidateSatisfaction?: number
}
