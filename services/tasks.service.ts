/**
 * Tasks Service
 *
 * Service layer for Task entity CRUD operations
 * - Handles Firebase Firestore operations for project tasks
 * - Manages data validation and transformation
 * - Provides real-time subscription support
 * - Supports both project-level and app-scoped tasks
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
  onSnapshot,
  WhereFilterOp
} from 'firebase/firestore'
import { db, getProjectTasksCollection } from '@/lib/firebase'
import { taskConverter } from '@/lib/firebase-converters'
import { prepareForCreate, prepareForUpdate, stripUndefined } from '@/lib/firebase-converters'
import type { Task, FirestoreTask } from '@/types'

// ============================================================================
// CREATE OPERATIONS
// ============================================================================

/**
 * Create a new task
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param data - Task data (without id, timestamps)
 * @returns Created task with generated ID
 */
export async function createTask(
  tenantId: string,
  projectId: string,
  data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Task> {
  try {
    // Validate required fields
    if (!data.projectId || data.projectId !== projectId) {
      throw new Error('projectId must match the provided projectId')
    }

    if (data.scope === 'app' && !data.appId) {
      throw new Error('appId is required when scope is "app"')
    }

    // Generate task ID
    const tasksRef = getProjectTasksCollection(tenantId, projectId)
    const newTaskRef = doc(tasksRef)

    // Prepare data for Firestore
    const taskData = prepareForCreate(data, tenantId)

    // Remove undefined values
    const cleanedData = stripUndefined(taskData as any)

    // Save to Firestore
    await setDoc(newTaskRef.withConverter(taskConverter), cleanedData)

    // Return the created task
    return {
      ...data,
      id: newTaskRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    } as Task
  } catch (error) {
    console.error('Error creating task:', error)
    throw error
  }
}

// ============================================================================
// READ OPERATIONS
// ============================================================================

/**
 * Get all tasks for a project
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param options - Filter and sorting options
 * @returns Array of tasks
 */
export async function getProjectTasks(
  tenantId: string,
  projectId: string,
  options?: {
    status?: string | string[]
    priority?: string
    assigneeId?: string
    sprintId?: string
    epicId?: string
    storyId?: string
    scope?: 'project' | 'app'
    appId?: string
    limit?: number
  }
): Promise<Task[]> {
  try {
    const tasksRef = getProjectTasksCollection(tenantId, projectId)
    let q = query(tasksRef.withConverter(taskConverter))

    // Apply filters
    if (options?.status) {
      if (Array.isArray(options.status)) {
        q = query(q, where('status', 'in', options.status))
      } else {
        q = query(q, where('status', '==', options.status))
      }
    }

    if (options?.priority) {
      q = query(q, where('priority', '==', options.priority))
    }

    if (options?.assigneeId) {
      q = query(q, where('assignee.id', '==', options.assigneeId))
    }

    if (options?.sprintId) {
      q = query(q, where('sprintId', '==', options.sprintId))
    }

    if (options?.epicId) {
      q = query(q, where('epicId', '==', options.epicId))
    }

    if (options?.storyId) {
      q = query(q, where('storyId', '==', options.storyId))
    }

    if (options?.scope) {
      q = query(q, where('scope', '==', options.scope))
    }

    if (options?.appId) {
      q = query(q, where('appId', '==', options.appId))
    }

    // Add ordering
    q = query(q, orderBy('createdAt', 'desc'))

    // Apply limit
    if (options?.limit) {
      q = query(q, limit(options.limit))
    }

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
      createdAt: new Date(doc.data().createdAt),
      updatedAt: new Date(doc.data().updatedAt),
      startDate: doc.data().startDate ? new Date(doc.data().startDate) : undefined,
      dueDate: doc.data().dueDate ? new Date(doc.data().dueDate) : undefined,
      completedDate: doc.data().completedDate ? new Date(doc.data().completedDate) : undefined,
    } as Task))
  } catch (error) {
    console.error('Error getting project tasks:', error)
    throw error
  }
}

/**
 * Get a single task by ID
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param taskId - The task ID
 * @returns Task or null if not found
 */
export async function getTaskById(
  tenantId: string,
  projectId: string,
  taskId: string
): Promise<Task | null> {
  try {
    const tasksRef = getProjectTasksCollection(tenantId, projectId)
    const taskRef = doc(tasksRef, taskId).withConverter(taskConverter)
    const snapshot = await getDocs(query(tasksRef, where('__name__', '==', taskId)))

    if (snapshot.empty) {
      return null
    }

    const data = snapshot.docs[0].data()
    return {
      ...data,
      id: snapshot.docs[0].id,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      completedDate: data.completedDate ? new Date(data.completedDate) : undefined,
    } as Task
  } catch (error) {
    console.error('Error getting task:', error)
    throw error
  }
}

/**
 * Subscribe to tasks changes in real-time
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param callback - Callback function called when tasks change
 * @param options - Filter options
 * @returns Unsubscribe function
 */
export function subscribeToTasks(
  tenantId: string,
  projectId: string,
  callback: (tasks: Task[]) => void,
  options?: {
    status?: string | string[]
    priority?: string
    assigneeId?: string
    sprintId?: string
    epicId?: string
    storyId?: string
    scope?: 'project' | 'app'
    appId?: string
    limit?: number
  }
): Unsubscribe {
  try {
    const tasksRef = getProjectTasksCollection(tenantId, projectId)
    let q = query(tasksRef.withConverter(taskConverter))

    // Apply filters (same as getProjectTasks)
    if (options?.status) {
      if (Array.isArray(options.status)) {
        q = query(q, where('status', 'in', options.status))
      } else {
        q = query(q, where('status', '==', options.status))
      }
    }

    if (options?.priority) {
      q = query(q, where('priority', '==', options.priority))
    }

    if (options?.assigneeId) {
      q = query(q, where('assignee.id', '==', options.assigneeId))
    }

    if (options?.sprintId) {
      q = query(q, where('sprintId', '==', options.sprintId))
    }

    if (options?.epicId) {
      q = query(q, where('epicId', '==', options.epicId))
    }

    if (options?.storyId) {
      q = query(q, where('storyId', '==', options.storyId))
    }

    if (options?.scope) {
      q = query(q, where('scope', '==', options.scope))
    }

    if (options?.appId) {
      q = query(q, where('appId', '==', options.appId))
    }

    // Add ordering
    q = query(q, orderBy('createdAt', 'desc'))

    // Apply limit
    if (options?.limit) {
      q = query(q, limit(options.limit))
    }

    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        createdAt: new Date(doc.data().createdAt),
        updatedAt: new Date(doc.data().updatedAt),
        startDate: doc.data().startDate ? new Date(doc.data().startDate) : undefined,
        dueDate: doc.data().dueDate ? new Date(doc.data().dueDate) : undefined,
        completedDate: doc.data().completedDate ? new Date(doc.data().completedDate) : undefined,
      } as Task))
      callback(tasks)
    })
  } catch (error) {
    console.error('Error subscribing to tasks:', error)
    throw error
  }
}

// ============================================================================
// UPDATE OPERATIONS
// ============================================================================

/**
 * Update a task
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param taskId - The task ID
 * @param data - Partial task data to update
 * @returns Updated task
 */
export async function updateTask(
  tenantId: string,
  projectId: string,
  taskId: string,
  data: Partial<Omit<Task, 'id' | 'createdAt' | 'projectId'>>
): Promise<Task> {
  try {
    const tasksRef = getProjectTasksCollection(tenantId, projectId)
    const taskRef = doc(tasksRef, taskId)

    // Prepare update data
    const updateData = prepareForUpdate(data)
    const cleanedData = stripUndefined(updateData as any)

    // Update in Firestore
    await updateDoc(taskRef, cleanedData)

    // Fetch and return updated task
    const updated = await getTaskById(tenantId, projectId, taskId)
    if (!updated) {
      throw new Error('Failed to fetch updated task')
    }

    return updated
  } catch (error) {
    console.error('Error updating task:', error)
    throw error
  }
}

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

/**
 * Delete a task
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @param taskId - The task ID
 */
export async function deleteTask(
  tenantId: string,
  projectId: string,
  taskId: string
): Promise<void> {
  try {
    const tasksRef = getProjectTasksCollection(tenantId, projectId)
    const taskRef = doc(tasksRef, taskId)
    await deleteDoc(taskRef)
  } catch (error) {
    console.error('Error deleting task:', error)
    throw error
  }
}

// ============================================================================
// SERVICE OBJECT (Class-like pattern)
// ============================================================================

export const TasksService = {
  create: createTask,
  getById: getTaskById,
  list: getProjectTasks,
  subscribe: subscribeToTasks,
  update: updateTask,
  delete: deleteTask,
}

export default TasksService
