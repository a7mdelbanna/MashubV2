# Agile System Analysis & Firebase Migration Plan

**Analysis Date:** 2025-10-26
**Status:** 🔍 COMPREHENSIVE REVIEW

---

## 🎯 Current State Analysis

### Existing Agile Components

#### 1. **Type Definitions** ✅ (types/index.ts)
```typescript
✅ Task - Line 484
✅ Epic - Line 528
✅ Story - Line 544
✅ Sprint - Line 565
❌ Milestone - MISSING (only counters in Project type)
```

#### 2. **Old Service** (lib/services/projects-service.ts)
**Architecture:** ❌ Flat collections (NOT multi-tenant)
```typescript
Collections:
- projects
- project_tasks
- sprints
- project_milestones
- time_entries
- task_comments
- project_team_members
- project_boards
- project_documents
- project_timeline
```

**Problem:** These are NOT using the multi-tenant structure!

#### 3. **New Architecture** (Should Be)
```typescript
✅ tenants/{tenantId}/projects/{projectId}
✅ tenants/{tenantId}/projects/{projectId}/tasks/{taskId}
✅ tenants/{tenantId}/projects/{projectId}/sprints/{sprintId}
✅ tenants/{tenantId}/projects/{projectId}/milestones/{milestoneId}
```

---

## 🔗 Agile System Relationships

### Entity Relationship Diagram

```
Tenant
  └── Projects
      ├── Tasks (subcollection)
      │   ├── scope: 'project' | 'app'
      │   ├── appId?: string (if scope='app')
      │   ├── epicId?: string
      │   ├── storyId?: string
      │   └── sprintId?: string
      │
      ├── Sprints (subcollection)
      │   ├── stories: Story[]
      │   ├── tasks: Task[]
      │   └── velocity metrics
      │
      ├── Milestones (subcollection) ❌ MISSING TYPE
      │   └── Need to define interface
      │
      ├── Epics (where?)
      │   ├── Option 1: Subcollection
      │   └── Option 2: Top-level with projectId
      │
      └── Stories (where?)
          ├── Option 1: Subcollection
          └── Option 2: Part of Sprint/Epic
```

### Relationship Mapping

#### **Tasks** ↔ **Projects/Apps**
```typescript
// Task interface (Line 484)
interface Task {
  projectId: string          // ✅ Links to project
  scope: 'project' | 'app'   // ✅ Defines scope
  appId?: string             // ✅ Optional app link
  appName?: string           // ✅ Denormalized

  // Agile hierarchy
  epicId?: string
  storyId?: string
  sprintId?: string
}
```

**Connection Flow:**
1. Tasks belong to a Project (required)
2. Tasks can be scoped to:
   - **Project-level**: General project tasks
   - **App-level**: Specific to an app (appId required)
3. Apps are linked to Projects (via projectId)
4. Apps are linked to Clients (via client.id)

**Query Patterns:**
```typescript
// Get all project tasks
Query: tasks WHERE projectId == {projectId}

// Get app-specific tasks
Query: tasks WHERE projectId == {projectId} AND scope == 'app' AND appId == {appId}

// Get sprint tasks
Query: tasks WHERE projectId == {projectId} AND sprintId == {sprintId}
```

#### **Sprints** ↔ **Projects**
```typescript
// Sprint interface (Line 565)
interface Sprint {
  projectId: string          // ✅ Links to project
  stories: Story[]           // ❓ How are these stored?
  tasks: Task[]              // ❓ Embedded or queried?
}
```

**Storage Decision Needed:**
- **Option A**: Embed story/task IDs, query separately
- **Option B**: Fully embedded (document size limits?)
- **Recommended**: IDs only, query separately

#### **Epics** ↔ **Stories** ↔ **Tasks**
```typescript
// Epic (Line 528)
interface Epic {
  projectId: string
  stories: Story[]           // ❓ Storage decision needed
}

// Story (Line 544)
interface Story {
  projectId: string
  epicId?: string            // ✅ Links to epic
  scope: 'project' | 'app'   // ✅ Can be app-scoped
  appId?: string             // ✅ Links to app
  tasks: Task[]              // ❓ Storage decision needed
}
```

**Hierarchy:**
```
Epic (Feature)
  └── Stories (User Stories)
      └── Tasks (Subtasks)
```

---

## ❌ Missing Components

### 1. **Milestone Interface**
Currently only has counters in Project:
```typescript
// Project type (Line 400)
milestonesTotal: number
milestonesCompleted: number
```

**Need to Define:**
```typescript
interface Milestone {
  id: string
  projectId: string
  name: string
  description?: string
  dueDate: Date
  status: 'upcoming' | 'in_progress' | 'completed' | 'overdue'
  deliverables: string[]
  progress: number // 0-100
  tasksLinked?: string[] // Task IDs
  createdAt: Date
  updatedAt: Date
}
```

### 2. **Firestore Interfaces**
Missing in `firebase-schema.ts`:
```typescript
❌ FirestoreTask
❌ FirestoreSprint
❌ FirestoreMilestone
❌ FirestoreEpic
❌ FirestoreStory
❌ FirestoreTimeEntry
❌ FirestoreComment
```

### 3. **Firebase Services**
Need to create:
```typescript
❌ services/tasks.service.ts
❌ services/sprints.service.ts
❌ services/milestones.service.ts
❌ services/epics.service.ts (optional)
```

### 4. **Pages**
Currently NO agile pages exist!
```
❌ /dashboard/projects/[id]/tasks
❌ /dashboard/projects/[id]/sprints
❌ /dashboard/projects/[id]/milestones
❌ /dashboard/projects/[id]/board (Kanban)
❌ /dashboard/projects/[id]/backlog
```

---

## 🔧 Architecture Decisions

### 1. **Collection Structure**

**Decision:** Use subcollections under projects
```
✅ tenants/{tenantId}/projects/{projectId}/tasks/{taskId}
✅ tenants/{tenantId}/projects/{projectId}/sprints/{sprintId}
✅ tenants/{tenantId}/projects/{projectId}/milestones/{milestoneId}
✅ tenants/{tenantId}/projects/{projectId}/epics/{epicId}
```

**Rationale:**
- Tasks/Sprints/Milestones are ALWAYS tied to a project
- Better data organization
- Easier to manage permissions
- Cleaner queries

### 2. **Epic & Story Storage**

**Option A: Epics as Subcollection**
```
tenants/{tenantId}/projects/{projectId}/epics/{epicId}
  └── Stories embedded or queried separately
```

**Option B: Epics as Top-Level**
```
tenants/{tenantId}/epics/{epicId}
  - projectId: string
```

**Recommendation:** **Option A** (Subcollection)
- Epics are project-specific
- Consistent with other agile entities
- Easier cleanup when project is deleted

### 3. **Story Storage**

**Option A: Stories as Subcollection**
```
tenants/{tenantId}/projects/{projectId}/stories/{storyId}
```

**Option B: Stories inside Epics**
```
tenants/{tenantId}/projects/{projectId}/epics/{epicId}/stories/{storyId}
```

**Option C: Stories embedded in Sprint**
```
// Sprint document
{
  stories: [
    { id, title, ... }
  ]
}
```

**Recommendation:** **Option A** (Project Subcollection)
- Stories can exist without epics
- Stories can move between epics/sprints
- Easier to query and update

### 4. **Task-Sprint Relationship**

**Current Issue:**
```typescript
// Task has sprintId
interface Task {
  sprintId?: string
}

// Sprint has tasks array
interface Sprint {
  tasks: Task[]
}
```

**Problem:** Bi-directional embedding causes sync issues

**Solution:** Use query-based relationship
```typescript
// Sprint stores IDs only
interface Sprint {
  taskIds: string[]  // Or query by sprintId
}

// Query sprint tasks
Query: tasks WHERE sprintId == {sprintId}
```

---

## 🚀 Implementation Plan

### Phase 1: Define Missing Types ✅
1. Add Milestone interface
2. Add Firestore interfaces for all agile entities
3. Update firebase-schema.ts documentation

### Phase 2: Create Firebase Services
1. **TasksService**
   - CRUD operations
   - Query by project, app, sprint, epic, story
   - Real-time subscriptions

2. **SprintsService**
   - CRUD operations
   - Sprint planning (add/remove tasks)
   - Velocity calculations
   - Burndown tracking

3. **MilestonesService**
   - CRUD operations
   - Progress tracking
   - Real-time updates

4. **EpicsService** (Optional)
   - CRUD operations
   - Story management

### Phase 3: Create UI Pages
1. Tasks Board (Kanban)
2. Sprint Planning
3. Backlog Management
4. Milestones Timeline
5. Epic Roadmap

### Phase 4: Migrate from Old Service
1. Update project detail page
2. Remove old flat collections
3. Migrate existing data (if any)

---

## 📊 Firebase Schema Summary

### Final Structure
```
tenants/
  └── {tenantId}/
      ├── projects/
      │   └── {projectId}/
      │       ├── tasks/
      │       │   └── {taskId}
      │       │       - projectId
      │       │       - scope ('project' | 'app')
      │       │       - appId?
      │       │       - sprintId?
      │       │       - epicId?
      │       │       - storyId?
      │       │
      │       ├── sprints/
      │       │   └── {sprintId}
      │       │       - projectId
      │       │       - taskIds[] or query
      │       │       - storyIds[] or query
      │       │
      │       ├── milestones/
      │       │   └── {milestoneId}
      │       │       - projectId
      │       │       - deliverables[]
      │       │
      │       ├── epics/
      │       │   └── {epicId}
      │       │       - projectId
      │       │       - storyIds[] or query
      │       │
      │       └── stories/
      │           └── {storyId}
      │               - projectId
      │               - epicId?
      │               - scope ('project' | 'app')
      │               - appId?
      │               - taskIds[] or query
```

---

## ✅ Implementation Checklist

### Types & Schemas
- [ ] Add Milestone interface to types/index.ts
- [ ] Add FirestoreTask to firebase-schema.ts
- [ ] Add FirestoreSprint to firebase-schema.ts
- [ ] Add FirestoreMilestone to firebase-schema.ts
- [ ] Add FirestoreEpic to firebase-schema.ts
- [ ] Add FirestoreStory to firebase-schema.ts
- [ ] Add converters for all types

### Services
- [ ] Create services/tasks.service.ts
- [ ] Create services/sprints.service.ts
- [ ] Create services/milestones.service.ts
- [ ] Create services/epics.service.ts
- [ ] Add query functions to firebase-queries.ts

### Pages
- [ ] Create /dashboard/projects/[id]/tasks
- [ ] Create /dashboard/projects/[id]/sprints
- [ ] Create /dashboard/projects/[id]/milestones
- [ ] Create /dashboard/projects/[id]/board
- [ ] Update project detail page to use new services

### Migration
- [ ] Deprecate lib/services/projects-service.ts
- [ ] Update all references to use new services
- [ ] Data migration script (if needed)

---

## 🎯 Next Steps

1. **Define Missing Milestone Interface**
2. **Create Firestore Schema Interfaces**
3. **Build TasksService with multi-tenant structure**
4. **Build SprintsService**
5. **Build MilestonesService**
6. **Create Kanban Board Page**
7. **Update Project Detail Page**

---

**Analysis Complete!**
Ready to implement Firebase integration for the complete Agile system.
