'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  BookOpen,
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Video,
  FileText,
  CheckCircle,
  ClipboardList,
  Eye,
  EyeOff,
  Lock,
  Clock,
  ChevronDown,
  ChevronRight,
  Copy,
  Move
} from 'lucide-react'

// Mock data - replace with actual API calls
const mockCourse = {
  id: 'c1',
  title: 'Complete Web Development Bootcamp',
  totalLessons: 24,
  totalDuration: 1440,
  status: 'published' as const
}

const mockSections = [
  {
    id: 's1',
    courseId: 'c1',
    title: 'Getting Started',
    description: 'Introduction to web development fundamentals',
    order: 1,
    lessons: [
      {
        id: 'l1',
        courseId: 'c1',
        sectionId: 's1',
        title: 'Welcome to the Course',
        slug: 'welcome-to-the-course',
        description: 'An introduction to what you will learn',
        order: 1,
        contentType: 'video' as const,
        videoUrl: 'https://example.com/video1.mp4',
        videoDuration: 15,
        isPreview: true,
        isMandatory: true,
        isPublished: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z'
      },
      {
        id: 'l2',
        courseId: 'c1',
        sectionId: 's1',
        title: 'Setting Up Your Development Environment',
        slug: 'setup-development-environment',
        description: 'Install necessary tools and software',
        order: 2,
        contentType: 'video' as const,
        videoUrl: 'https://example.com/video2.mp4',
        videoDuration: 25,
        isPreview: false,
        isMandatory: true,
        isPublished: true,
        createdAt: '2024-01-15T11:00:00Z',
        updatedAt: '2024-01-15T11:00:00Z'
      },
      {
        id: 'l3',
        courseId: 'c1',
        sectionId: 's1',
        title: 'HTML Basics Quiz',
        slug: 'html-basics-quiz',
        description: 'Test your HTML knowledge',
        order: 3,
        contentType: 'quiz' as const,
        isMandatory: false,
        isPublished: true,
        createdAt: '2024-01-15T12:00:00Z',
        updatedAt: '2024-01-15T12:00:00Z'
      }
    ]
  },
  {
    id: 's2',
    courseId: 'c1',
    title: 'HTML & CSS Fundamentals',
    description: 'Learn the building blocks of web pages',
    order: 2,
    lessons: [
      {
        id: 'l4',
        courseId: 'c1',
        sectionId: 's2',
        title: 'Introduction to HTML',
        slug: 'intro-to-html',
        description: 'Learn HTML structure and syntax',
        order: 1,
        contentType: 'video' as const,
        videoUrl: 'https://example.com/video4.mp4',
        videoDuration: 30,
        isPreview: false,
        isMandatory: true,
        isPublished: true,
        createdAt: '2024-01-16T10:00:00Z',
        updatedAt: '2024-01-16T10:00:00Z'
      },
      {
        id: 'l5',
        courseId: 'c1',
        sectionId: 's2',
        title: 'CSS Styling Basics',
        slug: 'css-styling-basics',
        description: 'Learn to style your web pages',
        order: 2,
        contentType: 'article' as const,
        articleContent: 'CSS content here...',
        isMandatory: true,
        isPublished: false,
        createdAt: '2024-01-16T11:00:00Z',
        updatedAt: '2024-01-16T11:00:00Z'
      }
    ]
  }
]

export default function CourseLessonsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [sections, setSections] = useState(mockSections)
  const [expandedSections, setExpandedSections] = useState<string[]>(['s1', 's2'])
  const [selectedLessons, setSelectedLessons] = useState<Set<string>>(new Set())
  const [isReorderMode, setIsReorderMode] = useState(false)

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  // Toggle lesson selection
  const toggleLessonSelection = (lessonId: string) => {
    setSelectedLessons(prev => {
      const newSet = new Set(prev)
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId)
      } else {
        newSet.add(lessonId)
      }
      return newSet
    })
  }

  // Get lesson icon based on content type
  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />
      case 'article':
        return <FileText className="w-4 h-4" />
      case 'quiz':
        return <CheckCircle className="w-4 h-4" />
      case 'assignment':
        return <ClipboardList className="w-4 h-4" />
      default:
        return <BookOpen className="w-4 h-4" />
    }
  }

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}m`
    }
    return `${mins}m`
  }

  // Calculate section stats
  const getSectionStats = (section: typeof mockSections[0]) => {
    const totalLessons = section.lessons.length
    const publishedLessons = section.lessons.filter(l => l.isPublished).length
    const totalDuration = section.lessons
      .filter(l => l.videoDuration)
      .reduce((sum, l) => sum + (l.videoDuration || 0), 0)

    return { totalLessons, publishedLessons, totalDuration }
  }

  // Delete selected lessons
  const handleBulkDelete = () => {
    if (selectedLessons.size === 0) return
    if (!confirm(`Are you sure you want to delete ${selectedLessons.size} lesson(s)?`)) return

    setSections(sections.map(section => ({
      ...section,
      lessons: section.lessons.filter(lesson => !selectedLessons.has(lesson.id))
    })))
    setSelectedLessons(new Set())
  }

  // Duplicate lesson
  const handleDuplicateLesson = (lessonId: string) => {
    // Implementation for duplicating lesson
    console.log('Duplicate lesson:', lessonId)
  }

  // Delete single lesson
  const handleDeleteLesson = (lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return

    setSections(sections.map(section => ({
      ...section,
      lessons: section.lessons.filter(lesson => lesson.id !== lessonId)
    })))
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
          <Link href="/dashboard/courses" className="hover:text-purple-400 transition-colors">
            Courses
          </Link>
          <span>/</span>
          <Link href={`/dashboard/courses/${courseId}`} className="hover:text-purple-400 transition-colors">
            {mockCourse.title}
          </Link>
          <span>/</span>
          <span className="text-white">Lessons</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
              Manage Lessons
            </h1>
            <p className="text-gray-400">
              {mockCourse.totalLessons} lessons · {formatDuration(mockCourse.totalDuration)}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {selectedLessons.size > 0 && (
              <>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete ({selectedLessons.size})</span>
                </button>
                <button
                  onClick={() => setSelectedLessons(new Set())}
                  className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
                >
                  Cancel
                </button>
              </>
            )}

            {selectedLessons.size === 0 && (
              <>
                <button
                  onClick={() => setIsReorderMode(!isReorderMode)}
                  className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                    isReorderMode
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Move className="w-4 h-4" />
                  <span>{isReorderMode ? 'Done Reordering' : 'Reorder'}</span>
                </button>

                <Link
                  href={`/dashboard/courses/${courseId}/lessons/new`}
                  className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Lesson</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sections and Lessons */}
      <div className="space-y-6">
        {sections.map((section) => {
          const isExpanded = expandedSections.includes(section.id)
          const stats = getSectionStats(section)

          return (
            <div
              key={section.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden"
            >
              {/* Section Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>

                    {isReorderMode && (
                      <GripVertical className="w-5 h-5 text-gray-500 cursor-move" />
                    )}

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {section.title}
                      </h3>
                      <p className="text-sm text-gray-400">{section.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4" />
                      <span>{stats.totalLessons} lessons</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>{stats.publishedLessons} published</span>
                    </div>
                    {stats.totalDuration > 0 && (
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{formatDuration(stats.totalDuration)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Lessons List */}
              {isExpanded && (
                <div className="divide-y divide-gray-700">
                  {section.lessons.length === 0 ? (
                    <div className="p-12 text-center">
                      <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                      <p className="text-gray-400 mb-4">No lessons in this section yet</p>
                      <Link
                        href={`/dashboard/courses/${courseId}/lessons/new?section=${section.id}`}
                        className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add First Lesson</span>
                      </Link>
                    </div>
                  ) : (
                    section.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className={`p-4 hover:bg-gray-800/50 transition-colors ${
                          selectedLessons.has(lesson.id) ? 'bg-purple-500/5' : ''
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          {/* Selection Checkbox */}
                          {!isReorderMode && (
                            <input
                              type="checkbox"
                              checked={selectedLessons.has(lesson.id)}
                              onChange={() => toggleLessonSelection(lesson.id)}
                              className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                            />
                          )}

                          {/* Drag Handle */}
                          {isReorderMode && (
                            <GripVertical className="w-5 h-5 text-gray-500 cursor-move" />
                          )}

                          {/* Lesson Icon */}
                          <div className="text-purple-400">
                            {getLessonIcon(lesson.contentType)}
                          </div>

                          {/* Lesson Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-3 mb-1">
                              <h4 className="text-white font-medium">{lesson.title}</h4>

                              {/* Badges */}
                              {lesson.isPreview && (
                                <span className="px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                  Preview
                                </span>
                              )}
                              {lesson.isMandatory && (
                                <span className="px-2 py-0.5 rounded text-xs bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                  Mandatory
                                </span>
                              )}
                              {!lesson.isPublished && (
                                <span className="px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-400 border border-gray-600">
                                  Draft
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-4 text-sm text-gray-400">
                              <span className="capitalize">{lesson.contentType}</span>
                              {lesson.videoDuration && (
                                <>
                                  <span>·</span>
                                  <span>{lesson.videoDuration} min</span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          {!isReorderMode && selectedLessons.size === 0 && (
                            <div className="flex items-center space-x-2">
                              <Link
                                href={`/dashboard/courses/${courseId}/lessons/${lesson.id}/edit`}
                                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                                title="Edit lesson"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>

                              <button
                                onClick={() => handleDuplicateLesson(lesson.id)}
                                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
                                title="Duplicate lesson"
                              >
                                <Copy className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => handleDeleteLesson(lesson.id)}
                                className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                title="Delete lesson"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )
        })}

        {/* Add Section Button */}
        <button className="w-full p-6 rounded-lg border-2 border-dashed border-gray-700 hover:border-purple-500/50 hover:bg-gray-800/30 transition-all text-gray-400 hover:text-purple-400 flex items-center justify-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add New Section</span>
        </button>
      </div>
    </div>
  )
}
