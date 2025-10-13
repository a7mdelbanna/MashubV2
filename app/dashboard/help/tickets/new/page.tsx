'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  FileText,
  Image,
  Film
} from 'lucide-react'
import { TicketType, TicketPriority } from '@/types/help'
import { formatTicketType, formatTicketPriority } from '@/lib/help-utils'

export default function NewTicketPage() {
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<TicketType>('question')
  const [priority, setPriority] = useState<TicketPriority>('medium')
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setAttachments([...attachments, ...newFiles])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitted(true)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />
    if (file.type.startsWith('video/')) return <Film className="w-4 h-4" />
    return <FileText className="w-4 h-4" />
  }

  if (submitted) {
    return (
      <div className="p-8 max-w-[800px] mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Ticket Submitted Successfully!</h2>
          <p className="text-gray-400 mb-6">
            Your ticket <span className="text-white font-medium">TICK-{Math.floor(10000 + Math.random() * 90000)}</span> has been created.
            Our support team will respond within 24 hours.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/dashboard/help/tickets"
              className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              View My Tickets
            </Link>
            <button
              onClick={() => {
                setSubmitted(false)
                setSubject('')
                setDescription('')
                setType('question')
                setPriority('medium')
                setAttachments([])
              }}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Submit Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-[1000px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/help/tickets"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Tickets
        </Link>
        <h1 className="text-3xl font-bold text-white mb-2">Create Support Ticket</h1>
        <p className="text-gray-400">Describe your issue and our team will help you resolve it</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-400 mb-1">Before you submit</h3>
            <p className="text-sm text-gray-400">
              Check our <Link href="/dashboard/help" className="text-blue-400 hover:text-blue-300 underline">Knowledge Base</Link> and{' '}
              <Link href="/dashboard/help/faqs" className="text-blue-400 hover:text-blue-300 underline">FAQs</Link> for
              quick answers to common questions.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-6">
          {/* Main Form - 2 columns */}
          <div className="col-span-2 space-y-6">
            {/* Subject */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <label className="block text-sm font-medium text-white mb-2">
                Subject <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief description of your issue"
                required
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Description */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <label className="block text-sm font-medium text-white mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide as much detail as possible about your issue..."
                required
                rows={8}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-gray-500">
                  Include steps to reproduce, error messages, or any relevant information
                </p>
                <span className="text-xs text-gray-500">{description.length} characters</span>
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <label className="block text-sm font-medium text-white mb-2">
                Attachments
              </label>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center">
                <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                <p className="text-sm text-gray-400 mb-2">
                  Drag and drop files here, or{' '}
                  <label className="text-purple-400 hover:text-purple-300 cursor-pointer">
                    browse
                    <input
                      type="file"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.txt,.log"
                    />
                  </label>
                </p>
                <p className="text-xs text-gray-500">
                  Max 10MB per file. Supported: Images, PDFs, Documents, Logs
                </p>
              </div>

              {/* Attachment List */}
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-gray-400">
                          {getFileIcon(file)}
                        </div>
                        <div>
                          <div className="text-sm text-white">{file.name}</div>
                          <div className="text-xs text-gray-500">{formatFileSize(file.size)}</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="p-1 hover:bg-gray-800 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Ticket Type */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <label className="block text-sm font-medium text-white mb-3">
                Ticket Type <span className="text-red-400">*</span>
              </label>
              <div className="space-y-2">
                {(['question', 'bug', 'feature_request', 'technical_issue', 'billing', 'account'] as TicketType[]).map((t) => (
                  <label
                    key={t}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      type === t
                        ? 'bg-purple-500/20 border-purple-500'
                        : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={t}
                      checked={type === t}
                      onChange={(e) => setType(e.target.value as TicketType)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-white">{formatTicketType(t)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <label className="block text-sm font-medium text-white mb-3">
                Priority <span className="text-red-400">*</span>
              </label>
              <div className="space-y-2">
                {(['low', 'medium', 'high', 'urgent'] as TicketPriority[]).map((p) => (
                  <label
                    key={p}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      priority === p
                        ? 'bg-purple-500/20 border-purple-500'
                        : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name="priority"
                      value={p}
                      checked={priority === p}
                      onChange={(e) => setPriority(e.target.value as TicketPriority)}
                      className="text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-white">{formatTicketPriority(p)}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Urgent tickets are typically responded to within 1-4 hours
              </p>
            </div>

            {/* Response Time Info */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-400 mb-2">Expected Response Time</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Urgent: 1-4 hours</li>
                <li>• High: 4-8 hours</li>
                <li>• Medium: 24 hours</li>
                <li>• Low: 48 hours</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-4 mt-6">
          <Link
            href="/dashboard/help/tickets"
            className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || !subject || !description}
            className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Ticket'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
