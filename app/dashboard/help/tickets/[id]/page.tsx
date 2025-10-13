'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Send,
  Paperclip,
  Clock,
  User,
  Tag,
  MoreVertical,
  Edit,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  Lock,
  Unlock,
  Star,
  Calendar,
  Download,
  Eye,
  Trash2
} from 'lucide-react'
import { SupportTicket, TicketMessage, InternalNote, TicketStatus, TicketPriority } from '@/types/help'
import {
  getTicketStatusColor,
  getTicketPriorityColor,
  formatTicketStatus,
  formatTicketPriority,
  formatTicketType,
  formatResponseTime,
  getTicketDueDate,
  getTimeRemaining
} from '@/lib/help-utils'

// Mock ticket data
const mockTicket: SupportTicket = {
  id: 'tick-1',
  tenantId: 'tenant-1',
  ticketNumber: 'TICK-10245',
  subject: 'Unable to access team dashboard',
  description: 'I\'m getting a 403 error when trying to access the team dashboard page. This started happening this morning after I updated my account permissions.',
  type: 'technical_issue',
  status: 'in_progress',
  priority: 'high',
  requesterId: 'user-1',
  requesterName: 'Sarah Johnson',
  requesterEmail: 'sarah.johnson@company.com',
  assignedTo: {
    agentId: 'agent-1',
    agentName: 'Michael Chen',
    agentEmail: 'michael@support.com'
  },
  team: 'Technical Support',
  messages: [
    {
      id: 'msg-1',
      ticketId: 'tick-1',
      senderId: 'user-1',
      senderName: 'Sarah Johnson',
      senderType: 'customer',
      content: 'I\'m getting a 403 error when trying to access the team dashboard page. This started happening this morning after I updated my account permissions.',
      isPrivate: false,
      createdAt: '2025-10-13T08:30:00Z'
    },
    {
      id: 'msg-2',
      ticketId: 'tick-1',
      senderId: 'agent-1',
      senderName: 'Michael Chen',
      senderType: 'agent',
      content: 'Thanks for reaching out, Sarah. I\'m looking into this issue now. Can you tell me which specific team you\'re trying to access?',
      isPrivate: false,
      createdAt: '2025-10-13T08:45:00Z'
    },
    {
      id: 'msg-3',
      ticketId: 'tick-1',
      senderId: 'user-1',
      senderName: 'Sarah Johnson',
      senderType: 'customer',
      content: 'It\'s the "Engineering" team dashboard. I can access other teams just fine.',
      isPrivate: false,
      createdAt: '2025-10-13T08:50:00Z'
    },
    {
      id: 'msg-4',
      ticketId: 'tick-1',
      senderId: 'agent-1',
      senderName: 'Michael Chen',
      senderType: 'agent',
      content: 'I see the issue. It looks like your permissions for the Engineering team were accidentally removed during the recent update. I\'m restoring them now.',
      isPrivate: false,
      createdAt: '2025-10-13T09:00:00Z'
    },
    {
      id: 'msg-5',
      ticketId: 'tick-1',
      senderId: 'agent-1',
      senderName: 'Michael Chen',
      senderType: 'agent',
      content: 'All set! Your permissions have been restored. Can you try accessing the Engineering dashboard again?',
      isPrivate: false,
      createdAt: '2025-10-13T09:05:00Z'
    }
  ],
  internalNotes: [
    {
      id: 'note-1',
      ticketId: 'tick-1',
      authorId: 'agent-1',
      authorName: 'Michael Chen',
      content: 'Permission sync issue after account update. Common issue we\'ve seen with the recent permissions system upgrade.',
      createdAt: '2025-10-13T09:02:00Z'
    }
  ],
  attachments: [],
  tags: ['dashboard', 'permissions', 'error', 'engineering'],
  firstResponseAt: '2025-10-13T08:45:00Z',
  lastResponseAt: '2025-10-13T09:05:00Z',
  responseTime: 15,
  createdAt: '2025-10-13T08:30:00Z',
  updatedAt: '2025-10-13T09:05:00Z'
}

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const [ticket, setTicket] = useState<SupportTicket>(mockTicket)
  const [newMessage, setNewMessage] = useState('')
  const [newNote, setNewNote] = useState('')
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [activeTab, setActiveTab] = useState<'messages' | 'notes' | 'activity'>('messages')

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: TicketMessage = {
      id: `msg-${Date.now()}`,
      ticketId: ticket.id,
      senderId: 'agent-1',
      senderName: 'Michael Chen',
      senderType: 'agent',
      content: newMessage,
      isPrivate: false,
      createdAt: new Date().toISOString()
    }

    setTicket({
      ...ticket,
      messages: [...ticket.messages, message],
      updatedAt: new Date().toISOString()
    })
    setNewMessage('')
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return

    const note: InternalNote = {
      id: `note-${Date.now()}`,
      ticketId: ticket.id,
      authorId: 'agent-1',
      authorName: 'Michael Chen',
      content: newNote,
      createdAt: new Date().toISOString()
    }

    setTicket({
      ...ticket,
      internalNotes: [...ticket.internalNotes, note],
      updatedAt: new Date().toISOString()
    })
    setNewNote('')
    setShowNoteForm(false)
  }

  const updateStatus = (status: TicketStatus) => {
    setTicket({ ...ticket, status, updatedAt: new Date().toISOString() })
  }

  const updatePriority = (priority: TicketPriority) => {
    setTicket({ ...ticket, priority, updatedAt: new Date().toISOString() })
  }

  const dueDate = getTicketDueDate(ticket)
  const timeRemaining = dueDate ? getTimeRemaining(dueDate) : null

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/help/tickets"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tickets
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{ticket.ticketNumber}</h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTicketStatusColor(ticket.status)}`}>
                {formatTicketStatus(ticket.status)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTicketPriorityColor(ticket.priority)}`}>
                {formatTicketPriority(ticket.priority)}
              </span>
            </div>
            <h2 className="text-xl text-gray-400 mb-4">{ticket.subject}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {ticket.requesterName}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Created {new Date(ticket.createdAt).toLocaleString()}
              </div>
              {timeRemaining && (
                <div className={`flex items-center gap-1 ${
                  timeRemaining === 'Overdue' ? 'text-red-400' : ''
                }`}>
                  <Clock className="w-4 h-4" />
                  {timeRemaining}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors">
              <Star className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Original Description */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                {ticket.requesterName[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-semibold text-white">{ticket.requesterName}</div>
                    <div className="text-sm text-gray-400">{ticket.requesterEmail}</div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="text-gray-300 leading-relaxed">{ticket.description}</div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs">
                    {formatTicketType(ticket.type)}
                  </span>
                  {ticket.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-1 inline-flex">
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'messages'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4 inline-block mr-2" />
              Messages ({ticket.messages.length})
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'notes'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Lock className="w-4 h-4 inline-block mr-2" />
              Internal Notes ({ticket.internalNotes.length})
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'activity'
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4 inline-block mr-2" />
              Activity
            </button>
          </div>

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              {/* Message Thread */}
              {ticket.messages.map((message) => (
                <div
                  key={message.id}
                  className={`bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 ${
                    message.senderType === 'agent' ? 'ml-8' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                      message.senderType === 'agent'
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                        : 'bg-gradient-to-br from-blue-500 to-cyan-500'
                    }`}>
                      {message.senderName[0]}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-semibold text-white">{message.senderName}</div>
                          <div className="text-xs text-gray-500">
                            {message.senderType === 'agent' ? 'Support Agent' : 'Customer'}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(message.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </div>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-3 flex items-center gap-2">
                          {message.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="flex items-center gap-2 px-3 py-2 bg-gray-700 rounded-lg text-sm"
                            >
                              <Paperclip className="w-4 h-4 text-gray-400" />
                              <span className="text-white">{attachment.name}</span>
                              <button className="text-gray-400 hover:text-white">
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Reply Box */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your reply..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
                <div className="flex items-center justify-between mt-4">
                  <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                    <Paperclip className="w-4 h-4" />
                    Attach File
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                      Save Draft
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-4 h-4" />
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              {ticket.internalNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6"
                >
                  <div className="flex items-start gap-4">
                    <Lock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-white">{note.authorName}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(note.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-gray-300 leading-relaxed">{note.content}</div>
                    </div>
                  </div>
                </div>
              ))}

              {showNoteForm ? (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <Lock className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-3" />
                    <div className="flex-1">
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add internal note (only visible to team members)..."
                        rows={3}
                        autoFocus
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                      />
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={handleAddNote}
                          disabled={!newNote.trim()}
                          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Add Note
                        </button>
                        <button
                          onClick={() => {
                            setShowNoteForm(false)
                            setNewNote('')
                          }}
                          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowNoteForm(true)}
                  className="w-full px-4 py-3 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Add Internal Note
                </button>
              )}
            </div>
          )}

          {/* Activity Tab */}
          {activeTab === 'activity' && (
            <div className="space-y-3">
              <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-gray-400">Ticket created by</span>
                  <span className="text-white font-medium">{ticket.requesterName}</span>
                  <span className="text-gray-500">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <span className="text-gray-400">Assigned to</span>
                  <span className="text-white font-medium">{ticket.assignedTo?.agentName}</span>
                  <span className="text-gray-500">
                    {new Date(ticket.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
              {ticket.firstResponseAt && (
                <div className="bg-gray-800/50 rounded-lg border border-gray-700 p-4">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                    <span className="text-gray-400">First response in</span>
                    <span className="text-white font-medium">{ticket.responseTime} minutes</span>
                    <span className="text-gray-500">
                      {new Date(ticket.firstResponseAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => updateStatus('resolved')}
                className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark as Resolved
              </button>
              <button
                onClick={() => updateStatus('closed')}
                className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Close Ticket
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-400 mb-1">Status</div>
                <select
                  value={ticket.status}
                  onChange={(e) => updateStatus(e.target.value as TicketStatus)}
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="waiting_response">Waiting Response</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">Priority</div>
                <select
                  value={ticket.priority}
                  onChange={(e) => updatePriority(e.target.value as TicketPriority)}
                  className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">Assigned To</div>
                <div className="text-white">
                  {ticket.assignedTo ? ticket.assignedTo.agentName : 'Unassigned'}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-400 mb-1">Team</div>
                <div className="text-white">{ticket.team || 'No team'}</div>
              </div>
            </div>
          </div>

          {/* Requester Info */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Requester</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold text-lg">
                {ticket.requesterName[0]}
              </div>
              <div>
                <div className="font-semibold text-white">{ticket.requesterName}</div>
                <div className="text-sm text-gray-400">{ticket.requesterEmail}</div>
              </div>
            </div>
            <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
              View Profile
            </button>
          </div>

          {/* Performance Metrics */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Metrics</h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-400 mb-1">First Response Time</div>
                <div className="text-white font-medium">
                  {ticket.responseTime ? formatResponseTime(ticket.responseTime) : 'N/A'}
                </div>
              </div>
              {ticket.resolutionTime && (
                <div>
                  <div className="text-sm text-gray-400 mb-1">Resolution Time</div>
                  <div className="text-white font-medium">
                    {formatResponseTime(ticket.resolutionTime)}
                  </div>
                </div>
              )}
              <div>
                <div className="text-sm text-gray-400 mb-1">Messages</div>
                <div className="text-white font-medium">{ticket.messages.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
