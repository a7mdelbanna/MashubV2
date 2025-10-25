# Firebase Migration Guide

This guide explains how to migrate your mock data to Firebase/Firestore.

## Prerequisites

1. **Firebase Project Setup**:
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Firestore Database
   - Get your Firebase configuration

2. **Environment Variables**:
   Create a `.env.local` file with your Firebase credentials:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```

3. **Install Dependencies**:
   ```bash
   npm install tsx --save-dev
   ```

## Migration Steps

### Step 1: Create Firestore Indexes

Before running the migration, create the required indexes in Firebase Console:

Go to **Firestore Database → Indexes** and create these composite indexes:

1. **Apps by Project**:
   - Collection: `apps` (Collection group)
   - Fields:
     - `tenantId` (Ascending)
     - `projectId` (Ascending)
     - `createdAt` (Descending)

2. **Apps by Client**:
   - Collection: `apps` (Collection group)
   - Fields:
     - `tenantId` (Ascending)
     - `client.id` (Ascending)
     - `status` (Ascending)

3. **Projects by Status**:
   - Collection: `projects` (Collection group)
   - Fields:
     - `tenantId` (Ascending)
     - `status` (Ascending)
     - `updatedAt` (Descending)

4. **Pricing Catalog by Project**:
   - Collection: `pricingCatalog` (Collection group)
   - Fields:
     - `tenantId` (Ascending)
     - `projectId` (Ascending)
     - `category` (Ascending)

**Or use the firebase.indexes.json file** (recommended):

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

Deploy indexes:
```bash
firebase deploy --only firestore:indexes
```

### Step 2: Setup Security Rules

Create or update `firestore.rules` with the security rules from `FIREBASE_SCHEMA.md`, then deploy:

```bash
firebase deploy --only firestore:rules
```

### Step 3: Run Migration Script

Execute the migration script:

```bash
npm run migrate:mock
```

The script will:
1. ✅ Migrate clients (5 documents)
2. ✅ Migrate projects (3 documents)
3. ✅ Migrate apps (3 documents)
4. ✅ Migrate pricing catalog (~10 items)
5. ✅ Migrate feature addons (~20 items)
6. ✅ Verify migration

**Expected Output**:
```
🚀 Starting Mock Data Migration to Firebase
============================================================
📦 Tenant ID: tenant_default
📊 Data Summary:
   - Clients: 5
   - Projects: 3
   - Apps: 3
   - Pricing Catalog Items: 10
   - Feature Addons: 20
============================================================

📋 Migrating Clients...
   Migrated 5/5 clients
✅ Migrated 5 clients

📋 Migrating Projects...
   Migrated 3/3 projects
✅ Migrated 3 projects

📋 Migrating Apps...
   Migrated 3/3 apps
✅ Migrated 3 apps

... (continues)

✅ Migration Complete!
```

### Step 4: Verify Data in Firebase Console

1. Go to Firebase Console → Firestore Database
2. Navigate to `tenants/tenant_default/`
3. Verify collections exist:
   - `clients` (5 documents)
   - `projects` (3 documents)
   - `apps` (3 documents)
   - `pricingCatalog` (10 documents)
   - `featureAddons` (20 documents)

### Step 5: Test Queries

Test the queries using the service layer:

```typescript
import { ProjectsService } from '@/services/projects.service'
import { AppsService } from '@/services/apps.service'

// Test getting a project with populated apps
const project = await ProjectsService.getById('tenant_default', 'proj_retail_suite')
console.log('Project:', project)
console.log('Apps:', project.apps) // Should be populated

// Test getting apps by client
const apps = await AppsService.listByClient('tenant_default', 'client_techcorp')
console.log('Client Apps:', apps)
```

## What Gets Migrated

### Data Structure

The migration converts mock data to Firestore format:

- **Projects**: Migrated WITHOUT embedded arrays (apps, pricingCatalog, etc.)
- **Apps**: Each app document contains projectId and client reference
- **Clients**: Basic client information
- **Pricing Catalog**: Linked to projects via projectId
- **Feature Addons**: Linked to projects via projectId

### Relationship Model

After migration, relationships work via queries:

```typescript
// Get project apps (query-based)
const apps = await getProjectApps(tenantId, projectId)

// Get client apps (query-based)
const clientApps = await getClientApps(tenantId, clientId)

// Get project with populated apps
const project = await getProject(tenantId, projectId)
// project.apps is populated via query
```

## Troubleshooting

### Error: "Missing environment variables"

**Solution**: Ensure `.env.local` exists with all required Firebase config variables.

### Error: "Index required"

**Solution**: Create the missing index in Firebase Console or deploy via `firebase.indexes.json`.

### Error: "Permission denied"

**Solution**: Update Firestore security rules to allow writes during migration, then restrict later.

### Migration runs but data not visible

**Solution**:
1. Check Firebase Console for errors
2. Verify tenantId matches (`tenant_default`)
3. Check browser console for authentication issues

## Rolling Back

If you need to reset and re-run migration:

1. **Delete Collections** in Firebase Console:
   - Go to each collection under `tenants/tenant_default/`
   - Delete all documents

2. **Re-run Migration**:
   ```bash
   npm run migrate:mock
   ```

## Next Steps

After successful migration:

1. ✅ Update app components to use Firebase services instead of mock data
2. ✅ Implement authentication flow
3. ✅ Add real-time subscriptions where needed
4. ✅ Test CRUD operations
5. ✅ Set up proper security rules for production

## Support

For issues or questions:
- See `FIREBASE_SCHEMA.md` for schema documentation
- See `ENTITY_RELATIONSHIPS_DOCUMENTATION.md` for relationship model
- Check Firebase Console for detailed error logs
