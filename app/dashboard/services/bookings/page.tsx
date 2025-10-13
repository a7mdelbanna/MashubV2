'use client'

import { useState } from 'react'
import { Calendar, Clock, Users, CheckCircle, XCircle, AlertCircle, Video, MapPin, Plus, Filter } from 'lucide-react'

interface Booking {
  id: string
  bookingNumber: string
  serviceId: string
  serviceName: string
  serviceType: 'consultation' | 'training' | 'support' | 'meeting'
  clientId: string
  clientName: string
  clientEmail: string
  date: string
  startTime: string
  endTime: string
  duration: number
  status: 'scheduled' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  location: 'on_site' | 'remote' | 'office'
  meetingLink?: string
  notes?: string
  assignedTo: string
  attendees: number
}

const mockBookings: Booking[] = [
  {
    id: 'b1',
    bookingNumber: 'BK-2024-001',
    serviceId: 's1',
    serviceName: 'ShopLeez POS',
    serviceType: 'training',
    clientId: 'c1',
    clientName: 'TechCorp Inc.',
    clientEmail: 'training@techcorp.com',
    date: '2024-03-18',
    startTime: '10:00',
    endTime: '12:00',
    duration: 120,
    status: 'confirmed',
    location: 'remote',
    meetingLink: 'https://meet.zoom.us/abc123',
    notes: 'Advanced POS features training for 5 staff members',
    assignedTo: 'John Smith',
    attendees: 5
  },
  {
    id: 'b2',
    bookingNumber: 'BK-2024-002',
    serviceId: 's4',
    serviceName: 'CRM System',
    serviceType: 'consultation',
    clientId: 'c3',
    clientName: 'GlobalHR Solutions',
    clientEmail: 'ops@globalhr.com',
    date: '2024-03-15',
    startTime: '14:00',
    endTime: '15:30',
    duration: 90,
    status: 'completed',
    location: 'office',
    notes: 'Initial consultation for CRM implementation',
    assignedTo: 'Sarah Johnson',
    attendees: 3
  },
  {
    id: 'b3',
    bookingNumber: 'BK-2024-003',
    serviceId: 's2',
    serviceName: 'E-Commerce Platform',
    serviceType: 'support',
    clientId: 'c4',
    clientName: 'RetailChain Pro',
    clientEmail: 'support@retailchain.com',
    date: '2024-03-16',
    startTime: '09:00',
    endTime: '10:00',
    duration: 60,
    status: 'no_show',
    location: 'remote',
    meetingLink: 'https://meet.zoom.us/xyz789',
    notes: 'Technical support for checkout issues',
    assignedTo: 'Mike Chen',
    attendees: 2
  },
  {
    id: 'b4',
    bookingNumber: 'BK-2024-004',
    serviceId: 's3',
    serviceName: 'Mobile Banking App',
    serviceType: 'meeting',
    clientId: 'c2',
    clientName: 'FinanceHub',
    clientEmail: 'project@financehub.com',
    date: '2024-03-20',
    startTime: '15:00',
    endTime: '16:00',
    duration: 60,
    status: 'scheduled',
    location: 'on_site',
    notes: 'Sprint planning and feature review',
    assignedTo: 'Emily Davis',
    attendees: 8
  },
  {
    id: 'b5',
    bookingNumber: 'BK-2024-005',
    serviceId: 's5',
    serviceName: 'Restaurant Management',
    serviceType: 'training',
    clientId: 'c5',
    clientName: 'Gourmet Bistro',
    clientEmail: 'owner@gourmetbistro.com',
    date: '2024-03-22',
    startTime: '11:00',
    endTime: '13:00',
    duration: 120,
    status: 'scheduled',
    location: 'on_site',
    notes: 'On-site training for restaurant staff',
    assignedTo: 'Alex Rodriguez',
    attendees: 6
  },
  {
    id: 'b6',
    bookingNumber: 'BK-2024-006',
    serviceId: 's1',
    serviceName: 'ShopLeez POS',
    serviceType: 'support',
    clientId: 'c6',
    clientName: 'Fashion Retail Co.',
    clientEmail: 'it@fashionretail.com',
    date: '2024-03-17',
    startTime: '16:00',
    endTime: '17:00',
    duration: 60,
    status: 'in_progress',
    location: 'remote',
    meetingLink: 'https://meet.zoom.us/def456',
    notes: 'Inventory sync troubleshooting',
    assignedTo: 'John Smith',
    attendees: 2
  }
]

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(mockBookings)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')

  const stats = {
    total: bookings.length,
    scheduled: bookings.filter(b => b.status === 'scheduled').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    noShow: bookings.filter(b => b.status === 'no_show').length,
    totalHours: bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + b.duration, 0) / 60
  }

  const filteredBookings = bookings.filter(b => {
    const matchesDate = !selectedDate || b.date === selectedDate
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus
    const matchesType = filterType === 'all' || b.serviceType === filterType
    return matchesDate && matchesStatus && matchesType
  }).sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.startTime}`)
    const dateB = new Date(`${b.date} ${b.startTime}`)
    return dateB.getTime() - dateA.getTime()
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400'
      case 'confirmed':
        return 'bg-green-500/20 text-green-400'
      case 'in_progress':
        return 'bg-purple-500/20 text-purple-400'
      case 'completed':
        return 'bg-gray-500/20 text-gray-400'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400'
      case 'no_show':
        return 'bg-orange-500/20 text-orange-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation':
        return <Users className="w-4 h-4" />
      case 'training':
        return <Calendar className="w-4 h-4" />
      case 'support':
        return <AlertCircle className="w-4 h-4" />
      case 'meeting':
        return <Video className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Service Bookings</h1>
          <p className="text-gray-400">Schedule and manage service appointments</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
          New Booking
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.total}</p>
          <p className="text-sm text-gray-400">Total Bookings</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.confirmed}</p>
          <p className="text-sm text-gray-400">Confirmed</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.totalHours.toFixed(0)}h</p>
          <p className="text-sm text-gray-400">Total Hours</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.noShow}</p>
          <p className="text-sm text-gray-400">No Shows</p>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No Show</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Types</option>
            <option value="consultation">Consultation</option>
            <option value="training">Training</option>
            <option value="support">Support</option>
            <option value="meeting">Meeting</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:bg-gray-700/30 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{booking.bookingNumber}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="flex items-center gap-1 px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                    {getTypeIcon(booking.serviceType)}
                    {booking.serviceType}
                  </span>
                </div>

                <p className="text-sm text-gray-400 mb-4">{booking.serviceName} • {booking.clientName}</p>

                <div className="grid grid-cols-5 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Date & Time</p>
                    <p className="text-sm font-medium text-white">{new Date(booking.date).toLocaleDateString()}</p>
                    <p className="text-xs text-gray-400">{booking.startTime} - {booking.endTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Duration</p>
                    <p className="text-sm font-medium text-white">{booking.duration} min</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Location</p>
                    <div className="flex items-center gap-1">
                      {booking.location === 'remote' ? (
                        <Video className="w-3 h-3 text-blue-400" />
                      ) : (
                        <MapPin className="w-3 h-3 text-green-400" />
                      )}
                      <p className="text-sm font-medium text-white capitalize">{booking.location}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Assigned To</p>
                    <p className="text-sm font-medium text-white">{booking.assignedTo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Attendees</p>
                    <p className="text-sm font-medium text-white">{booking.attendees} people</p>
                  </div>
                </div>

                {booking.notes && (
                  <div className="p-3 bg-gray-900/50 rounded-lg mb-3">
                    <p className="text-sm text-gray-300">{booking.notes}</p>
                  </div>
                )}

                {booking.meetingLink && (
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-400" />
                    <a
                      href={booking.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Join Meeting
                    </a>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                {booking.status === 'scheduled' && (
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm">
                    Confirm
                  </button>
                )}
                {booking.status === 'confirmed' && (
                  <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm">
                    Start
                  </button>
                )}
                {booking.status === 'in_progress' && (
                  <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm">
                    Complete
                  </button>
                )}
                <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No bookings found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
