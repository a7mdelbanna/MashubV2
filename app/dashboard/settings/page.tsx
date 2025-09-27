'use client'

import { useState } from 'react'
import {
  Settings, User, Bell, Shield, Globe, Palette, Database,
  Save, RefreshCw, Download, Upload, Key, Mail, Phone, MapPin,
  Building, CreditCard, Zap, AlertTriangle, CheckCircle,
  Eye, EyeOff, Plus, X, Edit, Trash2, Monitor, Smartphone,
  Calendar, Clock, Languages, DollarSign, Tag, Link as LinkIcon
} from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('company')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Form states
  const [companySettings, setCompanySettings] = useState({
    name: 'Mashub Technologies',
    email: 'contact@mashub.com',
    phone: '+1 (555) 123-4567',
    website: 'https://mashub.com',
    address: {
      street: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'United States'
    },
    taxId: 'XX-XXXXXXX',
    industry: 'Technology',
    employeeCount: '50-100',
    timezone: 'America/Los_Angeles',
    currency: 'USD',
    language: 'English'
  })

  const [userPreferences, setUserPreferences] = useState({
    theme: 'dark',
    language: 'English',
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    currency: 'USD',
    notifications: {
      email: true,
      push: true,
      sms: false,
      desktop: true
    },
    dashboard: {
      defaultView: 'overview',
      itemsPerPage: 25,
      autoRefresh: true,
      showTips: true
    }
  })

  const [integrations, setIntegrations] = useState([
    { name: 'Slack', status: 'connected', description: 'Team communication platform', icon: 'SL' },
    { name: 'Google Workspace', status: 'connected', description: 'Email and productivity suite', icon: 'GW' },
    { name: 'Stripe', status: 'connected', description: 'Payment processing', icon: 'ST' },
    { name: 'AWS', status: 'disconnected', description: 'Cloud infrastructure', icon: 'AW' },
    { name: 'GitHub', status: 'connected', description: 'Code repository management', icon: 'GH' },
    { name: 'Zoom', status: 'disconnected', description: 'Video conferencing', icon: 'ZM' }
  ])

  const [apiKeys, setApiKeys] = useState([
    { name: 'Production API', key: 'sk_live_***************', created: '2024-01-15', lastUsed: '2024-03-20' },
    { name: 'Development API', key: 'sk_test_***************', created: '2024-02-10', lastUsed: '2024-03-19' },
    { name: 'Webhook API', key: 'whk_***************', created: '2024-03-01', lastUsed: '2024-03-18' }
  ])

  const tabs = [
    { id: 'company', label: 'Company Profile', icon: Building },
    { id: 'user', label: 'User Preferences', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'integrations', label: 'Integrations', icon: Zap },
    { id: 'api', label: 'API & Webhooks', icon: Key },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard }
  ]

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    // Show success message
  }

  const handleExportData = () => {
    // Export user data
    console.log('Exporting data...')
  }

  const handleDeleteAccount = () => {
    // Show confirmation dialog
    console.log('Delete account...')
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Manage your account, preferences, and integrations</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportData}
            className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-800 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export Data</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className="w-64 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          {/* Company Profile Tab */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Company Profile</h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={companySettings.name}
                    onChange={(e) => setCompanySettings({...companySettings, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
                  <select
                    value={companySettings.industry}
                    onChange={(e) => setCompanySettings({...companySettings, industry: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  >
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Retail">Retail</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={companySettings.email}
                      onChange={(e) => setCompanySettings({...companySettings, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={companySettings.phone}
                      onChange={(e) => setCompanySettings({...companySettings, phone: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="url"
                      value={companySettings.website}
                      onChange={(e) => setCompanySettings({...companySettings, website: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">Address</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={companySettings.address.street}
                    onChange={(e) => setCompanySettings({
                      ...companySettings,
                      address: {...companySettings.address, street: e.target.value}
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={companySettings.address.city}
                      onChange={(e) => setCompanySettings({
                        ...companySettings,
                        address: {...companySettings.address, city: e.target.value}
                      })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={companySettings.address.state}
                      onChange={(e) => setCompanySettings({
                        ...companySettings,
                        address: {...companySettings.address, state: e.target.value}
                      })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    />
                    <input
                      type="text"
                      placeholder="ZIP Code"
                      value={companySettings.address.zipCode}
                      onChange={(e) => setCompanySettings({
                        ...companySettings,
                        address: {...companySettings.address, zipCode: e.target.value}
                      })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">Regional Settings</h3>
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                    <select
                      value={companySettings.timezone}
                      onChange={(e) => setCompanySettings({...companySettings, timezone: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    >
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/New_York">Eastern Time</option>
                      <option value="Europe/London">London</option>
                      <option value="Europe/Paris">Paris</option>
                      <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                    <select
                      value={companySettings.currency}
                      onChange={(e) => setCompanySettings({...companySettings, currency: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
                    <select
                      value={companySettings.language}
                      onChange={(e) => setCompanySettings({...companySettings, language: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    >
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                      <option value="French">French</option>
                      <option value="German">German</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Japanese">Japanese</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Preferences Tab */}
          {activeTab === 'user' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">User Preferences</h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setUserPreferences({...userPreferences, theme: 'dark'})}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        userPreferences.theme === 'dark'
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <Monitor className="h-6 w-6 text-white mx-auto mb-2" />
                      <p className="text-white text-sm">Dark</p>
                    </button>
                    <button
                      onClick={() => setUserPreferences({...userPreferences, theme: 'light'})}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        userPreferences.theme === 'light'
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <Monitor className="h-6 w-6 text-white mx-auto mb-2" />
                      <p className="text-white text-sm">Light</p>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Default Dashboard View</label>
                  <select
                    value={userPreferences.dashboard.defaultView}
                    onChange={(e) => setUserPreferences({
                      ...userPreferences,
                      dashboard: {...userPreferences.dashboard, defaultView: e.target.value}
                    })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  >
                    <option value="overview">Overview</option>
                    <option value="projects">Projects</option>
                    <option value="clients">Clients</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Date Format</label>
                  <select
                    value={userPreferences.dateFormat}
                    onChange={(e) => setUserPreferences({...userPreferences, dateFormat: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time Format</label>
                  <select
                    value={userPreferences.timeFormat}
                    onChange={(e) => setUserPreferences({...userPreferences, timeFormat: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  >
                    <option value="12">12 Hour (AM/PM)</option>
                    <option value="24">24 Hour</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">Dashboard Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Auto-refresh Dashboard</p>
                      <p className="text-sm text-gray-400">Automatically update data every 5 minutes</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userPreferences.dashboard.autoRefresh}
                        onChange={(e) => setUserPreferences({
                          ...userPreferences,
                          dashboard: {...userPreferences.dashboard, autoRefresh: e.target.checked}
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Show Tips & Tutorials</p>
                      <p className="text-sm text-gray-400">Display helpful tips for new features</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={userPreferences.dashboard.showTips}
                        onChange={(e) => setUserPreferences({
                          ...userPreferences,
                          dashboard: {...userPreferences.dashboard, showTips: e.target.checked}
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Items per Page</label>
                    <select
                      value={userPreferences.dashboard.itemsPerPage}
                      onChange={(e) => setUserPreferences({
                        ...userPreferences,
                        dashboard: {...userPreferences.dashboard, itemsPerPage: parseInt(e.target.value)}
                      })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all max-w-xs"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Notification Preferences</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Communication Channels</h3>
                  <div className="space-y-4">
                    {Object.entries(userPreferences.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30">
                        <div className="flex items-center space-x-3">
                          {key === 'email' && <Mail className="h-5 w-5 text-gray-400" />}
                          {key === 'push' && <Smartphone className="h-5 w-5 text-gray-400" />}
                          {key === 'sms' && <Phone className="h-5 w-5 text-gray-400" />}
                          {key === 'desktop' && <Monitor className="h-5 w-5 text-gray-400" />}
                          <div>
                            <p className="text-white font-medium capitalize">{key} Notifications</p>
                            <p className="text-sm text-gray-400">
                              {key === 'email' && 'Receive notifications via email'}
                              {key === 'push' && 'Mobile push notifications'}
                              {key === 'sms' && 'Text message notifications'}
                              {key === 'desktop' && 'Browser notifications'}
                            </p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={value}
                            onChange={(e) => setUserPreferences({
                              ...userPreferences,
                              notifications: {...userPreferences.notifications, [key]: e.target.checked}
                            })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-6">
                  <h3 className="text-lg font-medium text-white mb-4">Notification Types</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      'New client registrations',
                      'Project status updates',
                      'Payment notifications',
                      'System maintenance',
                      'Security alerts',
                      'Weekly reports',
                      'Task assignments',
                      'Support tickets'
                    ].map((type, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                        <span className="text-white text-sm">{type}</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Security & Privacy</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Password & Authentication</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter current password"
                          className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                      />
                    </div>

                    <button className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-6">
                  <h3 className="text-lg font-medium text-white mb-4">Two-Factor Authentication</h3>
                  <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">Enable 2FA</p>
                        <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                      </div>
                      <button className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors">
                        Enable
                      </button>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-6">
                  <h3 className="text-lg font-medium text-white mb-4">Privacy Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30">
                      <div>
                        <p className="text-white font-medium">Profile Visibility</p>
                        <p className="text-sm text-gray-400">Control who can see your profile information</p>
                      </div>
                      <select className="px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white">
                        <option>Public</option>
                        <option>Team Only</option>
                        <option>Private</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30">
                      <div>
                        <p className="text-white font-medium">Data Analytics</p>
                        <p className="text-sm text-gray-400">Allow anonymous usage analytics to improve the platform</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-6">
                  <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                    Danger Zone
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">Delete Account</p>
                          <p className="text-sm text-gray-400">Permanently delete your account and all associated data</p>
                        </div>
                        <button
                          onClick={handleDeleteAccount}
                          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Integrations</h2>

              <div className="grid grid-cols-2 gap-4">
                {integrations.map((integration, index) => (
                  <div key={integration.name} className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-sm">
                          {integration.icon}
                        </div>
                        <div>
                          <p className="text-white font-medium">{integration.name}</p>
                          <p className="text-xs text-gray-400">{integration.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs ${
                          integration.status === 'connected'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {integration.status === 'connected' ? <CheckCircle className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
                          {integration.status}
                        </span>
                        <button className="p-1 rounded hover:bg-gray-700 transition-colors">
                          <Settings className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                    <button className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${
                      integration.status === 'connected'
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}>
                      {integration.status === 'connected' ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-800 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Custom Integrations</h3>
                  <button className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Custom</span>
                  </button>
                </div>
                <div className="p-6 rounded-lg border-2 border-dashed border-gray-700 text-center">
                  <LinkIcon className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400">No custom integrations configured</p>
                  <p className="text-sm text-gray-500">Connect your own APIs and webhooks</p>
                </div>
              </div>
            </div>
          )}

          {/* API & Webhooks Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">API Keys & Webhooks</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">API Keys</h3>
                  <button className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Generate New Key</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {apiKeys.map((apiKey, index) => (
                    <div key={index} className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{apiKey.name}</p>
                          <p className="text-sm text-gray-400 font-mono">{apiKey.key}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                            <span>Created: {apiKey.created}</span>
                            <span>Last used: {apiKey.lastUsed}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 rounded hover:bg-gray-700 transition-colors">
                            <Eye className="h-4 w-4 text-gray-400" />
                          </button>
                          <button className="p-2 rounded hover:bg-gray-700 transition-colors">
                            <Edit className="h-4 w-4 text-gray-400" />
                          </button>
                          <button className="p-2 rounded hover:bg-gray-700 transition-colors">
                            <Trash2 className="h-4 w-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Webhooks</h3>
                  <button className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add Webhook</span>
                  </button>
                </div>
                <div className="p-6 rounded-lg border-2 border-dashed border-gray-700 text-center">
                  <Zap className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-400">No webhooks configured</p>
                  <p className="text-sm text-gray-500">Set up webhooks to receive real-time notifications</p>
                </div>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-4">Billing & Subscription</h2>

              <div className="p-6 rounded-lg bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white">Professional Plan</h3>
                    <p className="text-gray-300">Advanced features for growing teams</p>
                    <p className="text-2xl font-bold text-white mt-2">$49<span className="text-lg text-gray-400">/month</span></p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Active
                    </span>
                    <p className="text-sm text-gray-400 mt-2">Next billing: April 15, 2024</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                  <h4 className="text-white font-medium mb-2">Starter</h4>
                  <p className="text-2xl font-bold text-white">$19<span className="text-lg text-gray-400">/mo</span></p>
                  <ul className="text-sm text-gray-400 mt-3 space-y-1">
                    <li>• Up to 5 projects</li>
                    <li>• 10GB storage</li>
                    <li>• Basic support</li>
                  </ul>
                  <button className="w-full mt-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors">
                    Current Plan
                  </button>
                </div>

                <div className="p-4 rounded-lg bg-purple-600/20 border border-purple-500">
                  <h4 className="text-white font-medium mb-2">Professional</h4>
                  <p className="text-2xl font-bold text-white">$49<span className="text-lg text-gray-400">/mo</span></p>
                  <ul className="text-sm text-gray-400 mt-3 space-y-1">
                    <li>• Unlimited projects</li>
                    <li>• 100GB storage</li>
                    <li>• Priority support</li>
                    <li>• Advanced analytics</li>
                  </ul>
                  <button className="w-full mt-4 py-2 rounded-lg gradient-purple text-white font-medium">
                    Current Plan
                  </button>
                </div>

                <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                  <h4 className="text-white font-medium mb-2">Enterprise</h4>
                  <p className="text-2xl font-bold text-white">$99<span className="text-lg text-gray-400">/mo</span></p>
                  <ul className="text-sm text-gray-400 mt-3 space-y-1">
                    <li>• Everything in Pro</li>
                    <li>• 1TB storage</li>
                    <li>• 24/7 phone support</li>
                    <li>• Custom integrations</li>
                  </ul>
                  <button className="w-full mt-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors">
                    Upgrade
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">Payment Method</h3>
                <div className="p-4 rounded-lg bg-gray-800/30 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-400">Expires 12/26</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="px-3 py-1 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors">
                        Edit
                      </button>
                      <button className="px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                <button className="mt-4 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Add Payment Method</span>
                </button>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">Billing History</h3>
                <div className="space-y-3">
                  {[
                    { date: 'March 15, 2024', amount: '$49.00', status: 'Paid', invoice: 'INV-2024-003' },
                    { date: 'February 15, 2024', amount: '$49.00', status: 'Paid', invoice: 'INV-2024-002' },
                    { date: 'January 15, 2024', amount: '$49.00', status: 'Paid', invoice: 'INV-2024-001' }
                  ].map((bill, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/30">
                      <div>
                        <p className="text-white font-medium">{bill.date}</p>
                        <p className="text-sm text-gray-400">{bill.invoice}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-white font-medium">{bill.amount}</span>
                        <span className="inline-flex items-center px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {bill.status}
                        </span>
                        <button className="p-1 rounded hover:bg-gray-700 transition-colors">
                          <Download className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}