'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  BookOpen,
  Rocket,
  Puzzle,
  AlertCircle,
  CreditCard,
  Code,
  Shield,
  Smartphone,
  MessageSquare,
  Headphones,
  TrendingUp,
  Clock,
  ThumbsUp,
  ArrowRight,
  HelpCircle,
  FileText,
  Video,
  Mail,
  ExternalLink
} from 'lucide-react'
import { Article, FAQ, ArticleCategory } from '@/types/help'
import {
  formatCategory,
  getCategoryColor,
  formatReadTime,
  calculateHelpfulPercentage
} from '@/lib/help-utils'

// Category configuration
const categories = [
  {
    id: 'getting_started' as ArticleCategory,
    name: 'Getting Started',
    description: 'Learn the basics and get up and running quickly',
    icon: Rocket,
    color: 'from-blue-500 to-cyan-500',
    articleCount: 12
  },
  {
    id: 'features' as ArticleCategory,
    name: 'Features',
    description: 'Explore all the powerful features we offer',
    icon: Puzzle,
    color: 'from-purple-500 to-pink-500',
    articleCount: 24
  },
  {
    id: 'integrations' as ArticleCategory,
    name: 'Integrations',
    description: 'Connect with your favorite tools and services',
    icon: Code,
    color: 'from-cyan-500 to-blue-500',
    articleCount: 18
  },
  {
    id: 'troubleshooting' as ArticleCategory,
    name: 'Troubleshooting',
    description: 'Find solutions to common issues',
    icon: AlertCircle,
    color: 'from-orange-500 to-red-500',
    articleCount: 15
  },
  {
    id: 'billing' as ArticleCategory,
    name: 'Billing',
    description: 'Manage your subscription and payments',
    icon: CreditCard,
    color: 'from-green-500 to-emerald-500',
    articleCount: 8
  },
  {
    id: 'api' as ArticleCategory,
    name: 'API Documentation',
    description: 'Integrate our API into your applications',
    icon: Code,
    color: 'from-pink-500 to-rose-500',
    articleCount: 32
  },
  {
    id: 'security' as ArticleCategory,
    name: 'Security',
    description: 'Keep your data safe and secure',
    icon: Shield,
    color: 'from-red-500 to-orange-500',
    articleCount: 10
  },
  {
    id: 'mobile' as ArticleCategory,
    name: 'Mobile Apps',
    description: 'Use our mobile apps on iOS and Android',
    icon: Smartphone,
    color: 'from-indigo-500 to-purple-500',
    articleCount: 14
  }
]

// Mock popular articles
const mockPopularArticles: Article[] = [
  {
    id: 'art-1',
    tenantId: 'tenant-1',
    title: 'How to Get Started with MasHub',
    slug: 'how-to-get-started',
    content: 'Complete guide to setting up your account...',
    excerpt: 'Learn how to set up your account, invite team members, and configure your workspace in minutes.',
    category: 'getting_started',
    type: 'guide',
    difficulty: 'beginner',
    tags: ['onboarding', 'setup', 'beginner'],
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
    title: 'Managing Team Permissions',
    slug: 'managing-team-permissions',
    content: 'Guide to configuring roles and permissions...',
    excerpt: 'Configure roles, permissions, and access controls for your team members.',
    category: 'features',
    type: 'article',
    difficulty: 'intermediate',
    tags: ['permissions', 'teams', 'security'],
    keywords: ['roles', 'permissions', 'access control'],
    relatedArticles: [],
    status: 'published',
    viewCount: 3215,
    helpfulCount: 298,
    notHelpfulCount: 15,
    averageReadTime: 7,
    authorId: 'user-1',
    authorName: 'Michael Chen',
    publishedAt: '2025-09-01',
    lastUpdatedAt: '2025-10-05',
    createdAt: '2025-09-01'
  },
  {
    id: 'art-3',
    tenantId: 'tenant-1',
    title: 'Integrating with Slack',
    slug: 'slack-integration',
    content: 'Step-by-step Slack integration guide...',
    excerpt: 'Connect your Slack workspace to receive notifications and updates automatically.',
    category: 'integrations',
    type: 'tutorial',
    difficulty: 'intermediate',
    tags: ['slack', 'integration', 'notifications'],
    keywords: ['slack', 'integration', 'connect'],
    relatedArticles: [],
    status: 'published',
    viewCount: 2876,
    helpfulCount: 267,
    notHelpfulCount: 12,
    averageReadTime: 10,
    authorId: 'user-1',
    authorName: 'Emily Davis',
    publishedAt: '2025-09-10',
    lastUpdatedAt: '2025-10-08',
    createdAt: '2025-09-10'
  },
  {
    id: 'art-4',
    tenantId: 'tenant-1',
    title: 'Troubleshooting Login Issues',
    slug: 'login-issues',
    content: 'Common login problems and solutions...',
    excerpt: 'Having trouble logging in? Here are the most common issues and how to fix them.',
    category: 'troubleshooting',
    type: 'article',
    difficulty: 'beginner',
    tags: ['login', 'troubleshooting', 'authentication'],
    keywords: ['login', 'authentication', 'password'],
    relatedArticles: [],
    status: 'published',
    viewCount: 2543,
    helpfulCount: 189,
    notHelpfulCount: 31,
    averageReadTime: 4,
    authorId: 'user-1',
    authorName: 'David Wilson',
    publishedAt: '2025-09-15',
    lastUpdatedAt: '2025-10-10',
    createdAt: '2025-09-15'
  }
]

// Mock FAQs
const mockFAQs: FAQ[] = [
  {
    id: 'faq-1',
    tenantId: 'tenant-1',
    question: 'How do I change my password?',
    answer: 'Go to Settings > Security > Change Password. Enter your current password and choose a new one.',
    category: 'getting_started',
    order: 1,
    isPopular: true,
    viewCount: 1523,
    helpfulCount: 142,
    notHelpfulCount: 8,
    relatedArticles: ['art-1'],
    createdAt: '2025-08-01',
    updatedAt: '2025-09-15'
  },
  {
    id: 'faq-2',
    tenantId: 'tenant-1',
    question: 'Can I invite unlimited team members?',
    answer: 'The number of team members depends on your plan. Free plans allow up to 5 members, while paid plans offer unlimited seats.',
    category: 'billing',
    order: 2,
    isPopular: true,
    viewCount: 1342,
    helpfulCount: 128,
    notHelpfulCount: 5,
    relatedArticles: ['art-2'],
    createdAt: '2025-08-01',
    updatedAt: '2025-09-20'
  },
  {
    id: 'faq-3',
    tenantId: 'tenant-1',
    question: 'Is my data encrypted?',
    answer: 'Yes! All data is encrypted at rest using AES-256 encryption and in transit using TLS 1.3.',
    category: 'security',
    order: 3,
    isPopular: true,
    viewCount: 987,
    helpfulCount: 95,
    notHelpfulCount: 3,
    relatedArticles: [],
    createdAt: '2025-08-01',
    updatedAt: '2025-09-25'
  },
  {
    id: 'faq-4',
    tenantId: 'tenant-1',
    question: 'How do I cancel my subscription?',
    answer: 'Go to Settings > Billing > Subscription and click "Cancel Subscription". You\'ll retain access until the end of your billing period.',
    category: 'billing',
    order: 4,
    isPopular: true,
    viewCount: 876,
    helpfulCount: 82,
    notHelpfulCount: 12,
    relatedArticles: [],
    createdAt: '2025-08-01',
    updatedAt: '2025-10-01'
  },
  {
    id: 'faq-5',
    tenantId: 'tenant-1',
    question: 'Do you offer a mobile app?',
    answer: 'Yes! We have native iOS and Android apps available on the App Store and Google Play.',
    category: 'mobile',
    order: 5,
    isPopular: true,
    viewCount: 754,
    helpfulCount: 71,
    notHelpfulCount: 4,
    relatedArticles: [],
    createdAt: '2025-08-01',
    updatedAt: '2025-10-05'
  },
  {
    id: 'faq-6',
    tenantId: 'tenant-1',
    question: 'What integrations do you support?',
    answer: 'We integrate with 100+ tools including Slack, Google Workspace, Microsoft Teams, GitHub, and more.',
    category: 'integrations',
    order: 6,
    isPopular: true,
    viewCount: 698,
    helpfulCount: 65,
    notHelpfulCount: 2,
    relatedArticles: ['art-3'],
    createdAt: '2025-08-01',
    updatedAt: '2025-10-08'
  }
]

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [popularArticles] = useState<Article[]>(mockPopularArticles)
  const [faqs] = useState<FAQ[]>(mockFAQs)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results page
      window.location.href = `/dashboard/help/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">How can we help you?</h1>
        <p className="text-xl text-gray-400 mb-8">
          Search our knowledge base or browse categories below
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search for articles, guides, and FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </form>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-12">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">133</div>
          <div className="text-sm text-gray-400">Articles</div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">45</div>
          <div className="text-sm text-gray-400">Video Tutorials</div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">28</div>
          <div className="text-sm text-gray-400">FAQs</div>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">24/7</div>
          <div className="text-sm text-gray-400">Support</div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6">Browse by Category</h2>
        <div className="grid grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link
                key={category.id}
                href={`/dashboard/help/category/${category.id}`}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:border-purple-500/50 transition-all hover:scale-105"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-400 mb-3">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{category.articleCount} articles</span>
                  <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Popular Articles */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Popular Articles</h2>
          <Link
            href="/dashboard/help/articles"
            className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 transition-colors"
          >
            View all articles
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {popularArticles.map((article) => {
            const helpfulPercentage = calculateHelpfulPercentage(article.helpfulCount, article.notHelpfulCount)

            return (
              <Link
                key={article.id}
                href={`/dashboard/help/article/${article.slug}`}
                className="group bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br ${
                    categories.find(c => c.id === article.category)?.color || 'from-gray-500 to-gray-600'
                  } flex items-center justify-center`}>
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className={`px-2 py-1 rounded-full ${getCategoryColor(article.category)}`}>
                        {formatCategory(article.category)}
                      </span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatReadTime(article.averageReadTime)}
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {article.viewCount.toLocaleString()} views
                      </div>
                      <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {helpfulPercentage}% helpful
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* FAQs */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          <Link
            href="/dashboard/help/faqs"
            className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 transition-colors"
          >
            View all FAQs
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 divide-y divide-gray-700">
          {faqs.map((faq) => (
            <div key={faq.id} className="p-6 hover:bg-gray-700/30 transition-colors">
              <div className="flex items-start gap-4">
                <HelpCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                  <p className="text-gray-400">{faq.answer}</p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span>{faq.viewCount.toLocaleString()} views</span>
                    <span>•</span>
                    <span>{calculateHelpfulPercentage(faq.helpfulCount, faq.notHelpfulCount)}% found this helpful</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/50 p-6">
          <div className="w-12 h-12 rounded-lg bg-purple-600 flex items-center justify-center mb-4">
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Submit a Ticket</h3>
          <p className="text-gray-400 mb-4">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Link
            href="/dashboard/help/tickets/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Create Ticket
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg border border-blue-500/50 p-6">
          <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center mb-4">
            <Video className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Video Tutorials</h3>
          <p className="text-gray-400 mb-4">
            Watch step-by-step video guides to master our platform.
          </p>
          <Link
            href="/dashboard/help/videos"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Watch Videos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-lg border border-green-500/50 p-6">
          <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center mb-4">
            <Headphones className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Live Chat</h3>
          <p className="text-gray-400 mb-4">
            Get instant help from our support team via live chat.
          </p>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
            Start Chat
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
