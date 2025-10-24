# Checklist & Files Enhancement Implementation

This document outlines the implementation of the enhanced checklist and files systems with project-level integration, agile task automation, and app-file relationships.

## ✅ Phase 1: Data Models & Types (COMPLETED)

### Updated Types in `/types/index.ts`

#### Checklist Enhancements
- **ChecklistItem**: Added `assignedTo`, `assignedType`, and `linkedTaskId` fields
- **ChecklistTemplate**: Added `defaultAssignments` configuration
- **NEW ChecklistInstance**: Project-level checklist instantiation with progress tracking
- **NEW ChecklistItemAssignment**: Assignment mapping structure

#### File & Document Types
- **NEW ProjectFile**: Centralized file type with `assignedApps` array
- **NEW FileVersion**: Version history tracking
- **NEW FolderStructure**: Folder organization with app assignment
- **NEW AppFile**: App-level file reference

#### Integration Types
- **Task**: Added `checklistItemId` and `checklistInstanceId` for linking
- **Project**: Added `checklistInstances` array

## ✅ Phase 2: React Components (COMPLETED)

### Created Components

#### 1. `/components/projects/assignment-picker.tsx`
**Reusable assignment selector component**
- Supports both individual team members and teams/roles
- Dropdown UI with avatar display
- Clear/unassign functionality
- Usage:
```tsx
<AssignmentPicker
  teamMembers={project.team}
  teams={['QA Team', 'Dev Team']}
  value={assignment}
  onChange={handleAssignmentChange}
/>
```

#### 2. `/components/projects/checklist-assignment-modal.tsx`
**Modal for assigning checklist items during project creation**
- Displays all checklist items from selected templates
- Groups items by category
- Shows required items with asterisk
- Tracks assignment progress
- Pre-fills with template default assignments
- Usage:
```tsx
<ChecklistAssignmentModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  templates={selectedTemplates}
  teamMembers={project.team}
  onAssign={(assignments) => handleAssignments(assignments)}
/>
```

#### 3. `/components/projects/file-app-assignment-modal.tsx`
**Modal for assigning files to multiple apps**
- Multi-select app assignment
- Supports bulk file assignment
- Shows app type badges with icons
- Displays shared file indicators
- Usage:
```tsx
<FileAppAssignmentModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  files={selectedFiles}
  apps={project.apps}
  onAssign={(fileIds, appIds) => handleAssign(fileIds, appIds)}
/>
```

#### 4. `/components/apps/app-files-view.tsx`
**App-level file browser component**
- Filters project files by app assignment
- Grid and list view modes
- Search and folder filtering
- Shows shared file indicators
- File download and view actions
- Usage:
```tsx
<AppFilesView
  appId={app.id}
  projectFiles={projectFiles}
  onViewFile={handleViewFile}
  onDownloadFile={handleDownloadFile}
/>
```

## ✅ Phase 3: Service Functions (COMPLETED)

### Created `/lib/checklist-task-service.ts`

Utility functions for checklist-task integration:

#### Core Functions

1. **createTasksFromChecklist()**
   - Creates agile tasks from checklist instance
   - Maps checklist items to backlog tasks
   - Copies assignments to task assignees
   - Links tasks to checklist items

2. **syncChecklistToTask()**
   - Updates task status when checklist item is completed
   - Marks task as 'done' when checklist item completed

3. **syncTaskToChecklist()**
   - Updates checklist item when task status changes
   - Marks checklist item complete when task is 'done'

4. **syncChecklistAndTask()**
   - Bidirectional sync wrapper
   - Handles both update directions

5. **updateChecklistProgress()**
   - Recalculates checklist completion percentages
   - Updates production ready status
   - Sets checklist status (not_started/in_progress/completed)

6. **createChecklistInstance()**
   - Instantiates template with assignments
   - Creates project-specific checklist copy

7. **getChecklistItemsForApp()**
   - Filters checklist items by app type
   - Returns relevant items for app display

8. **calculateProjectChecklistCompletion()**
   - Aggregates checklist progress across project
   - Calculates overall completion percentage

## 🔄 Phase 4: Integration Steps (TODO)

### 1. Update Project Creation Flow

**File**: `/app/dashboard/projects/new/page.tsx` or relevant project creation component

```tsx
import { ChecklistAssignmentModal } from '@/components/projects/checklist-assignment-modal'
import { createChecklistInstance, createTasksFromChecklist } from '@/lib/checklist-task-service'

// In project creation form:
const [showChecklistModal, setShowChecklistModal] = useState(false)
const [checklistAssignments, setChecklistAssignments] = useState<Map>()

// After selecting templates, show assignment modal
const handleCreateProject = () => {
  if (selectedTemplates.length > 0) {
    setShowChecklistModal(true)
  } else {
    createProjectWithoutChecklists()
  }
}

// When assignments are saved:
const handleChecklistAssignments = (assignments) => {
  setChecklistAssignments(assignments)
  setShowChecklistModal(false)

  // Create project with checklists
  const checklistInstances = selectedTemplates.map(template =>
    createChecklistInstance(projectId, template, assignments)
  )

  // Create tasks from checklist items
  const tasks = checklistInstances.flatMap(instance =>
    createTasksFromChecklist(projectId, instance, project)
  )

  // Save to Firebase
  // await saveProject({ ...project, checklistInstances })
  // await saveTasks(tasks)
}
```

### 2. Update App Detail Page for Checklist Display

**File**: `/app/dashboard/apps/[id]/page.tsx` (MashubV2 version)

```tsx
import { getChecklistItemsForApp } from '@/lib/checklist-task-service'

// In app detail page:
const appChecklists = getChecklistItemsForApp(project.checklistInstances, app.type)

// Add new tab for checklist:
<Tab value="checklist">
  <ChecklistView
    items={appChecklists}
    onComplete={handleChecklistItemComplete}
  />
</Tab>
```

### 3. Update Project Documents Page

**File**: `/app/dashboard/projects/documents/page.tsx` (MashubV2 version)

```tsx
import { FileAppAssignmentModal } from '@/components/projects/file-app-assignment-modal'

const [showAssignModal, setShowAssignModal] = useState(false)
const [selectedFiles, setSelectedFiles] = useState<ProjectFile[]>([])

// Add "Assign to Apps" button
<button onClick={() => setShowAssignModal(true)}>
  Assign to Apps
</button>

// Add modal
<FileAppAssignmentModal
  isOpen={showAssignModal}
  onClose={() => setShowAssignModal(false)}
  files={selectedFiles}
  apps={project.apps}
  onAssign={handleAssignToApps}
/>

// Handler
const handleAssignToApps = async (fileIds: string[], appIds: string[]) => {
  // Update files in Firebase
  for (const fileId of fileIds) {
    await updateDoc(doc(db, `projects/${projectId}/files/${fileId}`), {
      assignedApps: appIds
    })
  }

  // Refresh file list
  refreshFiles()
}
```

### 4. Add Files Tab to App Detail Page

**File**: `/app/dashboard/apps/[id]/page.tsx` (MashubV2 version)

```tsx
import { AppFilesView } from '@/components/apps/app-files-view'

// Fetch project files
const [projectFiles, setProjectFiles] = useState<ProjectFile[]>([])

useEffect(() => {
  // Load project files from Firebase
  loadProjectFiles(app.projectId)
}, [app.projectId])

// Add Files tab
<Tab value="files">
  <AppFilesView
    appId={app.id}
    projectFiles={projectFiles}
    onViewFile={handleViewFile}
    onDownloadFile={handleDownloadFile}
  />
</Tab>
```

### 5. Update Backlog/Board with Checklist Task Linking

**File**: `/app/dashboard/projects/backlog/page.tsx` and `/app/dashboard/projects/board/page.tsx` (MashubV2 version)

```tsx
// In task card component:
{task.checklistItemId && (
  <div className="flex items-center gap-1 text-xs text-purple-400">
    <CheckSquare className="w-3 h-3" />
    <span>From Checklist</span>
  </div>
)}

// Add filter for checklist tasks
const filterChecklistTasks = () => {
  setFilteredTasks(tasks.filter(task => task.checklistItemId))
}
```

### 6. Implement Bidirectional Sync

Create a sync handler that runs when either tasks or checklist items are updated:

```tsx
import { syncChecklistAndTask, updateChecklistProgress } from '@/lib/checklist-task-service'

const handleTaskStatusChange = async (task: Task, newStatus: TaskStatus) => {
  if (task.checklistItemId && task.checklistInstanceId) {
    // Find linked checklist item
    const checklistInstance = project.checklistInstances.find(
      ci => ci.id === task.checklistInstanceId
    )
    const checklistItem = checklistInstance?.items.find(
      item => item.id === task.checklistItemId
    )

    if (checklistItem) {
      // Sync task → checklist
      const { updatedChecklistItem, updatedTask } = await syncChecklistAndTask(
        checklistItem,
        { ...task, status: newStatus },
        'task',
        currentUser.name
      )

      // Update checklist instance progress
      const updatedInstance = updateChecklistProgress({
        ...checklistInstance,
        items: checklistInstance.items.map(item =>
          item.id === updatedChecklistItem.id ? updatedChecklistItem : item
        )
      })

      // Save to Firebase
      await updateChecklistInstance(updatedInstance)
      await updateTask(updatedTask)
    }
  }
}

const handleChecklistItemToggle = async (
  checklistInstanceId: string,
  itemId: string,
  completed: boolean
) => {
  // Find linked task
  const task = tasks.find(
    t => t.checklistItemId === itemId && t.checklistInstanceId === checklistInstanceId
  )

  if (task) {
    // Sync checklist → task
    const checklistItem = { ...item, completed, completedAt: new Date(), completedBy: currentUser.name }

    const { updatedChecklistItem, updatedTask } = await syncChecklistAndTask(
      checklistItem,
      task,
      'checklist'
    )

    // Save updates
    await updateTask(updatedTask)
  }
}
```

## 📊 Firebase Collections Schema

### Projects Collection
```
projects/{projectId}
  - checklistInstances: ChecklistInstance[]
```

### Checklist Instances Subcollection
```
projects/{projectId}/checklistInstances/{instanceId}
  - id: string
  - projectId: string
  - templateId: string
  - items: ChecklistItem[]
  - totalItems: number
  - completedItems: number
  - status: string
  - isProductionReady: boolean
  - createdAt: Timestamp
  - updatedAt: Timestamp
```

### Project Files Subcollection
```
projects/{projectId}/files/{fileId}
  - id: string
  - name: string
  - type: FileType
  - assignedApps: string[]  // Array of app IDs
  - folder: string
  - tags: string[]
  - version: number
  - versions: FileVersion[]
  - uploadedBy: string
  - uploadedAt: Timestamp
```

### Tasks Collection (Updated)
```
projects/{projectId}/tasks/{taskId}
  - id: string
  - checklistItemId?: string  // NEW
  - checklistInstanceId?: string  // NEW
  - ... (existing task fields)
```

## 🎯 Usage Examples

### Creating a Project with Checklists

1. User fills out project form
2. User selects checklist templates
3. ChecklistAssignmentModal opens
4. User assigns each checklist item to team members or teams
5. System creates:
   - Project
   - ChecklistInstances with assignments
   - Tasks in backlog from checklist items
6. Tasks appear in backlog ready to be moved to sprints

### Assigning Files to Apps

1. User navigates to project documents page
2. User selects one or more files
3. User clicks "Assign to Apps"
4. FileAppAssignmentModal opens
5. User selects which apps should have access
6. Files are updated with assignedApps array
7. Files now appear in each app's Files tab

### Viewing App-Specific Files

1. User navigates to app detail page
2. User clicks "Files" tab
3. AppFilesView shows only files assigned to this app
4. Shared files show "Shared with X apps" badge
5. User can view, download, or navigate to project files

### Completing Checklist Items

1. User completes a checklist item
2. System automatically marks linked task as "done"
3. Checklist progress updates
4. If all required items complete → isProductionReady = true

OR (reverse flow):

1. User drags task to "Done" column on board
2. System automatically marks checklist item as complete
3. Completion tracked with user name and timestamp

## 🔍 Testing Checklist

- [ ] Create project with checklist templates
- [ ] Assign checklist items to team members and teams
- [ ] Verify tasks created in backlog
- [ ] Complete checklist item → verify task marked done
- [ ] Complete task → verify checklist item marked done
- [ ] Assign files to multiple apps
- [ ] View app Files tab → see only assigned files
- [ ] View shared files → see "shared" indicator
- [ ] Upload file directly to app → auto-assigns to that app
- [ ] Remove app from file assignment → file disappears from app view

## 📝 Next Steps

1. **Integrate ChecklistAssignmentModal** into project creation flow
2. **Update project documents page** with file-app assignment
3. **Add Files tab** to app detail page
4. **Add Checklist tab** to app detail page (filtered by app type)
5. **Implement sync handlers** for task-checklist bidirectional updates
6. **Add Firebase CRUD operations** for:
   - Creating checklist instances
   - Creating tasks from checklists
   - Updating file assignments
   - Syncing task/checklist status
7. **Add UI indicators** for:
   - Checklist-linked tasks in backlog/board
   - Shared files in file views
   - Production readiness status
8. **Test end-to-end workflows**

## 🎨 UI/UX Improvements

### Checklist Progress Indicators
- Project card: Show checklist completion percentage
- App card: Show app-specific checklist status
- Dashboard: Overall production readiness indicator

### File Assignment Indicators
- Project files: Show which apps use each file
- App files: Show "From project" link
- Bulk operations: Multi-select for batch assignment

### Task-Checklist Linking
- Task cards: Checklist badge
- Checklist items: Task link icon
- Hover states: Show linked item preview

---

**Implementation Status**: Core types, components, and service functions complete. Integration with pages and Firebase pending.

**Last Updated**: 2025-10-24
