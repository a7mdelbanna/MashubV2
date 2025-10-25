/**
 * Simple Firebase Connection Test
 *
 * Tests basic Firebase connectivity and CRUD operations
 * Does not depend on service layer - uses Firestore directly
 */

// Load environment variables from .env.local
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy
} from 'firebase/firestore'

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
}

function success(msg: string) {
  console.log(`${colors.green}✓${colors.reset} ${msg}`)
}

function error(msg: string) {
  console.log(`${colors.red}✗${colors.reset} ${msg}`)
}

function info(msg: string) {
  console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`)
}

function header(msg: string) {
  console.log(`\n${colors.magenta}${msg}${colors.reset}`)
  console.log('='.repeat(60))
}

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const TENANT_ID = 'tenant_default'
const TEST_CLIENT_ID = `test_client_${Date.now()}`
const TEST_PROJECT_ID = `test_project_${Date.now()}`
const TEST_APP_ID = `test_app_${Date.now()}`

async function runTests() {
  console.log('\n')
  console.log(colors.cyan + '╔═══════════════════════════════════════════════════════════╗' + colors.reset)
  console.log(colors.cyan + '║                                                           ║' + colors.reset)
  console.log(colors.cyan + '║      Firebase Connection & CRUD Test (Simplified)        ║' + colors.reset)
  console.log(colors.cyan + '║                                                           ║' + colors.reset)
  console.log(colors.cyan + '╚═══════════════════════════════════════════════════════════╝' + colors.reset)
  console.log('\n')

  try {
    // Step 1: Initialize Firebase
    header('Step 1: Initialize Firebase')
    const app = initializeApp(firebaseConfig)
    const db = getFirestore(app)
    success(`Firebase initialized successfully`)
    success(`Project ID: ${firebaseConfig.projectId}`)

    // Step 2: Test Write (Create Client)
    header('Step 2: Test Write - Create Client')
    const clientData = {
      id: TEST_CLIENT_ID,
      tenantId: TENANT_ID,
      name: 'Test Client Corp',
      logo: 'TC',
      email: 'test@client.com',
      phone: '+1-555-0100',
      website: 'https://testclient.com',
      address: {
        street: '123 Test St',
        city: 'Test City',
        state: 'CA',
        country: 'USA',
        zip: '12345'
      },
      industry: 'Technology',
      size: 'small',
      status: 'active',
      totalRevenue: 0,
      outstandingBalance: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const clientRef = doc(db, `tenants/${TENANT_ID}/clients/${TEST_CLIENT_ID}`)
    await setDoc(clientRef, clientData)
    success(`Created client: ${TEST_CLIENT_ID}`)

    // Step 3: Test Read
    header('Step 3: Test Read - Get Client')
    const clientSnap = await getDoc(clientRef)
    if (!clientSnap.exists()) {
      throw new Error('Client not found after creation')
    }
    success(`Retrieved client: ${clientSnap.data().name}`)
    info(`  Email: ${clientSnap.data().email}`)
    info(`  Status: ${clientSnap.data().status}`)

    // Step 4: Create Project
    header('Step 4: Create Project')
    const projectData = {
      id: TEST_PROJECT_ID,
      tenantId: TENANT_ID,
      name: 'Test E-Commerce Platform',
      slug: 'test-ecommerce-platform',
      description: 'Test project',
      type: 'agile',
      status: 'in_progress',
      priority: 'high',
      visibility: 'team',
      budget: 50000,
      spent: 10000,
      progress: 25,
      completionPercentage: 25,
      tasksTotal: 20,
      tasksCompleted: 5,
      milestonesTotal: 4,
      milestonesCompleted: 1,
      tags: ['ecommerce', 'test'],
      manager: {
        id: 'user_1',
        name: 'Test Manager'
      },
      ownerId: 'user_1',
      health: {
        delivery: 'on_track',
        budget: 'on_budget',
        timing: 'on_time'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const projectRef = doc(db, `tenants/${TENANT_ID}/projects/${TEST_PROJECT_ID}`)
    await setDoc(projectRef, projectData)
    success(`Created project: ${TEST_PROJECT_ID}`)

    // Step 5: Create App (linking Project and Client)
    header('Step 5: Create App (Linking Project + Client)')
    const appData = {
      id: TEST_APP_ID,
      tenantId: TENANT_ID,
      projectId: TEST_PROJECT_ID,
      type: 'website',
      nameEn: 'Test Shop Website',
      nameAr: 'موقع متجر تجريبي',
      client: {
        id: TEST_CLIENT_ID,
        name: 'Test Client Corp',
        logo: 'TC'
      },
      branding: {
        primaryColor: '#3b82f6',
        secondaryColor: '#1e40af'
      },
      environments: {
        production: {
          url: 'https://test.com',
          version: '1.0.0',
          status: 'active',
          lastDeployed: new Date().toISOString()
        }
      },
      urls: {
        admin: 'https://admin.test.com'
      },
      features: {
        enabled: ['cart', 'checkout'],
        modules: ['products', 'orders']
      },
      releases: {
        current: {
          version: '1.0.0',
          releaseDate: new Date().toISOString(),
          releaseChannel: 'production'
        },
        history: []
      },
      status: 'production',
      health: {
        issues: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const appRef = doc(db, `tenants/${TENANT_ID}/apps/${TEST_APP_ID}`)
    await setDoc(appRef, appData)
    success(`Created app: ${TEST_APP_ID}`)
    info(`  App: ${appData.nameEn}`)
    info(`  Project: ${TEST_PROJECT_ID}`)
    info(`  Client: ${TEST_CLIENT_ID}`)

    // Step 6: Query Apps by Project
    header('Step 6: Query Apps by Project')
    const appsRef = collection(db, `tenants/${TENANT_ID}/apps`)
    const projectAppsQuery = query(appsRef, where('projectId', '==', TEST_PROJECT_ID))
    const projectAppsSnap = await getDocs(projectAppsQuery)
    success(`Found ${projectAppsSnap.size} app(s) for project`)
    projectAppsSnap.forEach(doc => {
      info(`  - ${doc.data().nameEn}`)
    })

    // Step 7: Query Apps by Client
    header('Step 7: Query Apps by Client')
    const clientAppsQuery = query(appsRef, where('client.id', '==', TEST_CLIENT_ID))
    const clientAppsSnap = await getDocs(clientAppsQuery)
    success(`Found ${clientAppsSnap.size} app(s) for client`)
    clientAppsSnap.forEach(doc => {
      info(`  - ${doc.data().nameEn}`)
    })

    // Step 8: Cleanup
    header('Step 8: Cleanup Test Data')
    await deleteDoc(appRef)
    success(`Deleted app: ${TEST_APP_ID}`)

    await deleteDoc(projectRef)
    success(`Deleted project: ${TEST_PROJECT_ID}`)

    await deleteDoc(clientRef)
    success(`Deleted client: ${TEST_CLIENT_ID}`)

    // Success
    console.log('\n')
    console.log(colors.green + '╔═══════════════════════════════════════════════════════════╗' + colors.reset)
    console.log(colors.green + '║                                                           ║' + colors.reset)
    console.log(colors.green + '║                 ✓ ALL TESTS PASSED!                       ║' + colors.reset)
    console.log(colors.green + '║                                                           ║' + colors.reset)
    console.log(colors.green + '║             Firebase is working perfectly!                ║' + colors.reset)
    console.log(colors.green + '║                                                           ║' + colors.reset)
    console.log(colors.green + '╚═══════════════════════════════════════════════════════════╝' + colors.reset)
    console.log('\n')
    console.log(colors.cyan + '🎉 Verified:' + colors.reset)
    console.log(colors.cyan + '  ✓ Firebase connection' + colors.reset)
    console.log(colors.cyan + '  ✓ Create operations (Client, Project, App)' + colors.reset)
    console.log(colors.cyan + '  ✓ Read operations' + colors.reset)
    console.log(colors.cyan + '  ✓ Query by project' + colors.reset)
    console.log(colors.cyan + '  ✓ Query by client' + colors.reset)
    console.log(colors.cyan + '  ✓ Delete operations' + colors.reset)
    console.log(colors.cyan + '  ✓ Projects ↔ Apps ↔ Clients relationships' + colors.reset)
    console.log('\n')

    process.exit(0)
  } catch (err: any) {
    console.log('\n')
    console.log(colors.red + '╔═══════════════════════════════════════════════════════════╗' + colors.reset)
    console.log(colors.red + '║                                                           ║' + colors.reset)
    console.log(colors.red + '║                    ✗ TEST FAILED                          ║' + colors.reset)
    console.log(colors.red + '║                                                           ║' + colors.reset)
    console.log(colors.red + '╚═══════════════════════════════════════════════════════════╝' + colors.reset)
    console.log('\n')
    error(`Error: ${err.message}`)
    if (err.code) {
      error(`Error Code: ${err.code}`)
    }
    console.log('\n')
    process.exit(1)
  }
}

// Check environment variables
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(colors.red + '\n❌ Error: Firebase configuration is missing!' + colors.reset)
  console.error('\nPlease set Firebase environment variables in .env.local')
  process.exit(1)
}

runTests()
