'use client'

import { useState, useEffect } from 'react'
import { superadminService } from '@/lib/services/superadmin-service'
import { useAuth } from '@/contexts/auth-context'
import {
  Plus,
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Eye,
  Pause,
  Play,
  Trash2,
  X,
  Building2,
  Mail,
  Users,
  Crown
} from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Tenant } from '@/types'

export default function TenantsPage() {
  const { user } = useAuth()
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    loadTenants()
  }, [])

  const loadTenants = async () => {
    try {
      setLoading(true)
      const data = await superadminService.getAllTenants()
      setTenants(data)
    } catch (error) {
      console.error('Failed to load tenants:', error)
      toast.error('Failed to load tenants')
    } finally {
      setLoading(false)
    }
  }

  const handleSuspend = async (tenantId: string) => {
    if (!confirm('Are you sure you want to suspend this tenant?')) return
    try {
      await superadminService.suspendTenant(tenantId, 'Admin action', user!.id)
      toast.success('Tenant suspended')
      loadTenants()
    } catch (error) {
      console.error(error)
      toast.error('Failed to suspend tenant')
    }
  }

  const handleReactivate = async (tenantId: string) => {
    try {
      await superadminService.reactivateTenant(tenantId, user!.id)
      toast.success('Tenant reactivated')
      loadTenants()
    } catch (error) {
      console.error(error)
      toast.error('Failed to reactivate tenant')
    }
  }

  const filteredTenants = tenants.filter(
    t =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.slug?.toLowerCase().includes(search.toLowerCase()) ||
      t.subscription?.billingEmail?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tenants</h1>
          <p className="text-gray-400">Manage all companies on the platform</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all"
        >
          <Plus className="h-5 w-5" />
          <span>Create Tenant</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search tenants by name, slug, or email..."
            className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Tenants Table */}
      {loading ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
          <p className="text-gray-400">Loading tenants...</p>
        </div>
      ) : filteredTenants.length === 0 ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-8 text-center">
          <Building2 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No tenants found</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-purple-400 hover:text-purple-300"
          >
            Create your first tenant
          </button>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                  Company
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                  Plan
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                  Users
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-300">
                  Created
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-300">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredTenants.map(tenant => (
                <tr
                  key={tenant.id}
                  className="hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => window.location.href = `/superadmin/tenants/${tenant.id}`}
                >
                  <td className="px-6 py-4">
                    <Link href={`/superadmin/tenants/${tenant.id}`} className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                        {tenant.name?.charAt(0) || 'T'}
                      </div>
                      <div>
                        <p className="font-medium text-white hover:text-purple-400 transition-colors">{tenant.name}</p>
                        <p className="text-sm text-gray-400">{tenant.slug}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <PlanBadge plan={tenant.subscription.plan} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={tenant.status} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white">
                      {tenant.subscription.seatsUsed || 0} / {tenant.subscription.seats}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    {tenant.createdAt
                      ? new Date(tenant.createdAt.seconds * 1000).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      {tenant.status === 'active' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSuspend(tenant.id)
                          }}
                          className="p-2 rounded-lg hover:bg-gray-800 text-yellow-400 hover:text-yellow-300"
                          title="Suspend"
                        >
                          <Pause className="h-4 w-4" />
                        </button>
                      )}
                      {tenant.status === 'suspended' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleReactivate(tenant.id)
                          }}
                          className="p-2 rounded-lg hover:bg-gray-800 text-green-400 hover:text-green-300"
                          title="Reactivate"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Tenant Modal */}
      {showCreateModal && (
        <CreateTenantModal
          onClose={() => setShowCreateModal(false)}
          onCreated={loadTenants}
          currentUserId={user!.id}
        />
      )}
    </div>
  )
}

// ===========================================
// COMPONENTS
// ===========================================

function PlanBadge({ plan }: { plan: string }) {
  const colors = {
    free: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    starter: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    growth: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    enterprise: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
  }

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
        colors[plan as keyof typeof colors] || colors.free
      }`}
    >
      {plan.charAt(0).toUpperCase() + plan.slice(1)}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const config = {
    active: {
      icon: CheckCircle2,
      color: 'bg-green-500/20 text-green-300 border-green-500/30',
      label: 'Active'
    },
    suspended: {
      icon: AlertTriangle,
      color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      label: 'Suspended'
    },
    cancelled: {
      icon: XCircle,
      color: 'bg-red-500/20 text-red-300 border-red-500/30',
      label: 'Cancelled'
    }
  }

  const { icon: Icon, color, label } = config[status as keyof typeof config] || config.active

  return (
    <span
      className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${color}`}
    >
      <Icon className="h-3 w-3" />
      <span>{label}</span>
    </span>
  )
}

// ===========================================
// CREATE TENANT MODAL
// ===========================================

function CreateTenantModal({
  onClose,
  onCreated,
  currentUserId
}: {
  onClose: () => void
  onCreated: () => void
  currentUserId: string
}) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    billingEmail: '',
    plan: 'starter',
    accessType: 'standard' as 'standard' | 'free_access' | 'no_trial',
    trialDays: 14,
    freeAccessDays: 30,
    adminName: '',
    adminEmail: '',
    adminPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Company name is required'
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required'
    if (!formData.billingEmail.trim()) newErrors.billingEmail = 'Billing email is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.adminName.trim()) newErrors.adminName = 'Admin name is required'
    if (!formData.adminEmail.trim()) newErrors.adminEmail = 'Admin email is required'
    if (!formData.adminPassword.trim()) newErrors.adminPassword = 'Password is required'
    if (formData.adminPassword.length < 6)
      newErrors.adminPassword = 'Password must be at least 6 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateTenant = async () => {
    if (!validateStep2()) return

    try {
      setLoading(true)

      // Step 1: Create Tenant
      const tenantId = await superadminService.createTenant({
        name: formData.name,
        slug: formData.slug,
        billingEmail: formData.billingEmail,
        plan: formData.plan as any,
        accessType: formData.accessType,
        trialDays: formData.accessType === 'standard' ? formData.trialDays : null,
        freeAccessDays: formData.accessType === 'free_access' ? formData.freeAccessDays : null,
        createdBy: currentUserId
      })

      // Step 2: Create Admin User
      await superadminService.createTenantAdmin({
        email: formData.adminEmail,
        password: formData.adminPassword,
        name: formData.adminName,
        tenantId,
        createdBy: currentUserId
      })

      toast.success('Tenant created successfully!')
      onCreated()
      onClose()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Failed to create tenant')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl w-full max-w-2xl mx-4 border border-gray-800 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Create New Tenant</h2>
            <p className="text-gray-400 text-sm mt-1">
              Step {step} of 2: {step === 1 ? 'Company Info' : 'Admin User'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Company Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => {
                    setFormData({ ...formData, name: e.target.value })
                    // Auto-generate slug
                    const slug = e.target.value
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/^-|-$/g, '')
                    setFormData(prev => ({ ...prev, slug }))
                  }}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                  placeholder="e.g., Acme Corporation"
                />
                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Slug <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={e =>
                    setFormData({ ...formData, slug: e.target.value.toLowerCase() })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none font-mono"
                  placeholder="e.g., acme-corp"
                />
                {errors.slug && <p className="mt-1 text-xs text-red-400">{errors.slug}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Billing Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={formData.billingEmail}
                  onChange={e => setFormData({ ...formData, billingEmail: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                  placeholder="billing@acme.com"
                />
                {errors.billingEmail && (
                  <p className="mt-1 text-xs text-red-400">{errors.billingEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Plan <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.plan}
                  onChange={e => setFormData({ ...formData, plan: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="free">Free - 3 users, Basic features</option>
                  <option value="starter">Starter - $49/mo, 10 users</option>
                  <option value="growth">Growth - $199/mo, 50 users, All features</option>
                  <option value="enterprise">Enterprise - Custom pricing</option>
                </select>
              </div>

              {/* Access Type Configuration */}
              <div className="space-y-3 pt-4 border-t border-gray-800">
                <label className="block text-sm font-medium text-gray-300">
                  Access Configuration
                </label>

                {/* Access Type Radio Buttons */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500/50 cursor-pointer">
                    <input
                      type="radio"
                      name="accessType"
                      value="standard"
                      checked={formData.accessType === 'standard'}
                      onChange={e => setFormData({ ...formData, accessType: 'standard' })}
                      className="w-4 h-4 text-purple-600"
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium">Standard with Trial</div>
                      <div className="text-xs text-gray-400">Free trial period, then paid</div>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500/50 cursor-pointer">
                    <input
                      type="radio"
                      name="accessType"
                      value="free_access"
                      checked={formData.accessType === 'free_access'}
                      onChange={e => setFormData({ ...formData, accessType: 'free_access' })}
                      className="w-4 h-4 text-purple-600"
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium">Free Access Period</div>
                      <div className="text-xs text-gray-400">
                        Free for X days, auto-suspend after expiry
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-purple-500/50 cursor-pointer">
                    <input
                      type="radio"
                      name="accessType"
                      value="no_trial"
                      checked={formData.accessType === 'no_trial'}
                      onChange={e => setFormData({ ...formData, accessType: 'no_trial' })}
                      className="w-4 h-4 text-purple-600"
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium">No Trial</div>
                      <div className="text-xs text-gray-400">
                        Starts immediately on paid plan
                      </div>
                    </div>
                  </label>
                </div>

                {/* Trial Days Input - Only show if 'standard' */}
                {formData.accessType === 'standard' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Trial Duration (days)
                    </label>
                    <input
                      type="number"
                      value={formData.trialDays}
                      onChange={e =>
                        setFormData({ ...formData, trialDays: parseInt(e.target.value) || 0 })
                      }
                      min="0"
                      max="365"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                      placeholder="14"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Tenant will have {formData.trialDays} days to evaluate before billing starts
                    </p>
                  </div>
                )}

                {/* Free Access Days Input - Only show if 'free_access' */}
                {formData.accessType === 'free_access' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Free Access Duration (days)
                    </label>
                    <input
                      type="number"
                      value={formData.freeAccessDays}
                      onChange={e =>
                        setFormData({ ...formData, freeAccessDays: parseInt(e.target.value) || 0 })
                      }
                      min="1"
                      max="365"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                      placeholder="30"
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Tenant will be automatically suspended after {formData.freeAccessDays} days
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (validateStep1()) setStep(2)
                }}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
              >
                Next: Admin User
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.adminName}
                  onChange={e => setFormData({ ...formData, adminName: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                  placeholder="John Doe"
                />
                {errors.adminName && (
                  <p className="mt-1 text-xs text-red-400">{errors.adminName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={formData.adminEmail}
                  onChange={e => setFormData({ ...formData, adminEmail: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                  placeholder="admin@acme.com"
                />
                {errors.adminEmail && (
                  <p className="mt-1 text-xs text-red-400">{errors.adminEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Password <span className="text-red-400">*</span>
                </label>
                <input
                  type="password"
                  value={formData.adminPassword}
                  onChange={e => setFormData({ ...formData, adminPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                  placeholder="Minimum 6 characters"
                />
                {errors.adminPassword && (
                  <p className="mt-1 text-xs text-red-400">{errors.adminPassword}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setStep(1)}
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium disabled:opacity-50"
                >
                  Back
                </button>
                <button
                  onClick={handleCreateTenant}
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Tenant'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
