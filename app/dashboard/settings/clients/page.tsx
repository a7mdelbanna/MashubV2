'use client'

import { useState, useEffect } from 'react'
import { Users, AlertCircle } from 'lucide-react'
import SettingsItemList, { SettingsItem } from '@/components/settings/SettingsItemList'
import SettingsItemForm from '@/components/settings/SettingsItemForm'
import {
  STORAGE_KEYS,
  getSettings,
  addSettingsItem,
  updateSettingsItem,
  deleteSettingsItem,
  toggleSettingsItemActive,
  reorderSettings
} from '@/lib/settings-data'

type TabType = 'sources' | 'industries' | 'tags'

export default function ClientsSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('sources')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SettingsItem | null>(null)

  const [sources, setSources] = useState<SettingsItem[]>([])
  const [industries, setIndustries] = useState<SettingsItem[]>([])
  const [tags, setTags] = useState<SettingsItem[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setSources(getSettings(STORAGE_KEYS.CLIENT_SOURCES))
    setIndustries(getSettings(STORAGE_KEYS.CLIENT_INDUSTRIES))
    setTags(getSettings(STORAGE_KEYS.CLIENT_TAGS))
  }

  const getCurrentData = () => {
    switch (activeTab) {
      case 'sources': return sources
      case 'industries': return industries
      case 'tags': return tags
    }
  }

  const getCurrentStorageKey = () => {
    switch (activeTab) {
      case 'sources': return STORAGE_KEYS.CLIENT_SOURCES
      case 'industries': return STORAGE_KEYS.CLIENT_INDUSTRIES
      case 'tags': return STORAGE_KEYS.CLIENT_TAGS
    }
  }

  const getCurrentConfig = () => {
    const configs = {
      sources: {
        title: 'Client Sources',
        description: 'Track where your clients come from',
        addButtonText: 'Add Source',
        showColor: true,
        showIcon: true
      },
      industries: {
        title: 'Client Industries',
        description: 'Define industry categories for clients',
        addButtonText: 'Add Industry',
        showColor: false,
        showIcon: false
      },
      tags: {
        title: 'Client Tags',
        description: 'Create tags to organize clients',
        addButtonText: 'Add Tag',
        showColor: true,
        showIcon: false
      }
    }
    return configs[activeTab]
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
    { id: 'sources' as TabType, label: 'Sources', count: sources.length },
    { id: 'industries' as TabType, label: 'Industries', count: industries.length },
    { id: 'tags' as TabType, label: 'Tags', count: tags.length }
  ]

  const config = getCurrentConfig()

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600">
            <Users className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Clients Settings</h1>
            <p className="text-gray-400">Configure sources, industries, and tags for clients</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-300 font-medium">Client Organization</p>
            <p className="text-blue-400/80 text-sm mt-1">
              Track client sources for marketing ROI and organize clients by industry and tags.
            </p>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-800">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 border-b-2 transition-colors ${
                activeTab === tab.id ? 'border-purple-500 text-white' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <span className="font-medium">{tab.label}</span>
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? 'bg-purple-500/20 text-purple-300' : 'bg-gray-800 text-gray-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-gray-900/30 backdrop-blur-xl border border-gray-800 p-6">
        <SettingsItemList
          items={getCurrentData()}
          title={config.title}
          description={config.description}
          onAdd={() => { setEditingItem(null); setIsFormOpen(true) }}
          onEdit={(item) => { setEditingItem(item); setIsFormOpen(true) }}
          onDelete={(id) => { deleteSettingsItem(getCurrentStorageKey(), id); loadData() }}
          onToggleActive={(id) => { toggleSettingsItemActive(getCurrentStorageKey(), id); loadData() }}
          onReorder={(newOrder) => { reorderSettings(getCurrentStorageKey(), newOrder); loadData() }}
          showColor={config.showColor}
          showIcon={config.showIcon}
          addButtonText={config.addButtonText}
          emptyMessage={`No ${config.title.toLowerCase()} configured`}
        />
      </div>

      <SettingsItemForm
        item={editingItem}
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingItem(null) }}
        onSave={handleSave}
        title={config.title.replace(/s$/, '')}
        showColor={config.showColor}
        showIcon={config.showIcon}
      />
    </div>
  )
}
