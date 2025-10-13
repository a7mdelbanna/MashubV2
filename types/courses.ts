/**
 * MasHub V2 - Courses Module Type Definitions
 *
 * Comprehensive type system for Learning Management System (LMS)
 * Supports online courses, student enrollment, progress tracking, and certificates
 */

// ==================== COURSE TYPES ====================

export interface Course {
  id: string
  tenantId: string
  title: string
  slug: string // URL-friendly identifier
  description: string
  longDescription?: string // Full HTML content
  category: CourseCategory
  level: CourseLevel
  language: string // ISO 639-1 code (en, ar, etc.)
  thumbnail?: string // Image URL
  previewVideo?: string // Video URL

  // Pricing
  price: number
  currency: string
  discountPrice?: number
  discountEndsAt?: Date
  isFree: boolean

  // Structure
  lessons: Lesson[]
  totalLessons: number
  totalDuration: number // in minutes

  // Enrollment
  maxStudents?: number // null for unlimited
  enrolledStudents: number
  completionRate: number // percentage of students who completed

  // Requirements & Outcomes
  requirements: string[] // Prerequisites
  whatYouWillLearn: string[] // Learning outcomes
  targetAudience: string[]

  // Instructors
  instructors: Instructor[]

  // Status & Publishing
  status: CourseStatus
  publishedAt?: Date

  // Features
  hasCertificate: boolean
  hasAssignments: boolean
  hasQuizzes: boolean
  allowDownloads: boolean

  // SEO & Marketing
  tags: string[]
  metaDescription?: string

  // Analytics
  rating: number // Average rating 0-5
  totalReviews: number
  totalRevenue: number

  createdAt: Date
  updatedAt: Date
  createdBy: string
  updatedBy?: string
}

export type CourseStatus =
  | 'draft' // Being created
  | 'review' // Submitted for review
  | 'published' // Live and available
  | 'archived' // No longer active but accessible to enrolled students

export type CourseCategory =
  | 'web-development'
  | 'mobile-development'
  | 'data-science'
  | 'machine-learning'
  | 'design'
  | 'marketing'
  | 'business'
  | 'finance'
  | 'photography'
  | 'music'
  | 'health-fitness'
  | 'language'
  | 'other'

export type CourseLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'all-levels'

// ==================== LESSON TYPES ====================

export interface Lesson {
  id: string
  courseId: string
  sectionId: string // Lessons are organized in sections
  title: string
  slug: string
  description?: string
  order: number

  // Content
  contentType: LessonContentType
  videoUrl?: string
  videoDuration?: number // in seconds
  videoProvider?: 'youtube' | 'vimeo' | 'wistia' | 'self-hosted'
  articleContent?: string // HTML content for article-based lessons
  attachments?: LessonAttachment[]

  // Features
  isPreview: boolean // Free preview lesson
  isMandatory: boolean // Required for completion

  // Quiz (if applicable)
  quiz?: Quiz

  // Status
  isPublished: boolean

  createdAt: Date
  updatedAt: Date
}

export type LessonContentType =
  | 'video'
  | 'article'
  | 'quiz'
  | 'assignment'
  | 'download'
  | 'live-session'

export interface LessonAttachment {
  id: string
  name: string
  fileType: string // pdf, zip, doc, etc.
  fileSize: number // in bytes
  url: string
  uploadedAt: Date
}

// ==================== SECTION TYPES ====================

export interface Section {
  id: string
  courseId: string
  title: string
  description?: string
  order: number
  lessons: Lesson[]
  totalDuration: number // sum of all lessons
  createdAt: Date
  updatedAt: Date
}

// ==================== ENROLLMENT TYPES ====================

export interface Enrollment {
  id: string
  tenantId: string
  studentId: string
  courseId: string

  // Payment
  amountPaid: number
  currency: string
  paymentMethod?: string
  transactionId?: string

  // Progress
  status: EnrollmentStatus
  progress: number // 0-100 percentage
  completedLessons: string[] // Lesson IDs
  currentLessonId?: string
  lastAccessedAt?: Date

  // Completion
  completedAt?: Date
  certificateId?: string
  finalGrade?: number // 0-100

  // Access
  enrolledAt: Date
  expiresAt?: Date // For time-limited courses
  accessRevokedAt?: Date

  // Engagement
  totalTimeSpent: number // in minutes
  totalVideoWatched: number // in minutes

  createdAt: Date
  updatedAt: Date
}

export type EnrollmentStatus =
  | 'active' // Currently enrolled and can access
  | 'completed' // Finished the course
  | 'expired' // Access period ended
  | 'revoked' // Access manually removed
  | 'refunded' // Payment refunded, access removed

// ==================== STUDENT TYPES ====================

export interface Student {
  id: string
  tenantId: string
  userId: string // Reference to main user account

  // Profile
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  bio?: string

  // Progress
  enrolledCourses: number
  completedCourses: number
  certificatesEarned: number
  totalLearningTime: number // in minutes

  // Engagement
  lastActiveAt?: Date
  joinedAt: Date

  // Settings
  emailNotifications: boolean
  language: string
  timezone: string

  createdAt: Date
  updatedAt: Date
}

// ==================== INSTRUCTOR TYPES ====================

export interface Instructor {
  id: string
  tenantId: string
  userId: string // Reference to main user account

  // Profile
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string
  bio: string
  title?: string // e.g., "Senior Developer", "PhD in Computer Science"

  // Professional
  website?: string
  linkedIn?: string
  twitter?: string
  github?: string

  // Teaching
  expertise: string[] // Areas of expertise
  coursesCreated: number
  totalStudents: number
  averageRating: number

  // Revenue (if applicable)
  revenueShare: number // Percentage (0-100)
  totalEarnings: number

  // Status
  isActive: boolean
  isVerified: boolean

  createdAt: Date
  updatedAt: Date
}

// ==================== QUIZ TYPES ====================

export interface Quiz {
  id: string
  lessonId: string
  courseId: string
  title: string
  description?: string

  // Settings
  passingScore: number // Percentage required to pass (0-100)
  timeLimit?: number // in minutes, null for unlimited
  maxAttempts?: number // null for unlimited
  showCorrectAnswers: boolean
  shuffleQuestions: boolean

  // Questions
  questions: QuizQuestion[]
  totalPoints: number

  createdAt: Date
  updatedAt: Date
}

export interface QuizQuestion {
  id: string
  quizId: string
  question: string
  questionType: QuestionType
  order: number
  points: number

  // Options (for MCQ, True/False, etc.)
  options?: QuizOption[]

  // Correct answer(s)
  correctAnswers: string[] // Answer IDs or text

  // Explanation shown after submission
  explanation?: string

  createdAt: Date
  updatedAt: Date
}

export type QuestionType =
  | 'multiple-choice' // One correct answer
  | 'multiple-select' // Multiple correct answers
  | 'true-false'
  | 'short-answer'
  | 'essay'

export interface QuizOption {
  id: string
  text: string
  order: number
}

export interface QuizAttempt {
  id: string
  quizId: string
  studentId: string
  courseId: string

  // Submission
  answers: QuizAnswer[]
  score: number // 0-100 percentage
  pointsEarned: number
  totalPoints: number
  passed: boolean

  // Timing
  startedAt: Date
  submittedAt?: Date
  timeSpent: number // in seconds

  attemptNumber: number

  createdAt: Date
}

export interface QuizAnswer {
  questionId: string
  selectedAnswers: string[] // Answer IDs or text
  isCorrect: boolean
  pointsEarned: number
}

// ==================== CERTIFICATE TYPES ====================

export interface Certificate {
  id: string
  tenantId: string
  courseId: string
  studentId: string
  enrollmentId: string

  // Certificate Details
  certificateNumber: string // Unique identifier
  studentName: string
  courseName: string
  issueDate: Date
  completionDate: Date

  // Verification
  verificationUrl: string
  qrCode?: string // Base64 encoded QR code

  // Grade (optional)
  grade?: number // 0-100

  // Template
  templateId?: string // Reference to certificate design template

  // File
  pdfUrl?: string // Generated PDF URL

  createdAt: Date
}

// ==================== REVIEW TYPES ====================

export interface CourseReview {
  id: string
  courseId: string
  studentId: string
  enrollmentId: string

  // Review
  rating: number // 1-5 stars
  title?: string
  comment: string

  // Instructor Response
  instructorResponse?: string
  instructorResponseAt?: Date

  // Status
  isPublished: boolean
  isFeatured: boolean // Highlight on course page

  // Verification
  isVerifiedPurchase: boolean

  createdAt: Date
  updatedAt: Date
}

// ==================== ASSIGNMENT TYPES ====================

export interface Assignment {
  id: string
  lessonId: string
  courseId: string
  title: string
  description: string
  instructions: string

  // Settings
  maxScore: number
  dueDate?: Date
  allowLateSubmission: boolean
  fileTypes: string[] // Allowed file extensions
  maxFileSize: number // in MB

  // Grading
  rubric?: AssignmentRubric[]
  autoGrade: boolean // If possible (e.g., code submissions)

  createdAt: Date
  updatedAt: Date
}

export interface AssignmentRubric {
  criterion: string
  description: string
  maxPoints: number
  order: number
}

export interface AssignmentSubmission {
  id: string
  assignmentId: string
  studentId: string
  courseId: string

  // Submission
  submittedFiles: LessonAttachment[]
  submittedText?: string
  submittedAt: Date
  isLate: boolean

  // Grading
  status: SubmissionStatus
  grade?: number
  feedback?: string
  gradedBy?: string // Instructor ID
  gradedAt?: Date

  // Resubmission
  resubmissionAllowed: boolean
  resubmissionCount: number

  createdAt: Date
  updatedAt: Date
}

export type SubmissionStatus =
  | 'submitted' // Waiting for review
  | 'graded' // Reviewed and graded
  | 'returned' // Needs resubmission
  | 'late' // Submitted after deadline

// ==================== ANALYTICS TYPES ====================

export interface CourseAnalytics {
  courseId: string

  // Enrollment
  totalEnrollments: number
  activeEnrollments: number
  completedEnrollments: number
  completionRate: number // percentage

  // Revenue
  totalRevenue: number
  currency: string
  averageRevenuePerStudent: number

  // Engagement
  averageProgressPercentage: number
  averageLearningTime: number // in minutes
  averageRating: number
  totalReviews: number

  // Performance
  mostViewedLesson: string
  leastViewedLesson: string
  averageQuizScore: number
  averageAssignmentScore: number

  // Trends
  enrollmentsByMonth: Record<string, number> // "2024-03": 45
  revenueByMonth: Record<string, number>

  updatedAt: Date
}

export interface StudentAnalytics {
  studentId: string

  // Overall
  totalCoursesEnrolled: number
  totalCoursesCompleted: number
  totalCertificatesEarned: number
  totalLearningTime: number // in minutes

  // Performance
  averageGrade: number // 0-100
  averageQuizScore: number
  averageAssignmentScore: number

  // Engagement
  currentStreak: number // days
  longestStreak: number // days
  lastActiveDate: Date

  // Progress
  coursesInProgress: number
  lessonsCompletedThisMonth: number

  updatedAt: Date
}

// ==================== UTILITY TYPES ====================

export interface CoursesFilters {
  search?: string
  category?: CourseCategory
  level?: CourseLevel
  language?: string
  minPrice?: number
  maxPrice?: number
  isFree?: boolean
  status?: CourseStatus
  instructorId?: string
  rating?: number // Minimum rating
}

export interface EnrollmentsFilters {
  search?: string
  courseId?: string
  studentId?: string
  status?: EnrollmentStatus
  startDate?: Date
  endDate?: Date
}
