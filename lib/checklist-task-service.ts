import { ChecklistInstance, ChecklistItem, Task, TaskStatus, TaskPriority, Project } from '@/types'

/**
 * Creates agile tasks from checklist instance items
 * Called when a checklist instance is created for a project
 */
export function createTasksFromChecklist(
  projectId: string,
  checklistInstance: ChecklistInstance,
  project: Project
): Task[] {
  const tasks: Task[] = []

  checklistInstance.items.forEach((item, index) => {
    // Map checklist category to task priority
    const priority = item.required ? 'high' : 'medium'

    // Create task from checklist item
    const task: Task = {
      id: `task_checklist_${item.id}_${Date.now()}`,
      projectId,
      title: item.title,
      description: item.description || `Checklist item: ${item.title}`,
      status: 'todo' as TaskStatus,
      priority: priority as TaskPriority,

      // Assignment from checklist
      assignee: item.assignedTo && item.assignedType === 'user'
        ? project.team.find(member => member.id === item.assignedTo)
        : undefined,

      // Checklist linking
      checklistItemId: item.id,
      checklistInstanceId: checklistInstance.id,

      // Scope
      scope: 'project',

      // Metadata
      tags: [
        'checklist',
        item.category,
        ...(item.required ? ['required'] : []),
        ...(item.assignedType === 'team' ? [item.assignedTo || ''] : [])
      ].filter(Boolean),

      createdAt: new Date(),
      updatedAt: new Date()
    }

    tasks.push(task)
  })

  return tasks
}

/**
 * Syncs checklist item completion to task status
 * Called when a checklist item is marked as complete
 */
export function syncChecklistToTask(
  checklistItem: ChecklistItem,
  task: Task
): Task {
  return {
    ...task,
    status: checklistItem.completed ? 'done' : task.status,
    updatedAt: new Date()
  }
}

/**
 * Syncs task completion to checklist item
 * Called when a task status changes to 'done'
 */
export function syncTaskToChecklist(
  task: Task,
  checklistItem: ChecklistItem,
  completedBy?: string
): ChecklistItem {
  const isDone = task.status === 'done'

  return {
    ...checklistItem,
    completed: isDone,
    completedAt: isDone ? new Date() : undefined,
    completedBy: isDone ? (completedBy || task.assignee?.name) : undefined,
    updatedAt: new Date()
  }
}

/**
 * Updates checklist instance progress based on item completion
 */
export function updateChecklistProgress(
  checklistInstance: ChecklistInstance
): ChecklistInstance {
  const completedItems = checklistInstance.items.filter(item => item.completed).length
  const requiredItems = checklistInstance.items.filter(item => item.required).length
  const completedRequiredItems = checklistInstance.items.filter(
    item => item.required && item.completed
  ).length

  const isProductionReady = completedRequiredItems === requiredItems

  let status: 'not_started' | 'in_progress' | 'completed' = 'not_started'
  if (completedItems === checklistInstance.items.length) {
    status = 'completed'
  } else if (completedItems > 0) {
    status = 'in_progress'
  }

  return {
    ...checklistInstance,
    completedItems,
    completedRequiredItems,
    status,
    isProductionReady,
    completedAt: status === 'completed' ? new Date() : undefined,
    updatedAt: new Date()
  }
}

/**
 * Creates a checklist instance from a template with assignments
 */
export function createChecklistInstance(
  projectId: string,
  template: any,
  assignments: Map<string, { assignedTo: string; assignedType: 'user' | 'team' }>
): ChecklistInstance {
  // Apply assignments to items
  const itemsWithAssignments = template.items.map((item: ChecklistItem) => {
    const assignment = assignments.get(item.id)
    return {
      ...item,
      assignedTo: assignment?.assignedTo,
      assignedType: assignment?.assignedType,
      completed: false,
      completedAt: undefined,
      completedBy: undefined
    }
  })

  const instance: ChecklistInstance = {
    id: `checklist_${projectId}_${template.id}_${Date.now()}`,
    projectId,
    templateId: template.id,
    templateName: template.name,
    appTypes: template.appTypes,
    items: itemsWithAssignments,
    totalItems: itemsWithAssignments.length,
    completedItems: 0,
    requiredItems: itemsWithAssignments.filter((item: ChecklistItem) => item.required).length,
    completedRequiredItems: 0,
    status: 'not_started',
    isProductionReady: false,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  return instance
}

/**
 * Bidirectional sync: Update both checklist item and task
 */
export async function syncChecklistAndTask(
  checklistItem: ChecklistItem,
  task: Task,
  updateSource: 'checklist' | 'task',
  completedBy?: string
): Promise<{ updatedChecklistItem: ChecklistItem; updatedTask: Task }> {
  let updatedChecklistItem = checklistItem
  let updatedTask = task

  if (updateSource === 'checklist') {
    // Checklist was updated, sync to task
    updatedTask = syncChecklistToTask(checklistItem, task)
  } else {
    // Task was updated, sync to checklist
    updatedChecklistItem = syncTaskToChecklist(task, checklistItem, completedBy)
  }

  return {
    updatedChecklistItem,
    updatedTask
  }
}

/**
 * Get checklist items for a specific app type
 */
export function getChecklistItemsForApp(
  checklistInstances: ChecklistInstance[],
  appType: string
): ChecklistItem[] {
  const relevantChecklists = checklistInstances.filter(instance =>
    instance.appTypes.includes(appType as any)
  )

  return relevantChecklists.flatMap(instance => instance.items)
}

/**
 * Calculate overall project checklist completion percentage
 */
export function calculateProjectChecklistCompletion(
  checklistInstances: ChecklistInstance[]
): {
  overallProgress: number
  totalItems: number
  completedItems: number
  isAllProductionReady: boolean
} {
  const totalItems = checklistInstances.reduce((sum, instance) => sum + instance.totalItems, 0)
  const completedItems = checklistInstances.reduce((sum, instance) => sum + instance.completedItems, 0)
  const overallProgress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
  const isAllProductionReady = checklistInstances.every(instance => instance.isProductionReady)

  return {
    overallProgress,
    totalItems,
    completedItems,
    isAllProductionReady
  }
}
