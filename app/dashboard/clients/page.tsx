'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  Building2, Plus, Search, Filter, Phone, Mail,
  Globe, MapPin, Calendar, DollarSign, Briefcase,
  TrendingUp, MoreVertical, ArrowUpRight, Star,
  Users, Clock, CheckCircle2, AlertCircle, Zap,
  FileText, Calendar as CalendarIcon, Eye, Heart,
  Activity, Target, Award, Smartphone
} from 'lucide-react'
import Link from 'next/link'
import { Client, ClientStatus, ClientLifecycleStage } from '@/types/clients'
import {
  getClientStatusColor,
  getLifecycleStageColor,
  getHealthLevelColor,
  calculateClientHealth
} from '@/lib/clients-utils'
import { AppTypeBadge } from '@/components/apps/app-type-badge'
import { useAuth } from '@/contexts/auth-context'
import { ClientsService } from '@/services/clients.service'
import { AppsService } from '@/services/apps.service'
import toast from 'react-hot-toast'
import type { App } from '@/types'

const industryColors: Record<string, string> = {
  'Technology': 'gradient-blue',
  'Finance': 'gradient-green',
  'Human Resources': 'gradient-purple',
  'Retail': 'gradient-orange',
  'Software': 'gradient-pink',
  'Healthcare': 'gradient-yellow'
}

export default function ClientsPage() {
  const { tenant } = useAuth()
  const [clients, setClients] = useState<Client[]>([])
  const [apps, setApps] = useState<App[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')

  // Helper function to get apps for a specific client
  const getClientApps = (clientId: string) => {
    return apps.filter(app => app.client.id === clientId)
  }

  // Real-time subscription to clients
  useEffect(() => {
    if (!tenant?.id) {
      setLoading(false)
      setClients([])
      return
    }

    setLoading(true)

    try {
      const unsubscribe = ClientsService.subscribeAll(
        tenant.id,
        (updatedClients) => {
          setClients(updatedClients)
          setLoading(false)
        }
      )

      return () => unsubscribe()
    } catch (error) {
      console.error('Error subscribing to clients:', error)
      setLoading(false)
      toast.error('Failed to load clients')
    }
  }, [tenant?.id])

  // Load all apps for the tenant
  useEffect(() => {
    if (!tenant?.id) {
      setApps([])
      return
    }

    async function loadApps() {
      try {
        const allApps = await AppsService.list(tenant!.id)
        setApps(allApps)
      } catch (error) {
        console.error('Error loading apps:', error)
      }
    }

    loadApps()
  }, [tenant?.id])

  // Calculate statistics
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    totalRevenue: clients.reduce((sum, c) => sum + (c.totalRevenue || 0), 0),
    outstandingBalance: clients.reduce((sum, c) => sum + (c.outstandingBalance || 0), 0),
    totalProjects: clients.reduce((sum, c) => sum + (c.totalProjects || 0), 0)
  }

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.industry || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (client.contactPerson?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'revenue':
        return (b.totalRevenue || 0) - (a.totalRevenue || 0)
      case 'projects':
        return (b.totalProjects || 0) - (a.totalProjects || 0)
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return 0
    }
  })

  // Show loading skeleton
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Clients</h1>
            <p className="text-gray-400">Manage your client relationships</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-800/50 rounded-xl p-6 animate-pulse h-96"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Clients</h1>
          <p className="text-gray-400">Manage your client relationships</p>
        </div>
        <Link href="/dashboard/clients/new">
          <button className="btn-primary flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Client</span>
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gradient-blue rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Building2 className="h-8 w-8 text-blue-400" />
          </div>
          <p className="text-sm text-gray-400 mb-1">Total Clients</p>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>

        <div className="bg-gradient-green rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-400" />
          </div>
          <p className="text-sm text-gray-400 mb-1">Active Clients</p>
          <p className="text-3xl font-bold">{stats.active}</p>
        </div>

        <div className="bg-gradient-purple rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Briefcase className="h-8 w-8 text-purple-400" />
          </div>
          <p className="text-sm text-gray-400 mb-1">Total Projects</p>
          <p className="text-3xl font-bold">{stats.totalProjects}</p>
        </div>

        <div className="bg-gradient-orange rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8 text-orange-400" />
          </div>
          <p className="text-sm text-gray-400 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold">${(stats.totalRevenue / 1000).toFixed(0)}k</p>
        </div>

        <div className="bg-gradient-red rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Clock className="h-8 w-8 text-red-400" />
          </div>
          <p className="text-sm text-gray-400 mb-1">Outstanding</p>
          <p className="text-3xl font-bold">${(stats.outstandingBalance / 1000).toFixed(0)}k</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="prospect">Prospect</option>
          <option value="churned">Churned</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        >
          <option value="name">Name</option>
          <option value="revenue">Revenue</option>
          <option value="projects">Projects</option>
          <option value="newest">Newest</option>
        </select>
      </div>

      {/* Empty state */}
      {sortedClients.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No clients found</h3>
          <p className="text-gray-400 mb-6">
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'Get started by adding your first client'}
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <Link href="/dashboard/clients/new">
              <button className="btn-primary">Add Client</button>
            </Link>
          )}
        </div>
      )}

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedClients.map((client) => (
          <Link key={client.id} href={`/dashboard/clients/${client.id}`}>
            <div className="group relative">
              {/* Hover Glow */}
              <div className={cn(
                "absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-60 blur-xl transition-opacity duration-500",
                client.gradient ||industryColors[client.industry || ''] || 'gradient-purple'
              )} />

              {/* Card */}
              <div className="relative h-full rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6 group-hover:bg-gray-900/70 transition-all duration-300">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold",
                      industryColors[client.industry || ''] || 'gradient-purple'
                    )}>
                      {client.logo || client.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-purple-400 transition-colors">
                        {client.name}
                      </h3>
                      <p className="text-sm text-gray-400">{client.industry}</p>
                    </div>
                  </div>
                  <div className={cn(
                    "px-2 py-1 rounded-lg text-xs font-medium",
                    client.status === 'active'
                      ? "bg-green-400/10 text-green-400"
                      : "bg-gray-600/10 text-gray-400"
                  )}>
                    {client.status}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2 mb-4">
                  {client.contactPerson && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Users className="h-4 w-4" />
                      <span>{client.contactPerson.name}, {client.contactPerson.role}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  {client.address && (
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <MapPin className="h-4 w-4" />
                      <span>{client.address}</span>
                    </div>
                  )}
                </div>

                {/* Apps */}
                {(() => {
                  const clientApps = getClientApps(client.id)
                  return clientApps.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-400 mb-2">Apps Deployed:</p>
                      <div className="flex flex-wrap gap-2">
                        {clientApps.slice(0, 2).map((app) => (
                          <AppTypeBadge
                            key={app.id}
                            type={app.type}
                            size="sm"
                          />
                        ))}
                        {clientApps.length > 2 && (
                          <div className="px-2 py-1 rounded-lg bg-gray-800 text-gray-400 text-xs">
                            +{clientApps.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })()}

                {/* Active Projects */}
                {client.activeProjects && client.activeProjects.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2">Active Projects:</p>
                    <div className="flex flex-wrap gap-2">
                      {client.activeProjects.map((project: any) => (
                        <div
                          key={project.id}
                          className="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs flex items-center space-x-1"
                          title={project.name}
                        >
                          <Briefcase className="h-3 w-3" />
                          <span className="truncate max-w-20">{project.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-800">
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Projects</p>
                    <p className="text-lg font-semibold">
                      {client.activeProjects?.length || 0} / {client.totalProjects || 0}
                    </p>
                  </div>
                  <div className="text-center border-x border-gray-800">
                    <p className="text-xs text-gray-400 mb-1">Revenue</p>
                    <p className="text-lg font-semibold text-green-400">
                      ${((client.totalRevenue || 0) / 1000).toFixed(0)}k
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400 mb-1">Balance</p>
                    <p className="text-lg font-semibold text-orange-400">
                      ${((client.outstandingBalance || 0) / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.floor(client.rating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-600"
                        )}
                      />
                    ))}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{getClientApps(client.id).length} apps</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
