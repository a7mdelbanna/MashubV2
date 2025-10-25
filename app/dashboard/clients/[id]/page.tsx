'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { clientsService } from '@/lib/services/clients-service'
import { PermissionGuard } from '@/components/auth/permission-guard'
import { Can } from '@/components/auth/can'
import {
  Building2, ArrowLeft, Edit, Trash2, Mail, Phone, Globe,
  MapPin, DollarSign, Briefcase, Calendar, Users, FileText,
  MessageSquare, Activity, Settings, MoreVertical, Plus,
  Star, TrendingUp, Clock, CheckCircle2, AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { Client, ClientActivity, ClientNote, Communication } from '@/types/clients'
import toast from 'react-hot-toast'
import DocumentManager from '@/components/clients/document-manager'

type TabType = 'overview' | 'communications' | 'projects' | 'documents' | 'notes' | 'activities'

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const clientId = params.id as string

  // State
  const [client, setClient] = useState<Client | null>(null)
  const [activities, setActivities] = useState<ClientActivity[]>([])
  const [notes, setNotes] = useState<ClientNote[]>([])
  const [communications, setCommunications] = useState<Communication[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Real-time subscription to client
  useEffect(() => {
    if (!clientId) return

    const unsubscribe = clientsService.subscribeToClient(clientId, (updatedClient) => {
      setClient(updatedClient)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [clientId])

  // Real-time subscription to related data
  useEffect(() => {
    if (!clientId) return

    // Subscribe to activities
    const unsubActivities = clientsService.subscribeToClientActivities(
      clientId,
      (updatedActivities) => {
        setActivities(updatedActivities)
      }
    )

    // Subscribe to notes
    const unsubNotes = clientsService.subscribeToClientNotes(
      clientId,
      (updatedNotes) => {
        setNotes(updatedNotes)
      }
    )

    // Subscribe to communications
    const unsubCommunications = clientsService.subscribeToClientCommunications(
      clientId,
      (updatedCommunications) => {
        setCommunications(updatedCommunications)
      }
    )

    // Cleanup all subscriptions
    return () => {
      unsubActivities()
      unsubNotes()
      unsubCommunications()
    }
  }, [clientId])

  const handleDelete = async () => {
    if (!client) return

    try {
      await clientsService.deleteClient(client.id)
      toast.success('Client deactivated successfully')
      router.push('/dashboard/clients')
    } catch (error: any) {
      console.error('Error deleting client:', error)
      toast.error(error.message || 'Failed to delete client')
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      lead: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      prospect: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      active: 'bg-green-500/20 text-green-300 border-green-500/30',
      inactive: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      churned: 'bg-red-500/20 text-red-300 border-red-500/30'
    }
    return colors[status as keyof typeof colors] || colors.inactive
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-500/20 text-gray-300',
      medium: 'bg-blue-500/20 text-blue-300',
      high: 'bg-orange-500/20 text-orange-300',
      vip: 'bg-purple-500/20 text-purple-300'
    }
    return colors[priority as keyof typeof colors] || colors.low
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-gray-800" />
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gray-800" />
              <div>
                <div className="h-8 w-48 bg-gray-800 rounded mb-2" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-gray-800 rounded" />
                  <div className="h-6 w-16 bg-gray-800 rounded" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-20 bg-gray-800 rounded-lg" />
            <div className="h-10 w-24 bg-gray-800 rounded-lg" />
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="border-b border-gray-800">
          <div className="flex space-x-6">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-10 w-28 bg-gray-800 rounded-t" />
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards Skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-800 rounded-xl h-32" />
              ))}
            </div>
            {/* Large Card Skeleton */}
            <div className="bg-gray-800 rounded-xl h-64" />
          </div>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-800 rounded-xl h-48" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Building2 className="h-16 w-16 text-gray-600 mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Client Not Found</h2>
        <p className="text-gray-400 mb-6">The client you're looking for doesn't exist</p>
        <Link
          href="/dashboard/clients"
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
        >
          Back to Clients
        </Link>
      </div>
    )
  }

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: Building2 },
    { id: 'communications' as TabType, label: 'Communications', icon: MessageSquare },
    { id: 'projects' as TabType, label: 'Projects', icon: Briefcase },
    { id: 'documents' as TabType, label: 'Documents', icon: FileText },
    { id: 'notes' as TabType, label: 'Notes', icon: FileText },
    { id: 'activities' as TabType, label: 'Activity Log', icon: Activity }
  ]

  return (
    <PermissionGuard permission="read:clients">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/clients"
              className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>

            <div className="flex items-center gap-4">
              {client.logo ? (
                <img
                  src={client.logo}
                  alt={client.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-2xl">
                  {client.name.charAt(0)}
                </div>
              )}

              <div>
                <h1 className="text-3xl font-bold text-white">{client.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(client.status)}`}>
                    {client.status}
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityColor(client.priority)}`}>
                    {client.priority}
                  </span>
                  {client.tags.map(tag => (
                    <span key={tag} className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Can permission="write:clients">
              <Link
                href={`/dashboard/clients/${client.id}/edit`}
                className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors flex items-center space-x-2"
              >
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Link>

              <button
                onClick={() => setShowDeleteModal(true)}
                className="px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-colors flex items-center space-x-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </Can>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-800 overflow-hidden">
          <div className="flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide -mb-px">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 sm:px-4 py-3 border-b-2 transition-colors whitespace-nowrap text-sm sm:text-base ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-white'
                      : 'border-transparent text-gray-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
          {activeTab === 'overview' && <OverviewTab client={client} />}
          {activeTab === 'communications' && <CommunicationsTab communications={communications} clientId={client.id} />}
          {activeTab === 'projects' && <ProjectsTab clientId={client.id} />}
          {activeTab === 'documents' && <DocumentsTab clientId={client.id} tenantId={client.tenantId} />}
          {activeTab === 'notes' && <NotesTab notes={notes} clientId={client.id} />}
          {activeTab === 'activities' && <ActivitiesTab activities={activities} />}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
            <div className="relative bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-md w-full mx-4">
              <h3 className="text-xl font-bold text-white mb-2">Delete Client?</h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to deactivate this client? This action will change their status to inactive.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PermissionGuard>
  )
}

// Overview Tab Component
function OverviewTab({ client }: { client: Client }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Stats */}
      <div className="lg:col-span-2 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white mt-2">{formatCurrency(client.totalRevenue)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Lifetime Value</p>
                <p className="text-2xl font-bold text-white mt-2">{formatCurrency(client.lifetimeValue)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Projects</p>
                <p className="text-2xl font-bold text-white mt-2">{client.activeProjects}/{client.totalProjects}</p>
              </div>
              <Briefcase className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center text-gray-300">
              <Mail className="h-4 w-4 mr-3 text-gray-400" />
              <a href={`mailto:${client.email}`} className="hover:text-purple-400 transition-colors">
                {client.email}
              </a>
            </div>
            {client.phone && (
              <div className="flex items-center text-gray-300">
                <Phone className="h-4 w-4 mr-3 text-gray-400" />
                <a href={`tel:${client.phone}`} className="hover:text-purple-400 transition-colors">
                  {client.phone}
                </a>
              </div>
            )}
            {client.website && (
              <div className="flex items-center text-gray-300">
                <Globe className="h-4 w-4 mr-3 text-gray-400" />
                <a href={client.website} target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors">
                  {client.website}
                </a>
              </div>
            )}
            {client.address && (
              <div className="flex items-start text-gray-300">
                <MapPin className="h-4 w-4 mr-3 text-gray-400 mt-1" />
                <div>
                  <p>{client.address}</p>
                  {client.city && client.country && (
                    <p>{client.city}, {client.country}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Details */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Additional Details</h3>
          <div className="grid grid-cols-2 gap-4">
            {client.industry && (
              <div>
                <p className="text-sm text-gray-400">Industry</p>
                <p className="text-white mt-1">{client.industry}</p>
              </div>
            )}
            {client.companySize && (
              <div>
                <p className="text-sm text-gray-400">Company Size</p>
                <p className="text-white mt-1">{client.companySize}</p>
              </div>
            )}
            {client.legalName && (
              <div>
                <p className="text-sm text-gray-400">Legal Name</p>
                <p className="text-white mt-1">{client.legalName}</p>
              </div>
            )}
            {client.taxId && (
              <div>
                <p className="text-sm text-gray-400">Tax ID</p>
                <p className="text-white mt-1">{client.taxId}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Timeline */}
      <div className="space-y-6">
        {/* Important Dates */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Important Dates</h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400">Created</p>
              <p className="text-white mt-1">{formatDate(client.createdAt)}</p>
            </div>
            {client.lastContactDate && (
              <div>
                <p className="text-sm text-gray-400">Last Contact</p>
                <p className="text-white mt-1">{formatDate(client.lastContactDate)}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-400">Updated</p>
              <p className="text-white mt-1">{formatDate(client.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Financial Details */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Financial Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-gray-400">Avg Invoice</p>
              <p className="text-white font-semibold">{formatCurrency(client.averageInvoiceValue)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-400">Outstanding</p>
              <p className="text-white font-semibold">{formatCurrency(client.outstandingBalance)}</p>
            </div>
            {client.paymentTerms && (
              <div className="flex justify-between">
                <p className="text-gray-400">Payment Terms</p>
                <p className="text-white font-semibold">{client.paymentTerms}</p>
              </div>
            )}
          </div>
        </div>

        {/* Project Stats */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Project Stats</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-gray-400">Total Projects</p>
              <p className="text-white font-semibold">{client.totalProjects}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-400">Active</p>
              <p className="text-green-400 font-semibold">{client.activeProjects}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-400">Completed</p>
              <p className="text-blue-400 font-semibold">{client.completedProjects}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Communications Tab Component
function CommunicationsTab({ communications, clientId }: { communications: Communication[], clientId: string }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Communication History</h3>
        <Can permission="write:clients">
          <button className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Communication</span>
          </button>
        </Can>
      </div>

      {communications.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl">
          <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No communications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {communications.map(comm => (
            <div key={comm.id} className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-white font-medium">{comm.subject}</h4>
                  <p className="text-sm text-gray-400">{comm.type} - {new Date(comm.createdAt).toLocaleString()}</p>
                </div>
                {comm.direction && (
                  <span className={`px-2 py-1 rounded text-xs ${comm.direction === 'inbound' ? 'bg-blue-500/20 text-blue-300' : 'bg-green-500/20 text-green-300'}`}>
                    {comm.direction}
                  </span>
                )}
              </div>
              <p className="text-gray-300 text-sm">{comm.content}</p>
              {comm.userName && (
                <p className="text-xs text-gray-500 mt-2">By {comm.userName}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Projects Tab Component
function ProjectsTab({ clientId }: { clientId: string }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Projects</h3>
        <Can permission="write:projects">
          <Link
            href={`/dashboard/projects/new?clientId=${clientId}`}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </Link>
        </Can>
      </div>

      <div className="text-center py-12 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl">
        <Briefcase className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">No projects yet</p>
        <p className="text-sm text-gray-500 mt-2">Projects will appear here once created</p>
      </div>
    </div>
  )
}

// Documents Tab Component
function DocumentsTab({ clientId, tenantId }: { clientId: string; tenantId: string }) {
  return <DocumentManager clientId={clientId} tenantId={tenantId} />
}

// Notes Tab Component
function NotesTab({ notes, clientId }: { notes: ClientNote[], clientId: string }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-white">Notes</h3>
        <Can permission="write:clients">
          <button className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Add Note</span>
          </button>
        </Can>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl">
          <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No notes yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map(note => (
            <div key={note.id} className={`bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 ${note.isPinned ? 'border-purple-500/50' : ''}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  {note.title && <h4 className="text-white font-medium mb-1">{note.title}</h4>}
                  <p className="text-gray-300 text-sm">{note.content}</p>
                </div>
                {note.isPinned && <Star className="h-4 w-4 text-purple-400 flex-shrink-0 ml-2" />}
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
                <p className="text-xs text-gray-500">{note.createdByName} - {new Date(note.createdAt).toLocaleString()}</p>
                {note.isPrivate && (
                  <span className="px-2 py-0.5 rounded text-xs bg-orange-500/20 text-orange-300">Private</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Activities Tab Component
function ActivitiesTab({ activities }: { activities: ClientActivity[] }) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'created': return CheckCircle2
      case 'updated': return Edit
      case 'communication': return MessageSquare
      case 'note': return FileText
      default: return Activity
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white mb-4">Activity Log</h3>

      {activities.length === 0 ? (
        <div className="text-center py-12 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl">
          <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No activities yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map(activity => {
            const Icon = getActivityIcon(activity.type)
            return (
              <div key={activity.id} className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4">
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-purple-500/20">
                    <Icon className="h-4 w-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{activity.title}</h4>
                    {activity.description && (
                      <p className="text-sm text-gray-400 mt-1">{activity.description}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-2">
                      {activity.userName && (
                        <span className="text-xs text-gray-500">{activity.userName}</span>
                      )}
                      <span className="text-xs text-gray-500">
                        {new Date(activity.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
