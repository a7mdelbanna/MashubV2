'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, MoreVertical, Edit, Trash2, Share2, Download,
  Calendar, Clock, DollarSign, Users, Briefcase, CheckCircle2,
  AlertCircle, PlayCircle, PauseCircle, Star, MessageSquare,
  Paperclip, Plus, Filter, Search, ChevronDown, ChevronRight,
  FileText, Image, Code, Archive, ExternalLink, Activity,
  TrendingUp, AlertTriangle, Target, GitBranch, Bug, Zap
} from 'lucide-react'
import Link from 'next/link'

// Mock project data (in real app, fetch based on ID)
const projectData = {
  id: '1',
  name: 'E-Commerce Platform',
  description: 'Modern e-commerce platform with AI-powered recommendations, real-time inventory management, and advanced analytics dashboard',
  client: {
    id: 'c1',
    name: 'TechCorp Inc.',
    logo: 'TC',
    contact: 'John Smith',
    email: 'john@techcorp.com',
    phone: '+1 (555) 123-4567'
  },
  type: 'web_app',
  status: 'in_progress',
  priority: 'high',
  budget: 125000,
  spent: 78500,
  startDate: new Date('2024-01-15'),
  dueDate: new Date('2024-06-30'),
  manager: {
    id: 'm1',
    name: 'Sarah Chen',
    avatar: 'SC',
    email: 'sarah@mashub.com'
  },
  team: [
    { id: 't1', name: 'Mike Johnson', role: 'Backend Dev', avatar: 'MJ', allocation: 100 },
    { id: 't2', name: 'Emma Davis', role: 'Frontend Dev', avatar: 'ED', allocation: 80 },
    { id: 't3', name: 'Alex Kim', role: 'UI/UX Designer', avatar: 'AK', allocation: 60 },
    { id: 't4', name: 'James Wilson', role: 'DevOps', avatar: 'JW', allocation: 40 }
  ],
  progress: 65,
  tasks: {
    total: 48,
    completed: 31,
    inProgress: 12,
    todo: 5
  },
  milestones: [
    { id: 'm1', name: 'Project Kickoff', date: new Date('2024-01-15'), status: 'completed' },
    { id: 'm2', name: 'Design Phase Complete', date: new Date('2024-02-28'), status: 'completed' },
    { id: 'm3', name: 'Backend API Ready', date: new Date('2024-03-31'), status: 'completed' },
    { id: 'm4', name: 'Frontend Implementation', date: new Date('2024-04-30'), status: 'in_progress' },
    { id: 'm5', name: 'Testing & QA', date: new Date('2024-05-31'), status: 'upcoming' },
    { id: 'm6', name: 'Production Launch', date: new Date('2024-06-30'), status: 'upcoming' }
  ],
  technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Redis', 'ElasticSearch'],
  repository: 'github.com/techcorp/ecommerce-platform',
  documents: [
    { id: 'd1', name: 'Project Proposal.pdf', type: 'pdf', size: '2.4 MB', date: new Date('2024-01-10') },
    { id: 'd2', name: 'Technical Specifications.docx', type: 'doc', size: '1.8 MB', date: new Date('2024-01-20') },
    { id: 'd3', name: 'UI Mockups.fig', type: 'design', size: '12.5 MB', date: new Date('2024-02-15') },
    { id: 'd4', name: 'Database Schema.sql', type: 'code', size: '245 KB', date: new Date('2024-03-01') }
  ]
}

// Task list
const tasks = [
  {
    id: 't1',
    title: 'Implement user authentication',
    status: 'completed',
    priority: 'high',
    assignee: { name: 'Mike Johnson', avatar: 'MJ' },
    dueDate: new Date('2024-02-15'),
    tags: ['backend', 'security']
  },
  {
    id: 't2',
    title: 'Design product catalog UI',
    status: 'completed',
    priority: 'high',
    assignee: { name: 'Alex Kim', avatar: 'AK' },
    dueDate: new Date('2024-02-20'),
    tags: ['design', 'frontend']
  },
  {
    id: 't3',
    title: 'Setup payment gateway integration',
    status: 'in_progress',
    priority: 'urgent',
    assignee: { name: 'Mike Johnson', avatar: 'MJ' },
    dueDate: new Date('2024-03-10'),
    tags: ['backend', 'payment']
  },
  {
    id: 't4',
    title: 'Implement shopping cart functionality',
    status: 'in_progress',
    priority: 'high',
    assignee: { name: 'Emma Davis', avatar: 'ED' },
    dueDate: new Date('2024-03-15'),
    tags: ['frontend', 'feature']
  },
  {
    id: 't5',
    title: 'Create admin dashboard',
    status: 'todo',
    priority: 'medium',
    assignee: { name: 'Emma Davis', avatar: 'ED' },
    dueDate: new Date('2024-03-20'),
    tags: ['frontend', 'admin']
  },
  {
    id: 't6',
    title: 'Setup CI/CD pipeline',
    status: 'todo',
    priority: 'medium',
    assignee: { name: 'James Wilson', avatar: 'JW' },
    dueDate: new Date('2024-03-25'),
    tags: ['devops', 'infrastructure']
  }
]

// Activity feed
const activities = [
  {
    id: 'a1',
    user: { name: 'Mike Johnson', avatar: 'MJ' },
    action: 'completed task',
    target: 'Implement user authentication',
    time: '2 hours ago',
    type: 'task'
  },
  {
    id: 'a2',
    user: { name: 'Sarah Chen', avatar: 'SC' },
    action: 'added comment on',
    target: 'Payment gateway integration',
    time: '4 hours ago',
    type: 'comment'
  },
  {
    id: 'a3',
    user: { name: 'Emma Davis', avatar: 'ED' },
    action: 'pushed code to',
    target: 'feature/shopping-cart',
    time: '6 hours ago',
    type: 'code'
  },
  {
    id: 'a4',
    user: { name: 'Alex Kim', avatar: 'AK' },
    action: 'uploaded',
    target: 'Updated mockups.fig',
    time: '1 day ago',
    type: 'file'
  },
  {
    id: 'a5',
    user: { name: 'James Wilson', avatar: 'JW' },
    action: 'deployed to',
    target: 'staging environment',
    time: '2 days ago',
    type: 'deployment'
  }
]

const statusConfig = {
  planning: { icon: AlertCircle, color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Planning' },
  in_progress: { icon: PlayCircle, color: 'text-purple-400', bg: 'bg-purple-400/10', label: 'In Progress' },
  review: { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Review' },
  completed: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10', label: 'Completed' },
  on_hold: { icon: PauseCircle, color: 'text-orange-400', bg: 'bg-orange-400/10', label: 'On Hold' }
}

const taskStatusConfig = {
  todo: { color: 'text-gray-400', bg: 'bg-gray-400/10', label: 'To Do' },
  in_progress: { color: 'text-purple-400', bg: 'bg-purple-400/10', label: 'In Progress' },
  completed: { color: 'text-green-400', bg: 'bg-green-400/10', label: 'Completed' }
}

const priorityConfig = {
  urgent: { color: 'text-red-400', bg: 'bg-red-400/10', label: 'Urgent' },
  high: { color: 'text-orange-400', bg: 'bg-orange-400/10', label: 'High' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Medium' },
  low: { color: 'text-gray-400', bg: 'bg-gray-400/10', label: 'Low' }
}

export default function ProjectDetailsPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState('overview')
  const [showAllTasks, setShowAllTasks] = useState(false)
  const [showAllActivities, setShowAllActivities] = useState(false)

  const project = projectData // In real app, fetch based on params.id
  const StatusIcon = statusConfig[project.status].icon
  const budgetPercentage = (project.spent / project.budget) * 100
  const daysLeft = Math.ceil((project.dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const isOverdue = daysLeft < 0

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle2, count: project.tasks.total },
    { id: 'team', label: 'Team', icon: Users, count: project.team.length },
    { id: 'files', label: 'Files', icon: Paperclip, count: project.documents.length },
    { id: 'activity', label: 'Activity', icon: Activity }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/projects">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-400" />
            </button>
          </Link>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{project.name}</h1>
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium",
                statusConfig[project.status].bg,
                statusConfig[project.status].color
              )}>
                <StatusIcon className="h-4 w-4" />
                {statusConfig[project.status].label}
              </div>
              {project.priority === 'urgent' && (
                <div className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4" />
                  Urgent Priority
                </div>
              )}
            </div>
            <p className="text-gray-400">{project.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Share2 className="h-5 w-5 text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Edit className="h-5 w-5 text-gray-400" />
          </button>
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className={cn(
              "text-lg font-bold",
              isOverdue ? "text-red-400" : "text-white"
            )}>
              {isOverdue ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`}
            </span>
          </div>
          <p className="text-sm text-gray-400">Due Date</p>
          <p className="text-sm text-white">
            {project.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="h-5 w-5 text-gray-400" />
            <span className="text-lg font-bold text-white">{project.progress}%</span>
          </div>
          <p className="text-sm text-gray-400">Progress</p>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden mt-2">
            <div className="h-full gradient-purple rounded-full" style={{ width: `${project.progress}%` }} />
          </div>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="h-5 w-5 text-gray-400" />
            <span className={cn(
              "text-lg font-bold",
              budgetPercentage > 90 ? "text-red-400" : "text-white"
            )}>
              {budgetPercentage.toFixed(0)}%
            </span>
          </div>
          <p className="text-sm text-gray-400">Budget Used</p>
          <p className="text-sm text-white">
            ${(project.spent / 1000).toFixed(0)}k / ${(project.budget / 1000).toFixed(0)}k
          </p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="h-5 w-5 text-gray-400" />
            <span className="text-lg font-bold text-white">
              {project.tasks.completed}/{project.tasks.total}
            </span>
          </div>
          <p className="text-sm text-gray-400">Tasks Completed</p>
          <p className="text-sm text-purple-400">{project.tasks.inProgress} in progress</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="h-5 w-5 text-gray-400" />
            <span className="text-lg font-bold text-white">{project.team.length}</span>
          </div>
          <p className="text-sm text-gray-400">Team Members</p>
          <div className="flex -space-x-2 mt-2">
            {project.team.slice(0, 4).map((member) => (
              <div
                key={member.id}
                className="w-6 h-6 rounded-full gradient-purple border-2 border-gray-900 flex items-center justify-center text-white text-xs font-medium"
              >
                {member.avatar}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <div className="flex items-center gap-6">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "pb-3 px-1 border-b-2 transition-all flex items-center gap-2",
                  activeTab === tab.id
                    ? "border-purple-500 text-white"
                    : "border-transparent text-gray-400 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {tab.count !== undefined && (
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-xs font-medium",
                    activeTab === tab.id
                      ? "bg-purple-600 text-white"
                      : "bg-gray-800 text-gray-400"
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Client Information */}
              <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Client Information</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl gradient-purple flex items-center justify-center text-white text-xl font-bold">
                    {project.client.logo}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{project.client.name}</h4>
                    <p className="text-gray-400 text-sm">{project.client.contact}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <span>{project.client.email}</span>
                      <span>{project.client.phone}</span>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                    <ExternalLink className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Milestones */}
              <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Milestones</h3>
                <div className="space-y-3">
                  {project.milestones.map((milestone) => (
                    <div key={milestone.id} className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        milestone.status === 'completed' ? "gradient-green" :
                        milestone.status === 'in_progress' ? "gradient-purple" :
                        "bg-gray-800"
                      )}>
                        {milestone.status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 text-white" />
                        ) : milestone.status === 'in_progress' ? (
                          <Clock className="h-5 w-5 text-white" />
                        ) : (
                          <Target className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={cn(
                          "font-medium",
                          milestone.status === 'completed' ? "text-gray-400 line-through" : "text-white"
                        )}>
                          {milestone.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {milestone.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Tasks */}
              <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Recent Tasks</h3>
                  <button
                    onClick={() => setActiveTab('tasks')}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    View All →
                  </button>
                </div>
                <div className="space-y-3">
                  {tasks.slice(0, showAllTasks ? undefined : 4).map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        task.status === 'completed' ? "bg-green-400" :
                        task.status === 'in_progress' ? "bg-purple-400" :
                        "bg-gray-400"
                      )} />
                      <div className="flex-1">
                        <p className={cn(
                          "text-sm",
                          task.status === 'completed' ? "text-gray-400 line-through" : "text-white"
                        )}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <div className="w-5 h-5 rounded-full gradient-purple flex items-center justify-center text-white text-xs">
                              {task.assignee.avatar}
                            </div>
                            <span className="text-xs text-gray-400">{task.assignee.name}</span>
                          </div>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded",
                            priorityConfig[task.priority].bg,
                            priorityConfig[task.priority].color
                          )}>
                            {priorityConfig[task.priority].label}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">
                        {task.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'tasks' && (
            <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">All Tasks</h3>
                <button className="px-4 py-2 rounded-lg gradient-purple text-white text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Task
                </button>
              </div>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all">
                    <input type="checkbox" checked={task.status === 'completed'} className="rounded" />
                    <div className="flex-1">
                      <p className={cn(
                        task.status === 'completed' ? "text-gray-400 line-through" : "text-white"
                      )}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <div className="w-6 h-6 rounded-full gradient-purple flex items-center justify-center text-white text-xs">
                            {task.assignee.avatar}
                          </div>
                          <span className="text-sm text-gray-400">{task.assignee.name}</span>
                        </div>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded",
                          taskStatusConfig[task.status].bg,
                          taskStatusConfig[task.status].color
                        )}>
                          {taskStatusConfig[task.status].label}
                        </span>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded",
                          priorityConfig[task.priority].bg,
                          priorityConfig[task.priority].color
                        )}>
                          {priorityConfig[task.priority].label}
                        </span>
                        {task.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-gray-400">
                      {task.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Team Members</h3>
                <button className="px-4 py-2 rounded-lg gradient-purple text-white text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Member
                </button>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-gray-800/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full gradient-purple flex items-center justify-center text-white font-medium">
                      {project.manager.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{project.manager.name}</p>
                      <p className="text-sm text-gray-400">Project Manager</p>
                    </div>
                    <span className="px-3 py-1 rounded-lg bg-purple-600/20 text-purple-400 text-sm">
                      Manager
                    </span>
                  </div>
                </div>
                {project.team.map((member) => (
                  <div key={member.id} className="p-4 bg-gray-800/30 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full gradient-purple flex items-center justify-center text-white font-medium">
                        {member.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{member.name}</p>
                        <p className="text-sm text-gray-400">{member.role}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white">{member.allocation}%</p>
                        <p className="text-xs text-gray-400">Allocation</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Project Files</h3>
                <button className="px-4 py-2 rounded-lg gradient-purple text-white text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Upload File
                </button>
              </div>
              <div className="space-y-3">
                {project.documents.map((doc) => {
                  const iconMap = {
                    pdf: FileText,
                    doc: FileText,
                    design: Image,
                    code: Code
                  }
                  const Icon = iconMap[doc.type] || FileText
                  return (
                    <div key={doc.id} className="flex items-center gap-3 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-all">
                      <div className="p-2 rounded-lg bg-gray-800">
                        <Icon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white">{doc.name}</p>
                        <p className="text-sm text-gray-400">
                          {doc.size} • {doc.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                        <Download className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Activity Feed</h3>
              <div className="space-y-4">
                {activities.map((activity) => {
                  const iconMap = {
                    task: CheckCircle2,
                    comment: MessageSquare,
                    code: GitBranch,
                    file: Paperclip,
                    deployment: Zap
                  }
                  const Icon = iconMap[activity.type] || Activity
                  return (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center text-white text-xs">
                        {activity.user.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-300">
                          <span className="text-white font-medium">{activity.user.name}</span>
                          {' '}{activity.action}{' '}
                          <span className="text-purple-400">{activity.target}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                      <Icon className="h-4 w-4 text-gray-400" />
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Manager */}
          <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">PROJECT MANAGER</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full gradient-purple flex items-center justify-center text-white font-medium">
                {project.manager.avatar}
              </div>
              <div>
                <p className="text-white font-medium">{project.manager.name}</p>
                <p className="text-sm text-gray-400">{project.manager.email}</p>
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">TECHNOLOGIES</h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="px-3 py-1 rounded-lg bg-gray-800 text-gray-300 text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Repository */}
          <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">REPOSITORY</h3>
            <a href={`https://${project.repository}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors">
              <GitBranch className="h-4 w-4" />
              <span className="text-sm">{project.repository}</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Quick Stats */}
          <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">QUICK STATS</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Project Duration</span>
                <span className="text-sm text-white">
                  {Math.ceil((project.dueDate.getTime() - project.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Hours Logged</span>
                <span className="text-sm text-white">1,248 hrs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Commits</span>
                <span className="text-sm text-white">342</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Issues Closed</span>
                <span className="text-sm text-white">87 / 92</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">RECENT ACTIVITY</h3>
            <div className="space-y-3">
              {activities.slice(0, 3).map((activity) => (
                <div key={activity.id} className="text-sm">
                  <p className="text-gray-300">
                    <span className="text-white font-medium">{activity.user.name}</span>
                    {' '}{activity.action}
                  </p>
                  <p className="text-purple-400 text-xs mt-1">{activity.target}</p>
                  <p className="text-gray-500 text-xs">{activity.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add missing import
import { LayoutDashboard } from 'lucide-react'