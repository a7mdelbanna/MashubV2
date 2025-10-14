'use client'

import { useState, useEffect } from 'react'
import {
  Users, Search, Filter, UserPlus, MoreVertical, Edit, Trash2,
  Ban, CheckCircle, AlertCircle, Mail, Clock, Shield, ChevronDown
} from 'lucide-react'
import { User } from '@/types/settings'
import {
  getUsers,
  updateUser,
  deleteUser,
  suspendUser,
  activateUser,
  getRoleColor,
  getRoleIcon,
  getUserStats,
  searchUsers,
  filterUsersByRole,
  DEFAULT_ROLES
} from '@/lib/team-utils'
import { initializeMockTeamData } from '@/lib/mock-team-data'
import InviteMemberModal from '@/components/team/InviteMemberModal'
import EditMemberModal from '@/components/team/EditMemberModal'
import PermissionEditorModal from '@/components/team/PermissionEditorModal'

export default function TeamMembersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    suspended: 0,
    inactive: 0
  })

  // Modal states
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    // Initialize mock data on first load
    initializeMockTeamData()
    loadUsers()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [users, searchQuery, filterRole, filterStatus])

  const loadUsers = () => {
    const allUsers = getUsers()
    setUsers(allUsers)
    setStats(getUserStats())
  }

  const applyFilters = () => {
    let filtered = [...users]

    // Apply search
    if (searchQuery) {
      filtered = searchUsers(searchQuery)
    }

    // Apply role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(u => u.role === filterRole)
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(u => u.status === filterStatus)
    }

    setFilteredUsers(filtered)
  }

  const handleSelectAll = () => {
    if (selectedUsers.size === filteredUsers.length) {
      setSelectedUsers(new Set())
    } else {
      setSelectedUsers(new Set(filteredUsers.map(u => u.id)))
    }
  }

  const handleSelectUser = (userId: string) => {
    const newSelected = new Set(selectedUsers)
    if (newSelected.has(userId)) {
      newSelected.delete(userId)
    } else {
      newSelected.add(userId)
    }
    setSelectedUsers(newSelected)
  }

  const handleSuspendUser = (userId: string) => {
    if (confirm('Are you sure you want to suspend this user?')) {
      suspendUser(userId)
      loadUsers()
    }
  }

  const handleActivateUser = (userId: string) => {
    activateUser(userId)
    loadUsers()
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUser(userId)
      loadUsers()
    }
  }

  const handleBulkSuspend = () => {
    if (confirm(`Suspend ${selectedUsers.size} selected users?`)) {
      selectedUsers.forEach(userId => suspendUser(userId))
      setSelectedUsers(new Set())
      loadUsers()
    }
  }

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedUsers.size} selected users? This action cannot be undone.`)) {
      selectedUsers.forEach(userId => deleteUser(userId))
      setSelectedUsers(new Set())
      loadUsers()
    }
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setShowEditModal(true)
  }

  const handleEditPermissions = (user: User) => {
    setSelectedUser(user)
    setShowPermissionModal(true)
  }

  const getTimeAgo = (date: string) => {
    const now = new Date().getTime()
    const past = new Date(date).getTime()
    const diff = now - past

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      super_admin: 'bg-red-500/20 text-red-300 border-red-500/30',
      admin: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      manager: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      employee: 'bg-green-500/20 text-green-300 border-green-500/30',
      client: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      vendor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      guest: 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
    return colors[role] || colors.guest
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Team Members</h1>
              <p className="text-gray-400">Manage your team and assign roles</p>
            </div>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Invite Member</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-300 text-sm font-medium">Total Members</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.total}</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/20">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-300 text-sm font-medium">Active</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.active}</p>
            </div>
            <div className="p-3 rounded-xl bg-green-500/20">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-300 text-sm font-medium">Suspended</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.suspended}</p>
            </div>
            <div className="p-3 rounded-xl bg-red-500/20">
              <Ban className="h-6 w-6 text-red-400" />
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-gradient-to-br from-gray-500/10 to-gray-600/10 border border-gray-500/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-medium">Inactive</p>
              <p className="text-3xl font-bold text-white mt-2">{stats.inactive}</p>
            </div>
            <div className="p-3 rounded-xl bg-gray-500/20">
              <AlertCircle className="h-6 w-6 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-4">
        <div className="flex items-center justify-between space-x-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search members by name or email..."
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

          {/* Bulk Actions */}
          {selectedUsers.size > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">{selectedUsers.size} selected</span>
              <button
                onClick={handleBulkSuspend}
                className="px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-colors text-sm"
              >
                Suspend
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/30 text-red-400 transition-colors text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Roles</option>
                {DEFAULT_ROLES.map(role => (
                  <option key={role.slug} value={role.slug}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Members List */}
      <div className="rounded-xl bg-gray-900/50 backdrop-blur-xl border border-gray-800">
        <div className="p-4 border-b border-gray-800 flex items-center space-x-4">
          <input
            type="checkbox"
            checked={selectedUsers.size === filteredUsers.length && filteredUsers.length > 0}
            onChange={handleSelectAll}
            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-900"
          />
          <span className="text-sm text-gray-400">
            {filteredUsers.length} {filteredUsers.length === 1 ? 'member' : 'members'}
          </span>
        </div>

        <div className="divide-y divide-gray-800">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="p-4 hover:bg-gray-800/30 transition-colors"
            >
              <div className="flex items-center space-x-4">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedUsers.has(user.id)}
                  onChange={() => handleSelectUser(user.id)}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-900"
                />

                {/* Avatar */}
                <img
                  src={user.avatar || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-12 h-12 rounded-full"
                />

                {/* User Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-white font-medium">
                      {user.firstName} {user.lastName}
                    </h3>
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                      {DEFAULT_ROLES.find(r => r.slug === user.role)?.name || user.role}
                    </span>
                    {user.status === 'suspended' && (
                      <span className="px-2 py-1 rounded-lg text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/30">
                        Suspended
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-sm text-gray-400 flex items-center space-x-1">
                      <Mail className="h-3 w-3" />
                      <span>{user.email}</span>
                    </span>
                    {user.teamIds && user.teamIds.length > 0 && (
                      <span className="text-sm text-gray-400">
                        {user.teamIds.length} {user.teamIds.length === 1 ? 'team' : 'teams'}
                      </span>
                    )}
                    {user.lastLoginAt && (
                      <span className="text-sm text-gray-400 flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{getTimeAgo(user.lastLoginAt)}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEditPermissions(user)}
                    className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    title="Edit Permissions"
                  >
                    <Shield className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEditUser(user)}
                    className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    title="Edit Member"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  {user.status === 'active' ? (
                    <button
                      onClick={() => handleSuspendUser(user.id)}
                      className="p-2 rounded-lg bg-gray-800/50 hover:bg-red-600/20 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Ban className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivateUser(user.id)}
                      className="p-2 rounded-lg bg-gray-800/50 hover:bg-green-600/20 text-gray-400 hover:text-green-400 transition-colors"
                    >
                      <CheckCircle className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 rounded-lg bg-gray-800/50 hover:bg-red-600/20 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400 mb-2">No members found</h3>
              <p className="text-sm text-gray-500">
                {searchQuery || filterRole !== 'all' || filterStatus !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Invite your first team member to get started'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <InviteMemberModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        onInvite={() => loadUsers()}
      />

      <EditMemberModal
        isOpen={showEditModal}
        user={selectedUser}
        onClose={() => {
          setShowEditModal(false)
          setSelectedUser(null)
        }}
        onUpdate={() => loadUsers()}
      />

      <PermissionEditorModal
        isOpen={showPermissionModal}
        user={selectedUser}
        onClose={() => {
          setShowPermissionModal(false)
          setSelectedUser(null)
        }}
        onUpdate={() => loadUsers()}
      />
    </div>
  )
}
