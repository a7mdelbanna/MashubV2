// Candidate Management Utility Functions
// Helper functions for recruitment and hiring workflows

import {
  Candidate,
  CandidateStatus,
  InterviewStage,
  InterviewStatus,
  OfferStatus,
  ExperienceLevel,
  ApplicationSource,
  Interview,
  Assessment,
  JobPosition
} from '@/types/candidates'

// ============================================================================
// STATUS & STAGE HELPERS
// ============================================================================

export function getCandidateStatusColor(status: CandidateStatus): string {
  const colors: Record<CandidateStatus, string> = {
    new: 'bg-blue-500/20 text-blue-400',
    screening: 'bg-cyan-500/20 text-cyan-400',
    interview: 'bg-purple-500/20 text-purple-400',
    assessment: 'bg-yellow-500/20 text-yellow-400',
    offer: 'bg-green-500/20 text-green-400',
    hired: 'bg-emerald-500/20 text-emerald-400',
    rejected: 'bg-red-500/20 text-red-400',
    withdrawn: 'bg-gray-500/20 text-gray-400'
  }
  return colors[status]
}

export function getInterviewStageColor(stage: InterviewStage): string {
  const colors: Record<InterviewStage, string> = {
    phone_screen: 'bg-blue-500/20 text-blue-400',
    technical: 'bg-purple-500/20 text-purple-400',
    behavioral: 'bg-cyan-500/20 text-cyan-400',
    final: 'bg-yellow-500/20 text-yellow-400',
    onsite: 'bg-green-500/20 text-green-400'
  }
  return colors[stage]
}

export function getInterviewStatusColor(status: InterviewStatus): string {
  const colors: Record<InterviewStatus, string> = {
    scheduled: 'bg-blue-500/20 text-blue-400',
    completed: 'bg-green-500/20 text-green-400',
    cancelled: 'bg-red-500/20 text-red-400',
    rescheduled: 'bg-yellow-500/20 text-yellow-400',
    no_show: 'bg-gray-500/20 text-gray-400'
  }
  return colors[status]
}

export function getOfferStatusColor(status: OfferStatus): string {
  const colors: Record<OfferStatus, string> = {
    pending: 'bg-blue-500/20 text-blue-400',
    sent: 'bg-purple-500/20 text-purple-400',
    accepted: 'bg-green-500/20 text-green-400',
    rejected: 'bg-red-500/20 text-red-400',
    expired: 'bg-gray-500/20 text-gray-400',
    withdrawn: 'bg-yellow-500/20 text-yellow-400'
  }
  return colors[status]
}

export function getExperienceLevelColor(level: ExperienceLevel): string {
  const colors: Record<ExperienceLevel, string> = {
    entry: 'bg-blue-500/20 text-blue-400',
    junior: 'bg-cyan-500/20 text-cyan-400',
    mid: 'bg-purple-500/20 text-purple-400',
    senior: 'bg-yellow-500/20 text-yellow-400',
    lead: 'bg-orange-500/20 text-orange-400',
    principal: 'bg-red-500/20 text-red-400',
    executive: 'bg-pink-500/20 text-pink-400'
  }
  return colors[level]
}

// ============================================================================
// FORMATTING HELPERS
// ============================================================================

export function formatCandidateStatus(status: CandidateStatus): string {
  const labels: Record<CandidateStatus, string> = {
    new: 'New',
    screening: 'Screening',
    interview: 'Interview',
    assessment: 'Assessment',
    offer: 'Offer',
    hired: 'Hired',
    rejected: 'Rejected',
    withdrawn: 'Withdrawn'
  }
  return labels[status]
}

export function formatInterviewStage(stage: InterviewStage): string {
  const labels: Record<InterviewStage, string> = {
    phone_screen: 'Phone Screen',
    technical: 'Technical',
    behavioral: 'Behavioral',
    final: 'Final',
    onsite: 'Onsite'
  }
  return labels[stage]
}

export function formatExperienceLevel(level: ExperienceLevel): string {
  const labels: Record<ExperienceLevel, string> = {
    entry: 'Entry Level',
    junior: 'Junior',
    mid: 'Mid-Level',
    senior: 'Senior',
    lead: 'Lead',
    principal: 'Principal',
    executive: 'Executive'
  }
  return labels[level]
}

export function formatApplicationSource(source: ApplicationSource): string {
  const labels: Record<ApplicationSource, string> = {
    website: 'Website',
    linkedin: 'LinkedIn',
    referral: 'Referral',
    recruiter: 'Recruiter',
    job_board: 'Job Board',
    social: 'Social Media',
    direct: 'Direct Application'
  }
  return labels[source]
}

export function formatSalaryRange(min: number, max: number, currency: string = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
  return `${formatter.format(min)} - ${formatter.format(max)}`
}

export function formatNoticePeriod(days: number): string {
  if (days === 0) return 'Immediate'
  if (days < 7) return `${days} days`
  if (days < 30) return `${Math.floor(days / 7)} weeks`
  return `${Math.floor(days / 30)} months`
}

// ============================================================================
// CALCULATION HELPERS
// ============================================================================

export function calculateDaysInProcess(applicationDate: string): number {
  const appDate = new Date(applicationDate)
  const now = new Date()
  const diff = now.getTime() - appDate.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export function calculateOverallScore(candidate: Candidate): number {
  let totalScore = 0
  let count = 0

  if (candidate.screeningScore !== undefined) {
    totalScore += candidate.screeningScore
    count++
  }

  if (candidate.cultureFitScore !== undefined) {
    totalScore += candidate.cultureFitScore
    count++
  }

  // Average interview ratings
  const interviewRatings = candidate.interviews
    .filter(i => i.overallRating !== undefined)
    .map(i => i.overallRating!)

  if (interviewRatings.length > 0) {
    const avgInterview = interviewRatings.reduce((sum, r) => sum + r, 0) / interviewRatings.length
    totalScore += avgInterview
    count++
  }

  // Average assessment scores
  const assessmentScores = candidate.assessments
    .filter(a => a.percentage !== undefined)
    .map(a => (a.percentage! / 100) * 5) // Convert to 5-point scale

  if (assessmentScores.length > 0) {
    const avgAssessment = assessmentScores.reduce((sum, s) => sum + s, 0) / assessmentScores.length
    totalScore += avgAssessment
    count++
  }

  return count > 0 ? Math.round((totalScore / count) * 10) / 10 : 0
}

export function calculateInterviewProgress(candidate: Candidate, totalStages: number): number {
  const completedInterviews = candidate.interviews.filter(i => i.status === 'completed').length
  return Math.round((completedInterviews / totalStages) * 100)
}

export function getNextInterviewStage(current: InterviewStage): InterviewStage | null {
  const stages: InterviewStage[] = ['phone_screen', 'technical', 'behavioral', 'final', 'onsite']
  const currentIndex = stages.indexOf(current)
  return currentIndex < stages.length - 1 ? stages[currentIndex + 1] : null
}

// ============================================================================
// FILTERING HELPERS
// ============================================================================

export function filterCandidatesByStatus(
  candidates: Candidate[],
  statuses: CandidateStatus[]
): Candidate[] {
  if (statuses.length === 0) return candidates
  return candidates.filter(c => statuses.includes(c.status))
}

export function filterCandidatesByExperience(
  candidates: Candidate[],
  minYears: number,
  maxYears: number
): Candidate[] {
  return candidates.filter(
    c => c.yearsOfExperience >= minYears && c.yearsOfExperience <= maxYears
  )
}

export function filterCandidatesBySkills(
  candidates: Candidate[],
  requiredSkills: string[]
): Candidate[] {
  if (requiredSkills.length === 0) return candidates
  return candidates.filter(c =>
    requiredSkills.some(skill =>
      c.skills.some(cs => cs.toLowerCase().includes(skill.toLowerCase()))
    )
  )
}

export function searchCandidates(candidates: Candidate[], query: string): Candidate[] {
  const lowerQuery = query.toLowerCase()
  return candidates.filter(c =>
    c.fullName.toLowerCase().includes(lowerQuery) ||
    c.email.toLowerCase().includes(lowerQuery) ||
    c.positionTitle.toLowerCase().includes(lowerQuery) ||
    c.currentJobTitle?.toLowerCase().includes(lowerQuery) ||
    c.skills.some(s => s.toLowerCase().includes(lowerQuery))
  )
}

// ============================================================================
// SORTING HELPERS
// ============================================================================

export function sortCandidatesByScore(candidates: Candidate[]): Candidate[] {
  return [...candidates].sort((a, b) => {
    const scoreA = a.overallScore || calculateOverallScore(a)
    const scoreB = b.overallScore || calculateOverallScore(b)
    return scoreB - scoreA
  })
}

export function sortCandidatesByDate(candidates: Candidate[]): Candidate[] {
  return [...candidates].sort((a, b) =>
    new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime()
  )
}

export function sortCandidatesByActivity(candidates: Candidate[]): Candidate[] {
  return [...candidates].sort((a, b) =>
    new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
  )
}

// ============================================================================
// INTERVIEW HELPERS
// ============================================================================

export function getUpcomingInterviews(candidate: Candidate): Interview[] {
  const now = new Date()
  return candidate.interviews.filter(i =>
    i.scheduledAt &&
    new Date(i.scheduledAt) > now &&
    i.status === 'scheduled'
  )
}

export function getPastInterviews(candidate: Candidate): Interview[] {
  return candidate.interviews.filter(i => i.status === 'completed')
}

export function hasPassedAllInterviews(candidate: Candidate, requiredStages: InterviewStage[]): boolean {
  const completedStages = candidate.interviews
    .filter(i => i.status === 'completed' && i.recommendation !== 'no' && i.recommendation !== 'strong_no')
    .map(i => i.stage)

  return requiredStages.every(stage => completedStages.includes(stage))
}

// ============================================================================
// ASSESSMENT HELPERS
// ============================================================================

export function getCompletedAssessments(candidate: Candidate): Assessment[] {
  return candidate.assessments.filter(a => a.completedAt !== undefined)
}

export function getPendingAssessments(candidate: Candidate): Assessment[] {
  const now = new Date()
  return candidate.assessments.filter(a =>
    !a.completedAt &&
    (!a.dueDate || new Date(a.dueDate) >= now)
  )
}

export function getOverdueAssessments(candidate: Candidate): Assessment[] {
  const now = new Date()
  return candidate.assessments.filter(a =>
    !a.completedAt &&
    a.dueDate &&
    new Date(a.dueDate) < now
  )
}

export function calculateAssessmentPassRate(candidate: Candidate): number {
  const completed = getCompletedAssessments(candidate)
  if (completed.length === 0) return 0

  const passed = completed.filter(a => a.passed).length
  return Math.round((passed / completed.length) * 100)
}

// ============================================================================
// PIPELINE ANALYTICS
// ============================================================================

export function calculateConversionRate(
  totalCandidates: number,
  nextStageCandidates: number
): number {
  if (totalCandidates === 0) return 0
  return Math.round((nextStageCandidates / totalCandidates) * 100)
}

export function getCandidatesByStage(candidates: Candidate[]): Record<CandidateStatus, number> {
  const stages: Record<CandidateStatus, number> = {
    new: 0,
    screening: 0,
    interview: 0,
    assessment: 0,
    offer: 0,
    hired: 0,
    rejected: 0,
    withdrawn: 0
  }

  candidates.forEach(c => {
    stages[c.status]++
  })

  return stages
}

export function getCandidatesBySource(candidates: Candidate[]): Record<ApplicationSource, number> {
  const sources: Record<ApplicationSource, number> = {
    website: 0,
    linkedin: 0,
    referral: 0,
    recruiter: 0,
    job_board: 0,
    social: 0,
    direct: 0
  }

  candidates.forEach(c => {
    sources[c.source]++
  })

  return sources
}

export function calculateAverageTimeToHire(candidates: Candidate[]): number {
  const hiredCandidates = candidates.filter(c => c.status === 'hired')
  if (hiredCandidates.length === 0) return 0

  const totalDays = hiredCandidates.reduce((sum, c) => {
    return sum + calculateDaysInProcess(c.applicationDate)
  }, 0)

  return Math.round(totalDays / hiredCandidates.length)
}

// ============================================================================
// POSITION HELPERS
// ============================================================================

export function getActivePositions(positions: JobPosition[]): JobPosition[] {
  return positions.filter(p => p.status === 'open')
}

export function getPositionFillRate(position: JobPosition): number {
  if (position.openings === 0) return 0
  return Math.round((position.filledPositions / position.openings) * 100)
}

export function getPositionsByDepartment(positions: JobPosition[]): Record<string, number> {
  const departments: Record<string, number> = {}

  positions.forEach(p => {
    departments[p.department] = (departments[p.department] || 0) + 1
  })

  return departments
}

// ============================================================================
// VALIDATION HELPERS
// ============================================================================

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export function canMoveToNextStage(candidate: Candidate): boolean {
  // Business logic for stage progression
  switch (candidate.status) {
    case 'new':
      return true // Can always move to screening
    case 'screening':
      return (candidate.screeningScore || 0) >= 3 // Minimum score of 3/5
    case 'interview':
      return hasPassedAllInterviews(candidate, ['phone_screen', 'technical'])
    case 'assessment':
      return calculateAssessmentPassRate(candidate) >= 70
    case 'offer':
      return candidate.offer?.status === 'accepted'
    default:
      return false
  }
}

// ============================================================================
// NOTIFICATION HELPERS
// ============================================================================

export function needsFollowUp(candidate: Candidate): boolean {
  if (!candidate.nextFollowUpAt) return false
  return new Date(candidate.nextFollowUpAt) <= new Date()
}

export function getDaysUntilFollowUp(candidate: Candidate): number | null {
  if (!candidate.nextFollowUpAt) return null

  const followUp = new Date(candidate.nextFollowUpAt)
  const now = new Date()
  const diff = followUp.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function hasInactivityWarning(candidate: Candidate, days: number = 7): boolean {
  const lastActivity = new Date(candidate.lastActivityAt)
  const now = new Date()
  const daysSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)
  return daysSinceActivity >= days
}
