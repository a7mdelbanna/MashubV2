/**
 * Firebase Connection & CRUD Test Script
 *
 * Tests Firebase connectivity and CRUD operations for:
 * - Clients
 * - Projects
 * - Apps
 * - Relationships between entities
 * - Real-time subscriptions
 *
 * Usage:
 *   npm run test:firebase
 *
 * This script will:
 * 1. Test Firebase connection
 * 2. Create test data (client, project, app)
 * 3. Test queries and relationships
 * 4. Test updates
 * 5. Test real-time subscriptions
 * 6. Clean up test data
 */

// Load environment variables from .env.local FIRST
import { config } from 'dotenv'
import { resolve } from 'path'
config({ path: resolve(process.cwd(), '.env.local') })

import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  collection,
  onSnapshot,
  updateDoc,
  Timestamp
} from 'firebase/firestore'

// Initialize Firebase directly in this script
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// ============================================================================
// CONFIGURATION
// ============================================================================

const TENANT_ID = 'tenant_default'
const TEST_PREFIX = 'test_'

// Test IDs
const TEST_CLIENT_ID = `${TEST_PREFIX}client_${Date.now()}`
const TEST_PROJECT_ID = `${TEST_PREFIX}project_${Date.now()}`
const TEST_APP_ID = `${TEST_PREFIX}app_${Date.now()}`

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
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

// ============================================================================
// TEST FUNCTIONS
// ============================================================================

/**
 * Test 1: Firebase Connection
 */
async function testConnection() {
  header('Test 1: Firebase Connection')

  try {
    // Check if Firebase is configured
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      throw new Error('Firebase configuration missing')
    }
    success(`Firebase Project ID: ${firebaseConfig.projectId}`)

    // Try to access Firestore
    const testRef = doc(db, `tenants/${TENANT_ID}/test/connection`)
    await setDoc(testRef, { timestamp: new Date().toISOString() })
    await deleteDoc(testRef)

    success('Successfully connected to Firestore')
    success('Write and delete operations working')

    return true
  } catch (err: any) {
    error(`Connection failed: ${err.message}`)
    return false
  }
}

/**
 * Test 2: Create Client
 */
async function testCreateClient() {
  header('Test 2: Create Client')

  try {
    const clientData: FirestoreClient = {
      id: TEST_CLIENT_ID,
      tenantId: TENANT_ID,
      name: 'Test Client Corp',
      logo: 'TC',
      email: 'test@testclient.com',
      phone: '+1-555-0100',
      website: 'https://testclient.com',
      address: {
        street: '123 Test Street',
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

    // Verify client was created
    const client = await getClient(TENANT_ID, TEST_CLIENT_ID)
    if (!client) {
      throw new Error('Client not found after creation')
    }

    success(`Verified client exists: ${client.name}`)
    info(`  - Email: ${client.email}`)
    info(`  - Status: ${client.status}`)

    return true
  } catch (err: any) {
    error(`Failed to create client: ${err.message}`)
    return false
  }
}

/**
 * Test 3: Create Project
 */
async function testCreateProject() {
  header('Test 3: Create Project')

  try {
    const projectData: Partial<Project> = {
      name: 'Test E-Commerce Platform',
      slug: 'test-ecommerce-platform',
      description: 'A test project for e-commerce platform development',
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
      tags: ['ecommerce', 'test', 'web'],
      manager: {
        id: 'user_1',
        name: 'Test Manager'
      },
      health: {
        delivery: 'on_track',
        budget: 'on_budget',
        timing: 'on_time'
      }
    }

    const project = await ProjectsService.create(TENANT_ID, projectData as any)

    success(`Created project: ${project.id}`)
    info(`  - Name: ${project.name}`)
    info(`  - Status: ${project.status}`)
    info(`  - Progress: ${project.progress}%`)

    // Verify project was created
    const fetchedProject = await ProjectsService.getById(TENANT_ID, project.id)
    if (!fetchedProject) {
      throw new Error('Project not found after creation')
    }

    success(`Verified project exists and can be fetched`)

    // Store project ID for later tests
    (global as any).TEST_PROJECT_ID_ACTUAL = project.id

    return true
  } catch (err: any) {
    error(`Failed to create project: ${err.message}`)
    console.error(err)
    return false
  }
}

/**
 * Test 4: Create App (linking to Project and Client)
 */
async function testCreateApp() {
  header('Test 4: Create App')

  try {
    const projectId = (global as any).TEST_PROJECT_ID_ACTUAL || TEST_PROJECT_ID

    const appData: Partial<App> = {
      projectId: projectId,
      type: 'website',
      nameEn: 'Test Shop Website',
      nameAr: 'موقع متجر تجريبي',
      descriptionEn: 'Test e-commerce website',
      descriptionAr: 'موقع تجارة إلكترونية تجريبي',
      client: {
        id: TEST_CLIENT_ID,
        name: 'Test Client Corp',
        logo: 'TC'
      },
      branding: {
        primaryColor: '#3b82f6',
        secondaryColor: '#1e40af',
        accentColor: '#60a5fa',
        logo: 'TC'
      },
      environments: {
        dev: {
          url: 'https://dev.testshop.com',
          apiEndpoint: 'https://dev-api.testshop.com',
          version: '1.0.0-dev',
          lastDeployed: new Date().toISOString(),
          status: 'active'
        },
        production: {
          url: 'https://www.testshop.com',
          apiEndpoint: 'https://api.testshop.com',
          version: '1.0.0',
          lastDeployed: new Date().toISOString(),
          status: 'active'
        }
      },
      urls: {
        admin: 'https://admin.testshop.com',
        storefront: 'https://www.testshop.com',
        apiBase: 'https://api.testshop.com'
      },
      features: {
        enabled: ['shopping_cart', 'wishlist', 'reviews'],
        modules: ['products', 'orders', 'customers']
      },
      status: 'development'
    }

    const app = await AppsService.create(TENANT_ID, appData as any)

    success(`Created app: ${app.id}`)
    info(`  - Name: ${app.nameEn}`)
    info(`  - Type: ${app.type}`)
    info(`  - Client: ${app.client.name}`)
    info(`  - Project: ${app.projectId}`)

    // Store app ID for later tests
    (global as any).TEST_APP_ID_ACTUAL = app.id

    return true
  } catch (err: any) {
    error(`Failed to create app: ${err.message}`)
    console.error(err)
    return false
  }
}

/**
 * Test 5: Query Apps by Project
 */
async function testQueryAppsByProject() {
  header('Test 5: Query Apps by Project')

  try {
    const projectId = (global as any).TEST_PROJECT_ID_ACTUAL || TEST_PROJECT_ID

    const apps = await AppsService.listByProject(TENANT_ID, projectId)

    success(`Found ${apps.length} app(s) for project ${projectId}`)

    apps.forEach(app => {
      info(`  - ${app.nameEn} (${app.type})`)
    })

    if (apps.length === 0) {
      error('Expected at least 1 app, but found 0')
      return false
    }

    return true
  } catch (err: any) {
    error(`Failed to query apps by project: ${err.message}`)
    return false
  }
}

/**
 * Test 6: Query Apps by Client
 */
async function testQueryAppsByClient() {
  header('Test 6: Query Apps by Client')

  try {
    const apps = await AppsService.listByClient(TENANT_ID, TEST_CLIENT_ID)

    success(`Found ${apps.length} app(s) for client ${TEST_CLIENT_ID}`)

    apps.forEach(app => {
      info(`  - ${app.nameEn} (Project: ${app.projectId})`)
    })

    if (apps.length === 0) {
      error('Expected at least 1 app, but found 0')
      return false
    }

    return true
  } catch (err: any) {
    error(`Failed to query apps by client: ${err.message}`)
    return false
  }
}

/**
 * Test 7: Get Project with Populated Apps
 */
async function testGetProjectWithApps() {
  header('Test 7: Get Project with Populated Apps')

  try {
    const projectId = (global as any).TEST_PROJECT_ID_ACTUAL || TEST_PROJECT_ID

    const project = await ProjectsService.getById(TENANT_ID, projectId)

    if (!project) {
      throw new Error('Project not found')
    }

    success(`Retrieved project: ${project.name}`)
    success(`Project has ${project.apps.length} app(s) populated`)

    project.apps.forEach(app => {
      info(`  - ${app.nameEn} (Client: ${app.client.name})`)
    })

    if (project.apps.length === 0) {
      error('Expected apps to be populated, but array is empty')
      return false
    }

    return true
  } catch (err: any) {
    error(`Failed to get project with apps: ${err.message}`)
    return false
  }
}

/**
 * Test 8: Update Operations
 */
async function testUpdates() {
  header('Test 8: Update Operations')

  try {
    const projectId = (global as any).TEST_PROJECT_ID_ACTUAL || TEST_PROJECT_ID
    const appId = (global as any).TEST_APP_ID_ACTUAL || TEST_APP_ID

    // Update project
    const updatedProject = await ProjectsService.updateProgress(TENANT_ID, projectId, {
      progress: 50,
      tasksCompleted: 10
    })

    success(`Updated project progress to ${updatedProject.progress}%`)

    // Update app status
    const updatedApp = await AppsService.updateStatus(TENANT_ID, appId, 'staging')

    success(`Updated app status to ${updatedApp.status}`)

    // Update app branding
    const brandedApp = await AppsService.updateBranding(TENANT_ID, appId, {
      primaryColor: '#10b981'
    })

    success(`Updated app branding: ${brandedApp.branding.primaryColor}`)

    return true
  } catch (err: any) {
    error(`Failed to update entities: ${err.message}`)
    return false
  }
}

/**
 * Test 9: Real-time Subscription
 */
async function testRealTimeSubscription() {
  header('Test 9: Real-time Subscription')

  try {
    const projectId = (global as any).TEST_PROJECT_ID_ACTUAL || TEST_PROJECT_ID

    return new Promise<boolean>((resolve) => {
      let updateCount = 0

      info('Setting up real-time subscription...')

      const unsubscribe = ProjectsService.subscribe(TENANT_ID, projectId, (project) => {
        updateCount++

        if (updateCount === 1) {
          success(`Received initial project state: ${project?.name}`)

          // Trigger an update to test real-time
          setTimeout(async () => {
            info('Triggering update to test real-time sync...')
            await ProjectsService.updateProgress(TENANT_ID, projectId, {
              progress: 75
            })
          }, 1000)
        } else if (updateCount === 2) {
          success(`Received real-time update! Progress: ${project?.progress}%`)
          unsubscribe()
          resolve(true)
        }
      })

      // Timeout after 5 seconds
      setTimeout(() => {
        unsubscribe()
        if (updateCount < 2) {
          error('Real-time subscription test timed out')
          resolve(false)
        }
      }, 5000)
    })
  } catch (err: any) {
    error(`Failed real-time subscription test: ${err.message}`)
    return false
  }
}

/**
 * Test 10: Cleanup
 */
async function testCleanup() {
  header('Test 10: Cleanup Test Data')

  try {
    const projectId = (global as any).TEST_PROJECT_ID_ACTUAL || TEST_PROJECT_ID
    const appId = (global as any).TEST_APP_ID_ACTUAL || TEST_APP_ID

    // Delete app
    await AppsService.deletePermanently(TENANT_ID, appId)
    success(`Deleted app: ${appId}`)

    // Delete project
    await ProjectsService.deletePermanently(TENANT_ID, projectId)
    success(`Deleted project: ${projectId}`)

    // Delete client
    const clientRef = doc(db, `tenants/${TENANT_ID}/clients/${TEST_CLIENT_ID}`)
    await deleteDoc(clientRef)
    success(`Deleted client: ${TEST_CLIENT_ID}`)

    success('All test data cleaned up')

    return true
  } catch (err: any) {
    error(`Failed to cleanup test data: ${err.message}`)
    return false
  }
}

// ============================================================================
// MAIN TEST RUNNER
// ============================================================================

async function runTests() {
  console.log('\n')
  console.log(colors.cyan + '╔═══════════════════════════════════════════════════════════╗' + colors.reset)
  console.log(colors.cyan + '║                                                           ║' + colors.reset)
  console.log(colors.cyan + '║        Firebase Connection & CRUD Test Suite             ║' + colors.reset)
  console.log(colors.cyan + '║                                                           ║' + colors.reset)
  console.log(colors.cyan + '╚═══════════════════════════════════════════════════════════╝' + colors.reset)
  console.log('\n')

  const tests = [
    { name: 'Connection', fn: testConnection },
    { name: 'Create Client', fn: testCreateClient },
    { name: 'Create Project', fn: testCreateProject },
    { name: 'Create App', fn: testCreateApp },
    { name: 'Query Apps by Project', fn: testQueryAppsByProject },
    { name: 'Query Apps by Client', fn: testQueryAppsByClient },
    { name: 'Get Project with Apps', fn: testGetProjectWithApps },
    { name: 'Update Operations', fn: testUpdates },
    { name: 'Real-time Subscription', fn: testRealTimeSubscription },
    { name: 'Cleanup', fn: testCleanup }
  ]

  const results: { name: string; passed: boolean }[] = []

  for (const test of tests) {
    const passed = await test.fn()
    results.push({ name: test.name, passed })

    if (!passed) {
      console.log(`\n${colors.red}Test failed. Stopping test suite.${colors.reset}\n`)
      break
    }
  }

  // Print summary
  console.log('\n')
  console.log('='.repeat(60))
  header('Test Summary')

  const passedCount = results.filter(r => r.passed).length
  const totalCount = results.length

  results.forEach(result => {
    if (result.passed) {
      success(`${result.name}`)
    } else {
      error(`${result.name}`)
    }
  })

  console.log('\n')

  if (passedCount === totalCount) {
    console.log(colors.green + '╔═══════════════════════════════════════════════════════════╗' + colors.reset)
    console.log(colors.green + '║                                                           ║' + colors.reset)
    console.log(colors.green + '║                 ✓ ALL TESTS PASSED!                       ║' + colors.reset)
    console.log(colors.green + '║                                                           ║' + colors.reset)
    console.log(colors.green + `║             ${passedCount}/${totalCount} tests successful                          ║` + colors.reset)
    console.log(colors.green + '║                                                           ║' + colors.reset)
    console.log(colors.green + '╚═══════════════════════════════════════════════════════════╝' + colors.reset)
    console.log('\n')
    console.log(colors.cyan + '🎉 Your Firebase integration is working perfectly!' + colors.reset)
    console.log(colors.cyan + '✨ You can now start building your application!' + colors.reset)
    console.log('\n')
    process.exit(0)
  } else {
    console.log(colors.red + '╔═══════════════════════════════════════════════════════════╗' + colors.reset)
    console.log(colors.red + '║                                                           ║' + colors.reset)
    console.log(colors.red + '║                 ✗ SOME TESTS FAILED                       ║' + colors.reset)
    console.log(colors.red + '║                                                           ║' + colors.reset)
    console.log(colors.red + `║             ${passedCount}/${totalCount} tests passed                             ║` + colors.reset)
    console.log(colors.red + '║                                                           ║' + colors.reset)
    console.log(colors.red + '╚═══════════════════════════════════════════════════════════╝' + colors.reset)
    console.log('\n')
    process.exit(1)
  }
}

// Check environment variables
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error(colors.red + '\n❌ Error: Firebase configuration is missing!' + colors.reset)
  console.error('\nPlease set the following environment variables in .env.local:')
  console.error('  - NEXT_PUBLIC_FIREBASE_API_KEY')
  console.error('  - NEXT_PUBLIC_FIREBASE_PROJECT_ID')
  console.error('  - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN')
  console.error('  - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET')
  console.error('  - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID')
  console.error('  - NEXT_PUBLIC_FIREBASE_APP_ID')
  console.error('\n')
  process.exit(1)
}

// Run tests
runTests()
