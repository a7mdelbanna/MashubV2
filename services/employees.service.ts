/**
 * Employees Service
 *
 * Manages Employee entities in Firebase with multi-tenant support.
 *
 * Collection Path: tenants/{tenantId}/employees/{employeeId}
 *
 * Features:
 * - Multi-tenant data isolation
 * - Real-time subscriptions
 * - Skills-based filtering
 * - Department and role queries
 * - Active project tracking
 * - Validation
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  DocumentReference,
  CollectionReference,
  Query,
  QueryConstraint
} from 'firebase/firestore'
import { db } from '@/lib/firebase-config'
import { converters } from '@/lib/firebase-converters'
import type { Employee, EmployeeRole, EmployeeDepartment, EmployeeStatus } from '@/types'

/**
 * Get employees collection reference
 */
function getEmployeesCollection(tenantId: string): CollectionReference {
  return collection(
    db,
    'tenants',
    tenantId,
    'employees'
  ).withConverter(converters.employee)
}

/**
 * Get employee document reference
 */
function getEmployeeDoc(tenantId: string, employeeId: string): DocumentReference {
  return doc(
    db,
    'tenants',
    tenantId,
    'employees',
    employeeId
  ).withConverter(converters.employee)
}

/**
 * Validate employee data
 */
function validateEmployeeData(data: Partial<Employee>): void {
  if (data.firstName !== undefined && !data.firstName.trim()) {
    throw new Error('First name is required')
  }

  if (data.lastName !== undefined && !data.lastName.trim()) {
    throw new Error('Last name is required')
  }

  if (data.email !== undefined && !data.email.trim()) {
    throw new Error('Email is required')
  }

  if (data.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    throw new Error('Invalid email format')
  }

  if (data.weeklyHours !== undefined && (data.weeklyHours < 0 || data.weeklyHours > 168)) {
    throw new Error('Weekly hours must be between 0 and 168')
  }

  if (data.hourlyRate !== undefined && data.hourlyRate < 0) {
    throw new Error('Hourly rate must be positive')
  }

  if (data.performanceRating !== undefined && (data.performanceRating < 1 || data.performanceRating > 5)) {
    throw new Error('Performance rating must be between 1 and 5')
  }
}

/**
 * Employee Service Interface
 */
export interface EmployeeQueryOptions {
  role?: EmployeeRole
  department?: EmployeeDepartment
  status?: EmployeeStatus
  managerId?: string
  skill?: string
  expertiseLevel?: Employee['expertiseLevel']
  orderByField?: keyof Employee
  orderDirection?: 'asc' | 'desc'
  limitCount?: number
}

export interface CreateEmployeeData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  avatar?: string

  employeeId?: string
  role: EmployeeRole
  customRole?: string
  department: EmployeeDepartment
  title: string

  status?: EmployeeStatus
  employmentType: Employee['employmentType']

  hireDate: Date
  dateOfBirth?: Date

  weeklyHours: number
  hourlyRate?: number
  sprintCapacity?: number

  skills?: string[]
  expertiseLevel: Employee['expertiseLevel']
  certifications?: string[]

  managerId?: string
  managerName?: string

  address?: Employee['address']
  emergencyContact?: Employee['emergencyContact']

  notes?: string
  userId?: string
}

export interface UpdateEmployeeData {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  avatar?: string

  employeeId?: string
  role?: EmployeeRole
  customRole?: string
  department?: EmployeeDepartment
  title?: string

  status?: EmployeeStatus
  employmentType?: Employee['employmentType']

  hireDate?: Date
  terminationDate?: Date
  dateOfBirth?: Date

  weeklyHours?: number
  hourlyRate?: number
  sprintCapacity?: number

  skills?: string[]
  expertiseLevel?: Employee['expertiseLevel']
  certifications?: string[]

  managerId?: string
  managerName?: string

  address?: Employee['address']
  emergencyContact?: Employee['emergencyContact']

  performanceRating?: number
  notes?: string
}

/**
 * Employees Service
 */
export const EmployeesService = {
  /**
   * Create a new employee
   */
  async create(
    tenantId: string,
    data: CreateEmployeeData,
    createdBy?: string
  ): Promise<Employee> {
    validateEmployeeData(data)

    const employeesRef = getEmployeesCollection(tenantId)

    const now = new Date()
    const fullName = `${data.firstName} ${data.lastName}`

    const employeeData: Omit<Employee, 'id'> = {
      tenantId,
      userId: data.userId,

      firstName: data.firstName,
      lastName: data.lastName,
      fullName,
      email: data.email,
      phone: data.phone,
      avatar: data.avatar,

      employeeId: data.employeeId,
      role: data.role,
      customRole: data.customRole,
      department: data.department,
      title: data.title,

      status: data.status || 'active',
      employmentType: data.employmentType,

      hireDate: data.hireDate,
      dateOfBirth: data.dateOfBirth,

      weeklyHours: data.weeklyHours,
      hourlyRate: data.hourlyRate,
      sprintCapacity: data.sprintCapacity,

      skills: data.skills || [],
      expertiseLevel: data.expertiseLevel,
      certifications: data.certifications,

      managerId: data.managerId,
      managerName: data.managerName,

      activeProjects: [],

      address: data.address,
      emergencyContact: data.emergencyContact,

      notes: data.notes,

      createdAt: now,
      updatedAt: now,
      createdBy,
      lastModifiedBy: createdBy
    }

    const docRef = await addDoc(employeesRef, employeeData as any)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      throw new Error('Failed to create employee')
    }

    return docSnap.data() as Employee
  },

  /**
   * Get employee by ID
   */
  async get(
    tenantId: string,
    employeeId: string
  ): Promise<Employee | null> {
    const employeeRef = getEmployeeDoc(tenantId, employeeId)
    const docSnap = await getDoc(employeeRef)

    if (!docSnap.exists()) {
      return null
    }

    return docSnap.data() as Employee
  },

  /**
   * List employees with optional filters
   */
  async list(
    tenantId: string,
    options?: EmployeeQueryOptions
  ): Promise<Employee[]> {
    const employeesRef = getEmployeesCollection(tenantId)
    const constraints: QueryConstraint[] = []

    // Add filters
    if (options?.role) {
      constraints.push(where('role', '==', options.role))
    }

    if (options?.department) {
      constraints.push(where('department', '==', options.department))
    }

    if (options?.status) {
      constraints.push(where('status', '==', options.status))
    }

    if (options?.managerId) {
      constraints.push(where('managerId', '==', options.managerId))
    }

    if (options?.skill) {
      constraints.push(where('skills', 'array-contains', options.skill))
    }

    if (options?.expertiseLevel) {
      constraints.push(where('expertiseLevel', '==', options.expertiseLevel))
    }

    // Add ordering
    if (options?.orderByField) {
      constraints.push(
        orderBy(options.orderByField, options.orderDirection || 'asc')
      )
    }

    // Add limit
    if (options?.limitCount) {
      constraints.push(limit(options.limitCount))
    }

    const q = constraints.length > 0 ? query(employeesRef, ...constraints) : employeesRef
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => doc.data() as Employee)
  },

  /**
   * Update an employee
   */
  async update(
    tenantId: string,
    employeeId: string,
    data: UpdateEmployeeData,
    modifiedBy?: string
  ): Promise<void> {
    validateEmployeeData(data)

    const employeeRef = getEmployeeDoc(tenantId, employeeId)
    const updateData: any = {
      ...data,
      updatedAt: new Date(),
      lastModifiedBy: modifiedBy
    }

    // Update fullName if first or last name changed
    if (data.firstName || data.lastName) {
      const currentDoc = await getDoc(employeeRef)
      if (currentDoc.exists()) {
        const current = currentDoc.data() as Employee
        const firstName = data.firstName || current.firstName
        const lastName = data.lastName || current.lastName
        updateData.fullName = `${firstName} ${lastName}`
      }
    }

    await updateDoc(employeeRef, updateData)
  },

  /**
   * Update employee status
   */
  async updateStatus(
    tenantId: string,
    employeeId: string,
    status: EmployeeStatus,
    terminationDate?: Date
  ): Promise<void> {
    const employeeRef = getEmployeeDoc(tenantId, employeeId)

    const updateData: any = {
      status,
      updatedAt: new Date()
    }

    if (status === 'terminated' && terminationDate) {
      updateData.terminationDate = terminationDate
    }

    await updateDoc(employeeRef, updateData)
  },

  /**
   * Add skill to employee
   */
  async addSkill(
    tenantId: string,
    employeeId: string,
    skill: string
  ): Promise<void> {
    const employeeRef = getEmployeeDoc(tenantId, employeeId)
    const docSnap = await getDoc(employeeRef)

    if (!docSnap.exists()) {
      throw new Error('Employee not found')
    }

    const employee = docSnap.data() as Employee
    const skills = employee.skills || []

    if (!skills.includes(skill)) {
      skills.push(skill)
      await updateDoc(employeeRef, {
        skills,
        updatedAt: new Date()
      })
    }
  },

  /**
   * Remove skill from employee
   */
  async removeSkill(
    tenantId: string,
    employeeId: string,
    skill: string
  ): Promise<void> {
    const employeeRef = getEmployeeDoc(tenantId, employeeId)
    const docSnap = await getDoc(employeeRef)

    if (!docSnap.exists()) {
      throw new Error('Employee not found')
    }

    const employee = docSnap.data() as Employee
    const skills = (employee.skills || []).filter(s => s !== skill)

    await updateDoc(employeeRef, {
      skills,
      updatedAt: new Date()
    })
  },

  /**
   * Update employee project assignments (denormalized array)
   */
  async updateActiveProjects(
    tenantId: string,
    employeeId: string,
    projects: Employee['activeProjects']
  ): Promise<void> {
    const employeeRef = getEmployeeDoc(tenantId, employeeId)

    await updateDoc(employeeRef, {
      activeProjects: projects,
      updatedAt: new Date()
    })
  },

  /**
   * Delete an employee
   */
  async delete(
    tenantId: string,
    employeeId: string
  ): Promise<void> {
    const employeeRef = getEmployeeDoc(tenantId, employeeId)
    await deleteDoc(employeeRef)
  },

  /**
   * Subscribe to employees with real-time updates
   */
  subscribe(
    tenantId: string,
    callback: (employees: Employee[]) => void,
    options?: EmployeeQueryOptions
  ): () => void {
    const employeesRef = getEmployeesCollection(tenantId)
    const constraints: QueryConstraint[] = []

    // Add filters
    if (options?.role) {
      constraints.push(where('role', '==', options.role))
    }

    if (options?.department) {
      constraints.push(where('department', '==', options.department))
    }

    if (options?.status) {
      constraints.push(where('status', '==', options.status))
    }

    if (options?.managerId) {
      constraints.push(where('managerId', '==', options.managerId))
    }

    if (options?.skill) {
      constraints.push(where('skills', 'array-contains', options.skill))
    }

    if (options?.expertiseLevel) {
      constraints.push(where('expertiseLevel', '==', options.expertiseLevel))
    }

    // Add ordering
    if (options?.orderByField) {
      constraints.push(
        orderBy(options.orderByField, options.orderDirection || 'asc')
      )
    }

    // Add limit
    if (options?.limitCount) {
      constraints.push(limit(options.limitCount))
    }

    const q = constraints.length > 0 ? query(employeesRef, ...constraints) : employeesRef

    return onSnapshot(q, snapshot => {
      const employees = snapshot.docs.map(doc => doc.data() as Employee)
      callback(employees)
    })
  },

  /**
   * Get active employees
   */
  async getActive(
    tenantId: string,
    limitCount: number = 50
  ): Promise<Employee[]> {
    return this.list(tenantId, {
      status: 'active',
      orderByField: 'fullName',
      orderDirection: 'asc',
      limitCount
    })
  },

  /**
   * Get employees by department
   */
  async getByDepartment(
    tenantId: string,
    department: EmployeeDepartment
  ): Promise<Employee[]> {
    return this.list(tenantId, {
      department,
      status: 'active',
      orderByField: 'fullName',
      orderDirection: 'asc'
    })
  },

  /**
   * Get employees by role
   */
  async getByRole(
    tenantId: string,
    role: EmployeeRole
  ): Promise<Employee[]> {
    return this.list(tenantId, {
      role,
      status: 'active',
      orderByField: 'hireDate',
      orderDirection: 'desc'
    })
  },

  /**
   * Get employees by skill
   */
  async getBySkill(
    tenantId: string,
    skill: string
  ): Promise<Employee[]> {
    return this.list(tenantId, {
      skill,
      status: 'active',
      orderByField: 'expertiseLevel',
      orderDirection: 'desc'
    })
  },

  /**
   * Get employees managed by a manager
   */
  async getManagedBy(
    tenantId: string,
    managerId: string
  ): Promise<Employee[]> {
    return this.list(tenantId, {
      managerId,
      status: 'active',
      orderByField: 'fullName',
      orderDirection: 'asc'
    })
  },

  /**
   * Search employees by name or email
   */
  async search(
    tenantId: string,
    searchTerm: string
  ): Promise<Employee[]> {
    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation - for production, consider using Algolia or similar
    const allEmployees = await this.list(tenantId, {
      status: 'active'
    })

    const lowerSearch = searchTerm.toLowerCase()
    return allEmployees.filter(emp =>
      emp.fullName.toLowerCase().includes(lowerSearch) ||
      emp.email.toLowerCase().includes(lowerSearch)
    )
  }
}
