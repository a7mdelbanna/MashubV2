'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  BookOpen,
  FileText,
  Video,
  Code,
  Layers,
  Star,
  ArrowRight,
  Calendar,
  User
} from 'lucide-react'
import { Article, ArticleCategory, DifficultyLevel, ContentType } from '@/types/help'
import {
  getCategoryColor,
  getDifficultyColor,
  formatCategory,
  formatDifficulty,
  formatContentType,
  formatReadTime,
  calculateHelpfulPercentage,
  sortArticlesByPopularity,
  sortArticlesByRecent,
  sortArticlesByHelpful
} from '@/lib/help-utils'

// Mock articles data
const mockArticles: Article[] = [
  {
    id: 'art-1',
    tenantId: 'tenant-1',
    title: 'Getting Started with MasHub',
    slug: 'getting-started-mashub',
    content: 'Complete guide to setting up your account and getting started...',
    excerpt: 'Learn how to set up your account, invite team members, and configure your workspace in just a few minutes.',
    category: 'getting_started',
    type: 'guide',
    difficulty: 'beginner',
    tags: ['onboarding', 'setup', 'quickstart'],
    keywords: ['setup', 'getting started', 'onboarding'],
    relatedArticles: [],
    status: 'published',
    viewCount: 4523,
    helpfulCount: 421,
    notHelpfulCount: 23,
    averageReadTime: 5,
    authorId: 'user-1',
    authorName: 'Sarah Johnson',
    publishedAt: '2025-08-15',
    lastUpdatedAt: '2025-10-01',
    createdAt: '2025-08-15'
  },
  {
    id: 'art-2',
    tenantId: 'tenant-1',
    title: 'Advanced Project Management Features',
    slug: 'advanced-project-management',
    content: 'Deep dive into project management capabilities...',
    excerpt: 'Explore advanced features like custom workflows, automation rules, and team collaboration tools.',
    category: 'features',
    type: 'article',
    difficulty: 'advanced',
    tags: ['projects', 'workflow', 'automation'],
    keywords: ['project management', 'workflow', 'automation'],
    relatedArticles: [],
    status: 'published',
    viewCount: 3215,
    helpfulCount: 298,
    notHelpfulCount: 15,
    averageReadTime: 12,
    authorId: 'user-2',
    authorName: 'Michael Chen',
    publishedAt: '2025-09-01',
    lastUpdatedAt: '2025-10-05',
    createdAt: '2025-09-01'
  },
  {
    id: 'art-3',
    tenantId: 'tenant-1',
    title: 'Integrating with Slack',
    slug: 'slack-integration-guide',
    content: 'Step-by-step guide to connecting Slack...',
    excerpt: 'Connect your Slack workspace to receive real-time notifications and updates from MasHub.',
    category: 'integrations',
    type: 'tutorial',
    difficulty: 'intermediate',
    tags: ['slack', 'integration', 'notifications'],
    keywords: ['slack', 'integration', 'notifications'],
    relatedArticles: [],
    status: 'published',
    viewCount: 2876,
    helpfulCount: 267,
    notHelpfulCount: 12,
    averageReadTime: 10,
    coverImage: 'https://example.com/slack.jpg',
    authorId: 'user-3',
    authorName: 'Emily Davis',
    publishedAt: '2025-09-10',
    lastUpdatedAt: '2025-10-08',
    createdAt: '2025-09-10'
  },
  {
    id: 'art-4',
    tenantId: 'tenant-1',
    title: 'Troubleshooting Login Issues',
    slug: 'troubleshooting-login',
    content: 'Common login problems and their solutions...',
    excerpt: 'Having trouble logging in? Here are the most common issues and how to fix them quickly.',
    category: 'troubleshooting',
    type: 'article',
    difficulty: 'beginner',
    tags: ['login', 'authentication', 'troubleshooting'],
    keywords: ['login', 'password', 'authentication'],
    relatedArticles: [],
    status: 'published',
    viewCount: 2543,
    helpfulCount: 189,
    notHelpfulCount: 31,
    averageReadTime: 4,
    authorId: 'user-4',
    authorName: 'David Wilson',
    publishedAt: '2025-09-15',
    lastUpdatedAt: '2025-10-10',
    createdAt: '2025-09-15'
  },
  {
    id: 'art-5',
    tenantId: 'tenant-1',
    title: 'API Authentication Guide',
    slug: 'api-authentication',
    content: 'Complete guide to API authentication methods...',
    excerpt: 'Learn how to authenticate API requests using API keys, OAuth, and JWT tokens.',
    category: 'api',
    type: 'tutorial',
    difficulty: 'advanced',
    tags: ['api', 'authentication', 'security'],
    keywords: ['api', 'authentication', 'oauth', 'jwt'],
    relatedArticles: [],
    status: 'published',
    viewCount: 1987,
    helpfulCount: 176,
    notHelpfulCount: 8,
    averageReadTime: 15,
    authorId: 'user-5',
    authorName: 'Lisa Anderson',
    publishedAt: '2025-09-20',
    lastUpdatedAt: '2025-10-09',
    createdAt: '2025-09-20'
  },
  {
    id: 'art-6',
    tenantId: 'tenant-1',
    title: 'Understanding Your Bill',
    slug: 'understanding-billing',
    content: 'Explanation of billing cycles and charges...',
    excerpt: 'Learn how billing works, what you are charged for, and how to manage your subscription.',
    category: 'billing',
    type: 'article',
    difficulty: 'beginner',
    tags: ['billing', 'subscription', 'payments'],
    keywords: ['billing', 'subscription', 'invoice'],
    relatedArticles: [],
    status: 'published',
    viewCount: 1654,
    helpfulCount: 142,
    notHelpfulCount: 18,
    averageReadTime: 6,
    authorId: 'user-1',
    authorName: 'Sarah Johnson',
    publishedAt: '2025-09-25',
    lastUpdatedAt: '2025-10-11',
    createdAt: '2025-09-25'
  },
  {
    id: 'art-7',
    tenantId: 'tenant-1',
    title: 'Mobile App Features',
    slug: 'mobile-app-features',
    content: 'Overview of mobile application capabilities...',
    excerpt: 'Discover all the features available in our iOS and Android mobile applications.',
    category: 'mobile',
    type: 'guide',
    difficulty: 'beginner',
    tags: ['mobile', 'ios', 'android'],
    keywords: ['mobile', 'app', 'ios', 'android'],
    relatedArticles: [],
    status: 'published',
    viewCount: 1432,
    helpfulCount: 128,
    notHelpfulCount: 9,
    averageReadTime: 8,
    coverImage: 'https://example.com/mobile.jpg',
    authorId: 'user-2',
    authorName: 'Michael Chen',
    publishedAt: '2025-09-28',
    lastUpdatedAt: '2025-10-12',
    createdAt: '2025-09-28'
  },
  {
    id: 'art-8',
    tenantId: 'tenant-1',
    title: 'Security Best Practices',
    slug: 'security-best-practices',
    content: 'Essential security recommendations...',
    excerpt: 'Keep your account secure with these essential security practices and recommendations.',
    category: 'security',
    type: 'article',
    difficulty: 'intermediate',
    tags: ['security', 'best-practices', '2fa'],
    keywords: ['security', '2fa', 'password'],
    relatedArticles: [],
    status: 'published',
    viewCount: 1276,
    helpfulCount: 115,
    notHelpfulCount: 5,
    averageReadTime: 9,
    authorId: 'user-3',
    authorName: 'Emily Davis',
    publishedAt: '2025-10-01',
    lastUpdatedAt: '2025-10-11',
    createdAt: '2025-10-01'
  }
]

type SortOption = 'popular' | 'recent' | 'helpful'

export default function ArticlesPage() {
  const [articles] = useState<Article[]>(mockArticles)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<ArticleCategory | 'all'>('all')
  const [filterDifficulty, setFilterDifficulty] = useState<DifficultyLevel | 'all'>('all')
  const [filterType, setFilterType] = useState<ContentType | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortOption>('popular')

  // Filter articles
  let filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = filterCategory === 'all' || article.category === filterCategory
    const matchesDifficulty = filterDifficulty === 'all' || article.difficulty === filterDifficulty
    const matchesType = filterType === 'all' || article.type === filterType

    return matchesSearch && matchesCategory && matchesDifficulty && matchesType
  })

  // Sort articles
  if (sortBy === 'popular') {
    filteredArticles = sortArticlesByPopularity(filteredArticles)
  } else if (sortBy === 'recent') {
    filteredArticles = sortArticlesByRecent(filteredArticles)
  } else if (sortBy === 'helpful') {
    filteredArticles = sortArticlesByHelpful(filteredArticles)
  }

  // Stats
  const stats = {
    total: articles.length,
    views: articles.reduce((sum, a) => sum + a.viewCount, 0),
    avgHelpful: Math.round(
      articles.reduce((sum, a) => sum + calculateHelpfulPercentage(a.helpfulCount, a.notHelpfulCount), 0) /
      articles.length
    )
  }

  const getContentTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'article': return <FileText className="w-4 h-4" />
      case 'video': return <Video className="w-4 h-4" />
      case 'tutorial': return <Code className="w-4 h-4" />
      case 'guide': return <BookOpen className="w-4 h-4" />
      case 'faq': return <Layers className="w-4 h-4" />
    }
  }

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Knowledge Base Articles</h1>
        <p className="text-gray-400">Browse our comprehensive library of guides and tutorials</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Total Articles</div>
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.total}</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Total Views</div>
            <Eye className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.views.toLocaleString()}</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Avg Helpful</div>
            <ThumbsUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.avgHelpful}%</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700 p-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="popular">Most Popular</option>
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as any)}
            className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Categories</option>
            <option value="getting_started">Getting Started</option>
            <option value="features">Features</option>
            <option value="integrations">Integrations</option>
            <option value="troubleshooting">Troubleshooting</option>
            <option value="billing">Billing</option>
            <option value="api">API</option>
            <option value="security">Security</option>
            <option value="mobile">Mobile</option>
          </select>

          {/* Difficulty Filter */}
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value as any)}
            className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="flex-1 px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Types</option>
            <option value="article">Articles</option>
            <option value="guide">Guides</option>
            <option value="tutorial">Tutorials</option>
            <option value="video">Videos</option>
            <option value="faq">FAQs</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-400 text-sm">
          Showing <span className="text-white font-medium">{filteredArticles.length}</span> of{' '}
          <span className="text-white font-medium">{articles.length}</span> articles
        </p>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-2 gap-6">
        {filteredArticles.map((article) => {
          const helpfulPercentage = calculateHelpfulPercentage(article.helpfulCount, article.notHelpfulCount)

          return (
            <Link
              key={article.id}
              href={`/dashboard/help/articles/${article.slug}`}
              className="group bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  {getContentTypeIcon(article.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">{article.excerpt}</p>

                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(article.category)}`}>
                      {formatCategory(article.category)}
                    </span>
                    {article.difficulty && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(article.difficulty)}`}>
                        {formatDifficulty(article.difficulty)}
                      </span>
                    )}
                    <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                      {formatContentType(article.type)}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {article.viewCount.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatReadTime(article.averageReadTime)}
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {helpfulPercentage}% helpful
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {article.authorName}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredArticles.length === 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No articles found</h3>
          <p className="text-gray-400 mb-6">Try adjusting your filters or search query</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setFilterCategory('all')
              setFilterDifficulty('all')
              setFilterType('all')
            }}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}
