'use client'

import { useState } from 'react'
import {
  File, FileText, Image as ImageIcon, Video, Music, Archive,
  Download, Eye, Star, Search, Filter, Grid3x3, List,
  FolderOpen, ExternalLink, Share2
} from 'lucide-react'
import { ProjectFile } from '@/types'

interface AppFilesViewProps {
  appId: string
  projectFiles: ProjectFile[] // All project files
  onViewFile?: (file: ProjectFile) => void
  onDownloadFile?: (file: ProjectFile) => void
}

type ViewMode = 'grid' | 'list'

export function AppFilesView({
  appId,
  projectFiles,
  onViewFile,
  onDownloadFile
}: AppFilesViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<string>('/')

  // Filter files assigned to this app
  const appFiles = projectFiles.filter(file => file.assignedApps.includes(appId))

  // Apply search filter
  const filteredFiles = appFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFolder = selectedFolder === '/' || file.folder === selectedFolder || file.folder.startsWith(selectedFolder + '/')

    return matchesSearch && matchesFolder
  })

  // Extract unique folders
  const folders = Array.from(new Set(appFiles.map(f => f.folder))).sort()

  const getFileIcon = (type: string, extension: string) => {
    if (type === 'document') return <FileText className="w-8 h-8" />
    if (type === 'image') return <ImageIcon className="w-8 h-8" />
    if (type === 'video') return <Video className="w-8 h-8" />
    if (type === 'audio') return <Music className="w-8 h-8" />
    if (type === 'archive') return <Archive className="w-8 h-8" />
    return <File className="w-8 h-8" />
  }

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'text-blue-400 bg-blue-500/20'
      case 'image': return 'text-green-400 bg-green-500/20'
      case 'video': return 'text-purple-400 bg-purple-500/20'
      case 'audio': return 'text-pink-400 bg-pink-500/20'
      case 'archive': return 'text-orange-400 bg-orange-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const isShared = (file: ProjectFile) => file.assignedApps.length > 1

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-white">{appFiles.length}</div>
          <div className="text-sm text-gray-400">Files Available</div>
        </div>
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-purple-500">
            {formatFileSize(appFiles.reduce((sum, f) => sum + f.size, 0))}
          </div>
          <div className="text-sm text-gray-400">Total Size</div>
        </div>
        <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <div className="text-2xl font-bold text-blue-500">
            {appFiles.filter(f => isShared(f)).length}
          </div>
          <div className="text-sm text-gray-400">Shared Files</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg
                     text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 p-1 bg-gray-800 border border-gray-700 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Folder Filter */}
      {folders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedFolder('/')}
            className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
              selectedFolder === '/'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            All Folders
          </button>
          {folders.map(folder => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors flex items-center gap-1 ${
                selectedFolder === folder
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <FolderOpen className="w-3 h-3" />
              {folder.split('/').pop() || folder}
            </button>
          ))}
        </div>
      )}

      {/* Files Display */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <File className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No files found</p>
          <p className="text-sm">
            {searchQuery ? 'Try adjusting your search' : 'No files have been assigned to this app yet'}
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map(file => (
            <div
              key={file.id}
              className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg hover:border-purple-500/50 transition-all group"
            >
              {/* File Icon & Name */}
              <div className="flex items-start gap-3 mb-3">
                <div className={`p-3 rounded-lg ${getFileTypeColor(file.type)}`}>
                  {getFileIcon(file.type, file.extension)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white truncate">{file.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{file.extension}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                  </div>
                </div>
                {file.isStarred && (
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                )}
              </div>

              {/* Tags */}
              {file.tags.length > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  {file.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-gray-700 text-gray-400 rounded">
                      {tag}
                    </span>
                  ))}
                  {file.tags.length > 2 && (
                    <span className="text-xs text-gray-500">+{file.tags.length - 2}</span>
                  )}
                </div>
              )}

              {/* Shared Badge */}
              {isShared(file) && (
                <div className="flex items-center gap-1 text-xs text-blue-400 mb-3">
                  <Share2 className="w-3 h-3" />
                  <span>Shared with {file.assignedApps.length} apps</span>
                </div>
              )}

              {/* Meta Info */}
              <div className="text-xs text-gray-500 mb-3">
                <div>Uploaded by {file.uploadedBy}</div>
                <div className="flex items-center gap-1 mt-1">
                  <span>v{file.version}</span>
                  {file.version > 1 && <span>({file.versions.length} versions)</span>}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {onViewFile && (
                  <button
                    onClick={() => onViewFile(file)}
                    className="flex-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    View
                  </button>
                )}
                {onDownloadFile && (
                  <button
                    onClick={() => onDownloadFile(file)}
                    className="flex-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded transition-colors flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900/50 border-b border-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Size</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Uploaded By</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400">Version</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredFiles.map(file => (
                <tr key={file.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${getFileTypeColor(file.type)}`}>
                        {getFileIcon(file.type, file.extension)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white">{file.name}</span>
                          {file.isStarred && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                          {isShared(file) && <Share2 className="w-3 h-3 text-blue-400" />}
                        </div>
                        <span className="text-xs text-gray-500">{file.folder}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-400">{formatFileSize(file.size)}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">{file.uploadedBy}</td>
                  <td className="px-4 py-3 text-sm text-gray-400">v{file.version}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {onViewFile && (
                        <button
                          onClick={() => onViewFile(file)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      {onDownloadFile && (
                        <button
                          onClick={() => onDownloadFile(file)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
