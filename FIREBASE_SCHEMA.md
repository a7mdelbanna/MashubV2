# MasHub Firebase/Firestore Schema Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture Principles](#architecture-principles)
3. [Collection Structure](#collection-structure)
4. [Entity Relationships](#entity-relationships)
5. [Required Indexes](#required-indexes)
6. [Security Rules](#security-rules)
7. [Data Flow Patterns](#data-flow-patterns)
8. [Migration Guide](#migration-guide)

---

## Overview

MasHub uses Firebase Firestore as its primary database. This document outlines the complete database schema, indexing strategy, and security rules.

### Key Design Decisions

- **Multi-tenancy**: All business data scoped under `/tenants/{tenantId}`
- **Query-based relationships**: No embedded arrays in Firestore (populated on frontend)
- **Denormalized counts**: Store aggregates (e.g., `tasksTotal`, `appsUsing`) for performance
- **Subcollections**: Use for one-to-many relationships (e.g., project tasks, app credentials)

---

## Architecture Principles

### 1. Query-Based Relationships vs Embedded Arrays

**❌ Don't Store in Firestore:**
```typescript
// BAD: Embedded apps array
{
  id: "proj-1",
  name: "Retail Suite",
  apps: [
    { id: "app-1", name: "POS", ...fullAppObject },
    { id: "app-2", name: "Shop", ...fullAppObject }
  ]
}
```

**✅ Do Store in Firestore:**
```typescript
// GOOD: Projects without embedded arrays
/tenants/tenant-1/projects/proj-1
{
  id: "proj-1",
  name: "Retail Suite",
  tasksTotal: 156,
  // NO apps array
}

// Apps reference their project
/tenants/tenant-1/apps/app-1
{
  id: "app-1",
  projectId: "proj-1",  // ← Reference
  name: "POS",
  ...
}
```

**Frontend Population:**
```typescript
// When fetching a project, populate apps array
const project = await getProject('proj-1')
// Returns Project with apps: App[] populated via query
```

### 2. Multi-Tenancy Pattern

All business entities live under tenant subcollections:

```
/tenants/{tenantId}/projects/{projectId}
/tenants/{tenantId}/apps/{appId}
/tenants/{tenantId}/clients/{clientId}
```

This enables:
- Tenant isolation
- Easy data export/deletion per tenant
- Simplified security rules

### 3. Denormalized Data for Performance

Store computed values to avoid expensive queries:

```typescript
{
  tasksTotal: 156,          // Updated via Cloud Function
  tasksCompleted: 59,       // Updated via Cloud Function
  completionPercentage: 38  // Calculated and stored
}
```

---

## Collection Structure

### Root Level

```
/
├── tenants/                    # Company/tenant data
│   └── {tenantId}/
│       ├── projects/           # Projects collection
│       ├── apps/               # Apps collection
│       ├── clients/            # Clients collection
│       ├── pricingCatalog/     # Pricing packages
│       ├── featureAddons/      # Feature add-ons
│       └── checklistTemplates/ # Reusable checklists
│
└── users/                      # Global user accounts
    └── {userId}/
```

### Project Subcollections

```
/tenants/{tenantId}/projects/{projectId}/
├── tasks/              # Project tasks
├── sprints/            # Agile sprints
├── milestones/         # Project milestones
├── boards/             # Kanban boards
├── documents/          # Project files
├── timeEntries/        # Time tracking
├── team/               # Team members
├── timeline/           # Activity timeline
└── checklistInstances/ # Checklist instances
```

### App Subcollections

```
/tenants/{tenantId}/apps/{appId}/
├── releases/           # Release history
├── credentials/        # Secure credentials (encrypted)
└── environments/       # Environment configs
```

---

## Entity Relationships

### Core Relationship Model

```
┌──────────┐
│  CLIENT  │
└────┬─────┘
     │
     │ 1:M
     ▼
┌──────────┐         ┌──────────┐
│   APP    │ ◄─────► │ PROJECT  │
└──────────┘   M:1   └──────────┘
```

### Relationship Details

#### Project → Apps (One-to-Many)
```typescript
// Query pattern
const apps = await db
  .collection(`tenants/${tenantId}/apps`)
  .where('projectId', '==', projectId)
  .get()
```

#### App → Client (Many-to-One)
```typescript
// Stored in app document
{
  client: {
    id: "client-1",
    name: "TechCorp",
    logo: "TC"
  }
}
```

#### App → Project (Many-to-One)
```typescript
// Stored as reference
{
  projectId: "proj-1"
}
```

#### Client → Apps (One-to-Many)
```typescript
// Query pattern
const clientApps = await db
  .collection(`tenants/${tenantId}/apps`)
  .where('client.id', '==', clientId)
  .get()
```

#### Project → Clients (Derived via Apps)
```typescript
// Multi-step query
const apps = await getProjectApps(projectId)
const clientIds = [...new Set(apps.map(a => a.client.id))]
const clients = await Promise.all(
  clientIds.map(id => getClient(id))
)
```

---

## Required Indexes

### Creating Indexes

**Via Firebase Console:**
1. Go to Firestore → Indexes
2. Click "Create Index"
3. Add the fields below

**Via firebase.indexes.json:**
```json
{
  "indexes": [
    // See index definitions below
  ]
}
```

### Index Definitions

#### 1. Apps by Project
**Purpose**: Get all apps for a project, sorted by creation date
```javascript
Collection: apps
Fields:
  - tenantId (Ascending)
  - projectId (Ascending)
  - createdAt (Descending)
```

#### 2. Apps by Client
**Purpose**: Get all apps for a client, filtered by status
```javascript
Collection: apps
Fields:
  - tenantId (Ascending)
  - client.id (Ascending)
  - status (Ascending)
```

#### 3. Projects by Status
**Purpose**: List projects filtered by status, sorted by last update
```javascript
Collection: projects
Fields:
  - tenantId (Ascending)
  - status (Ascending)
  - updatedAt (Descending)
```

#### 4. Projects by Priority
**Purpose**: Get high-priority projects due soon
```javascript
Collection: projects
Fields:
  - tenantId (Ascending)
  - priority (Ascending)
  - dueDate (Ascending)
```

#### 5. Pricing Catalog by Project
**Purpose**: Get pricing packages for a project by category
```javascript
Collection: pricingCatalog
Fields:
  - tenantId (Ascending)
  - projectId (Ascending)
  - category (Ascending)
```

#### 6. Tasks by Project and Status
**Purpose**: Get project tasks filtered and sorted
```javascript
Collection: tasks (collection group)
Fields:
  - projectId (Ascending)
  - status (Ascending)
  - priority (Descending)
```

#### 7. Milestones by Project
**Purpose**: Get project milestones by status and due date
```javascript
Collection: milestones (collection group)
Fields:
  - projectId (Ascending)
  - status (Ascending)
  - dueDate (Ascending)
```

### firebase.indexes.json

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
      "collectionGroup": "projects",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "tenantId", "order": "ASCENDING" },
        { "fieldPath": "priority", "order": "ASCENDING" },
        { "fieldPath": "dueDate", "order": "ASCENDING" }
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
    },
    {
      "collectionGroup": "tasks",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "projectId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "priority", "order": "DESCENDING" }
      ]
    },
    {
      "collectionGroup": "milestones",
      "queryScope": "COLLECTION_GROUP",
      "fields": [
        { "fieldPath": "projectId", "order": "ASCENDING" },
        { "fieldPath": "status", "order": "ASCENDING" },
        { "fieldPath": "dueDate", "order": "ASCENDING" }
      ]
    }
  ]
}
```

---

## Security Rules

### firestore.rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ====================================
    // HELPER FUNCTIONS
    // ====================================

    function isAuthenticated() {
      return request.auth != null;
    }

    function isTenantMember(tenantId) {
      return isAuthenticated() &&
             request.auth.token.tenantId == tenantId;
    }

    function hasPermission(permission) {
      return isAuthenticated() &&
             permission in request.auth.token.permissions;
    }

    function isOwner(ownerId) {
      return isAuthenticated() &&
             request.auth.uid == ownerId;
    }

    // ====================================
    // USERS COLLECTION
    // ====================================

    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
    }

    // ====================================
    // TENANTS COLLECTION
    // ====================================

    match /tenants/{tenantId} {
      allow read: if isTenantMember(tenantId);
      allow write: if hasPermission('admin:tenants');

      // ====================================
      // PROJECTS SUBCOLLECTION
      // ====================================

      match /projects/{projectId} {
        allow read: if isTenantMember(tenantId);
        allow create: if hasPermission('create:projects');
        allow update: if hasPermission('update:projects') ||
                       isOwner(resource.data.ownerId);
        allow delete: if hasPermission('delete:projects');

        // Project subcollections (tasks, sprints, milestones, etc.)
        match /{subcollection}/{docId} {
          allow read: if isTenantMember(tenantId);
          allow write: if hasPermission('update:projects');
        }
      }

      // ====================================
      // APPS SUBCOLLECTION
      // ====================================

      match /apps/{appId} {
        allow read: if isTenantMember(tenantId);
        allow create: if hasPermission('create:apps');
        allow update: if hasPermission('update:apps');
        allow delete: if hasPermission('delete:apps');

        // App credentials - RESTRICTED
        match /credentials/{credId} {
          allow read: if hasPermission('read:credentials') ||
                       hasPermission('admin:apps');
          allow write: if hasPermission('admin:apps');
        }

        // App releases
        match /releases/{releaseId} {
          allow read: if isTenantMember(tenantId);
          allow write: if hasPermission('update:apps');
        }
      }

      // ====================================
      // CLIENTS SUBCOLLECTION
      // ====================================

      match /clients/{clientId} {
        allow read: if isTenantMember(tenantId);
        allow create: if hasPermission('create:clients');
        allow update: if hasPermission('update:clients');
        allow delete: if hasPermission('delete:clients');
      }

      // ====================================
      // PRICING CATALOG SUBCOLLECTION
      // ====================================

      match /pricingCatalog/{catalogId} {
        allow read: if isTenantMember(tenantId);
        allow write: if hasPermission('admin:pricing');
      }

      // ====================================
      // FEATURE ADDONS SUBCOLLECTION
      // ====================================

      match /featureAddons/{addonId} {
        allow read: if isTenantMember(tenantId);
        allow write: if hasPermission('admin:features');
      }

      // ====================================
      // CHECKLIST TEMPLATES SUBCOLLECTION
      // ====================================

      match /checklistTemplates/{templateId} {
        allow read: if isTenantMember(tenantId);
        allow write: if hasPermission('update:projects');
      }
    }
  }
}
```

### Permission System

Users have permissions stored in their auth token:

```typescript
{
  uid: "user-123",
  tenantId: "tenant-1",
  permissions: [
    "create:projects",
    "update:projects",
    "read:credentials",
    "create:apps",
    // ...
  ]
}
```

---

## Data Flow Patterns

### 1. Fetching a Project (with populated arrays)

```typescript
async function getProject(projectId: string): Promise<Project> {
  // 1. Get project document
  const projectDoc = await db
    .doc(`tenants/${tenantId}/projects/${projectId}`)
    .get()

  const project = projectDoc.data() as FirestoreProject

  // 2. Query and populate apps array
  const appsSnapshot = await db
    .collection(`tenants/${tenantId}/apps`)
    .where('projectId', '==', projectId)
    .get()

  project.apps = appsSnapshot.docs.map(doc => doc.data() as App)

  // 3. Query and populate pricing catalog
  const catalogSnapshot = await db
    .collection(`tenants/${tenantId}/pricingCatalog`)
    .where('projectId', '==', projectId)
    .get()

  project.pricingCatalog = catalogSnapshot.docs.map(doc => doc.data())

  // 4. Return populated project
  return project as Project
}
```

### 2. Creating a New App

```typescript
async function createApp(appData: Partial<App>): Promise<string> {
  // 1. Create app document
  const appRef = await db
    .collection(`tenants/${tenantId}/apps`)
    .add({
      ...appData,
      tenantId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })

  // 2. Update project's appsCount (via Cloud Function or client)
  await db
    .doc(`tenants/${tenantId}/projects/${appData.projectId}`)
    .update({
      // Counts can be updated via Cloud Function
    })

  return appRef.id
}
```

### 3. Getting All Clients for a Project

```typescript
async function getProjectClients(projectId: string): Promise<Client[]> {
  // 1. Get all apps for the project
  const appsSnapshot = await db
    .collection(`tenants/${tenantId}/apps`)
    .where('projectId', '==', projectId)
    .get()

  // 2. Extract unique client IDs
  const clientIds = [
    ...new Set(appsSnapshot.docs.map(doc => doc.data().client.id))
  ]

  // 3. Fetch client documents
  const clientDocs = await Promise.all(
    clientIds.map(id =>
      db.doc(`tenants/${tenantId}/clients/${id}`).get()
    )
  )

  return clientDocs
    .filter(doc => doc.exists)
    .map(doc => ({ id: doc.id, ...doc.data() } as Client))
}
```

### 4. Real-time Updates

```typescript
function subscribeToProject(
  projectId: string,
  callback: (project: Project) => void
) {
  // Subscribe to project document
  const unsubProject = db
    .doc(`tenants/${tenantId}/projects/${projectId}`)
    .onSnapshot(async (snapshot) => {
      const project = snapshot.data()

      // Populate apps array
      const apps = await getProjectApps(projectId)
      project.apps = apps

      callback(project as Project)
    })

  // Subscribe to apps collection
  const unsubApps = db
    .collection(`tenants/${tenantId}/apps`)
    .where('projectId', '==', projectId)
    .onSnapshot(() => {
      // Trigger project refetch when apps change
      // Or update apps array directly
    })

  // Return cleanup function
  return () => {
    unsubProject()
    unsubApps()
  }
}
```

---

## Migration Guide

### Step 1: Prepare Mock Data

Convert mock data from Date objects to ISO strings:

```typescript
// Before
const project = {
  startDate: new Date('2024-01-01'),
  createdAt: new Date()
}

// After
const project = {
  startDate: '2024-01-01T00:00:00Z',
  createdAt: new Date().toISOString()
}
```

### Step 2: Run Migration Script

```bash
npm run migrate:mock-to-firebase
```

This will:
1. Read MOCK_PROJECTS from lib/mock-project-data.ts
2. For each project:
   - Extract apps array → create separate app documents
   - Remove embedded arrays from project
   - Upload to Firestore
3. Verify relationships are correct

### Step 3: Update Components

Components already expect populated arrays, so no changes needed:

```typescript
// This still works!
const project = await getProject('proj-1')
project.apps.map(app => ...)  // ✓ Apps populated via query
```

### Step 4: Enable Real-time Updates

```typescript
// Replace static data with real-time subscriptions
useEffect(() => {
  const unsubscribe = subscribeToProject(projectId, (project) => {
    setProject(project)
  })

  return () => unsubscribe()
}, [projectId])
```

---

## Performance Considerations

### 1. Denormalize Counts

Store aggregates instead of counting:
```typescript
{
  appsUsing: 5,  // Updated via Cloud Function
  tasksTotal: 156 // Updated via Cloud Function
}
```

### 2. Use Collection Group Queries

For cross-project queries:
```typescript
// Get all tasks across all projects
db.collectionGroup('tasks')
  .where('assigneeId', '==', userId)
  .get()
```

### 3. Batch Reads

Fetch related data in parallel:
```typescript
const [project, apps, pricing] = await Promise.all([
  getProject(id),
  getProjectApps(id),
  getPricingCatalog(id)
])
```

### 4. Cache Strategy

- Use Firestore offline persistence
- Cache commonly accessed data in React context
- Use SWR or React Query for automatic caching

---

## Summary

This schema provides:
- ✅ Clean separation of concerns
- ✅ Scalable multi-tenant architecture
- ✅ Query-based relationships (no embedded arrays)
- ✅ Proper security via rules
- ✅ Performance via denormalization and indexes
- ✅ Real-time capabilities
- ✅ Easy migration from mock data

For implementation details, see:
- `lib/firebase-schema.ts` - TypeScript interfaces
- `lib/firebase-converters.ts` - Data conversion utilities
- `lib/firebase-queries.ts` - Common query patterns
- `services/projects.service.ts` - Project CRUD operations
- `services/apps.service.ts` - App CRUD operations
