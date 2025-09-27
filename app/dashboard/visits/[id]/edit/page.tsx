'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Save, X, Calendar, MapPin, User, Clock, FileText,
  Building, Phone, Mail, Star, AlertTriangle, CheckCircle,
  Edit, Trash2, Archive, Plus, Minus, Camera, Upload, Tag,
  Navigation, Route, Compass, Target, Users, ClipboardList,
  MessageSquare, Bell, Zap, Shield, Award, Activity
} from 'lucide-react'

// Mock visit data
const mockVisit = {
  id: 'visit_001',
  title: 'TechCorp Office Setup - Phase 2',
  clientId: 'c1',
  clientName: 'TechCorp Solutions',
  projectId: 'proj_123',
  projectName: 'Office Infrastructure Upgrade',
  type: 'site_visit',
  status: 'scheduled',
  priority: 'high',
  scheduledDate: '2024-03-25',
  scheduledTime: '10:00',
  duration: 4,
  location: {
    address: '123 Tech Street, San Francisco, CA 94105',
    contactPerson: 'John Smith',
    contactPhone: '+1 (555) 123-4567',
    instructions: 'Use main entrance, ask for John at reception'
  },
  attendees: [
    { name: 'Sarah Johnson', role: 'Project Manager', email: 'sarah@company.com' },
    { name: 'Mike Chen', role: 'Technical Lead', email: 'mike@company.com' }
  ],
  objectives: [
    'Install remaining network equipment',
    'Configure wireless access points',
    'Test system connectivity',
    'Train on-site IT staff'
  ],
  requirements: [
    'Network installation tools',
    'Laptop for configuration',
    'Testing equipment',
    'Documentation materials'
  ],
  notes: 'This is the second phase of the office setup. The client has completed the preliminary work as discussed in the previous visit.',
  preparation: {
    completed: true,
    checklist: [
      { item: 'Equipment prepared', completed: true },
      { item: 'Tools packed', completed: true },
      { item: 'Documentation ready', completed: false },
      { item: 'Client notified', completed: true }
    ]
  },
  followUp: {
    required: true,
    scheduledDate: '2024-03-27',
    notes: 'Schedule follow-up call to review system performance'
  },
  tags: ['Installation', 'Network Setup', 'Training'],
  createdAt: '2024-03-20',
  lastModified: '2024-03-22'
}

export default function EditVisitPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('details')
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    title: mockVisit.title,
    clientId: mockVisit.clientId,
    projectId: mockVisit.projectId,
    type: mockVisit.type,
    status: mockVisit.status,
    priority: mockVisit.priority,
    scheduledDate: mockVisit.scheduledDate,
    scheduledTime: mockVisit.scheduledTime,
    duration: mockVisit.duration,
    location: mockVisit.location,
    attendees: mockVisit.attendees,
    objectives: mockVisit.objectives,
    requirements: mockVisit.requirements,
    notes: mockVisit.notes,
    preparation: mockVisit.preparation,
    followUp: mockVisit.followUp,
    tags: mockVisit.tags
  })

  const visitTypes = [
    { value: 'site_visit', label: 'Site Visit' },
    { value: 'installation', label: 'Installation' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'consultation', label: 'Consultation' },
    { value: 'training', label: 'Training' },
    { value: 'inspection', label: 'Inspection' }
  ]

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled', color: 'text-blue-400' },
    { value: 'in_progress', label: 'In Progress', color: 'text-yellow-400' },
    { value: 'completed', label: 'Completed', color: 'text-green-400' },
    { value: 'cancelled', label: 'Cancelled', color: 'text-red-400' },
    { value: 'rescheduled', label: 'Rescheduled', color: 'text-purple-400' }
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low', color: 'text-gray-400' },
    { value: 'medium', label: 'Medium', color: 'text-blue-400' },
    { value: 'high', label: 'High', color: 'text-orange-400' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-400' }
  ]

  const availableTags = [
    'Installation', 'Maintenance', 'Training', 'Consultation', 'Network Setup',
    'Hardware', 'Software', 'Emergency', 'Scheduled', 'Follow-up'
  ]

  const tabs = [
    { id: 'details', label: 'Basic Information', icon: Calendar, description: 'Visit details and scheduling' },
    { id: 'location', label: 'Location & Navigation', icon: MapPin, description: 'Address and directions' },
    { id: 'participants', label: 'Participants', icon: Users, description: 'Attendees and contacts' },
    { id: 'preparation', label: 'Preparation', icon: ClipboardList, description: 'Requirements and checklist' },
    { id: 'notes', label: 'Notes & Follow-up', icon: MessageSquare, description: 'Notes and next steps' }
  ]

  const handleSave = () => {
    console.log('Updating visit:', formData)
    router.push(`/dashboard/visits/${params.id}`)
  }

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => {
      router.push('/dashboard/visits')
    }, 1000)
  }

  const addListItem = (field: string) => {
    setFormData({
      ...formData,
      [field]: [...formData[field as keyof typeof formData] as string[], '']
    })
  }

  const removeListItem = (field: string, index: number) => {
    const currentArray = formData[field as keyof typeof formData] as string[]
    setFormData({
      ...formData,
      [field]: currentArray.filter((_, i) => i !== index)
    })
  }

  const updateListItem = (field: string, index: number, value: string) => {
    const currentArray = [...formData[field as keyof typeof formData] as string[]]
    currentArray[index] = value
    setFormData({
      ...formData,
      [field]: currentArray
    })
  }

  const addAttendee = () => {
    setFormData({
      ...formData,
      attendees: [...formData.attendees, { name: '', role: '', email: '' }]
    })
  }

  const removeAttendee = (index: number) => {
    setFormData({
      ...formData,
      attendees: formData.attendees.filter((_, i) => i !== index)
    })
  }

  const updateAttendee = (index: number, field: string, value: string) => {
    const updatedAttendees = [...formData.attendees]
    updatedAttendees[index] = { ...updatedAttendees[index], [field]: value }
    setFormData({
      ...formData,
      attendees: updatedAttendees
    })
  }

  const toggleChecklistItem = (index: number) => {
    const updatedChecklist = [...formData.preparation.checklist]
    updatedChecklist[index].completed = !updatedChecklist[index].completed
    setFormData({
      ...formData,
      preparation: {
        ...formData.preparation,
        checklist: updatedChecklist
      }
    })
  }

  const toggleTag = (tag: string) => {
    const tags = formData.tags
    if (tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: tags.filter(t => t !== tag)
      })
    } else {
      setFormData({
        ...formData,
        tags: [...tags, tag]
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href={`/dashboard/visits/${params.id}`}
            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Visit</h1>
            <p className="text-gray-400">Update visit information and details</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push(`/dashboard/visits/${params.id}`)}
            className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className="w-64 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex flex-col items-start p-4 rounded-xl transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-3 w-full">
                    <div className={`p-2 rounded-lg ${
                      isActive ? 'bg-white/20' : 'bg-gray-700/50 group-hover:bg-gray-700'
                    }`}>
                      <tab.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{tab.label}</p>
                      <p className={`text-xs transition-colors ${
                        isActive ? 'text-purple-200' : 'text-gray-500'
                      }`}>
                        {tab.description}
                      </p>
                    </div>
                  </div>
                </button>
              )
            })}
          </nav>

          {/* Visit Summary */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Visit Summary</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Client</p>
                <p className="text-sm font-medium text-white">{mockVisit.clientName}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Date & Time</p>
                <p className="text-sm font-medium text-white">
                  {new Date(formData.scheduledDate).toLocaleDateString()} at {formData.scheduledTime}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Duration</p>
                <p className="text-sm font-medium text-white">{formData.duration} hours</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <span className={`text-sm font-medium ${
                  statusOptions.find(s => s.value === formData.status)?.color
                }`}>
                  {statusOptions.find(s => s.value === formData.status)?.label}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          {/* Basic Information Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Basic Information</h2>
                  <p className="text-gray-400 mt-1">Configure visit details and scheduling information</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    formData.status === 'scheduled' ? 'bg-blue-400' :
                    formData.status === 'completed' ? 'bg-green-400' :
                    formData.status === 'cancelled' ? 'bg-red-400' :
                    'bg-yellow-400'
                  }`}></div>
                  <span className="text-sm text-gray-400 capitalize">{formData.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Visit Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Visit Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  >
                    {visitTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  >
                    {priorityOptions.map(priority => (
                      <option key={priority.value} value={priority.value}>{priority.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Scheduled Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.scheduledDate}
                      onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Scheduled Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="time"
                      value={formData.scheduledTime}
                      onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Duration (hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">Visit Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const isSelected = formData.tags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          isSelected
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                        }`}
                      >
                        <Tag className="h-3 w-3 inline mr-1" />
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Location & Navigation Tab */}
          {activeTab === 'location' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Location & Navigation</h2>
                  <p className="text-gray-400 mt-1">Configure location details and access information</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all flex items-center space-x-2">
                    <Navigation className="h-4 w-4" />
                    <span>Get Directions</span>
                  </button>
                  <button className="px-4 py-2 rounded-lg gradient-purple text-white hover:opacity-90 transition-all flex items-center space-x-2">
                    <Compass className="h-4 w-4" />
                    <span>View on Map</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-4">Location Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <textarea
                        value={formData.location.address}
                        onChange={(e) => setFormData({
                          ...formData,
                          location: { ...formData.location, address: e.target.value }
                        })}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none"
                        rows={2}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Contact Person</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          value={formData.location.contactPerson}
                          onChange={(e) => setFormData({
                            ...formData,
                            location: { ...formData.location, contactPerson: e.target.value }
                          })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Contact Phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.location.contactPhone}
                          onChange={(e) => setFormData({
                            ...formData,
                            location: { ...formData.location, contactPhone: e.target.value }
                          })}
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Special Instructions</label>
                    <textarea
                      value={formData.location.instructions}
                      onChange={(e) => setFormData({
                        ...formData,
                        location: { ...formData.location, instructions: e.target.value }
                      })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none"
                      rows={3}
                      placeholder="Any special instructions for accessing the location"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
                  <Route className="h-5 w-5 text-purple-400" />
                  <span>Travel Information</span>
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Estimated Travel Time</label>
                    <input
                      type="text"
                      placeholder="e.g., 45 minutes"
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Parking Information</label>
                    <select className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all">
                      <option value="">Select parking type</option>
                      <option value="free">Free parking available</option>
                      <option value="paid">Paid parking</option>
                      <option value="street">Street parking</option>
                      <option value="none">No parking available</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Participants Tab */}
          {activeTab === 'participants' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Participants</h2>
                  <p className="text-gray-400 mt-1">Manage attendees and contact information</p>
                </div>
                <button
                  onClick={addAttendee}
                  className="px-4 py-2 rounded-lg gradient-purple text-white hover:opacity-90 transition-all flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Participant</span>
                </button>
              </div>

              <div className="bg-gray-800/30 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  <span>Team Members</span>
                </h3>

                <div className="space-y-3">
                  {formData.attendees.map((attendee, index) => (
                    <div key={index} className="p-4 rounded-lg border border-gray-700 bg-gray-800/30">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Name</label>
                          <input
                            type="text"
                            value={attendee.name}
                            onChange={(e) => updateAttendee(index, 'name', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white text-sm focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                            placeholder="Full name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Role</label>
                          <input
                            type="text"
                            value={attendee.role}
                            onChange={(e) => updateAttendee(index, 'role', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white text-sm focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                            placeholder="Job title"
                          />
                        </div>
                        <div className="flex items-end space-x-2">
                          <div className="flex-1">
                            <label className="block text-xs text-gray-400 mb-1">Email</label>
                            <input
                              type="email"
                              value={attendee.email}
                              onChange={(e) => updateAttendee(index, 'email', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white text-sm focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                              placeholder="email@company.com"
                            />
                          </div>
                          {formData.attendees.length > 1 && (
                            <button
                              onClick={() => removeAttendee(index)}
                              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
                            >
                              <Minus className="h-4 w-4 text-red-400" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Preparation Tab */}
          {activeTab === 'preparation' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Preparation & Requirements</h2>
                  <p className="text-gray-400 mt-1">Manage objectives, requirements, and preparation checklist</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    formData.preparation.completed ? 'bg-green-400' : 'bg-yellow-400'
                  }`}></div>
                  <span className="text-sm text-gray-400">
                    {formData.preparation.completed ? 'Ready' : 'In Progress'}
                  </span>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
                  <Target className="h-5 w-5 text-purple-400" />
                  <span>Visit Objectives</span>
                </h3>
                <div className="space-y-3">
                  {formData.objectives.map((objective, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 rounded-lg bg-gray-900/50">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => updateListItem('objectives', index, e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                        placeholder="Enter objective"
                      />
                      {formData.objectives.length > 1 && (
                        <button
                          onClick={() => removeListItem('objectives', index)}
                          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <Minus className="h-4 w-4 text-red-400" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addListItem('objectives')}
                    className="w-full p-3 rounded-lg border-2 border-dashed border-gray-600 text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-all flex items-center justify-center space-x-2"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Objective</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Required Items/Equipment</label>
                <div className="space-y-2">
                  {formData.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) => updateListItem('requirements', index, e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                        placeholder="Enter requirement"
                      />
                      {formData.requirements.length > 1 && (
                        <button
                          onClick={() => removeListItem('requirements', index)}
                          className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                        >
                          <Minus className="h-4 w-4 text-red-400" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addListItem('requirements')}
                    className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Requirement</span>
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">Preparation Checklist</h3>
                <div className="space-y-3">
                  {formData.preparation.checklist.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/30">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleChecklistItem(index)}
                          className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <span className={`text-sm ${item.completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                          {item.item}
                        </span>
                      </label>
                      {item.completed && <CheckCircle className="h-4 w-4 text-green-400" />}
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Preparation Status</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">
                        {formData.preparation.checklist.filter(item => item.completed).length}/
                        {formData.preparation.checklist.length} Complete
                      </span>
                      {formData.preparation.completed ? (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes & Follow-up Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Notes & Follow-up</h2>
                  <p className="text-gray-400 mt-1">Add notes and configure follow-up actions</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    formData.followUp.required ? 'bg-orange-400' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm text-gray-400">
                    {formData.followUp.required ? 'Follow-up Required' : 'No Follow-up'}
                  </span>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-purple-400" />
                  <span>Visit Notes</span>
                </h3>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none"
                  rows={6}
                  placeholder="Add detailed notes about this visit, observations, or important information..."
                />
                <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
                  <span>Last updated: {new Date(mockVisit.lastModified).toLocaleString()}</span>
                  <span>{formData.notes.length} characters</span>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-purple-400" />
                  <span>Quick Actions</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors flex items-center space-x-2 text-gray-300">
                    <Camera className="h-4 w-4" />
                    <span>Add Photos</span>
                  </button>
                  <button className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors flex items-center space-x-2 text-gray-300">
                    <Upload className="h-4 w-4" />
                    <span>Upload Files</span>
                  </button>
                  <button className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors flex items-center space-x-2 text-gray-300">
                    <Bell className="h-4 w-4" />
                    <span>Set Reminder</span>
                  </button>
                  <button className="p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors flex items-center space-x-2 text-gray-300">
                    <Mail className="h-4 w-4" />
                    <span>Send Update</span>
                  </button>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-xl p-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-orange-400" />
                  <span>Follow-up Requirements</span>
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30">
                    <div>
                      <p className="text-white font-medium">Follow-up Required</p>
                      <p className="text-sm text-gray-400">Schedule a follow-up after this visit</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.followUp.required}
                        onChange={(e) => setFormData({
                          ...formData,
                          followUp: { ...formData.followUp, required: e.target.checked }
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  {formData.followUp.required && (
                    <div className="space-y-4 p-4 rounded-lg bg-gray-900/50">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Follow-up Date</label>
                          <input
                            type="date"
                            value={formData.followUp.scheduledDate}
                            onChange={(e) => setFormData({
                              ...formData,
                              followUp: { ...formData.followUp, scheduledDate: e.target.value }
                            })}
                            className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Follow-up Type</label>
                          <select className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all">
                            <option value="call">Phone Call</option>
                            <option value="email">Email</option>
                            <option value="meeting">In-Person Meeting</option>
                            <option value="video">Video Call</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Follow-up Notes</label>
                        <textarea
                          value={formData.followUp.notes}
                          onChange={(e) => setFormData({
                            ...formData,
                            followUp: { ...formData.followUp, notes: e.target.value }
                          })}
                          className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none"
                          rows={3}
                          placeholder="Notes for the follow-up action..."
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                        <div className="flex items-center space-x-2">
                          <Bell className="h-4 w-4 text-orange-400" />
                          <span className="text-sm text-orange-400">Reminder will be set for this follow-up</span>
                        </div>
                        <button className="text-xs text-orange-400 hover:text-orange-300 transition-colors">Configure</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                  Danger Zone
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
                    <div>
                      <p className="text-white font-medium">Archive Visit</p>
                      <p className="text-sm text-gray-400">Hide this visit from active listings</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg border border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 transition-colors flex items-center space-x-2">
                      <Archive className="h-4 w-4" />
                      <span>Archive</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                    <div>
                      <p className="text-white font-medium">Delete Visit</p>
                      <p className="text-sm text-gray-400">Permanently delete this visit and all associated data</p>
                    </div>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}