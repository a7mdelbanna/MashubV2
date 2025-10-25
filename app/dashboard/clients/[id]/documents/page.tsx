'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, Upload, Download, Trash2, Eye, Share2,
  FileText, Image, FileSpreadsheet, FileCode, Archive,
  Folder, FolderOpen, Search, Filter, Grid, List,
  MoreVertical, Star, Clock, Shield, AlertCircle,
  CheckCircle, X, Plus, Copy, Move
} from 'lucide-react'
import Select from '@/components/ui/select'

// Mock document structure
const mockDocuments = {
  folders: [
    {
      id: 'f1',
      name: 'Contracts',
      items: 8,
      size: '24.5 MB',
      modified: '2024-03-20',
      starred: true,
      files: [
        { id: 'd1', name: 'MSA_2024.pdf', type: 'pdf', size: '2.4 MB', uploaded: '2024-01-15', uploadedBy: 'John Smith', version: 3 },
        { id: 'd2', name: 'NDA_Mutual.pdf', type: 'pdf', size: '850 KB', uploaded: '2024-01-10', uploadedBy: 'Jane Doe', version: 1 },
        { id: 'd3', name: 'SOW_ProjectAlpha.pdf', type: 'pdf', size: '1.2 MB', uploaded: '2024-02-01', uploadedBy: 'John Smith', version: 2 }
      ]
    },
    {
      id: 'f2',
      name: 'Project Files',
      items: 15,
      size: '156.8 MB',
      modified: '2024-03-22',
      starred: false,
      files: [
        { id: 'd4', name: 'Requirements.docx', type: 'doc', size: '4.5 MB', uploaded: '2024-02-15', uploadedBy: 'Mike Chen', version: 5 },
        { id: 'd5', name: 'Design_Mockups.fig', type: 'design', size: '45.2 MB', uploaded: '2024-02-20', uploadedBy: 'Sarah Lee', version: 8 },
        { id: 'd6', name: 'API_Documentation.md', type: 'code', size: '234 KB', uploaded: '2024-03-01', uploadedBy: 'Dev Team', version: 12 }
      ]
    },
    {
      id: 'f3',
      name: 'Financial Documents',
      items: 12,
      size: '8.2 MB',
      modified: '2024-03-18',
      starred: true,
      files: [
        { id: 'd7', name: 'Invoice_March2024.pdf', type: 'pdf', size: '342 KB', uploaded: '2024-03-15', uploadedBy: 'Finance Team', version: 1 },
        { id: 'd8', name: 'Budget_Q2.xlsx', type: 'spreadsheet', size: '1.8 MB', uploaded: '2024-03-10', uploadedBy: 'John Smith', version: 3 },
        { id: 'd9', name: 'Payment_Schedule.xlsx', type: 'spreadsheet', size: '456 KB', uploaded: '2024-03-05', uploadedBy: 'Finance Team', version: 2 }
      ]
    },
    {
      id: 'f4',
      name: 'Marketing Materials',
      items: 6,
      size: '89.3 MB',
      modified: '2024-03-15',
      starred: false,
      files: [
        { id: 'd10', name: 'Brand_Guidelines.pdf', type: 'pdf', size: '12.4 MB', uploaded: '2024-03-10', uploadedBy: 'Marketing', version: 1 },
        { id: 'd11', name: 'Logo_Package.zip', type: 'archive', size: '34.5 MB', uploaded: '2024-03-08', uploadedBy: 'Design Team', version: 1 },
        { id: 'd12', name: 'Presentation.pptx', type: 'presentation', size: '8.9 MB', uploaded: '2024-03-12', uploadedBy: 'Sarah Lee', version: 4 }
      ]
    }
  ],
  recentFiles: [
    { id: 'd13', name: 'Meeting_Notes_032024.docx', type: 'doc', size: '128 KB', uploaded: '2 hours ago', uploadedBy: 'You', version: 1 },
    { id: 'd14', name: 'Updated_Timeline.pdf', type: 'pdf', size: '567 KB', uploaded: '5 hours ago', uploadedBy: 'Mike Chen', version: 2 },
    { id: 'd15', name: 'Bug_Report.xlsx', type: 'spreadsheet', size: '234 KB', uploaded: 'Yesterday', uploadedBy: 'Dev Team', version: 1 }
  ]
}

const fileTypeIcons = {
  pdf: { icon: FileText, color: 'text-red-400' },
  doc: { icon: FileText, color: 'text-blue-400' },
  spreadsheet: { icon: FileSpreadsheet, color: 'text-green-400' },
  presentation: { icon: FileText, color: 'text-orange-400' },
  image: { icon: Image, color: 'text-purple-400' },
  code: { icon: FileCode, color: 'text-cyan-400' },
  design: { icon: Image, color: 'text-pink-400' },
  archive: { icon: Archive, color: 'text-yellow-400' }
} as const

// Type-safe helpers with fallbacks
const getFileTypeIcon = (type: string) => {
  return fileTypeIcons[type as keyof typeof fileTypeIcons]?.icon || FileText
}

const getFileTypeColor = (type: string): string => {
  return fileTypeIcons[type as keyof typeof fileTypeIcons]?.color || 'text-gray-400'
}

export default function ClientDocumentsPage({ params }: { params: { id: string } }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFolder, setSelectedFolder] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [fileTypeFilter, setFileTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('modified')

  // Local select options
  const fileTypeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'documents', label: 'Documents' },
    { value: 'spreadsheets', label: 'Spreadsheets' },
    { value: 'images', label: 'Images' },
    { value: 'archives', label: 'Archives' }
  ]

  const sortOptions = [
    { value: 'modified', label: 'Last Modified' },
    { value: 'name', label: 'Name' },
    { value: 'size', label: 'Size' },
    { value: 'type', label: 'Type' }
  ]

  const totalSize = mockDocuments.folders.reduce((sum, f) => {
    const size = parseFloat(f.size)
    const unit = f.size.includes('GB') ? 1024 : 1
    return sum + size * unit
  }, 0)

  const totalFiles = mockDocuments.folders.reduce((sum, f) => sum + f.items, 0)

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev =>
      prev.includes(fileId)
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href={`/dashboard/clients/${params.id}`}
            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Documents</h1>
            <p className="text-gray-400">Manage client files and documents</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
          >
            <Upload className="h-4 w-4" />
            <span>Upload Files</span>
          </button>
          <button className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all flex items-center space-x-2">
            <Folder className="h-4 w-4" />
            <span>New Folder</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Total Files</span>
            <FileText className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{totalFiles}</p>
          <p className="text-xs text-gray-500 mt-1">Across all folders</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Storage Used</span>
            <Archive className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{(totalSize / 1024).toFixed(1)} GB</p>
          <p className="text-xs text-gray-500 mt-1">Of 10 GB limit</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Shared Files</span>
            <Share2 className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">24</p>
          <p className="text-xs text-gray-500 mt-1">With team members</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Recent Uploads</span>
            <Clock className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">3</p>
          <p className="text-xs text-gray-500 mt-1">Last 24 hours</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search files and folders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>

        <div className="w-48">
          <Select
            options={fileTypeOptions}
            value={fileTypeFilter}
            onChange={setFileTypeFilter}
          />
        </div>

        <div className="w-48">
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
          />
        </div>

        <div className="flex items-center bg-gray-800/50 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Selected Files Actions */}
      {selectedFiles.length > 0 && (
        <div className="bg-purple-600/20 border border-purple-500/30 rounded-lg p-4 flex items-center justify-between">
          <span className="text-purple-400">{selectedFiles.length} file(s) selected</span>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-800 transition-all flex items-center space-x-1">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
            <button className="px-3 py-1 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-800 transition-all flex items-center space-x-1">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
            <button className="px-3 py-1 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-800 transition-all flex items-center space-x-1">
              <Move className="h-4 w-4" />
              <span>Move</span>
            </button>
            <button className="px-3 py-1 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-all flex items-center space-x-1">
              <Trash2 className="h-4 w-4" />
              <span>Delete</span>
            </button>
            <button
              onClick={() => setSelectedFiles([])}
              className="ml-2 p-1 rounded hover:bg-gray-800 transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Recent Files */}
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Clock className="h-5 w-5 text-gray-400" />
          <span>Recent Files</span>
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {mockDocuments.recentFiles.map((file: any) => {
            const FileIcon = getFileTypeIcon(file.type)
            const iconColor = getFileTypeColor(file.type)

            return (
              <div key={file.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all cursor-pointer">
                <FileIcon className={`h-8 w-8 ${iconColor}`} />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{file.size} • {file.uploaded}</p>
                </div>
                <button className="p-1 rounded hover:bg-gray-700 transition-colors">
                  <MoreVertical className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Folders Grid */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-2 gap-6' : 'space-y-4'}>
        {mockDocuments.folders.map((folder) => (
          <div
            key={folder.id}
            className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6 hover:border-purple-500/50 transition-all cursor-pointer"
            onClick={() => setSelectedFolder(folder)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                  <Folder className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white flex items-center space-x-2">
                    {folder.name}
                    {folder.starred && <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />}
                  </h3>
                  <p className="text-sm text-gray-400">{folder.items} items • {folder.size}</p>
                </div>
              </div>
              <button className="p-1 rounded-lg hover:bg-gray-800 transition-colors">
                <MoreVertical className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            <div className="space-y-2">
              {folder.files.slice(0, 3).map((file: any) => {
                const FileIcon = getFileTypeIcon(file.type)
                const iconColor = getFileTypeColor(file.type)

                return (
                  <div key={file.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-800/50 transition-all">
                    <input
                      type="checkbox"
                      checked={selectedFiles.includes(file.id)}
                      onChange={(e) => {
                        e.stopPropagation()
                        toggleFileSelection(file.id)
                      }}
                      className="w-4 h-4 rounded text-purple-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <FileIcon className={`h-4 w-4 ${iconColor}`} />
                    <span className="text-sm text-gray-300 truncate flex-1">{file.name}</span>
                    <span className="text-xs text-gray-500">{file.size}</span>
                  </div>
                )
              })}
              {folder.files.length > 3 && (
                <p className="text-xs text-gray-500 text-center pt-2">
                  +{folder.files.length - 3} more files
                </p>
              )}
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
              <span className="text-xs text-gray-400">Modified {folder.modified}</span>
              <div className="flex items-center space-x-2">
                <button className="p-1 rounded hover:bg-gray-800 transition-colors">
                  <Download className="h-4 w-4 text-gray-400" />
                </button>
                <button className="p-1 rounded hover:bg-gray-800 transition-colors">
                  <Share2 className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Folder Detail Modal */}
      {selectedFolder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gray-900 rounded-xl border border-gray-800 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                    <FolderOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                      {selectedFolder.name}
                      {selectedFolder.starred && <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />}
                    </h2>
                    <p className="text-gray-400">{selectedFolder.items} items • {selectedFolder.size}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedFolder(null)}
                  className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button className="px-4 py-2 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-800 transition-all flex items-center space-x-2">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-800 transition-all flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>New File</span>
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                    <Download className="h-5 w-5 text-gray-400" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                    <Share2 className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                {selectedFolder.files.map((file: any) => {
                  const FileIcon = getFileTypeIcon(file.type)
                  const iconColor = getFileTypeColor(file.type)

                  return (
                    <div key={file.id} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-all">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => toggleFileSelection(file.id)}
                        className="w-4 h-4 rounded text-purple-500"
                      />
                      <FileIcon className={`h-6 w-6 ${iconColor}`} />
                      <div className="flex-1">
                        <p className="text-white font-medium">{file.name}</p>
                        <p className="text-sm text-gray-400">
                          {file.size} • v{file.version} • Uploaded {file.uploaded} by {file.uploadedBy}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                          <Eye className="h-4 w-4 text-gray-400" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                          <Download className="h-4 w-4 text-gray-400" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                          <Share2 className="h-4 w-4 text-gray-400" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gray-900 rounded-xl border border-gray-800 max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Upload Files</h2>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">Drop files here or click to browse</p>
              <p className="text-sm text-gray-400 mb-4">Support for PDF, DOC, XLS, Images up to 50MB each</p>
              <button className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all">
                Select Files
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-400">Maximum file size: 50MB</p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all">
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}