'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Mail,
  Plus,
  Search,
  Filter,
  Copy,
  Edit,
  Trash2,
  Eye,
  Send,
  Clock,
  CheckCircle2,
  Zap,
  FileText,
  Users,
  Calendar,
  Tag,
  MoreVertical,
  Play,
  Pause,
  TrendingUp
} from 'lucide-react'

// Email template types
type EmailTemplateCategory = 'application' | 'interview' | 'offer' | 'rejection' | 'follow_up' | 'general'

interface EmailTemplate {
  id: string
  name: string
  subject: string
  category: EmailTemplateCategory
  body: string
  variables: string[]
  isActive: boolean
  usageCount: number
  lastUsed?: string
  createdAt: string
  updatedAt: string
}

interface AutomationRule {
  id: string
  name: string
  trigger: string
  templateId: string
  templateName: string
  delay?: number
  isActive: boolean
  sentCount: number
  openRate: number
  createdAt: string
}

// Mock templates
const mockTemplates: EmailTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'Application Received',
    subject: 'Thank you for your application to {{position_title}}',
    category: 'application',
    body: `Hi {{candidate_name}},

Thank you for applying to the {{position_title}} position at {{company_name}}. We have received your application and our team will review it shortly.

We'll be in touch within 5-7 business days if we'd like to move forward with your application.

Best regards,
{{recruiter_name}}
{{company_name}} Recruiting Team`,
    variables: ['candidate_name', 'position_title', 'company_name', 'recruiter_name'],
    isActive: true,
    usageCount: 156,
    lastUsed: '2025-10-13T10:30:00Z',
    createdAt: '2025-08-01T09:00:00Z',
    updatedAt: '2025-09-15T14:20:00Z'
  },
  {
    id: 'tmpl-2',
    name: 'Interview Invitation',
    subject: 'Interview Invitation - {{position_title}} at {{company_name}}',
    category: 'interview',
    body: `Hi {{candidate_name}},

Great news! We'd like to invite you for an interview for the {{position_title}} position.

Interview Details:
- Date: {{interview_date}}
- Time: {{interview_time}}
- Duration: {{interview_duration}} minutes
- Type: {{interview_type}}
- Meeting Link: {{meeting_link}}

Please confirm your availability by replying to this email.

We look forward to speaking with you!

Best regards,
{{recruiter_name}}`,
    variables: ['candidate_name', 'position_title', 'company_name', 'interview_date', 'interview_time', 'interview_duration', 'interview_type', 'meeting_link', 'recruiter_name'],
    isActive: true,
    usageCount: 89,
    lastUsed: '2025-10-12T15:45:00Z',
    createdAt: '2025-08-01T09:00:00Z',
    updatedAt: '2025-09-20T11:10:00Z'
  },
  {
    id: 'tmpl-3',
    name: 'Job Offer',
    subject: 'Job Offer - {{position_title}} at {{company_name}}',
    category: 'offer',
    body: `Dear {{candidate_name}},

We are thrilled to extend an offer for the {{position_title}} position at {{company_name}}.

Offer Details:
- Position: {{position_title}}
- Start Date: {{start_date}}
- Salary: {{salary_range}}
- Benefits: {{benefits}}

Please find the detailed offer letter attached. We'd love to have you join our team!

To accept this offer, please reply to this email by {{offer_expiry_date}}.

Congratulations!

Best regards,
{{recruiter_name}}`,
    variables: ['candidate_name', 'position_title', 'company_name', 'start_date', 'salary_range', 'benefits', 'offer_expiry_date', 'recruiter_name'],
    isActive: true,
    usageCount: 24,
    lastUsed: '2025-10-10T09:20:00Z',
    createdAt: '2025-08-01T09:00:00Z',
    updatedAt: '2025-09-25T16:30:00Z'
  },
  {
    id: 'tmpl-4',
    name: 'Application Rejection',
    subject: 'Update on your application to {{company_name}}',
    category: 'rejection',
    body: `Hi {{candidate_name}},

Thank you for your interest in the {{position_title}} position at {{company_name}} and for taking the time to apply.

After careful consideration, we have decided to move forward with other candidates whose experience more closely aligns with our current needs.

We were impressed by your background and encourage you to apply for future opportunities that match your skills.

We wish you all the best in your job search.

Best regards,
{{recruiter_name}}
{{company_name}} Recruiting Team`,
    variables: ['candidate_name', 'position_title', 'company_name', 'recruiter_name'],
    isActive: true,
    usageCount: 67,
    lastUsed: '2025-10-11T14:00:00Z',
    createdAt: '2025-08-01T09:00:00Z',
    updatedAt: '2025-09-18T10:45:00Z'
  },
  {
    id: 'tmpl-5',
    name: 'Follow-up After Interview',
    subject: 'Thank you for interviewing with {{company_name}}',
    category: 'follow_up',
    body: `Hi {{candidate_name}},

Thank you for taking the time to interview for the {{position_title}} position. It was great getting to know you and learning more about your experience.

We're currently reviewing all candidates and will be in touch with next steps within {{response_timeframe}} days.

Feel free to reach out if you have any questions in the meantime.

Best regards,
{{recruiter_name}}`,
    variables: ['candidate_name', 'position_title', 'company_name', 'response_timeframe', 'recruiter_name'],
    isActive: true,
    usageCount: 45,
    lastUsed: '2025-10-12T16:30:00Z',
    createdAt: '2025-08-01T09:00:00Z',
    updatedAt: '2025-09-22T13:15:00Z'
  }
]

// Mock automation rules
const mockAutomations: AutomationRule[] = [
  {
    id: 'auto-1',
    name: 'Auto-confirm application',
    trigger: 'Candidate applies',
    templateId: 'tmpl-1',
    templateName: 'Application Received',
    delay: 0,
    isActive: true,
    sentCount: 156,
    openRate: 94,
    createdAt: '2025-08-01T09:00:00Z'
  },
  {
    id: 'auto-2',
    name: 'Interview reminder (24h before)',
    trigger: 'Interview scheduled',
    templateId: 'tmpl-2',
    templateName: 'Interview Invitation',
    delay: -24,
    isActive: true,
    sentCount: 89,
    openRate: 98,
    createdAt: '2025-08-01T09:00:00Z'
  },
  {
    id: 'auto-3',
    name: 'Follow-up after interview',
    trigger: 'Interview completed',
    templateId: 'tmpl-5',
    templateName: 'Follow-up After Interview',
    delay: 24,
    isActive: true,
    sentCount: 45,
    openRate: 91,
    createdAt: '2025-08-01T09:00:00Z'
  }
]

export default function EmailTemplatesPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'automation'>('templates')
  const [templates] = useState<EmailTemplate[]>(mockTemplates)
  const [automations] = useState<AutomationRule[]>(mockAutomations)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<EmailTemplateCategory | 'all'>('all')

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Stats
  const stats = {
    totalTemplates: templates.length,
    activeTemplates: templates.filter(t => t.isActive).length,
    totalSent: templates.reduce((sum, t) => sum + t.usageCount, 0),
    activeAutomations: automations.filter(a => a.isActive).length,
    avgOpenRate: Math.round(
      automations.reduce((sum, a) => sum + a.openRate, 0) / automations.length
    )
  }

  const getCategoryColor = (category: EmailTemplateCategory) => {
    const colors: Record<EmailTemplateCategory, string> = {
      application: 'bg-blue-500/20 text-blue-400',
      interview: 'bg-purple-500/20 text-purple-400',
      offer: 'bg-green-500/20 text-green-400',
      rejection: 'bg-red-500/20 text-red-400',
      follow_up: 'bg-yellow-500/20 text-yellow-400',
      general: 'bg-gray-500/20 text-gray-400'
    }
    return colors[category]
  }

  const formatCategory = (category: EmailTemplateCategory) => {
    return category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Email Templates & Automation</h1>
          <p className="text-gray-400">Manage candidate communication templates and automation rules</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <FileText className="w-4 h-4" />
            View Sent Emails
          </button>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            New Template
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Total Templates</div>
            <FileText className="w-5 h-5 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalTemplates}</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Active</div>
            <CheckCircle2 className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.activeTemplates}</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Total Sent</div>
            <Send className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalSent}</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Automations</div>
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.activeAutomations}</div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-400 text-sm">Avg Open Rate</div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="text-2xl font-bold text-white">{stats.avgOpenRate}%</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-1 mb-6 inline-flex">
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'templates'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4 inline-block mr-2" />
          Templates
        </button>
        <button
          onClick={() => setActiveTab('automation')}
          className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'automation'
              ? 'bg-purple-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Zap className="w-4 h-4 inline-block mr-2" />
          Automation Rules
        </button>
      </div>

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <>
          {/* Filters */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700 p-4 mb-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value as any)}
                className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Categories</option>
                <option value="application">Application</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejection">Rejection</option>
                <option value="follow_up">Follow-up</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-2 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                      {template.isActive && (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
                          Active
                        </span>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                      {formatCategory(template.category)}
                    </span>
                  </div>
                  <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-400 mb-1">Subject:</div>
                  <div className="text-white">{template.subject}</div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-medium text-gray-400 mb-2">Variables:</div>
                  <div className="flex flex-wrap gap-1">
                    {template.variables.map((variable) => (
                      <span
                        key={variable}
                        className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs font-mono"
                      >
                        {`{{${variable}}}`}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-900/50 rounded-lg">
                  <div>
                    <div className="text-xs text-gray-400 mb-1">Used</div>
                    <div className="text-lg font-bold text-white">{template.usageCount}</div>
                  </div>
                  <div className="border-l border-gray-700 pl-3">
                    <div className="text-xs text-gray-400 mb-1">Last Used</div>
                    <div className="text-sm text-white">
                      {template.lastUsed ? new Date(template.lastUsed).toLocaleDateString() : 'Never'}
                    </div>
                  </div>
                  <div className="border-l border-gray-700 pl-3">
                    <div className="text-xs text-gray-400 mb-1">Updated</div>
                    <div className="text-sm text-white">
                      {new Date(template.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors">
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Automation Tab */}
      {activeTab === 'automation' && (
        <>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-400">
              Automatically send emails based on candidate actions and events
            </p>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors">
              <Plus className="w-4 h-4" />
              New Automation Rule
            </button>
          </div>

          <div className="space-y-4">
            {automations.map((automation) => (
              <div
                key={automation.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:border-purple-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{automation.name}</h3>
                      {automation.isActive ? (
                        <span className="flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs font-medium">
                          <Pause className="w-3 h-3" />
                          Paused
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-6 mb-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Trigger</div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span className="text-white font-medium">{automation.trigger}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Template</div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-purple-400" />
                      <span className="text-white font-medium">{automation.templateName}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Delay</div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span className="text-white font-medium">
                        {automation.delay === 0 ? 'Immediate' : automation.delay! > 0 ? `+${automation.delay}h` : `${automation.delay}h`}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-1">Performance</div>
                    <div className="text-white font-medium">
                      {automation.sentCount} sent • {automation.openRate}% opened
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 transition-colors">
                    {automation.isActive ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Activate
                      </>
                    )}
                  </button>
                  <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center gap-2 transition-colors">
                    <FileText className="w-4 h-4" />
                    View Logs
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
