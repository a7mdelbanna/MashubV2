'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { StorageService, ClientDocument, UploadProgress } from '@/lib/services/storage-service'
import {
  Upload, FileText, Download, Trash2, X, Plus, Search,
  Filter, MoreVertical, Eye, Edit2, CheckCircle2, Loader2
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Can } from '@/components/auth/can'

interface DocumentManagerProps {
  clientId: string
  tenantId: string
}

export default function DocumentManager({ clientId, tenantId }: DocumentManagerProps) {
  const { user } = useAuth()
  const [documents, setDocuments] = useState<ClientDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileCategory, setFileCategory] = useState<ClientDocument['category']>('other')
  const [fileDescription, setFileDescription] = useState('')

  // Load documents
  useEffect(() => {
    loadDocuments()
  }, [clientId, tenantId])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const docs = await StorageService.getClientDocuments(clientId, tenantId)
      setDocuments(docs)
    } catch (error) {
      console.error('Error loading documents:', error)
      toast.error('Failed to load documents')
    } finally {
      setLoading(false)
    }
  }

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [])

  const handleFileSelect = (file: File) => {
    // Validate file
    const validation = StorageService.validateFile(file, 50)
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid file')
      return
    }

    setSelectedFile(file)
    setShowUploadModal(true)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !user) return

    try {
      setUploading(true)

      const document = await StorageService.uploadClientDocument(
        selectedFile,
        clientId,
        tenantId,
        user.uid,
        user.displayName || user.email || 'Unknown User',
        fileCategory,
        fileDescription,
        (progress) => {
          setUploadProgress(progress)
        }
      )

      toast.success('Document uploaded successfully!')
      setDocuments(prev => [document, ...prev])
      setShowUploadModal(false)
      resetUploadForm()
    } catch (error: any) {
      console.error('Error uploading document:', error)
      toast.error(error.message || 'Failed to upload document')
    } finally {
      setUploading(false)
      setUploadProgress(null)
    }
  }

  const handleDelete = async (documentId: string, documentName: string) => {
    if (!confirm(`Are you sure you want to delete "${documentName}"?`)) {
      return
    }

    try {
      await StorageService.deleteDocument(documentId)
      toast.success('Document deleted successfully')
      setDocuments(prev => prev.filter(doc => doc.id !== documentId))
    } catch (error: any) {
      console.error('Error deleting document:', error)
      toast.error(error.message || 'Failed to delete document')
    }
  }

  const handleDownload = (downloadURL: string, fileName: string) => {
    const link = document.createElement('a')
    link.href = downloadURL
    link.download = fileName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetUploadForm = () => {
    setSelectedFile(null)
    setFileCategory('other')
    setFileDescription('')
  }

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Calculate total storage
  const totalStorage = documents.reduce((sum, doc) => sum + doc.size, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Documents</h3>
          <p className="text-sm text-gray-400 mt-1">
            {documents.length} {documents.length === 1 ? 'document' : 'documents'}
            {' • '}{StorageService.formatFileSize(totalStorage)} total
          </p>
        </div>
        <Can permission="write:clients">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Upload Document</span>
          </button>
        </Can>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">All Categories</option>
          <option value="contract">Contracts</option>
          <option value="invoice">Invoices</option>
          <option value="proposal">Proposals</option>
          <option value="report">Reports</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Documents Grid */}
      {filteredDocuments.length === 0 ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`text-center py-16 bg-gray-900/50 backdrop-blur-xl border-2 border-dashed rounded-xl transition-colors ${
            dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-800'
          }`}
        >
          <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">
            {searchQuery || selectedCategory !== 'all' ? 'No documents match your filters' : 'No documents yet'}
          </p>
          <Can permission="write:clients">
            <p className="text-sm text-gray-500">
              Drag and drop files here or click the button above to upload
            </p>
          </Can>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map(doc => (
            <DocumentCard
              key={doc.id}
              document={doc}
              onDelete={handleDelete}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !uploading && setShowUploadModal(false)}
          />
          <div className="relative bg-gray-900 rounded-xl border border-gray-800 p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Upload Document</h3>
              {!uploading && (
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* File Input */}
              {!selectedFile ? (
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-gray-800'
                  }`}
                >
                  <Upload className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 mb-2">Drag and drop a file here</p>
                  <p className="text-sm text-gray-500 mb-4">or</p>
                  <label className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white cursor-pointer inline-block transition-colors">
                    <input
                      type="file"
                      onChange={handleFileInput}
                      className="hidden"
                    />
                    Browse Files
                  </label>
                  <p className="text-xs text-gray-500 mt-3">Max file size: 50MB</p>
                </div>
              ) : (
                <>
                  {/* Selected File */}
                  <div className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                    <span className="text-2xl">{StorageService.getFileIcon(selectedFile.type)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{selectedFile.name}</p>
                      <p className="text-sm text-gray-400">{StorageService.formatFileSize(selectedFile.size)}</p>
                    </div>
                    {!uploading && (
                      <button
                        onClick={() => setSelectedFile(null)}
                        className="p-1 rounded hover:bg-gray-700 text-gray-400 hover:text-white"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Category
                    </label>
                    <select
                      value={fileCategory}
                      onChange={(e) => setFileCategory(e.target.value as ClientDocument['category'])}
                      disabled={uploading}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    >
                      <option value="contract">Contract</option>
                      <option value="invoice">Invoice</option>
                      <option value="proposal">Proposal</option>
                      <option value="report">Report</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Description (Optional)
                    </label>
                    <textarea
                      value={fileDescription}
                      onChange={(e) => setFileDescription(e.target.value)}
                      disabled={uploading}
                      rows={3}
                      className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none disabled:opacity-50"
                      placeholder="Enter a description for this document..."
                    />
                  </div>

                  {/* Upload Progress */}
                  {uploadProgress && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Uploading...</span>
                        <span className="text-white">{Math.round(uploadProgress.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-purple-600 h-full transition-all duration-300"
                          style={{ width: `${uploadProgress.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={() => {
                        setShowUploadModal(false)
                        resetUploadForm()
                      }}
                      disabled={uploading}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpload}
                      disabled={uploading}
                      className="flex-1 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4" />
                          <span>Upload</span>
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Document Card Component
interface DocumentCardProps {
  document: ClientDocument
  onDelete: (id: string, name: string) => void
  onDownload: (url: string, name: string) => void
}

function DocumentCard({ document, onDelete, onDownload }: DocumentCardProps) {
  const [showMenu, setShowMenu] = useState(false)

  const getCategoryColor = (category: string) => {
    const colors = {
      contract: 'bg-blue-500/20 text-blue-300',
      invoice: 'bg-green-500/20 text-green-300',
      proposal: 'bg-purple-500/20 text-purple-300',
      report: 'bg-orange-500/20 text-orange-300',
      other: 'bg-gray-500/20 text-gray-300'
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <span className="text-3xl">{StorageService.getFileIcon(document.type)}</span>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-medium truncate">{document.originalName}</h4>
            <p className="text-sm text-gray-400">{StorageService.formatFileSize(document.size)}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 z-20">
                <button
                  onClick={() => {
                    onDownload(document.downloadURL, document.originalName)
                    setShowMenu(false)
                  }}
                  className="w-full px-4 py-2 text-left text-gray-300 hover:bg-gray-700 flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </button>
                <Can permission="write:clients">
                  <button
                    onClick={() => {
                      onDelete(document.id, document.originalName)
                      setShowMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </Can>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {document.category && (
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCategoryColor(document.category)}`}>
            {document.category}
          </span>
        )}
        {document.description && (
          <p className="text-sm text-gray-400 line-clamp-2">{document.description}</p>
        )}
        <div className="pt-2 border-t border-gray-800">
          <p className="text-xs text-gray-500">
            Uploaded by {document.uploadedByName} on {new Date(document.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  )
}
