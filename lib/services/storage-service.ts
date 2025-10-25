import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTaskSnapshot
} from 'firebase/storage'
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore'
import { storage, db } from '@/lib/firebase'

export interface ClientDocument {
  id: string
  clientId: string
  tenantId: string
  name: string
  originalName: string
  size: number
  type: string
  category?: 'contract' | 'invoice' | 'proposal' | 'report' | 'other'
  storagePath: string
  downloadURL: string
  uploadedBy: string
  uploadedByName: string
  createdAt: string
  updatedAt: string
  description?: string
  tags?: string[]
}

export interface UploadProgress {
  bytesTransferred: number
  totalBytes: number
  progress: number
  state: 'running' | 'paused' | 'success' | 'error' | 'canceled'
}

/**
 * Storage Service for managing file uploads, downloads, and deletions
 * Integrates Firebase Storage with Firestore for metadata tracking
 */
export class StorageService {
  private static COLLECTION = 'client_documents'

  /**
   * Upload a file to Firebase Storage and track metadata in Firestore
   * @param file - The file to upload
   * @param clientId - The client ID the file belongs to
   * @param tenantId - The tenant ID
   * @param userId - The user uploading the file
   * @param userName - The name of the user uploading
   * @param category - Optional category for the document
   * @param description - Optional description
   * @param onProgress - Optional callback for upload progress
   */
  static async uploadClientDocument(
    file: File,
    clientId: string,
    tenantId: string,
    userId: string,
    userName: string,
    category?: ClientDocument['category'],
    description?: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<ClientDocument> {
    try {
      // Create a unique file path
      const timestamp = Date.now()
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const storagePath = `tenants/${tenantId}/clients/${clientId}/documents/${timestamp}_${sanitizedFileName}`

      // Create storage reference
      const storageRef = ref(storage, storagePath)

      // Upload file with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file)

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress: UploadProgress = {
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
              state: snapshot.state as UploadProgress['state']
            }
            onProgress?.(progress)
          },
          (error) => {
            console.error('Upload error:', error)
            reject(error)
          },
          async () => {
            try {
              // Get download URL
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)

              // Save metadata to Firestore
              const now = new Date().toISOString()
              const docData: Omit<ClientDocument, 'id'> = {
                clientId,
                tenantId,
                name: sanitizedFileName,
                originalName: file.name,
                size: file.size,
                type: file.type,
                category: category || 'other',
                storagePath,
                downloadURL,
                uploadedBy: userId,
                uploadedByName: userName,
                createdAt: now,
                updatedAt: now,
                description,
                tags: []
              }

              const docRef = await addDoc(
                collection(db, this.COLLECTION),
                docData
              )

              const document: ClientDocument = {
                ...docData,
                id: docRef.id
              }

              resolve(document)
            } catch (error) {
              console.error('Error saving document metadata:', error)
              reject(error)
            }
          }
        )
      })
    } catch (error) {
      console.error('Error uploading document:', error)
      throw error
    }
  }

  /**
   * Get all documents for a client
   */
  static async getClientDocuments(
    clientId: string,
    tenantId: string
  ): Promise<ClientDocument[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('clientId', '==', clientId),
        where('tenantId', '==', tenantId)
      )

      const snapshot = await getDocs(q)
      const documents = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      } as ClientDocument))

      // Sort by creation date (newest first)
      return documents.sort((a, b) => {
        const aTime = new Date(a.createdAt).getTime()
        const bTime = new Date(b.createdAt).getTime()
        return bTime - aTime
      })
    } catch (error) {
      console.error('Error getting client documents:', error)
      throw error
    }
  }

  /**
   * Delete a document from both Storage and Firestore
   */
  static async deleteDocument(documentId: string): Promise<void> {
    try {
      // Get document metadata
      const docRef = doc(db, this.COLLECTION, documentId)
      const docSnap = await getDocs(
        query(collection(db, this.COLLECTION), where('__name__', '==', documentId))
      )

      if (docSnap.empty) {
        throw new Error('Document not found')
      }

      const document = docSnap.docs[0].data() as ClientDocument

      // Delete from Storage
      const storageRef = ref(storage, document.storagePath)
      await deleteObject(storageRef)

      // Delete from Firestore
      await deleteDoc(doc(db, this.COLLECTION, documentId))
    } catch (error) {
      console.error('Error deleting document:', error)
      throw error
    }
  }

  /**
   * Update document metadata
   */
  static async updateDocument(
    documentId: string,
    updates: Partial<Pick<ClientDocument, 'name' | 'category' | 'description' | 'tags'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COLLECTION, documentId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating document:', error)
      throw error
    }
  }

  /**
   * Get document by ID
   */
  static async getDocument(documentId: string): Promise<ClientDocument | null> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('__name__', '==', documentId)
      )
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        return null
      }

      const doc = snapshot.docs[0]
      return {
        ...doc.data(),
        id: doc.id
      } as ClientDocument
    } catch (error) {
      console.error('Error getting document:', error)
      throw error
    }
  }

  /**
   * Get total storage used by a client (in bytes)
   */
  static async getClientStorageSize(
    clientId: string,
    tenantId: string
  ): Promise<number> {
    try {
      const documents = await this.getClientDocuments(clientId, tenantId)
      return documents.reduce((total, doc) => total + doc.size, 0)
    } catch (error) {
      console.error('Error calculating storage size:', error)
      return 0
    }
  }

  /**
   * Format file size to human-readable format
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  /**
   * Get file icon based on MIME type
   */
  static getFileIcon(mimeType: string): string {
    if (mimeType.startsWith('image/')) return '🖼️'
    if (mimeType.startsWith('video/')) return '🎥'
    if (mimeType.startsWith('audio/')) return '🎵'
    if (mimeType.includes('pdf')) return '📄'
    if (mimeType.includes('word')) return '📝'
    if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return '📊'
    if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return '📽️'
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) return '📦'
    return '📁'
  }

  /**
   * Validate file before upload
   */
  static validateFile(
    file: File,
    maxSizeMB: number = 50,
    allowedTypes?: string[]
  ): { valid: boolean; error?: string } {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `File size exceeds ${maxSizeMB}MB limit`
      }
    }

    // Check file type if specified
    if (allowedTypes && allowedTypes.length > 0) {
      const fileType = file.type.toLowerCase()
      const isAllowed = allowedTypes.some(type =>
        fileType.includes(type.toLowerCase())
      )

      if (!isAllowed) {
        return {
          valid: false,
          error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
        }
      }
    }

    return { valid: true }
  }
}

export default StorageService
