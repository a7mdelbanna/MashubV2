/**
 * Clients Service
 *
 * Service layer for Client entity CRUD operations
 * - Handles Firebase Firestore operations
 * - Manages data validation and transformation
 * - Provides real-time subscription support
 */

import {
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  Unsubscribe
} from 'firebase/firestore'
import { db, getClientsCollection } from '@/lib/firebase'
import {
  getClient,
  getClients,
  subscribeToClient,
  subscribeToClients
} from '@/lib/firebase-queries'
import { clientConverter } from '@/lib/firebase-converters'
import { prepareForCreate, prepareForUpdate, stripUndefined } from '@/lib/firebase-converters'
import type { Client, ClientStatus, ClientPriority, ClientSource } from '@/types/clients'

// ============================================================================
// CREATE OPERATIONS
// ============================================================================

/**
 * Create a new client
 *
 * @param tenantId - The tenant ID
 * @param data - Client data (without id, timestamps)
 * @returns Created client with generated ID
 */
export async function createClient(
  tenantId: string,
  data: Omit<Client, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>
): Promise<Client> {
  try {
    // Generate client ID
    const clientsRef = getClientsCollection(tenantId)
    const newClientRef = doc(clientsRef)

    // Prepare data for Firestore
    const clientData = prepareForCreate(data, tenantId)

    // Remove undefined values
    const cleanedData = stripUndefined(clientData as any)

    // Save to Firestore
    await setDoc(newClientRef.withConverter(clientConverter), cleanedData)

    // Fetch and return the created client
    const createdClient = await getClient(tenantId, newClientRef.id)

    if (!createdClient) {
      throw new Error('Failed to fetch created client')
    }

    return createdClient as Client
  } catch (error) {
    console.error('Error creating client:', error)
    throw error
  }
}

/**
 * Create multiple clients in a batch
 *
 * @param tenantId - The tenant ID
 * @param clients - Array of client data
 * @returns Array of created client IDs
 */
export async function createClientsBatch(
  tenantId: string,
  clients: Array<Omit<Client, 'id' | 'tenantId' | 'createdAt' | 'updatedAt'>>
): Promise<string[]> {
  try {
    const batch = writeBatch(db)
    const clientsRef = getClientsCollection(tenantId)
    const clientIds: string[] = []

    clients.forEach(clientData => {
      const newClientRef = doc(clientsRef)
      const preparedData = prepareForCreate(clientData, tenantId)
      const cleanedData = stripUndefined(preparedData as any)

      batch.set(newClientRef.withConverter(clientConverter), cleanedData)
      clientIds.push(newClientRef.id)
    })

    await batch.commit()
    return clientIds
  } catch (error) {
    console.error('Error creating clients batch:', error)
    throw error
  }
}

// ============================================================================
// READ OPERATIONS
// ============================================================================

/**
 * Get a single client by ID
 *
 * @param tenantId - The tenant ID
 * @param clientId - The client ID
 * @returns Client or null if not found
 */
export async function getClientById(
  tenantId: string,
  clientId: string
): Promise<Client | null> {
  const client = await getClient(tenantId, clientId)
  return client as Client | null
}

/**
 * List clients with optional filters
 *
 * @param tenantId - The tenant ID
 * @param options - Filter and pagination options
 * @returns Array of clients
 */
export async function listClients(
  tenantId: string,
  options?: {
    status?: ClientStatus
    priority?: ClientPriority
    source?: ClientSource
    limit?: number
  }
): Promise<Client[]> {
  const clients = await getClients(tenantId, options as any)
  return clients as Client[]
}

/**
 * Subscribe to client changes in real-time
 *
 * @param tenantId - The tenant ID
 * @param clientId - The client ID
 * @param callback - Callback function called when client changes
 * @returns Unsubscribe function
 */
export function subscribeToClientChanges(
  tenantId: string,
  clientId: string,
  callback: (client: Client | null) => void
): Unsubscribe {
  return subscribeToClient(tenantId, clientId, callback as any)
}

/**
 * Subscribe to all clients for a tenant in real-time
 *
 * @param tenantId - The tenant ID
 * @param callback - Callback function called when clients change
 * @param options - Optional filters
 * @returns Unsubscribe function
 */
export function subscribeToAllClients(
  tenantId: string,
  callback: (clients: Client[]) => void,
  options?: {
    status?: ClientStatus
    limit?: number
  }
): Unsubscribe {
  return subscribeToClients(tenantId, callback as any, options as any)
}

// ============================================================================
// UPDATE OPERATIONS
// ============================================================================

/**
 * Update a client
 *
 * @param tenantId - The tenant ID
 * @param clientId - The client ID
 * @param data - Partial client data to update
 * @returns Updated client
 */
export async function updateClient(
  tenantId: string,
  clientId: string,
  data: Partial<Omit<Client, 'id' | 'tenantId' | 'createdAt'>>
): Promise<Client> {
  try {
    const clientRef = doc(db, `tenants/${tenantId}/clients/${clientId}`)

    // Prepare data with updated timestamp
    const updateData = prepareForUpdate(data)

    // Remove undefined values
    const cleanedData = stripUndefined(updateData as any)

    // Update in Firestore
    await updateDoc(clientRef, cleanedData)

    // Fetch and return updated client
    const updatedClient = await getClient(tenantId, clientId)

    if (!updatedClient) {
      throw new Error('Failed to fetch updated client')
    }

    return updatedClient as Client
  } catch (error) {
    console.error('Error updating client:', error)
    throw error
  }
}

/**
 * Update client status
 *
 * @param tenantId - The tenant ID
 * @param clientId - The client ID
 * @param status - New status
 * @returns Updated client
 */
export async function updateClientStatus(
  tenantId: string,
  clientId: string,
  status: ClientStatus
): Promise<Client> {
  const updateData: any = { status }

  // Set onboardedAt timestamp if status is active
  if (status === 'active') {
    updateData.onboardedAt = new Date().toISOString()
  }

  // Set churnedAt timestamp if status is churned
  if (status === 'churned') {
    updateData.churnedAt = new Date().toISOString()
  }

  return updateClient(tenantId, clientId, updateData)
}

/**
 * Update client metrics
 *
 * @param tenantId - The tenant ID
 * @param clientId - The client ID
 * @param metrics - Metrics data
 * @returns Updated client
 */
export async function updateClientMetrics(
  tenantId: string,
  clientId: string,
  metrics: {
    totalRevenue?: number
    lifetimeValue?: number
    averageInvoiceValue?: number
    outstandingBalance?: number
    totalProjects?: number
    activeProjects?: number
    completedProjects?: number
  }
): Promise<Client> {
  return updateClient(tenantId, clientId, metrics)
}

// ============================================================================
// DELETE OPERATIONS
// ============================================================================

/**
 * Delete a client (soft delete - mark as churned)
 *
 * @param tenantId - The tenant ID
 * @param clientId - The client ID
 * @returns void
 */
export async function archiveClient(
  tenantId: string,
  clientId: string
): Promise<void> {
  await updateClientStatus(tenantId, clientId, 'churned')
}

/**
 * Permanently delete a client
 * WARNING: This will not delete subcollections (contacts, communications, etc.)
 * Use with caution
 *
 * @param tenantId - The tenant ID
 * @param clientId - The client ID
 * @returns void
 */
export async function deleteClientPermanently(
  tenantId: string,
  clientId: string
): Promise<void> {
  try {
    const clientRef = doc(db, `tenants/${tenantId}/clients/${clientId}`)
    await deleteDoc(clientRef)
  } catch (error) {
    console.error('Error deleting client:', error)
    throw error
  }
}

// ============================================================================
// EXPORT SERVICE OBJECT
// ============================================================================

export const ClientsService = {
  // Create
  create: createClient,
  createBatch: createClientsBatch,

  // Read
  getById: getClientById,
  list: listClients,
  subscribe: subscribeToClientChanges,
  subscribeAll: subscribeToAllClients,

  // Update
  update: updateClient,
  updateStatus: updateClientStatus,
  updateMetrics: updateClientMetrics,

  // Delete
  archive: archiveClient,
  deletePermanently: deleteClientPermanently,
}

export default ClientsService
