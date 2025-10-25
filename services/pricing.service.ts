/**
 * Pricing Catalog & Feature Addons Service
 *
 * Service layer for project-specific pricing catalog and feature addons
 * - Handles Firebase Firestore operations
 * - Manages data validation and transformation
 * - Provides query and subscription support
 */

import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  query,
  where,
  orderBy
} from 'firebase/firestore'
import { db, getPricingCatalogCollection, getFeatureAddonsCollection } from '@/lib/firebase'
import {
  getProjectPricingCatalog,
  getPricingCatalogItem
} from '@/lib/firebase-queries'
import { pricingCatalogConverter, featureAddonConverter } from '@/lib/firebase-converters'
import { prepareForCreate, prepareForUpdate, stripUndefined } from '@/lib/firebase-converters'
import type { PricingCatalogItem, FeatureAddon } from '@/types'
import type { FirestorePricingCatalogItem, FirestoreFeatureAddon } from '@/lib/firebase-schema'

// ============================================================================
// PRICING CATALOG OPERATIONS
// ============================================================================

/**
 * Create a new pricing catalog item
 *
 * @param tenantId - The tenant ID
 * @param data - Pricing catalog data (without id, timestamps)
 * @returns Created pricing catalog item with generated ID
 */
export async function createPricingCatalogItem(
  tenantId: string,
  data: Omit<PricingCatalogItem, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'appsUsing'>
): Promise<FirestorePricingCatalogItem> {
  try {
    const catalogRef = getPricingCatalogCollection(tenantId)
    const newCatalogRef = doc(catalogRef)

    // Prepare data for Firestore
    const catalogData = prepareForCreate(
      {
        ...data,
        appsUsing: 0 // Initial count
      },
      tenantId
    )

    // Remove undefined values
    const cleanedData = stripUndefined(catalogData as any)

    // Save to Firestore
    await setDoc(newCatalogRef.withConverter(pricingCatalogConverter), cleanedData)

    // Fetch and return the created item
    const createdItem = await getPricingCatalogItem(tenantId, newCatalogRef.id)

    if (!createdItem) {
      throw new Error('Failed to fetch created pricing catalog item')
    }

    return createdItem
  } catch (error) {
    console.error('Error creating pricing catalog item:', error)
    throw error
  }
}

/**
 * Get a single pricing catalog item by ID
 *
 * @param tenantId - The tenant ID
 * @param catalogId - The catalog item ID
 * @returns Pricing catalog item or null if not found
 */
export async function getPricingCatalogItemById(
  tenantId: string,
  catalogId: string
): Promise<FirestorePricingCatalogItem | null> {
  return await getPricingCatalogItem(tenantId, catalogId)
}

/**
 * List pricing catalog items for a project
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @returns Array of pricing catalog items
 */
export async function listPricingCatalogByProject(
  tenantId: string,
  projectId: string
): Promise<FirestorePricingCatalogItem[]> {
  return await getProjectPricingCatalog(tenantId, projectId)
}

/**
 * Update a pricing catalog item
 *
 * @param tenantId - The tenant ID
 * @param catalogId - The catalog item ID
 * @param data - Partial catalog data to update
 * @returns Updated pricing catalog item
 */
export async function updatePricingCatalogItem(
  tenantId: string,
  catalogId: string,
  data: Partial<Omit<PricingCatalogItem, 'id' | 'tenantId' | 'createdAt' | 'appsUsing'>>
): Promise<FirestorePricingCatalogItem> {
  try {
    const catalogRef = doc(db, `tenants/${tenantId}/pricingCatalog/${catalogId}`)

    // Prepare data with updated timestamp
    const updateData = prepareForUpdate(data)

    // Remove undefined values
    const cleanedData = stripUndefined(updateData as any)

    // Update in Firestore
    await updateDoc(catalogRef, cleanedData)

    // Fetch and return updated item
    const updatedItem = await getPricingCatalogItem(tenantId, catalogId)

    if (!updatedItem) {
      throw new Error('Failed to fetch updated pricing catalog item')
    }

    return updatedItem
  } catch (error) {
    console.error('Error updating pricing catalog item:', error)
    throw error
  }
}

/**
 * Update the apps usage count for a pricing catalog item
 *
 * @param tenantId - The tenant ID
 * @param catalogId - The catalog item ID
 * @param count - New apps using count
 * @returns Updated pricing catalog item
 */
export async function updatePricingCatalogAppsCount(
  tenantId: string,
  catalogId: string,
  count: number
): Promise<FirestorePricingCatalogItem> {
  return updatePricingCatalogItem(tenantId, catalogId, { appsUsing: count })
}

/**
 * Delete a pricing catalog item
 *
 * @param tenantId - The tenant ID
 * @param catalogId - The catalog item ID
 * @returns void
 */
export async function deletePricingCatalogItem(
  tenantId: string,
  catalogId: string
): Promise<void> {
  try {
    const catalogRef = doc(db, `tenants/${tenantId}/pricingCatalog/${catalogId}`)
    await deleteDoc(catalogRef)
  } catch (error) {
    console.error('Error deleting pricing catalog item:', error)
    throw error
  }
}

// ============================================================================
// FEATURE ADDONS OPERATIONS
// ============================================================================

/**
 * Create a new feature addon
 *
 * @param tenantId - The tenant ID
 * @param data - Feature addon data (without id, timestamps)
 * @returns Created feature addon with generated ID
 */
export async function createFeatureAddon(
  tenantId: string,
  data: Omit<FeatureAddon, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'appsUsing'>
): Promise<FirestoreFeatureAddon> {
  try {
    const addonsRef = getFeatureAddonsCollection(tenantId)
    const newAddonRef = doc(addonsRef)

    // Prepare data for Firestore
    const addonData = prepareForCreate(
      {
        ...data,
        appsUsing: 0 // Initial count
      },
      tenantId
    )

    // Remove undefined values
    const cleanedData = stripUndefined(addonData as any)

    // Save to Firestore
    await setDoc(newAddonRef.withConverter(featureAddonConverter), cleanedData)

    // Fetch and return the created addon
    const createdAddon = await getFeatureAddonById(tenantId, newAddonRef.id)

    if (!createdAddon) {
      throw new Error('Failed to fetch created feature addon')
    }

    return createdAddon
  } catch (error) {
    console.error('Error creating feature addon:', error)
    throw error
  }
}

/**
 * Get a single feature addon by ID
 *
 * @param tenantId - The tenant ID
 * @param addonId - The addon ID
 * @returns Feature addon or null if not found
 */
export async function getFeatureAddonById(
  tenantId: string,
  addonId: string
): Promise<FirestoreFeatureAddon | null> {
  try {
    const addonRef = doc(db, `tenants/${tenantId}/featureAddons/${addonId}`)
    const snapshot = await getDoc(addonRef.withConverter(featureAddonConverter))

    if (!snapshot.exists()) {
      return null
    }

    return snapshot.data()
  } catch (error) {
    console.error('Error fetching feature addon:', error)
    return null
  }
}

/**
 * List feature addons for a project
 *
 * @param tenantId - The tenant ID
 * @param projectId - The project ID
 * @returns Array of feature addons
 */
export async function listFeatureAddonsByProject(
  tenantId: string,
  projectId: string
): Promise<FirestoreFeatureAddon[]> {
  try {
    const addonsRef = getFeatureAddonsCollection(tenantId)
    const q = query(
      addonsRef,
      where('projectId', '==', projectId),
      orderBy('category', 'asc')
    )
    const snapshot = await getDocs(q.withConverter(featureAddonConverter))

    return snapshot.docs.map(doc => doc.data())
  } catch (error) {
    console.error('Error fetching feature addons:', error)
    return []
  }
}

/**
 * Update a feature addon
 *
 * @param tenantId - The tenant ID
 * @param addonId - The addon ID
 * @param data - Partial addon data to update
 * @returns Updated feature addon
 */
export async function updateFeatureAddon(
  tenantId: string,
  addonId: string,
  data: Partial<Omit<FeatureAddon, 'id' | 'tenantId' | 'createdAt' | 'appsUsing'>>
): Promise<FirestoreFeatureAddon> {
  try {
    const addonRef = doc(db, `tenants/${tenantId}/featureAddons/${addonId}`)

    // Prepare data with updated timestamp
    const updateData = prepareForUpdate(data)

    // Remove undefined values
    const cleanedData = stripUndefined(updateData as any)

    // Update in Firestore
    await updateDoc(addonRef, cleanedData)

    // Fetch and return updated addon
    const updatedAddon = await getFeatureAddonById(tenantId, addonId)

    if (!updatedAddon) {
      throw new Error('Failed to fetch updated feature addon')
    }

    return updatedAddon
  } catch (error) {
    console.error('Error updating feature addon:', error)
    throw error
  }
}

/**
 * Update the apps usage count for a feature addon
 *
 * @param tenantId - The tenant ID
 * @param addonId - The addon ID
 * @param count - New apps using count
 * @returns Updated feature addon
 */
export async function updateFeatureAddonAppsCount(
  tenantId: string,
  addonId: string,
  count: number
): Promise<FirestoreFeatureAddon> {
  return updateFeatureAddon(tenantId, addonId, { appsUsing: count })
}

/**
 * Delete a feature addon
 *
 * @param tenantId - The tenant ID
 * @param addonId - The addon ID
 * @returns void
 */
export async function deleteFeatureAddon(
  tenantId: string,
  addonId: string
): Promise<void> {
  try {
    const addonRef = doc(db, `tenants/${tenantId}/featureAddons/${addonId}`)
    await deleteDoc(addonRef)
  } catch (error) {
    console.error('Error deleting feature addon:', error)
    throw error
  }
}

// ============================================================================
// BATCH OPERATIONS
// ============================================================================

/**
 * Create multiple pricing catalog items in a batch
 *
 * @param tenantId - The tenant ID
 * @param items - Array of pricing catalog data
 * @returns Array of created item IDs
 */
export async function createPricingCatalogBatch(
  tenantId: string,
  items: Array<Omit<PricingCatalogItem, 'id' | 'tenantId' | 'createdAt' | 'updatedAt' | 'appsUsing'>>
): Promise<string[]> {
  try {
    const batch = writeBatch(db)
    const catalogRef = getPricingCatalogCollection(tenantId)
    const itemIds: string[] = []

    items.forEach(itemData => {
      const newItemRef = doc(catalogRef)
      const preparedData = prepareForCreate({ ...itemData, appsUsing: 0 }, tenantId)
      const cleanedData = stripUndefined(preparedData as any)

      batch.set(newItemRef.withConverter(pricingCatalogConverter), cleanedData)
      itemIds.push(newItemRef.id)
    })

    await batch.commit()
    return itemIds
  } catch (error) {
    console.error('Error creating pricing catalog batch:', error)
    throw error
  }
}

// ============================================================================
// EXPORT SERVICE OBJECT
// ============================================================================

export const PricingService = {
  // Pricing Catalog
  createCatalogItem: createPricingCatalogItem,
  getCatalogItemById: getPricingCatalogItemById,
  listCatalogByProject: listPricingCatalogByProject,
  updateCatalogItem: updatePricingCatalogItem,
  updateCatalogAppsCount: updatePricingCatalogAppsCount,
  deleteCatalogItem: deletePricingCatalogItem,
  createCatalogBatch: createPricingCatalogBatch,

  // Feature Addons
  createAddon: createFeatureAddon,
  getAddonById: getFeatureAddonById,
  listAddonsByProject: listFeatureAddonsByProject,
  updateAddon: updateFeatureAddon,
  updateAddonAppsCount: updateFeatureAddonAppsCount,
  deleteAddon: deleteFeatureAddon,
}

export default PricingService
