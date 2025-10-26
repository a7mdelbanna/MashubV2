/**
 * Stories Service
 *
 * Manages Story entities in Firebase with multi-tenant support.
 *
 * Collection Path: tenants/{tenantId}/projects/{projectId}/stories/{storyId}
 *
 * Features:
 * - Multi-tenant data isolation
 * - Real-time subscriptions
 * - Epic relationship support
 * - Sprint assignment
 * - Story points estimation
 * - Query-based relationships (tasks queried separately)
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
import type { Story } from '@/types'

/**
 * Get stories collection reference for a project
 */
function getProjectStoriesCollection(
  tenantId: string,
  projectId: string
): CollectionReference {
  return collection(
    db,
    'tenants',
    tenantId,
    'projects',
    projectId,
    'stories'
  ).withConverter(converters.story)
}

/**
 * Get story document reference
 */
function getStoryDoc(
  tenantId: string,
  projectId: string,
  storyId: string
): DocumentReference {
  return doc(
    db,
    'tenants',
    tenantId,
    'projects',
    projectId,
    'stories',
    storyId
  ).withConverter(converters.story)
}

/**
 * Validate story data
 */
function validateStoryData(data: Partial<Story>): void {
  if (data.title !== undefined && !data.title.trim()) {
    throw new Error('Story title is required')
  }

  if (data.status && !['draft', 'ready', 'in_progress', 'review', 'done', 'accepted'].includes(data.status)) {
    throw new Error('Invalid story status')
  }

  if (data.priority && !['low', 'medium', 'high', 'urgent'].includes(data.priority)) {
    throw new Error('Invalid story priority')
  }

  if (data.storyPoints !== undefined && (data.storyPoints < 0 || data.storyPoints > 100)) {
    throw new Error('Story points must be between 0 and 100')
  }

  if (data.progress !== undefined && (data.progress < 0 || data.progress > 100)) {
    throw new Error('Progress must be between 0 and 100')
  }
}

/**
 * Story Service Interface
 */
export interface StoryQueryOptions {
  epicId?: string
  sprintId?: string
  status?: Story['status']
  priority?: Story['priority']
  assigneeId?: string
  orderByField?: keyof Story
  orderDirection?: 'asc' | 'desc'
  limitCount?: number
}

export interface CreateStoryData {
  epicId?: string
  sprintId?: string
  title: string
  description?: string
  asA?: string
  iWant?: string
  soThat?: string
  status?: Story['status']
  priority?: Story['priority']
  storyPoints?: number
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  acceptanceCriteria?: string[]
  tags?: string[]
}

export interface UpdateStoryData {
  epicId?: string
  sprintId?: string
  title?: string
  description?: string
  asA?: string
  iWant?: string
  soThat?: string
  status?: Story['status']
  priority?: Story['priority']
  storyPoints?: number
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  acceptanceCriteria?: string[]
  tags?: string[]
  progress?: number
}

/**
 * Stories Service
 */
export const StoriesService = {
  /**
   * Create a new story
   */
  async create(
    tenantId: string,
    projectId: string,
    data: CreateStoryData
  ): Promise<Story> {
    validateStoryData(data)

    const storiesRef = getProjectStoriesCollection(tenantId, projectId)

    const now = new Date()
    const storyData: Omit<Story, 'id'> = {
      projectId,
      epicId: data.epicId,
      sprintId: data.sprintId,
      title: data.title,
      description: data.description,
      asA: data.asA,
      iWant: data.iWant,
      soThat: data.soThat,
      status: data.status || 'draft',
      priority: data.priority || 'medium',
      storyPoints: data.storyPoints,
      assignee: data.assignee,
      acceptanceCriteria: data.acceptanceCriteria || [],
      tags: data.tags || [],
      progress: 0,
      tasksCount: 0,
      completedTasksCount: 0,
      createdAt: now,
      updatedAt: now
    }

    const docRef = await addDoc(storiesRef, storyData as any)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      throw new Error('Failed to create story')
    }

    return docSnap.data() as Story
  },

  /**
   * Get story by ID
   */
  async get(
    tenantId: string,
    projectId: string,
    storyId: string
  ): Promise<Story | null> {
    const storyRef = getStoryDoc(tenantId, projectId, storyId)
    const docSnap = await getDoc(storyRef)

    if (!docSnap.exists()) {
      return null
    }

    return docSnap.data() as Story
  },

  /**
   * List stories with optional filters
   */
  async list(
    tenantId: string,
    projectId: string,
    options?: StoryQueryOptions
  ): Promise<Story[]> {
    const storiesRef = getProjectStoriesCollection(tenantId, projectId)
    const constraints: QueryConstraint[] = []

    // Add filters
    if (options?.epicId) {
      constraints.push(where('epicId', '==', options.epicId))
    }

    if (options?.sprintId) {
      constraints.push(where('sprintId', '==', options.sprintId))
    }

    if (options?.status) {
      constraints.push(where('status', '==', options.status))
    }

    if (options?.priority) {
      constraints.push(where('priority', '==', options.priority))
    }

    if (options?.assigneeId) {
      constraints.push(where('assignee.id', '==', options.assigneeId))
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

    const q = constraints.length > 0 ? query(storiesRef, ...constraints) : storiesRef
    const snapshot = await getDocs(q)

    return snapshot.docs.map(doc => doc.data() as Story)
  },

  /**
   * Update a story
   */
  async update(
    tenantId: string,
    projectId: string,
    storyId: string,
    data: UpdateStoryData
  ): Promise<void> {
    validateStoryData(data)

    const storyRef = getStoryDoc(tenantId, projectId, storyId)
    const updateData: any = {
      ...data,
      updatedAt: new Date()
    }

    await updateDoc(storyRef, updateData)
  },

  /**
   * Update story progress
   */
  async updateProgress(
    tenantId: string,
    projectId: string,
    storyId: string,
    progress: number
  ): Promise<void> {
    if (progress < 0 || progress > 100) {
      throw new Error('Progress must be between 0 and 100')
    }

    const storyRef = getStoryDoc(tenantId, projectId, storyId)

    // Auto-update status based on progress
    let status: Story['status'] = 'in_progress'
    if (progress === 0) {
      status = 'draft'
    } else if (progress === 100) {
      status = 'done'
    }

    await updateDoc(storyRef, {
      progress,
      status,
      updatedAt: new Date()
    })
  },

  /**
   * Update story counts (tasks)
   */
  async updateCounts(
    tenantId: string,
    projectId: string,
    storyId: string,
    counts: {
      tasksCount?: number
      completedTasksCount?: number
    }
  ): Promise<void> {
    const storyRef = getStoryDoc(tenantId, projectId, storyId)

    await updateDoc(storyRef, {
      ...counts,
      updatedAt: new Date()
    })
  },

  /**
   * Assign story to sprint
   */
  async assignToSprint(
    tenantId: string,
    projectId: string,
    storyId: string,
    sprintId: string | null
  ): Promise<void> {
    const storyRef = getStoryDoc(tenantId, projectId, storyId)

    await updateDoc(storyRef, {
      sprintId: sprintId || null,
      updatedAt: new Date()
    })
  },

  /**
   * Assign story to epic
   */
  async assignToEpic(
    tenantId: string,
    projectId: string,
    storyId: string,
    epicId: string | null
  ): Promise<void> {
    const storyRef = getStoryDoc(tenantId, projectId, storyId)

    await updateDoc(storyRef, {
      epicId: epicId || null,
      updatedAt: new Date()
    })
  },

  /**
   * Delete a story
   */
  async delete(
    tenantId: string,
    projectId: string,
    storyId: string
  ): Promise<void> {
    const storyRef = getStoryDoc(tenantId, projectId, storyId)
    await deleteDoc(storyRef)
  },

  /**
   * Subscribe to stories with real-time updates
   */
  subscribe(
    tenantId: string,
    projectId: string,
    callback: (stories: Story[]) => void,
    options?: StoryQueryOptions
  ): () => void {
    const storiesRef = getProjectStoriesCollection(tenantId, projectId)
    const constraints: QueryConstraint[] = []

    // Add filters
    if (options?.epicId) {
      constraints.push(where('epicId', '==', options.epicId))
    }

    if (options?.sprintId) {
      constraints.push(where('sprintId', '==', options.sprintId))
    }

    if (options?.status) {
      constraints.push(where('status', '==', options.status))
    }

    if (options?.priority) {
      constraints.push(where('priority', '==', options.priority))
    }

    if (options?.assigneeId) {
      constraints.push(where('assignee.id', '==', options.assigneeId))
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

    const q = constraints.length > 0 ? query(storiesRef, ...constraints) : storiesRef

    return onSnapshot(q, snapshot => {
      const stories = snapshot.docs.map(doc => doc.data() as Story)
      callback(stories)
    })
  },

  /**
   * Get backlog stories (not assigned to any sprint)
   */
  async getBacklog(
    tenantId: string,
    projectId: string
  ): Promise<Story[]> {
    const storiesRef = getProjectStoriesCollection(tenantId, projectId)

    const q = query(
      storiesRef,
      where('sprintId', '==', null),
      orderBy('priority', 'desc')
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => doc.data() as Story)
  },

  /**
   * Get stories by epic
   */
  async getByEpic(
    tenantId: string,
    projectId: string,
    epicId: string
  ): Promise<Story[]> {
    return this.list(tenantId, projectId, {
      epicId,
      orderByField: 'priority',
      orderDirection: 'desc'
    })
  },

  /**
   * Get stories by sprint
   */
  async getBySprint(
    tenantId: string,
    projectId: string,
    sprintId: string
  ): Promise<Story[]> {
    return this.list(tenantId, projectId, {
      sprintId,
      orderByField: 'priority',
      orderDirection: 'desc'
    })
  },

  /**
   * Get ready stories (ready for sprint)
   */
  async getReady(
    tenantId: string,
    projectId: string,
    limitCount: number = 10
  ): Promise<Story[]> {
    return this.list(tenantId, projectId, {
      status: 'ready',
      orderByField: 'priority',
      orderDirection: 'desc',
      limitCount
    })
  }
}
