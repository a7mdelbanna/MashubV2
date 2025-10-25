/**
 * Projects Service
 * Comprehensive service layer for all project-related Firestore operations
 * Includes CRUD for projects, tasks, sprints, milestones, time tracking, and more
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  writeBatch,
  increment
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import {
  Project,
  Task,
  Sprint,
  Milestone,
  TimeEntry,
  Comment,
  TeamMember,
  Board,
  ProjectDocument,
  ProjectTimeline,
  ProjectStatus,
  TaskStatus
} from '@/types/projects'

export class ProjectsService {
  // Collection names
  private static readonly PROJECTS_COLLECTION = 'projects'
  private static readonly TASKS_COLLECTION = 'project_tasks'
  private static readonly SPRINTS_COLLECTION = 'sprints'
  private static readonly MILESTONES_COLLECTION = 'project_milestones'
  private static readonly TIME_ENTRIES_COLLECTION = 'time_entries'
  private static readonly COMMENTS_COLLECTION = 'task_comments'
  private static readonly TEAM_MEMBERS_COLLECTION = 'project_team_members'
  private static readonly BOARDS_COLLECTION = 'project_boards'
  private static readonly DOCUMENTS_COLLECTION = 'project_documents'
  private static readonly TIMELINE_COLLECTION = 'project_timeline'

  // ============================================================================
  // PROJECTS CRUD
  // ============================================================================

  /**
   * Get all projects for a tenant
   */
  static async getProjects(tenantId: string): Promise<Project[]> {
    try {
      const q = query(
        collection(db, this.PROJECTS_COLLECTION),
        where('tenantId', '==', tenantId),
        orderBy('createdAt', 'desc')
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Project))
    } catch (error) {
      console.error('Error getting projects:', error)
      throw error
    }
  }

  /**
   * Get a single project by ID
   */
  static async getProject(projectId: string): Promise<Project | null> {
    try {
      const docRef = doc(db, this.PROJECTS_COLLECTION, projectId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) return null

      return { ...docSnap.data(), id: docSnap.id } as Project
    } catch (error) {
      console.error('Error getting project:', error)
      throw error
    }
  }

  /**
   * Create a new project
   */
  static async createProject(
    project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const now = new Date().toISOString()
      const newProject = {
        ...project,
        createdAt: now,
        updatedAt: now
      }

      const docRef = await addDoc(collection(db, this.PROJECTS_COLLECTION), newProject)

      // Log activity
      await this.logTimeline({
        projectId: docRef.id,
        tenantId: project.tenantId,
        type: 'note',
        title: 'Project created',
        description: `Project "${project.name}" was created`,
        userId: project.ownerId,
        userName: project.ownerName || 'Unknown',
        createdAt: now
      })

      return docRef.id
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  }

  /**
   * Update a project
   */
  static async updateProject(
    projectId: string,
    updates: Partial<Omit<Project, 'id' | 'createdAt'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.PROJECTS_COLLECTION, projectId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  }

  /**
   * Delete a project (soft delete - change status to archived)
   */
  static async deleteProject(projectId: string): Promise<void> {
    try {
      const docRef = doc(db, this.PROJECTS_COLLECTION, projectId)
      await updateDoc(docRef, {
        status: 'archived' as ProjectStatus,
        archivedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  }

  /**
   * Subscribe to a single project (real-time)
   */
  static subscribeToProject(
    projectId: string,
    callback: (project: Project | null) => void
  ): () => void {
    const docRef = doc(db, this.PROJECTS_COLLECTION, projectId)

    return onSnapshot(docRef, (snapshot) => {
      if (!snapshot.exists()) {
        callback(null)
        return
      }
      callback({ ...snapshot.data(), id: snapshot.id } as Project)
    })
  }

  /**
   * Subscribe to all projects for a tenant (real-time)
   */
  static subscribeToProjects(
    tenantId: string,
    callback: (projects: Project[]) => void
  ): () => void {
    const q = query(
      collection(db, this.PROJECTS_COLLECTION),
      where('tenantId', '==', tenantId),
      orderBy('createdAt', 'desc')
    )

    return onSnapshot(q, (snapshot) => {
      const projects = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Project))
      callback(projects)
    })
  }

  // ============================================================================
  // TASKS CRUD
  // ============================================================================

  /**
   * Get all tasks for a project
   */
  static async getTasks(projectId: string): Promise<Task[]> {
    try {
      const q = query(
        collection(db, this.TASKS_COLLECTION),
        where('projectId', '==', projectId),
        orderBy('createdAt', 'desc')
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Task))
    } catch (error) {
      console.error('Error getting tasks:', error)
      throw error
    }
  }

  /**
   * Get a single task
   */
  static async getTask(taskId: string): Promise<Task | null> {
    try {
      const docRef = doc(db, this.TASKS_COLLECTION, taskId)
      const docSnap = await getDoc(docRef)

      if (!docSnap.exists()) return null

      return { ...docSnap.data(), id: docSnap.id } as Task
    } catch (error) {
      console.error('Error getting task:', error)
      throw error
    }
  }

  /**
   * Create a new task
   */
  static async createTask(
    task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'commentsCount' | 'attachmentsCount'>
  ): Promise<string> {
    try {
      const now = new Date().toISOString()
      const newTask = {
        ...task,
        commentsCount: 0,
        attachmentsCount: 0,
        createdAt: now,
        updatedAt: now
      }

      const docRef = await addDoc(collection(db, this.TASKS_COLLECTION), newTask)

      // Update project task count
      await this.incrementProjectTaskCount(task.projectId, 1)

      // Log timeline
      await this.logTimeline({
        projectId: task.projectId,
        tenantId: task.tenantId,
        type: 'task',
        title: 'Task created',
        description: task.title,
        entityId: docRef.id,
        userId: task.reporterId,
        userName: task.reporterName || 'Unknown',
        createdAt: now
      })

      return docRef.id
    } catch (error) {
      console.error('Error creating task:', error)
      throw error
    }
  }

  /**
   * Update a task
   */
  static async updateTask(
    taskId: string,
    updates: Partial<Omit<Task, 'id' | 'createdAt'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.TASKS_COLLECTION, taskId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      })

      // If status changed to 'done', update completion metrics
      if (updates.status === 'done' && !updates.completedAt) {
        await updateDoc(docRef, {
          completedAt: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  /**
   * Delete a task
   */
  static async deleteTask(taskId: string, projectId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.TASKS_COLLECTION, taskId))

      // Update project task count
      await this.incrementProjectTaskCount(projectId, -1)
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  /**
   * Subscribe to project tasks (real-time)
   */
  static subscribeToTasks(
    projectId: string,
    callback: (tasks: Task[]) => void
  ): () => void {
    const q = query(
      collection(db, this.TASKS_COLLECTION),
      where('projectId', '==', projectId),
      orderBy('createdAt', 'desc')
    )

    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Task))
      callback(tasks)
    })
  }

  /**
   * Get tasks by status (for Kanban board)
   */
  static subscribeToTasksByStatus(
    projectId: string,
    callback: (tasksByStatus: Record<TaskStatus, Task[]>) => void
  ): () => void {
    const q = query(
      collection(db, this.TASKS_COLLECTION),
      where('projectId', '==', projectId)
    )

    return onSnapshot(q, (snapshot) => {
      const tasks = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Task))

      // Group by status
      const tasksByStatus: Record<TaskStatus, Task[]> = {
        backlog: [],
        todo: [],
        in_progress: [],
        in_review: [],
        done: [],
        blocked: []
      }

      tasks.forEach(task => {
        if (tasksByStatus[task.status]) {
          tasksByStatus[task.status].push(task)
        }
      })

      callback(tasksByStatus)
    })
  }

  // ============================================================================
  // SPRINTS CRUD
  // ============================================================================

  /**
   * Get all sprints for a project
   */
  static async getSprints(projectId: string): Promise<Sprint[]> {
    try {
      const q = query(
        collection(db, this.SPRINTS_COLLECTION),
        where('projectId', '==', projectId),
        orderBy('startDate', 'desc')
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Sprint))
    } catch (error) {
      console.error('Error getting sprints:', error)
      throw error
    }
  }

  /**
   * Create a new sprint
   */
  static async createSprint(
    sprint: Omit<Sprint, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const now = new Date().toISOString()
      const newSprint = {
        ...sprint,
        createdAt: now,
        updatedAt: now
      }

      const docRef = await addDoc(collection(db, this.SPRINTS_COLLECTION), newSprint)

      // Log timeline
      await this.logTimeline({
        projectId: sprint.projectId,
        tenantId: sprint.tenantId,
        type: 'sprint',
        title: 'Sprint created',
        description: sprint.name,
        entityId: docRef.id,
        userId: '', // System action
        userName: 'System',
        createdAt: now
      })

      return docRef.id
    } catch (error) {
      console.error('Error creating sprint:', error)
      throw error
    }
  }

  /**
   * Update a sprint
   */
  static async updateSprint(
    sprintId: string,
    updates: Partial<Omit<Sprint, 'id' | 'createdAt'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.SPRINTS_COLLECTION, sprintId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating sprint:', error)
      throw error
    }
  }

  /**
   * Delete a sprint
   */
  static async deleteSprint(sprintId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.SPRINTS_COLLECTION, sprintId))
    } catch (error) {
      console.error('Error deleting sprint:', error)
      throw error
    }
  }

  /**
   * Subscribe to project sprints (real-time)
   */
  static subscribeToSprints(
    projectId: string,
    callback: (sprints: Sprint[]) => void
  ): () => void {
    const q = query(
      collection(db, this.SPRINTS_COLLECTION),
      where('projectId', '==', projectId),
      orderBy('startDate', 'desc')
    )

    return onSnapshot(q, (snapshot) => {
      const sprints = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Sprint))
      callback(sprints)
    })
  }

  // ============================================================================
  // MILESTONES CRUD
  // ============================================================================

  /**
   * Get all milestones for a project
   */
  static async getMilestones(projectId: string): Promise<Milestone[]> {
    try {
      const q = query(
        collection(db, this.MILESTONES_COLLECTION),
        where('projectId', '==', projectId),
        orderBy('dueDate', 'asc')
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Milestone))
    } catch (error) {
      console.error('Error getting milestones:', error)
      throw error
    }
  }

  /**
   * Create a new milestone
   */
  static async createMilestone(
    milestone: Omit<Milestone, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const now = new Date().toISOString()
      const newMilestone = {
        ...milestone,
        createdAt: now,
        updatedAt: now
      }

      const docRef = await addDoc(collection(db, this.MILESTONES_COLLECTION), newMilestone)

      // Update project milestone count
      await this.incrementProjectMilestoneCount(milestone.projectId, 1)

      // Log timeline
      await this.logTimeline({
        projectId: milestone.projectId,
        tenantId: milestone.tenantId,
        type: 'milestone',
        title: 'Milestone created',
        description: milestone.name,
        entityId: docRef.id,
        userId: '', // System action
        userName: 'System',
        createdAt: now
      })

      return docRef.id
    } catch (error) {
      console.error('Error creating milestone:', error)
      throw error
    }
  }

  /**
   * Update a milestone
   */
  static async updateMilestone(
    milestoneId: string,
    updates: Partial<Omit<Milestone, 'id' | 'createdAt'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.MILESTONES_COLLECTION, milestoneId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating milestone:', error)
      throw error
    }
  }

  /**
   * Delete a milestone
   */
  static async deleteMilestone(milestoneId: string, projectId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.MILESTONES_COLLECTION, milestoneId))

      // Update project milestone count
      await this.incrementProjectMilestoneCount(projectId, -1)
    } catch (error) {
      console.error('Error deleting milestone:', error)
      throw error
    }
  }

  /**
   * Subscribe to project milestones (real-time)
   */
  static subscribeToMilestones(
    projectId: string,
    callback: (milestones: Milestone[]) => void
  ): () => void {
    const q = query(
      collection(db, this.MILESTONES_COLLECTION),
      where('projectId', '==', projectId),
      orderBy('dueDate', 'asc')
    )

    return onSnapshot(q, (snapshot) => {
      const milestones = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Milestone))
      callback(milestones)
    })
  }

  // ============================================================================
  // TIME ENTRIES CRUD
  // ============================================================================

  /**
   * Get time entries for a project
   */
  static async getTimeEntries(projectId: string): Promise<TimeEntry[]> {
    try {
      const q = query(
        collection(db, this.TIME_ENTRIES_COLLECTION),
        where('projectId', '==', projectId),
        orderBy('startTime', 'desc')
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as TimeEntry))
    } catch (error) {
      console.error('Error getting time entries:', error)
      throw error
    }
  }

  /**
   * Create a time entry
   */
  static async createTimeEntry(
    entry: Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const now = new Date().toISOString()
      const newEntry = {
        ...entry,
        createdAt: now,
        updatedAt: now
      }

      const docRef = await addDoc(collection(db, this.TIME_ENTRIES_COLLECTION), newEntry)

      // Update project actual hours
      if (entry.duration) {
        await this.addActualHours(entry.projectId, entry.duration / 60) // Convert minutes to hours
      }

      return docRef.id
    } catch (error) {
      console.error('Error creating time entry:', error)
      throw error
    }
  }

  /**
   * Update a time entry
   */
  static async updateTimeEntry(
    entryId: string,
    updates: Partial<Omit<TimeEntry, 'id' | 'createdAt'>>
  ): Promise<void> {
    try {
      const docRef = doc(db, this.TIME_ENTRIES_COLLECTION, entryId)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating time entry:', error)
      throw error
    }
  }

  /**
   * Delete a time entry
   */
  static async deleteTimeEntry(entryId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.TIME_ENTRIES_COLLECTION, entryId))
    } catch (error) {
      console.error('Error deleting time entry:', error)
      throw error
    }
  }

  /**
   * Subscribe to time entries (real-time)
   */
  static subscribeToTimeEntries(
    projectId: string,
    callback: (entries: TimeEntry[]) => void
  ): () => void {
    const q = query(
      collection(db, this.TIME_ENTRIES_COLLECTION),
      where('projectId', '==', projectId),
      orderBy('startTime', 'desc'),
      limit(100)
    )

    return onSnapshot(q, (snapshot) => {
      const entries = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as TimeEntry))
      callback(entries)
    })
  }

  // ============================================================================
  // COMMENTS CRUD
  // ============================================================================

  /**
   * Get comments for a task
   */
  static async getComments(taskId: string): Promise<Comment[]> {
    try {
      const q = query(
        collection(db, this.COMMENTS_COLLECTION),
        where('taskId', '==', taskId),
        orderBy('createdAt', 'asc')
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Comment))
    } catch (error) {
      console.error('Error getting comments:', error)
      throw error
    }
  }

  /**
   * Add a comment to a task
   */
  static async addComment(
    comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt' | 'isEdited'>
  ): Promise<string> {
    try {
      const now = new Date().toISOString()
      const newComment = {
        ...comment,
        isEdited: false,
        createdAt: now,
        updatedAt: now
      }

      const docRef = await addDoc(collection(db, this.COMMENTS_COLLECTION), newComment)

      // Increment task comment count
      const taskRef = doc(db, this.TASKS_COLLECTION, comment.taskId)
      await updateDoc(taskRef, {
        commentsCount: increment(1)
      })

      return docRef.id
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }

  /**
   * Update a comment
   */
  static async updateComment(
    commentId: string,
    content: string
  ): Promise<void> {
    try {
      const docRef = doc(db, this.COMMENTS_COLLECTION, commentId)
      await updateDoc(docRef, {
        content,
        isEdited: true,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error updating comment:', error)
      throw error
    }
  }

  /**
   * Delete a comment
   */
  static async deleteComment(commentId: string, taskId: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.COMMENTS_COLLECTION, commentId))

      // Decrement task comment count
      const taskRef = doc(db, this.TASKS_COLLECTION, taskId)
      await updateDoc(taskRef, {
        commentsCount: increment(-1)
      })
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw error
    }
  }

  /**
   * Subscribe to task comments (real-time)
   */
  static subscribeToComments(
    taskId: string,
    callback: (comments: Comment[]) => void
  ): () => void {
    const q = query(
      collection(db, this.COMMENTS_COLLECTION),
      where('taskId', '==', taskId),
      orderBy('createdAt', 'asc')
    )

    return onSnapshot(q, (snapshot) => {
      const comments = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Comment))
      callback(comments)
    })
  }

  // ============================================================================
  // PROJECT TIMELINE
  // ============================================================================

  /**
   * Get project timeline/activity log
   */
  static async getTimeline(projectId: string, limitCount: number = 50): Promise<ProjectTimeline[]> {
    try {
      const q = query(
        collection(db, this.TIMELINE_COLLECTION),
        where('projectId', '==', projectId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ProjectTimeline))
    } catch (error) {
      console.error('Error getting timeline:', error)
      throw error
    }
  }

  /**
   * Log a timeline event
   */
  static async logTimeline(
    event: Omit<ProjectTimeline, 'id'>
  ): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.TIMELINE_COLLECTION), event)
      return docRef.id
    } catch (error) {
      console.error('Error logging timeline:', error)
      throw error
    }
  }

  /**
   * Subscribe to project timeline (real-time)
   */
  static subscribeToTimeline(
    projectId: string,
    callback: (timeline: ProjectTimeline[]) => void,
    limitCount: number = 50
  ): () => void {
    const q = query(
      collection(db, this.TIMELINE_COLLECTION),
      where('projectId', '==', projectId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )

    return onSnapshot(q, (snapshot) => {
      const timeline = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as ProjectTimeline))
      callback(timeline)
    })
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  /**
   * Increment/decrement project task count
   */
  private static async incrementProjectTaskCount(projectId: string, delta: number): Promise<void> {
    const projectRef = doc(db, this.PROJECTS_COLLECTION, projectId)
    await updateDoc(projectRef, {
      tasksTotal: increment(delta),
      updatedAt: new Date().toISOString()
    })
  }

  /**
   * Increment/decrement project milestone count
   */
  private static async incrementProjectMilestoneCount(projectId: string, delta: number): Promise<void> {
    const projectRef = doc(db, this.PROJECTS_COLLECTION, projectId)
    await updateDoc(projectRef, {
      milestonesTotal: increment(delta),
      updatedAt: new Date().toISOString()
    })
  }

  /**
   * Add actual hours to project
   */
  private static async addActualHours(projectId: string, hours: number): Promise<void> {
    const projectRef = doc(db, this.PROJECTS_COLLECTION, projectId)
    await updateDoc(projectRef, {
      actualHours: increment(hours),
      updatedAt: new Date().toISOString()
    })
  }

  /**
   * Update project completion percentage based on tasks
   */
  static async updateProjectProgress(projectId: string): Promise<void> {
    try {
      const tasks = await this.getTasks(projectId)

      if (tasks.length === 0) {
        await this.updateProject(projectId, { completionPercentage: 0 })
        return
      }

      const completedTasks = tasks.filter(t => t.status === 'done').length
      const completionPercentage = Math.round((completedTasks / tasks.length) * 100)

      await this.updateProject(projectId, {
        completionPercentage,
        tasksCompleted: completedTasks
      })
    } catch (error) {
      console.error('Error updating project progress:', error)
      throw error
    }
  }
}

export const projectsService = ProjectsService
