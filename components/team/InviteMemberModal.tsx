'use client'

import { useState } from 'react'
import { X, Mail, User as UserIcon, Shield, Users as UsersIcon, Send } from 'lucide-react'
import { User } from '@/types/settings'
import { DEFAULT_ROLES, addUser } from '@/lib/team-utils'

interface InviteMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onInvite: (user: User) => void
}

export default function InviteMemberModal({ isOpen, onClose, onInvite }: InviteMemberModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'employee' as const,
    teamIds: [] as string[],
    sendInvite: true
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    // Create new user
    const rolePermissions = DEFAULT_ROLES.find(r => r.slug === formData.role)?.permissions || []

    const newUser: Omit<User, 'id' | 'createdAt' | 'updatedAt'> = {
      tenantId: 'tenant_default',
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      avatar: `https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=random`,
      role: formData.role,
      permissions: rolePermissions,
      teamIds: formData.teamIds,
      status: 'active',
      isEmailVerified: false,
      lastLoginAt: null
    }

    const createdUser = addUser(newUser)

    onInvite(createdUser)

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: 'employee',
      teamIds: [],
      sendInvite: true
    })
    setErrors({})
    onClose()
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Invite Team Member</h2>
              <p className="text-sm text-gray-400">Send an invitation to join your team</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center space-x-2">
              <UserIcon className="h-4 w-4" />
              <span>Personal Information</span>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  First Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-gray-800/50 border ${
                    errors.firstName ? 'border-red-500' : 'border-gray-700'
                  } text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Last Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl bg-gray-800/50 border ${
                    errors.lastName ? 'border-red-500' : 'border-gray-700'
                  } text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl bg-gray-800/50 border ${
                  errors.email ? 'border-red-500' : 'border-gray-700'
                } text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all`}
                placeholder="john.doe@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Role & Permissions</span>
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Select Role <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {DEFAULT_ROLES.filter(role => role.slug !== 'super_admin').map((role) => (
                  <button
                    key={role.slug}
                    type="button"
                    onClick={() => handleChange('role', role.slug)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.role === role.slug
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className="p-2 rounded-lg text-xl"
                        style={{ backgroundColor: `${role.color}20` }}
                      >
                        {role.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{role.name}</h4>
                        <p className="text-xs text-gray-400 mt-1">{role.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Invitation Options */}
          <div>
            <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center space-x-2">
              <Send className="h-4 w-4" />
              <span>Invitation Options</span>
            </h3>
            <label className="flex items-center space-x-3 p-4 rounded-xl bg-gray-800/30 border border-gray-700 cursor-pointer hover:bg-gray-800/50 transition-colors">
              <input
                type="checkbox"
                checked={formData.sendInvite}
                onChange={(e) => handleChange('sendInvite', e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-900"
              />
              <div>
                <p className="text-white font-medium">Send invitation email</p>
                <p className="text-sm text-gray-400">User will receive an email with login instructions</p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-colors flex items-center space-x-2"
            >
              <Mail className="h-4 w-4" />
              <span>Send Invitation</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
