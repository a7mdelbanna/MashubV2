'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Settings, DollarSign, Bell, Shield, Database } from 'lucide-react'
import { cn } from '@/lib/utils'
import PricingTab from './pricing-tab'

type Tab = 'general' | 'pricing' | 'notifications' | 'security'

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<Tab>('pricing')

  if (!user?.isSuperAdmin) {
    router.push('/superadmin')
    return null
  }

  const tabs = [
    { id: 'general' as Tab, label: 'General', icon: Settings },
    { id: 'pricing' as Tab, label: 'Pricing Plans', icon: DollarSign },
    { id: 'notifications' as Tab, label: 'Notifications', icon: Bell },
    { id: 'security' as Tab, label: 'Security', icon: Shield }
  ]

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 mt-1">Manage SuperAdmin settings and configuration</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-800">
        <div className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center space-x-2 px-1 py-4 border-b-2 transition-all',
                  activeTab === tab.id
                    ? 'border-purple-500 text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'general' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">General Settings</h2>
            <p className="text-gray-400">General settings will be implemented here.</p>
          </div>
        )}

        {activeTab === 'pricing' && <PricingTab />}

        {activeTab === 'notifications' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Notification Settings</h2>
            <p className="text-gray-400">Notification settings will be implemented here.</p>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Security Settings</h2>
            <p className="text-gray-400">Security settings will be implemented here.</p>
          </div>
        )}
      </div>
    </div>
  )
}
