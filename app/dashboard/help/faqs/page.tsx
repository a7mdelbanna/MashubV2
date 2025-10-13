'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Plus,
  Filter,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  Star,
  TrendingUp,
  MessageSquare,
  CheckCircle,
  X
} from 'lucide-react'
import { FAQ, FAQCategory } from '@/types/help'
import {
  getFAQCategoryColor,
  formatFAQCategory,
  calculateHelpfulPercentage,
  sortFAQsByPopularity,
  sortFAQsByRecent,
  sortFAQsByHelpfulRate
} from '@/lib/help-utils'

// Mock FAQs data
const mockFAQs: FAQ[] = [
  {
    id: 'faq-1',
    tenantId: 'tenant-1',
    question: 'How do I reset my password?',
    answer: 'To reset your password, click on "Forgot Password" on the login page. Enter your email address and we\'ll send you a password reset link. Click the link in the email and follow the instructions to create a new password. Make sure your new password is at least 8 characters long and includes a mix of letters, numbers, and special characters.',
    category: 'account',
    tags: ['password', 'login', 'security', 'account'],
    order: 1,
    isPublished: true,
    viewCount: 2345,
    helpfulCount: 421,
    notHelpfulCount: 23,
    createdAt: '2025-08-01',
    updatedAt: '2025-10-05'
  },
  {
    id: 'faq-2',
    tenantId: 'tenant-1',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, bank transfers, and for enterprise customers, we can arrange invoicing. All payments are processed securely through our PCI-compliant payment gateway. You can update your payment method at any time in your account settings under Billing & Payments.',
    category: 'billing',
    tags: ['payment', 'billing', 'credit card', 'invoice'],
    order: 1,
    isPublished: true,
    viewCount: 1823,
    helpfulCount: 312,
    notHelpfulCount: 18,
    createdAt: '2025-08-01',
    updatedAt: '2025-09-20'
  },
  {
    id: 'faq-3',
    tenantId: 'tenant-1',
    question: 'Can I upgrade or downgrade my plan?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time from Settings > Subscription. Upgrades take effect immediately and you\'ll be charged a prorated amount for the remainder of your billing cycle. Downgrades take effect at the end of your current billing period to ensure you don\'t lose access to features you\'ve already paid for.',
    category: 'billing',
    tags: ['subscription', 'upgrade', 'downgrade', 'plan'],
    order: 2,
    isPublished: true,
    viewCount: 1567,
    helpfulCount: 289,
    notHelpfulCount: 12,
    createdAt: '2025-08-01',
    updatedAt: '2025-10-01'
  },
  {
    id: 'faq-4',
    tenantId: 'tenant-1',
    question: 'How do I invite team members?',
    answer: 'To invite team members: 1) Go to Settings > Team Members, 2) Click "Invite Member", 3) Enter their email address, 4) Select their role (Admin, Manager, or Member), 5) Click "Send Invitation". They\'ll receive an email with instructions to join your workspace. You can manage team member permissions at any time from the same page.',
    category: 'account',
    tags: ['team', 'invite', 'collaboration', 'members'],
    order: 2,
    isPublished: true,
    viewCount: 1456,
    helpfulCount: 267,
    notHelpfulCount: 15,
    createdAt: '2025-08-01',
    updatedAt: '2025-09-15'
  },
  {
    id: 'faq-5',
    tenantId: 'tenant-1',
    question: 'Is my data secure?',
    answer: 'Absolutely! We take security very seriously. All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption. We perform regular security audits, maintain SOC 2 Type II compliance, and follow industry best practices. Your data is backed up daily to multiple geographic locations. We never share your data with third parties without your explicit consent.',
    category: 'technical',
    tags: ['security', 'privacy', 'encryption', 'data'],
    order: 1,
    isPublished: true,
    viewCount: 1389,
    helpfulCount: 298,
    notHelpfulCount: 8,
    createdAt: '2025-08-01',
    updatedAt: '2025-10-10'
  },
  {
    id: 'faq-6',
    tenantId: 'tenant-1',
    question: 'What are the system requirements?',
    answer: 'MasHub is a web-based application that works on any modern browser. We recommend: Chrome 90+, Firefox 88+, Safari 14+, or Edge 90+. A stable internet connection is required. For mobile access, we have native iOS (iOS 14+) and Android (Android 10+) apps available. The desktop experience works best on screens 1280x720 or larger.',
    category: 'technical',
    tags: ['requirements', 'browser', 'compatibility', 'mobile'],
    order: 2,
    isPublished: true,
    viewCount: 1234,
    helpfulCount: 245,
    notHelpfulCount: 19,
    createdAt: '2025-08-01',
    updatedAt: '2025-09-25'
  },
  {
    id: 'faq-7',
    tenantId: 'tenant-1',
    question: 'How do I integrate with Slack?',
    answer: 'To integrate with Slack: 1) Go to Settings > Integrations, 2) Find Slack and click "Connect", 3) Authorize MasHub to access your Slack workspace, 4) Select which notifications you want to receive in Slack, 5) Choose the channel where notifications should be posted. You can customize notification types, frequency, and channels at any time.',
    category: 'integrations',
    tags: ['slack', 'integration', 'notifications', 'setup'],
    order: 1,
    isPublished: true,
    viewCount: 1123,
    helpfulCount: 234,
    notHelpfulCount: 11,
    createdAt: '2025-08-02',
    updatedAt: '2025-10-08'
  },
  {
    id: 'faq-8',
    tenantId: 'tenant-1',
    question: 'Can I export my data?',
    answer: 'Yes! You can export your data at any time from Settings > Data Export. We support exports in CSV, JSON, and XML formats. You can export all your data or select specific modules. Large exports are prepared in the background and you\'ll receive an email with a download link when ready. Export files are available for 7 days.',
    category: 'features',
    tags: ['export', 'data', 'backup', 'download'],
    order: 1,
    isPublished: true,
    viewCount: 1089,
    helpfulCount: 221,
    notHelpfulCount: 14,
    createdAt: '2025-08-02',
    updatedAt: '2025-09-30'
  },
  {
    id: 'faq-9',
    tenantId: 'tenant-1',
    question: 'What is your refund policy?',
    answer: 'We offer a 30-day money-back guarantee for all new subscriptions. If you\'re not satisfied with MasHub within the first 30 days, contact our support team for a full refund. For annual plans, refunds are prorated after the first 30 days. If you cancel mid-cycle, you\'ll retain access until the end of your billing period.',
    category: 'billing',
    tags: ['refund', 'cancellation', 'money-back', 'policy'],
    order: 3,
    isPublished: true,
    viewCount: 987,
    helpfulCount: 198,
    notHelpfulCount: 22,
    createdAt: '2025-08-02',
    updatedAt: '2025-10-03'
  },
  {
    id: 'faq-10',
    tenantId: 'tenant-1',
    question: 'How do I set up two-factor authentication?',
    answer: 'To enable 2FA: 1) Go to Settings > Security, 2) Click "Enable Two-Factor Authentication", 3) Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.), 4) Enter the 6-digit code from your app, 5) Save your backup codes in a secure location. We strongly recommend enabling 2FA for enhanced account security.',
    category: 'account',
    tags: ['2fa', 'security', 'authentication', 'setup'],
    order: 3,
    isPublished: true,
    viewCount: 956,
    helpfulCount: 189,
    notHelpfulCount: 9,
    createdAt: '2025-08-03',
    updatedAt: '2025-10-07'
  },
  {
    id: 'faq-11',
    tenantId: 'tenant-1',
    question: 'What integrations are available?',
    answer: 'MasHub integrates with 50+ popular tools including: Slack, Microsoft Teams, Google Workspace, Zoom, Salesforce, QuickBooks, Stripe, PayPal, Zapier, and more. You can view all available integrations in Settings > Integrations. Enterprise customers can also request custom integrations. We\'re constantly adding new integrations based on customer feedback.',
    category: 'integrations',
    tags: ['integrations', 'api', 'apps', 'connections'],
    order: 2,
    isPublished: true,
    viewCount: 934,
    helpfulCount: 201,
    notHelpfulCount: 13,
    createdAt: '2025-08-03',
    updatedAt: '2025-09-28'
  },
  {
    id: 'faq-12',
    tenantId: 'tenant-1',
    question: 'How do I customize my dashboard?',
    answer: 'To customize your dashboard: 1) Click the "Edit Dashboard" button in the top right, 2) Drag and drop widgets to rearrange them, 3) Click the + icon to add new widgets, 4) Click the X on any widget to remove it, 5) Click "Save Layout" when done. Each user can have their own personalized dashboard layout. Changes are saved automatically.',
    category: 'features',
    tags: ['dashboard', 'customization', 'widgets', 'layout'],
    order: 2,
    isPublished: true,
    viewCount: 876,
    helpfulCount: 178,
    notHelpfulCount: 16,
    createdAt: '2025-08-04',
    updatedAt: '2025-10-02'
  },
  {
    id: 'faq-13',
    tenantId: 'tenant-1',
    question: 'Is there a mobile app?',
    answer: 'Yes! MasHub has native mobile apps for both iOS and Android. Download the app from the App Store or Google Play Store, sign in with your credentials, and access all your data on the go. The mobile apps support offline mode, push notifications, and biometric authentication. Most features are available, with some advanced features optimized for desktop use.',
    category: 'features',
    tags: ['mobile', 'app', 'ios', 'android'],
    order: 3,
    isPublished: true,
    viewCount: 845,
    helpfulCount: 167,
    notHelpfulCount: 11,
    createdAt: '2025-08-04',
    updatedAt: '2025-09-18'
  },
  {
    id: 'faq-14',
    tenantId: 'tenant-1',
    question: 'How does the free trial work?',
    answer: 'Our 14-day free trial gives you full access to all features with no credit card required. You can invite team members, import data, and explore everything MasHub has to offer. At the end of the trial, you can choose a plan that fits your needs. Your data is preserved if you decide to subscribe. If you need more time to evaluate, contact our sales team.',
    category: 'general',
    tags: ['trial', 'free', 'demo', 'evaluation'],
    order: 1,
    isPublished: true,
    viewCount: 823,
    helpfulCount: 176,
    notHelpfulCount: 8,
    createdAt: '2025-08-05',
    updatedAt: '2025-10-09'
  },
  {
    id: 'faq-15',
    tenantId: 'tenant-1',
    question: 'What support options are available?',
    answer: 'We offer multiple support channels: Email support (response within 24 hours), Live chat (available 9am-6pm EST), Phone support for Enterprise customers, Video tutorials and documentation, Community forum for peer help, and Dedicated account manager for Enterprise plans. Premium and Enterprise customers get priority support with faster response times.',
    category: 'general',
    tags: ['support', 'help', 'contact', 'assistance'],
    order: 2,
    isPublished: true,
    viewCount: 789,
    helpfulCount: 165,
    notHelpfulCount: 12,
    createdAt: '2025-08-05',
    updatedAt: '2025-09-22'
  },
  {
    id: 'faq-16',
    tenantId: 'tenant-1',
    question: 'Can I import data from another system?',
    answer: 'Yes! We support data import from most popular platforms including spreadsheets (CSV, Excel), project management tools (Asana, Trello, Jira), CRMs (Salesforce, HubSpot), and more. Go to Settings > Import Data to get started. Our import wizard will guide you through the process. For large datasets or complex migrations, our team can assist with the migration at no extra charge.',
    category: 'technical',
    tags: ['import', 'migration', 'data', 'transfer'],
    order: 3,
    isPublished: true,
    viewCount: 767,
    helpfulCount: 159,
    notHelpfulCount: 18,
    createdAt: '2025-08-06',
    updatedAt: '2025-10-04'
  },
  {
    id: 'faq-17',
    tenantId: 'tenant-1',
    question: 'What happens if I exceed my plan limits?',
    answer: 'If you approach your plan limits (users, storage, API calls), we\'ll send you email notifications. Once you reach the limit, you can either upgrade to a higher plan or purchase add-ons for additional capacity. We provide a 7-day grace period for storage overages. Your data is never deleted, but you may not be able to add new content until you upgrade or free up space.',
    category: 'billing',
    tags: ['limits', 'overage', 'capacity', 'upgrade'],
    order: 4,
    isPublished: true,
    viewCount: 734,
    helpfulCount: 148,
    notHelpfulCount: 21,
    createdAt: '2025-08-06',
    updatedAt: '2025-09-19'
  },
  {
    id: 'faq-18',
    tenantId: 'tenant-1',
    question: 'How do I use the API?',
    answer: 'To use the MasHub API: 1) Generate an API key in Settings > API, 2) Read our API documentation at docs.mashub.com/api, 3) Make requests using your preferred HTTP client, 4) Include your API key in the Authorization header. Our REST API supports all core operations. We also offer webhooks for real-time event notifications. Rate limits apply based on your plan.',
    category: 'integrations',
    tags: ['api', 'integration', 'development', 'webhooks'],
    order: 3,
    isPublished: true,
    viewCount: 712,
    helpfulCount: 142,
    notHelpfulCount: 15,
    createdAt: '2025-08-07',
    updatedAt: '2025-10-06'
  }
]

const categories: { value: FAQCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'general', label: 'General' },
  { value: 'account', label: 'Account & Settings' },
  { value: 'billing', label: 'Billing & Payments' },
  { value: 'technical', label: 'Technical' },
  { value: 'features', label: 'Features' },
  { value: 'integrations', label: 'Integrations' }
]

type SortOption = 'popular' | 'recent' | 'helpful'

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(mockFAQs)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<FAQCategory | 'all'>('all')
  const [sortBy, setSortBy] = useState<SortOption>('popular')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null)

  // Calculate stats
  const stats = {
    total: faqs.filter(f => f.isPublished).length,
    totalViews: faqs.reduce((sum, f) => sum + f.viewCount, 0),
    avgHelpfulRate: Math.round(
      faqs.reduce((sum, f) => sum + calculateHelpfulPercentage(f.helpfulCount, f.notHelpfulCount), 0) / faqs.length
    ),
    categories: Array.from(new Set(faqs.map(f => f.category))).length
  }

  // Filter and sort FAQs
  let filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = filterCategory === 'all' || faq.category === filterCategory
    const isPublished = faq.isPublished

    return matchesSearch && matchesCategory && isPublished
  })

  // Apply sorting
  if (sortBy === 'popular') {
    filteredFAQs = sortFAQsByPopularity(filteredFAQs)
  } else if (sortBy === 'recent') {
    filteredFAQs = sortFAQsByRecent(filteredFAQs)
  } else if (sortBy === 'helpful') {
    filteredFAQs = sortFAQsByHelpfulRate(filteredFAQs)
  }

  const toggleFAQ = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
  }

  const handleFeedback = (faqId: string, isHelpful: boolean) => {
    setFaqs(faqs.map(faq => {
      if (faq.id === faqId) {
        return {
          ...faq,
          helpfulCount: isHelpful ? faq.helpfulCount + 1 : faq.helpfulCount,
          notHelpfulCount: !isHelpful ? faq.notHelpfulCount + 1 : faq.notHelpfulCount
        }
      }
      return faq
    }))
  }

  const handleDelete = (faqId: string) => {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs(faqs.filter(f => f.id !== faqId))
    }
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Frequently Asked Questions</h1>
          <p className="text-gray-400">
            Browse and manage common questions and answers
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add FAQ
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-medium">Total FAQs</h3>
            <MessageSquare className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.total}</p>
          <p className="text-xs text-gray-500">Published questions</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-medium">Total Views</h3>
            <Eye className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.totalViews.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Across all FAQs</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-medium">Avg Helpful Rate</h3>
            <ThumbsUp className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.avgHelpfulRate}%</p>
          <p className="text-xs text-gray-500">User satisfaction</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-gray-400 text-sm font-medium">Categories</h3>
            <Filter className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.categories}</p>
          <p className="text-xs text-gray-500">Topic areas</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
        <div className="grid grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value as FAQCategory | 'all')}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="popular">Most Popular</option>
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
          </select>
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm text-gray-400">
          <span>Showing {filteredFAQs.length} of {stats.total} FAQs</span>
          {(searchQuery || filterCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setFilterCategory('all')
              }}
              className="text-purple-400 hover:text-purple-300"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-4">
        {filteredFAQs.length === 0 ? (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No FAQs found</h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || filterCategory !== 'all'
                ? 'Try adjusting your filters or search query'
                : 'Get started by adding your first FAQ'}
            </p>
            {!searchQuery && filterCategory === 'all' && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Add FAQ
              </button>
            )}
          </div>
        ) : (
          filteredFAQs.map((faq) => {
            const isExpanded = expandedFAQ === faq.id
            const helpfulPercentage = calculateHelpfulPercentage(faq.helpfulCount, faq.notHelpfulCount)

            return (
              <div
                key={faq.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden"
              >
                {/* Question Header */}
                <div
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-700/30 transition-colors"
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getFAQCategoryColor(faq.category)}`}>
                        {formatFAQCategory(faq.category)}
                      </span>
                      {helpfulPercentage >= 90 && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
                          <Star className="w-3 h-3 fill-current" />
                          Top Answer
                        </span>
                      )}
                      {faq.viewCount > 1000 && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs">
                          <TrendingUp className="w-3 h-3" />
                          Popular
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {faq.viewCount.toLocaleString()} views
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {helpfulPercentage}% helpful
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingFAQ(faq)
                        setShowAddModal(true)
                      }}
                      className="p-2 bg-gray-700 hover:bg-gray-600 text-gray-400 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(faq.id)
                      }}
                      className="p-2 bg-gray-700 hover:bg-red-600 text-gray-400 hover:text-white rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Answer Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-700">
                    <div className="pt-6 mb-6">
                      <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
                    </div>

                    {/* Tags */}
                    {faq.tags.length > 0 && (
                      <div className="flex items-center gap-2 mb-6 flex-wrap">
                        <span className="text-sm text-gray-500">Tags:</span>
                        {faq.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Feedback */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                      <div className="text-sm text-gray-400">
                        Was this answer helpful?
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleFeedback(faq.id, true)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          Yes ({faq.helpfulCount})
                        </button>
                        <button
                          onClick={() => handleFeedback(faq.id, false)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                          <ThumbsDown className="w-4 h-4" />
                          No ({faq.notHelpfulCount})
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Still Need Help */}
      <div className="mt-8 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/50 p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Still have questions?</h3>
        <p className="text-gray-400 mb-6">
          Can't find what you're looking for? Our support team is here to help.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            href="/dashboard/help/tickets/new"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Contact Support
          </Link>
          <Link
            href="/dashboard/help/articles"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Browse Articles
          </Link>
        </div>
      </div>

      {/* Add/Edit FAQ Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                {editingFAQ ? 'Edit FAQ' : 'Add New FAQ'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingFAQ(null)
                }}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Question *
                </label>
                <input
                  type="text"
                  placeholder="What would you like to know?"
                  defaultValue={editingFAQ?.question}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Answer *
                </label>
                <textarea
                  rows={6}
                  placeholder="Provide a detailed answer..."
                  defaultValue={editingFAQ?.answer}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Category *
                  </label>
                  <select
                    defaultValue={editingFAQ?.category || 'general'}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    {categories.filter(c => c.value !== 'all').map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Status
                  </label>
                  <select
                    defaultValue={editingFAQ?.isPublished ? 'published' : 'draft'}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="tag1, tag2, tag3"
                  defaultValue={editingFAQ?.tags.join(', ')}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
              <button
                onClick={() => {
                  setShowAddModal(false)
                  setEditingFAQ(null)
                }}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Here you would save the FAQ
                  setShowAddModal(false)
                  setEditingFAQ(null)
                }}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                {editingFAQ ? 'Update FAQ' : 'Create FAQ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
