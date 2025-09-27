'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { User, Tenant } from '@/types'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  tenant: Tenant | null
  firebaseUser: FirebaseUser | null
  loading: boolean
  signIn: (email: string, password: string, portal: string) => Promise<void>
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tenant, setTenant] = useState<Tenant | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setFirebaseUser(firebaseUser)
        await loadUserData(firebaseUser)
      } else {
        setUser(null)
        setTenant(null)
        setFirebaseUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const loadUserData = async (firebaseUser: FirebaseUser) => {
    try {
      // Get user document from Firestore
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))

      if (userDoc.exists()) {
        const userData = userDoc.data() as User
        setUser(userData)

        // Load tenant data if user has tenantId
        if (userData.tenantId) {
          const tenantDoc = await getDoc(doc(db, 'tenants', userData.tenantId))
          if (tenantDoc.exists()) {
            setTenant(tenantDoc.data() as Tenant)
          }
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      toast.error('Failed to load user data')
    }
  }

  const signIn = async (email: string, password: string, portal: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)

      // Verify portal access
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
      if (userDoc.exists()) {
        const userData = userDoc.data() as User

        // Check if user has access to the selected portal
        if (!userData.portalAccess?.includes(portal as any)) {
          await firebaseSignOut(auth)
          throw new Error(`You don't have access to the ${portal} portal`)
        }

        // Redirect based on portal
        switch (portal) {
          case 'superadmin':
            router.push('/superadmin')
            break
          case 'admin':
            router.push('/dashboard')
            break
          case 'employee':
            router.push('/employee')
            break
          case 'client':
            router.push('/client')
            break
          default:
            router.push('/dashboard')
        }
      }
    } catch (error: any) {
      console.error('Sign in error:', error)
      toast.error(error.message || 'Failed to sign in')
      throw error
    }
  }

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)

      // Create user document in Firestore
      const newUser: User = {
        id: userCredential.user.uid,
        email,
        name: userData.name || '',
        role: userData.role || 'employee',
        tenantId: userData.tenantId || '',
        department: userData.department,
        permissions: userData.permissions || [],
        portalAccess: userData.portalAccess || ['employee'],
        createdAt: new Date(),
        ...userData
      }

      await setDoc(doc(db, 'users', userCredential.user.uid), newUser)

      toast.success('Account created successfully!')
      router.push('/onboarding')
    } catch (error: any) {
      console.error('Sign up error:', error)
      toast.error(error.message || 'Failed to create account')
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setTenant(null)
      router.push('/')
      toast.success('Signed out successfully')
    } catch (error) {
      console.error('Sign out error:', error)
      toast.error('Failed to sign out')
    }
  }

  const refreshUser = async () => {
    if (firebaseUser) {
      await loadUserData(firebaseUser)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      tenant,
      firebaseUser,
      loading,
      signIn,
      signUp,
      signOut,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}