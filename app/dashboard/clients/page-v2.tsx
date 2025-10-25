'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { clientsService } from '@/lib/services/clients-service'
import { usePermissions } from '@/hooks/use-permissions'
import { Can } from '@/components/auth/can'
import {
  Building2, Plus, Search, Filter, Phone, Mail,
  Globe, MapPin, DollarSign, TrendingUp, MoreVertical,
  Users, AlertCircle, Eye, Star, ChevronDown
} from 'lucide-react'
import Link from 'next/link'
import { Client, ClientStatus, ClientPriority } from '@/types/clients'
import toast from 'react-hot-toast'

export default function ClientsPage() {
  const { user } = useAuth()
  const { canWrite, canRead } = usePermissions()

  // State
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<ClientStatus | 'all'>('all')
  const [filterPriority, setFilterPriority] = useState<ClientPriority | 'all'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    leads: 0,
    totalRevenue: 0
  })

  // Real-time subscription
  useEffect(() => {
    if (!user?.tenantId) return

    const unsubscribe = clientsService.subscribeToClients(
      user.tenantId,
      (updatedClients) => {
        setClients(updatedClients)
        calculateStats(updatedClients)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user?.tenantId])

  // Apply filters
  useEffect(() => {
    let filtered = [...clients]

    // Search filter
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase()
      filtered = filtered.filter(client =>
        client.name.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        client.industry?.toLowerCase().includes(term)
      )
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(client => client.status === filterStatus)
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(client => client.priority === filterPriority)
    }

    setFilteredClients(filtered)
  }, [clients, searchQuery, filterStatus, filterPriority])

  const calculateStats = (clientsList: Client[]) => {
    const stats = {
      total: clientsList.length,
      active: clientsList.filter(c => c.status === 'active').length,
      leads: clientsList.filter(c => c.status === 'lead').length,
      totalRevenue: clientsList.reduce((sum, c) => sum + (c.totalRevenue || 0), 0)
    }
    setStats(stats)
  }

  const getStatusBadgeColor = (status: ClientStatus) => {
    const colors = {
      lead: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      prospect: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      active: 'bg-green-500/20 text-green-300 border-green-500/30',
      inactive: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
      churned: 'bg-red-500/20 text-red-300 border-red-500/30'
    }
    return colors[status] || colors.inactive
  }

  const getPriorityBadgeColor = (priority: ClientPriority) => {
    const colors = {
      low: 'bg-gray-500/20 text-gray-300',
      medium: 'bg-blue-500/20 text-blue-300',
      high: 'bg-orange-500/20 text-orange-300',
      vip: 'bg-purple-500/20 text-purple-300'
    }
    return colors[priority] || colors.low
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Building2 className="h-8 w-8" />
            Clients
          </h1>
          <p className="text-gray-400 mt-1">Manage your client relationships</p>
        </div>

        <Can permission="write:clients">
          <Link
            href="/dashboard/clients/new"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Client</span>
          </Link>
        </Can>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Clients</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
            </div>
            <Building2 className="h-10 w-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.active}</p>
            </div>
            <Users className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Leads</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.leads}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-yellow-500" />
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Revenue</p>
              <p className="text-3xl font-bold text-white mt-2">
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4">
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients by name, email, or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="lead">Lead</option>
                <option value="prospect">Prospect</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="churned">Churned</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Priority</label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="vip">VIP</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Link
            key={client.id}
            href={`/dashboard/clients/${client.id}`}
            className="block bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6 hover:border-purple-500/50 transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                {client.logo ? (
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                    {client.name.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-white font-semibold">{client.name}</h3>
                  {client.industry && (
                    <p className="text-gray-400 text-sm">{client.industry}</p>
                  )}
                </div>
              </div>

              <Can permission="write:clients">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    // Handle menu open
                  }}
                  className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </Can>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getStatusBadgeColor(client.status)}`}>
                {client.status}
              </span>
              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getPriorityBadgeColor(client.priority)}`}>
                {client.priority}
              </span>
              {client.tags.slice(0, 1).map(tag => (
                <span key={tag} className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-500/20 text-blue-300">
                  {tag}
                </span>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-400 text-sm">
                <Mail className="h-3.5 w-3.5 mr-2" />
                {client.email}
              </div>
              {client.phone && (
                <div className="flex items-center text-gray-400 text-sm">
                  <Phone className="h-3.5 w-3.5 mr-2" />
                  {client.phone}
                </div>
              )}
              {client.website && (
                <div className="flex items-center text-gray-400 text-sm">
                  <Globe className="h-3.5 w-3.5 mr-2" />
                  {client.website}
                </div>
              )}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
              <div>
                <p className="text-gray-400 text-xs mb-1">Revenue</p>
                <p className="text-white font-semibold">{formatCurrency(client.totalRevenue)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Projects</p>
                <p className="text-white font-semibold">{client.activeProjects}/{client.totalProjects}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredClients.length === 0 && !loading && (
        <div className="text-center py-12 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl">
          <Building2 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-2">No clients found</h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchQuery || filterStatus !== 'all' || filterPriority !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by adding your first client'}
          </p>
          <Can permission="write:clients">
            <Link
              href="/dashboard/clients/new"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Link>
          </Can>
        </div>
      )}
    </div>
  )
}
