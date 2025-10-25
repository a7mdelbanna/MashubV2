# Firebase Setup & Testing Guide

Complete guide to set up Firebase and test the integration.

## Prerequisites

1. **Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Create a new project (or use existing)
   - Enable Firestore Database

2. **Install tsx** (if not already installed):
   ```bash
   npm install tsx --save-dev
   ```

## Step 1: Get Firebase Configuration

1. Go to Firebase Console → Project Settings
2. Under "Your apps", click the web app icon (`</>`)
3. Register your app
4. Copy the configuration object

## Step 2: Setup Environment Variables

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key-here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

Replace all values with your actual Firebase configuration.

## Step 3: Setup Firestore Indexes

### Option A: Manual Setup (Recommended First Time)

1. Go to Firebase Console → Firestore Database → Indexes
2. Create these composite indexes:

**Index 1: Apps by Project**
- Collection ID: `apps`
- Fields to index:
  - `tenantId` (Ascending)
  - `projectId` (Ascending)
  - `createdAt` (Descending)

**Index 2: Apps by Client**
- Collection ID: `apps`
- Fields to index:
  - `tenantId` (Ascending)
  - `client.id` (Ascending)
  - `status` (Ascending)

**Index 3: Projects by Status**
- Collection ID: `projects`
- Fields to index:
  - `tenantId` (Ascending)
  - `status` (Ascending)
  - `updatedAt` (Descending)

**Index 4: Pricing Catalog by Project**
- Collection ID: `pricingCatalog`
- Fields to index:
  - `tenantId` (Ascending)
  - `projectId` (Ascending)
  - `category` (Ascending)

### Option B: Using Firebase CLI

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firestore:
   ```bash
   firebase init firestore
   ```

4. Create `firestore.indexes.json`:
   ```json
   {
     "indexes": [
       {
         "collectionGroup": "apps",
         "queryScope": "COLLECTION",
         "fields": [
           { "fieldPath": "tenantId", "order": "ASCENDING" },
           { "fieldPath": "projectId", "order": "ASCENDING" },
           { "fieldPath": "createdAt", "order": "DESCENDING" }
         ]
       },
       {
         "collectionGroup": "apps",
         "queryScope": "COLLECTION",
         "fields": [
           { "fieldPath": "tenantId", "order": "ASCENDING" },
           { "fieldPath": "client.id", "order": "ASCENDING" },
           { "fieldPath": "status", "order": "ASCENDING" }
         ]
       },
       {
         "collectionGroup": "projects",
         "queryScope": "COLLECTION",
         "fields": [
           { "fieldPath": "tenantId", "order": "ASCENDING" },
           { "fieldPath": "status", "order": "ASCENDING" },
           { "fieldPath": "updatedAt", "order": "DESCENDING" }
         ]
       },
       {
         "collectionGroup": "pricingCatalog",
         "queryScope": "COLLECTION",
         "fields": [
           { "fieldPath": "tenantId", "order": "ASCENDING" },
           { "fieldPath": "projectId", "order": "ASCENDING" },
           { "fieldPath": "category", "order": "ASCENDING" }
         ]
       }
     ]
   }
   ```

5. Deploy indexes:
   ```bash
   firebase deploy --only firestore:indexes
   ```

**Note**: Indexes can take a few minutes to build. Wait until they show "Enabled" status.

## Step 4: Setup Security Rules (Optional for Testing)

For testing purposes, you can use permissive rules. In production, use proper authentication rules.

### Testing Rules (INSECURE - Use only for testing):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Production Rules (Secure):

See `FIREBASE_SCHEMA.md` for complete production security rules with authentication and permissions.

## Step 5: Run Connection Test

Now run the comprehensive test suite:

```bash
npm run test:firebase
```

This will test:
1. ✅ Firebase connection
2. ✅ Create a test client
3. ✅ Create a test project
4. ✅ Create a test app (linked to client and project)
5. ✅ Query apps by project
6. ✅ Query apps by client
7. ✅ Get project with populated apps array
8. ✅ Update operations (project progress, app status)
9. ✅ Real-time subscriptions
10. ✅ Cleanup (delete test data)

### Expected Output

```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║        Firebase Connection & CRUD Test Suite             ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

Test 1: Firebase Connection
============================================================
✓ Firebase Project ID: your-project-id
✓ Successfully connected to Firestore
✓ Write and delete operations working

Test 2: Create Client
============================================================
✓ Created client: test_client_1234567890
✓ Verified client exists: Test Client Corp
ℹ   - Email: test@testclient.com
ℹ   - Status: active

... (continues for all 10 tests)

╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║                 ✓ ALL TESTS PASSED!                       ║
║                                                           ║
║             10/10 tests successful                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

🎉 Your Firebase integration is working perfectly!
✨ You can now start building your application!
```

## Troubleshooting

### Error: "Missing required client property: client.id"

**Solution**: This error is from the test script. It means the app creation requires both projectId and client data. The test script should handle this automatically.

### Error: "The query requires an index"

**Solution**:
1. The error message will include a link to create the index
2. Click the link to auto-create the index in Firebase Console
3. Wait for the index to build (shows "Building..." → "Enabled")
4. Re-run the test

### Error: "Permission denied"

**Solution**:
1. Go to Firebase Console → Firestore Database → Rules
2. Temporarily use permissive rules for testing (see Step 4)
3. Remember to update to secure rules before production

### Error: "Firebase configuration missing"

**Solution**:
1. Verify `.env.local` exists in the root directory
2. Check all environment variables are set correctly
3. Restart the development server after adding env vars

## What's Next?

Once all tests pass:

1. ✅ Your Firebase integration is working perfectly
2. ✅ Projects, Apps, and Clients are connected correctly
3. ✅ Real-time updates are working
4. ✅ CRUD operations are functional

You can now:

- Start building your UI components
- Use the services in your pages:
  ```typescript
  import { ProjectsService } from '@/services/projects.service'
  import { AppsService } from '@/services/apps.service'

  // In your components
  const projects = await ProjectsService.list(tenantId)
  const apps = await AppsService.listByClient(tenantId, clientId)
  ```

- Implement authentication
- Add more entities (team members, tasks, etc.)
- Build dashboards and analytics

## Files Reference

- `lib/firebase.ts` - Firebase initialization
- `lib/firebase-schema.ts` - TypeScript interfaces
- `lib/firebase-queries.ts` - Query functions
- `lib/firebase-converters.ts` - Data converters
- `services/projects.service.ts` - Projects CRUD
- `services/apps.service.ts` - Apps CRUD
- `FIREBASE_SCHEMA.md` - Complete schema documentation
- `ENTITY_RELATIONSHIPS_DOCUMENTATION.md` - Relationship model

## Support

For detailed schema documentation, see:
- `FIREBASE_SCHEMA.md` - Database structure
- `ENTITY_RELATIONSHIPS_DOCUMENTATION.md` - How entities relate
