'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  Building2, Plus, Search, Filter, Phone, Mail,
  Globe, MapPin, Calendar, DollarSign, Briefcase,
  TrendingUp, MoreVertical, ArrowUpRight, Star,
  Users, Clock, CheckCircle2, AlertCircle
} from 'lucide-react'
import Link from 'next/link'

// Mock data for clients
const clients = [
  {
    id: 'c1',
    name: 'TechCorp Inc.',
    logo: 'TC',
    industry: 'Technology',
    website: 'www.techcorp.com',
    email: 'contact@techcorp.com',
    phone: '+1 (555) 123-4567',
    address: 'San Francisco, CA',
    status: 'active',
    joinDate: new Date('2023-03-15'),
    totalProjects: 8,
    activeProjects: 2,
    completedProjects: 5,
    totalRevenue: 485000,
    outstandingBalance: 45000,
    lastActivity: new Date('2024-02-28'),
    contactPerson: {
      name: 'John Smith',
      role: 'CTO',
      email: 'john@techcorp.com',
      phone: '+1 (555) 123-4568'
    },
    tags: ['Enterprise', 'Long-term', 'Priority'],
    rating: 5,
    gradient: 'gradient-blue'
  },
  {
    id: 'c2',
    name: 'FinanceHub',
    logo: 'FH',
    industry: 'Finance',
    website: 'www.financehub.com',
    email: 'info@financehub.com',
    phone: '+1 (555) 234-5678',
    address: 'New York, NY',
    status: 'active',
    joinDate: new Date('2023-01-10'),
    totalProjects: 12,
    activeProjects: 3,
    completedProjects: 8,
    totalRevenue: 725000,
    outstandingBalance: 0,
    lastActivity: new Date('2024-03-01'),
    contactPerson: {
      name: 'Sarah Johnson',
      role: 'VP Engineering',
      email: 'sarah@financehub.com',
      phone: '+1 (555) 234-5679'
    },
    tags: ['Enterprise', 'Financial Services'],
    rating: 4.5,
    gradient: 'gradient-green'
  },
  {
    id: 'c3',
    name: 'GlobalHR Solutions',
    logo: 'GH',
    industry: 'Human Resources',
    website: 'www.globalhr.com',
    email: 'contact@globalhr.com',
    phone: '+1 (555) 345-6789',
    address: 'Chicago, IL',
    status: 'active',
    joinDate: new Date('2023-06-20'),
    totalProjects: 4,
    activeProjects: 1,
    completedProjects: 2,
    totalRevenue: 185000,
    outstandingBalance: 25000,
    lastActivity: new Date('2024-02-15'),
    contactPerson: {
      name: 'Michael Brown',
      role: 'Director of IT',
      email: 'michael@globalhr.com',
      phone: '+1 (555) 345-6790'
    },
    tags: ['Mid-size', 'HR Tech'],
    rating: 4,
    gradient: 'gradient-purple'
  },
  {
    id: 'c4',
    name: 'RetailChain Pro',
    logo: 'RC',
    industry: 'Retail',
    website: 'www.retailchain.com',
    email: 'support@retailchain.com',
    phone: '+1 (555) 456-7890',
    address: 'Los Angeles, CA',
    status: 'active',
    joinDate: new Date('2023-04-05'),
    totalProjects: 6,
    activeProjects: 1,
    completedProjects: 4,
    totalRevenue: 320000,
    outstandingBalance: 15000,
    lastActivity: new Date('2024-02-20'),
    contactPerson: {
      name: 'Emily Davis',
      role: 'IT Manager',
      email: 'emily@retailchain.com',
      phone: '+1 (555) 456-7891'
    },
    tags: ['Retail', 'POS Systems'],
    rating: 4.5,
    gradient: 'gradient-orange'
  },
  {
    id: 'c5',
    name: 'InnovateTech',
    logo: 'IT',
    industry: 'Software',
    website: 'www.innovatetech.com',
    email: 'hello@innovatetech.com',
    phone: '+1 (555) 567-8901',
    address: 'Austin, TX',
    status: 'inactive',
    joinDate: new Date('2023-02-28'),
    totalProjects: 3,
    activeProjects: 0,
    completedProjects: 2,
    totalRevenue: 125000,
    outstandingBalance: 0,
    lastActivity: new Date('2024-01-10'),
    contactPerson: {
      name: 'David Wilson',
      role: 'CEO',
      email: 'david@innovatetech.com',
      phone: '+1 (555) 567-8902'
    },
    tags: ['Startup', 'AI/ML'],
    rating: 3.5,
    gradient: 'gradient-pink'
  },
  {
    id: 'c6',
    name: 'MediCare Plus',
    logo: 'MP',
    industry: 'Healthcare',
    website: 'www.medicareplus.com',
    email: 'info@medicareplus.com',
    phone: '+1 (555) 678-9012',
    address: 'Boston, MA',
    status: 'active',
    joinDate: new Date('2023-05-15'),
    totalProjects: 5,
    activeProjects: 2,
    completedProjects: 3,
    totalRevenue: 410000,
    outstandingBalance: 65000,
    lastActivity: new Date('2024-03-02'),
    contactPerson: {
      name: 'Jennifer Lee',
      role: 'Head of Digital',
      email: 'jennifer@medicareplus.com',
      phone: '+1 (555) 678-9013'
    },
    tags: ['Healthcare', 'HIPAA Compliant', 'Enterprise'],
    rating: 5,
    gradient: 'gradient-yellow'
  }
]

const industryColors: Record<string, string> = {
  'Technology': 'gradient-blue',
  'Finance': 'gradient-green',
  'Human Resources': 'gradient-purple',
  'Retail': 'gradient-orange',
  'Software': 'gradient-pink',
  'Healthcare': 'gradient-yellow'
}

export default function ClientsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')

  // Calculate statistics
  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    totalRevenue: clients.reduce((sum, c) => sum + c.totalRevenue, 0),
    outstandingBalance: clients.reduce((sum, c) => sum + c.outstandingBalance, 0),
    totalProjects: clients.reduce((sum, c) => sum + c.totalProjects, 0)
  }

  // Filter clients
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.contactPerson.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || client.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Sort clients
  const sortedClients = [...filteredClients].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'revenue':
        return b.totalRevenue - a.totalRevenue
      case 'projects':
        return b.totalProjects - a.totalProjects
      case 'lastActivity':
        return b.lastActivity.getTime() - a.lastActivity.getTime()
      default:
        return 0
    }
  })

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Clients</h1>
          <p className="text-gray-400">Manage your client relationships</p>
        </div>
        <Link href="/dashboard/clients/new">
          <button className="px-6 py-3 rounded-xl gradient-purple text-white font-medium hover:opacity-90 transition-all duration-300 shadow-lg flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Add Client
          </button>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-blue">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.total}</span>
          </div>
          <p className="text-gray-400 text-sm">Total Clients</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-green">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.active}</span>
          </div>
          <p className="text-gray-400 text-sm">Active Clients</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-purple">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{stats.totalProjects}</span>
          </div>
          <p className="text-gray-400 text-sm">Total Projects</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-orange">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">${(stats.totalRevenue / 1000).toFixed(0)}k</span>
          </div>
          <p className="text-gray-400 text-sm">Total Revenue</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-pink">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">${(stats.outstandingBalance / 1000).toFixed(0)}k</span>
          </div>
          <p className="text-gray-400 text-sm">Outstanding</p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
          >
            <option value="name">Name</option>
            <option value="revenue">Revenue</option>
            <option value="projects">Projects</option>
            <option value="lastActivity">Last Activity</option>
          </select>
        </div>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {sortedClients.map((client) => (
          <Link key={client.id} href={`/dashboard/clients/${client.id}`}>
            <div className="group relative">
              {/* Hover Glow */}
              <div className={cn(
                "absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-60 blur-xl transition-opacity duration-500",
                client.gradient
              )} />

              {/* Card */}
              <div className="relative h-full rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6 group-hover:bg-gray-900/70 transition-all duration-300">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold",
                      industryColors[client.industry] || 'gradient-purple'
                    )}>
                      {client.logo}
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
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="h-4 w-4" />
                    <span>{client.contactPerson.name}, {client.contactPerson.role}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span>{client.address}</span>
                  </div>
                </div>

                {/* Projects & Revenue */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-lg bg-gray-800/50 p-3">
                    <p className="text-xs text-gray-400 mb-1">Projects</p>
                    <p className="text-sm font-medium text-white">
                      {client.activeProjects} active / {client.totalProjects} total
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-800/50 p-3">
                    <p className="text-xs text-gray-400 mb-1">Revenue</p>
                    <p className="text-sm font-medium text-white">
                      ${(client.totalRevenue / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(client.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-600"
                      )}
                    />
                  ))}
                  <span className="text-sm text-gray-400 ml-2">{client.rating}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {client.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-lg bg-gray-800/50 text-xs text-gray-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                  <div className="text-sm text-gray-400">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Last activity: {client.lastActivity.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {sortedClients.length === 0 && (
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-12">
          <div className="text-center">
            <Building2 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No clients found</h3>
            <p className="text-gray-400">Try adjusting your filters or add a new client</p>
          </div>
        </div>
      )}
    </div>
  )
}