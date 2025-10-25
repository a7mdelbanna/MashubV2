import { db } from '@/lib/firebase'
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  setDoc,
  onSnapshot,
  orderBy as firestoreOrderBy,
  limit as firestoreLimit,
  startAfter,
  DocumentSnapshot
} from 'firebase/firestore'
import {
  Client,
  ClientStatus,
  ClientPriority,
  ClientSource,
  ContactPerson,
  Communication,
  ClientActivity,
  ClientNote,
  ClientDocument
} from '@/types/clients'

// ===========================================
// CLIENT SERVICE
// ===========================================

export class ClientsService {
  private static COLLECTION = 'clients'
  private static CONTACTS_COLLECTION = 'client_contacts'
  private static COMMUNICATIONS_COLLECTION = 'client_communications'
  private static ACTIVITIES_COLLECTION = 'client_activities'
  private static NOTES_COLLECTION = 'client_notes'
  private static DOCUMENTS_COLLECTION = 'client_documents'

  // ===========================================
  // CLIENTS CRUD
  // ===========================================

  /**
   * Get all clients for a tenant
   */
  static async getClients(tenantId: string): Promise<Client[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('tenantId', '==', tenantId)
      )

      const snapshot = await getDocs(q)
      const clients = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Client))

      // Sort in memory to avoid composite index
      return clients.sort((a, b) => {
        const aTime = new Date(a.createdAt).getTime()
        const bTime = new Date(b.createdAt).getTime()
        return bTime - aTime
      })
    } catch (error) {
      console.error('Error getting clients:', error)
      throw error
    }
  }

  /**
   * Get single client by ID
   */
  static async getClient(clientId: string): Promise<Client | null> {
    try {
      const docRef = doc(db, this.COLLECTION, clientId)
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? { ...docSnap.data(), id: docSnap.id } as Client : null
    } catch (error) {
      console.error('Error getting client:', error)
      throw error
    }
  }

  /**
   * Create new client
   */
  static async createClient(data: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date().toISOString()

      const newClient: Omit<Client, 'id'> = {
        ...data,
        totalRevenue: data.totalRevenue || 0,
        lifetimeValue: data.lifetimeValue || 0,
        averageInvoiceValue: data.averageInvoiceValue || 0,
        outstandingBalance: data.outstandingBalance || 0,
        totalProjects: data.totalProjects || 0,
        activeProjects: data.activeProjects || 0,
        completedProjects: data.completedProjects || 0,
        tags: data.tags || [],
        createdAt: now,
        updatedAt: now
      }

      const docRef = await addDoc(collection(db, this.COLLECTION), newClient)

      // Log activity
      await this.logActivity({
        clientId: docRef.id,
        type: 'created',
        title: 'Client Created',
        description: `Client ${data.name} was created`,
        createdAt: now
      })

      return docRef.id
    } catch (error) {
      console.error('Error creating client:', error)
      throw error
    }
  }

  /**
   * Update client
   */
  static async updateClient(
    clientId: string,
    updates: Partial<Client>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, clientId)

      // Remove undefined values and id field
      const cleanUpdates: any = {
        ...updates,
        updatedAt: new Date().toISOString()
      }
      delete cleanUpdates.id

      await updateDoc(docRef, cleanUpdates)

      // Log activity
      await this.logActivity({
        clientId,
        type: 'updated',
        title: 'Client Updated',
        description: 'Client information was updated',
        createdAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating client:', error)
      throw error
    }
  }

  /**
   * Delete client (soft delete by changing status)
   */
  static async deleteClient(clientId: string): Promise<void> {
    try {
      await this.updateClient(clientId, {
        status: 'inactive',
        updatedAt: new Date().toISOString()
      })

      // Log activity
      await this.logActivity({
        clientId,
        type: 'updated',
        title: 'Client Deactivated',
        description: 'Client was deactivated',
        createdAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error deleting client:', error)
      throw error
    }
  }

  /**
   * Hard delete client (permanent deletion)
   */
  static async hardDeleteClient(clientId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COLLECTION, clientId))
    } catch (error) {
      console.error('Error hard deleting client:', error)
      throw error
    }
  }

  // ===========================================
  // SEARCH & FILTERS
  // ===========================================

  /**
   * Search clients by name or email
   */
  static async searchClients(
    tenantId: string,
    searchTerm: string
  ): Promise<Client[]> {
    try {
      const clients = await this.getClients(tenantId)

      if (!searchTerm.trim()) {
        return clients
      }

      const term = searchTerm.toLowerCase()
      return clients.filter(client =>
        client.name.toLowerCase().includes(term) ||
        client.email.toLowerCase().includes(term) ||
        (client.legalName && client.legalName.toLowerCase().includes(term))
      )
    } catch (error) {
      console.error('Error searching clients:', error)
      throw error
    }
  }

  /**
   * Filter clients by status
   */
  static async filterByStatus(
    tenantId: string,
    status: ClientStatus
  ): Promise<Client[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('tenantId', '==', tenantId),
        where('status', '==', status)
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Client))
    } catch (error) {
      console.error('Error filtering clients by status:', error)
      throw error
    }
  }

  /**
   * Filter clients by priority
   */
  static async filterByPriority(
    tenantId: string,
    priority: ClientPriority
  ): Promise<Client[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('tenantId', '==', tenantId),
        where('priority', '==', priority)
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Client))
    } catch (error) {
      console.error('Error filtering clients by priority:', error)
      throw error
    }
  }

  /**
   * Filter clients by tag
   */
  static async filterByTag(
    tenantId: string,
    tag: string
  ): Promise<Client[]> {
    try {
      const clients = await this.getClients(tenantId)
      return clients.filter(client => client.tags.includes(tag))
    } catch (error) {
      console.error('Error filtering clients by tag:', error)
      throw error
    }
  }

  // ===========================================
  // STATISTICS
  // ===========================================

  /**
   * Get client statistics for a tenant
   */
  static async getClientStats(tenantId: string): Promise<{
    total: number
    byStatus: Record<ClientStatus, number>
    byPriority: Record<ClientPriority, number>
    totalRevenue: number
    avgLifetimeValue: number
    activeProjects: number
  }> {
    try {
      const clients = await this.getClients(tenantId)

      const stats = {
        total: clients.length,
        byStatus: {} as Record<ClientStatus, number>,
        byPriority: {} as Record<ClientPriority, number>,
        totalRevenue: 0,
        avgLifetimeValue: 0,
        activeProjects: 0
      }

      clients.forEach(client => {
        // Count by status
        stats.byStatus[client.status] = (stats.byStatus[client.status] || 0) + 1

        // Count by priority
        stats.byPriority[client.priority] = (stats.byPriority[client.priority] || 0) + 1

        // Sum metrics
        stats.totalRevenue += client.totalRevenue || 0
        stats.activeProjects += client.activeProjects || 0
      })

      // Calculate average lifetime value
      stats.avgLifetimeValue = clients.length > 0
        ? clients.reduce((sum, c) => sum + (c.lifetimeValue || 0), 0) / clients.length
        : 0

      return stats
    } catch (error) {
      console.error('Error getting client stats:', error)
      throw error
    }
  }

  // ===========================================
  // CONTACT PERSONS
  // ===========================================

  /**
   * Get all contacts for a client
   */
  static async getClientContacts(clientId: string): Promise<ContactPerson[]> {
    try {
      const q = query(
        collection(db, this.CONTACTS_COLLECTION),
        where('clientId', '==', clientId)
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as ContactPerson))
    } catch (error) {
      console.error('Error getting client contacts:', error)
      throw error
    }
  }

  /**
   * Add contact person to client
   */
  static async addContact(
    contact: Omit<ContactPerson, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const now = new Date().toISOString()

      const newContact = {
        ...contact,
        fullName: `${contact.firstName} ${contact.lastName}`,
        createdAt: now,
        updatedAt: now
      }

      const docRef = await addDoc(collection(db, this.CONTACTS_COLLECTION), newContact)

      // If primary contact, update client
      if (contact.isPrimary) {
        await this.updateClient(contact.clientId, {
          primaryContactId: docRef.id
        })
      }

      return docRef.id
    } catch (error) {
      console.error('Error adding contact:', error)
      throw error
    }
  }

  /**
   * Update contact person
   */
  static async updateContact(
    contactId: string,
    updates: Partial<ContactPerson>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.CONTACTS_COLLECTION, contactId)

      const cleanUpdates: any = {
        ...updates,
        updatedAt: new Date().toISOString()
      }
      delete cleanUpdates.id

      await updateDoc(docRef, cleanUpdates)
    } catch (error) {
      console.error('Error updating contact:', error)
      throw error
    }
  }

  // ===========================================
  // COMMUNICATIONS
  // ===========================================

  /**
   * Get all communications for a client
   */
  static async getClientCommunications(clientId: string): Promise<Communication[]> {
    try {
      const q = query(
        collection(db, this.COMMUNICATIONS_COLLECTION),
        where('clientId', '==', clientId)
      )

      const snapshot = await getDocs(q)
      const communications = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Communication))

      return communications.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
    } catch (error) {
      console.error('Error getting communications:', error)
      throw error
    }
  }

  /**
   * Add communication
   */
  static async addCommunication(
    communication: Omit<Communication, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const now = new Date().toISOString()

      const newCommunication = {
        ...communication,
        createdAt: now,
        updatedAt: now
      }

      const docRef = await addDoc(
        collection(db, this.COMMUNICATIONS_COLLECTION),
        newCommunication
      )

      // Update client's last contact date
      await this.updateClient(communication.clientId, {
        lastContactDate: now
      })

      // Log activity
      await this.logActivity({
        clientId: communication.clientId,
        type: 'communication',
        title: `${communication.type} - ${communication.subject}`,
        description: communication.content,
        userId: communication.userId,
        userName: communication.userName,
        createdAt: now
      })

      return docRef.id
    } catch (error) {
      console.error('Error adding communication:', error)
      throw error
    }
  }

  // ===========================================
  // ACTIVITIES & NOTES
  // ===========================================

  /**
   * Get client activities
   */
  static async getClientActivities(clientId: string, limit: number = 50): Promise<ClientActivity[]> {
    try {
      const q = query(
        collection(db, this.ACTIVITIES_COLLECTION),
        where('clientId', '==', clientId)
      )

      const snapshot = await getDocs(q)
      const activities = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as ClientActivity))

      return activities
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, limit)
    } catch (error) {
      console.error('Error getting activities:', error)
      throw error
    }
  }

  /**
   * Log activity
   */
  static async logActivity(
    activity: Omit<ClientActivity, 'id'>
  ): Promise<string> {
    try {
      const docRef = await addDoc(
        collection(db, this.ACTIVITIES_COLLECTION),
        activity
      )
      return docRef.id
    } catch (error) {
      console.error('Error logging activity:', error)
      throw error
    }
  }

  /**
   * Get client notes
   */
  static async getClientNotes(clientId: string): Promise<ClientNote[]> {
    try {
      const q = query(
        collection(db, this.NOTES_COLLECTION),
        where('clientId', '==', clientId)
      )

      const snapshot = await getDocs(q)
      const notes = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as ClientNote))

      return notes.sort((a, b) => {
        // Pinned notes first
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
    } catch (error) {
      console.error('Error getting notes:', error)
      throw error
    }
  }

  /**
   * Add note
   */
  static async addNote(
    note: Omit<ClientNote, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const now = new Date().toISOString()

      const newNote = {
        ...note,
        createdAt: now,
        updatedAt: now
      }

      const docRef = await addDoc(collection(db, this.NOTES_COLLECTION), newNote)

      // Log activity
      await this.logActivity({
        clientId: note.clientId,
        type: 'note',
        title: 'Note Added',
        description: note.content.substring(0, 100),
        userId: '',
        userName: note.createdByName,
        createdAt: now
      })

      return docRef.id
    } catch (error) {
      console.error('Error adding note:', error)
      throw error
    }
  }

  /**
   * Update note
   */
  static async updateNote(
    noteId: string,
    updates: Partial<Omit<ClientNote, 'id' | 'clientId' | 'createdAt' | 'createdBy' | 'createdByName'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.NOTES_COLLECTION, noteId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating note:', error)
      throw error
    }
  }

  /**
   * Delete note
   */
  static async deleteNote(noteId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.NOTES_COLLECTION, noteId))
    } catch (error) {
      console.error('Error deleting note:', error)
      throw error
    }
  }

  /**
   * Add communication
   */
  static async addCommunication(
    communication: Omit<Communication, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const now = new Date().toISOString()

      const newCommunication = {
        ...communication,
        createdAt: now,
        updatedAt: now
      }

      const docRef = await addDoc(
        collection(db, this.COMMUNICATIONS_COLLECTION),
        newCommunication
      )

      // Log activity
      await this.logActivity({
        clientId: communication.clientId,
        type: 'communication',
        title: `${communication.type} - ${communication.subject}`,
        description: communication.content.substring(0, 100),
        userId: communication.userId,
        userName: communication.userName,
        createdAt: now
      })

      return docRef.id
    } catch (error) {
      console.error('Error adding communication:', error)
      throw error
    }
  }

  /**
   * Update communication
   */
  static async updateCommunication(
    communicationId: string,
    updates: Partial<Omit<Communication, 'id' | 'clientId' | 'createdAt' | 'userId'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COMMUNICATIONS_COLLECTION, communicationId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating communication:', error)
      throw error
    }
  }

  /**
   * Delete communication
   */
  static async deleteCommunication(communicationId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COMMUNICATIONS_COLLECTION, communicationId))
    } catch (error) {
      console.error('Error deleting communication:', error)
      throw error
    }
  }

  // ===========================================
  // REAL-TIME LISTENERS
  // ===========================================

  /**
   * Subscribe to client updates
   */
  static subscribeToClient(
    clientId: string,
    callback: (client: Client | null) => void
  ): () => void {
    const docRef = doc(db, this.COLLECTION, clientId)

    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback({ ...snapshot.data(), id: snapshot.id } as Client)
      } else {
        callback(null)
      }
    })
  }

  /**
   * Subscribe to clients list
   */
  static subscribeToClients(
    tenantId: string,
    callback: (clients: Client[]) => void
  ): () => void {
    const q = query(
      collection(db, this.COLLECTION),
      where('tenantId', '==', tenantId)
    )

    return onSnapshot(q, (snapshot) => {
      const clients = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as Client))

      callback(clients)
    })
  }
}

// Export convenience instance
export const clientsService = ClientsService
