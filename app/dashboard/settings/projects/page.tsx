'use client'

import { useState, useEffect } from 'react'
import { Briefcase, AlertCircle } from 'lucide-react'
import SettingsItemList, { SettingsItem } from '@/components/settings/SettingsItemList'
import SettingsItemForm, { FormField } from '@/components/settings/SettingsItemForm'
import {
  STORAGE_KEYS,
  getSettings,
  addSettingsItem,
  updateSettingsItem,
  deleteSettingsItem,
  toggleSettingsItemActive,
  reorderSettings
} from '@/lib/settings-data'

type TabType = 'statuses' | 'priorities' | 'tags' | 'taskTypes'

export default function ProjectsSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('statuses')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SettingsItem | null>(null)

  // Data states
  const [statuses, setStatuses] = useState<SettingsItem[]>([])
  const [priorities, setPriorities] = useState<SettingsItem[]>([])
  const [tags, setTags] = useState<SettingsItem[]>([])
  const [taskTypes, setTaskTypes] = useState<SettingsItem[]>([])

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setStatuses(getSettings(STORAGE_KEYS.PROJECT_STATUSES))
    setPriorities(getSettings(STORAGE_KEYS.PROJECT_PRIORITIES))
    setTags(getSettings(STORAGE_KEYS.PROJECT_TAGS))
    setTaskTypes(getSettings(STORAGE_KEYS.TASK_TYPES))
  }

  const getCurrentData = () => {
    switch (activeTab) {
      case 'statuses': return statuses
      case 'priorities': return priorities
      case 'tags': return tags
      case 'taskTypes': return taskTypes
    }
  }

  const getCurrentStorageKey = () => {
    switch (activeTab) {
      case 'statuses': return STORAGE_KEYS.PROJECT_STATUSES
      case 'priorities': return STORAGE_KEYS.PROJECT_PRIORITIES
      case 'tags': return STORAGE_KEYS.PROJECT_TAGS
      case 'taskTypes': return STORAGE_KEYS.TASK_TYPES
    }
  }

  const getCurrentConfig = () => {
    const configs = {
      statuses: {
        title: 'Project Statuses',
        description: 'Manage the status workflow for your projects',
        addButtonText: 'Add Status',
        emptyMessage: 'No statuses configured',
        showColor: true,
        showIcon: false
      },
      priorities: {
        title: 'Project Priorities',
        description: 'Define priority levels for project importance',
        addButtonText: 'Add Priority',
        emptyMessage: 'No priorities configured',
        showColor: true,
        showIcon: false
      },
      tags: {
        title: 'Project Tags',
        description: 'Create tags to categorize and organize projects',
        addButtonText: 'Add Tag',
        emptyMessage: 'No tags configured',
        showColor: true,
        showIcon: false
      },
      taskTypes: {
        title: 'Task Types',
        description: 'Define different types of tasks for project management',
        addButtonText: 'Add Task Type',
        emptyMessage: 'No task types configured',
        showColor: true,
        showIcon: true
      }
    }
    return configs[activeTab]
  }

  const handleAdd = () => {
    setEditingItem(null)
    setIsFormOpen(true)
  }

  const handleEdit = (item: SettingsItem) => {
    setEditingItem(item)
    setIsFormOpen(true)
  }

  const handleDelete = (id: string) => {
    const storageKey = getCurrentStorageKey()
    deleteSettingsItem(storageKey, id)
    loadData()
  }

  const handleToggleActive = (id: string) => {
    const storageKey = getCurrentStorageKey()
    toggleSettingsItemActive(storageKey, id)
    loadData()
  }

  const handleReorder = (newOrder: SettingsItem[]) => {
    const storageKey = getCurrentStorageKey()
    reorderSettings(storageKey, newOrder)
    loadData()
  }

  const handleSave = (data: Partial<SettingsItem>) => {
    const storageKey = getCurrentStorageKey()

    if (editingItem) {
      updateSettingsItem(storageKey, editingItem.id, data)
    } else {
      addSettingsItem(storageKey, data)
    }

    loadData()
    setIsFormOpen(false)
    setEditingItem(null)
  }

  const tabs = [
    { id: 'statuses' as TabType, label: 'Statuses', count: statuses.length },
    { id: 'priorities' as TabType, label: 'Priorities', count: priorities.length },
    { id: 'tags' as TabType, label: 'Tags', count: tags.length },
    { id: 'taskTypes' as TabType, label: 'Task Types', count: taskTypes.length }
  ]

  const config = getCurrentConfig()
  const currentData = getCurrentData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Projects Settings</h1>
            <p className="text-gray-400">Configure statuses, priorities, tags, and task types</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-300 font-medium">Configure Your Project Settings</p>
            <p className="text-blue-400/80 text-sm mt-1">
              These settings will be used across all project-related features. Changes take effect immediately.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 border-b-2 transition-colors relative ${
                activeTab === tab.id
                  ? 'border-purple-500 text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <span className="font-medium">{tab.label}</span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id
                  ? 'bg-purple-500/20 text-purple-300'
                  : 'bg-gray-800 text-gray-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="rounded-2xl bg-gray-900/30 backdrop-blur-xl border border-gray-800 p-6">
        <SettingsItemList
          items={currentData}
          title={config.title}
          description={config.description}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onToggleActive={handleToggleActive}
          onReorder={handleReorder}
          showColor={config.showColor}
          showIcon={config.showIcon}
          showUsage={false}
          addButtonText={config.addButtonText}
          emptyMessage={config.emptyMessage}
        />
      </div>

      {/* Form Modal */}
      <SettingsItemForm
        item={editingItem}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingItem(null)
        }}
        onSave={handleSave}
        title={config.title.replace(/s$/, '')}
        showColor={config.showColor}
        showIcon={config.showIcon}
        showSlug={true}
      />
    </div>
  )
}
