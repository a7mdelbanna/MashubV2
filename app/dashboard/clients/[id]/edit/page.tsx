'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { PermissionGuard } from '@/components/auth/permission-guard'
import ClientForm from '@/components/clients/client-form'
import { clientsService } from '@/lib/services/clients-service'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Client } from '@/types/clients'

export default function EditClientPage() {
  const params = useParams()
  const clientId = params.id as string
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadClient = async () => {
      try {
        const clientData = await clientsService.getClient(clientId)
        setClient(clientData)
      } catch (error) {
        console.error('Error loading client:', error)
      } finally {
        setLoading(false)
      }
    }

    if (clientId) {
      loadClient()
    }
  }, [clientId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    )
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-bold text-white mb-2">Client Not Found</h2>
        <p className="text-gray-400 mb-6">The client you're trying to edit doesn't exist</p>
        <Link
          href="/dashboard/clients"
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
        >
          Back to Clients
        </Link>
      </div>
    )
  }

  return (
    <PermissionGuard permission="write:clients">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href={`/dashboard/clients/${clientId}`}
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Client</h1>
            <p className="text-gray-400 mt-1">Update {client.name}'s information</p>
          </div>
        </div>

        {/* Form */}
        <ClientForm client={client} mode="edit" />
      </div>
    </PermissionGuard>
  )
}
