'use client'

import { useState } from 'react'
import { AppCredential } from '@/types'
import { cn } from '@/lib/utils'
import {
  Key, Database, Lock, FileKey, Copy, Eye, EyeOff,
  Download, Plus, Edit, Trash2, ExternalLink, Shield,
  CheckCircle2, AlertTriangle
} from 'lucide-react'

interface CredentialsVaultProps {
  credentials: AppCredential[]
  onAdd?: () => void
  onEdit?: (credentialId: string) => void
  onDelete?: (credentialId: string) => void
  readonly?: boolean
  className?: string
}

const CREDENTIAL_TYPE_CONFIG = {
  login: {
    icon: Key,
    label: 'Login',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10'
  },
  api_key: {
    icon: FileKey,
    label: 'API Key',
    color: 'text-green-400',
    bg: 'bg-green-500/10'
  },
  database: {
    icon: Database,
    label: 'Database',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10'
  },
  certificate: {
    icon: Shield,
    label: 'Certificate',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10'
  },
  other: {
    icon: Lock,
    label: 'Other',
    color: 'text-gray-400',
    bg: 'bg-gray-500/10'
  }
}

function CredentialCard({
  credential,
  onEdit,
  onDelete,
  readonly
}: {
  credential: AppCredential
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  readonly?: boolean
}) {
  const [isRevealed, setIsRevealed] = useState(false)
  const [copied, setCopied] = useState(false)
  const config = CREDENTIAL_TYPE_CONFIG[credential.type]
  const Icon = config.icon

  const handleCopy = async () => {
    // In production, this would copy the decrypted value
    await navigator.clipboard.writeText(credential.value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isExpired = credential.expiresAt && new Date(credential.expiresAt) < new Date()
  const isExpiringSoon = credential.expiresAt &&
    new Date(credential.expiresAt) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

  return (
    <div className="rounded-xl bg-gray-800/30 border border-gray-700/50 p-4 hover:border-gray-600 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-lg', config.bg)}>
            <Icon className={cn('h-4 w-4', config.color)} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white">{credential.label}</h4>
              {isExpired && (
                <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30">
                  Expired
                </span>
              )}
              {!isExpired && isExpiringSoon && (
                <span className="px-2 py-0.5 rounded text-xs bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Expiring Soon
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">{config.label}</p>
          </div>
        </div>

        {!readonly && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit?.(credential.id)}
              className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
              title="Edit"
            >
              <Edit className="h-3.5 w-3.5 text-gray-400" />
            </button>
            <button
              onClick={() => onDelete?.(credential.id)}
              className="p-1.5 rounded-lg hover:bg-gray-700 transition-colors"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-400" />
            </button>
          </div>
        )}
      </div>

      {/* Credential Value */}
      <div className="mb-3">
        {credential.username && (
          <div className="mb-2">
            <label className="text-xs text-gray-500">Username</label>
            <p className="text-sm text-gray-300 font-mono">{credential.username}</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <label className="text-xs text-gray-500">
              {credential.type === 'api_key' ? 'Key' : credential.type === 'database' ? 'Connection String' : 'Password'}
            </label>
            <div className="relative">
              <input
                type={isRevealed ? 'text' : 'password'}
                value={credential.value}
                readOnly
                className="w-full px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-sm text-white font-mono focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-1 mt-5">
            <button
              onClick={() => setIsRevealed(!isRevealed)}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              title={isRevealed ? 'Hide' : 'Reveal'}
            >
              {isRevealed ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              title="Copy"
            >
              {copied ? (
                <CheckCircle2 className="h-4 w-4 text-green-400" />
              ) : (
                <Copy className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-700/50">
        <div className="flex items-center gap-4">
          {credential.owner && (
            <span>Owner: <span className="text-gray-400">{credential.owner}</span></span>
          )}
          {credential.expiresAt && (
            <span>Expires: <span className={cn(
              isExpired ? 'text-red-400' : isExpiringSoon ? 'text-yellow-400' : 'text-gray-400'
            )}>
              {new Date(credential.expiresAt).toLocaleDateString()}
            </span></span>
          )}
        </div>
        {credential.lastAccessedAt && (
          <span>
            Last used: {new Date(credential.lastAccessedAt).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Notes */}
      {credential.notes && (
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <p className="text-xs text-gray-400">{credential.notes}</p>
        </div>
      )}

      {/* Attachments */}
      {credential.attachments && credential.attachments.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-700/50">
          <p className="text-xs text-gray-500 mb-2">Attachments:</p>
          <div className="flex flex-wrap gap-2">
            {credential.attachments.map((attachment, index) => (
              <button
                key={index}
                className="px-2 py-1 rounded bg-gray-700/50 hover:bg-gray-700 text-xs text-gray-300 flex items-center gap-1 transition-colors"
              >
                <Download className="h-3 w-3" />
                {attachment}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function CredentialsVault({
  credentials,
  onAdd,
  onEdit,
  onDelete,
  readonly = false,
  className
}: CredentialsVaultProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Credentials Vault</h3>
            <p className="text-sm text-gray-400">{credentials.length} credential{credentials.length !== 1 ? 's' : ''} stored</p>
          </div>
        </div>

        {!readonly && onAdd && (
          <button
            onClick={onAdd}
            className="px-4 py-2 rounded-xl gradient-purple text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Credential
          </button>
        )}
      </div>

      {/* Security Notice */}
      <div className="rounded-xl bg-purple-500/10 border border-purple-500/20 p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-purple-400 font-medium mb-1">End-to-End Encryption</p>
            <p className="text-xs text-gray-400">
              All credentials are encrypted at rest and in transit. Only authorized team members can access sensitive data.
            </p>
          </div>
        </div>
      </div>

      {/* Credentials List */}
      {credentials.length === 0 ? (
        <div className="rounded-xl bg-gray-800/30 border border-gray-700/50 p-12 text-center">
          <Lock className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-white mb-2">No Credentials Yet</h4>
          <p className="text-sm text-gray-400 mb-4">
            Securely store and manage app credentials, API keys, and certificates
          </p>
          {!readonly && onAdd && (
            <button
              onClick={onAdd}
              className="px-4 py-2 rounded-xl gradient-purple text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Add First Credential
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {credentials.map((credential) => (
            <CredentialCard
              key={credential.id}
              credential={credential}
              onEdit={onEdit}
              onDelete={onDelete}
              readonly={readonly}
            />
          ))}
        </div>
      )}
    </div>
  )
}
