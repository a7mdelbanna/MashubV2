/**
 * Firebase Query Functions
 *
 * Common query patterns for fetching data with relationships populated
 * These functions handle the query-based relationship model:
 * - Fetch primary entity
 * - Query related entities
 * - Populate arrays on frontend
 */

import {
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore'
import { db, getProjectsCollection, getAppsCollection, getClientsCollection, getPricingCatalogCollection } from './firebase'
import { projectConverter, appConverter, clientConverter, pricingCatalogConverter } from './firebase-converters'
import type { Project, App, ProjectType, ProjectStatus, ProjectPriority } from '@/types'
import type { FirestoreProject, FirestoreApp, FirestoreClient, FirestorePricingCatalogItem } from './firebase-schema'

// ============================================================================
// PROJECT QUERIES
// ============================================================================

/**
 * Get a single project by ID with all relationships populated
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @returns Project with apps, pricingCatalog, etc. populated
 */
export async function getProject(tenantId: string, projectId: string): Promise<Project | null> {
  try {
    // 1. Get project document
    const projectRef = doc(db, `tenants/${tenantId}/projects/${projectId}`)
    const projectSnap = await getDoc(projectRef.withConverter(projectConverter))

    if (!projectSnap.exists()) {
      return null
    }

    const projectData = projectSnap.data() as any

    // 2. Populate apps array
    const apps = await getProjectApps(tenantId, projectId)
    projectData.apps = apps

    // 3. Populate pricing catalog
    const pricingCatalog = await getProjectPricingCatalog(tenantId, projectId)
    projectData.pricingCatalog = pricingCatalog

    // 4. TODO: Populate checklist templates (if needed)
    projectData.checklistTemplates = projectData.checklistTemplates || []

    // 5. TODO: Populate checklist instances from subcollection
    projectData.checklistInstances = projectData.checklistInstances || []

    // 6. TODO: Populate team members from subcollection
    projectData.team = projectData.team || []

    return projectData as Project
  } catch (error) {
    console.error('Error fetching project:', error)
    throw error
  }
}

/**
 * Get all projects for a tenant with optional filters
 */
export async function getProjects(
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
  try {
    const constraints: QueryConstraint[] = []

    // Apply filters
    if (options?.status) {
      if (Array.isArray(options.status)) {
        constraints.push(where('status', 'in', options.status))
      } else {
        constraints.push(where('status', '==', options.status))
      }
    }

    if (options?.priority) {
      constraints.push(where('priority', '==', options.priority))
    }

    if (options?.type) {
      constraints.push(where('type', '==', options.type))
    }

    // Apply ordering
    const orderByField = options?.orderByField || 'updatedAt'
    const orderDirection = options?.orderDirection || 'desc'
    constraints.push(orderBy(orderByField, orderDirection))

    // Apply limit
    if (options?.limit) {
      constraints.push(limit(options.limit))
    }

    // Execute query
    const projectsRef = getProjectsCollection(tenantId)
    const q = query(projectsRef, ...constraints)
    const snapshot = await getDocs(q.withConverter(projectConverter))

    // For list view, we might not populate all relationships
    // to keep it lightweight
    const projects = snapshot.docs.map(doc => {
      const data = doc.data() as any
      return {
        ...data,
        apps: [], // Populate later if needed
        pricingCatalog: [],
        checklistTemplates: [],
        checklistInstances: [],
        team: []
      } as Project
    })

    return projects
  } catch (error) {
    console.error('Error fetching projects:', error)
    throw error
  }
}

/**
 * Subscribe to project changes in real-time
 */
export function subscribeToProject(
  tenantId: string,
  projectId: string,
  callback: (project: Project | null) => void
): Unsubscribe {
  const projectRef = doc(db, `tenants/${tenantId}/projects/${projectId}`)

  return onSnapshot(
    projectRef.withConverter(projectConverter),
    async (snapshot) => {
      if (!snapshot.exists()) {
        callback(null)
        return
      }

      const projectData = snapshot.data() as any

      // Populate relationships
      const apps = await getProjectApps(tenantId, projectId)
      const pricingCatalog = await getProjectPricingCatalog(tenantId, projectId)

      projectData.apps = apps
      projectData.pricingCatalog = pricingCatalog
      projectData.checklistTemplates = projectData.checklistTemplates || []
      projectData.checklistInstances = projectData.checklistInstances || []
      projectData.team = projectData.team || []

      callback(projectData as Project)
    },
    (error) => {
      console.error('Error in project subscription:', error)
      callback(null)
    }
  )
}

/**
 * Subscribe to all projects for a tenant in real-time
 */
export function subscribeToProjects(
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
  const constraints: QueryConstraint[] = []

  // Apply filters
  if (options?.status) {
    if (Array.isArray(options.status)) {
      constraints.push(where('status', 'in', options.status))
    } else {
      constraints.push(where('status', '==', options.status))
    }
  }

  if (options?.priority) {
    constraints.push(where('priority', '==', options.priority))
  }

  if (options?.type) {
    constraints.push(where('type', '==', options.type))
  }

  // Apply ordering
  const orderByField = options?.orderByField || 'updatedAt'
  const orderDirection = options?.orderDirection || 'desc'
  constraints.push(orderBy(orderByField, orderDirection))

  // Apply limit
  if (options?.limit) {
    constraints.push(limit(options.limit))
  }

  // Create query
  const projectsRef = getProjectsCollection(tenantId)
  const q = query(projectsRef, ...constraints)

  return onSnapshot(
    q.withConverter(projectConverter),
    (snapshot) => {
      const projects = snapshot.docs.map(doc => {
        const data = doc.data() as any
        return {
          ...data,
          apps: [], // Keep lightweight for list view
          pricingCatalog: [],
          checklistTemplates: [],
          checklistInstances: [],
          team: []
        } as Project
      })
      callback(projects)
    },
    (error) => {
      console.error('Error in projects subscription:', error)
      callback([])
    }
  )
}

// ============================================================================
// APP QUERIES
// ============================================================================

/**
 * Get all apps for a project
 */
export async function getProjectApps(tenantId: string, projectId: string): Promise<App[]> {
  try {
    const appsRef = getAppsCollection(tenantId)
    const q = query(
      appsRef,
      where('projectId', '==', projectId),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(q.withConverter(appConverter))

    return snapshot.docs.map(doc => doc.data() as App)
  } catch (error) {
    console.error('Error fetching project apps:', error)
    return []
  }
}

/**
 * Get all apps for a client
 */
export async function getClientApps(tenantId: string, clientId: string): Promise<App[]> {
  try {
    const appsRef = getAppsCollection(tenantId)
    const q = query(
      appsRef,
      where('client.id', '==', clientId),
      orderBy('status', 'asc')
    )
    const snapshot = await getDocs(q.withConverter(appConverter))

    return snapshot.docs.map(doc => doc.data() as App)
  } catch (error) {
    console.error('Error fetching client apps:', error)
    return []
  }
}

/**
 * Get a single app by ID
 */
export async function getApp(tenantId: string, appId: string): Promise<App | null> {
  try {
    const appRef = doc(db, `tenants/${tenantId}/apps/${appId}`)
    const snapshot = await getDoc(appRef.withConverter(appConverter))

    if (!snapshot.exists()) {
      return null
    }

    return snapshot.data() as App
  } catch (error) {
    console.error('Error fetching app:', error)
    return null
  }
}

// ============================================================================
// CLIENT QUERIES
// ============================================================================

/**
 * Get all unique clients for a project (via apps)
 */
export async function getProjectClients(
  tenantId: string,
  projectId: string
): Promise<Array<{ id: string; name: string; logo?: string }>> {
  try {
    // 1. Get all apps for the project
    const apps = await getProjectApps(tenantId, projectId)

    // 2. Extract unique client IDs
    const clientMap = new Map<string, { id: string; name: string; logo?: string }>()
    apps.forEach(app => {
      if (!clientMap.has(app.client.id)) {
        clientMap.set(app.client.id, app.client)
      }
    })

    return Array.from(clientMap.values())
  } catch (error) {
    console.error('Error fetching project clients:', error)
    return []
  }
}

/**
 * Get full client details
 */
export async function getClient(tenantId: string, clientId: string): Promise<FirestoreClient | null> {
  try {
    const clientRef = doc(db, `tenants/${tenantId}/clients/${clientId}`)
    const snapshot = await getDoc(clientRef.withConverter(clientConverter))

    if (!snapshot.exists()) {
      return null
    }

    return snapshot.data()
  } catch (error) {
    console.error('Error fetching client:', error)
    return null
  }
}

/**
 * Get all clients for a tenant
 */
export async function getClients(
  tenantId: string,
  options?: {
    status?: 'active' | 'inactive' | 'potential'
    limit?: number
  }
): Promise<FirestoreClient[]> {
  try {
    const constraints: QueryConstraint[] = []

    if (options?.status) {
      constraints.push(where('status', '==', options.status))
    }

    constraints.push(orderBy('name', 'asc'))

    if (options?.limit) {
      constraints.push(limit(options.limit))
    }

    const clientsRef = getClientsCollection(tenantId)
    const q = query(clientsRef, ...constraints)
    const snapshot = await getDocs(q.withConverter(clientConverter))

    return snapshot.docs.map(doc => doc.data())
  } catch (error) {
    console.error('Error fetching clients:', error)
    return []
  }
}

/**
 * Subscribe to client changes in real-time
 */
export function subscribeToClient(
  tenantId: string,
  clientId: string,
  callback: (client: FirestoreClient | null) => void
): Unsubscribe {
  const clientRef = doc(db, `tenants/${tenantId}/clients/${clientId}`)

  return onSnapshot(
    clientRef.withConverter(clientConverter),
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null)
        return
      }
      callback(snapshot.data())
    },
    (error) => {
      console.error('Error in client subscription:', error)
      callback(null)
    }
  )
}

/**
 * Subscribe to all clients for a tenant in real-time
 */
export function subscribeToClients(
  tenantId: string,
  callback: (clients: FirestoreClient[]) => void,
  options?: {
    status?: 'active' | 'inactive' | 'potential'
    limit?: number
  }
): Unsubscribe {
  const constraints: QueryConstraint[] = []

  if (options?.status) {
    constraints.push(where('status', '==', options.status))
  }

  constraints.push(orderBy('name', 'asc'))

  if (options?.limit) {
    constraints.push(limit(options.limit))
  }

  const clientsRef = getClientsCollection(tenantId)
  const q = query(clientsRef, ...constraints)

  return onSnapshot(
    q.withConverter(clientConverter),
    (snapshot) => {
      const clients = snapshot.docs.map(doc => doc.data())
      callback(clients)
    },
    (error) => {
      console.error('Error in clients subscription:', error)
      callback([])
    }
  )
}

// ============================================================================
// PRICING CATALOG QUERIES
// ============================================================================

/**
 * Get pricing catalog for a project
 */
export async function getProjectPricingCatalog(
  tenantId: string,
  projectId: string
): Promise<FirestorePricingCatalogItem[]> {
  try {
    const catalogRef = getPricingCatalogCollection(tenantId)
    const q = query(
      catalogRef,
      where('projectId', '==', projectId),
      orderBy('category', 'asc')
    )
    const snapshot = await getDocs(q.withConverter(pricingCatalogConverter))

    return snapshot.docs.map(doc => doc.data())
  } catch (error) {
    console.error('Error fetching pricing catalog:', error)
    return []
  }
}

/**
 * Get a single pricing catalog item
 */
export async function getPricingCatalogItem(
  tenantId: string,
  catalogId: string
): Promise<FirestorePricingCatalogItem | null> {
  try {
    const itemRef = doc(db, `tenants/${tenantId}/pricingCatalog/${catalogId}`)
    const snapshot = await getDoc(itemRef.withConverter(pricingCatalogConverter))

    if (!snapshot.exists()) {
      return null
    }

    return snapshot.data()
  } catch (error) {
    console.error('Error fetching pricing catalog item:', error)
    return null
  }
}

// ============================================================================
// SEARCH QUERIES
// ============================================================================

/**
 * Search projects by name (client-side filtering for now)
 * TODO: Implement Algolia or similar for better search
 */
export async function searchProjects(
  tenantId: string,
  searchTerm: string
): Promise<Project[]> {
  try {
    // Get all projects (with limit)
    const projects = await getProjects(tenantId, { limit: 100 })

    // Filter client-side
    const searchLower = searchTerm.toLowerCase()
    return projects.filter(project =>
      project.name.toLowerCase().includes(searchLower) ||
      project.description?.toLowerCase().includes(searchLower) ||
      project.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    )
  } catch (error) {
    console.error('Error searching projects:', error)
    return []
  }
}

// ============================================================================
// AGGREGATE QUERIES
// ============================================================================

/**
 * Get project statistics for a tenant
 */
export async function getProjectStats(tenantId: string) {
  try {
    // Get all projects
    const projects = await getProjects(tenantId)

    // Calculate stats
    const stats = {
      total: projects.length,
      byStatus: {
        draft: projects.filter(p => p.status === 'draft').length,
        planning: projects.filter(p => p.status === 'planning').length,
        in_progress: projects.filter(p => p.status === 'in_progress').length,
        completed: projects.filter(p => p.status === 'completed').length,
        on_hold: projects.filter(p => p.status === 'on_hold').length,
        cancelled: projects.filter(p => p.status === 'cancelled').length,
      },
      byPriority: {
        low: projects.filter(p => p.priority === 'low').length,
        medium: projects.filter(p => p.priority === 'medium').length,
        high: projects.filter(p => p.priority === 'high').length,
        critical: projects.filter(p => p.priority === 'critical').length,
      },
      totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
      totalSpent: projects.reduce((sum, p) => sum + (p.spent || 0), 0),
      avgCompletion: projects.length > 0
        ? projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length
        : 0
    }

    return stats
  } catch (error) {
    console.error('Error calculating project stats:', error)
    return null
  }
}

// ============================================================================
// EXPORT ALL QUERY FUNCTIONS
// ============================================================================

export const queries = {
  // Projects
  getProject,
  getProjects,
  subscribeToProject,
  searchProjects,
  getProjectStats,

  // Apps
  getProjectApps,
  getClientApps,
  getApp,

  // Clients
  getProjectClients,
  getClient,
  getClients,

  // Pricing
  getProjectPricingCatalog,
  getPricingCatalogItem,
}

export default queries
