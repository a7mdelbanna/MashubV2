# Agile System Enhancement - Implementation Progress

## ✅ PHASE 1 COMPLETED: Core Type System & Permissions

### What's Been Implemented

#### 1. Consolidated Agile Type System (`types/agile.ts`)
**600+ lines of comprehensive type definitions** including:

##### Type Consolidation
- ✅ Single source of truth for all agile types
- ✅ Standardized 5-level priority: `critical | urgent | high | medium | low`
- ✅ Standardized TaskStatus: `backlog | todo | in_progress | in_review | done | blocked`
- ✅ Consistent `Date` types throughout (no more string/Date conflicts)

##### Full Scrum Implementation
- ✅ **Project → Epic → Story → Task** hierarchy
- ✅ Epic: Contains stories, tracks business value, ROI
- ✅ Story: Contains tasks, acceptance criteria, sprint assignment
- ✅ Task: Detailed work items with checklist integration
- ✅ Sprint: Full sprint planning, retrospectives, burndown
- ✅ Backlog: Proper backlog entity with grooming support

##### Custom Fields Support
- ✅ `CustomFieldDefinition` interface
- ✅ `CustomFieldValue` interface
- ✅ Support for: string, number, boolean, date, select, multi-select, user fields
- ✅ Custom fields on all work items (Task, Story, Epic)

##### Missing Features Now Added
- ✅ **Definition of Done**: Full interface with structured items
- ✅ **Acceptance Criteria**: Given-When-Then format support
- ✅ **Sprint Retrospective**: Structured retrospective data
- ✅ **Velocity Tracking**: Historical data, trends, forecasting
- ✅ **Burndown Charts**: BurndownPoint interface with ideal vs actual
- ✅ **Dependencies**: Full dependency management with types
- ✅ **Bug Tracking**: Dedicated Bug interface extending Task
- ✅ **Time Tracking**: TimeEntry and TimeEstimate interfaces
- ✅ **Board Workflows**: BoardWorkflow and BoardTransition
- ✅ **Forecasting**: Velocity-based sprint forecasting

##### Work Item Types
```typescript
Task: Basic work unit
 ├─ Bug: Specialized task with severity, reproduction steps
 ├─ Feature: Feature development
 ├─ Improvement: Enhancements
 ├─ Documentation: Documentation work
 └─ Spike: Research/investigation

Story: User story with acceptance criteria
Epic: Large initiative containing stories
Sprint: Time-boxed iteration
Backlog: Ordered work items
Board: Kanban/Scrum board with workflow
```

#### 2. Permissions & Access Control System (`types/permissions.ts`)
**350+ lines of RBAC implementation** including:

##### Role-Based Access Control
- ✅ 9 predefined roles with granular permissions
- ✅ Resource-based permissions (`resource:action` format)
- ✅ Custom permissions and restrictions support
- ✅ Permission context for assignee/owner checks

##### Roles Defined
1. **Project Manager**: Full access to everything
2. **Product Owner**: Epic/Story management, backlog prioritization
3. **Scrum Master**: Sprint management, facilitation
4. **Team Lead**: Story/task management, team coordination
5. **Developer**: Task execution, code work
6. **Designer**: Design tasks, file management
7. **QA Engineer**: Testing, bug creation, quality checks
8. **Stakeholder**: View access, commenting
9. **Viewer**: Read-only access

##### Permission Helpers
```typescript
hasPermission(userPermissions, 'task:edit')
hasAnyPermission(userPermissions, ['task:edit', 'task:complete'])
hasAllPermissions(userPermissions, ['sprint:create', 'sprint:manage'])
canPerformAction(userPermissions, 'task', 'edit', context)
```

---

## 🎯 How to Use the New Type System

### Importing Types

**OLD WAY (Don't use anymore):**
```typescript
import { Task, Sprint } from '@/types/index'
import { TaskPriority } from '@/types/projects'
```

**NEW WAY (Use this):**
```typescript
import {
  Task, Story, Epic, Sprint, Backlog,
  Priority, TaskStatus, WorkItemType,
  CustomFieldValue, TimeEntry, Bug
} from '@/types/agile'

import {
  hasPermission, canPerformAction,
  RoleName, Permission
} from '@/types/permissions'
```

### Example: Creating a Task with Full Scrum Fields

```typescript
import { Task, Priority, TaskStatus } from '@/types/agile'

const newTask: Task = {
  id: 'task_123',
  projectId: 'proj_1',

  // REQUIRED: Full Scrum hierarchy
  storyId: 'story_456', // Task must belong to a story
  epicId: 'epic_789', // Denormalized from story
  sprintId: 'sprint_10', // Denormalized from story

  title: 'Implement user authentication',
  description: 'Add JWT-based auth system',
  type: 'feature',

  status: 'todo' as TaskStatus,
  priority: 'high' as Priority,

  assigneeId: 'user_1',
  reporterId: 'user_2',

  dependencies: [],
  blockedBy: [],

  timeEstimate: {
    original: 480, // 8 hours in minutes
    remaining: 480,
    actual: 0,
    confidence: 'high'
  },

  storyPoints: 5,

  tags: ['authentication', 'backend'],
  labels: [],

  commentsCount: 0,
  attachmentsCount: 0,
  watchers: [],

  // Checklist integration
  checklistItemId: 'checklist_item_1',
  checklistInstanceId: 'checklist_inst_1',

  definitionOfDoneCompleted: false,

  customFields: [
    { fieldId: 'field_1', value: 'Production' }
  ],

  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'user_2'
}
```

### Example: Creating a Story with Acceptance Criteria

```typescript
import { Story, AcceptanceCriteria } from '@/types/agile'

const acceptanceCriteria: AcceptanceCriteria[] = [
  {
    id: 'ac_1',
    description: 'User can log in with email and password',
    given: 'A registered user',
    when: 'They enter valid credentials',
    then: 'They should be logged in and redirected to dashboard',
    completed: false
  },
  {
    id: 'ac_2',
    description: 'Invalid credentials show error',
    given: 'A user with invalid credentials',
    when: 'They attempt to log in',
    then: 'They should see an error message',
    completed: false
  }
]

const newStory: Story = {
  id: 'story_456',
  projectId: 'proj_1',
  epicId: 'epic_789',
  sprintId: 'sprint_10',

  title: 'User Authentication',
  description: 'As a user, I want to log in securely',
  userStory: 'As a user, I want to log in with my email and password, so that I can access my account securely',

  status: 'in_progress',
  priority: 'critical',

  tasks: [], // Will be populated
  taskIds: ['task_123'],

  storyPoints: 13,
  size: 'l',

  timeEstimate: {
    original: 1920, // 32 hours
    remaining: 1440,
    actual: 480,
    confidence: 'medium'
  },

  acceptanceCriteria,
  allCriteriaAccepted: false,

  tasksTotal: 4,
  tasksCompleted: 1,
  progress: 25,

  tags: ['authentication', 'security'],
  labels: [],

  customFields: [],

  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: 'user_2'
}
```

### Example: Permission Checks

```typescript
import { hasPermission, canPerformAction } from '@/types/permissions'

// Check if user can edit tasks
const userPerms = {
  userId: 'user_1',
  projectId: 'proj_1',
  role: 'developer' as RoleName
}

if (hasPermission(userPerms, 'task:edit')) {
  // Allow editing
}

// Check with context (assignee can edit their own tasks)
const canEdit = canPerformAction(
  userPerms,
  'task',
  'edit',
  { isAssignee: true, userId: 'user_1' }
)
```

---

## 📋 Next Steps (Phases 2-7)

### Immediate Next Steps (Week 1-2)

#### Phase 2: Project Creation Flow
**Files to modify:**
1. `app/dashboard/projects/new/page.tsx`
   - Add Step 4.5: Checklist Template Selection
   - Integrate ChecklistAssignmentModal
   - Connect to checklist service

2. **NEW** `lib/project-service.ts`
   - Create project creation orchestrator
   - Auto-generate Epics from checklist categories
   - Auto-generate Stories from checklist items
   - Auto-generate Tasks linked to Stories

#### Phase 3: Backlog & Board UI
**Components to create:**
1. `components/projects/task-checklist-badge.tsx`
   - Show "3/5 items" progress
   - Production ready indicator
   - Click to expand checklist

2. `components/projects/advanced-filters.tsx`
   - All filters from plan
   - Save/load filter presets
   - Filter by custom fields

**Files to modify:**
1. `app/dashboard/projects/board/page.tsx`
   - Add checklist badges to task cards (line ~395)
   - Integrate advanced filters
   - Update imports to use agile.ts

2. `app/dashboard/projects/backlog/page.tsx`
   - Add checklist column
   - Integrate advanced filters
   - Update imports to use agile.ts

---

## 🔧 Migration Guide: Updating Existing Files

### Step 1: Update Imports

**Find and replace in these files:**
- `app/dashboard/projects/board/page.tsx`
- `app/dashboard/projects/backlog/page.tsx`
- All project-related components

**OLD:**
```typescript
import { Task, TaskStatus, TaskPriority } from '../types/projects'
```

**NEW:**
```typescript
import { Task, TaskStatus, Priority as TaskPriority } from '@/types/agile'
```

### Step 2: Update Type Usage

**Priority changes:**
- OLD: `'urgent'` and `'critical'` were conflicting
- NEW: Both exist in 5-level system, use as needed

**Status changes:**
- OLD: `'review'`
- NEW: `'in_review'` (standardized)

**Task hierarchy:**
- NEW: Tasks now **require** `storyId` (Full Scrum)
- Migration: Create default stories for orphaned tasks

---

## 🎨 UI Components Ready to Build

### TaskChecklistBadge Component
```typescript
interface TaskChecklistBadgeProps {
  taskId: string
  checklistItemId?: string
  checklistInstanceId?: string
  compact?: boolean
}

// Shows:
// - "3/5" progress indicator
// - Color: green (done), orange (in progress), gray (not started)
// - "Production Ready" checkmark if applicable
// - Expandable to show linked checklist items
```

### AdvancedFilters Component
```typescript
interface AdvancedFiltersProps {
  onFilterChange: (filters: WorkItemFilter) => void
  savedFilters?: BoardFilter[]
  showCustomFields?: boolean
}

// Includes all filters from agile.ts:
// - Priority (5 levels)
// - Status (6 states)
// - Assignee (team members)
// - Sprint (current, next, backlog, all)
// - Epic (project epics)
// - Type (task, bug, feature, etc.)
// - Has Checklist (yes/no/production-ready)
// - Date ranges
// - Custom fields (dynamic)
```

---

## 📊 What's Different from Before

### Before (Broken State)
- ❌ 3 conflicting type definition files
- ❌ Inconsistent priority values (`urgent` vs `critical`)
- ❌ Inconsistent status values (`review` vs `in_review`)
- ❌ No Epic → Story → Task hierarchy
- ❌ No custom fields support
- ❌ No Definition of Done
- ❌ No Sprint retrospectives
- ❌ No velocity forecasting
- ❌ No bug tracking specific fields
- ❌ No permission system

### After (Current State)
- ✅ Single source of truth (`types/agile.ts`)
- ✅ Standardized 5-level priority system
- ✅ Standardized 6-state status workflow
- ✅ Full Scrum hierarchy enforced
- ✅ Custom fields on all work items
- ✅ Structured Definition of Done
- ✅ Sprint retrospective data model
- ✅ Velocity tracking & forecasting
- ✅ Bug interface with severity, reproduction steps
- ✅ Full RBAC permission system

---

## 🚀 Benefits of New System

1. **Type Safety**: No more runtime errors from conflicting types
2. **Full Scrum Compliance**: Proper Epic → Story → Task hierarchy
3. **Extensibility**: Custom fields allow project-specific data
4. **Forecasting**: Velocity-based sprint planning
5. **Permissions**: Granular access control
6. **Bug Tracking**: Proper severity levels and reproduction steps
7. **Time Tracking**: Detailed time estimates with confidence levels
8. **Acceptance Criteria**: Structured Given-When-Then format
9. **Dependencies**: Full dependency graph support
10. **Retrospectives**: Capture team learnings

---

## 📈 Recommended Implementation Order

| Phase | Priority | Effort | Impact | Status |
|-------|----------|--------|--------|--------|
| 1. Type System | ⭐⭐⭐⭐⭐ | Medium | ⭐⭐⭐⭐⭐ | ✅ DONE |
| 2. Permissions | ⭐⭐⭐⭐ | Small | ⭐⭐⭐⭐ | ✅ DONE |
| 3. Utility Functions | ⭐⭐⭐⭐ | Medium | ⭐⭐⭐⭐ | 🔄 Next |
| 4. Checklist Badges | ⭐⭐⭐⭐ | Small | ⭐⭐⭐⭐⭐ | 📋 Pending |
| 5. Advanced Filters | ⭐⭐⭐ | Medium | ⭐⭐⭐⭐ | 📋 Pending |
| 6. Project Creation | ⭐⭐⭐⭐ | Large | ⭐⭐⭐⭐⭐ | 📋 Pending |
| 7. Sprint Planning | ⭐⭐⭐ | Large | ⭐⭐⭐⭐ | 📋 Pending |

---

## 🎓 Learning Resources

### Full Scrum Methodology
- Sprint Planning: Selecting stories for sprint based on velocity
- Daily Scrum: Quick sync (not directly in type system)
- Sprint Review: Demo completed work
- Sprint Retrospective: Team improvement (now has data structure)

### Type System Organization
```
types/
├── agile.ts          ← All agile/scrum types
├── permissions.ts    ← RBAC system
├── index.ts          ← General app types (User, Client, etc.)
└── projects.ts       ← Can be deprecated/merged
```

---

**Current Status**: Phase 1 Complete (Type System + Permissions)
**Next Up**: Phase 2 & 3 (Project Creation + UI Enhancements)
**Total Progress**: ~20% of full implementation complete
