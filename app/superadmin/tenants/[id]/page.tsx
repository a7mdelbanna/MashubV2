'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { superadminService } from '@/lib/services/superadmin-service'
import { User } from '@/types'
import {
  ArrowLeft, Users, Mail, Shield, Calendar, Plus,
  Trash2, Edit, Building2, CreditCard, Activity
} from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface TenantWithUsers {
  tenant: any
  users: User[]
}

export default function TenantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params)
  const tenantId = unwrappedParams.id
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<TenantWithUsers | null>(null)
  const [showAddUserModal, setShowAddUserModal] = useState(false)

  useEffect(() => {
    if (!user?.isSuperAdmin) {
      router.push('/superadmin')
      return
    }

    loadTenantData()
  }, [tenantId])

  const loadTenantData = async () => {
    try {
      setLoading(true)
      console.log('Loading tenant:', tenantId)
      const [tenant, users] = await Promise.all([
        superadminService.getTenant(tenantId),
        superadminService.getAllUsers(tenantId)
      ])

      console.log('Tenant loaded:', tenant)
      console.log('Users loaded:', users)

      if (!tenant) {
        console.error('Tenant not found for ID:', tenantId)
        toast.error('Tenant not found')
        setData(null)
        return
      }

      setData({ tenant, users })
    } catch (error: any) {
      console.error('Error loading tenant data:', error)
      toast.error(error?.message || 'Failed to load tenant data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    )
  }

  if (!data?.tenant) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Tenant not found</h2>
          <Link
            href="/superadmin/tenants"
            className="mt-4 inline-flex items-center text-purple-400 hover:text-purple-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tenants
          </Link>
        </div>
      </div>
    )
  }

  const { tenant, users } = data

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/superadmin/tenants"
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">{tenant.name}</h1>
            <p className="text-gray-400 mt-1">{tenant.slug}</p>
          </div>
        </div>

        <button
          onClick={() => setShowAddUserModal(true)}
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add User</span>
        </button>
      </div>

      {/* Tenant Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Plan</p>
              <p className="text-2xl font-bold text-white mt-1 capitalize">
                {tenant.subscription?.plan || 'Free'}
              </p>
            </div>
            <CreditCard className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Status</p>
              <p className="text-2xl font-bold text-white mt-1 capitalize">
                {tenant.subscription?.status || 'Active'}
              </p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Users</p>
              <p className="text-2xl font-bold text-white mt-1">
                {users.length} / {tenant.subscription?.seats || 10}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Created</p>
              <p className="text-sm font-medium text-white mt-1">
                {new Date(tenant.createdAt?.seconds * 1000).toLocaleDateString()}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Users ({users.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    No users found. Add the first user to get started.
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-800/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="font-medium text-white">{user.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-300 capitalize">
                      {user.department || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">
                      {user.createdAt
                        ? typeof user.createdAt === 'object' && 'seconds' in user.createdAt
                          ? new Date(user.createdAt.seconds * 1000).toLocaleDateString()
                          : new Date(user.createdAt).toLocaleDateString()
                        : '-'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-red-400"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <AddUserModal
          tenantId={tenantId}
          tenantName={tenant.name}
          currentUserId={user!.id}
          onClose={() => setShowAddUserModal(false)}
          onUserAdded={() => {
            loadTenantData()
            setShowAddUserModal(false)
          }}
        />
      )}
    </div>
  )
}

// ===========================================
// ADD USER MODAL
// ===========================================

function AddUserModal({
  tenantId,
  tenantName,
  currentUserId,
  onClose,
  onUserAdded
}: {
  tenantId: string
  tenantName: string
  currentUserId: string
  onClose: () => void
  onUserAdded: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    department: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (!formData.password.trim()) newErrors.password = 'Password is required'
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    try {
      setLoading(true)

      await superadminService.createTenantAdmin({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        tenantId,
        createdBy: currentUserId
      })

      toast.success('User added successfully!')
      onUserAdded()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Failed to add user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-2xl w-full max-w-md mx-4 border border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Add User to {tenantName}</h2>
          <p className="text-gray-400 text-sm mt-1">
            Create a new user account for this tenant
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              placeholder="John Doe"
            />
            {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              placeholder="john@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password <span className="text-red-400">*</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              placeholder="Minimum 6 characters"
            />
            {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
            <select
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Department (Optional)
            </label>
            <input
              type="text"
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              placeholder="Engineering, Sales, etc."
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-lg border border-gray-700 hover:bg-gray-800 text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add User'}
          </button>
        </div>
      </div>
    </div>
  )
}
