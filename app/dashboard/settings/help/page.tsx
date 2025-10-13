'use client'

import { useState, useEffect } from 'react'
import { HelpCircle, AlertCircle } from 'lucide-react'
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

type TabType = 'categories' | 'priorities'

export default function HelpSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('categories')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SettingsItem | null>(null)

  const [categories, setCategories] = useState<SettingsItem[]>([])
  const [priorities, setPriorities] = useState<SettingsItem[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setCategories(getSettings(STORAGE_KEYS.TICKET_CATEGORIES))
    setPriorities(getSettings(STORAGE_KEYS.TICKET_PRIORITIES))
  }

  const getCurrentData = () => activeTab === 'categories' ? categories : priorities
  const getCurrentStorageKey = () => activeTab === 'categories' ? STORAGE_KEYS.TICKET_CATEGORIES : STORAGE_KEYS.TICKET_PRIORITIES

  const getCurrentConfig = () => {
    return activeTab === 'categories' ? {
      title: 'Ticket Categories',
      description: 'Organize support tickets by category',
      addButtonText: 'Add Category',
      showColor: true
    } : {
      title: 'Ticket Priorities',
      description: 'Define priority levels for support tickets',
      addButtonText: 'Add Priority',
      showColor: true
    }
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
    { id: 'categories' as TabType, label: 'Ticket Categories', count: categories.length },
    { id: 'priorities' as TabType, label: 'Ticket Priorities', count: priorities.length }
  ]

  const config = getCurrentConfig()

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600">
            <HelpCircle className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Help & Support Settings</h1>
            <p className="text-gray-400">Configure ticket categories and priorities</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-300 font-medium">Support Configuration</p>
            <p className="text-blue-400/80 text-sm mt-1">
              Organize support tickets and set priorities to ensure proper routing and SLA compliance.
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
      />
    </div>
  )
}
