/**
 * Projects Service
 *
 * Service layer for Project entity CRUD operations
 * - Handles Firebase Firestore operations
 * - Manages data validation and transformation
 * - Provides real-time subscription support
 * - Populates relationships (apps, pricingCatalog, etc.)
 */

import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  writeBatch,
  Unsubscribe
} from 'firebase/firestore'
import { db, getProjectsCollection } from '@/lib/firebase'
import {
  getProject,
  getProjects,
  subscribeToProject,
  subscribeToProjects,
  searchProjects,
  getProjectStats
} from '@/lib/firebase-queries'
import { projectConverter } from '@/lib/firebase-converters'
import { prepareForCreate, prepareForUpdate, stripUndefined } from '@/lib/firebase-converters'
import type { Project, ProjectStatus, ProjectPriority, ProjectType } from '@/types'

// ============================================================================
// CREATE OPERATIONS
// ============================================================================

/**
 * Create a new project
 *
 * @param tenantId - The tenant ID
 * @param data - Project data (without id, timestamps)
 * @returns Created project with generated ID
 */
export async function createProject(
  tenantId: string,
  data: Omit<Project, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'apps' | 'pricingCatalog' | 'checklistTemplates' | 'checklistInstances' | 'team'>
): Promise<Project> {
  try {
    // Generate project ID
    const projectsRef = getProjectsCollection(tenantId)
    const newProjectRef = doc(projectsRef)

    // Prepare data for Firestore
    const projectData = prepareForCreate(
      {
        ...data,
        // Remove populated arrays - these will be queried
        apps: undefined,
        pricingCatalog: undefined,
        checklistTemplates: undefined,
        checklistInstances: undefined,
        team: undefined,
      },
      tenantId
    )

    // Remove undefined values
    const cleanedData = stripUndefined(projectData as any)

    // Save to Firestore
    await setDoc(newProjectRef.withConverter(projectConverter), cleanedData)

    // Fetch and return the created project with populated relationships
    const createdProject = await getProject(tenantId, newProjectRef.id)

    if (!createdProject) {
      throw new Error('Failed to fetch created project')
    }

    return createdProject
  } catch (error) {
    console.error('Error creating project:', error)
    throw error
  }
}

/**
 * Create multiple projects in a batch
 *
 * @param tenantId - The tenant ID
 * @param projects - Array of project data
 * @returns Array of created project IDs
 */
export async function createProjectsBatch(
  tenantId: string,
  projects: Array<Omit<Project, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'apps' | 'pricingCatalog' | 'checklistTemplates' | 'checklistInstances' | 'team'>>
): Promise<string[]> {
  try {
    const batch = writeBatch(db)
    const projectsRef = getProjectsCollection(tenantId)
    const projectIds: string[] = []

    projects.forEach(projectData => {
      const newProjectRef = doc(projectsRef)
      const preparedData = prepareForCreate(
        {
          ...projectData,
          apps: undefined,
          pricingCatalog: undefined,
          checklistTemplates: undefined,
          checklistInstances: undefined,
          team: undefined,
        },
        tenantId
      )
      const cleanedData = stripUndefined(preparedData as any)

      batch.set(newProjectRef.withConverter(projectConverter), cleanedData)
      projectIds.push(newProjectRef.id)
    })

    await batch.commit()
    return projectIds
  } catch (error) {
    console.error('Error creating projects batch:', error)
    throw error
  }
}

// ============================================================================
// READ OPERATIONS
// ============================================================================

/**
 * Get a single project by ID with all relationships populated
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @returns Project with apps, pricingCatalog, etc. populated, or null if not found
 */
export async function getProjectById(
  tenantId: string,
  projectId: string
): Promise<Project | null> {
  return getProject(tenantId, projectId)
}

/**
 * List projects with optional filters
 *
 * @param tenantId - The tenant ID
 * @param options - Filter and pagination options
 * @returns Array of projects
 */
export async function listProjects(
  tenantId: string,
  options?: {
    status?: ProjectStatus | ProjectStatus[]
    priority?: ProjectPriority
    type?: ProjectType
    limit?: number
    orderByField?: 'createdAt' | 'updatedAt' | 'dueDate' | 'name'
    orderDirection?: 'asc' | 'desc'
  }
): Promise<Project[]> {
  return getProjects(tenantId, options)
}

/**
 * Search projects by name, description, or tags
 *
 * @param tenantId - The tenant ID
 * @param searchTerm - Search term
 * @returns Array of matching projects
 */
export async function searchProjectsByTerm(
  tenantId: string,
  searchTerm: string
): Promise<Project[]> {
  return searchProjects(tenantId, searchTerm)
}

/**
 * Get project statistics for a tenant
 *
 * @param tenantId - The tenant ID
 * @returns Project stats (counts by status, priority, budget totals, etc.)
 */
export async function getProjectStatistics(tenantId: string) {
  return getProjectStats(tenantId)
}

/**
 * Subscribe to project changes in real-time
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param callback - Callback function called when project changes
 * @returns Unsubscribe function
 */
export function subscribeToProjectChanges(
  tenantId: string,
  projectId: string,
  callback: (project: Project | null) => void
): Unsubscribe {
  return subscribeToProject(tenantId, projectId, callback)
}

/**
 * Subscribe to all projects for a tenant in real-time
 *
 * @param tenantId - The tenant ID
 * @param callback - Callback function called when projects change
 * @param options - Optional filters and sorting
 * @returns Unsubscribe function
 */
export function subscribeToAllProjects(
  tenantId: string,
  callback: (projects: Project[]) => void,
  options?: {
    status?: ProjectStatus | ProjectStatus[]
    priority?: ProjectPriority
    type?: ProjectType
    limit?: number
    orderByField?: 'createdAt' | 'updatedAt' | 'dueDate' | 'name'
    orderDirection?: 'asc' | 'desc'
  }
): Unsubscribe {
  return subscribeToProjects(tenantId, callback, options)
}

// ============================================================================
// UPDATE OPERATIONS
// ============================================================================

/**
 * Update a project
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param data - Partial project data to update
 * @returns Updated project
 */
export async function updateProject(
  tenantId: string,
  projectId: string,
  data: Partial<Omit<Project, 'id' | 'tenantId' | 'createdAt' | 'apps' | 'pricingCatalog' | 'checklistTemplates' | 'checklistInstances' | 'team'>>
): Promise<Project> {
  try {
    const projectRef = doc(db, `tenants/${tenantId}/projects/${projectId}`)

    // Prepare data with updated timestamp
    const updateData = prepareForUpdate({
      ...data,
      // Remove populated arrays - these are queried, not stored
      apps: undefined,
      pricingCatalog: undefined,
      checklistTemplates: undefined,
      checklistInstances: undefined,
      team: undefined,
    })

    // Remove undefined values
    const cleanedData = stripUndefined(updateData as any)

    // Update in Firestore
    await updateDoc(projectRef, cleanedData)

    // Fetch and return updated project
    const updatedProject = await getProject(tenantId, projectId)

    if (!updatedProject) {
      throw new Error('Failed to fetch updated project')
    }

    return updatedProject
  } catch (error) {
    console.error('Error updating project:', error)
    throw error
  }
}

/**
 * Update project status
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param status - New status
 * @returns Updated project
 */
export async function updateProjectStatus(
  tenantId: string,
  projectId: string,
  status: ProjectStatus
): Promise<Project> {
  const updateData: any = { status }

  // Set completedAt timestamp if status is completed
  if (status === 'completed') {
    updateData.completedAt = new Date().toISOString()
  }

  // Set archivedAt timestamp if status is archived
  if (status === 'archived') {
    updateData.archivedAt = new Date().toISOString()
  }

  return updateProject(tenantId, projectId, updateData)
}

/**
 * Update project progress
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param progress - Progress data
 * @returns Updated project
 */
export async function updateProjectProgress(
  tenantId: string,
  projectId: string,
  progress: {
    progress?: number
    completionPercentage?: number
    tasksTotal?: number
    tasksCompleted?: number
    milestonesTotal?: number
    milestonesCompleted?: number
  }
): Promise<Project> {
  return updateProject(tenantId, projectId, progress)
}

/**
 * Update project budget
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param budget - Budget data
 * @returns Updated project
 */
export async function updateProjectBudget(
  tenantId: string,
  projectId: string,
  budget: {
    budget?: number
    spent?: number
    budgetAllocated?: number
    budgetSpent?: number
  }
): Promise<Project> {
  return updateProject(tenantId, projectId, budget)
}

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

/**
 * Delete a project (soft delete - mark as archived)
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @returns void
 */
export async function archiveProject(
  tenantId: string,
  projectId: string
): Promise<void> {
  await updateProjectStatus(tenantId, projectId, 'archived')
}

/**
 * Permanently delete a project
 * WARNING: This will not delete subcollections (tasks, sprints, etc.)
 * Use with caution or implement cascade delete
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @returns void
 */
export async function deleteProjectPermanently(
  tenantId: string,
  projectId: string
): Promise<void> {
  try {
    const projectRef = doc(db, `tenants/${tenantId}/projects/${projectId}`)
    await deleteDoc(projectRef)
  } catch (error) {
    console.error('Error deleting project:', error)
    throw error
  }
}

/**
 * Delete a project with all its subcollections
 * This should be implemented as a Cloud Function for better performance
 * For now, this is a placeholder
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @returns void
 */
export async function deleteProjectCascade(
  tenantId: string,
  projectId: string
): Promise<void> {
  // TODO: Implement via Cloud Function
  // Should delete:
  // - Project document
  // - All tasks subcollection
  // - All sprints subcollection
  // - All milestones subcollection
  // - All team members subcollection
  // - All timeline events subcollection
  // - All checklist instances subcollection
  // - All related apps (if desired)
  // - All related pricing catalog items (if desired)

  throw new Error('Cascade delete not implemented. Use Cloud Function or manual cleanup.')
}

// ============================================================================
// EXPORT SERVICE OBJECT
// ============================================================================

export const ProjectsService = {
  // Create
  create: createProject,
  createBatch: createProjectsBatch,

  // Read
  getById: getProjectById,
  list: listProjects,
  search: searchProjectsByTerm,
  getStats: getProjectStatistics,
  subscribe: subscribeToProjectChanges,
  subscribeAll: subscribeToAllProjects,

  // Update
  update: updateProject,
  updateStatus: updateProjectStatus,
  updateProgress: updateProjectProgress,
  updateBudget: updateProjectBudget,

  // Delete
  archive: archiveProject,
  deletePermanently: deleteProjectPermanently,
  deleteCascade: deleteProjectCascade,
}

export default ProjectsService
