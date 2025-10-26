/**
 * Milestones Service
 *
 * Service layer for Milestone entity CRUD operations
 * - Handles Firebase Firestore operations for project milestones
 * - Manages data validation and transformation
 * - Provides real-time subscription support
 * - Supports progress tracking and deliverables management
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
import { db, getProjectMilestonesCollection } from '@/lib/firebase'
import { milestoneConverter } from '@/lib/firebase-converters'
import { prepareForCreate, prepareForUpdate, stripUndefined } from '@/lib/firebase-converters'
import type { Milestone, FirestoreMilestone } from '@/types'

// ============================================================================
// CREATE OPERATIONS
// ============================================================================

/**
 * Create a new milestone
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param data - Milestone data (without id, timestamps)
 * @returns Created milestone with generated ID
 */
export async function createMilestone(
  tenantId: string,
  projectId: string,
  data: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Milestone> {
  try {
    // Validate required fields
    if (!data.projectId || data.projectId !== projectId) {
      throw new Error('projectId must match the provided projectId')
    }

    // Generate milestone ID
    const milestonesRef = getProjectMilestonesCollection(tenantId, projectId)
    const newMilestoneRef = doc(milestonesRef)

    // Prepare data for Firestore
    const milestoneData = prepareForCreate(data, tenantId)

    // Remove undefined values
    const cleanedData = stripUndefined(milestoneData as any)

    // Save to Firestore
    await setDoc(newMilestoneRef.withConverter(milestoneConverter), cleanedData)

    // Return the created milestone
    return {
      ...data,
      id: newMilestoneRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Milestone
  } catch (error) {
    console.error('Error creating milestone:', error)
    throw error
  }
}

// ============================================================================
// READ OPERATIONS
// ============================================================================

/**
 * Get all milestones for a project
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param options - Filter and sorting options
 * @returns Array of milestones
 */
export async function getProjectMilestones(
  tenantId: string,
  projectId: string,
  options?: {
    status?: string | string[]
    limit?: number
    orderByField?: 'dueDate' | 'createdAt' | 'progress'
    orderDirection?: 'asc' | 'desc'
  }
): Promise<Milestone[]> {
  try {
    const milestonesRef = getProjectMilestonesCollection(tenantId, projectId)
    let q = query(milestonesRef.withConverter(milestoneConverter))

    // Apply filters
    if (options?.status) {
      if (Array.isArray(options.status)) {
        q = query(q, where('status', 'in', options.status))
      } else {
        q = query(q, where('status', '==', options.status))
      }
    }

    // Add ordering
    const orderField = options?.orderByField || 'dueDate'
    const orderDir = options?.orderDirection || 'asc'
    q = query(q, orderBy(orderField, orderDir))

    // Apply limit
    if (options?.limit) {
      q = query(q, limit(options.limit))
    }

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      dueDate: new Date(doc.data().dueDate),
      createdAt: new Date(doc.data().createdAt),
      updatedAt: new Date(doc.data().updatedAt),
    } as Milestone))
  } catch (error) {
    console.error('Error getting project milestones:', error)
    throw error
  }
}

/**
 * Get a single milestone by ID
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param milestoneId - The milestone ID
 * @returns Milestone or null if not found
 */
export async function getMilestoneById(
  tenantId: string,
  projectId: string,
  milestoneId: string
): Promise<Milestone | null> {
  try {
    const milestonesRef = getProjectMilestonesCollection(tenantId, projectId)
    const snapshot = await getDocs(query(milestonesRef, where('__name__', '==', milestoneId)))

    if (snapshot.empty) {
      return null
    }

    const data = snapshot.docs[0].data() as FirestoreMilestone
    return {
      ...data,
      id: snapshot.docs[0].id,
      dueDate: new Date(data.dueDate),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    } as Milestone
  } catch (error) {
    console.error('Error getting milestone:', error)
    throw error
  }
}

/**
 * Get upcoming milestones for a project
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param limit - Maximum number of milestones to return
 * @returns Array of upcoming milestones
 */
export async function getUpcomingMilestones(
  tenantId: string,
  projectId: string,
  limitCount: number = 5
): Promise<Milestone[]> {
  try {
    const milestones = await getProjectMilestones(tenantId, projectId, {
      status: ['upcoming', 'in_progress'],
      limit: limitCount,
      orderByField: 'dueDate',
      orderDirection: 'asc'
    })
    return milestones
  } catch (error) {
    console.error('Error getting upcoming milestones:', error)
    throw error
  }
}

/**
 * Subscribe to milestones changes in real-time
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param callback - Callback function called when milestones change
 * @param options - Filter options
 * @returns Unsubscribe function
 */
export function subscribeToMilestones(
  tenantId: string,
  projectId: string,
  callback: (milestones: Milestone[]) => void,
  options?: {
    status?: string | string[]
    limit?: number
    orderByField?: 'dueDate' | 'createdAt' | 'progress'
    orderDirection?: 'asc' | 'desc'
  }
): Unsubscribe {
  try {
    const milestonesRef = getProjectMilestonesCollection(tenantId, projectId)
    let q = query(milestonesRef.withConverter(milestoneConverter))

    // Apply filters
    if (options?.status) {
      if (Array.isArray(options.status)) {
        q = query(q, where('status', 'in', options.status))
      } else {
        q = query(q, where('status', '==', options.status))
      }
    }

    // Add ordering
    const orderField = options?.orderByField || 'dueDate'
    const orderDir = options?.orderDirection || 'asc'
    q = query(q, orderBy(orderField, orderDir))

    // Apply limit
    if (options?.limit) {
      q = query(q, limit(options.limit))
    }

    return onSnapshot(q, (snapshot) => {
      const milestones = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        dueDate: new Date(doc.data().dueDate),
        createdAt: new Date(doc.data().createdAt),
        updatedAt: new Date(doc.data().updatedAt),
      } as Milestone))
      callback(milestones)
    })
  } catch (error) {
    console.error('Error subscribing to milestones:', error)
    throw error
  }
}

// ============================================================================
// UPDATE OPERATIONS
// ============================================================================

/**
 * Update a milestone
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param milestoneId - The milestone ID
 * @param data - Partial milestone data to update
 * @returns Updated milestone
 */
export async function updateMilestone(
  tenantId: string,
  projectId: string,
  milestoneId: string,
  data: Partial<Omit<Milestone, 'id' | 'createdAt' | 'projectId'>>
): Promise<Milestone> {
  try {
    const milestonesRef = getProjectMilestonesCollection(tenantId, projectId)
    const milestoneRef = doc(milestonesRef, milestoneId)

    // Prepare update data
    const updateData = prepareForUpdate(data)
    const cleanedData = stripUndefined(updateData as any)

    // Update in Firestore
    await updateDoc(milestoneRef, cleanedData)

    // Fetch and return updated milestone
    const updated = await getMilestoneById(tenantId, projectId, milestoneId)
    if (!updated) {
      throw new Error('Failed to fetch updated milestone')
    }

    return updated
  } catch (error) {
    console.error('Error updating milestone:', error)
    throw error
  }
}

/**
 * Update milestone progress
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param milestoneId - The milestone ID
 * @param progress - Progress percentage (0-100)
 */
export async function updateMilestoneProgress(
  tenantId: string,
  projectId: string,
  milestoneId: string,
  progress: number
): Promise<void> {
  try {
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100')
    }

    const milestonesRef = getProjectMilestonesCollection(tenantId, projectId)
    const milestoneRef = doc(milestonesRef, milestoneId)

    // Determine status based on progress
    let status: 'upcoming' | 'in_progress' | 'completed' | 'overdue' = 'in_progress'
    if (progress === 0) {
      status = 'upcoming'
    } else if (progress === 100) {
      status = 'completed'
    }

    const updateData = prepareForUpdate({ progress, status })
    const cleanedData = stripUndefined(updateData as any)

    await updateDoc(milestoneRef, cleanedData)
  } catch (error) {
    console.error('Error updating milestone progress:', error)
    throw error
  }
}

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

/**
 * Delete a milestone
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param milestoneId - The milestone ID
 */
export async function deleteMilestone(
  tenantId: string,
  projectId: string,
  milestoneId: string
): Promise<void> {
  try {
    const milestonesRef = getProjectMilestonesCollection(tenantId, projectId)
    const milestoneRef = doc(milestonesRef, milestoneId)
    await deleteDoc(milestoneRef)
  } catch (error) {
    console.error('Error deleting milestone:', error)
    throw error
  }
}

// ============================================================================
// SERVICE OBJECT (Class-like pattern)
// ============================================================================

export const MilestonesService = {
  create: createMilestone,
  getById: getMilestoneById,
  list: getProjectMilestones,
  getUpcoming: getUpcomingMilestones,
  subscribe: subscribeToMilestones,
  update: updateMilestone,
  updateProgress: updateMilestoneProgress,
  delete: deleteMilestone,
}

export default MilestonesService
