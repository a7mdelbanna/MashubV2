'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Calendar, Clock, MapPin, Users, Video,
  Phone, Mail, Edit, Trash2, CheckCircle, XCircle,
  AlertCircle, FileText, MessageSquare, Download,
  Share2, DollarSign, Building2, Package, User,
  Globe, Monitor, Send, MoreVertical, Copy,
  ExternalLink, Printer, Archive
} from 'lucide-react'

// Mock visit data - in reality this would come from an API
const mockVisit = {
  id: 'VIS-2024-001',
  type: 'onsite' as 'onsite' | 'online' | 'hybrid',
  status: 'scheduled' as 'scheduled' | 'completed' | 'cancelled' | 'in_progress',
  client: {
    id: 'CLT-001',
    name: 'Tech Innovators Inc.',
    contact: 'John Smith',
    email: 'john@techinnovators.com',
    phone: '+1 555-0100',
    image: 'https://via.placeholder.com/150'
  },
  service: {
    id: 'SRV-001',
    name: 'Business Strategy Consultation',
    category: 'Consulting',
    price: 5000
  },
  date: '2024-12-20',
  time: '10:00 AM',
  duration: '2 hours',
  location: {
    type: 'Client Office',
    address: '123 Tech Street, Innovation City, IC 12345',
    room: 'Conference Room A',
    floor: '5th Floor'
  },
  attendees: [
    { name: 'John Smith', role: 'CEO', email: 'john@techinnovators.com', status: 'confirmed' },
    { name: 'Sarah Johnson', role: 'CTO', email: 'sarah@techinnovators.com', status: 'confirmed' },
    { name: 'Mike Wilson', role: 'Project Manager', email: 'mike@techinnovators.com', status: 'pending' }
  ],
  consultants: [
    { name: 'Ahmed Hassan', role: 'Senior Consultant', email: 'ahmed@mashub.com', status: 'confirmed' }
  ],
  agenda: [
    { time: '10:00 AM', item: 'Introduction & Objectives', duration: '15 min' },
    { time: '10:15 AM', item: 'Current State Analysis', duration: '45 min' },
    { time: '11:00 AM', item: 'Strategy Presentation', duration: '45 min' },
    { time: '11:45 AM', item: 'Q&A and Next Steps', duration: '15 min' }
  ],
  notes: 'Important meeting to discuss Q1 2025 strategy implementation. Client has expressed interest in digital transformation initiatives.',
  documents: [
    { name: 'Strategy Proposal.pdf', size: '2.4 MB', uploadedAt: '2024-12-10' },
    { name: 'Meeting Agenda.docx', size: '245 KB', uploadedAt: '2024-12-12' }
  ],
  meetingLink: 'https://zoom.us/j/123456789',
  dialIn: '+1 555-0000 (PIN: 123456)',
  createdAt: '2024-12-01',
  createdBy: 'Admin User'
}

export default function VisitDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)

  const visit = mockVisit // In reality, fetch based on params.id

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'in_progress': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'onsite': return <MapPin className="h-4 w-4" />
      case 'online': return <Video className="h-4 w-4" />
      case 'hybrid': return <Globe className="h-4 w-4" />
      default: return <Calendar className="h-4 w-4" />
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'attendees', label: 'Attendees' },
    { id: 'agenda', label: 'Agenda' },
    { id: 'documents', label: 'Documents' },
    { id: 'notes', label: 'Notes' }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/visits"
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold text-white">Visit {visit.id}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(visit.status)}`}>
                {visit.status.toUpperCase()}
              </span>
              <span className="flex items-center px-3 py-1 rounded-full text-xs font-medium text-purple-400 bg-purple-400/10 border border-purple-400/20">
                {getTypeIcon(visit.type)}
                <span className="ml-1">{visit.type.toUpperCase()}</span>
              </span>
            </div>
            <p className="text-gray-400 mt-2">
              Created on {visit.createdAt} by {visit.createdBy}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white">
            <Printer className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white">
            <Share2 className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors text-gray-400 hover:text-white">
            <Archive className="h-5 w-5" />
          </button>
          <button
            onClick={() => router.push(`/dashboard/visits/${params.id}/edit`)}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl text-white font-medium hover:opacity-90 transition-opacity flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Visit
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-600/10 border border-red-600/20 rounded-xl text-red-400 font-medium hover:bg-red-600/20 transition-colors flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Cancel Visit
          </button>
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="rounded-2xl bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-5 w-5 text-purple-400" />
            <span className="text-xs text-gray-500">Date & Time</span>
          </div>
          <p className="text-white font-medium">{visit.date}</p>
          <p className="text-gray-400 text-sm">{visit.time} ({visit.duration})</p>
        </div>

        <div className="rounded-2xl bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <Building2 className="h-5 w-5 text-blue-400" />
            <span className="text-xs text-gray-500">Client</span>
          </div>
          <Link href={`/dashboard/clients/${visit.client.id}`} className="hover:text-purple-400 transition-colors">
            <p className="text-white font-medium">{visit.client.name}</p>
            <p className="text-gray-400 text-sm">{visit.client.contact}</p>
          </Link>
        </div>

        <div className="rounded-2xl bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <Package className="h-5 w-5 text-green-400" />
            <span className="text-xs text-gray-500">Service</span>
          </div>
          <p className="text-white font-medium">{visit.service.name}</p>
          <p className="text-gray-400 text-sm">${visit.service.price.toLocaleString()}</p>
        </div>

        <div className="rounded-2xl bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <MapPin className="h-5 w-5 text-orange-400" />
            <span className="text-xs text-gray-500">Location</span>
          </div>
          <p className="text-white font-medium">{visit.location.type}</p>
          <p className="text-gray-400 text-sm">{visit.location.room}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-800/30 p-1 rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rounded-2xl bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Meeting Details */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Meeting Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-400 text-sm">Location</p>
                      <p className="text-white">{visit.location.address}</p>
                      <p className="text-gray-400 text-sm">{visit.location.floor}, {visit.location.room}</p>
                    </div>
                  </div>
                  {visit.type !== 'onsite' && (
                    <div className="flex items-start space-x-3">
                      <Video className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-400 text-sm">Meeting Link</p>
                        <a href={visit.meetingLink} className="text-purple-400 hover:text-purple-300">
                          Join Online Meeting
                        </a>
                      </div>
                    </div>
                  )}
                  {visit.dialIn && (
                    <div className="flex items-start space-x-3">
                      <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-gray-400 text-sm">Dial-in</p>
                        <p className="text-white">{visit.dialIn}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-400 text-sm">Attendees</p>
                      <p className="text-white">{visit.attendees.length + visit.consultants.length} participants</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-400 text-sm">Duration</p>
                      <p className="text-white">{visit.duration}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 bg-purple-600/10 border border-purple-600/20 rounded-xl text-purple-400 font-medium hover:bg-purple-600/20 transition-colors flex items-center">
                  <Video className="h-4 w-4 mr-2" />
                  Join Meeting
                </button>
                <button
                  onClick={() => setShowRescheduleModal(true)}
                  className="px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-xl text-blue-400 font-medium hover:bg-blue-600/20 transition-colors flex items-center"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Reschedule
                </button>
                <button className="px-4 py-2 bg-green-600/10 border border-green-600/20 rounded-xl text-green-400 font-medium hover:bg-green-600/20 transition-colors flex items-center">
                  <Send className="h-4 w-4 mr-2" />
                  Send Reminder
                </button>
                <button className="px-4 py-2 bg-orange-600/10 border border-orange-600/20 rounded-xl text-orange-400 font-medium hover:bg-orange-600/20 transition-colors flex items-center">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate Visit
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attendees' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Client Attendees</h3>
              <div className="space-y-3">
                {visit.attendees.map((attendee, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center text-white font-medium">
                        {attendee.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-white font-medium">{attendee.name}</p>
                        <p className="text-gray-400 text-sm">{attendee.role} • {attendee.email}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      attendee.status === 'confirmed'
                        ? 'text-green-400 bg-green-400/10 border border-green-400/20'
                        : 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20'
                    }`}>
                      {attendee.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4">MAS Consultants</h3>
              <div className="space-y-3">
                {visit.consultants.map((consultant, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center text-white font-medium">
                        {consultant.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-white font-medium">{consultant.name}</p>
                        <p className="text-gray-400 text-sm">{consultant.role} • {consultant.email}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      consultant.status === 'confirmed'
                        ? 'text-green-400 bg-green-400/10 border border-green-400/20'
                        : 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20'
                    }`}>
                      {consultant.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agenda' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Meeting Agenda</h3>
              <button className="text-purple-400 hover:text-purple-300 text-sm">+ Add Item</button>
            </div>
            {visit.agenda.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl">
                <div className="text-purple-400 font-medium">{item.time}</div>
                <div className="flex-1">
                  <p className="text-white">{item.item}</p>
                  <p className="text-gray-400 text-sm">Duration: {item.duration}</p>
                </div>
                <button className="text-gray-400 hover:text-white">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Documents</h3>
              <button className="text-purple-400 hover:text-purple-300 text-sm">+ Upload Document</button>
            </div>
            {visit.documents.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                <div className="flex items-center space-x-4">
                  <FileText className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-white">{doc.name}</p>
                    <p className="text-gray-400 text-sm">{doc.size} • Uploaded {doc.uploadedAt}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white">
                    <Download className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white">
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Meeting Notes</h3>
            <div className="bg-gray-800/50 rounded-xl p-4">
              <p className="text-gray-300">{visit.notes}</p>
            </div>
            <textarea
              placeholder="Add additional notes..."
              className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors resize-none"
              rows={4}
            />
            <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl text-white font-medium hover:opacity-90 transition-opacity">
              Save Notes
            </button>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Cancel Visit</h3>
            <p className="text-gray-400 mb-6">
              Are you sure you want to cancel this visit? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-gray-800 rounded-xl text-white font-medium hover:bg-gray-700 transition-colors"
              >
                Keep Visit
              </button>
              <button
                onClick={() => {
                  // Handle deletion
                  router.push('/dashboard/visits')
                }}
                className="flex-1 px-4 py-2 bg-red-600 rounded-xl text-white font-medium hover:bg-red-700 transition-colors"
              >
                Cancel Visit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Reschedule Visit</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">New Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">New Time</label>
                <input
                  type="time"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Reason for Rescheduling</label>
                <textarea
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                  rows={3}
                  placeholder="Optional..."
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="flex-1 px-4 py-2 bg-gray-800 rounded-xl text-white font-medium hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Handle rescheduling
                  setShowRescheduleModal(false)
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl text-white font-medium hover:opacity-90 transition-opacity"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}