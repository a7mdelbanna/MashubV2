import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, connectAuthEmulator } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, connectStorageEmulator } from 'firebase/storage'
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

// Initialize services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)

// Initialize Analytics (only in browser)
export const analytics = typeof window !== 'undefined' ? isSupported().then(yes => yes ? getAnalytics(app) : null) : null

// Connect to emulators in development
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  const connectToEmulators = () => {
    if (!(auth as any)._isInitialized) {
      connectAuthEmulator(auth, 'http://localhost:9099')
    }
    if (!(db as any)._settings?.host?.includes('localhost')) {
      connectFirestoreEmulator(db, 'localhost', 8080)
    }
    if (!(storage as any)._host?.includes('localhost')) {
      connectStorageEmulator(storage, 'localhost', 9199)
    }
    if (!(functions as any)._delegate?._url?.includes('localhost')) {
      connectFunctionsEmulator(functions, 'localhost', 5001)
    }
  }

  // Only connect once
  if (!window.localStorage.getItem('firebase-emulators-connected')) {
    connectToEmulators()
    window.localStorage.setItem('firebase-emulators-connected', 'true')
  }
}

export default app