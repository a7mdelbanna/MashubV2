'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { MilestoneStatus, ProjectStatus, ProjectPriority, Project } from '@/types/projects'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, ArrowRight, FolderOpen, Users, Calendar,
  DollarSign, FileText, Plus, X, Check, Building2,
  User, Target, Briefcase, Clock, Settings, Star,
  CheckCircle2, Upload, AlertCircle, Globe, Shield
} from 'lucide-react'
import Link from 'next/link'
import Select from '@/components/ui/select'
import { projectStatusOptions, priorityOptions, currencyOptions } from '@/lib/select-options'
import { ChecklistAssignmentModal } from '@/components/projects/checklist-assignment-modal'
import { ChecklistTemplate, ChecklistItem, TeamMember } from '@/types'
import { Client } from '@/types/clients'
import { User as UserType } from '@/types'
import { ClientsService } from '@/lib/services/clients-service'
import { UserService } from '@/lib/services/user-service'
import { projectsService } from '@/lib/services/projects-service'
import toast from 'react-hot-toast'

interface ProjectFormData {
  // Project Details
  name: string
  description: string
  category: string
  type: string
  priority: string
  status: string
  tags: string[]

  // Client & Scope
  clientId: string
  clientContact: string
  scope: string
  objectives: string[]
  deliverables: string[]
  requirements: string[]

  // Team & Resources
  projectManager: string
  teamMembers: string[]
  requiredSkills: string[]
  externalResources: string[]

  // Timeline & Budget
  startDate: string
  endDate: string
  milestones: Array<{
    name: string
    date: string
    description: string
  }>
  budget: number
  currency: string
  hourlyRate: number
  estimatedHours: number

  // Checklist Templates
  selectedChecklistTemplates: string[]
  checklistAssignments: Record<string, { assignedTo: string; assignedType: 'user' | 'team' }>

  // Additional Settings
  visibility: string
  notifications: boolean
  autoBackup: boolean
  riskAssessment: string
}

export default function NewProjectPage() {
  const router = useRouter()
  const { user, tenant } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [showAssignmentModal, setShowAssignmentModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [users, setUsers] = useState<UserType[]>([])
  const [formData, setFormData] = useState<ProjectFormData>({
    // Project Details
    name: '',
    description: '',
    category: '',
    type: 'fixed-price',
    priority: 'medium',
    status: 'planning',
    tags: [],

    // Client & Scope
    clientId: '',
    clientContact: '',
    scope: '',
    objectives: [],
    deliverables: [],
    requirements: [],

    // Team & Resources
    projectManager: '',
    teamMembers: [],
    requiredSkills: [],
    externalResources: [],

    // Timeline & Budget
    startDate: '',
    endDate: '',
    milestones: [],
    budget: 0,
    currency: 'USD',
    hourlyRate: 150,
    estimatedHours: 0,

    // Checklist Templates
    selectedChecklistTemplates: [],
    checklistAssignments: {},

    // Additional Settings
    visibility: 'team',
    notifications: true,
    autoBackup: true,
    riskAssessment: 'low'
  })

  // Fetch clients and users on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!tenant?.id) return

      try {
        setLoading(true)
        const [clientsData, usersData] = await Promise.all([
          ClientsService.getClients(tenant.id),
          UserService.getUsers(tenant.id)
        ])
        setClients(clientsData)
        setUsers(usersData)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [tenant?.id])

  const steps = [
    { id: 1, name: 'Project Details', icon: FolderOpen },
    { id: 2, name: 'Client & Scope', icon: Target },
    { id: 3, name: 'Team & Resources', icon: Users },
    { id: 4, name: 'Timeline & Budget', icon: Calendar },
    { id: 5, name: 'Checklist Templates', icon: FileText },
    { id: 6, name: 'Review', icon: CheckCircle2 }
  ]

  // Mock data
  const categoryOptions = [
    { value: 'Web Development', label: 'Web Development' },
    { value: 'Mobile App', label: 'Mobile App' },
    { value: 'E-commerce', label: 'E-commerce' },
    { value: 'Custom Software', label: 'Custom Software' },
    { value: 'API Development', label: 'API Development' },
    { value: 'Database Design', label: 'Database Design' },
    { value: 'UI/UX Design', label: 'UI/UX Design' },
    { value: 'Consulting', label: 'Consulting' }
  ]

  const projectTypes = [
    { value: 'fixed-price', label: 'Fixed Price', description: 'Set price for entire project' },
    { value: 'hourly', label: 'Hourly Rate', description: 'Bill by hours worked' },
    { value: 'retainer', label: 'Retainer', description: 'Monthly retainer agreement' }
  ]

  const priorities = [
    { value: 'low', label: 'Low', color: 'gradient-blue' },
    { value: 'medium', label: 'Medium', color: 'gradient-yellow' },
    { value: 'high', label: 'High', color: 'gradient-orange' },
    { value: 'critical', label: 'Critical', color: 'gradient-pink' }
  ]

  // Convert clients to select options
  const clientOptions = clients.map(client => ({
    value: client.id,
    label: client.name
  }))

  // Convert users to team member options
  const projectManagerOptions = users
    .filter(u => u.role === 'admin' || u.role === 'manager')
    .map(user => ({
      value: user.id,
      label: `${user.name} - ${user.role}`
    }))

  const availableSkills = [
    'React', 'Node.js', 'Python', 'TypeScript', 'AWS', 'Docker',
    'MongoDB', 'PostgreSQL', 'GraphQL', 'REST API', 'UI/UX Design',
    'Mobile Development', 'DevOps', 'Testing', 'Security'
  ]

  const availableTags = [
    'High Priority', 'MVP', 'Phase 1', 'Critical', 'Research',
    'Prototype', 'Production', 'Maintenance', 'New Feature', 'Bug Fix'
  ]

  const riskLevels = [
    { value: 'low', label: 'Low Risk', description: 'Standard project with known requirements' },
    { value: 'medium', label: 'Medium Risk', description: 'Some unknowns or dependencies' },
    { value: 'high', label: 'High Risk', description: 'Complex project with many variables' }
  ]

  // Mock Checklist Templates with full items
  const mockChecklistTemplates: ChecklistTemplate[] = [
    {
      id: 'checklist-web-dev',
      name: 'Web Development Checklist',
      description: 'Complete checklist for web application projects',
      appTypes: ['website'],
      items: [
        { id: 'web-1', title: 'Setup development environment', description: 'Configure dev tools and environment', category: 'technical', required: true, order: 1, completed: false },
        { id: 'web-2', title: 'Configure version control', description: 'Set up Git repository and branching strategy', category: 'technical', required: true, order: 2, completed: false },
        { id: 'web-3', title: 'Design system setup', description: 'Create design tokens and component library', category: 'branding', required: false, order: 3, completed: false },
        { id: 'web-4', title: 'API integration testing', description: 'Test all API endpoints', category: 'qa', required: true, order: 4, completed: false },
        { id: 'web-5', title: 'Deployment pipeline', description: 'Configure CI/CD pipeline', category: 'deployment', required: true, order: 5, completed: false }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'checklist-mobile-app',
      name: 'Mobile App Checklist',
      description: 'Checklist for iOS and Android app development',
      appTypes: ['mobile_app'],
      items: [
        { id: 'mobile-1', title: 'App store accounts setup', description: 'Configure Apple and Google developer accounts', category: 'deployment', required: true, order: 1, completed: false },
        { id: 'mobile-2', title: 'Push notification setup', description: 'Configure FCM and APNs', category: 'technical', required: true, order: 2, completed: false },
        { id: 'mobile-3', title: 'App icons and splash screens', description: 'Create all required asset sizes', category: 'branding', required: true, order: 3, completed: false },
        { id: 'mobile-4', title: 'Privacy policy compliance', description: 'Ensure GDPR and privacy requirements', category: 'legal', required: true, order: 4, completed: false },
        { id: 'mobile-5', title: 'Beta testing', description: 'Conduct beta testing with TestFlight/Play Console', category: 'qa', required: true, order: 5, completed: false }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'checklist-api',
      name: 'API Development Checklist',
      description: 'Best practices for RESTful API development',
      appTypes: ['custom'],
      items: [
        { id: 'api-1', title: 'API documentation', description: 'Create OpenAPI/Swagger documentation', category: 'documentation', required: true, order: 1, completed: false },
        { id: 'api-2', title: 'Authentication implementation', description: 'Implement JWT/OAuth authentication', category: 'technical', required: true, order: 2, completed: false },
        { id: 'api-3', title: 'Rate limiting', description: 'Configure rate limiting and throttling', category: 'technical', required: true, order: 3, completed: false },
        { id: 'api-4', title: 'API security audit', description: 'Review security best practices', category: 'qa', required: true, order: 4, completed: false },
        { id: 'api-5', title: 'Load testing', description: 'Perform load and stress testing', category: 'qa', required: false, order: 5, completed: false }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'checklist-security',
      name: 'Security Audit Checklist',
      description: 'Security review and compliance checklist',
      appTypes: ['website', 'mobile_app', 'custom'],
      items: [
        { id: 'sec-1', title: 'Authentication review', description: 'Review authentication mechanisms', category: 'technical', required: true, order: 1, completed: false },
        { id: 'sec-2', title: 'Authorization testing', description: 'Test role-based access controls', category: 'qa', required: true, order: 2, completed: false },
        { id: 'sec-3', title: 'Data encryption', description: 'Verify encryption at rest and in transit', category: 'technical', required: true, order: 3, completed: false },
        { id: 'sec-4', title: 'Compliance documentation', description: 'Document compliance with regulations', category: 'legal', required: true, order: 4, completed: false },
        { id: 'sec-5', title: 'Penetration testing', description: 'Conduct security penetration testing', category: 'qa', required: false, order: 5, completed: false }
      ],
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  // Convert users to TeamMember type for modal
  const teamMembersForModal: TeamMember[] = users.map(u => {
    const initials = u.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    return {
      id: u.id,
      name: u.name,
      role: u.role,
      avatar: initials
    }
  })

  const handleNext = async () => {
    // If on step 5 (Checklist Templates) and templates are selected, show assignment modal
    if (currentStep === 5 && formData.selectedChecklistTemplates.length > 0) {
      setShowAssignmentModal(true)
    } else if (currentStep < 6) {
      setCurrentStep(currentStep + 1)
    } else {
      // Submit form - Create project
      await handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (!user || !tenant) {
      toast.error('User or tenant not found')
      return
    }

    // Validation
    if (!formData.name.trim()) {
      toast.error('Project name is required')
      return
    }

    try {
      setSubmitting(true)

      // Get selected client and manager details
      const selectedClient = clients.find(c => c.id === formData.clientId)
      const selectedManager = users.find(u => u.id === formData.projectManager)

      // Map form data to Project type
      const projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> = {
        tenantId: tenant.id,
        name: formData.name.trim(),
        slug: formData.name.trim().toLowerCase().replace(/\s+/g, '-'),
        description: formData.description.trim(),
        status: formData.status as ProjectStatus,
        priority: formData.priority as ProjectPriority,
        visibility: 'team',
        tags: formData.tags,

        // Client info
        clientId: formData.clientId || undefined,
        clientName: selectedClient?.name || undefined,

        // Manager info
        managerId: formData.projectManager || undefined,
        managerName: selectedManager?.name || undefined,

        // Owner info (current user)
        ownerId: user.id,
        ownerName: user.name || user.email || 'Unknown',

        // Budget
        budgetAllocated: formData.budget || 0,
        budgetSpent: 0,
        currency: formData.currency || 'USD',

        // Dates
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,

        // Metrics
        tasksTotal: 0,
        tasksCompleted: 0,
        milestonesTotal: formData.milestones.length,
        milestonesCompleted: 0,
        completionPercentage: 0,
        actualHours: 0,
        estimatedHours: formData.estimatedHours || 0,

        // Team
        teamSize: formData.teamMembers.length + 1
      }

      // Create project
      const projectId = await projectsService.createProject(projectData)

      // Create milestones if any
      for (const milestone of formData.milestones) {
        if (milestone.name.trim()) {
          await projectsService.createMilestone({
            tenantId: tenant.id,
            projectId,
            name: milestone.name.trim(),
            description: milestone.description.trim(),
            dueDate: milestone.date,
            status: 'upcoming' as MilestoneStatus,
            completionPercentage: 0,
            tasksTotal: 0,
            tasksCompleted: 0,
            dependsOn: []
          })
        }
      }

      toast.success('Project created successfully!')
      router.push(`/dashboard/projects/${projectId}`)
    } catch (error: any) {
      console.error('Error creating project:', error)
      toast.error(error.message || 'Failed to create project')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAssignmentSave = (assignments: Map<string, { assignedTo: string; assignedType: 'user' | 'team' }>) => {
    // Convert Map to Record for formData
    const assignmentRecord: Record<string, { assignedTo: string; assignedType: 'user' | 'team' }> = {}
    assignments.forEach((value, key) => {
      assignmentRecord[key] = value
    })

    setFormData(prev => ({
      ...prev,
      checklistAssignments: assignmentRecord
    }))

    setShowAssignmentModal(false)
    setCurrentStep(6) // Proceed to Review step
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  const toggleTeamMember = (memberId: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.includes(memberId)
        ? prev.teamMembers.filter(id => id !== memberId)
        : [...prev.teamMembers, memberId]
    }))
  }

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.includes(skill)
        ? prev.requiredSkills.filter(s => s !== skill)
        : [...prev.requiredSkills, skill]
    }))
  }

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }))
  }

  const updateObjective = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.map((obj, i) => i === index ? value : obj)
    }))
  }

  const removeObjective = (index: number) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index)
    }))
  }

  const addDeliverable = () => {
    setFormData(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, '']
    }))
  }

  const updateDeliverable = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.map((del, i) => i === index ? value : del)
    }))
  }

  const removeDeliverable = (index: number) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index)
    }))
  }

  const addMilestone = () => {
    setFormData(prev => ({
      ...prev,
      milestones: [...prev.milestones, { name: '', date: '', description: '' }]
    }))
  }

  const updateMilestone = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.map((milestone, i) =>
        i === index ? { ...milestone, [field]: value } : milestone
      )
    }))
  }

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }))
  }

  // Loading state
  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/projects">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-400" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Create New Project</h1>
            <p className="text-gray-400">Loading form data...</p>
          </div>
        </div>
        <div className="animate-pulse space-y-6">
          <div className="h-20 bg-gray-800 rounded-xl" />
          <div className="h-96 bg-gray-800 rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/projects">
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Create New Project</h1>
          <p className="text-gray-400">Set up your project with detailed planning</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center transition-all",
                    isActive ? "gradient-purple" :
                    isCompleted ? "gradient-green" :
                    "bg-gray-800"
                  )}>
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-white" />
                    ) : (
                      <Icon className={cn(
                        "h-5 w-5",
                        isActive ? "text-white" : "text-gray-400"
                      )} />
                    )}
                  </div>
                  <div className="ml-3 hidden md:block">
                    <p className={cn(
                      "text-sm font-medium",
                      isActive ? "text-white" : "text-gray-400"
                    )}>
                      Step {step.id}
                    </p>
                    <p className={cn(
                      "text-xs",
                      isActive ? "text-purple-400" : "text-gray-500"
                    )}>
                      {step.name}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-4",
                    isCompleted ? "bg-purple-500" : "bg-gray-800"
                  )} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Form Content */}
      <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8">
        {/* Step 1: Project Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Project Details</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <Select
                  label="Category"
                  required
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(value) => setFormData({ ...formData, category: value })}
                  placeholder="Select category"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">
                  Priority Level *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {priorities.map(priority => (
                    <button
                      key={priority.value}
                      onClick={() => setFormData({ ...formData, priority: priority.value })}
                      className={cn(
                        "p-3 rounded-xl border transition-all text-left",
                        formData.priority === priority.value
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn("w-3 h-3 rounded-full", priority.color)} />
                        <span className={cn(
                          "font-medium",
                          formData.priority === priority.value ? "text-purple-400" : "text-white"
                        )}>
                          {priority.label}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Project Type *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {projectTypes.map(type => (
                  <button
                    key={type.value}
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all text-left",
                      formData.type === type.value
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
                    )}
                  >
                    <p className={cn(
                      "font-medium mb-1",
                      formData.type === type.value ? "text-purple-400" : "text-white"
                    )}>
                      {type.label}
                    </p>
                    <p className="text-sm text-gray-400">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none"
                placeholder="Describe the project goals, scope, and key requirements"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => {
                  const isSelected = formData.tags.includes(tag)
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm transition-all",
                        isSelected
                          ? "bg-purple-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                      )}
                    >
                      {tag}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Client & Scope */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Client & Scope</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <Select
                  label="Client"
                  required
                  options={clientOptions}
                  value={formData.clientId}
                  onChange={(value) => setFormData({ ...formData, clientId: value })}
                  placeholder="Select client"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Primary Contact (Optional)
                </label>
                <input
                  type="text"
                  value={formData.clientContact}
                  onChange={(e) => setFormData({ ...formData, clientContact: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Enter primary contact name"
                  disabled={!formData.clientId}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Scope
              </label>
              <textarea
                value={formData.scope}
                onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none"
                placeholder="Define the project scope and boundaries"
                rows={4}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-300">
                  Project Objectives
                </label>
                <button
                  onClick={addObjective}
                  className="px-3 py-1 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
              <div className="space-y-3">
                {formData.objectives.map((objective, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => updateObjective(index, e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                      placeholder="Enter project objective"
                    />
                    <button
                      onClick={() => removeObjective(index)}
                      className="p-3 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {formData.objectives.length === 0 && (
                  <p className="text-gray-500 text-sm italic">No objectives added yet</p>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-300">
                  Key Deliverables
                </label>
                <button
                  onClick={addDeliverable}
                  className="px-3 py-1 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add
                </button>
              </div>
              <div className="space-y-3">
                {formData.deliverables.map((deliverable, index) => (
                  <div key={index} className="flex gap-3">
                    <input
                      type="text"
                      value={deliverable}
                      onChange={(e) => updateDeliverable(index, e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                      placeholder="Enter deliverable"
                    />
                    <button
                      onClick={() => removeDeliverable(index)}
                      className="p-3 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {formData.deliverables.length === 0 && (
                  <p className="text-gray-500 text-sm italic">No deliverables added yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Team & Resources */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Team & Resources</h2>

            <div>
              <Select
                label="Project Manager"
                required
                options={projectManagerOptions}
                value={formData.projectManager}
                onChange={(value) => setFormData({ ...formData, projectManager: value })}
                placeholder="Select project manager"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Team Members
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users.map(member => {
                  const isSelected = formData.teamMembers.includes(member.id)
                  const initials = member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                  return (
                    <div
                      key={member.id}
                      onClick={() => toggleTeamMember(member.id)}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all",
                        isSelected
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-gray-700 bg-gray-800/30 hover:border-gray-600"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                          isSelected ? "gradient-purple text-white" : "bg-gray-700 text-gray-300"
                        )}>
                          {initials}
                        </div>
                        <div>
                          <p className={cn(
                            "font-medium",
                            isSelected ? "text-purple-400" : "text-white"
                          )}>
                            {member.name}
                          </p>
                          <p className="text-sm text-gray-400">{member.role}</p>
                        </div>
                        {isSelected && (
                          <Check className="h-5 w-5 text-purple-400 ml-auto" />
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Required Skills
              </label>
              <div className="flex flex-wrap gap-2">
                {availableSkills.map(skill => {
                  const isSelected = formData.requiredSkills.includes(skill)
                  return (
                    <button
                      key={skill}
                      onClick={() => toggleSkill(skill)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm transition-all",
                        isSelected
                          ? "bg-purple-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                      )}
                    >
                      {skill}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Timeline & Budget */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Timeline & Budget</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-gray-300">
                  Project Milestones
                </label>
                <button
                  onClick={addMilestone}
                  className="px-3 py-1 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Milestone
                </button>
              </div>
              <div className="space-y-4">
                {formData.milestones.map((milestone, index) => (
                  <div key={index} className="p-4 rounded-xl bg-gray-800/30 border border-gray-700">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={milestone.name}
                            onChange={(e) => updateMilestone(index, 'name', e.target.value)}
                            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder:text-gray-500 text-sm"
                            placeholder="Milestone name"
                          />
                          <input
                            type="date"
                            value={milestone.date}
                            onChange={(e) => updateMilestone(index, 'date', e.target.value)}
                            className="px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white text-sm"
                          />
                        </div>
                        <input
                          type="text"
                          value={milestone.description}
                          onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder:text-gray-500 text-sm"
                          placeholder="Description"
                        />
                      </div>
                      <button
                        onClick={() => removeMilestone(index)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {formData.milestones.length === 0 && (
                  <p className="text-gray-500 text-sm italic">No milestones added yet</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Total Budget
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Select
                  label="Currency"
                  options={currencyOptions}
                  value={formData.currency}
                  onChange={(value) => setFormData({ ...formData, currency: value })}
                  placeholder="Select currency"
                />
              </div>

              {formData.type === 'hourly' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Hourly Rate
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                        placeholder="150"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Estimated Hours
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="number"
                        value={formData.estimatedHours}
                        onChange={(e) => setFormData({ ...formData, estimatedHours: parseFloat(e.target.value) || 0 })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Risk Assessment
              </label>
              <div className="space-y-3">
                {riskLevels.map(risk => (
                  <label key={risk.value} className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="riskAssessment"
                      value={risk.value}
                      checked={formData.riskAssessment === risk.value}
                      onChange={(e) => setFormData({ ...formData, riskAssessment: e.target.value })}
                      className="mt-1"
                    />
                    <div>
                      <p className="text-white font-medium">{risk.label}</p>
                      <p className="text-sm text-gray-400">{risk.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Review */}
        {/* Step 5: Checklist Templates */}
        {currentStep === 5 && (
          <div className="space-y-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Checklist Templates</h2>
              <p className="text-gray-400">Select pre-production checklists for your project and assign them to team members</p>
            </div>

            {/* Mock Checklist Templates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  id: 'checklist-web-dev',
                  name: 'Web Development Checklist',
                  description: 'Complete checklist for web application projects',
                  itemsCount: 25,
                  categories: ['Setup', 'Development', 'Testing', 'Deployment']
                },
                {
                  id: 'checklist-mobile-app',
                  name: 'Mobile App Checklist',
                  description: 'Checklist for iOS and Android app development',
                  itemsCount: 30,
                  categories: ['Planning', 'Design', 'Development', 'Testing', 'Release']
                },
                {
                  id: 'checklist-api',
                  name: 'API Development Checklist',
                  description: 'Best practices for RESTful API development',
                  itemsCount: 18,
                  categories: ['Design', 'Implementation', 'Documentation', 'Security']
                },
                {
                  id: 'checklist-security',
                  name: 'Security Audit Checklist',
                  description: 'Security review and compliance checklist',
                  itemsCount: 22,
                  categories: ['Authentication', 'Authorization', 'Data Protection', 'Testing']
                }
              ].map((template) => {
                const isSelected = formData.selectedChecklistTemplates.includes(template.id)
                return (
                  <button
                    key={template.id}
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        selectedChecklistTemplates: isSelected
                          ? prev.selectedChecklistTemplates.filter(id => id !== template.id)
                          : [...prev.selectedChecklistTemplates, template.id]
                      }))
                    }}
                    className={cn(
                      'p-6 rounded-xl border-2 text-left transition-all',
                      isSelected
                        ? 'bg-purple-500/10 border-purple-500'
                        : 'bg-gray-800/30 border-gray-700 hover:border-gray-600'
                    )}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center',
                          isSelected ? 'bg-purple-500/20' : 'bg-gray-700'
                        )}>
                          <FileText className={cn(
                            'w-5 h-5',
                            isSelected ? 'text-purple-400' : 'text-gray-400'
                          )} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{template.name}</h3>
                          <p className="text-sm text-gray-400 mt-1">{template.itemsCount} items</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {template.categories.map((category) => (
                        <span
                          key={category}
                          className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </button>
                )
              })}
            </div>

            {formData.selectedChecklistTemplates.length > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-400 mb-1">Assignment Step Next</h4>
                    <p className="text-sm text-gray-300">
                      After completing this step, you'll be able to assign checklist items to team members or teams.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 6: Review & Confirm */}
        {currentStep === 6 && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-white mb-6">Review & Confirm</h2>

            {/* Project Details Summary */}
            <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Project Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white ml-2">{formData.name || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Category:</span>
                  <span className="text-white ml-2">{formData.category || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Type:</span>
                  <span className="text-white ml-2">{projectTypes.find(t => t.value === formData.type)?.label}</span>
                </div>
                <div>
                  <span className="text-gray-400">Priority:</span>
                  <span className="text-white ml-2 capitalize">{formData.priority}</span>
                </div>
                {formData.tags.length > 0 && (
                  <div className="md:col-span-2">
                    <span className="text-gray-400">Tags:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 rounded bg-purple-600/20 text-purple-400 text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Client & Scope Summary */}
            <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Target className="h-5 w-5" />
                Client & Scope
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Client:</span>
                  <span className="text-white ml-2">
                    {clients.find(c => c.id === formData.clientId)?.name || 'Not selected'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Contact:</span>
                  <span className="text-white ml-2">{formData.clientContact || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Objectives:</span>
                  <span className="text-white ml-2">{formData.objectives.length} defined</span>
                </div>
                <div>
                  <span className="text-gray-400">Deliverables:</span>
                  <span className="text-white ml-2">{formData.deliverables.length} specified</span>
                </div>
              </div>
            </div>

            {/* Team Summary */}
            <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Team & Resources
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-400">Project Manager:</span>
                  <span className="text-white ml-2">
                    {users.find(u => u.id === formData.projectManager)?.name || 'Not assigned'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Team Members:</span>
                  <span className="text-white ml-2">{formData.teamMembers.length} selected</span>
                </div>
                <div>
                  <span className="text-gray-400">Required Skills:</span>
                  <span className="text-white ml-2">{formData.requiredSkills.length} skills</span>
                </div>
              </div>
            </div>

            {/* Timeline & Budget Summary */}
            <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-6">
              <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline & Budget
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Start Date:</span>
                  <span className="text-white ml-2">{formData.startDate || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-gray-400">End Date:</span>
                  <span className="text-white ml-2">{formData.endDate || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-gray-400">Budget:</span>
                  <span className="text-white ml-2">
                    {formData.budget > 0 ? `${formData.currency} ${formData.budget.toLocaleString()}` : 'Not set'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Milestones:</span>
                  <span className="text-white ml-2">{formData.milestones.length} defined</span>
                </div>
                <div>
                  <span className="text-gray-400">Risk Level:</span>
                  <span className="text-white ml-2 capitalize">{formData.riskAssessment}</span>
                </div>
              </div>
            </div>

            {/* Checklist Templates Summary */}
            {formData.selectedChecklistTemplates.length > 0 && (
              <div className="rounded-xl bg-gray-800/30 border border-gray-700 p-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Checklist Templates
                </h3>
                <div className="space-y-4">
                  {mockChecklistTemplates
                    .filter(t => formData.selectedChecklistTemplates.includes(t.id))
                    .map(template => {
                      const assignedItems = template.items.filter(item =>
                        formData.checklistAssignments[item.id]
                      ).length

                      return (
                        <div key={template.id} className="border-l-2 border-purple-500 pl-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-white font-medium">{template.name}</h4>
                              <p className="text-sm text-gray-400">{template.description}</p>
                            </div>
                            <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">
                              {assignedItems}/{template.items.length} assigned
                            </span>
                          </div>

                          {assignedItems > 0 && (
                            <div className="mt-3 space-y-2">
                              {template.items
                                .filter(item => formData.checklistAssignments[item.id])
                                .slice(0, 3)
                                .map(item => {
                                  const assignment = formData.checklistAssignments[item.id]
                                  const assignedMember = assignment.assignedType === 'user'
                                    ? users.find(u => u.id === assignment.assignedTo)
                                    : null

                                  return (
                                    <div key={item.id} className="flex items-center gap-2 text-sm">
                                      <CheckCircle2 className="w-3 h-3 text-green-400" />
                                      <span className="text-gray-300">{item.title}</span>
                                      <span className="text-gray-500">→</span>
                                      <span className="text-purple-400">
                                        {assignedMember ? assignedMember.name : assignment.assignedTo}
                                      </span>
                                    </div>
                                  )
                                })}
                              {assignedItems > 3 && (
                                <p className="text-xs text-gray-500 italic">
                                  +{assignedItems - 3} more assignments
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={cn(
              "px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2",
              currentStep === 1
                ? "bg-gray-800/50 text-gray-600 cursor-not-allowed"
                : "bg-gray-800 text-white hover:bg-gray-700"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <button
            onClick={handleNext}
            disabled={submitting}
            className={cn(
              "px-6 py-3 rounded-xl gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center gap-2",
              submitting && "opacity-50 cursor-not-allowed"
            )}
          >
            {submitting ? 'Creating...' : currentStep === 6 ? 'Create Project' : 'Next'}
            {!submitting && <ArrowRight className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Checklist Assignment Modal */}
      <ChecklistAssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        templates={mockChecklistTemplates.filter(t => formData.selectedChecklistTemplates.includes(t.id))}
        teamMembers={teamMembersForModal}
        onAssign={handleAssignmentSave}
      />
    </div>
  )
}