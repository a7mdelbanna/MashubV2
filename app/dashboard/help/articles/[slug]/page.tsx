'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  Printer,
  User,
  Calendar,
  Tag,
  FileText,
  ChevronRight,
  Search,
  MessageSquare
} from 'lucide-react'
import { Article } from '@/types/help'
import {
  getCategoryColor,
  getDifficultyColor,
  formatCategory,
  formatDifficulty,
  formatReadTime,
  calculateHelpfulPercentage
} from '@/lib/help-utils'

// Mock article data
const mockArticle: Article = {
  id: 'art-1',
  tenantId: 'tenant-1',
  title: 'Getting Started with MasHub: Complete Guide',
  slug: 'getting-started-mashub',
  content: `# Introduction

Welcome to MasHub! This comprehensive guide will help you get started with our platform and make the most of its powerful features.

## What is MasHub?

MasHub is a multi-tenant SaaS platform designed to help businesses manage projects, finances, recruitment, and more - all in one place. Our intuitive interface and powerful features make it easy to streamline your operations and boost productivity.

## Quick Start Steps

### Step 1: Create Your Account

1. Visit the MasHub homepage
2. Click on "Sign Up" in the top right corner
3. Enter your email address and create a strong password
4. Verify your email address through the confirmation link

### Step 2: Set Up Your Organization

Once you've created your account, you'll need to set up your organization:

1. Navigate to **Settings > Organization**
2. Enter your company name and details
3. Upload your company logo (optional)
4. Configure your timezone and language preferences
5. Click "Save Changes"

### Step 3: Invite Team Members

Collaboration is key to success. Here's how to invite your team:

1. Go to **Settings > Team Members**
2. Click the "Invite Member" button
3. Enter their email address
4. Assign a role (Admin, Manager, or Member)
5. Click "Send Invitation"

Your team members will receive an email with instructions to join your organization.

### Step 4: Explore Key Features

Now that your account is set up, let's explore the main features:

#### Projects Module
Manage your projects with our intuitive Kanban board, sprint planning tools, and roadmap visualization.

#### Finance Module
Track income, expenses, invoices, and budgets all in one place. Generate comprehensive financial reports with just a few clicks.

#### Candidates Module
Streamline your recruitment process with our applicant tracking system, interview scheduling, and candidate analytics.

#### Help Center
Access our knowledge base, submit support tickets, and get help whenever you need it.

## Tips for Success

Here are some pro tips to help you get the most out of MasHub:

1. **Customize Your Dashboard** - Arrange widgets to show the information most relevant to you
2. **Use Keyboard Shortcuts** - Press \`?\` to view available shortcuts
3. **Set Up Notifications** - Configure email and in-app notifications to stay informed
4. **Integrate Your Tools** - Connect MasHub with Slack, Google Workspace, and other tools
5. **Explore Templates** - Use our pre-built templates to save time on common tasks

## Getting Help

If you need assistance, we're here to help:

- **Knowledge Base**: Browse our comprehensive articles and guides
- **Support Tickets**: Submit a ticket for personalized support
- **Live Chat**: Chat with our support team in real-time
- **Video Tutorials**: Watch step-by-step video guides
- **Community Forum**: Connect with other users and share tips

## Next Steps

Now that you're familiar with the basics, here are some recommended next steps:

1. Complete your profile settings
2. Set up your first project
3. Invite your team members
4. Explore integrations
5. Check out our video tutorials

## Conclusion

Congratulations! You're now ready to start using MasHub effectively. Remember, we're always here to help if you have questions or need assistance.

Happy collaborating!`,
  excerpt: 'Learn how to set up your account, invite team members, and configure your workspace in just a few minutes.',
  category: 'getting_started',
  type: 'guide',
  difficulty: 'beginner',
  tags: ['onboarding', 'setup', 'quickstart', 'beginner'],
  keywords: ['setup', 'getting started', 'onboarding', 'account'],
  relatedArticles: ['art-2', 'art-3', 'art-5'],
  status: 'published',
  viewCount: 4523,
  helpfulCount: 421,
  notHelpfulCount: 23,
  averageReadTime: 8,
  authorId: 'user-1',
  authorName: 'Sarah Johnson',
  publishedAt: '2025-08-15',
  lastUpdatedAt: '2025-10-01',
  createdAt: '2025-08-15'
}

// Mock related articles
const relatedArticles = [
  {
    id: 'art-2',
    title: 'Managing Team Permissions',
    excerpt: 'Configure roles and permissions for your team members.',
    slug: 'managing-team-permissions',
    category: 'features' as const,
    readTime: 7
  },
  {
    id: 'art-3',
    title: 'Integrating with Slack',
    excerpt: 'Connect your Slack workspace for real-time notifications.',
    slug: 'slack-integration',
    category: 'integrations' as const,
    readTime: 10
  },
  {
    id: 'art-5',
    title: 'API Authentication Guide',
    excerpt: 'Learn how to authenticate API requests using tokens.',
    slug: 'api-authentication',
    category: 'api' as const,
    readTime: 15
  }
]

export default function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const [article] = useState<Article>(mockArticle)
  const [helpful, setHelpful] = useState<boolean | null>(null)
  const [bookmarked, setBookmarked] = useState(false)

  const helpfulPercentage = calculateHelpfulPercentage(article.helpfulCount, article.notHelpfulCount)

  const handleFeedback = (isHelpful: boolean) => {
    setHelpful(isHelpful)
    // Here you would send feedback to the backend
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Back Navigation */}
      <Link
        href="/dashboard/help/articles"
        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Articles
      </Link>

      <div className="grid grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="col-span-3">
          {/* Article Header */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-8 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
                {formatCategory(article.category)}
              </span>
              {article.difficulty && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(article.difficulty)}`}>
                  {formatDifficulty(article.difficulty)}
                </span>
              )}
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">{article.title}</h1>
            <p className="text-xl text-gray-400 mb-6">{article.excerpt}</p>

            <div className="flex items-center justify-between py-4 border-t border-b border-gray-700">
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {article.authorName}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(article.publishedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {formatReadTime(article.averageReadTime)}
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {article.viewCount.toLocaleString()} views
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setBookmarked(!bookmarked)}
                  className={`p-2 rounded-lg transition-colors ${
                    bookmarked
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-400'
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                </button>
                <button className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-400 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-400 rounded-lg transition-colors">
                  <Printer className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Article Content */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-8 mb-6">
            <div className="prose prose-invert max-w-none">
              <div className="text-gray-300 leading-relaxed space-y-6 whitespace-pre-wrap">
                {article.content}
              </div>
            </div>

            {/* Tags */}
            <div className="flex items-center gap-2 mt-8 pt-6 border-t border-gray-700">
              <Tag className="w-4 h-4 text-gray-500" />
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/dashboard/help/articles?tag=${tag}`}
                  className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-full text-sm transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Was this helpful? */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-8 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Was this article helpful?</h3>
            {helpful === null ? (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleFeedback(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <ThumbsUp className="w-5 h-5" />
                  Yes, this helped
                </button>
                <button
                  onClick={() => handleFeedback(false)}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  <ThumbsDown className="w-5 h-5" />
                  No, I need more help
                </button>
              </div>
            ) : (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <p className="text-green-400">
                  {helpful
                    ? 'Thanks for your feedback! Glad we could help.'
                    : 'Sorry this didn\'t help. Please contact support for more assistance.'}
                </p>
              </div>
            )}
            <div className="mt-4 text-sm text-gray-400">
              {helpfulPercentage}% of readers found this article helpful ({article.helpfulCount} votes)
            </div>
          </div>

          {/* Related Articles */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-8">
            <h3 className="text-lg font-semibold text-white mb-4">Related Articles</h3>
            <div className="space-y-4">
              {relatedArticles.map((related) => (
                <Link
                  key={related.id}
                  href={`/dashboard/help/articles/${related.slug}`}
                  className="flex items-start gap-4 p-4 bg-gray-900/50 rounded-lg hover:bg-gray-700/50 transition-colors group"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors">
                      {related.title}
                    </h4>
                    <p className="text-sm text-gray-400 mb-2">{related.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className={`px-2 py-1 rounded-full ${getCategoryColor(related.category)}`}>
                        {formatCategory(related.category)}
                      </span>
                      <span>{related.readTime} min read</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Table of Contents */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-white mb-4">On this page</h3>
            <div className="space-y-2 text-sm">
              <a href="#introduction" className="block text-gray-400 hover:text-white transition-colors">
                Introduction
              </a>
              <a href="#what-is-mashub" className="block text-gray-400 hover:text-white transition-colors pl-3">
                What is MasHub?
              </a>
              <a href="#quick-start" className="block text-gray-400 hover:text-white transition-colors">
                Quick Start Steps
              </a>
              <a href="#step-1" className="block text-gray-400 hover:text-white transition-colors pl-3">
                Step 1: Create Account
              </a>
              <a href="#step-2" className="block text-gray-400 hover:text-white transition-colors pl-3">
                Step 2: Set Up Organization
              </a>
              <a href="#step-3" className="block text-gray-400 hover:text-white transition-colors pl-3">
                Step 3: Invite Team
              </a>
              <a href="#step-4" className="block text-gray-400 hover:text-white transition-colors pl-3">
                Step 4: Explore Features
              </a>
              <a href="#tips" className="block text-gray-400 hover:text-white transition-colors">
                Tips for Success
              </a>
              <a href="#help" className="block text-gray-400 hover:text-white transition-colors">
                Getting Help
              </a>
              <a href="#next-steps" className="block text-gray-400 hover:text-white transition-colors">
                Next Steps
              </a>
            </div>
          </div>

          {/* Need More Help? */}
          <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-2">Need More Help?</h3>
            <p className="text-sm text-gray-400 mb-4">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="space-y-2">
              <Link
                href="/dashboard/help/tickets/new"
                className="block w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-center transition-colors"
              >
                Contact Support
              </Link>
              <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Start Live Chat
              </button>
            </div>
          </div>

          {/* Article Stats */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Article Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Views</span>
                <span className="text-white font-medium">{article.viewCount.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Helpful Rate</span>
                <span className="text-green-400 font-medium">{helpfulPercentage}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Last Updated</span>
                <span className="text-white font-medium">
                  {new Date(article.lastUpdatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
