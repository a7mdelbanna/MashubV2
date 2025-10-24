/**
 * Project Service
 * Backend integration for project creation with automatic Epic/Story/Task generation
 * from checklist templates
 */

import {
  Project,
  Epic,
  Story,
  Task,
  ChecklistTemplate,
  ChecklistInstance,
  ChecklistItem,
  Priority,
  TaskStatus,
  WorkItemType
} from '@/types'

interface ProjectCreationData {
  // Project basic info
  name: string
  description: string
  category: string
  type: string
  priority: string
  status: string
  tags: string[]

  // Client & Scope
  clientId: string
  clientContact: string
  scope: string
  objectives: string[]
  deliverables: string[]
  requirements: string[]

  // Team
  projectManager: string
  teamMembers: string[]
  requiredSkills: string[]

  // Timeline & Budget
  startDate: string
  endDate: string
  milestones: Array<{ name: string; date: string; description: string }>
  budget: number
  currency: string
  hourlyRate: number
  estimatedHours: number

  // Checklist Templates
  selectedChecklistTemplates: string[]
  checklistAssignments: Record<string, { assignedTo: string; assignedType: 'user' | 'team' }>

  // Additional
  visibility: string
  notifications: boolean
  autoBackup: boolean
  riskAssessment: string
}

interface ProjectCreationResult {
  project: Project
  epics: Epic[]
  stories: Story[]
  tasks: Task[]
  checklistInstances: ChecklistInstance[]
}

/**
 * Create a new project with auto-generated agile work items from checklist templates
 */
export async function createProjectWithChecklists(
  data: ProjectCreationData,
  templates: ChecklistTemplate[]
): Promise<ProjectCreationResult> {
  // 1. Create the Project
  const project = await createProject(data)

  // 2. Create Checklist Instances from templates
  const checklistInstances = await createChecklistInstances(
    project.id,
    data.selectedChecklistTemplates,
    templates,
    data.checklistAssignments
  )

  // 3. Auto-generate Epics from checklist categories
  const epics = await generateEpicsFromChecklists(
    project.id,
    checklistInstances
  )

  // 4. Auto-generate Stories from checklist items
  const stories = await generateStoriesFromChecklistItems(
    project.id,
    checklistInstances,
    epics
  )

  // 5. Auto-generate Tasks from Stories
  const tasks = await generateTasksFromStories(
    project.id,
    stories,
    data.checklistAssignments
  )

  // 6. Link Tasks back to Checklist Items
  await linkTasksToChecklistItems(tasks, checklistInstances)

  return {
    project,
    epics,
    stories,
    tasks,
    checklistInstances
  }
}

/**
 * Create the base Project entity
 */
async function createProject(data: ProjectCreationData): Promise<Project> {
  // TODO: Replace with actual API call
  const project: Project = {
    id: `proj_${Date.now()}`,
    name: data.name,
    description: data.description,
    clientId: data.clientId,
    status: data.status as any,
    priority: data.priority as Priority,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    budget: data.budget,
    spent: 0,
    currency: data.currency,
    projectManager: data.projectManager,
    teamMembers: data.teamMembers.map(id => ({
      userId: id,
      role: 'developer',
      hourlyRate: data.hourlyRate,
      allocatedHours: data.estimatedHours / data.teamMembers.length
    })),
    tags: data.tags,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  // API call would go here
  // const response = await fetch('/api/projects', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(project)
  // })
  // return await response.json()

  console.log('Creating project:', project)
  return project
}

/**
 * Create checklist instances from selected templates
 */
async function createChecklistInstances(
  projectId: string,
  selectedTemplateIds: string[],
  templates: ChecklistTemplate[],
  assignments: Record<string, { assignedTo: string; assignedType: 'user' | 'team' }>
): Promise<ChecklistInstance[]> {
  const instances: ChecklistInstance[] = []

  for (const templateId of selectedTemplateIds) {
    const template = templates.find(t => t.id === templateId)
    if (!template) continue

    // Copy template items and apply assignments
    const instanceItems: ChecklistItem[] = template.items.map(item => ({
      ...item,
      id: `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      assignedTo: assignments[item.id]?.assignedTo,
      assignedType: assignments[item.id]?.assignedType,
      completed: false,
      completedAt: undefined,
      completedBy: undefined
    }))

    const instance: ChecklistInstance = {
      id: `instance_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      projectId,
      templateId: template.id,
      templateName: template.name,
      appTypes: template.appTypes,
      items: instanceItems,
      totalItems: instanceItems.length,
      completedItems: 0,
      requiredItems: instanceItems.filter(i => i.required).length,
      completedRequiredItems: 0,
      isProductionReady: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    instances.push(instance)

    // API call would go here
    // await fetch('/api/checklist-instances', {
    //   method: 'POST',
    //   body: JSON.stringify(instance)
    // })

    console.log('Created checklist instance:', instance.templateName)
  }

  return instances
}

/**
 * Generate Epics from checklist categories
 * Each unique category becomes an Epic
 */
async function generateEpicsFromChecklists(
  projectId: string,
  instances: ChecklistInstance[]
): Promise<Epic[]> {
  const epics: Epic[] = []
  const categoryMap = new Map<string, ChecklistItem[]>()

  // Group all items by category
  instances.forEach(instance => {
    instance.items.forEach(item => {
      if (!categoryMap.has(item.category)) {
        categoryMap.set(item.category, [])
      }
      categoryMap.get(item.category)!.push(item)
    })
  })

  // Create Epic for each category
  for (const [category, items] of categoryMap.entries()) {
    const requiredItems = items.filter(i => i.required).length
    const totalItems = items.length

    const epic: Epic = {
      id: `epic_${Date.now()}_${category}`,
      projectId,
      title: getCategoryEpicTitle(category),
      description: getCategoryEpicDescription(category, totalItems, requiredItems),
      priority: getCategoryPriority(category, requiredItems, totalItems),
      status: 'backlog' as TaskStatus,
      assignee: undefined,
      tags: [category, 'auto-generated'],
      customFields: {
        category,
        generatedFromChecklist: true,
        requiredItems,
        totalItems
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'system',
      lastModifiedBy: 'system'
    }

    epics.push(epic)

    // API call would go here
    // await fetch('/api/epics', {
    //   method: 'POST',
    //   body: JSON.stringify(epic)
    // })

    console.log(`Generated Epic: ${epic.title}`)
  }

  return epics
}

/**
 * Generate Stories from checklist items
 * Each checklist item becomes a Story under its category Epic
 */
async function generateStoriesFromChecklistItems(
  projectId: string,
  instances: ChecklistInstance[],
  epics: Epic[]
): Promise<Story[]> {
  const stories: Story[] = []

  for (const instance of instances) {
    for (const item of instance.items) {
      // Find the Epic for this item's category
      const epic = epics.find(e => e.customFields?.category === item.category)
      if (!epic) continue

      const story: Story = {
        id: `story_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        projectId,
        epicId: epic.id,
        title: item.title,
        description: item.description || `Complete: ${item.title}`,
        priority: item.required ? 'high' as Priority : 'medium' as Priority,
        status: 'backlog' as TaskStatus,
        assignee: item.assignedTo,
        storyPoints: estimateStoryPoints(item),
        tags: [
          item.category,
          item.required ? 'required' : 'optional',
          'auto-generated'
        ],
        customFields: {
          checklistItemId: item.id,
          checklistInstanceId: instance.id,
          category: item.category,
          generatedFromChecklist: true,
          required: item.required
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        lastModifiedBy: 'system'
      }

      stories.push(story)

      // API call would go here
      // await fetch('/api/stories', {
      //   method: 'POST',
      //   body: JSON.stringify(story)
      // })

      console.log(`Generated Story: ${story.title}`)
    }
  }

  return stories
}

/**
 * Generate Tasks from Stories
 * Each Story gets broken down into implementation tasks
 */
async function generateTasksFromStories(
  projectId: string,
  stories: Story[],
  assignments: Record<string, { assignedTo: string; assignedType: 'user' | 'team' }>
): Promise<Task[]> {
  const tasks: Task[] = []

  for (const story of stories) {
    // Generate implementation tasks for each story
    const storyTasks = getTaskTemplatesForStory(story)

    for (const taskTemplate of storyTasks) {
      const task: Task = {
        id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        projectId,
        storyId: story.id,
        epicId: story.epicId,
        title: taskTemplate.title,
        description: taskTemplate.description,
        type: taskTemplate.type,
        priority: story.priority,
        status: 'backlog' as TaskStatus,
        assignee: story.assignee,
        estimatedHours: taskTemplate.estimatedHours,
        actualHours: 0,
        tags: [...story.tags, taskTemplate.type],
        customFields: {
          checklistItemId: story.customFields?.checklistItemId,
          checklistInstanceId: story.customFields?.checklistInstanceId,
          category: story.customFields?.category,
          generatedFromChecklist: true,
          taskType: taskTemplate.type
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        lastModifiedBy: 'system'
      }

      tasks.push(task)

      // API call would go here
      // await fetch('/api/tasks', {
      //   method: 'POST',
      //   body: JSON.stringify(task)
      // })

      console.log(`  Generated Task: ${task.title}`)
    }
  }

  return tasks
}

/**
 * Link generated Tasks back to their Checklist Items
 */
async function linkTasksToChecklistItems(
  tasks: Task[],
  instances: ChecklistInstance[]
): Promise<void> {
  for (const task of tasks) {
    const checklistItemId = task.customFields?.checklistItemId
    const checklistInstanceId = task.customFields?.checklistInstanceId

    if (!checklistItemId || !checklistInstanceId) continue

    const instance = instances.find(i => i.id === checklistInstanceId)
    if (!instance) continue

    const item = instance.items.find(i => i.id === checklistItemId)
    if (!item) continue

    // Link task to checklist item
    item.linkedTaskId = task.id

    // API call would go here to update the checklist item
    // await fetch(`/api/checklist-items/${item.id}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({ linkedTaskId: task.id })
    // })

    console.log(`  Linked task ${task.id} to checklist item ${item.title}`)
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Get Epic title for a category
 */
function getCategoryEpicTitle(category: string): string {
  const titleMap: Record<string, string> = {
    branding: 'Branding & Design System',
    technical: 'Technical Implementation',
    legal: 'Legal & Compliance',
    qa: 'Quality Assurance & Testing',
    deployment: 'Deployment & Infrastructure',
    documentation: 'Documentation & Knowledge Base',
    other: 'Miscellaneous Tasks'
  }

  return titleMap[category] || `${category.charAt(0).toUpperCase() + category.slice(1)} Tasks`
}

/**
 * Get Epic description for a category
 */
function getCategoryEpicDescription(category: string, totalItems: number, requiredItems: number): string {
  return `Epic containing all ${category} related tasks. Includes ${totalItems} total items, ${requiredItems} required for production.`
}

/**
 * Determine Epic priority based on category and required items
 */
function getCategoryPriority(category: string, requiredItems: number, totalItems: number): Priority {
  // High priority categories
  if (['technical', 'qa', 'legal', 'deployment'].includes(category)) {
    return requiredItems > totalItems * 0.5 ? 'critical' : 'high'
  }

  // Medium priority categories
  if (['branding', 'documentation'].includes(category)) {
    return requiredItems > 0 ? 'high' : 'medium'
  }

  // Default
  return 'medium'
}

/**
 * Estimate story points for a checklist item
 */
function estimateStoryPoints(item: ChecklistItem): number {
  // Base points
  let points = 3

  // Adjust based on category
  if (item.category === 'technical') points += 2
  if (item.category === 'qa') points += 1
  if (item.category === 'deployment') points += 2
  if (item.category === 'legal') points += 1

  // Adjust based on required status
  if (item.required) points += 1

  // Cap at 8 (Fibonacci)
  return Math.min(points, 8)
}

/**
 * Get task templates for a story based on its category
 */
function getTaskTemplatesForStory(story: Story): Array<{
  title: string
  description: string
  type: WorkItemType
  estimatedHours: number
}> {
  const category = story.customFields?.category as string
  const storyTitle = story.title

  const templates: Array<{
    title: string
    description: string
    type: WorkItemType
    estimatedHours: number
  }> = []

  // Common tasks for all categories
  templates.push({
    title: `Research: ${storyTitle}`,
    description: `Research requirements and best practices for: ${storyTitle}`,
    type: 'spike',
    estimatedHours: 2
  })

  // Category-specific tasks
  switch (category) {
    case 'technical':
      templates.push(
        {
          title: `Implement: ${storyTitle}`,
          description: `Develop and implement: ${storyTitle}`,
          type: 'feature',
          estimatedHours: 8
        },
        {
          title: `Code Review: ${storyTitle}`,
          description: `Conduct code review for: ${storyTitle}`,
          type: 'improvement',
          estimatedHours: 2
        }
      )
      break

    case 'qa':
      templates.push(
        {
          title: `Test Plan: ${storyTitle}`,
          description: `Create test plan for: ${storyTitle}`,
          type: 'documentation',
          estimatedHours: 3
        },
        {
          title: `Execute Tests: ${storyTitle}`,
          description: `Execute test cases for: ${storyTitle}`,
          type: 'feature',
          estimatedHours: 5
        }
      )
      break

    case 'deployment':
      templates.push(
        {
          title: `Configure: ${storyTitle}`,
          description: `Configure deployment settings for: ${storyTitle}`,
          type: 'feature',
          estimatedHours: 4
        },
        {
          title: `Verify: ${storyTitle}`,
          description: `Verify deployment configuration for: ${storyTitle}`,
          type: 'improvement',
          estimatedHours: 2
        }
      )
      break

    case 'documentation':
      templates.push({
        title: `Document: ${storyTitle}`,
        description: `Create comprehensive documentation for: ${storyTitle}`,
        type: 'documentation',
        estimatedHours: 4
      })
      break

    case 'branding':
      templates.push(
        {
          title: `Design: ${storyTitle}`,
          description: `Design assets for: ${storyTitle}`,
          type: 'feature',
          estimatedHours: 6
        },
        {
          title: `Review: ${storyTitle}`,
          description: `Design review and approval for: ${storyTitle}`,
          type: 'improvement',
          estimatedHours: 2
        }
      )
      break

    case 'legal':
      templates.push({
        title: `Legal Review: ${storyTitle}`,
        description: `Legal compliance review for: ${storyTitle}`,
        type: 'documentation',
        estimatedHours: 4
      })
      break

    default:
      templates.push({
        title: `Complete: ${storyTitle}`,
        description: `Complete all requirements for: ${storyTitle}`,
        type: 'feature',
        estimatedHours: 5
      })
  }

  return templates
}

/**
 * Update checklist item completion status based on linked task
 */
export async function updateChecklistItemFromTask(
  checklistItemId: string,
  checklistInstanceId: string,
  taskStatus: TaskStatus
): Promise<void> {
  // When linked task is marked as 'done', mark checklist item as completed
  if (taskStatus === 'done') {
    // API call would go here
    // await fetch(`/api/checklist-items/${checklistItemId}`, {
    //   method: 'PATCH',
    //   body: JSON.stringify({
    //     completed: true,
    //     completedAt: new Date(),
    //     completedBy: 'current-user-id'
    //   })
    // })

    console.log(`Checklist item ${checklistItemId} marked as completed`)
  }
}

/**
 * Get project creation progress
 */
export function getProjectCreationProgress(
  epics: Epic[],
  stories: Story[],
  tasks: Task[]
): {
  totalWorkItems: number
  completedWorkItems: number
  percentComplete: number
  epicProgress: Record<string, { total: number; completed: number }>
} {
  const totalWorkItems = epics.length + stories.length + tasks.length
  const completedWorkItems =
    epics.filter(e => e.status === 'done').length +
    stories.filter(s => s.status === 'done').length +
    tasks.filter(t => t.status === 'done').length

  const percentComplete = totalWorkItems > 0
    ? Math.round((completedWorkItems / totalWorkItems) * 100)
    : 0

  const epicProgress: Record<string, { total: number; completed: number }> = {}

  epics.forEach(epic => {
    const epicStories = stories.filter(s => s.epicId === epic.id)
    const epicTasks = tasks.filter(t => t.epicId === epic.id)
    const total = 1 + epicStories.length + epicTasks.length // +1 for epic itself

    const completed =
      (epic.status === 'done' ? 1 : 0) +
      epicStories.filter(s => s.status === 'done').length +
      epicTasks.filter(t => t.status === 'done').length

    epicProgress[epic.id] = { total, completed }
  })

  return {
    totalWorkItems,
    completedWorkItems,
    percentComplete,
    epicProgress
  }
}
