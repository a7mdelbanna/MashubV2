'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Plus, Search, Filter, BookOpen, Users, Clock, Star,
  TrendingUp, Play, CheckCircle, Award, Grid, List,
  ChevronDown, DollarSign, BarChart3, Video, FileText
} from 'lucide-react'
import Select from '@/components/ui/select'
import {
  formatDuration,
  formatCoursePrice,
  formatEnrollmentCount,
  formatRating,
  getCourseLevelInfo,
  getCourseStatusInfo
} from '@/lib/courses-utils'
import type { Course } from '@/types/courses'

// Mock courses data
const mockCourses: Course[] = [
  {
    id: '1',
    tenantId: 'tenant1',
    title: 'Complete Web Development Bootcamp',
    slug: 'complete-web-development-bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js, and MongoDB',
    longDescription: 'Full-stack web development from scratch',
    category: 'web-development',
    level: 'beginner',
    language: 'en',
    thumbnail: '/images/courses/web-dev.jpg',
    previewVideo: 'https://youtube.com/watch?v=xxx',
    price: 299,
    currency: 'USD',
    discountPrice: 199,
    discountEndsAt: new Date('2024-12-31'),
    isFree: false,
    lessons: [],
    totalLessons: 45,
    totalDuration: 3200,
    maxStudents: undefined,
    enrolledStudents: 1250,
    completionRate: 78,
    requirements: ['Basic computer skills', 'Desire to learn'],
    whatYouWillLearn: ['HTML & CSS', 'JavaScript ES6+', 'React', 'Node.js', 'MongoDB'],
    targetAudience: ['Beginners', 'Career changers'],
    instructors: [],
    status: 'published',
    publishedAt: new Date('2024-01-15'),
    hasCertificate: true,
    hasAssignments: true,
    hasQuizzes: true,
    allowDownloads: true,
    tags: ['web-development', 'javascript', 'react', 'node'],
    metaDescription: 'Best web development bootcamp',
    rating: 4.8,
    totalReviews: 456,
    totalRevenue: 248750,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-01'),
    createdBy: 'admin',
    updatedBy: 'admin'
  },
  {
    id: '2',
    tenantId: 'tenant1',
    title: 'Machine Learning with Python',
    slug: 'machine-learning-python',
    description: 'Master ML algorithms, deep learning, and AI with Python',
    longDescription: 'Comprehensive machine learning course',
    category: 'machine-learning',
    level: 'intermediate',
    language: 'en',
    thumbnail: '/images/courses/ml.jpg',
    price: 399,
    currency: 'USD',
    isFree: false,
    lessons: [],
    totalLessons: 68,
    totalDuration: 4800,
    enrolledStudents: 890,
    completionRate: 65,
    requirements: ['Python programming', 'Basic statistics'],
    whatYouWillLearn: ['ML Algorithms', 'Deep Learning', 'TensorFlow', 'Computer Vision'],
    targetAudience: ['Developers', 'Data Scientists'],
    instructors: [],
    status: 'published',
    publishedAt: new Date('2024-02-01'),
    hasCertificate: true,
    hasAssignments: true,
    hasQuizzes: true,
    allowDownloads: false,
    tags: ['machine-learning', 'python', 'ai', 'data-science'],
    rating: 4.9,
    totalReviews: 312,
    totalRevenue: 355110,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-10'),
    createdBy: 'admin'
  },
  {
    id: '3',
    tenantId: 'tenant1',
    title: 'UI/UX Design Fundamentals',
    slug: 'ui-ux-design-fundamentals',
    description: 'Learn design principles, Figma, wireframing, and prototyping',
    longDescription: 'Complete UI/UX design course',
    category: 'design',
    level: 'beginner',
    language: 'en',
    thumbnail: '/images/courses/design.jpg',
    price: 0,
    currency: 'USD',
    isFree: true,
    lessons: [],
    totalLessons: 25,
    totalDuration: 1500,
    enrolledStudents: 3450,
    completionRate: 85,
    requirements: ['No prior experience required'],
    whatYouWillLearn: ['Design Principles', 'Figma', 'Wireframing', 'Prototyping'],
    targetAudience: ['Beginners', 'Designers'],
    instructors: [],
    status: 'published',
    publishedAt: new Date('2024-01-20'),
    hasCertificate: true,
    hasAssignments: false,
    hasQuizzes: true,
    allowDownloads: true,
    tags: ['design', 'ui-ux', 'figma'],
    rating: 4.7,
    totalReviews: 1203,
    totalRevenue: 0,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-03-05'),
    createdBy: 'admin'
  },
  {
    id: '4',
    tenantId: 'tenant1',
    title: 'Advanced React Patterns',
    slug: 'advanced-react-patterns',
    description: 'Master hooks, context, performance optimization, and advanced patterns',
    longDescription: 'Advanced React development',
    category: 'web-development',
    level: 'advanced',
    language: 'en',
    thumbnail: '/images/courses/react.jpg',
    price: 179,
    currency: 'USD',
    isFree: false,
    lessons: [],
    totalLessons: 32,
    totalDuration: 1800,
    enrolledStudents: 567,
    completionRate: 72,
    requirements: ['React fundamentals', '1+ years experience'],
    whatYouWillLearn: ['Advanced Hooks', 'Performance', 'State Management', 'Testing'],
    targetAudience: ['Experienced developers'],
    instructors: [],
    status: 'published',
    publishedAt: new Date('2024-02-15'),
    hasCertificate: true,
    hasAssignments: true,
    hasQuizzes: true,
    allowDownloads: true,
    tags: ['react', 'javascript', 'advanced'],
    rating: 4.9,
    totalReviews: 189,
    totalRevenue: 101493,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-12'),
    createdBy: 'admin'
  },
  {
    id: '5',
    tenantId: 'tenant1',
    title: 'Digital Marketing Mastery',
    slug: 'digital-marketing-mastery',
    description: 'SEO, social media, content marketing, and paid advertising',
    longDescription: 'Complete digital marketing course',
    category: 'marketing',
    level: 'intermediate',
    language: 'en',
    thumbnail: '/images/courses/marketing.jpg',
    price: 149,
    currency: 'USD',
    discountPrice: 99,
    discountEndsAt: new Date('2024-12-31'),
    isFree: false,
    lessons: [],
    totalLessons: 40,
    totalDuration: 2400,
    enrolledStudents: 2100,
    completionRate: 80,
    requirements: ['Basic marketing knowledge'],
    whatYouWillLearn: ['SEO', 'Social Media Marketing', 'Content Strategy', 'Paid Ads'],
    targetAudience: ['Marketers', 'Business owners'],
    instructors: [],
    status: 'published',
    publishedAt: new Date('2024-01-25'),
    hasCertificate: true,
    hasAssignments: true,
    hasQuizzes: true,
    allowDownloads: true,
    tags: ['marketing', 'seo', 'social-media'],
    rating: 4.6,
    totalReviews: 678,
    totalRevenue: 207900,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-08'),
    createdBy: 'admin'
  },
  {
    id: '6',
    tenantId: 'tenant1',
    title: 'Business Finance Essentials',
    slug: 'business-finance-essentials',
    description: 'Financial statements, budgeting, forecasting, and analysis',
    longDescription: 'Business finance fundamentals',
    category: 'finance',
    level: 'all-levels',
    language: 'en',
    thumbnail: '/images/courses/finance.jpg',
    price: 129,
    currency: 'USD',
    isFree: false,
    lessons: [],
    totalLessons: 28,
    totalDuration: 1680,
    enrolledStudents: 890,
    completionRate: 75,
    requirements: ['None'],
    whatYouWillLearn: ['Financial Statements', 'Budgeting', 'Forecasting', 'ROI Analysis'],
    targetAudience: ['Business owners', 'Managers', 'Entrepreneurs'],
    instructors: [],
    status: 'published',
    publishedAt: new Date('2024-02-10'),
    hasCertificate: true,
    hasAssignments: true,
    hasQuizzes: true,
    allowDownloads: true,
    tags: ['finance', 'business', 'accounting'],
    rating: 4.7,
    totalReviews: 234,
    totalRevenue: 114810,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-11'),
    createdBy: 'admin'
  }
]

const categories = [
  { value: '', label: 'All Categories' },
  { value: 'web-development', label: 'Web Development' },
  { value: 'mobile-development', label: 'Mobile Development' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'machine-learning', label: 'Machine Learning' },
  { value: 'design', label: 'Design' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'business', label: 'Business' },
  { value: 'finance', label: 'Finance' }
]

const levels = [
  { value: '', label: 'All Levels' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'all-levels', label: 'All Levels' }
]

const sortOptions = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest First' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' }
]

export default function CoursesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedSort, setSelectedSort] = useState('popular')
  const [showFilters, setShowFilters] = useState(false)

  // Filter courses
  const filteredCourses = mockCourses.filter((course) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (
        !course.title.toLowerCase().includes(query) &&
        !course.description.toLowerCase().includes(query)
      ) {
        return false
      }
    }
    if (selectedCategory && course.category !== selectedCategory) return false
    if (selectedLevel && course.level !== selectedLevel) return false
    return true
  })

  // Calculate stats
  const totalStudents = mockCourses.reduce(
    (sum, c) => sum + c.enrolledStudents,
    0
  )
  const averageRating = (
    mockCourses.reduce((sum, c) => sum + c.rating, 0) / mockCourses.length
  ).toFixed(1)
  const publishedCourses = mockCourses.filter(
    (c) => c.status === 'published'
  ).length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
              Courses
            </h1>
            <p className="text-gray-400">
              Manage and create online courses for your platform
            </p>
          </div>
          <Link
            href="/dashboard/courses/new"
            className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Course</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Courses</span>
              <BookOpen className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {publishedCourses}
            </p>
            <p className="text-gray-400 text-xs mt-1">Active courses</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Total Students</span>
              <Users className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">
              {formatEnrollmentCount(totalStudents)}
            </p>
            <p className="text-gray-400 text-xs mt-1">Enrolled students</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Average Rating</span>
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-white">{averageRating} ★</p>
            <p className="text-gray-400 text-xs mt-1">Across all courses</p>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Completion Rate</span>
              <TrendingUp className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">76%</p>
            <p className="text-gray-400 text-xs mt-1">Average completion</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${
                showFilters ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* View Mode */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-3 rounded-lg border transition-colors ${
                viewMode === 'grid'
                  ? 'bg-purple-500 border-purple-500 text-white'
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-3 rounded-lg border transition-colors ${
                viewMode === 'list'
                  ? 'bg-purple-500 border-purple-500 text-white'
                  : 'bg-gray-900 border-gray-700 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700">
            <Select
              label="Category"
              options={categories}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
            <Select
              label="Level"
              options={levels}
              value={selectedLevel}
              onChange={setSelectedLevel}
            />
            <Select
              label="Sort By"
              options={sortOptions}
              value={selectedSort}
              onChange={setSelectedSort}
            />
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-gray-400">
          Showing <span className="text-white font-semibold">{filteredCourses.length}</span> courses
        </p>
      </div>

      {/* Courses Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const levelInfo = getCourseLevelInfo(course.level)
            const hasDiscount =
              course.discountPrice &&
              course.discountEndsAt &&
              new Date(course.discountEndsAt) > new Date()

            return (
              <Link
                key={course.id}
                href={`/dashboard/courses/${course.id}`}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 hover:border-purple-500 transition-all overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="relative h-48 bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-purple-400/30" />
                  {hasDiscount && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {Math.round(
                        ((course.price - course.discountPrice!) / course.price) * 100
                      )}
                      % OFF
                    </div>
                  )}
                  {course.isFree && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      FREE
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Level Badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${levelInfo.bgColor} ${levelInfo.color}`}
                    >
                      {levelInfo.label}
                    </span>
                    {course.hasCertificate && (
                      <Award className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-400 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(course.totalDuration)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      <span>{course.totalLessons} lessons</span>
                    </div>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-semibold">
                        {course.rating.toFixed(1)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({course.totalReviews})
                      </span>
                    </div>
                    <div className="text-right">
                      {hasDiscount ? (
                        <div>
                          <p className="text-gray-500 text-sm line-through">
                            {formatCoursePrice(course.price, course.currency)}
                          </p>
                          <p className="text-white font-bold">
                            {formatCoursePrice(course.discountPrice!, course.currency)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-white font-bold">
                          {formatCoursePrice(course.price, course.currency)}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Students */}
                  <div className="mt-3 flex items-center gap-1 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{formatEnrollmentCount(course.enrolledStudents)}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => {
            const levelInfo = getCourseLevelInfo(course.level)
            const hasDiscount =
              course.discountPrice &&
              course.discountEndsAt &&
              new Date(course.discountEndsAt) > new Date()

            return (
              <Link
                key={course.id}
                href={`/dashboard/courses/${course.id}`}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 hover:border-purple-500 transition-all p-6 flex gap-6"
              >
                {/* Thumbnail */}
                <div className="relative w-48 h-32 rounded-lg bg-gradient-to-br from-purple-900/20 to-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-12 h-12 text-purple-400/30" />
                  {hasDiscount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      {Math.round(
                        ((course.price - course.discountPrice!) / course.price) * 100
                      )}
                      % OFF
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${levelInfo.bgColor} ${levelInfo.color}`}
                        >
                          {levelInfo.label}
                        </span>
                        {course.hasCertificate && (
                          <Award className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <h3 className="text-white font-semibold text-xl group-hover:text-purple-400 transition-colors">
                        {course.title}
                      </h3>
                    </div>
                    <div className="text-right">
                      {hasDiscount ? (
                        <div>
                          <p className="text-gray-500 text-sm line-through">
                            {formatCoursePrice(course.price, course.currency)}
                          </p>
                          <p className="text-white font-bold text-xl">
                            {formatCoursePrice(course.discountPrice!, course.currency)}
                          </p>
                        </div>
                      ) : (
                        <p className="text-white font-bold text-xl">
                          {formatCoursePrice(course.price, course.currency)}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-400 mb-4">{course.description}</p>

                  <div className="flex items-center gap-6 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatDuration(course.totalDuration)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      <span>{course.totalLessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{formatEnrollmentCount(course.enrolledStudents)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-semibold">
                        {course.rating.toFixed(1)}
                      </span>
                      <span className="text-gray-500">({course.totalReviews})</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No courses found</h3>
          <p className="text-gray-400 mb-6">
            Try adjusting your filters or create a new course
          </p>
          <Link
            href="/dashboard/courses/new"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Add Course</span>
          </Link>
        </div>
      )}
    </div>
  )
}
