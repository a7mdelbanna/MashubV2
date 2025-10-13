'use client'

import { useState } from 'react'
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Key,
  Database,
  Server,
  Lock,
  Copy,
  Eye,
  EyeOff,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  User,
  Calendar,
  ExternalLink,
  Fingerprint,
  Code,
  Globe,
  CreditCard,
  Grid3x3,
  List
} from 'lucide-react'

// Types
type CredentialType = 'api_key' | 'database' | 'ssh_key' | 'password' | 'oauth' | 'certificate' | 'secret'
type SecurityLevel = 'critical' | 'high' | 'medium' | 'low'
type ViewMode = 'grid' | 'list'

interface Credential {
  id: string
  name: string
  type: CredentialType
  category: string
  username?: string
  value: string
  url?: string
  description?: string
  securityLevel: SecurityLevel
  lastRotated: string
  expiresAt?: string
  createdBy: string
  createdAt: string
  lastAccessedAt?: string
  tags: string[]
  notes?: string
}

// Mock data
const mockCredentials: Credential[] = [
  {
    id: 'cred-1',
    name: 'Production Database',
    type: 'database',
    category: 'Databases',
    username: 'admin',
    value: 'P@ssw0rd!2024#SecureDB',
    url: 'postgres://prod.example.com:5432/main',
    description: 'Main production PostgreSQL database',
    securityLevel: 'critical',
    lastRotated: '2025-10-01T10:00:00Z',
    expiresAt: '2026-01-01T00:00:00Z',
    createdBy: 'Mike Johnson',
    createdAt: '2025-02-15T10:00:00Z',
    lastAccessedAt: '2025-10-13T14:30:00Z',
    tags: ['production', 'database', 'postgresql'],
    notes: 'Rotate every 90 days. Contact DevOps before changing.'
  },
  {
    id: 'cred-2',
    name: 'AWS API Key',
    type: 'api_key',
    category: 'Cloud Services',
    username: undefined,
    value: 'AKIAIOSFODNN7EXAMPLE',
    url: 'https://aws.amazon.com',
    description: 'AWS access key for deployment pipeline',
    securityLevel: 'critical',
    lastRotated: '2025-09-15T10:00:00Z',
    expiresAt: '2025-12-15T00:00:00Z',
    createdBy: 'Lisa Martinez',
    createdAt: '2025-06-01T10:00:00Z',
    lastAccessedAt: '2025-10-13T12:00:00Z',
    tags: ['aws', 'cloud', 'deployment'],
    notes: 'Used by CI/CD pipeline. DO NOT rotate without updating GitHub Secrets.'
  },
  {
    id: 'cred-3',
    name: 'GitHub Deploy Key',
    type: 'ssh_key',
    category: 'Git Repositories',
    username: 'git',
    value: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...',
    url: 'https://github.com/company/repo',
    description: 'SSH key for automated deployments',
    securityLevel: 'high',
    lastRotated: '2025-08-01T10:00:00Z',
    createdBy: 'Mike Johnson',
    createdAt: '2025-03-01T10:00:00Z',
    lastAccessedAt: '2025-10-13T10:30:00Z',
    tags: ['github', 'ssh', 'deployment'],
    notes: 'Read-only access for deployment automation'
  },
  {
    id: 'cred-4',
    name: 'Stripe Secret Key',
    type: 'api_key',
    category: 'Payment Gateways',
    username: undefined,
    value: 'sk_live_51ABCxyz123...',
    url: 'https://stripe.com',
    description: 'Stripe secret key for payment processing',
    securityLevel: 'critical',
    lastRotated: '2025-07-20T10:00:00Z',
    createdBy: 'Sarah Chen',
    createdAt: '2025-05-10T10:00:00Z',
    lastAccessedAt: '2025-10-13T16:00:00Z',
    tags: ['stripe', 'payment', 'production'],
    notes: 'Monitor for any suspicious activity. Rotate immediately if compromised.'
  },
  {
    id: 'cred-5',
    name: 'Admin Portal Login',
    type: 'password',
    category: 'Internal Tools',
    username: 'admin@company.com',
    value: 'SuperSecure!Admin#2024',
    url: 'https://admin.company.com',
    description: 'Admin access to internal management portal',
    securityLevel: 'high',
    lastRotated: '2025-09-01T10:00:00Z',
    expiresAt: '2025-12-01T00:00:00Z',
    createdBy: 'Sarah Chen',
    createdAt: '2025-01-15T10:00:00Z',
    lastAccessedAt: '2025-10-12T09:00:00Z',
    tags: ['admin', 'internal', 'portal'],
    notes: '2FA enabled. Backup codes stored in secure location.'
  },
  {
    id: 'cred-6',
    name: 'Google OAuth Client',
    type: 'oauth',
    category: 'Authentication',
    username: undefined,
    value: '123456789-abcdefghijklmnop.apps.googleusercontent.com',
    url: 'https://console.cloud.google.com',
    description: 'OAuth credentials for Google Sign-In',
    securityLevel: 'high',
    lastRotated: '2025-06-15T10:00:00Z',
    createdBy: 'Alex Rivera',
    createdAt: '2025-02-20T10:00:00Z',
    lastAccessedAt: '2025-10-13T11:00:00Z',
    tags: ['google', 'oauth', 'authentication'],
    notes: 'Used for social login feature'
  },
  {
    id: 'cred-7',
    name: 'Redis Cache Password',
    type: 'password',
    category: 'Databases',
    username: 'default',
    value: 'RedisP@ss2024!Cache',
    url: 'redis://cache.example.com:6379',
    description: 'Redis cache server authentication',
    securityLevel: 'medium',
    lastRotated: '2025-08-10T10:00:00Z',
    createdBy: 'Mike Johnson',
    createdAt: '2025-04-05T10:00:00Z',
    lastAccessedAt: '2025-10-13T15:20:00Z',
    tags: ['redis', 'cache', 'database'],
    notes: 'Used for session storage and caching'
  },
  {
    id: 'cred-8',
    name: 'SSL Certificate',
    type: 'certificate',
    category: 'Certificates',
    username: undefined,
    value: '-----BEGIN CERTIFICATE-----\nMIIDXTCCAkWgAwIBAgIJ...',
    url: 'https://company.com',
    description: 'SSL/TLS certificate for main domain',
    securityLevel: 'critical',
    lastRotated: '2025-09-01T10:00:00Z',
    expiresAt: '2026-09-01T00:00:00Z',
    createdBy: 'Lisa Martinez',
    createdAt: '2024-09-01T10:00:00Z',
    lastAccessedAt: '2025-10-01T08:00:00Z',
    tags: ['ssl', 'certificate', 'security'],
    notes: 'Auto-renewal configured. Monitor expiration date.'
  }
]

// Helper functions
function getCredentialIcon(type: CredentialType) {
  switch (type) {
    case 'api_key':
      return <Key className="w-5 h-5" />
    case 'database':
      return <Database className="w-5 h-5" />
    case 'ssh_key':
      return <Server className="w-5 h-5" />
    case 'password':
      return <Lock className="w-5 h-5" />
    case 'oauth':
      return <Fingerprint className="w-5 h-5" />
    case 'certificate':
      return <Shield className="w-5 h-5" />
    case 'secret':
      return <Code className="w-5 h-5" />
  }
}

function getTypeColor(type: CredentialType): string {
  switch (type) {
    case 'api_key':
      return 'bg-blue-500/20 text-blue-400'
    case 'database':
      return 'bg-purple-500/20 text-purple-400'
    case 'ssh_key':
      return 'bg-green-500/20 text-green-400'
    case 'password':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'oauth':
      return 'bg-pink-500/20 text-pink-400'
    case 'certificate':
      return 'bg-orange-500/20 text-orange-400'
    case 'secret':
      return 'bg-gray-500/20 text-gray-400'
  }
}

function getSecurityLevelColor(level: SecurityLevel): string {
  switch (level) {
    case 'critical':
      return 'bg-red-500/20 text-red-400'
    case 'high':
      return 'bg-orange-500/20 text-orange-400'
    case 'medium':
      return 'bg-yellow-500/20 text-yellow-400'
    case 'low':
      return 'bg-green-500/20 text-green-400'
  }
}

function formatType(type: CredentialType): string {
  return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

function getDaysUntilExpiry(expiresAt: string): number {
  const now = new Date()
  const expiry = new Date(expiresAt)
  const diff = expiry.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function maskValue(value: string, show: boolean): string {
  if (show) return value
  if (value.length <= 8) return '•'.repeat(value.length)
  return value.substring(0, 4) + '•'.repeat(value.length - 8) + value.substring(value.length - 4)
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
}

export default function ProjectVaultPage() {
  const [credentials] = useState<Credential[]>(mockCredentials)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<CredentialType[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [visibleValues, setVisibleValues] = useState<Set<string>>(new Set())

  const toggleValueVisibility = (id: string) => {
    setVisibleValues(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  // Filter credentials
  const filteredCredentials = credentials.filter(cred => {
    const matchesSearch = cred.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cred.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         cred.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(cred.type)
    return matchesSearch && matchesType
  })

  const criticalCount = credentials.filter(c => c.securityLevel === 'critical').length
  const expiringCount = credentials.filter(c => c.expiresAt && getDaysUntilExpiry(c.expiresAt) < 30).length
  const categories = Array.from(new Set(credentials.map(c => c.category)))

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent">
              Project Vault
            </h1>
            <p className="text-gray-400 mt-1">Secure storage for sensitive credentials</p>
          </div>

          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors">
            <Plus className="w-4 h-4" />
            New Credential
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Total Credentials</div>
            <div className="text-2xl font-bold text-white">{credentials.length}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Critical</div>
            <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Expiring Soon</div>
            <div className="text-2xl font-bold text-yellow-400">{expiringCount}</div>
            <div className="text-xs text-gray-500 mt-1">Within 30 days</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Categories</div>
            <div className="text-2xl font-bold text-purple-400">{categories.length}</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search credentials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              showFilters ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-400">Type:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['api_key', 'database', 'ssh_key', 'password', 'oauth', 'certificate', 'secret'] as CredentialType[]).map(type => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedTypes(prev =>
                      prev.includes(type)
                        ? prev.filter(t => t !== type)
                        : [...prev, type]
                    )
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedTypes.includes(type)
                      ? getTypeColor(type)
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {formatType(type)}
                </button>
              ))}
              {selectedTypes.length > 0 && (
                <button
                  onClick={() => setSelectedTypes([])}
                  className="px-3 py-1 text-xs text-gray-400 hover:text-white transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Credentials Grid/List */}
      {filteredCredentials.length === 0 ? (
        <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-16 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No credentials found</h3>
          <p className="text-gray-400 mb-6">Add credentials to get started</p>
          <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 mx-auto transition-colors">
            <Plus className="w-4 h-4" />
            New Credential
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 gap-6">
          {filteredCredentials.map(cred => {
            const isVisible = visibleValues.has(cred.id)
            const daysUntilExpiry = cred.expiresAt ? getDaysUntilExpiry(cred.expiresAt) : null
            const isExpiring = daysUntilExpiry !== null && daysUntilExpiry < 30

            return (
              <div
                key={cred.id}
                className="bg-gray-800/50 rounded-lg border border-gray-700 p-6 hover:border-purple-500 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-12 h-12 rounded-lg ${getTypeColor(cred.type)} flex items-center justify-center`}>
                      {getCredentialIcon(cred.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate">{cred.name}</h3>
                      <p className="text-sm text-gray-400 truncate">{cred.category}</p>
                    </div>
                  </div>

                  <button className="p-1.5 hover:bg-gray-700 rounded transition-colors flex-shrink-0">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Description */}
                {cred.description && (
                  <p className="text-sm text-gray-400 mb-4">{cred.description}</p>
                )}

                {/* Security & Type Badges */}
                <div className="flex items-center gap-2 mb-4">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(cred.type)}`}>
                    {formatType(cred.type)}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSecurityLevelColor(cred.securityLevel)}`}>
                    {cred.securityLevel.toUpperCase()}
                  </span>
                  {isExpiring && (
                    <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Expires in {daysUntilExpiry}d
                    </span>
                  )}
                </div>

                {/* Username */}
                {cred.username && (
                  <div className="mb-3">
                    <div className="text-xs text-gray-400 mb-1">Username</div>
                    <div className="flex items-center gap-2 p-2 bg-gray-900 rounded-lg">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-white font-mono flex-1">{cred.username}</span>
                      <button
                        onClick={() => copyToClipboard(cred.username!)}
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Copy username"
                      >
                        <Copy className="w-3 h-3 text-gray-400" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Value */}
                <div className="mb-3">
                  <div className="text-xs text-gray-400 mb-1">
                    {cred.type === 'password' ? 'Password' : 'Value'}
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-gray-900 rounded-lg">
                    <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-white font-mono flex-1 truncate">
                      {maskValue(cred.value, isVisible)}
                    </span>
                    <button
                      onClick={() => toggleValueVisibility(cred.id)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                      title={isVisible ? 'Hide' : 'Show'}
                    >
                      {isVisible ? (
                        <EyeOff className="w-3 h-3 text-gray-400" />
                      ) : (
                        <Eye className="w-3 h-3 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(cred.value)}
                      className="p-1 hover:bg-gray-700 rounded transition-colors"
                      title="Copy value"
                    >
                      <Copy className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* URL */}
                {cred.url && (
                  <div className="mb-4">
                    <div className="text-xs text-gray-400 mb-1">URL</div>
                    <div className="flex items-center gap-2 p-2 bg-gray-900 rounded-lg">
                      <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-blue-400 font-mono flex-1 truncate">{cred.url}</span>
                      <a
                        href={cred.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:bg-gray-700 rounded transition-colors"
                        title="Open URL"
                      >
                        <ExternalLink className="w-3 h-3 text-gray-400" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {cred.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {cred.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Meta Info */}
                <div className="pt-4 border-t border-gray-700 space-y-2 text-xs text-gray-400">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Last rotated
                    </span>
                    <span>{new Date(cred.lastRotated).toLocaleDateString()}</span>
                  </div>
                  {cred.expiresAt && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Expires
                      </span>
                      <span className={isExpiring ? 'text-yellow-400 font-medium' : ''}>
                        {new Date(cred.expiresAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Created by
                    </span>
                    <span>{cred.createdBy}</span>
                  </div>
                </div>

                {/* Notes */}
                {cred.notes && (
                  <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <div className="text-xs font-medium text-blue-400 mb-1">Important Notes</div>
                    <p className="text-xs text-gray-300">{cred.notes}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-gray-800/30 rounded-lg border border-gray-700 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-400">
            <div className="col-span-3">Name</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Security</div>
            <div className="col-span-2">Last Rotated</div>
            <div className="col-span-2">Expires</div>
            <div className="col-span-1"></div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-700">
            {filteredCredentials.map(cred => {
              const isVisible = visibleValues.has(cred.id)
              const daysUntilExpiry = cred.expiresAt ? getDaysUntilExpiry(cred.expiresAt) : null
              const isExpiring = daysUntilExpiry !== null && daysUntilExpiry < 30

              return (
                <div
                  key={cred.id}
                  className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="col-span-3 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${getTypeColor(cred.type)} flex items-center justify-center flex-shrink-0`}>
                      {getCredentialIcon(cred.type)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-white truncate">{cred.name}</div>
                      <div className="text-xs text-gray-400 truncate">{cred.category}</div>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(cred.type)}`}>
                      {formatType(cred.type)}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSecurityLevelColor(cred.securityLevel)}`}>
                      {cred.securityLevel.toUpperCase()}
                    </span>
                  </div>
                  <div className="col-span-2 flex items-center text-sm text-gray-300">
                    {new Date(cred.lastRotated).toLocaleDateString()}
                  </div>
                  <div className="col-span-2 flex items-center">
                    {cred.expiresAt ? (
                      <div className="space-y-1">
                        <div className={`text-sm ${isExpiring ? 'text-yellow-400 font-medium' : 'text-gray-300'}`}>
                          {new Date(cred.expiresAt).toLocaleDateString()}
                        </div>
                        {isExpiring && (
                          <div className="text-xs text-yellow-400 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {daysUntilExpiry}d left
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">N/A</span>
                    )}
                  </div>
                  <div className="col-span-1 flex items-center justify-end gap-1">
                    <button
                      onClick={() => toggleValueVisibility(cred.id)}
                      className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                      title={isVisible ? 'Hide' : 'Show'}
                    >
                      {isVisible ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(cred.value)}
                      className="p-1.5 hover:bg-gray-700 rounded transition-colors"
                      title="Copy value"
                    >
                      <Copy className="w-4 h-4 text-gray-400" />
                    </button>
                    <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
