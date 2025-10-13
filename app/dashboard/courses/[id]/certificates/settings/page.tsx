'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Save,
  Award,
  Image as ImageIcon,
  Type,
  Palette,
  Settings,
  CheckCircle,
  Eye
} from 'lucide-react'

interface CertificateSettings {
  enabled: boolean
  autoIssue: boolean
  requirementType: 'completion' | 'grade' | 'both'
  minimumGrade: number
  minimumCompletionPercentage: number

  // Template Settings
  template: 'modern' | 'classic' | 'minimal' | 'elegant'
  primaryColor: string
  secondaryColor: string
  logoUrl: string
  backgroundUrl: string

  // Text Settings
  title: string
  subtitle: string
  showGrade: boolean
  showDate: boolean
  showDuration: boolean

  // Signature Settings
  instructorName: string
  instructorTitle: string
  instructorSignatureUrl: string
  showInstructorSignature: boolean

  organizationName: string
  organizationSignatureUrl: string
  showOrganizationSignature: boolean

  // Footer
  certificateFooter: string
  showVerificationCode: boolean
  showCertificateNumber: boolean
}

export default function CertificateSettingsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [settings, setSettings] = useState<CertificateSettings>({
    enabled: true,
    autoIssue: true,
    requirementType: 'both',
    minimumGrade: 70,
    minimumCompletionPercentage: 100,

    template: 'modern',
    primaryColor: '#8B5CF6',
    secondaryColor: '#3B82F6',
    logoUrl: '',
    backgroundUrl: '',

    title: 'Certificate of Completion',
    subtitle: 'This certifies that',
    showGrade: true,
    showDate: true,
    showDuration: true,

    instructorName: 'Dr. Jane Smith',
    instructorTitle: 'Senior Web Developer',
    instructorSignatureUrl: '',
    showInstructorSignature: true,

    organizationName: 'MasHub Academy',
    organizationSignatureUrl: '',
    showOrganizationSignature: false,

    certificateFooter: 'Verify this certificate at https://example.com/verify',
    showVerificationCode: true,
    showCertificateNumber: true
  })

  const handleChange = (field: keyof CertificateSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    console.log('Saving certificate settings:', settings)

    // API call would go here
    alert('Certificate settings saved successfully!')

    // Navigate back to certificates list
    router.push(`/dashboard/courses/${courseId}/certificates`)
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href={`/dashboard/courses/${courseId}/certificates`}
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-purple-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Certificates</span>
        </Link>

        <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
          Certificate Settings
        </h1>
        <p className="text-gray-400">Configure certificate templates and issuance rules</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Settings */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">General Settings</h2>

          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 cursor-pointer hover:bg-gray-800/70 transition-colors">
              <div>
                <p className="text-white font-medium">Enable Certificates</p>
                <p className="text-sm text-gray-400">Allow students to earn certificates for this course</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => handleChange('enabled', e.target.checked)}
                className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
              />
            </label>

            {settings.enabled && (
              <>
                <label className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 cursor-pointer hover:bg-gray-800/70 transition-colors">
                  <div>
                    <p className="text-white font-medium">Auto-Issue Certificates</p>
                    <p className="text-sm text-gray-400">Automatically issue certificates when requirements are met</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoIssue}
                    onChange={(e) => handleChange('autoIssue', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                  />
                </label>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Requirement Type
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'completion', label: 'Course Completion Only', desc: 'Complete all mandatory lessons' },
                      { value: 'grade', label: 'Minimum Grade Only', desc: 'Achieve minimum average grade' },
                      { value: 'both', label: 'Both Requirements', desc: 'Complete course and achieve minimum grade' }
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          settings.requirementType === option.value
                            ? 'bg-purple-500/10 border-purple-500/30'
                            : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="requirementType"
                          value={option.value}
                          checked={settings.requirementType === option.value}
                          onChange={(e) => handleChange('requirementType', e.target.value)}
                          className="mt-0.5 w-4 h-4 border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                        />
                        <div>
                          <p className="text-white font-medium text-sm">{option.label}</p>
                          <p className="text-xs text-gray-400">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {(settings.requirementType === 'grade' || settings.requirementType === 'both') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Minimum Grade (%)
                    </label>
                    <input
                      type="number"
                      value={settings.minimumGrade}
                      onChange={(e) => handleChange('minimumGrade', parseInt(e.target.value))}
                      min="0"
                      max="100"
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                )}

                {(settings.requirementType === 'completion' || settings.requirementType === 'both') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Minimum Completion (%)
                    </label>
                    <input
                      type="number"
                      value={settings.minimumCompletionPercentage}
                      onChange={(e) => handleChange('minimumCompletionPercentage', parseInt(e.target.value))}
                      min="0"
                      max="100"
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Template Design */}
        {settings.enabled && (
          <>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Template Design</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Template Style
                  </label>
                  <div className="grid grid-cols-4 gap-4">
                    {['modern', 'classic', 'minimal', 'elegant'].map((template) => (
                      <button
                        key={template}
                        type="button"
                        onClick={() => handleChange('template', template)}
                        className={`p-4 rounded-lg border-2 transition-all capitalize ${
                          settings.template === template
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                        }`}
                      >
                        <Award className={`w-8 h-8 mx-auto mb-2 ${
                          settings.template === template ? 'text-purple-400' : 'text-gray-400'
                        }`} />
                        <p className={`text-sm font-medium ${
                          settings.template === template ? 'text-purple-400' : 'text-gray-400'
                        }`}>
                          {template}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                        className="w-12 h-10 rounded border border-gray-700 bg-gray-800"
                      />
                      <input
                        type="text"
                        value={settings.primaryColor}
                        onChange={(e) => handleChange('primaryColor', e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => handleChange('secondaryColor', e.target.value)}
                        className="w-12 h-10 rounded border border-gray-700 bg-gray-800"
                      />
                      <input
                        type="text"
                        value={settings.secondaryColor}
                        onChange={(e) => handleChange('secondaryColor', e.target.value)}
                        className="flex-1 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Logo URL
                  </label>
                  <input
                    type="url"
                    value={settings.logoUrl}
                    onChange={(e) => handleChange('logoUrl', e.target.value)}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Background Image URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={settings.backgroundUrl}
                    onChange={(e) => handleChange('backgroundUrl', e.target.value)}
                    placeholder="https://example.com/background.png"
                    className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Text Content */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Text Content</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Certificate Title
                  </label>
                  <input
                    type="text"
                    value={settings.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subtitle Text
                  </label>
                  <input
                    type="text"
                    value={settings.subtitle}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.showGrade}
                      onChange={(e) => handleChange('showGrade', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                    />
                    <span className="text-white text-sm">Show final grade on certificate</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.showDate}
                      onChange={(e) => handleChange('showDate', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                    />
                    <span className="text-white text-sm">Show completion date</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.showDuration}
                      onChange={(e) => handleChange('showDuration', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                    />
                    <span className="text-white text-sm">Show course duration</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Footer Text
                  </label>
                  <textarea
                    value={settings.certificateFooter}
                    onChange={(e) => handleChange('certificateFooter', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.showVerificationCode}
                      onChange={(e) => handleChange('showVerificationCode', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                    />
                    <span className="text-white text-sm">Show verification code</span>
                  </label>

                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={settings.showCertificateNumber}
                      onChange={(e) => handleChange('showCertificateNumber', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                    />
                    <span className="text-white text-sm">Show certificate number</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Signatures */}
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Signatures</h2>

              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                  <label className="flex items-center space-x-3 mb-4">
                    <input
                      type="checkbox"
                      checked={settings.showInstructorSignature}
                      onChange={(e) => handleChange('showInstructorSignature', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                    />
                    <span className="text-white font-medium">Instructor Signature</span>
                  </label>

                  {settings.showInstructorSignature && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Name</label>
                        <input
                          type="text"
                          value={settings.instructorName}
                          onChange={(e) => handleChange('instructorName', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Title</label>
                        <input
                          type="text"
                          value={settings.instructorTitle}
                          onChange={(e) => handleChange('instructorTitle', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Signature Image URL</label>
                        <input
                          type="url"
                          value={settings.instructorSignatureUrl}
                          onChange={(e) => handleChange('instructorSignatureUrl', e.target.value)}
                          placeholder="https://example.com/signature.png"
                          className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                  <label className="flex items-center space-x-3 mb-4">
                    <input
                      type="checkbox"
                      checked={settings.showOrganizationSignature}
                      onChange={(e) => handleChange('showOrganizationSignature', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-500 focus:ring-purple-500 focus:ring-offset-gray-900"
                    />
                    <span className="text-white font-medium">Organization Signature</span>
                  </label>

                  {settings.showOrganizationSignature && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Organization Name</label>
                        <input
                          type="text"
                          value={settings.organizationName}
                          onChange={(e) => handleChange('organizationName', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Signature Image URL</label>
                        <input
                          type="url"
                          value={settings.organizationSignatureUrl}
                          onChange={(e) => handleChange('organizationSignatureUrl', e.target.value)}
                          placeholder="https://example.com/org-signature.png"
                          className="w-full px-4 py-2 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
          <Link
            href={`/dashboard/courses/${courseId}/certificates`}
            className="px-6 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all"
          >
            Cancel
          </Link>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              className="px-6 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-all flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>

            <button
              type="submit"
              className="px-6 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Settings</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
