/**
 * Firebase Data Converters
 *
 * Handles conversion between Firestore data format and TypeScript types
 * - Firestore uses Timestamp objects
 * - TypeScript types use ISO date strings
 * - Converters handle bidirectional transformation
 */

import { Timestamp, DocumentData, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore'
import type { Project, App } from '@/types'
import type {
  FirestoreProject,
  FirestoreApp,
  FirestoreClient,
  FirestorePricingCatalogItem,
  FirestoreFeatureAddon,
  FirestoreTask,
  FirestoreSprint,
  FirestoreMilestone,
  FirestoreEpic,
  FirestoreStory,
  FirestoreEmployee,
  FirestoreProjectTeamMember
} from './firebase-schema'

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert Firestore Timestamp to ISO string
 */
export function timestampToString(timestamp: Timestamp | string | undefined | null): string {
  if (!timestamp) return new Date().toISOString()
  if (typeof timestamp === 'string') return timestamp
  return timestamp.toDate().toISOString()
}

/**
 * Convert ISO string to Firestore Timestamp
 */
export function stringToTimestamp(dateString: string | undefined): Timestamp {
  if (!dateString) return Timestamp.now()
  return Timestamp.fromDate(new Date(dateString))
}

/**
 * Convert Date object to ISO string
 */
export function dateToString(date: Date | string | undefined): string {
  if (!date) return new Date().toISOString()
  if (typeof date === 'string') return date
  return date.toISOString()
}

// ============================================================================
// PROJECT CONVERTER
// ============================================================================

/**
 * Firestore data converter for Projects
 * Handles conversion between Project (frontend) and FirestoreProject (database)
 */
export const projectConverter = {
  /**
   * Convert Project to Firestore format
   * Removes populated arrays (apps, pricingCatalog, etc.)
   */
  toFirestore(project: Partial<Project>): DocumentData {
    const {
      apps,
      pricingCatalog,
      checklistTemplates,
      checklistInstances,
      team,
      ...firestoreData
    } = project

    // Convert date strings to Timestamps if needed
    const data: any = {
      ...firestoreData,
      startDate: firestoreData.startDate,
      dueDate: firestoreData.dueDate,
      endDate: firestoreData.endDate,
      createdAt: firestoreData.createdAt,
      updatedAt: firestoreData.updatedAt,
      completedAt: firestoreData.completedAt,
      archivedAt: firestoreData.archivedAt,
    }

    // Handle currentSprint dates
    if (data.currentSprint) {
      data.currentSprint = {
        ...data.currentSprint,
        startDate: data.currentSprint.startDate,
        endDate: data.currentSprint.endDate,
      }
    }

    return data
  },

  /**
   * Convert Firestore data to Project format
   * NOTE: apps array is NOT populated here - use getProject() query
   */
  fromFirestore(
    snapshot: QueryDocumentSnapshot<FirestoreProject>,
    options?: SnapshotOptions
  ): FirestoreProject {
    const data = snapshot.data(options)

    return {
      ...data,
      id: snapshot.id,
      // Dates already as strings in Firestore
      startDate: data.startDate,
      dueDate: data.dueDate,
      endDate: data.endDate,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      completedAt: data.completedAt,
      archivedAt: data.archivedAt,
    }
  }
}

// ============================================================================
// APP CONVERTER
// ============================================================================

/**
 * Firestore data converter for Apps
 */
export const appConverter = {
  /**
   * Convert App to Firestore format
   */
  toFirestore(app: Partial<App>): DocumentData {
    const data: any = {
      ...app,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
      lastDeployedAt: app.lastDeployedAt,
    }

    // Handle environment dates
    if (data.environments) {
      Object.keys(data.environments).forEach(env => {
        if (data.environments[env]?.lastDeployed) {
          data.environments[env].lastDeployed = data.environments[env].lastDeployed
        }
      })
    }

    // Handle release dates
    if (data.releases) {
      if (data.releases.current?.releaseDate) {
        data.releases.current.releaseDate = data.releases.current.releaseDate
      }
      if (data.releases.upcoming?.targetDate) {
        data.releases.upcoming.targetDate = data.releases.upcoming.targetDate
      }
      if (data.releases.history) {
        data.releases.history = data.releases.history.map((release: any) => ({
          ...release,
          releaseDate: release.releaseDate
        }))
      }
    }

    // Handle pricing appliedAt
    if (data.pricing?.appliedAt) {
      data.pricing.appliedAt = data.pricing.appliedAt
    }

    // Handle health lastChecked
    if (data.health?.lastChecked) {
      data.health.lastChecked = data.health.lastChecked
    }

    return data
  },

  /**
   * Convert Firestore data to App format
   */
  fromFirestore(
    snapshot: QueryDocumentSnapshot<FirestoreApp>,
    options?: SnapshotOptions
  ): FirestoreApp {
    const data = snapshot.data(options)

    return {
      ...data,
      id: snapshot.id,
    }
  }
}

// ============================================================================
// CLIENT CONVERTER
// ============================================================================

/**
 * Firestore data converter for Clients
 */
export const clientConverter = {
  toFirestore(client: Partial<FirestoreClient>): DocumentData {
    return {
      ...client,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
      lastContactDate: client.lastContactDate,
    }
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot<FirestoreClient>,
    options?: SnapshotOptions
  ): FirestoreClient {
    const data = snapshot.data(options)
    return {
      ...data,
      id: snapshot.id,
    }
  }
}

// ============================================================================
// PRICING CATALOG CONVERTER
// ============================================================================

/**
 * Firestore data converter for Pricing Catalog Items
 */
export const pricingCatalogConverter = {
  toFirestore(item: Partial<FirestorePricingCatalogItem>): DocumentData {
    return {
      ...item,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot<FirestorePricingCatalogItem>,
    options?: SnapshotOptions
  ): FirestorePricingCatalogItem {
    const data = snapshot.data(options)
    return {
      ...data,
      id: snapshot.id,
    }
  }
}

// ============================================================================
// FEATURE ADDON CONVERTER
// ============================================================================

/**
 * Firestore data converter for Feature Addons
 */
export const featureAddonConverter = {
  toFirestore(addon: Partial<FirestoreFeatureAddon>): DocumentData {
    return {
      ...addon,
      createdAt: addon.createdAt,
      updatedAt: addon.updatedAt,
    }
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot<FirestoreFeatureAddon>,
    options?: SnapshotOptions
  ): FirestoreFeatureAddon {
    const data = snapshot.data(options)
    return {
      ...data,
      id: snapshot.id,
    }
  }
}

// ============================================================================
// TASK CONVERTER
// ============================================================================

/**
 * Firestore data converter for Tasks
 */
export const taskConverter = {
  toFirestore(task: Partial<FirestoreTask>): DocumentData {
    return {
      ...task,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot<FirestoreTask>,
    options?: SnapshotOptions
  ): FirestoreTask {
    const data = snapshot.data(options)
    return {
      ...data,
      id: snapshot.id,
    }
  }
}

// ============================================================================
// SPRINT CONVERTER
// ============================================================================

/**
 * Firestore data converter for Sprints
 */
export const sprintConverter = {
  toFirestore(sprint: Partial<FirestoreSprint>): DocumentData {
    return {
      ...sprint,
      createdAt: sprint.createdAt,
      updatedAt: sprint.updatedAt,
    }
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot<FirestoreSprint>,
    options?: SnapshotOptions
  ): FirestoreSprint {
    const data = snapshot.data(options)
    return {
      ...data,
      id: snapshot.id,
    }
  }
}

// ============================================================================
// MILESTONE CONVERTER
// ============================================================================

/**
 * Firestore data converter for Milestones
 */
export const milestoneConverter = {
  toFirestore(milestone: Partial<FirestoreMilestone>): DocumentData {
    return {
      ...milestone,
      createdAt: milestone.createdAt,
      updatedAt: milestone.updatedAt,
    }
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot<FirestoreMilestone>,
    options?: SnapshotOptions
  ): FirestoreMilestone {
    const data = snapshot.data(options)
    return {
      ...data,
      id: snapshot.id,
    }
  }
}

// ============================================================================
// EPIC CONVERTER
// ============================================================================

/**
 * Firestore data converter for Epics
 */
export const epicConverter = {
  toFirestore(epic: Partial<FirestoreEpic>): DocumentData {
    return {
      ...epic,
      createdAt: epic.createdAt,
      updatedAt: epic.updatedAt,
    }
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot<FirestoreEpic>,
    options?: SnapshotOptions
  ): FirestoreEpic {
    const data = snapshot.data(options)
    return {
      ...data,
      id: snapshot.id,
    }
  }
}

// ============================================================================
// STORY CONVERTER
// ============================================================================

/**
 * Firestore data converter for Stories
 */
export const storyConverter = {
  toFirestore(story: Partial<FirestoreStory>): DocumentData {
    return {
      ...story,
      createdAt: story.createdAt,
      updatedAt: story.updatedAt,
    }
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot<FirestoreStory>,
    options?: SnapshotOptions
  ): FirestoreStory {
    const data = snapshot.data(options)
    return {
      ...data,
      id: snapshot.id,
    }
  }
}

// ============================================================================
// EMPLOYEE CONVERTER
// ============================================================================

/**
 * Firestore data converter for Employees
 */
export const employeeConverter = {
  toFirestore(employee: Partial<FirestoreEmployee>): DocumentData {
    return {
      ...employee,
      hireDate: employee.hireDate,
      terminationDate: employee.terminationDate,
      dateOfBirth: employee.dateOfBirth,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    }
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot<FirestoreEmployee>,
    options?: SnapshotOptions
  ): FirestoreEmployee {
    const data = snapshot.data(options)
    return {
      ...data,
      id: snapshot.id,
    }
  }
}

// ============================================================================
// PROJECT TEAM MEMBER CONVERTER
// ============================================================================

/**
 * Firestore data converter for Project Team Members
 */
export const projectTeamMemberConverter = {
  toFirestore(member: Partial<FirestoreProjectTeamMember>): DocumentData {
    return {
      ...member,
      startDate: member.startDate,
      endDate: member.endDate,
      assignedAt: member.assignedAt,
      updatedAt: member.updatedAt,
      lastActiveAt: member.lastActiveAt,
    }
  },

  fromFirestore(
    snapshot: QueryDocumentSnapshot<FirestoreProjectTeamMember>,
    options?: SnapshotOptions
  ): FirestoreProjectTeamMember {
    const data = snapshot.data(options)
    return {
      ...data,
      id: snapshot.id,
    }
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Convert any Firestore document to typed object
 * Useful for generic conversions
 */
export function firestoreDocToObject<T>(
  snapshot: QueryDocumentSnapshot,
  options?: SnapshotOptions
): T & { id: string } {
  const data = snapshot.data(options) as T
  return {
    ...data,
    id: snapshot.id,
  }
}

/**
 * Batch convert Firestore array to typed array
 */
export function firestoreArrayToObjects<T>(
  snapshots: QueryDocumentSnapshot[]
): Array<T & { id: string }> {
  return snapshots.map(snapshot => firestoreDocToObject<T>(snapshot))
}

/**
 * Prepare object for Firestore write (set server timestamps)
 */
export function prepareForCreate<T extends Record<string, any>>(
  data: T,
  tenantId: string
): T & { tenantId: string; createdAt: string; updatedAt: string } {
  const now = new Date().toISOString()
  return {
    ...data,
    tenantId,
    createdAt: now,
    updatedAt: now,
  }
}

/**
 * Prepare object for Firestore update (update timestamp)
 */
export function prepareForUpdate<T extends Record<string, any>>(
  data: Partial<T>
): Partial<T> & { updatedAt: string } {
  return {
    ...data,
    updatedAt: new Date().toISOString(),
  }
}

/**
 * Strip undefined values from object (Firestore doesn't accept undefined)
 */
export function stripUndefined<T extends Record<string, any>>(obj: T): T {
  const cleaned: any = {}
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key]
    }
  })
  return cleaned as T
}

// ============================================================================
// EXPORT ALL CONVERTERS
// ============================================================================

export const converters = {
  project: projectConverter,
  app: appConverter,
  client: clientConverter,
  pricingCatalog: pricingCatalogConverter,
  featureAddon: featureAddonConverter,
  task: taskConverter,
  sprint: sprintConverter,
  milestone: milestoneConverter,
  epic: epicConverter,
  story: storyConverter,
  employee: employeeConverter,
  projectTeamMember: projectTeamMemberConverter,
}

export default converters
