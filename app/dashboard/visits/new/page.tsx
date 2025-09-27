'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Calendar, MapPin, Video, Globe,
  Building, User, Clock, DollarSign, FileText,
  ChevronRight, Search, CheckCircle, Users,
  Phone, Mail, Plus, Save, AlertCircle, Zap
} from 'lucide-react'

const clients = [
  { id: 'c1', name: 'TechCorp Solutions', contact: 'John Smith', email: 'john@techcorp.com', phone: '+1 555-123-4567' },
  { id: 'c2', name: 'StartupHub', contact: 'Emily Brown', email: 'emily@startuphub.com', phone: '+1 555-234-5678' },
  { id: 'c3', name: 'MegaStore Inc', contact: 'Michael Chen', email: 'michael@megastore.com', phone: '+1 555-345-6789' },
  { id: 'c4', name: 'Local Boutique', contact: 'Lisa Johnson', email: 'lisa@boutique.com', phone: '+1 555-456-7890' },
  { id: 'c5', name: 'Enterprise Solutions', contact: 'David Lee', email: 'david@enterprise.com', phone: '+1 555-567-8901' }
]

const services = [
  { id: 's1', name: 'ShopLeez POS', type: 'Software Implementation' },
  { id: 's2', name: 'E-Commerce Platform', type: 'Website Development' },
  { id: 's3', name: 'CRM System', type: 'Software Implementation' },
  { id: 's4', name: 'Mobile Banking App', type: 'Mobile Development' },
  { id: 's5', name: 'Learning Management System', type: 'Platform Setup' }
]

const visitReasons = [
  'Initial Consultation',
  'Product Demo',
  'Technical Support',
  'Training Session',
  'Quarterly Business Review',
  'Project Kickoff',
  'System Installation',
  'Troubleshooting',
  'Contract Discussion',
  'Follow-up Meeting'
]

const accountManagers = [
  { id: 'am1', name: 'Sarah Wilson', email: 'sarah.wilson@company.com' },
  { id: 'am2', name: 'Tom Anderson', email: 'tom.anderson@company.com' },
  { id: 'am3', name: 'Jennifer Lee', email: 'jennifer.lee@company.com' },
  { id: 'am4', name: 'Mark Thompson', email: 'mark.thompson@company.com' }
]

export default function NewVisitPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedClient, setSelectedClient] = useState(searchParams.get('client') || '')
  const [visitType, setVisitType] = useState<'onsite' | 'online' | 'hybrid'>('onsite')
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    duration: '1 hour',
    service: '',
    reason: '',
    customReason: '',
    description: '',
    location: '',
    meetingLink: '',
    attendees: [''],
    accountManager: '',
    cost: 0,
    requiresPayment: false,
    followUpRequired: false,
    notes: ''
  })

  useEffect(() => {
    if (searchParams.get('client')) {
      setSelectedClient(searchParams.get('client') || '')
    }
  }, [searchParams])

  const steps = [
    { number: 1, title: 'Client & Service', icon: Building },
    { number: 2, title: 'Visit Details', icon: Calendar },
    { number: 3, title: 'Location & Attendees', icon: Users },
    { number: 4, title: 'Review & Schedule', icon: CheckCircle }
  ]

  const handleAddAttendee = () => {
    setFormData({...formData, attendees: [...formData.attendees, '']})
  }

  const handleRemoveAttendee = (index: number) => {
    setFormData({
      ...formData,
      attendees: formData.attendees.filter((_, i) => i !== index)
    })
  }

  const handleAttendeeChange = (index: number, value: string) => {
    const newAttendees = [...formData.attendees]
    newAttendees[index] = value
    setFormData({...formData, attendees: newAttendees})
  }

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1)
  }

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const handleSubmit = () => {
    // Handle form submission
    router.push('/dashboard/visits')
  }

  const selectedClientData = clients.find(c => c.id === selectedClient)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/visits"
            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Schedule Visit</h1>
            <p className="text-gray-400">Create a new client visit</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center space-x-3 ${
                step.number === currentStep ? 'text-white' :
                step.number < currentStep ? 'text-green-400' : 'text-gray-500'
              }`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                  step.number === currentStep ? 'border-purple-500 bg-purple-500' :
                  step.number < currentStep ? 'border-green-400 bg-green-400' : 'border-gray-600'
                }`}>
                  {step.number < currentStep ? (
                    <CheckCircle className="h-5 w-5 text-white" />
                  ) : (
                    <step.icon className="h-5 w-5 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-gray-500">Step {step.number}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <ChevronRight className="h-5 w-5 text-gray-600 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
        {/* Step 1: Client & Service */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Select Client & Service</h2>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Client
              </label>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {clients.map((client) => (
                  <button
                    key={client.id}
                    type="button"
                    onClick={() => setSelectedClient(client.id)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedClient === client.id
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                          <Building className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{client.name}</p>
                          <p className="text-sm text-gray-400">{client.contact}</p>
                          <p className="text-xs text-gray-500">{client.email}</p>
                        </div>
                      </div>
                      {selectedClient === client.id && (
                        <CheckCircle className="h-5 w-5 text-purple-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Related Service (Optional)
              </label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({...formData, service: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="">Select a service</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} - {service.type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 2: Visit Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Visit Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Visit Type
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setVisitType('onsite')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    visitType === 'onsite'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <MapPin className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-white font-medium">Onsite</p>
                  <p className="text-xs text-gray-400 mt-1">In-person visit</p>
                </button>

                <button
                  type="button"
                  onClick={() => setVisitType('online')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    visitType === 'online'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <Video className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-white font-medium">Online</p>
                  <p className="text-xs text-gray-400 mt-1">Virtual meeting</p>
                </button>

                <button
                  type="button"
                  onClick={() => setVisitType('hybrid')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    visitType === 'hybrid'
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <Globe className="h-6 w-6 text-green-400 mx-auto mb-2" />
                  <p className="text-white font-medium">Hybrid</p>
                  <p className="text-xs text-gray-400 mt-1">Both options</p>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Duration
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                >
                  <option value="30 minutes">30 minutes</option>
                  <option value="1 hour">1 hour</option>
                  <option value="1.5 hours">1.5 hours</option>
                  <option value="2 hours">2 hours</option>
                  <option value="3 hours">3 hours</option>
                  <option value="Half day">Half day</option>
                  <option value="Full day">Full day</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Reason for Visit
                </label>
                <select
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                >
                  <option value="">Select reason</option>
                  {visitReasons.map(reason => (
                    <option key={reason} value={reason}>{reason}</option>
                  ))}
                  <option value="other">Other (specify)</option>
                </select>
              </div>

              {formData.reason === 'other' && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Custom Reason
                  </label>
                  <input
                    type="text"
                    value={formData.customReason}
                    onChange={(e) => setFormData({...formData, customReason: e.target.value})}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Enter custom reason..."
                  />
                </div>
              )}

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                  placeholder="Provide more details about the visit..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Location & Attendees */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Location & Participants</h2>

            {(visitType === 'onsite' || visitType === 'hybrid') && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Visit Location
                </label>
                <textarea
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                  placeholder="Enter the visit address..."
                />
              </div>
            )}

            {(visitType === 'online' || visitType === 'hybrid') && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Meeting Link
                </label>
                <input
                  type="url"
                  value={formData.meetingLink}
                  onChange={(e) => setFormData({...formData, meetingLink: e.target.value})}
                  className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="https://zoom.us/j/..."
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Account Manager
              </label>
              <select
                value={formData.accountManager}
                onChange={(e) => setFormData({...formData, accountManager: e.target.value})}
                className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
              >
                <option value="">Select account manager</option>
                {accountManagers.map(am => (
                  <option key={am.id} value={am.id}>
                    {am.name} - {am.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-400">
                  Attendees
                </label>
                <button
                  type="button"
                  onClick={handleAddAttendee}
                  className="text-purple-400 hover:text-purple-300 text-sm flex items-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add attendee</span>
                </button>
              </div>
              <div className="space-y-2">
                {formData.attendees.map((attendee, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={attendee}
                      onChange={(e) => handleAttendeeChange(index, e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="Name or email..."
                    />
                    {formData.attendees.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveAttendee(index)}
                        className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        <X className="h-4 w-4 text-red-400" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Visit Cost
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: parseFloat(e.target.value)})}
                    className="w-full pl-8 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="flex items-end space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.requiresPayment}
                    onChange={(e) => setFormData({...formData, requiresPayment: e.target.checked})}
                    className="w-4 h-4 rounded text-purple-500"
                  />
                  <span className="text-white">Requires payment</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.followUpRequired}
                    onChange={(e) => setFormData({...formData, followUpRequired: e.target.checked})}
                    className="w-4 h-4 rounded text-purple-500"
                  />
                  <span className="text-white">Follow-up required</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
                className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                placeholder="Any additional notes..."
              />
            </div>
          </div>
        )}

        {/* Step 4: Review & Schedule */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-4">Review Visit Details</h2>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Client Information</h3>
                  <div className="p-4 rounded-lg bg-gray-800/50">
                    <p className="text-white font-medium">{selectedClientData?.name}</p>
                    <p className="text-sm text-gray-400">{selectedClientData?.contact}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <Mail className="h-3 w-3" />
                        <span>{selectedClientData?.email}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-400">
                        <Phone className="h-3 w-3" />
                        <span>{selectedClientData?.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Visit Type</h3>
                  <div className="p-4 rounded-lg bg-gray-800/50">
                    <div className="flex items-center space-x-2">
                      {visitType === 'onsite' ? <MapPin className="h-5 w-5 text-blue-400" /> :
                       visitType === 'online' ? <Video className="h-5 w-5 text-purple-400" /> :
                       <Globe className="h-5 w-5 text-green-400" />}
                      <span className="text-white capitalize">{visitType}</span>
                    </div>
                    {formData.location && (
                      <p className="text-sm text-gray-400 mt-2">{formData.location}</p>
                    )}
                    {formData.meetingLink && (
                      <p className="text-sm text-blue-400 mt-2 truncate">{formData.meetingLink}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Schedule</h3>
                  <div className="p-4 rounded-lg bg-gray-800/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Date</span>
                      <span className="text-white">{formData.date || 'Not set'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Time</span>
                      <span className="text-white">{formData.time || 'Not set'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Duration</span>
                      <span className="text-white">{formData.duration}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-400 mb-2">Details</h3>
                  <div className="p-4 rounded-lg bg-gray-800/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Reason</span>
                      <span className="text-white">{formData.reason === 'other' ? formData.customReason : formData.reason || 'Not specified'}</span>
                    </div>
                    {formData.service && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Service</span>
                        <span className="text-white">{services.find(s => s.id === formData.service)?.name}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Cost</span>
                      <span className={formData.cost > 0 ? 'text-green-400' : 'text-gray-400'}>
                        {formData.cost > 0 ? `$${formData.cost}` : 'Free'}
                      </span>
                    </div>
                  </div>
                </div>

                {formData.attendees.filter(a => a).length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Attendees</h3>
                    <div className="p-4 rounded-lg bg-gray-800/50">
                      {formData.attendees.filter(a => a).map((attendee, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-1">
                          <User className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-300">{attendee}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {(formData.requiresPayment || formData.followUpRequired) && (
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  <p className="text-yellow-400 font-medium">Action Items</p>
                </div>
                <ul className="mt-2 space-y-1 text-sm text-gray-300">
                  {formData.requiresPayment && <li>• Payment collection required</li>}
                  {formData.followUpRequired && <li>• Follow-up visit needed</li>}
                </ul>
              </div>
            )}

            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <p className="text-green-400 font-medium">Ready to schedule visit</p>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                The visit will be added to the calendar and notifications will be sent to all attendees.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push('/dashboard/visits')}
          className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all"
        >
          Cancel
        </button>

        <div className="flex items-center space-x-3">
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all"
            >
              Previous
            </button>
          )}

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={currentStep === 1 && !selectedClient}
              className="px-6 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-6 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
            >
              <Calendar className="h-4 w-4" />
              <span>Schedule Visit</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}