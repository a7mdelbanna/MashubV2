'use client'

import { useState, useEffect } from 'react'
import {
  Users, Search, Filter, UserPlus, MoreVertical, Edit, Trash2,
  Ban, CheckCircle, AlertCircle, Mail, Clock, Briefcase, Award,
  ChevronDown, Building2, Code, DollarSign
} from 'lucide-react'
import type { Employee, EmployeeRole, EmployeeDepartment, EmployeeStatus } from '@/types'
import { EmployeesService } from '@/services/employees.service'

// Mock tenant ID - in production, get from auth context
const TENANT_ID = 'tenant-1'
const CURRENT_USER_ID = 'user-1'

export default function EmployeeManagementPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDepartment, setFilterDepartment] = useState<string>('all')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [selectedEmployees, setSelectedEmployees] = useState<Set<string>>(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    onLeave: 0,
    inactive: 0
  })

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)

  useEffect(() => {
    loadEmployees()
  }, [])

  useEffect(() => {
    applyFilters()
    calculateStats()
  }, [employees, searchQuery, filterDepartment, filterRole, filterStatus])

  const loadEmployees = async () => {
    try {
      setLoading(true)
      const data = await EmployeesService.list(TENANT_ID)
      setEmployees(data)
    } catch (error) {
      console.error('Failed to load employees:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...employees]

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(emp =>
        emp.fullName.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.title.toLowerCase().includes(query)
      )
    }

    // Apply department filter
    if (filterDepartment !== 'all') {
      filtered = filtered.filter(emp => emp.department === filterDepartment)
    }

    // Apply role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter(emp => emp.role === filterRole)
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(emp => emp.status === filterStatus)
    }

    setFilteredEmployees(filtered)
  }

  const calculateStats = () => {
    setStats({
      total: employees.length,
      active: employees.filter(e => e.status === 'active').length,
      onLeave: employees.filter(e => e.status === 'on_leave').length,
      inactive: employees.filter(e => e.status === 'inactive' || e.status === 'terminated').length
    })
  }

  const handleSelectAll = () => {
    if (selectedEmployees.size === filteredEmployees.length) {
      setSelectedEmployees(new Set())
    } else {
      setSelectedEmployees(new Set(filteredEmployees.map(e => e.id)))
    }
  }

  const handleSelectEmployee = (employeeId: string) => {
    const newSelected = new Set(selectedEmployees)
    if (newSelected.has(employeeId)) {
      newSelected.delete(employeeId)
    } else {
      newSelected.add(employeeId)
    }
    setSelectedEmployees(newSelected)
  }

  const handleUpdateStatus = async (employeeId: string, status: EmployeeStatus) => {
    try {
      const terminationDate = status === 'terminated' ? new Date() : undefined
      await EmployeesService.updateStatus(TENANT_ID, employeeId, status, terminationDate)
      await loadEmployees()
    } catch (error) {
      console.error('Failed to update status:', error)
      alert('Failed to update employee status')
    }
  }

  const handleDeleteEmployee = async (employeeId: string) => {
    if (confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      try {
        await EmployeesService.delete(TENANT_ID, employeeId)
        await loadEmployees()
      } catch (error) {
        console.error('Failed to delete employee:', error)
        alert('Failed to delete employee')
      }
    }
  }

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee)
    setShowEditModal(true)
  }

  const getDepartmentBadgeColor = (department: EmployeeDepartment) => {
    const colors: Record<EmployeeDepartment, string> = {
      engineering: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      design: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      product: 'bg-green-500/20 text-green-400 border-green-500/30',
      qa: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      devops: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      management: 'bg-red-500/20 text-red-400 border-red-500/30',
      sales: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      marketing: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      hr: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      finance: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      operations: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
      support: 'bg-teal-500/20 text-teal-400 border-teal-500/30'
    }
    return colors[department] || 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  }

  const getStatusBadge = (status: EmployeeStatus) => {
    const badges = {
      active: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20', label: 'Active' },
      on_leave: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/20', label: 'On Leave' },
      inactive: { icon: AlertCircle, color: 'text-gray-400', bg: 'bg-gray-500/20', label: 'Inactive' },
      terminated: { icon: Ban, color: 'text-red-400', bg: 'bg-red-500/20', label: 'Terminated' }
    }
    const badge = badges[status]
    const Icon = badge.icon
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ${badge.bg} ${badge.color}`}>
        <Icon className="h-3 w-3" />
        {badge.label}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-400" />
            Employee Management
          </h1>
          <p className="text-gray-400 mt-1">
            Manage your company's employees, roles, and departments
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Employees</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
            </div>
            <Users className="h-8 w-8 text-blue-400" />
          </div>
        </div>
        <div className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-2xl font-bold text-green-400 mt-1">{stats.active}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">On Leave</p>
              <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.onLeave}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-400" />
          </div>
        </div>
        <div className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Inactive</p>
              <p className="text-2xl font-bold text-gray-400 mt-1">{stats.inactive}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#151925] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-[#151925] border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
          >
            <Filter className="h-4 w-4" />
            Filters
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Department</label>
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-[#151925] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Departments</option>
                <option value="engineering">Engineering</option>
                <option value="design">Design</option>
                <option value="product">Product</option>
                <option value="qa">QA</option>
                <option value="devops">DevOps</option>
                <option value="management">Management</option>
                <option value="sales">Sales</option>
                <option value="marketing">Marketing</option>
                <option value="hr">HR</option>
                <option value="finance">Finance</option>
                <option value="operations">Operations</option>
                <option value="support">Support</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Role</label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 bg-[#151925] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="developer">Developer</option>
                <option value="senior_developer">Senior Developer</option>
                <option value="tech_lead">Tech Lead</option>
                <option value="architect">Architect</option>
                <option value="qa_engineer">QA Engineer</option>
                <option value="designer">Designer</option>
                <option value="project_manager">Project Manager</option>
                <option value="product_manager">Product Manager</option>
                <option value="account_manager">Account Manager</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 bg-[#151925] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="inactive">Inactive</option>
                <option value="terminated">Terminated</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Employees Table */}
      <div className="bg-[#1a1f2e] border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#151925] border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedEmployees.size === filteredEmployees.length && filteredEmployees.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-600 bg-gray-700"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Employee</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Role & Department</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Projects</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Skills</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="hover:bg-[#151925] transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.has(employee.id)}
                      onChange={() => handleSelectEmployee(employee.id)}
                      className="rounded border-gray-600 bg-gray-700"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                        {employee.fullName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-white">{employee.fullName}</p>
                        <p className="text-sm text-gray-400">{employee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm text-white font-medium">{employee.title}</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-md text-xs border ${getDepartmentBadgeColor(employee.department)}`}>
                          {employee.department}
                        </span>
                        <span className="text-xs text-gray-400">
                          {employee.expertiseLevel}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(employee.status)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400">
                      {employee.activeProjects.length} active
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {employee.skills.slice(0, 3).map((skill, idx) => (
                        <span key={idx} className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                      {employee.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-500/10 text-gray-400 text-xs rounded">
                          +{employee.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEditEmployee(employee)}
                        className="p-2 hover:bg-blue-500/10 text-blue-400 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {employee.status === 'active' ? (
                        <button
                          onClick={() => handleUpdateStatus(employee.id, 'inactive')}
                          className="p-2 hover:bg-yellow-500/10 text-yellow-400 rounded-lg transition-colors"
                          title="Deactivate"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdateStatus(employee.id, 'active')}
                          className="p-2 hover:bg-green-500/10 text-green-400 rounded-lg transition-colors"
                          title="Activate"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteEmployee(employee.id)}
                        className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No employees found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Modals would go here - placeholder for now */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1f2e] border border-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-xl font-bold text-white mb-4">Add New Employee</h2>
            <p className="text-gray-400 mb-4">Employee creation form would go here</p>
            <button
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
