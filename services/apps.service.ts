/**
 * Apps Service
 *
 * Service layer for App entity CRUD operations
 * - Handles Firebase Firestore operations for apps
 * - Manages app lifecycle (development, staging, production)
 * - Handles releases and environments
 * - Manages client relationships
 */

import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  Unsubscribe,
  onSnapshot
} from 'firebase/firestore'
import { db, getAppsCollection } from '@/lib/firebase'
import {
  getApp,
  getProjectApps,
  getClientApps
} from '@/lib/firebase-queries'
import { appConverter } from '@/lib/firebase-converters'
import { prepareForCreate, prepareForUpdate, stripUndefined } from '@/lib/firebase-converters'
import type { App } from '@/types'

// ============================================================================
// CREATE OPERATIONS
// ============================================================================

/**
 * Create a new app
 *
 * @param tenantId - The tenant ID
 * @param data - App data (without id, timestamps)
 * @returns Created app with generated ID
 */
export async function createApp(
  tenantId: string,
  data: Omit<App, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>
): Promise<App> {
  try {
    // Validate required fields
    if (!data.projectId) {
      throw new Error('projectId is required')
    }
    if (!data.client?.id) {
      throw new Error('client.id is required')
    }

    // Generate app ID
    const appsRef = getAppsCollection(tenantId)
    const newAppRef = doc(appsRef)

    // Prepare data for Firestore
    const appData = prepareForCreate(data, tenantId)

    // Remove undefined values
    const cleanedData = stripUndefined(appData as any)

    // Save to Firestore
    await setDoc(newAppRef.withConverter(appConverter), cleanedData)

    // Fetch and return the created app
    const createdApp = await getApp(tenantId, newAppRef.id)

    if (!createdApp) {
      throw new Error('Failed to fetch created app')
    }

    return createdApp
  } catch (error) {
    console.error('Error creating app:', error)
    throw error
  }
}

/**
 * Create multiple apps in a batch
 *
 * @param tenantId - The tenant ID
 * @param apps - Array of app data
 * @returns Array of created app IDs
 */
export async function createAppsBatch(
  tenantId: string,
  apps: Array<Omit<App, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>>
): Promise<string[]> {
  try {
    const batch = writeBatch(db)
    const appsRef = getAppsCollection(tenantId)
    const appIds: string[] = []

    apps.forEach(appData => {
      const newAppRef = doc(appsRef)
      const preparedData = prepareForCreate(appData, tenantId)
      const cleanedData = stripUndefined(preparedData as any)

      batch.set(newAppRef.withConverter(appConverter), cleanedData)
      appIds.push(newAppRef.id)
    })

    await batch.commit()
    return appIds
  } catch (error) {
    console.error('Error creating apps batch:', error)
    throw error
  }
}

// ============================================================================
// READ OPERATIONS
// ============================================================================

/**
 * Get a single app by ID
 *
 * @param tenantId - The tenant ID
 * @param appId - The app ID
 * @returns App or null if not found
 */
export async function getAppById(
  tenantId: string,
  appId: string
): Promise<App | null> {
  return getApp(tenantId, appId)
}

/**
 * List all apps for a project
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @returns Array of apps
 */
export async function listAppsByProject(
  tenantId: string,
  projectId: string
): Promise<App[]> {
  return getProjectApps(tenantId, projectId)
}

/**
 * List all apps for a client
 *
 * @param tenantId - The tenant ID
 * @param clientId - The client ID
 * @returns Array of apps
 */
export async function listAppsByClient(
  tenantId: string,
  clientId: string
): Promise<App[]> {
  return getClientApps(tenantId, clientId)
}

/**
 * Subscribe to app changes in real-time
 *
 * @param tenantId - The tenant ID
 * @param appId - The app ID
 * @param callback - Callback function called when app changes
 * @returns Unsubscribe function
 */
export function subscribeToAppChanges(
  tenantId: string,
  appId: string,
  callback: (app: App | null) => void
): Unsubscribe {
  const appRef = doc(db, `tenants/${tenantId}/apps/${appId}`)

  return onSnapshot(
    appRef.withConverter(appConverter),
    (snapshot) => {
      if (!snapshot.exists()) {
        callback(null)
        return
      }

      callback(snapshot.data() as App)
    },
    (error) => {
      console.error('Error in app subscription:', error)
      callback(null)
    }
  )
}

// ============================================================================
// UPDATE OPERATIONS
// ============================================================================

/**
 * Update an app
 *
 * @param tenantId - The tenant ID
 * @param appId - The app ID
 * @param data - Partial app data to update
 * @returns Updated app
 */
export async function updateApp(
  tenantId: string,
  appId: string,
  data: Partial<Omit<App, 'id' | 'tenantId' | 'createdAt'>>
): Promise<App> {
  try {
    const appRef = doc(db, `tenants/${tenantId}/apps/${appId}`)

    // Prepare data with updated timestamp
    const updateData = prepareForUpdate(data)

    // Remove undefined values
    const cleanedData = stripUndefined(updateData as any)

    // Update in Firestore
    await updateDoc(appRef, cleanedData)

    // Fetch and return updated app
    const updatedApp = await getApp(tenantId, appId)

    if (!updatedApp) {
      throw new Error('Failed to fetch updated app')
    }

    return updatedApp
  } catch (error) {
    console.error('Error updating app:', error)
    throw error
  }
}

/**
 * Update app status
 *
 * @param tenantId - The tenant ID
 * @param appId - The app ID
 * @param status - New status
 * @returns Updated app
 */
export async function updateAppStatus(
  tenantId: string,
  appId: string,
  status: 'development' | 'staging' | 'production' | 'maintenance' | 'deprecated'
): Promise<App> {
  return updateApp(tenantId, appId, { status })
}

/**
 * Update app branding
 *
 * @param tenantId - The tenant ID
 * @param appId - The app ID
 * @param branding - Branding data
 * @returns Updated app
 */
export async function updateAppBranding(
  tenantId: string,
  appId: string,
  branding: Partial<App['branding']>
): Promise<App> {
  // Get current app to merge branding
  const currentApp = await getApp(tenantId, appId)
  if (!currentApp) {
    throw new Error('App not found')
  }

  const updatedBranding = {
    ...currentApp.branding,
    ...branding
  }

  return updateApp(tenantId, appId, { branding: updatedBranding })
}

/**
 * Update app environment
 *
 * @param tenantId - The tenant ID
 * @param appId - The app ID
 * @param environment - Environment key ('dev', 'staging', 'production')
 * @param environmentData - Environment data to update
 * @returns Updated app
 */
export async function updateAppEnvironment(
  tenantId: string,
  appId: string,
  environment: 'dev' | 'staging' | 'production',
  environmentData: Partial<NonNullable<App['environments']['dev']>>
): Promise<App> {
  // Get current app to merge environment data
  const currentApp = await getApp(tenantId, appId)
  if (!currentApp) {
    throw new Error('App not found')
  }

  const updatedEnvironments = {
    ...currentApp.environments,
    [environment]: {
      ...(currentApp.environments[environment] || {}),
      ...environmentData
    }
  }

  return updateApp(tenantId, appId, { environments: updatedEnvironments })
}

/**
 * Deploy app to environment
 *
 * @param tenantId - The tenant ID
 * @param appId - The app ID
 * @param environment - Environment to deploy to
 * @param version - Version being deployed
 * @returns Updated app
 */
export async function deployAppToEnvironment(
  tenantId: string,
  appId: string,
  environment: 'dev' | 'staging' | 'production',
  version: string
): Promise<App> {
  const now = new Date().toISOString()

  return updateAppEnvironment(tenantId, appId, environment, {
    version,
    lastDeployed: now,
    status: 'active'
  })
}

/**
 * Create a new release
 *
 * @param tenantId - The tenant ID
 * @param appId - The app ID
 * @param release - Release data
 * @returns Updated app
 */
export async function createAppRelease(
  tenantId: string,
  appId: string,
  release: {
    version: string
    buildNumber?: number
    releaseChannel: 'dev' | 'staging' | 'production'
    notes?: string
    releasedBy?: string
  }
): Promise<App> {
  const currentApp = await getApp(tenantId, appId)
  if (!currentApp) {
    throw new Error('App not found')
  }

  const now = new Date().toISOString()

  // Move current release to history
  const history = currentApp.releases?.history || []
  if (currentApp.releases?.current) {
    history.unshift({
      ...currentApp.releases.current,
      status: 'shipped'
    })
  }

  // Set new current release
  const updatedReleases = {
    current: {
      version: release.version,
      buildNumber: release.buildNumber,
      releaseDate: now,
      releaseChannel: release.releaseChannel,
      notes: release.notes
    },
    upcoming: currentApp.releases?.upcoming,
    history
  }

  return updateApp(tenantId, appId, {
    releases: updatedReleases,
    lastDeployedAt: now
  })
}

/**
 * Update app health status
 *
 * @param tenantId - The tenant ID
 * @param appId - The app ID
 * @param health - Health data
 * @returns Updated app
 */
export async function updateAppHealth(
  tenantId: string,
  appId: string,
  health: Partial<App['health']>
): Promise<App> {
  const currentApp = await getApp(tenantId, appId)
  if (!currentApp) {
    throw new Error('App not found')
  }

  const updatedHealth = {
    ...currentApp.health,
    ...health,
    lastChecked: new Date().toISOString()
  }

  return updateApp(tenantId, appId, { health: updatedHealth })
}

/**
 * Update app features
 *
 * @param tenantId - The tenant ID
 * @param appId - The app ID
 * @param features - Features data
 * @returns Updated app
 */
export async function updateAppFeatures(
  tenantId: string,
  appId: string,
  features: Partial<App['features']>
): Promise<App> {
  const currentApp = await getApp(tenantId, appId)
  if (!currentApp) {
    throw new Error('App not found')
  }

  const updatedFeatures = {
    ...currentApp.features,
    ...features
  }

  return updateApp(tenantId, appId, { features: updatedFeatures })
}

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

/**
 * Soft delete an app (mark as deprecated)
 *
 * @param tenantId - The tenant ID
 * @param appId - The app ID
 * @returns Updated app
 */
export async function deprecateApp(
  tenantId: string,
  appId: string
): Promise<App> {
  return updateAppStatus(tenantId, appId, 'deprecated')
}

/**
 * Permanently delete an app
 * WARNING: This will not delete subcollections (credentials, releases, etc.)
 *
 * @param tenantId - The tenant ID
 * @param appId - The app ID
 * @returns void
 */
export async function deleteAppPermanently(
  tenantId: string,
  appId: string
): Promise<void> {
  try {
    const appRef = doc(db, `tenants/${tenantId}/apps/${appId}`)
    await deleteDoc(appRef)
  } catch (error) {
    console.error('Error deleting app:', error)
    throw error
  }
}

// ============================================================================
// EXPORT SERVICE OBJECT
// ============================================================================

export const AppsService = {
  // Create
  create: createApp,
  createBatch: createAppsBatch,

  // Read
  getById: getAppById,
  listByProject: listAppsByProject,
  listByClient: listAppsByClient,
  subscribe: subscribeToAppChanges,

  // Update
  update: updateApp,
  updateStatus: updateAppStatus,
  updateBranding: updateAppBranding,
  updateEnvironment: updateAppEnvironment,
  deployToEnvironment: deployAppToEnvironment,
  createRelease: createAppRelease,
  updateHealth: updateAppHealth,
  updateFeatures: updateAppFeatures,

  // Delete
  deprecate: deprecateApp,
  deletePermanently: deleteAppPermanently,
}

export default AppsService
