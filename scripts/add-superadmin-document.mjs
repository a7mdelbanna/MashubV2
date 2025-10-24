import { config } from 'dotenv'
import { resolve } from 'path'
import { initializeApp } from 'firebase/app'
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
const db = getFirestore(app)

async function addSuperAdminDocument() {
  // Get UID from command line argument
  const uid = process.argv[2]

  if (!uid) {
    console.error('❌ ERROR: Please provide the UID as an argument')
    console.log('Usage: node scripts/add-superadmin-document.mjs <UID>')
    process.exit(1)
  }

  const email = 'superadmin@mas.com'
  const name = 'Super Administrator'

  console.log('🚀 Creating SuperAdmin Firestore document...')
  console.log('📧 Email:', email)
  console.log('🆔 UID:', uid)

  try {
    // Create Firestore user document
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
    console.log('\n🎉 SUCCESS! SuperAdmin account is ready!')
    console.log('\n📋 Login Credentials:')
    console.log('   Email:', email)
    console.log('   Password: 00000000')
    console.log('   Portal: SuperAdmin')
    console.log('\n🌐 Login at: http://localhost:3009/login')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ ERROR creating Firestore document:')
    console.error(error.message)
    process.exit(1)
  }
}

addSuperAdminDocument()
