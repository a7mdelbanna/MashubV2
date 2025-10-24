'use client'

import { useState } from 'react'
import {
  Upload,
  Search,
  Filter,
  MoreVertical,
  FileText,
  Image as ImageIcon,
  File,
  Video,
  Music,
  Archive,
  FolderOpen,
  Folder,
  Grid3x3,
  List,
  Download,
  Share2,
  Trash2,
  Eye,
  Clock,
  User,
  Star,
  ChevronRight,
  Plus,
  ArrowUpDown,
  Smartphone
} from 'lucide-react'
import { FileAppAssignmentModal } from '@/components/projects/file-app-assignment-modal'
import { MOCK_APPS, MOCK_PROJECTS } from '@/lib/mock-project-data'
import { App } from '@/types'

// Types
type FileType = 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other'
type ViewMode = 'grid' | 'list'
type SortBy = 'name' | 'date' | 'size' | 'type'

interface ProjectFile {
  id: string
  name: string
  type: FileType
  extension: string
  size: number
  uploadedBy: string
  uploadedAt: string
  version: number
  versions: FileVersion[]
  folder: string
  tags: string[]
  isStarred: boolean
  downloads: number
  lastAccessed?: string
  assignedApps: string[] // NEW: App IDs this file is assigned to
}

interface FileVersion {
  version: number
  uploadedBy: string
  uploadedAt: string
  size: number
  changes?: string
}

interface FolderStructure {
  name: string
  path: string
  fileCount: number
  subfolders?: FolderStructure[]
}

// Mock data
const mockFolders: FolderStructure[] = [
  {
    name: 'Design',
    path: '/Design',
    fileCount: 12,
    subfolders: [
      { name: 'Mockups', path: '/Design/Mockups', fileCount: 8 },
      { name: 'Assets', path: '/Design/Assets', fileCount: 24 }
    ]
  },
  {
    name: 'Documentation',
    path: '/Documentation',
    fileCount: 18,
    subfolders: [
      { name: 'API', path: '/Documentation/API', fileCount: 6 },
      { name: 'User Guides', path: '/Documentation/User Guides', fileCount: 4 }
    ]
  },
  {
    name: 'Development',
    path: '/Development',
    fileCount: 45,
    subfolders: [
      { name: 'Backend', path: '/Development/Backend', fileCount: 28 },
      { name: 'Frontend', path: '/Development/Frontend', fileCount: 32 }
    ]
  },
  { name: 'Testing', path: '/Testing', fileCount: 8 },
  { name: 'Deployment', path: '/Deployment', fileCount: 5 }
]

const mockFiles: ProjectFile[] = [
  {
    id: 'file-1',
    name: 'Project Requirements.docx',
    type: 'document',
    extension: 'docx',
    size: 2457600,
    uploadedBy: 'Sarah Chen',
    uploadedAt: '2025-10-10T10:00:00Z',
    version: 3,
    versions: [
      { version: 3, uploadedBy: 'Sarah Chen', uploadedAt: '2025-10-13T14:00:00Z', size: 2457600, changes: 'Updated requirements for phase 2' },
      { version: 2, uploadedBy: 'Mike Johnson', uploadedAt: '2025-10-11T09:00:00Z', size: 2304000, changes: 'Added API specifications' },
      { version: 1, uploadedBy: 'Sarah Chen', uploadedAt: '2025-10-10T10:00:00Z', size: 2048000 }
    ],
    folder: '/Documentation',
    tags: ['requirements', 'specs'],
    isStarred: true,
    downloads: 12,
    lastAccessed: '2025-10-13T16:30:00Z'
  },
  {
    id: 'file-2',
    name: 'Dashboard Mockup.fig',
    type: 'other',
    extension: 'fig',
    size: 15728640,
    uploadedBy: 'Alex Rivera',
    uploadedAt: '2025-10-11T14:00:00Z',
    version: 2,
    versions: [
      { version: 2, uploadedBy: 'Alex Rivera', uploadedAt: '2025-10-12T11:00:00Z', size: 15728640, changes: 'Added dark mode variants' },
      { version: 1, uploadedBy: 'Alex Rivera', uploadedAt: '2025-10-11T14:00:00Z', size: 14680064 }
    ],
    folder: '/Design/Mockups',
    tags: ['design', 'ui', 'dashboard'],
    isStarred: true,
    downloads: 8,
    lastAccessed: '2025-10-13T15:00:00Z'
  },
  {
    id: 'file-3',
    name: 'API Documentation.pdf',
    type: 'document',
    extension: 'pdf',
    size: 5242880,
    uploadedBy: 'Mike Johnson',
    uploadedAt: '2025-10-09T10:00:00Z',
    version: 1,
    versions: [
      { version: 1, uploadedBy: 'Mike Johnson', uploadedAt: '2025-10-09T10:00:00Z', size: 5242880 }
    ],
    folder: '/Documentation/API',
    tags: ['api', 'documentation', 'backend'],
    isStarred: false,
    downloads: 24,
    lastAccessed: '2025-10-13T09:00:00Z'
  },
  {
    id: 'file-4',
    name: 'Hero Banner.png',
    type: 'image',
    extension: 'png',
    size: 3145728,
    uploadedBy: 'Alex Rivera',
    uploadedAt: '2025-10-12T16:00:00Z',
    version: 1,
    versions: [
      { version: 1, uploadedBy: 'Alex Rivera', uploadedAt: '2025-10-12T16:00:00Z', size: 3145728 }
    ],
    folder: '/Design/Assets',
    tags: ['image', 'banner', 'marketing'],
    isStarred: false,
    downloads: 5,
    lastAccessed: '2025-10-13T10:00:00Z'
  },
  {
    id: 'file-5',
    name: 'Demo Video.mp4',
    type: 'video',
    extension: 'mp4',
    size: 52428800,
    uploadedBy: 'Sarah Chen',
    uploadedAt: '2025-10-08T14:00:00Z',
    version: 1,
    versions: [
      { version: 1, uploadedBy: 'Sarah Chen', uploadedAt: '2025-10-08T14:00:00Z', size: 52428800 }
    ],
    folder: '/Documentation',
    tags: ['video', 'demo', 'presentation'],
    isStarred: true,
    downloads: 31,
    lastAccessed: '2025-10-12T14:00:00Z'
  },
  {
    id: 'file-6',
    name: 'Source Code Archive.zip',
    type: 'archive',
    extension: 'zip',
    size: 104857600,
    uploadedBy: 'Mike Johnson',
    uploadedAt: '2025-10-13T10:00:00Z',
    version: 1,
    versions: [
      { version: 1, uploadedBy: 'Mike Johnson', uploadedAt: '2025-10-13T10:00:00Z', size: 104857600 }
    ],
    folder: '/Development',
    tags: ['source', 'backup', 'archive'],
    isStarred: false,
    downloads: 3,
    lastAccessed: '2025-10-13T11:00:00Z'
  }
]

// Helper functions
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

function getFileIcon(type: FileType, extension: string) {
  switch (type) {
    case 'document':
      return <FileText className="w-5 h-5" />
    case 'image':
      return <ImageIcon className="w-5 h-5" />
    case 'video':
      return <Video className="w-5 h-5" />
    case 'audio':
      return <Music className="w-5 h-5" />
    case 'archive':
      return <Archive className="w-5 h-5" />
    default:
      return <File className="w-5 h-5" />
  }
}

function getFileTypeColor(type: FileType): string {
  switch (type) {
    case 'document':
      return 'bg-blue-500/20 text-blue-400'
    case 'image':
      return 'bg-purple-500/20 text-purple-400'
    case 'video':
      return 'bg-red-500/20 text-red-400'
    case 'audio':
      return 'bg-green-500/20 text-green-400'
    case 'archive':
      return 'bg-yellow-500/20 text-yellow-400'
    default:
      return 'bg-gray-500/20 text-gray-400'
  }
}

export default function ProjectDocumentsPage() {
  const [files, setFiles] = useState<ProjectFile[]>(mockFiles.map(f => ({ ...f, assignedApps: [] })))
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentFolder, setCurrentFolder] = useState<string>('/')
  const [sortBy, setSortBy] = useState<SortBy>('date')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFileTypes, setSelectedFileTypes] = useState<FileType[]>([])

  // NEW: File selection and app assignment
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [showAssignModal, setShowAssignModal] = useState(false)

  // Get project and apps (in real app, fetch from API)
  const project = MOCK_PROJECTS[0] // Using first project for demo
  const projectApps: App[] = project?.apps || []

  // Filter and sort files
  const filteredFiles = files
    .filter(file => {
      const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesFolder = currentFolder === '/' || file.folder.startsWith(currentFolder)
      const matchesType = selectedFileTypes.length === 0 || selectedFileTypes.includes(file.type)
      return matchesSearch && matchesFolder && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'date':
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        case 'size':
          return b.size - a.size
        case 'type':
          return a.extension.localeCompare(b.extension)
        default:
          return 0
      }
    })

  const starredFiles = files.filter(f => f.isStarred).length
  const totalSize = files.reduce((sum, f) => sum + f.size, 0)
  const recentFiles = files.filter(f => {
    const diff = Date.now() - new Date(f.uploadedAt).getTime()
    return diff < 7 * 24 * 60 * 60 * 1000 // Last 7 days
  }).length

  // Breadcrumb navigation
  const breadcrumbs = currentFolder === '/' ? ['Root'] : ['Root', ...currentFolder.split('/').filter(Boolean)]

  // File selection handlers
  const toggleFileSelection = (fileId: string) => {
    const newSelection = new Set(selectedFiles)
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId)
    } else {
      newSelection.add(fileId)
    }
    setSelectedFiles(newSelection)
  }

  const handleAssignToApps = (fileIds: string[], appIds: string[]) => {
    // Update files with new app assignments
    setFiles(prevFiles =>
      prevFiles.map(file =>
        fileIds.includes(file.id)
          ? { ...file, assignedApps: appIds }
          : file
      )
    )
    setSelectedFiles(new Set()) // Clear selection
  }

  const selectedFilesArray = files.filter(f => selectedFiles.has(f.id))

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent">
              Project Documents
            </h1>
            <p className="text-gray-400 mt-1">Manage and organize project files</p>
          </div>

          <div className="flex items-center gap-2">
            {selectedFiles.size > 0 && (
              <button
                onClick={() => setShowAssignModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Smartphone className="w-4 h-4" />
                Assign to Apps ({selectedFiles.size})
              </button>
            )}
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors">
              <Upload className="w-4 h-4" />
              Upload Files
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Total Files</div>
            <div className="text-2xl font-bold text-white">{files.length}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Total Size</div>
            <div className="text-2xl font-bold text-purple-400">{formatFileSize(totalSize)}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Starred</div>
            <div className="text-2xl font-bold text-yellow-400">{starredFiles}</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-4">
            <div className="text-gray-400 text-sm mb-1">Recent (7 days)</div>
            <div className="text-2xl font-bold text-green-400">{recentFiles}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar - Folders */}
        <div className="col-span-3">
          <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Folders
            </h3>

            <div className="space-y-1">
              <button
                onClick={() => setCurrentFolder('/')}
                className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 text-sm transition-colors ${
                  currentFolder === '/'
                    ? 'bg-purple-500/20 text-purple-400'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <Folder className="w-4 h-4" />
                All Files
              </button>

              {mockFolders.map(folder => (
                <div key={folder.path}>
                  <button
                    onClick={() => setCurrentFolder(folder.path)}
                    className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between text-sm transition-colors ${
                      currentFolder === folder.path
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Folder className="w-4 h-4" />
                      {folder.name}
                    </div>
                    <span className="text-xs text-gray-500">{folder.fileCount}</span>
                  </button>

                  {folder.subfolders && (
                    <div className="ml-4 mt-1 space-y-1">
                      {folder.subfolders.map(subfolder => (
                        <button
                          key={subfolder.path}
                          onClick={() => setCurrentFolder(subfolder.path)}
                          className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between text-xs transition-colors ${
                            currentFolder === subfolder.path
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Folder className="w-3 h-3" />
                            {subfolder.name}
                          </div>
                          <span className="text-gray-500">{subfolder.fileCount}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button className="w-full mt-4 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg flex items-center gap-2 text-sm transition-colors">
              <Plus className="w-4 h-4" />
              New Folder
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-9">
          {/* Toolbar */}
          <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-4 mb-6">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 mb-4 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <div key={index} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight className="w-4 h-4 text-gray-500" />}
                  <button
                    onClick={() => {
                      if (index === 0) setCurrentFolder('/')
                      else setCurrentFolder('/' + breadcrumbs.slice(1, index + 1).join('/'))
                    }}
                    className={`${
                      index === breadcrumbs.length - 1
                        ? 'text-purple-400 font-medium'
                        : 'text-gray-400 hover:text-white'
                    } transition-colors`}
                  >
                    {crumb}
                  </button>
                </div>
              ))}
            </div>

            {/* Search and Controls */}
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search files and folders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                  showFilters ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              <button
                onClick={() => setSortBy(sortBy === 'date' ? 'name' : 'date')}
                className="px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg flex items-center gap-2 transition-colors"
              >
                <ArrowUpDown className="w-4 h-4" />
                Sort
              </button>

              <div className="flex items-center gap-1 bg-gray-700 rounded-lg p-1">
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

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-400">File Type:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(['document', 'image', 'video', 'audio', 'archive', 'other'] as FileType[]).map(type => (
                    <button
                      key={type}
                      onClick={() => {
                        setSelectedFileTypes(prev =>
                          prev.includes(type)
                            ? prev.filter(t => t !== type)
                            : [...prev, type]
                        )
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        selectedFileTypes.includes(type)
                          ? getFileTypeColor(type)
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                  {selectedFileTypes.length > 0 && (
                    <button
                      onClick={() => setSelectedFileTypes([])}
                      className="px-3 py-1 text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Files Grid/List */}
          {filteredFiles.length === 0 ? (
            <div className="bg-gray-800/30 rounded-lg border border-gray-700 p-16 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
                <File className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No files found</h3>
              <p className="text-gray-400 mb-6">Upload files to get started</p>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 mx-auto transition-colors">
                <Upload className="w-4 h-4" />
                Upload Files
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-3 gap-4">
              {filteredFiles.map(file => (
                <div
                  key={file.id}
                  className={`bg-gray-800/50 rounded-lg border p-4 hover:border-purple-500 transition-colors relative ${
                    selectedFiles.has(file.id) ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-gray-700'
                  }`}
                >
                  {/* Selection Checkbox */}
                  <div className="absolute top-3 right-3">
                    <input
                      type="checkbox"
                      checked={selectedFiles.has(file.id)}
                      onChange={() => toggleFileSelection(file.id)}
                      className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-2 focus:ring-purple-500 cursor-pointer"
                    />
                  </div>

                  {/* File Icon */}
                  <div className={`w-12 h-12 rounded-lg ${getFileTypeColor(file.type)} flex items-center justify-center mb-3`}>
                    {getFileIcon(file.type, file.extension)}
                  </div>

                  {/* File Name */}
                  <h4 className="font-medium text-white mb-1 line-clamp-1">{file.name}</h4>
                  <p className="text-xs text-gray-400 mb-3">{file.extension.toUpperCase()} • {formatFileSize(file.size)}</p>

                  {/* Tags */}
                  {file.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {file.tags.slice(0, 2).map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-gray-700 text-gray-300 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {file.tags.length > 2 && (
                        <span className="px-2 py-0.5 text-gray-500 text-xs">
                          +{file.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="truncate max-w-[80px]">{file.uploadedBy.split(' ')[0]}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Version */}
                  <div className="flex items-center justify-between text-xs mb-3 pb-3 border-b border-gray-700">
                    <span className="text-gray-400">Version {file.version}</span>
                    <span className="text-gray-500">{file.downloads} downloads</span>
                  </div>

                  {/* App Assignment */}
                  {file.assignedApps.length > 0 && (
                    <div className="mb-3 flex items-center gap-1 text-xs">
                      <Smartphone className="w-3 h-3 text-blue-400" />
                      <span className="text-blue-400">
                        {file.assignedApps.length === 1 ? '1 app' : `${file.assignedApps.length} apps`}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button className="flex-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-xs flex items-center justify-center gap-1 transition-colors">
                      <Eye className="w-3 h-3" />
                      View
                    </button>
                    <button className="p-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors">
                      <Download className="w-3 h-3" />
                    </button>
                    <button className="p-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors">
                      {file.isStarred ? (
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      ) : (
                        <Star className="w-3 h-3" />
                      )}
                    </button>
                    <button className="p-1.5 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors">
                      <MoreVertical className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-800/30 rounded-lg border border-gray-700 overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-sm font-medium text-gray-400">
                <div className="col-span-5">Name</div>
                <div className="col-span-2">Size</div>
                <div className="col-span-2">Uploaded By</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-1"></div>
              </div>

              {/* Table Rows */}
              <div className="divide-y divide-gray-700">
                {filteredFiles.map(file => (
                  <div
                    key={file.id}
                    className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <div className="col-span-5 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${getFileTypeColor(file.type)} flex items-center justify-center flex-shrink-0`}>
                        {getFileIcon(file.type, file.extension)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-white truncate">{file.name}</h4>
                          {file.isStarred && <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-gray-400">v{file.version} • {file.extension.toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center text-sm text-gray-300">
                      {formatFileSize(file.size)}
                    </div>
                    <div className="col-span-2 flex items-center">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="truncate">{file.uploadedBy}</span>
                      </div>
                    </div>
                    <div className="col-span-2 flex items-center text-sm text-gray-400">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </div>
                    <div className="col-span-1 flex items-center justify-end gap-1">
                      <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
                        <Eye className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
                        <Download className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
                        <Share2 className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-700 rounded transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* File App Assignment Modal */}
      <FileAppAssignmentModal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        files={selectedFilesArray}
        apps={projectApps}
        onAssign={handleAssignToApps}
      />
    </div>
  )
}
