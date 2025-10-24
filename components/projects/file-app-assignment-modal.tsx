'use client'

import { useState, useEffect } from 'react'
import { X, Folder, File, Check, ShoppingBag, Smartphone, Globe, Megaphone, Users as UsersIcon, Building2, Box } from 'lucide-react'
import { ProjectFile, App, AppType } from '@/types'

interface FileAppAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  files: ProjectFile[] // Selected files to assign
  apps: App[] // Available apps in the project
  onAssign: (fileIds: string[], appIds: string[]) => void
}

export function FileAppAssignmentModal({
  isOpen,
  onClose,
  files,
  apps,
  onAssign
}: FileAppAssignmentModalProps) {
  const [selectedAppIds, setSelectedAppIds] = useState<Set<string>>(new Set())

  // Initialize with apps that are common to all selected files
  useEffect(() => {
    if (isOpen && files.length > 0) {
      // Find apps that are assigned to ALL selected files
      const commonAppIds = files[0].assignedApps.filter(appId =>
        files.every(file => file.assignedApps.includes(appId))
      )
      setSelectedAppIds(new Set(commonAppIds))
    }
  }, [isOpen, files])

  const toggleApp = (appId: string) => {
    const newSelected = new Set(selectedAppIds)
    if (newSelected.has(appId)) {
      newSelected.delete(appId)
    } else {
      newSelected.add(appId)
    }
    setSelectedAppIds(newSelected)
  }

  const handleSubmit = () => {
    onAssign(files.map(f => f.id), Array.from(selectedAppIds))
    onClose()
  }

  const getAppTypeIcon = (type: AppType) => {
    switch (type) {
      case 'pos': return <ShoppingBag className="w-5 h-5" />
      case 'mobile_app': return <Smartphone className="w-5 h-5" />
      case 'website': return <Globe className="w-5 h-5" />
      case 'advertising': return <Megaphone className="w-5 h-5" />
      case 'crm': return <UsersIcon className="w-5 h-5" />
      case 'erp': return <Building2 className="w-5 h-5" />
      case 'custom': return <Box className="w-5 h-5" />
      default: return <Box className="w-5 h-5" />
    }
  }

  const getAppTypeColor = (type: AppType) => {
    switch (type) {
      case 'pos': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      case 'mobile_app': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'website': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'advertising': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'crm': return 'bg-pink-500/20 text-pink-400 border-pink-500/30'
      case 'erp': return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
      case 'custom': return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Folder className="w-6 h-6 text-purple-500" />
              Assign to Apps
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {files.length === 1
                ? `Assign "${files[0].name}" to apps`
                : `Assign ${files.length} files to apps`
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
          {/* Selected Files Summary */}
          {files.length > 1 && (
            <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-3">Selected Files ({files.length})</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {files.map(file => (
                  <div key={file.id} className="flex items-center gap-2 text-sm text-gray-400">
                    <File className="w-4 h-4" />
                    <span>{file.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Apps Grid */}
          <div>
            <h3 className="text-sm font-medium text-white mb-4">
              Select Apps ({selectedAppIds.size} selected)
            </h3>

            {apps.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Box className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No apps available in this project</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {apps.map(app => {
                  const isSelected = selectedAppIds.has(app.id)
                  const colorClass = getAppTypeColor(app.type)

                  return (
                    <button
                      key={app.id}
                      onClick={() => toggleApp(app.id)}
                      className={`
                        flex items-center gap-4 p-4 rounded-lg border transition-all text-left
                        ${isSelected
                          ? 'bg-purple-500/20 border-purple-500 ring-2 ring-purple-500/30'
                          : 'bg-gray-800/50 border-gray-700 hover:border-gray-600 hover:bg-gray-800'
                        }
                      `}
                    >
                      {/* App Icon */}
                      <div className={`p-3 rounded-lg border ${colorClass}`}>
                        {getAppTypeIcon(app.type)}
                      </div>

                      {/* App Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white truncate">{app.nameEn}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded border ${colorClass}`}>
                            {app.type.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {app.client.name}
                          </span>
                        </div>
                      </div>

                      {/* Checkbox */}
                      <div className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                        ${isSelected
                          ? 'bg-purple-500 border-purple-500'
                          : 'border-gray-600'
                        }
                      `}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-800 bg-gray-800/30">
          <div className="text-sm text-gray-400">
            {selectedAppIds.size === 0 ? (
              <span className="text-orange-400">Select at least one app</span>
            ) : (
              <span>
                {files.length === 1 ? 'File' : `${files.length} files`} will be assigned to {selectedAppIds.size} {selectedAppIds.size === 1 ? 'app' : 'apps'}
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedAppIds.size === 0}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Assign to Apps
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
