'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Play, Clock, Users, Star, Award, CheckCircle,
  BookOpen, FileText, Video, Download, Edit, Trash2, Eye,
  TrendingUp, DollarSign, BarChart3, MessageSquare, Settings,
  Lock, ChevronDown, ChevronUp, Calendar, Target, List,
  Globe, Tag, Shield
} from 'lucide-react'
import {
  formatDuration,
  formatCoursePrice,
  formatEnrollmentCount,
  formatRating,
  getCourseLevelInfo,
  getCourseStatusInfo,
  calculateDiscountPercentage
} from '@/lib/courses-utils'

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'curriculum' | 'reviews' | 'students' | 'analytics'
  >('overview')
  const [expandedSections, setExpandedSections] = useState<string[]>(['1'])

  // Mock course data
  const course = {
    id: params.id,
    title: 'Complete Web Development Bootcamp',
    slug: 'complete-web-development-bootcamp',
    description:
      'Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB from scratch. Build real-world projects and become a full-stack developer.',
    longDescription:
      '<p>This comprehensive course will take you from complete beginner to professional full-stack developer...</p>',
    category: 'web-development',
    level: 'beginner' as const,
    language: 'en',
    thumbnail: '/images/courses/web-dev.jpg',
    previewVideo: 'https://youtube.com/watch?v=xxx',
    price: 299,
    currency: 'USD',
    discountPrice: 199,
    discountEndsAt: new Date('2024-12-31'),
    isFree: false,
    totalLessons: 45,
    totalDuration: 3200,
    enrolledStudents: 1250,
    completionRate: 78,
    requirements: [
      'Basic computer skills',
      'Desire to learn programming',
      'Stable internet connection'
    ],
    whatYouWillLearn: [
      'HTML5 and CSS3 fundamentals',
      'Modern JavaScript (ES6+)',
      'React and React Hooks',
      'Node.js and Express',
      'MongoDB and Mongoose',
      'RESTful API development',
      'Authentication and Authorization',
      'Deployment to production'
    ],
    targetAudience: [
      'Complete beginners',
      'Career changers',
      'Students looking to learn web development'
    ],
    instructors: [
      {
        id: '1',
        name: 'John Doe',
        title: 'Senior Full Stack Developer',
        avatar: '/images/avatars/john.jpg',
        bio: '10+ years of web development experience',
        rating: 4.9,
        students: 15000,
        courses: 8
      }
    ],
    status: 'published' as const,
    publishedAt: new Date('2024-01-15'),
    hasCertificate: true,
    hasAssignments: true,
    hasQuizzes: true,
    allowDownloads: true,
    tags: ['web-development', 'javascript', 'react', 'node', 'mongodb'],
    metaDescription: 'Best web development bootcamp',
    rating: 4.8,
    totalReviews: 456,
    totalRevenue: 248750,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-01')
  }

  // Mock curriculum
  const sections = [
    {
      id: '1',
      title: 'Getting Started',
      description: 'Introduction and setup',
      lessons: [
        {
          id: '1',
          title: 'Welcome to the Course',
          type: 'video',
          duration: 300,
          isPreview: true,
          completed: false
        },
        {
          id: '2',
          title: 'Setting Up Your Development Environment',
          type: 'video',
          duration: 900,
          isPreview: true,
          completed: false
        },
        {
          id: '3',
          title: 'Course Resources',
          type: 'article',
          duration: 180,
          isPreview: false,
          completed: false
        }
      ]
    },
    {
      id: '2',
      title: 'HTML & CSS Fundamentals',
      description: 'Learn the building blocks of web pages',
      lessons: [
        {
          id: '4',
          title: 'HTML Basics',
          type: 'video',
          duration: 1200,
          isPreview: false,
          completed: false
        },
        {
          id: '5',
          title: 'CSS Styling',
          type: 'video',
          duration: 1500,
          isPreview: false,
          completed: false
        },
        {
          id: '6',
          title: 'Responsive Design',
          type: 'video',
          duration: 1800,
          isPreview: false,
          completed: false
        },
        {
          id: '7',
          title: 'CSS Flexbox & Grid',
          type: 'video',
          duration: 2100,
          isPreview: false,
          completed: false
        },
        {
          id: '8',
          title: 'Project: Build a Landing Page',
          type: 'assignment',
          duration: 3600,
          isPreview: false,
          completed: false
        }
      ]
    },
    {
      id: '3',
      title: 'JavaScript Mastery',
      description: 'Master modern JavaScript',
      lessons: [
        {
          id: '9',
          title: 'JavaScript Basics',
          type: 'video',
          duration: 1800,
          isPreview: false,
          completed: false
        },
        {
          id: '10',
          title: 'Functions and Scope',
          type: 'video',
          duration: 1500,
          isPreview: false,
          completed: false
        },
        {
          id: '11',
          title: 'DOM Manipulation',
          type: 'video',
          duration: 2100,
          isPreview: false,
          completed: false
        },
        {
          id: '12',
          title: 'ES6+ Features',
          type: 'video',
          duration: 1800,
          isPreview: false,
          completed: false
        },
        {
          id: '13',
          title: 'Async JavaScript',
          type: 'video',
          duration: 2400,
          isPreview: false,
          completed: false
        },
        {
          id: '14',
          title: 'Quiz: JavaScript Fundamentals',
          type: 'quiz',
          duration: 600,
          isPreview: false,
          completed: false
        }
      ]
    }
  ]

  // Mock reviews
  const reviews = [
    {
      id: '1',
      studentName: 'Alice Johnson',
      rating: 5,
      comment:
        'Excellent course! Very comprehensive and well-structured. The instructor explains everything clearly.',
      date: '2024-03-01',
      avatar: '/images/avatars/alice.jpg'
    },
    {
      id: '2',
      studentName: 'Bob Smith',
      rating: 4,
      comment:
        'Great content, but I wish there were more practice exercises.',
      date: '2024-02-28',
      avatar: '/images/avatars/bob.jpg'
    },
    {
      id: '3',
      studentName: 'Carol White',
      rating: 5,
      comment:
        'Best web development course I have taken. Highly recommend!',
      date: '2024-02-25',
      avatar: '/images/avatars/carol.jpg'
    }
  ]

  const levelInfo = getCourseLevelInfo(course.level)
  const statusInfo = getCourseStatusInfo(course.status)
  const hasDiscount =
    course.discountPrice &&
    course.discountEndsAt &&
    new Date(course.discountEndsAt) > new Date()
  const discountPercent = hasDiscount
    ? calculateDiscountPercentage(course.price, course.discountPrice!)
    : 0

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />
      case 'article':
        return <FileText className="w-4 h-4" />
      case 'quiz':
        return <List className="w-4 h-4" />
      case 'assignment':
        return <Target className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/courses"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color}`}
              >
                {statusInfo.label}
              </span>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${levelInfo.bgColor} ${levelInfo.color}`}
              >
                {levelInfo.label}
              </span>
              {course.hasCertificate && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-yellow-400/10 text-yellow-400">
                  <Award className="w-4 h-4" />
                  Certificate
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-white mb-3">
              {course.title}
            </h1>
            <p className="text-gray-400 text-lg mb-4">{course.description}</p>

            {/* Course Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-5 h-5 fill-yellow-400" />
                <span className="font-semibold">{course.rating}</span>
                <span className="text-gray-400">({course.totalReviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Users className="w-4 h-4" />
                <span>{formatEnrollmentCount(course.enrolledStudents)}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(course.totalDuration)}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <BookOpen className="w-4 h-4" />
                <span>{course.totalLessons} lessons</span>
              </div>
              <div className="flex items-center gap-1 text-gray-400">
                <Globe className="w-4 h-4" />
                <span>English</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/courses/${params.id}/edit`}
              className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-700 transition-all flex items-center space-x-2"
            >
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Link>
            <button className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-700 transition-all flex items-center space-x-2">
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
            <button className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all flex items-center space-x-2">
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Revenue</span>
            <DollarSign className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {formatCoursePrice(course.totalRevenue, course.currency)}
          </p>
          <p className="text-gray-400 text-xs mt-1">Total earnings</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Enrolled</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{course.enrolledStudents}</p>
          <p className="text-gray-400 text-xs mt-1">Active students</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Completion</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{course.completionRate}%</p>
          <p className="text-gray-400 text-xs mt-1">Finish rate</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Rating</span>
            <Star className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{course.rating} ★</p>
          <p className="text-gray-400 text-xs mt-1">Average rating</p>
        </div>
      </div>

      {/* Pricing Section */}
      {hasDiscount && (
        <div className="bg-gradient-to-r from-red-500/10 to-purple-500/10 border border-red-500/30 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 font-semibold mb-1">
                Limited Time Offer - {discountPercent}% OFF!
              </p>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-white">
                  {formatCoursePrice(course.discountPrice!, course.currency)}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  {formatCoursePrice(course.price, course.currency)}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-1">Offer ends:</p>
              <p className="text-white font-semibold">
                {new Date(course.discountEndsAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-700">
        <div className="flex gap-6">
          {['overview', 'curriculum', 'reviews', 'students', 'analytics'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-4 px-2 font-medium capitalize transition-colors relative ${
                activeTab === tab
                  ? 'text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-purple" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* What You'll Learn */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  What You'll Learn
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Description */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Course Description
                </h2>
                <div className="text-gray-300 prose prose-invert max-w-none">
                  <p>{course.description}</p>
                </div>
              </div>

              {/* Requirements */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {course.requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="text-purple-400">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Target Audience */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Who This Course is For
                </h2>
                <ul className="space-y-2">
                  {course.targetAudience.map((audience, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-300">
                      <span className="text-purple-400">•</span>
                      {audience}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Instructor */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Instructor</h2>
                {course.instructors.map((instructor) => (
                  <div key={instructor.id}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-16 h-16 rounded-full bg-gradient-purple flex items-center justify-center text-white text-xl font-bold">
                        {instructor.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{instructor.name}</h3>
                        <p className="text-gray-400 text-sm">{instructor.title}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">{instructor.bio}</p>
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                      <div>
                        <p className="text-purple-400 font-semibold">{instructor.rating}</p>
                        <p className="text-gray-400 text-xs">Rating</p>
                      </div>
                      <div>
                        <p className="text-purple-400 font-semibold">
                          {formatEnrollmentCount(instructor.students)}
                        </p>
                        <p className="text-gray-400 text-xs">Students</p>
                      </div>
                      <div>
                        <p className="text-purple-400 font-semibold">{instructor.courses}</p>
                        <p className="text-gray-400 text-xs">Courses</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Course Features */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Course Features
                </h2>
                <div className="space-y-3">
                  {course.hasCertificate && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <span>Certificate of completion</span>
                    </div>
                  )}
                  {course.hasAssignments && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Target className="w-4 h-4 text-blue-400" />
                      <span>Hands-on assignments</span>
                    </div>
                  )}
                  {course.hasQuizzes && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <List className="w-4 h-4 text-green-400" />
                      <span>Quizzes and assessments</span>
                    </div>
                  )}
                  {course.allowDownloads && (
                    <div className="flex items-center gap-2 text-gray-300">
                      <Download className="w-4 h-4 text-purple-400" />
                      <span>Downloadable resources</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-300">
                    <Shield className="w-4 h-4 text-red-400" />
                    <span>Lifetime access</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Curriculum Tab */}
        {activeTab === 'curriculum' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Course Curriculum</h2>
              <p className="text-gray-400 text-sm mt-1">
                {sections.length} sections • {course.totalLessons} lessons •{' '}
                {formatDuration(course.totalDuration)} total length
              </p>
            </div>

            <div className="divide-y divide-gray-700">
              {sections.map((section) => {
                const isExpanded = expandedSections.includes(section.id)
                const sectionDuration = section.lessons.reduce(
                  (sum, lesson) => sum + lesson.duration,
                  0
                )

                return (
                  <div key={section.id}>
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full p-6 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-purple-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                        <div className="text-left">
                          <h3 className="text-white font-semibold">{section.title}</h3>
                          <p className="text-gray-400 text-sm">{section.description}</p>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-400">
                        <p>{section.lessons.length} lessons</p>
                        <p>{formatDuration(sectionDuration / 60)}</p>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="bg-gray-900/30">
                        {section.lessons.map((lesson, index) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between px-6 py-4 hover:bg-gray-700/20 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-gray-500">{getLessonIcon(lesson.type)}</div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-white">{lesson.title}</p>
                                  {lesson.isPreview && (
                                    <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-400 rounded">
                                      Preview
                                    </span>
                                  )}
                                  {!lesson.isPreview && (
                                    <Lock className="w-3 h-3 text-gray-500" />
                                  )}
                                </div>
                                <p className="text-gray-400 text-sm capitalize">
                                  {lesson.type}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-gray-400 text-sm">
                                {formatDuration(lesson.duration / 60)}
                              </span>
                              {lesson.completed && (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Student Reviews
                </h2>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="pb-6 border-b border-gray-700 last:border-0"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-purple flex items-center justify-center text-white font-bold">
                          {review.studentName
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="text-white font-semibold">
                                {review.studentName}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? 'text-yellow-400 fill-yellow-400'
                                          : 'text-gray-600'
                                      }`}
                                    />
                                  ))}
                                </div>
                                <span className="text-gray-400 text-sm">
                                  {new Date(review.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-300">{review.comment}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rating Overview */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Rating Overview
              </h2>
              <div className="text-center mb-6">
                <p className="text-5xl font-bold text-white mb-2">{course.rating}</p>
                <div className="flex justify-center mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-400">{course.totalReviews} reviews</p>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const percentage = star === 5 ? 75 : star === 4 ? 20 : 5
                  return (
                    <div key={star} className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm w-8">{star} ★</span>
                      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-gray-400 text-sm w-12 text-right">
                        {percentage}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Students & Analytics tabs would go here */}
        {activeTab === 'students' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-8 text-center">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Students Management
            </h3>
            <p className="text-gray-400">
              View and manage enrolled students for this course
            </p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-8 text-center">
            <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Course Analytics
            </h3>
            <p className="text-gray-400">
              Detailed analytics and insights for this course
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
