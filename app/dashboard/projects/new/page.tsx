'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, ArrowRight, FolderOpen, Users, Calendar,
  DollarSign, FileText, Plus, X, Check, Building2,
  User, Target, Briefcase, Clock, Settings, Star,
  CheckCircle2, Upload, AlertCircle, Globe, Shield
} from 'lucide-react'
import Link from 'next/link'

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

  // Additional Settings
  visibility: string
  notifications: boolean
  autoBackup: boolean
  riskAssessment: string
}

export default function NewProjectPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
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

    // Additional Settings
    visibility: 'team',
    notifications: true,
    autoBackup: true,
    riskAssessment: 'low'
  })

  const steps = [
    { id: 1, name: 'Project Details', icon: FolderOpen },
    { id: 2, name: 'Client & Scope', icon: Target },
    { id: 3, name: 'Team & Resources', icon: Users },
    { id: 4, name: 'Timeline & Budget', icon: Calendar },
    { id: 5, name: 'Review', icon: CheckCircle2 }
  ]

  // Mock data
  const categories = [
    'Web Development', 'Mobile App', 'E-commerce', 'Custom Software',
    'API Development', 'Database Design', 'UI/UX Design', 'Consulting'
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

  const mockClients = [
    { id: 'c1', name: 'TechCorp Inc.', contacts: ['John Smith', 'Sarah Johnson'] },
    { id: 'c2', name: 'FinanceHub', contacts: ['Michael Brown', 'Emily Davis'] },
    { id: 'c3', name: 'GlobalHR Solutions', contacts: ['David Wilson', 'Jennifer Lee'] }
  ]

  const mockTeamMembers = [
    { id: 't1', name: 'Alex Johnson', role: 'Frontend Developer', avatar: 'AJ' },
    { id: 't2', name: 'Sarah Chen', role: 'Backend Developer', avatar: 'SC' },
    { id: 't3', name: 'Mike Roberts', role: 'UI/UX Designer', avatar: 'MR' },
    { id: 't4', name: 'Lisa Kim', role: 'Project Manager', avatar: 'LK' },
    { id: 't5', name: 'Tom Wilson', role: 'DevOps Engineer', avatar: 'TW' }
  ]

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

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    } else {
      // Submit form
      console.log('Creating project:', formData)
      router.push('/dashboard/projects')
    }
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Client *
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                >
                  <option value="">Select client</option>
                  {mockClients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Primary Contact
                </label>
                <select
                  value={formData.clientContact}
                  onChange={(e) => setFormData({ ...formData, clientContact: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  disabled={!formData.clientId}
                >
                  <option value="">Select contact</option>
                  {formData.clientId && mockClients.find(c => c.id === formData.clientId)?.contacts.map(contact => (
                    <option key={contact} value={contact}>{contact}</option>
                  ))}
                </select>
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
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Manager *
              </label>
              <select
                value={formData.projectManager}
                onChange={(e) => setFormData({ ...formData, projectManager: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
              >
                <option value="">Select project manager</option>
                {mockTeamMembers.filter(m => m.role.includes('Manager')).map(member => (
                  <option key={member.id} value={member.id}>{member.name} - {member.role}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Team Members
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockTeamMembers.map(member => {
                  const isSelected = formData.teamMembers.includes(member.id)
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
                          {member.avatar}
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
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                </select>
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
        {currentStep === 5 && (
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
                    {mockClients.find(c => c.id === formData.clientId)?.name || 'Not selected'}
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
                    {mockTeamMembers.find(m => m.id === formData.projectManager)?.name || 'Not assigned'}
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
            className="px-6 py-3 rounded-xl gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center gap-2"
          >
            {currentStep === 5 ? 'Create Project' : 'Next'}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}