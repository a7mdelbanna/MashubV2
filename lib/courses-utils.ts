/**
 * MasHub V2 - Courses Module Utility Functions
 *
 * Helper functions for course formatting, calculations, and validations
 */

import type {
  Course,
  CourseLevel,
  CourseStatus,
  Enrollment,
  EnrollmentStatus
} from '@/types/courses'

// ==================== FORMATTING FUNCTIONS ====================

/**
 * Format course duration in human-readable format
 * @param minutes Total duration in minutes
 * @returns Formatted string like "2h 30m" or "45m"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (mins === 0) {
    return `${hours}h`
  }

  return `${hours}h ${mins}m`
}

/**
 * Format price with currency symbol
 * @param amount Price amount
 * @param currency Currency code
 * @returns Formatted price like "$49.99" or "Free"
 */
export function formatCoursePrice(amount: number, currency: string): string {
  if (amount === 0) {
    return 'Free'
  }

  const currencySymbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    EGP: 'E£',
    SAR: 'SR',
    AED: 'AED'
  }

  const symbol = currencySymbols[currency] || currency

  return `${symbol}${amount.toFixed(2)}`
}

/**
 * Format enrollment count
 * @param count Number of students
 * @returns Formatted string like "1.2K students" or "45 students"
 */
export function formatEnrollmentCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M students`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K students`
  }
  return `${count} student${count !== 1 ? 's' : ''}`
}

/**
 * Format rating with stars
 * @param rating Rating number (0-5)
 * @returns Rating with star symbol
 */
export function formatRating(rating: number): string {
  return `${rating.toFixed(1)} ★`
}

/**
 * Format progress percentage
 * @param progress Progress percentage (0-100)
 * @returns Formatted string like "75% Complete"
 */
export function formatProgress(progress: number): string {
  if (progress === 0) return 'Not Started'
  if (progress === 100) return 'Completed'
  return `${Math.round(progress)}% Complete`
}

// ==================== CALCULATION FUNCTIONS ====================

/**
 * Calculate course completion percentage
 * @param completedLessons Array of completed lesson IDs
 * @param totalLessons Total number of lessons
 * @returns Completion percentage (0-100)
 */
export function calculateProgress(
  completedLessons: string[],
  totalLessons: number
): number {
  if (totalLessons === 0) return 0
  return Math.round((completedLessons.length / totalLessons) * 100)
}

/**
 * Calculate course total duration from lessons
 * @param lessons Array of lessons with durations
 * @returns Total duration in minutes
 */
export function calculateTotalDuration(
  lessons: Array<{ videoDuration?: number }>
): number {
  return lessons.reduce((total, lesson) => {
    return total + (lesson.videoDuration ? lesson.videoDuration / 60 : 0)
  }, 0)
}

/**
 * Calculate discount percentage
 * @param originalPrice Original price
 * @param discountPrice Discounted price
 * @returns Discount percentage
 */
export function calculateDiscountPercentage(
  originalPrice: number,
  discountPrice: number
): number {
  if (originalPrice === 0) return 0
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
}

/**
 * Calculate average rating from reviews
 * @param reviews Array of reviews with ratings
 * @returns Average rating (0-5)
 */
export function calculateAverageRating(
  reviews: Array<{ rating: number }>
): number {
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((total, review) => total + review.rating, 0)
  return sum / reviews.length
}

/**
 * Calculate quiz score percentage
 * @param pointsEarned Points earned
 * @param totalPoints Total possible points
 * @returns Score percentage (0-100)
 */
export function calculateQuizScore(
  pointsEarned: number,
  totalPoints: number
): number {
  if (totalPoints === 0) return 0
  return Math.round((pointsEarned / totalPoints) * 100)
}

// ==================== VALIDATION FUNCTIONS ====================

/**
 * Validate if student can access a lesson
 * @param lesson Lesson to check
 * @param enrollment Student's enrollment
 * @returns True if accessible
 */
export function canAccessLesson(
  lesson: { isPreview: boolean; order: number },
  enrollment?: { completedLessons: string[]; status: EnrollmentStatus }
): boolean {
  // Preview lessons are always accessible
  if (lesson.isPreview) return true

  // Must be enrolled
  if (!enrollment) return false

  // Must have active enrollment
  return enrollment.status === 'active' || enrollment.status === 'completed'
}

/**
 * Check if course has an active discount
 * @param course Course to check
 * @returns True if discount is active
 */
export function hasActiveDiscount(course: {
  discountPrice?: number
  discountEndsAt?: Date
}): boolean {
  if (!course.discountPrice || !course.discountEndsAt) return false
  return new Date(course.discountEndsAt) > new Date()
}

/**
 * Check if student has completed a course
 * @param enrollment Enrollment to check
 * @returns True if completed
 */
export function isCourseCompleted(enrollment: {
  status: EnrollmentStatus
  progress: number
}): boolean {
  return enrollment.status === 'completed' || enrollment.progress === 100
}

/**
 * Validate quiz attempt
 * @param quiz Quiz settings
 * @param attemptNumber Current attempt number
 * @returns True if attempt is allowed
 */
export function canAttemptQuiz(
  quiz: { maxAttempts?: number },
  attemptNumber: number
): boolean {
  if (!quiz.maxAttempts) return true // Unlimited attempts
  return attemptNumber < quiz.maxAttempts
}

/**
 * Check if assignment submission is late
 * @param dueDate Assignment due date
 * @param submittedAt Submission date
 * @returns True if late
 */
export function isSubmissionLate(
  dueDate: Date | undefined,
  submittedAt: Date
): boolean {
  if (!dueDate) return false
  return new Date(submittedAt) > new Date(dueDate)
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get course level label with color
 * @param level Course level
 * @returns Object with label and color class
 */
export function getCourseLevelInfo(level: CourseLevel): {
  label: string
  color: string
  bgColor: string
} {
  const levels = {
    beginner: {
      label: 'Beginner',
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    intermediate: {
      label: 'Intermediate',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
    advanced: {
      label: 'Advanced',
      color: 'text-red-400',
      bgColor: 'bg-red-400/10'
    },
    'all-levels': {
      label: 'All Levels',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    }
  }

  return levels[level]
}

/**
 * Get course status label with color
 * @param status Course status
 * @returns Object with label and color class
 */
export function getCourseStatusInfo(status: CourseStatus): {
  label: string
  color: string
  bgColor: string
} {
  const statuses = {
    draft: {
      label: 'Draft',
      color: 'text-gray-400',
      bgColor: 'bg-gray-400/10'
    },
    review: {
      label: 'In Review',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
    published: {
      label: 'Published',
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    archived: {
      label: 'Archived',
      color: 'text-red-400',
      bgColor: 'bg-red-400/10'
    }
  }

  return statuses[status]
}

/**
 * Get enrollment status label with color
 * @param status Enrollment status
 * @returns Object with label and color class
 */
export function getEnrollmentStatusInfo(status: EnrollmentStatus): {
  label: string
  color: string
  bgColor: string
} {
  const statuses = {
    active: {
      label: 'Active',
      color: 'text-green-400',
      bgColor: 'bg-green-400/10'
    },
    completed: {
      label: 'Completed',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10'
    },
    expired: {
      label: 'Expired',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10'
    },
    revoked: {
      label: 'Revoked',
      color: 'text-red-400',
      bgColor: 'bg-red-400/10'
    },
    refunded: {
      label: 'Refunded',
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10'
    }
  }

  return statuses[status]
}

/**
 * Sort courses by various criteria
 * @param courses Array of courses
 * @param sortBy Sort criteria
 * @returns Sorted array
 */
export function sortCourses(
  courses: Course[],
  sortBy: 'popular' | 'newest' | 'rating' | 'price-low' | 'price-high'
): Course[] {
  const sorted = [...courses]

  switch (sortBy) {
    case 'popular':
      return sorted.sort(
        (a, b) => b.enrolledStudents - a.enrolledStudents
      )
    case 'newest':
      return sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price)
    default:
      return sorted
  }
}

/**
 * Filter courses by various criteria
 * @param courses Array of courses
 * @param filters Filter criteria
 * @returns Filtered array
 */
export function filterCourses(
  courses: Course[],
  filters: {
    search?: string
    category?: string
    level?: CourseLevel
    minPrice?: number
    maxPrice?: number
    isFree?: boolean
    minRating?: number
  }
): Course[] {
  return courses.filter((course) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesTitle = course.title.toLowerCase().includes(searchLower)
      const matchesDescription = course.description
        .toLowerCase()
        .includes(searchLower)
      if (!matchesTitle && !matchesDescription) return false
    }

    // Category filter
    if (filters.category && course.category !== filters.category) {
      return false
    }

    // Level filter
    if (filters.level && course.level !== filters.level) {
      return false
    }

    // Price filters
    if (filters.isFree && course.price > 0) {
      return false
    }

    if (filters.minPrice !== undefined && course.price < filters.minPrice) {
      return false
    }

    if (filters.maxPrice !== undefined && course.price > filters.maxPrice) {
      return false
    }

    // Rating filter
    if (filters.minRating && course.rating < filters.minRating) {
      return false
    }

    return true
  })
}

/**
 * Generate certificate number
 * @param courseId Course ID
 * @param studentId Student ID
 * @param timestamp Timestamp
 * @returns Unique certificate number
 */
export function generateCertificateNumber(
  courseId: string,
  studentId: string,
  timestamp: Date
): string {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const coursePrefix = courseId.slice(0, 4).toUpperCase()
  const studentPrefix = studentId.slice(0, 4).toUpperCase()
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')

  return `CERT-${year}${month}-${coursePrefix}-${studentPrefix}-${random}`
}

/**
 * Get time remaining until deadline
 * @param deadline Deadline date
 * @returns Human-readable time remaining
 */
export function getTimeRemaining(deadline: Date): string {
  const now = new Date()
  const diff = new Date(deadline).getTime() - now.getTime()

  if (diff < 0) return 'Overdue'

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (days > 0) {
    return `${days} day${days !== 1 ? 's' : ''} remaining`
  }

  if (hours > 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''} remaining`
  }

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  return `${minutes} minute${minutes !== 1 ? 's' : ''} remaining`
}
