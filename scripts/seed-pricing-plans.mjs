import { config } from 'dotenv'
import { resolve } from 'path'
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { pricingService } from '../lib/services/pricing-service.ts'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

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

async function seedPricingPlans() {
  console.log('🌱 Seeding default pricing plans...')

  try {
    // Use the SuperAdmin UID
    const superAdminUid = 'bxnyXTp0hLaGoeg7gpqWyEkYGAU2'

    await pricingService.seedDefaultPlans(superAdminUid)

    console.log('✅ Pricing plans seeded successfully!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding pricing plans:', error.message)
    process.exit(1)
  }
}

seedPricingPlans()
