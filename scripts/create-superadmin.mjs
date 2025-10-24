import { config } from 'dotenv'
import { resolve } from 'path'
import { initializeApp } from 'firebase/app'
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { getFirestore, doc, setDoc, Timestamp } from 'firebase/firestore'

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') })

// Firebase config from environment
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

async function createSuperAdmin() {
  const email = 'superadmin@mas.com'
  const password = '00000000'
  const name = 'Super Administrator'

  console.log('🚀 Creating SuperAdmin account...')
  console.log('📧 Email:', email)

  try {
    // Create Firebase Auth user
    console.log('\n1️⃣ Creating authentication user...')
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const uid = userCredential.user.uid

    console.log('✅ Auth user created!')
    console.log('🆔 UID:', uid)

    // Create Firestore user document
    console.log('\n2️⃣ Creating Firestore user document...')
    await setDoc(doc(db, 'users', uid), {
      id: uid,
      email: email,
      name: name,
      role: 'superadmin',
      tenantId: null,
      isSuperAdmin: true,
      portalAccess: ['superadmin'],
      permissions: ['all.read', 'all.write'],
      department: 'System',
      status: 'active',
      avatar: null,
      phone: null,
      createdAt: Timestamp.now(),
      lastLogin: null
    })

    console.log('✅ Firestore document created!')

    console.log('\n🎉 SUCCESS! SuperAdmin account created successfully!')
    console.log('\n📋 Login Credentials:')
    console.log('   Email:', email)
    console.log('   Password:', password)
    console.log('   Portal: SuperAdmin')
    console.log('\n🌐 Login at: http://localhost:3009/login')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ ERROR creating SuperAdmin:')
    console.error(error.message)

    if (error.code === 'auth/email-already-in-use') {
      console.log('\n💡 This email is already registered. Try:')
      console.log('   1. Use a different email, or')
      console.log('   2. Delete the existing user from Firebase Console')
    }

    process.exit(1)
  }
}

createSuperAdmin()
