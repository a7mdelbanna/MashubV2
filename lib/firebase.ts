import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  getFirestore,
  collection,
  CollectionReference,
  enableIndexedDbPersistence
} from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getFunctions } from 'firebase/functions'
import { getAnalytics, isSupported } from 'firebase/analytics'
import type {
  FirestoreProject,
  FirestoreApp,
  FirestoreClient,
  FirestorePricingCatalogItem,
  FirestoreFeatureAddon
} from './firebase-schema'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase (singleton pattern)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Initialize services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)

// Enable offline persistence (browser only)
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence failed: Multiple tabs open')
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence not available in this browser')
    }
  })
}

// Initialize Analytics (only in browser)
export const analytics = typeof window !== 'undefined'
  ? isSupported().then(yes => yes ? getAnalytics(app) : null)
  : null

// Secondary Firebase app for creating users without affecting current session
// This is used by SuperAdmin to create tenant users without being logged out
let secondaryApp: any = null
let secondaryAuth: any = null

export const getSecondaryAuth = () => {
  if (typeof window === 'undefined') return null

  if (!secondaryApp) {
    const existingApp = getApps().find(app => app.name === 'Secondary')
    if (existingApp) {
      secondaryApp = existingApp
    } else {
      secondaryApp = initializeApp(firebaseConfig, 'Secondary')
    }
    secondaryAuth = getAuth(secondaryApp)
  }

  return secondaryAuth
}

// ============================================================================
// COLLECTION REFERENCES WITH TYPESCRIPT TYPES
// ============================================================================

/**
 * Get typed collection reference for Projects
 */
export const getProjectsCollection = (tenantId: string) => {
  return collection(db, `tenants/${tenantId}/projects`) as CollectionReference<FirestoreProject>
}

/**
 * Get typed collection reference for Apps
 */
export const getAppsCollection = (tenantId: string) => {
  return collection(db, `tenants/${tenantId}/apps`) as CollectionReference<FirestoreApp>
}

/**
 * Get typed collection reference for Clients
 */
export const getClientsCollection = (tenantId: string) => {
  return collection(db, `tenants/${tenantId}/clients`) as CollectionReference<FirestoreClient>
}

/**
 * Get typed collection reference for Pricing Catalog
 */
export const getPricingCatalogCollection = (tenantId: string) => {
  return collection(db, `tenants/${tenantId}/pricingCatalog`) as CollectionReference<FirestorePricingCatalogItem>
}

/**
 * Get typed collection reference for Feature Addons
 */
export const getFeatureAddonsCollection = (tenantId: string) => {
  return collection(db, `tenants/${tenantId}/featureAddons`) as CollectionReference<FirestoreFeatureAddon>
}

/**
 * Get typed collection reference for Project Tasks (subcollection)
 */
export const getProjectTasksCollection = (tenantId: string, projectId: string) => {
  return collection(db, `tenants/${tenantId}/projects/${projectId}/tasks`)
}

/**
 * Get typed collection reference for Project Milestones (subcollection)
 */
export const getProjectMilestonesCollection = (tenantId: string, projectId: string) => {
  return collection(db, `tenants/${tenantId}/projects/${projectId}/milestones`)
}

/**
 * Get typed collection reference for Project Sprints (subcollection)
 */
export const getProjectSprintsCollection = (tenantId: string, projectId: string) => {
  return collection(db, `tenants/${tenantId}/projects/${projectId}/sprints`)
}

/**
 * Get typed collection reference for App Credentials (subcollection)
 */
export const getAppCredentialsCollection = (tenantId: string, appId: string) => {
  return collection(db, `tenants/${tenantId}/apps/${appId}/credentials`)
}

/**
 * Helper to get current user's tenant ID
 * This should be updated to get from auth context
 */
export const getCurrentTenantId = (): string => {
  // TODO: Get from auth context/token
  // For now, return a default or throw error
  if (typeof window === 'undefined') return ''

  const user = auth.currentUser
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Assuming tenantId is stored in custom claims
  // @ts-ignore
  return user.tenantId || ''
}

export default app