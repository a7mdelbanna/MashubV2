/**
 * Epics Service
 *
 * Manages Epic entities in Firebase with multi-tenant support.
 *
 * Collection Path: tenants/{tenantId}/projects/{projectId}/epics/{epicId}
 *
 * Features:
 * - Multi-tenant data isolation
 * - Real-time subscriptions
 * - Query-based relationships (stories and tasks queried separately)
 * - Progress calculation
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
import type { Epic } from '@/types'

/**
 * Get epics collection reference for a project
 */
function getProjectEpicsCollection(
  tenantId: string,
  projectId: string
): CollectionReference {
  return collection(
    db,
    'tenants',
    tenantId,
    'projects',
    projectId,
    'epics'
  ).withConverter(converters.epic)
}

/**
 * Get epic document reference
 */
function getEpicDoc(
  tenantId: string,
  projectId: string,
  epicId: string
): DocumentReference {
  return doc(
    db,
    'tenants',
    tenantId,
    'projects',
    projectId,
    'epics',
    epicId
  ).withConverter(converters.epic)
}

/**
 * Validate epic data
 */
function validateEpicData(data: Partial<Epic>): void {
  if (data.name !== undefined && !data.name.trim()) {
    throw new Error('Epic name is required')
  }

  if (data.status && !['planned', 'in_progress', 'completed', 'on_hold'].includes(data.status)) {
    throw new Error('Invalid epic status')
  }

  if (data.priority && !['low', 'medium', 'high', 'critical'].includes(data.priority)) {
    throw new Error('Invalid epic priority')
  }

  if (data.progress !== undefined && (data.progress < 0 || data.progress > 100)) {
    throw new Error('Progress must be between 0 and 100')
  }
}

/**
 * Epic Service Interface
 */
export interface EpicQueryOptions {
  status?: Epic['status']
  priority?: Epic['priority']
  ownerId?: string
  orderByField?: keyof Epic
  orderDirection?: 'asc' | 'desc'
  limitCount?: number
}

export interface CreateEpicData {
  name: string
  description?: string
  goal?: string
  status?: Epic['status']
  priority?: Epic['priority']
  startDate?: Date
  targetDate?: Date
  owner?: {
    id: string
    name: string
    avatar?: string
  }
  tags?: string[]
  businessValue?: number
  acceptanceCriteria?: string[]
}

export interface UpdateEpicData {
  name?: string
  description?: string
  goal?: string
  status?: Epic['status']
  priority?: Epic['priority']
  startDate?: Date
  targetDate?: Date
  owner?: {
    id: string
    name: string
    avatar?: string
  }
  tags?: string[]
  businessValue?: number
  acceptanceCriteria?: string[]
  progress?: number
}

/**
 * Epics Service
 */
export const EpicsService = {
  /**
   * Create a new epic
   */
  async create(
    tenantId: string,
    projectId: string,
    data: CreateEpicData
  ): Promise<Epic> {
    validateEpicData(data)

    const epicsRef = getProjectEpicsCollection(tenantId, projectId)

    const now = new Date()
    const epicData: Omit<Epic, 'id'> = {
      projectId,
      name: data.name,
      description: data.description,
      goal: data.goal,
      status: data.status || 'planned',
      priority: data.priority || 'medium',
      startDate: data.startDate,
      targetDate: data.targetDate,
      owner: data.owner,
      tags: data.tags || [],
      businessValue: data.businessValue,
      acceptanceCriteria: data.acceptanceCriteria || [],
      progress: 0,
      storiesCount: 0,
      tasksCount: 0,
      completedTasksCount: 0,
      createdAt: now,
      updatedAt: now
    }

    const docRef = await addDoc(epicsRef, epicData as any)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      throw new Error('Failed to create epic')
    }

    return docSnap.data() as Epic
  },

  /**
   * Get epic by ID
   */
  async get(
    tenantId: string,
    projectId: string,
    epicId: string
  ): Promise<Epic | null> {
    const epicRef = getEpicDoc(tenantId, projectId, epicId)
    const docSnap = await getDoc(epicRef)

    if (!docSnap.exists()) {
      return null
    }

    return docSnap.data() as Epic
  },

  /**
   * List epics with optional filters
   */
  async list(
    tenantId: string,
    projectId: string,
    options?: EpicQueryOptions
  ): Promise<Epic[]> {
    const epicsRef = getProjectEpicsCollection(tenantId, projectId)
    const constraints: QueryConstraint[] = []

    // Add filters
    if (options?.status) {
      constraints.push(where('status', '==', options.status))
    }

    if (options?.priority) {
      constraints.push(where('priority', '==', options.priority))
    }

    if (options?.ownerId) {
      constraints.push(where('owner.id', '==', options.ownerId))
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

    const q = constraints.length > 0 ? query(epicsRef, ...constraints) : epicsRef
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => doc.data() as Epic)
  },

  /**
   * Update an epic
   */
  async update(
    tenantId: string,
    projectId: string,
    epicId: string,
    data: UpdateEpicData
  ): Promise<void> {
    validateEpicData(data)

    const epicRef = getEpicDoc(tenantId, projectId, epicId)
    const updateData: any = {
      ...data,
      updatedAt: new Date()
    }

    await updateDoc(epicRef, updateData)
  },

  /**
   * Update epic progress
   */
  async updateProgress(
    tenantId: string,
    projectId: string,
    epicId: string,
    progress: number
  ): Promise<void> {
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100')
    }

    const epicRef = getEpicDoc(tenantId, projectId, epicId)

    // Auto-update status based on progress
    let status: Epic['status'] = 'in_progress'
    if (progress === 0) {
      status = 'planned'
    } else if (progress === 100) {
      status = 'completed'
    }

    await updateDoc(epicRef, {
      progress,
      status,
      updatedAt: new Date()
    })
  },

  /**
   * Update epic counts (stories, tasks)
   */
  async updateCounts(
    tenantId: string,
    projectId: string,
    epicId: string,
    counts: {
      storiesCount?: number
      tasksCount?: number
      completedTasksCount?: number
    }
  ): Promise<void> {
    const epicRef = getEpicDoc(tenantId, projectId, epicId)

    await updateDoc(epicRef, {
      ...counts,
      updatedAt: new Date()
    })
  },

  /**
   * Delete an epic
   */
  async delete(
    tenantId: string,
    projectId: string,
    epicId: string
  ): Promise<void> {
    const epicRef = getEpicDoc(tenantId, projectId, epicId)
    await deleteDoc(epicRef)
  },

  /**
   * Subscribe to epics with real-time updates
   */
  subscribe(
    tenantId: string,
    projectId: string,
    callback: (epics: Epic[]) => void,
    options?: EpicQueryOptions
  ): () => void {
    const epicsRef = getProjectEpicsCollection(tenantId, projectId)
    const constraints: QueryConstraint[] = []

    // Add filters
    if (options?.status) {
      constraints.push(where('status', '==', options.status))
    }

    if (options?.priority) {
      constraints.push(where('priority', '==', options.priority))
    }

    if (options?.ownerId) {
      constraints.push(where('owner.id', '==', options.ownerId))
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

    const q = constraints.length > 0 ? query(epicsRef, ...constraints) : epicsRef

    return onSnapshot(q, snapshot => {
      const epics = snapshot.docs.map(doc => doc.data() as Epic)
      callback(epics)
    })
  },

  /**
   * Get active epics (in_progress status)
   */
  async getActive(
    tenantId: string,
    projectId: string
  ): Promise<Epic[]> {
    return this.list(tenantId, projectId, {
      status: 'in_progress',
      orderByField: 'priority',
      orderDirection: 'desc'
    })
  },

  /**
   * Get upcoming epics (planned status)
   */
  async getUpcoming(
    tenantId: string,
    projectId: string,
    limitCount: number = 5
  ): Promise<Epic[]> {
    return this.list(tenantId, projectId, {
      status: 'planned',
      orderByField: 'priority',
      orderDirection: 'desc',
      limitCount
    })
  },

  /**
   * Get completed epics
   */
  async getCompleted(
    tenantId: string,
    projectId: string,
    limitCount: number = 10
  ): Promise<Epic[]> {
    return this.list(tenantId, projectId, {
      status: 'completed',
      orderByField: 'updatedAt',
      orderDirection: 'desc',
      limitCount
    })
  }
}
