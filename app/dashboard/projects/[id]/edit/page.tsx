'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, ArrowRight, Calendar, DollarSign, Users,
  Briefcase, FileText, Plus, X, Search, Check,
  Building2, Clock, Target, Upload, Link2, Save,
  AlertCircle, CheckCircle, Edit, Archive, Copy
} from 'lucide-react'
import Link from 'next/link'

// Mock data for dropdowns
const clients = [
  { id: 'c1', name: 'TechCorp Inc.', logo: 'TC' },
  { id: 'c2', name: 'FinanceHub', logo: 'FH' },
  { id: 'c3', name: 'GlobalHR Solutions', logo: 'GH' },
  { id: 'c4', name: 'RetailChain Pro', logo: 'RC' },
  { id: 'c5', name: 'InnovateTech', logo: 'IT' },
  { id: 'c6', name: 'MediCare Plus', logo: 'MP' }
]

const teamMembers = [
  { id: 't1', name: 'Sarah Chen', role: 'Project Manager', avatar: 'SC' },
  { id: 't2', name: 'Mike Johnson', role: 'Backend Developer', avatar: 'MJ' },
  { id: 't3', name: 'Emma Davis', role: 'Frontend Developer', avatar: 'ED' },
  { id: 't4', name: 'Alex Kim', role: 'UI/UX Designer', avatar: 'AK' },
  { id: 't5', name: 'James Wilson', role: 'DevOps Engineer', avatar: 'JW' },
  { id: 't6', name: 'Sophie Brown', role: 'iOS Developer', avatar: 'SB' },
  { id: 't7', name: 'Ryan Martinez', role: 'Android Developer', avatar: 'RM' },
  { id: 't8', name: 'Lisa Wang', role: 'QA Engineer', avatar: 'LW' }
]

const technologies = [
  'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Python',
  'Django', 'Ruby on Rails', 'PHP', 'Laravel', 'PostgreSQL',
  'MySQL', 'MongoDB', 'Redis', 'AWS', 'Google Cloud', 'Azure',
  'Docker', 'Kubernetes', 'GraphQL', 'REST API', 'TypeScript'
]

// Mock project data
const mockProject = {
  id: 'proj1',
  name: 'E-commerce Platform Redesign',
  description: 'Complete redesign and rebuild of the client\'s e-commerce platform with modern technologies and improved user experience.',
  clientId: 'c1',
  type: 'web_app',
  priority: 'high',
  status: 'in_progress',
  budget: 75000,
  startDate: '2024-02-15',
  dueDate: '2024-06-30',
  managerId: 't1',
  teamMembers: ['t2', 't3', 't4', 't5'],
  technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
  repository: 'github.com/techcorp/ecommerce-redesign',
  progress: 65,
  milestones: [
    { name: 'Requirements Analysis', date: '2024-03-01', completed: true },
    { name: 'UI/UX Design', date: '2024-03-30', completed: true },
    { name: 'Backend Development', date: '2024-05-15', completed: false },
    { name: 'Frontend Implementation', date: '2024-06-15', completed: false },
    { name: 'Testing & Launch', date: '2024-06-30', completed: false }
  ],
  createdAt: '2024-02-01',
  updatedAt: '2024-03-25'
}

interface ProjectFormData {
  name: string
  description: string
  clientId: string
  type: string
  priority: string
  status: string
  budget: number
  startDate: string
  dueDate: string
  managerId: string
  teamMembers: string[]
  technologies: string[]
  repository: string
  milestones: { name: string; date: string; completed: boolean }[]
}

export default function EditProjectPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [showClientDropdown, setShowClientDropdown] = useState(false)
  const [showManagerDropdown, setShowManagerDropdown] = useState(false)
  const [showTeamDropdown, setShowTeamDropdown] = useState(false)
  const [clientSearch, setClientSearch] = useState('')
  const [managerSearch, setManagerSearch] = useState('')
  const [teamSearch, setTeamSearch] = useState('')
  const [hasChanges, setHasChanges] = useState(false)

  const [formData, setFormData] = useState<ProjectFormData>({
    name: mockProject.name,
    description: mockProject.description,
    clientId: mockProject.clientId,
    type: mockProject.type,
    priority: mockProject.priority,
    status: mockProject.status,
    budget: mockProject.budget,
    startDate: mockProject.startDate,
    dueDate: mockProject.dueDate,
    managerId: mockProject.managerId,
    teamMembers: mockProject.teamMembers,
    technologies: mockProject.technologies,
    repository: mockProject.repository,
    milestones: mockProject.milestones
  })

  const steps = [
    { id: 1, name: 'Basic Info', icon: FileText },
    { id: 2, name: 'Team & Resources', icon: Users },
    { id: 3, name: 'Timeline & Budget', icon: Calendar },
    { id: 4, name: 'Status & Progress', icon: Target }
  ]

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = () => {
    console.log('Saving project:', formData)
    setHasChanges(false)
    // Simulate save success
    router.push(`/dashboard/projects/${params.id}`)
  }

  const handleFormChange = (updates: Partial<ProjectFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
    setHasChanges(true)
  }

  const toggleTechnology = (tech: string) => {
    const updated = formData.technologies.includes(tech)
      ? formData.technologies.filter(t => t !== tech)
      : [...formData.technologies, tech]
    handleFormChange({ technologies: updated })
  }

  const toggleTeamMember = (memberId: string) => {
    const updated = formData.teamMembers.includes(memberId)
      ? formData.teamMembers.filter(m => m !== memberId)
      : [...formData.teamMembers, memberId]
    handleFormChange({ teamMembers: updated })
  }

  const addMilestone = () => {
    handleFormChange({
      milestones: [...formData.milestones, { name: '', date: '', completed: false }]
    })
  }

  const removeMilestone = (index: number) => {
    handleFormChange({
      milestones: formData.milestones.filter((_, i) => i !== index)
    })
  }

  const updateMilestone = (index: number, field: string, value: any) => {
    const updated = [...formData.milestones]
    updated[index] = { ...updated[index], [field]: value }
    handleFormChange({ milestones: updated })
  }

  const selectedClient = clients.find(c => c.id === formData.clientId)
  const selectedManager = teamMembers.find(m => m.id === formData.managerId)
  const selectedTeam = teamMembers.filter(m => formData.teamMembers.includes(m.id))

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'planning': return 'text-blue-400 bg-blue-400/10'
      case 'in_progress': return 'text-yellow-400 bg-yellow-400/10'
      case 'completed': return 'text-green-400 bg-green-400/10'
      case 'on_hold': return 'text-gray-400 bg-gray-400/10'
      case 'cancelled': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'low': return 'text-gray-400 bg-gray-400/10'
      case 'medium': return 'text-blue-400 bg-blue-400/10'
      case 'high': return 'text-orange-400 bg-orange-400/10'
      case 'urgent': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/projects/${params.id}`}>
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-400" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Project</h1>
            <p className="text-gray-400">Modify project details and settings</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasChanges && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-yellow-400/10 border border-yellow-400/30">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm">Unsaved changes</span>
            </div>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Project Overview Card */}
      <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Project Overview</h2>
          <div className="flex items-center gap-3">
            <span className={cn('px-3 py-1 rounded-lg text-sm font-medium', getPriorityColor(formData.priority))}>
              {formData.priority.charAt(0).toUpperCase() + formData.priority.slice(1)} Priority
            </span>
            <span className={cn('px-3 py-1 rounded-lg text-sm font-medium', getStatusColor(formData.status))}>
              {formData.status.replace('_', ' ').charAt(0).toUpperCase() + formData.status.replace('_', ' ').slice(1)}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-400 mb-1">Budget</p>
            <p className="text-xl font-bold text-white">${formData.budget.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Progress</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
                  style={{ width: `${mockProject.progress}%` }}
                />
              </div>
              <span className="text-sm font-medium text-white">{mockProject.progress}%</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Team Size</p>
            <p className="text-xl font-bold text-white">{formData.teamMembers.length + 1}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Days Remaining</p>
            <p className="text-xl font-bold text-white">
              {Math.ceil((new Date(formData.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}
            </p>
          </div>
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
                  <div className="ml-3">
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
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFormChange({ name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                placeholder="Enter project name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleFormChange({ description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none"
                placeholder="Describe the project objectives and scope"
                rows={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Client *
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowClientDropdown(!showClientDropdown)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-left flex items-center justify-between hover:bg-gray-800 transition-all"
                >
                  {selectedClient ? (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center text-white text-sm font-medium">
                        {selectedClient.logo}
                      </div>
                      <span>{selectedClient.name}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Select a client</span>
                  )}
                  <Building2 className="h-5 w-5 text-gray-400" />
                </button>

                {showClientDropdown && (
                  <div className="absolute z-10 w-full mt-2 rounded-xl bg-gray-900 border border-gray-800 shadow-2xl">
                    <div className="p-3 border-b border-gray-800">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          value={clientSearch}
                          onChange={(e) => setClientSearch(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder:text-gray-500 focus:outline-none"
                          placeholder="Search clients..."
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto p-2">
                      {clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase())).map(client => (
                        <button
                          key={client.id}
                          onClick={() => {
                            handleFormChange({ clientId: client.id })
                            setShowClientDropdown(false)
                            setClientSearch('')
                          }}
                          className="w-full px-3 py-2 rounded-lg flex items-center gap-3 hover:bg-gray-800 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center text-white text-sm font-medium">
                            {client.logo}
                          </div>
                          <span className="text-white">{client.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Project Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleFormChange({ type: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                >
                  <option value="web_app">Web Application</option>
                  <option value="mobile_app">Mobile Application</option>
                  <option value="pos">POS System</option>
                  <option value="hybrid">Hybrid Application</option>
                  <option value="custom">Custom Solution</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Priority *
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleFormChange({ priority: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleFormChange({ status: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                >
                  <option value="planning">Planning</option>
                  <option value="in_progress">In Progress</option>
                  <option value="on_hold">On Hold</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Team & Resources */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Team & Resources</h2>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Manager *
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowManagerDropdown(!showManagerDropdown)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-left flex items-center justify-between hover:bg-gray-800 transition-all"
                >
                  {selectedManager ? (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center text-white text-sm font-medium">
                        {selectedManager.avatar}
                      </div>
                      <div>
                        <span>{selectedManager.name}</span>
                        <span className="text-gray-400 text-sm ml-2">{selectedManager.role}</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-gray-500">Select project manager</span>
                  )}
                  <Users className="h-5 w-5 text-gray-400" />
                </button>

                {showManagerDropdown && (
                  <div className="absolute z-10 w-full mt-2 rounded-xl bg-gray-900 border border-gray-800 shadow-2xl">
                    <div className="p-3 border-b border-gray-800">
                      <input
                        type="text"
                        value={managerSearch}
                        onChange={(e) => setManagerSearch(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder:text-gray-500 focus:outline-none"
                        placeholder="Search team members..."
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto p-2">
                      {teamMembers
                        .filter(m => m.role.includes('Manager') && m.name.toLowerCase().includes(managerSearch.toLowerCase()))
                        .map(member => (
                        <button
                          key={member.id}
                          onClick={() => {
                            handleFormChange({ managerId: member.id })
                            setShowManagerDropdown(false)
                            setManagerSearch('')
                          }}
                          className="w-full px-3 py-2 rounded-lg flex items-center gap-3 hover:bg-gray-800 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center text-white text-sm font-medium">
                            {member.avatar}
                          </div>
                          <div className="text-left">
                            <p className="text-white">{member.name}</p>
                            <p className="text-gray-400 text-xs">{member.role}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Team Members
              </label>
              <div className="relative">
                <button
                  onClick={() => setShowTeamDropdown(!showTeamDropdown)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white text-left hover:bg-gray-800 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">
                      {selectedTeam.length > 0 ? `${selectedTeam.length} members selected` : 'Select team members'}
                    </span>
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  {selectedTeam.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTeam.map(member => (
                        <span key={member.id} className="px-3 py-1 rounded-lg bg-purple-600/20 text-purple-400 text-sm">
                          {member.name}
                        </span>
                      ))}
                    </div>
                  )}
                </button>

                {showTeamDropdown && (
                  <div className="absolute z-10 w-full mt-2 rounded-xl bg-gray-900 border border-gray-800 shadow-2xl">
                    <div className="p-3 border-b border-gray-800">
                      <input
                        type="text"
                        value={teamSearch}
                        onChange={(e) => setTeamSearch(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder:text-gray-500 focus:outline-none"
                        placeholder="Search team members..."
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto p-2">
                      {teamMembers
                        .filter(m => m.name.toLowerCase().includes(teamSearch.toLowerCase()))
                        .map(member => {
                          const isSelected = formData.teamMembers.includes(member.id)
                          return (
                            <button
                              key={member.id}
                              onClick={() => toggleTeamMember(member.id)}
                              className={cn(
                                "w-full px-3 py-2 rounded-lg flex items-center gap-3 transition-colors",
                                isSelected ? "bg-purple-600/20" : "hover:bg-gray-800"
                              )}
                            >
                              <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center text-white text-sm font-medium">
                                {member.avatar}
                              </div>
                              <div className="flex-1 text-left">
                                <p className="text-white">{member.name}</p>
                                <p className="text-gray-400 text-xs">{member.role}</p>
                              </div>
                              {isSelected && <Check className="h-4 w-4 text-purple-400" />}
                            </button>
                          )
                        })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Technologies
              </label>
              <div className="flex flex-wrap gap-2">
                {technologies.map(tech => {
                  const isSelected = formData.technologies.includes(tech)
                  return (
                    <button
                      key={tech}
                      onClick={() => toggleTechnology(tech)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm transition-all",
                        isSelected
                          ? "bg-purple-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                      )}
                    >
                      {tech}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Repository URL
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.repository}
                  onChange={(e) => handleFormChange({ repository: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="github.com/organization/repository"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Timeline & Budget */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Timeline & Budget</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleFormChange({ startDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleFormChange({ dueDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Budget *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleFormChange({ budget: parseInt(e.target.value) || 0 })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  placeholder="Enter project budget"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">
                  Milestones
                </label>
                <button
                  onClick={addMilestone}
                  className="px-3 py-1 rounded-lg gradient-purple text-white text-sm font-medium hover:opacity-90 transition-all flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Milestone
                </button>
              </div>
              <div className="space-y-3">
                {formData.milestones.map((milestone, index) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={milestone.name}
                      onChange={(e) => updateMilestone(index, 'name', e.target.value)}
                      className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                      placeholder="Milestone name"
                    />
                    <input
                      type="date"
                      value={milestone.date}
                      onChange={(e) => updateMilestone(index, 'date', e.target.value)}
                      className="w-40 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    />
                    <button
                      onClick={() => updateMilestone(index, 'completed', !milestone.completed)}
                      className={cn(
                        "p-3 rounded-xl transition-all",
                        milestone.completed
                          ? "bg-green-500/10 text-green-400"
                          : "bg-gray-800/50 text-gray-400 hover:bg-gray-800"
                      )}
                    >
                      <CheckCircle className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => removeMilestone(index)}
                      className="p-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Status & Progress */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Project Summary</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Project Name</p>
                <p className="text-white font-medium">{formData.name || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Client</p>
                <p className="text-white font-medium">{selectedClient?.name || 'Not selected'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Type</p>
                <p className="text-white font-medium capitalize">{formData.type.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Priority</p>
                <p className="text-white font-medium capitalize">{formData.priority}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Status</p>
                <p className="text-white font-medium capitalize">{formData.status.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Budget</p>
                <p className="text-white font-medium">${formData.budget.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Timeline</p>
                <p className="text-white font-medium">
                  {formData.startDate && formData.dueDate
                    ? `${new Date(formData.startDate).toLocaleDateString()} - ${new Date(formData.dueDate).toLocaleDateString()}`
                    : 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Current Progress</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                      style={{ width: `${mockProject.progress}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-white">{mockProject.progress}%</span>
                </div>
              </div>
            </div>

            {formData.description && (
              <div>
                <p className="text-sm text-gray-400 mb-1">Description</p>
                <p className="text-white">{formData.description}</p>
              </div>
            )}

            <div>
              <p className="text-sm text-gray-400 mb-2">Team</p>
              <div className="flex items-center gap-4">
                {selectedManager && (
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center text-white text-sm">
                      {selectedManager.avatar}
                    </div>
                    <div>
                      <p className="text-white text-sm">{selectedManager.name}</p>
                      <p className="text-gray-400 text-xs">Project Manager</p>
                    </div>
                  </div>
                )}
                {selectedTeam.length > 0 && (
                  <div className="flex -space-x-2">
                    {selectedTeam.slice(0, 5).map(member => (
                      <div
                        key={member.id}
                        className="w-8 h-8 rounded-full gradient-purple border-2 border-gray-900 flex items-center justify-center text-white text-xs"
                        title={member.name}
                      >
                        {member.avatar}
                      </div>
                    ))}
                    {selectedTeam.length > 5 && (
                      <div className="w-8 h-8 rounded-full bg-gray-800 border-2 border-gray-900 flex items-center justify-center text-gray-400 text-xs">
                        +{selectedTeam.length - 5}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {formData.technologies.length > 0 && (
              <div>
                <p className="text-sm text-gray-400 mb-2">Technologies</p>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map(tech => (
                    <span key={tech} className="px-3 py-1 rounded-lg bg-gray-800 text-gray-300 text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {hasChanges ? (
              <div className="p-4 rounded-xl bg-yellow-600/10 border border-yellow-500/30">
                <p className="text-yellow-400 text-sm">
                  <AlertCircle className="h-4 w-4 inline mr-2" />
                  You have unsaved changes. Please save your changes before leaving this page.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-green-600/10 border border-green-500/30">
                <p className="text-green-400 text-sm">
                  <CheckCircle className="h-4 w-4 inline mr-2" />
                  All changes have been saved successfully.
                </p>
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

          <div className="flex items-center gap-3">
            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-3 rounded-xl gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="px-6 py-3 rounded-xl gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save All Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}