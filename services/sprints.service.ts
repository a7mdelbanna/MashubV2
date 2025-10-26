/**
 * Sprints Service
 *
 * Service layer for Sprint entity CRUD operations
 * - Handles Firebase Firestore operations for project sprints
 * - Manages data validation and transformation
 * - Provides real-time subscription support
 * - Supports sprint planning and velocity tracking
 */

import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Unsubscribe,
  onSnapshot
} from 'firebase/firestore'
import { db, getProjectSprintsCollection } from '@/lib/firebase'
import { sprintConverter } from '@/lib/firebase-converters'
import { prepareForCreate, prepareForUpdate, stripUndefined } from '@/lib/firebase-converters'
import type { Sprint, FirestoreSprint } from '@/types'

// ============================================================================
// CREATE OPERATIONS
// ============================================================================

/**
 * Create a new sprint
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param data - Sprint data (without id, timestamps)
 * @returns Created sprint with generated ID
 */
export async function createSprint(
  tenantId: string,
  projectId: string,
  data: Omit<Sprint, 'id' | 'createdAt' | 'updatedAt' | 'stories' | 'tasks'>
): Promise<Sprint> {
  try {
    // Validate required fields
    if (!data.projectId || data.projectId !== projectId) {
      throw new Error('projectId must match the provided projectId')
    }

    // Generate sprint ID
    const sprintsRef = getProjectSprintsCollection(tenantId, projectId)
    const newSprintRef = doc(sprintsRef)

    // Prepare data for Firestore (remove stories and tasks arrays)
    const sprintData = prepareForCreate(
      {
        ...data,
        stories: undefined,
        tasks: undefined,
      },
      tenantId
    )

    // Remove undefined values
    const cleanedData = stripUndefined(sprintData as any)

    // Save to Firestore
    await setDoc(newSprintRef.withConverter(sprintConverter), cleanedData)

    // Return the created sprint
    return {
      ...data,
      id: newSprintRef.id,
      stories: [],
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date()
    } as Sprint
  } catch (error) {
    console.error('Error creating sprint:', error)
    throw error
  }
}

// ============================================================================
// READ OPERATIONS
// ============================================================================

/**
 * Get all sprints for a project
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param options - Filter and sorting options
 * @returns Array of sprints
 */
export async function getProjectSprints(
  tenantId: string,
  projectId: string,
  options?: {
    status?: string | string[]
    limit?: number
    orderByField?: 'startDate' | 'endDate' | 'createdAt'
    orderDirection?: 'asc' | 'desc'
  }
): Promise<Sprint[]> {
  try {
    const sprintsRef = getProjectSprintsCollection(tenantId, projectId)
    let q = query(sprintsRef.withConverter(sprintConverter))

    // Apply filters
    if (options?.status) {
      if (Array.isArray(options.status)) {
        q = query(q, where('status', 'in', options.status))
      } else {
        q = query(q, where('status', '==', options.status))
      }
    }

    // Add ordering
    const orderField = options?.orderByField || 'startDate'
    const orderDir = options?.orderDirection || 'desc'
    q = query(q, orderBy(orderField, orderDir))

    // Apply limit
    if (options?.limit) {
      q = query(q, limit(options.limit))
    }

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      startDate: new Date(doc.data().startDate),
      endDate: new Date(doc.data().endDate),
      createdAt: new Date(doc.data().createdAt),
      updatedAt: new Date(doc.data().updatedAt),
      stories: [], // Query separately via TasksService if needed
      tasks: [], // Query separately via TasksService if needed
    } as Sprint))
  } catch (error) {
    console.error('Error getting project sprints:', error)
    throw error
  }
}

/**
 * Get a single sprint by ID
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param sprintId - The sprint ID
 * @returns Sprint or null if not found
 */
export async function getSprintById(
  tenantId: string,
  projectId: string,
  sprintId: string
): Promise<Sprint | null> {
  try {
    const sprintsRef = getProjectSprintsCollection(tenantId, projectId)
    const snapshot = await getDocs(query(sprintsRef, where('__name__', '==', sprintId)))

    if (snapshot.empty) {
      return null
    }

    const data = snapshot.docs[0].data() as FirestoreSprint
    return {
      ...data,
      id: snapshot.docs[0].id,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      stories: [], // Query separately if needed
      tasks: [], // Query separately if needed
    } as Sprint
  } catch (error) {
    console.error('Error getting sprint:', error)
    throw error
  }
}

/**
 * Get the active sprint for a project
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @returns Active sprint or null if none
 */
export async function getActiveSprint(
  tenantId: string,
  projectId: string
): Promise<Sprint | null> {
  try {
    const sprints = await getProjectSprints(tenantId, projectId, {
      status: 'active',
      limit: 1
    })
    return sprints.length > 0 ? sprints[0] : null
  } catch (error) {
    console.error('Error getting active sprint:', error)
    throw error
  }
}

/**
 * Subscribe to sprints changes in real-time
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param callback - Callback function called when sprints change
 * @param options - Filter options
 * @returns Unsubscribe function
 */
export function subscribeToSprints(
  tenantId: string,
  projectId: string,
  callback: (sprints: Sprint[]) => void,
  options?: {
    status?: string | string[]
    limit?: number
    orderByField?: 'startDate' | 'endDate' | 'createdAt'
    orderDirection?: 'asc' | 'desc'
  }
): Unsubscribe {
  try {
    const sprintsRef = getProjectSprintsCollection(tenantId, projectId)
    let q = query(sprintsRef.withConverter(sprintConverter))

    // Apply filters
    if (options?.status) {
      if (Array.isArray(options.status)) {
        q = query(q, where('status', 'in', options.status))
      } else {
        q = query(q, where('status', '==', options.status))
      }
    }

    // Add ordering
    const orderField = options?.orderByField || 'startDate'
    const orderDir = options?.orderDirection || 'desc'
    q = query(q, orderBy(orderField, orderDir))

    // Apply limit
    if (options?.limit) {
      q = query(q, limit(options.limit))
    }

    return onSnapshot(q, (snapshot) => {
      const sprints = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        startDate: new Date(doc.data().startDate),
        endDate: new Date(doc.data().endDate),
        createdAt: new Date(doc.data().createdAt),
        updatedAt: new Date(doc.data().updatedAt),
        stories: [],
        tasks: [],
      } as Sprint))
      callback(sprints)
    })
  } catch (error) {
    console.error('Error subscribing to sprints:', error)
    throw error
  }
}

// ============================================================================
// UPDATE OPERATIONS
// ============================================================================

/**
 * Update a sprint
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param sprintId - The sprint ID
 * @param data - Partial sprint data to update
 * @returns Updated sprint
 */
export async function updateSprint(
  tenantId: string,
  projectId: string,
  sprintId: string,
  data: Partial<Omit<Sprint, 'id' | 'createdAt' | 'projectId' | 'stories' | 'tasks'>>
): Promise<Sprint> {
  try {
    const sprintsRef = getProjectSprintsCollection(tenantId, projectId)
    const sprintRef = doc(sprintsRef, sprintId)

    // Prepare update data (remove stories and tasks)
    const updateData = prepareForUpdate({
      ...data,
      stories: undefined,
      tasks: undefined,
    })
    const cleanedData = stripUndefined(updateData as any)

    // Update in Firestore
    await updateDoc(sprintRef, cleanedData)

    // Fetch and return updated sprint
    const updated = await getSprintById(tenantId, projectId, sprintId)
    if (!updated) {
      throw new Error('Failed to fetch updated sprint')
    }

    return updated
  } catch (error) {
    console.error('Error updating sprint:', error)
    throw error
  }
}

/**
 * Update sprint velocity and burndown metrics
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param sprintId - The sprint ID
 * @param metrics - Velocity and burndown data
 */
export async function updateSprintMetrics(
  tenantId: string,
  projectId: string,
  sprintId: string,
  metrics: {
    velocity?: number
    burndown?: number[]
    committed?: number
    completed?: number
  }
): Promise<void> {
  try {
    const sprintsRef = getProjectSprintsCollection(tenantId, projectId)
    const sprintRef = doc(sprintsRef, sprintId)

    const updateData = prepareForUpdate(metrics)
    const cleanedData = stripUndefined(updateData as any)

    await updateDoc(sprintRef, cleanedData)
  } catch (error) {
    console.error('Error updating sprint metrics:', error)
    throw error
  }
}

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

/**
 * Delete a sprint
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param sprintId - The sprint ID
 */
export async function deleteSprint(
  tenantId: string,
  projectId: string,
  sprintId: string
): Promise<void> {
  try {
    const sprintsRef = getProjectSprintsCollection(tenantId, projectId)
    const sprintRef = doc(sprintsRef, sprintId)
    await deleteDoc(sprintRef)
  } catch (error) {
    console.error('Error deleting sprint:', error)
    throw error
  }
}

// ============================================================================
// SERVICE OBJECT (Class-like pattern)
// ============================================================================

export const SprintsService = {
  create: createSprint,
  getById: getSprintById,
  list: getProjectSprints,
  getActive: getActiveSprint,
  subscribe: subscribeToSprints,
  update: updateSprint,
  updateMetrics: updateSprintMetrics,
  delete: deleteSprint,
}

export default SprintsService
