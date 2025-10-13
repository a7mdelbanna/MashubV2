'use client'

import { useState } from 'react'
import {
  Mail,
  Plus,
  Search,
  Send,
  Eye,
  Edit2,
  Trash2,
  Copy,
  X,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  MoreVertical,
  Zap,
  Calendar
} from 'lucide-react'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  body: string
  category: 'onboarding' | 'follow_up' | 'proposal' | 'renewal' | 'support' | 'marketing'
  variables: string[]
  usageCount: number
  lastUsed?: string
  openRate?: number
  replyRate?: number
  createdAt: string
}

const mockTemplates: EmailTemplate[] = [
  {
    id: 'et-1',
    name: 'Welcome New Client',
    subject: 'Welcome to {{company_name}}!',
    body: `Hi {{client_name}},

Welcome to {{company_name}}! We're thrilled to have you on board.

I'm {{sender_name}}, your dedicated account manager. I wanted to reach out personally to ensure you have everything you need to get started.

Here's what to expect in the coming days:
• Onboarding session scheduled for {{onboarding_date}}
• Access to your personalized dashboard
• 24/7 support from our team

If you have any questions or need assistance, don't hesitate to reach out. I'm here to help!

Looking forward to working with you,
{{sender_name}}
{{sender_title}}
{{company_name}}`,
    category: 'onboarding',
    variables: ['client_name', 'company_name', 'sender_name', 'sender_title', 'onboarding_date'],
    usageCount: 142,
    lastUsed: '2024-03-01',
    openRate: 94.2,
    replyRate: 38.5,
    createdAt: '2024-01-15'
  },
  {
    id: 'et-2',
    name: 'Quarterly Business Review Invitation',
    subject: 'Let\'s review your Q{{quarter}} success',
    body: `Hi {{client_name}},

As we wrap up Q{{quarter}}, I'd like to schedule our quarterly business review to discuss:

📊 Performance metrics and key achievements
🎯 Progress towards your goals
💡 New opportunities for growth
🚀 Upcoming features and roadmap

I've prepared a comprehensive report showing {{key_metric}} improvement and other exciting results.

When works best for you? I have availability:
• {{date_option_1}} at {{time_option_1}}
• {{date_option_2}} at {{time_option_2}}
• {{date_option_3}} at {{time_option_3}}

Looking forward to celebrating your success!

Best regards,
{{sender_name}}`,
    category: 'follow_up',
    variables: ['client_name', 'quarter', 'key_metric', 'date_option_1', 'time_option_1', 'date_option_2', 'time_option_2', 'date_option_3', 'time_option_3', 'sender_name'],
    usageCount: 89,
    lastUsed: '2024-02-28',
    openRate: 87.6,
    replyRate: 52.3,
    createdAt: '2024-01-20'
  },
  {
    id: 'et-3',
    name: 'Proposal Follow-up',
    subject: 'Following up on your {{project_name}} proposal',
    body: `Hi {{client_name}},

I wanted to follow up on the proposal we sent for {{project_name}} on {{proposal_date}}.

As a quick recap, our solution would:
✓ {{benefit_1}}
✓ {{benefit_2}}
✓ {{benefit_3}}

Total Investment: {{proposal_amount}}
Timeline: {{estimated_timeline}}
ROI: {{estimated_roi}}

Do you have any questions or concerns I can address? I'm happy to jump on a quick call to discuss any aspect of the proposal.

Would {{suggested_date}} work for a brief conversation?

Thanks,
{{sender_name}}`,
    category: 'proposal',
    variables: ['client_name', 'project_name', 'proposal_date', 'benefit_1', 'benefit_2', 'benefit_3', 'proposal_amount', 'estimated_timeline', 'estimated_roi', 'suggested_date', 'sender_name'],
    usageCount: 156,
    lastUsed: '2024-03-02',
    openRate: 92.1,
    replyRate: 45.8,
    createdAt: '2024-01-10'
  },
  {
    id: 'et-4',
    name: 'Contract Renewal Reminder',
    subject: 'Your {{company_name}} subscription renews in {{days_until_renewal}} days',
    body: `Hi {{client_name}},

Your {{plan_name}} subscription with {{company_name}} is set to renew on {{renewal_date}}.

During your time with us:
📈 You've achieved {{achievement_1}}
⚡ You've used {{feature_count}} features
🎯 You've completed {{project_count}} projects

For your renewal, I wanted to share some exciting updates:
• {{new_feature_1}}
• {{new_feature_2}}
• {{new_feature_3}}

Your current plan: {{plan_name}} - {{current_amount}}/{{billing_cycle}}

Interested in upgrading? We have special renewal offers available!

Let me know if you'd like to discuss your renewal or explore upgrade options.

Best,
{{sender_name}}`,
    category: 'renewal',
    variables: ['client_name', 'company_name', 'days_until_renewal', 'plan_name', 'renewal_date', 'achievement_1', 'feature_count', 'project_count', 'new_feature_1', 'new_feature_2', 'new_feature_3', 'current_amount', 'billing_cycle', 'sender_name'],
    usageCount: 67,
    lastUsed: '2024-02-25',
    openRate: 96.4,
    replyRate: 41.2,
    createdAt: '2024-01-25'
  },
  {
    id: 'et-5',
    name: 'Support Ticket Resolution',
    subject: 'Your support ticket #{{ticket_number}} has been resolved',
    body: `Hi {{client_name}},

Great news! We've resolved your support ticket #{{ticket_number}}.

Issue: {{issue_description}}
Resolution: {{resolution_description}}
Resolved by: {{support_agent}}
Resolution time: {{resolution_time}}

We've implemented {{fix_description}} to prevent this from happening again.

Can you confirm everything is working as expected? Simply reply to this email or reopen the ticket if you need any further assistance.

We appreciate your patience and value your feedback!

Best regards,
{{support_agent}}
Support Team`,
    category: 'support',
    variables: ['client_name', 'ticket_number', 'issue_description', 'resolution_description', 'support_agent', 'resolution_time', 'fix_description'],
    usageCount: 234,
    lastUsed: '2024-03-02',
    openRate: 98.5,
    replyRate: 24.3,
    createdAt: '2024-01-05'
  },
  {
    id: 'et-6',
    name: 'Feature Announcement',
    subject: '🚀 New Feature: {{feature_name}} is here!',
    body: `Hi {{client_name}},

Exciting news! We just launched {{feature_name}}, and you're going to love it.

What is it?
{{feature_description}}

Why you'll love it:
• {{benefit_1}}
• {{benefit_2}}
• {{benefit_3}}

How to get started:
1. {{step_1}}
2. {{step_2}}
3. {{step_3}}

{{feature_name}} is available now in your {{company_name}} dashboard!

Watch our quick tutorial: {{tutorial_link}}

Questions? Our team is here to help!

Cheers,
{{sender_name}}
Product Team`,
    category: 'marketing',
    variables: ['client_name', 'feature_name', 'feature_description', 'benefit_1', 'benefit_2', 'benefit_3', 'step_1', 'step_2', 'step_3', 'company_name', 'tutorial_link', 'sender_name'],
    usageCount: 312,
    lastUsed: '2024-02-29',
    openRate: 85.3,
    replyRate: 15.7,
    createdAt: '2024-02-01'
  }
]

export default function ClientEmailsPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)

  // Calculate stats
  const stats = {
    totalTemplates: templates.length,
    totalSent: templates.reduce((sum, t) => sum + t.usageCount, 0),
    avgOpenRate: templates.reduce((sum, t) => sum + (t.openRate || 0), 0) / templates.length,
    avgReplyRate: templates.reduce((sum, t) => sum + (t.replyRate || 0), 0) / templates.length
  }

  // Filter templates
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.body.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = filterCategory === 'all' || template.category === filterCategory

    return matchesSearch && matchesCategory
  })

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      onboarding: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      follow_up: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      proposal: 'bg-green-500/20 text-green-400 border-green-500/30',
      renewal: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      support: 'bg-red-500/20 text-red-400 border-red-500/30',
      marketing: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
    }
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  const formatCategory = (category: string) => {
    return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Email Templates</h1>
          <p className="text-gray-400">
            Manage and customize your client communication templates
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          New Template
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Mail className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.totalTemplates}</p>
          <p className="text-sm text-gray-400">Total Templates</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Send className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.totalSent.toLocaleString()}</p>
          <p className="text-sm text-gray-400">Emails Sent</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Eye className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.avgOpenRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-400">Avg Open Rate</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.avgReplyRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-400">Avg Reply Rate</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Categories</option>
            <option value="onboarding">Onboarding</option>
            <option value="follow_up">Follow Up</option>
            <option value="proposal">Proposal</option>
            <option value="renewal">Renewal</option>
            <option value="support">Support</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:bg-gray-700/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(template.category)}`}>
                    {formatCategory(template.category)}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mb-2">
                  <strong>Subject:</strong> {template.subject}
                </p>
              </div>
              <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Preview */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 mb-4 max-h-32 overflow-y-auto">
              <p className="text-sm text-gray-400 whitespace-pre-wrap line-clamp-4">
                {template.body}
              </p>
            </div>

            {/* Variables */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Variables ({template.variables.length}):</p>
              <div className="flex flex-wrap gap-1">
                {template.variables.slice(0, 6).map((variable) => (
                  <span
                    key={variable}
                    className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-mono"
                  >
                    {`{{${variable}}}`}
                  </span>
                ))}
                {template.variables.length > 6 && (
                  <span className="px-2 py-1 bg-gray-700 text-gray-400 rounded text-xs">
                    +{template.variables.length - 6} more
                  </span>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Used</p>
                <p className="text-sm font-medium text-white">{template.usageCount}</p>
              </div>
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Open Rate</p>
                <p className="text-sm font-medium text-green-400">{template.openRate?.toFixed(1)}%</p>
              </div>
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Reply Rate</p>
                <p className="text-sm font-medium text-purple-400">{template.replyRate?.toFixed(1)}%</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedTemplate(template)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
                Use Template
              </button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                <Copy className="w-4 h-4" />
              </button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-red-600 text-white rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {template.lastUsed && (
              <p className="text-xs text-gray-500 mt-3">
                Last used {new Date(template.lastUsed).toLocaleDateString()}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-12 text-center">
          <Mail className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No templates found</h3>
          <p className="text-gray-400 mb-6">
            {searchQuery || filterCategory !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by creating your first email template'}
          </p>
          {!searchQuery && filterCategory === 'all' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Create Template
            </button>
          )}
        </div>
      )}

      {/* Use Template Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Send Email: {selectedTemplate.name}</h2>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  To *
                </label>
                <input
                  type="email"
                  placeholder="client@example.com"
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  defaultValue={selectedTemplate.subject}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Message *
                </label>
                <textarea
                  rows={12}
                  defaultValue={selectedTemplate.body}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none font-mono text-sm"
                />
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-sm text-blue-400 mb-2">
                  💡 <strong>Available Variables:</strong>
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.variables.map((variable) => (
                    <code
                      key={variable}
                      className="px-2 py-1 bg-gray-900 text-purple-400 rounded text-xs"
                    >
                      {`{{${variable}}}`}
                    </code>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-700">
              <button
                onClick={() => setSelectedTemplate(null)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setSelectedTemplate(null)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
                Send Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
