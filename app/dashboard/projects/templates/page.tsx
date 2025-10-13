'use client'

import { useState } from 'react'
import { FileText, Plus, Search, Copy, Eye, Edit2, Trash2, Calendar, Users, CheckCircle, Star } from 'lucide-react'

interface ProjectTemplate {
  id: string
  name: string
  description: string
  category: string
  tasks: number
  duration: string
  team: number
  usageCount: number
  rating: number
  tags: string[]
}

const mockTemplates: ProjectTemplate[] = [
  { id: 't1', name: 'Website Development', description: 'Complete website project with design, development, and deployment phases', category: 'Development', tasks: 45, duration: '12 weeks', team: 5, usageCount: 28, rating: 4.8, tags: ['web', 'frontend', 'backend'] },
  { id: 't2', name: 'Mobile App MVP', description: 'Minimum viable product for mobile applications (iOS & Android)', category: 'Development', tasks: 38, duration: '10 weeks', team: 4, usageCount: 22, rating: 4.6, tags: ['mobile', 'ios', 'android'] },
  { id: 't3', name: 'Marketing Campaign', description: 'Multi-channel marketing campaign with planning, execution, and analysis', category: 'Marketing', tasks: 25, duration: '8 weeks', team: 3, usageCount: 35, rating: 4.9, tags: ['marketing', 'social', 'ads'] },
  { id: 't4', name: 'Product Launch', description: 'End-to-end product launch workflow including beta testing and rollout', category: 'Product', tasks: 32, duration: '6 weeks', team: 6, usageCount: 18, rating: 4.7, tags: ['launch', 'beta', 'rollout'] },
  { id: 't5', name: 'Infrastructure Migration', description: 'Cloud infrastructure migration with minimal downtime', category: 'DevOps', tasks: 28, duration: '8 weeks', team: 4, usageCount: 12, rating: 4.5, tags: ['cloud', 'migration', 'devops'] }
]

export default function ProjectTemplatesPage() {
  const [templates, setTemplates] = useState<ProjectTemplate[]>(mockTemplates)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || t.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Project Templates</h1>
          <p className="text-gray-400">Start projects faster with pre-built templates</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
          Create Template
        </button>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search templates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500" />
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500">
            <option value="all">All Categories</option>
            <option value="Development">Development</option>
            <option value="Marketing">Marketing</option>
            <option value="Product">Product</option>
            <option value="DevOps">DevOps</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:bg-gray-700/30 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
                    {template.category}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{template.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Tasks</p>
                <p className="text-sm font-medium text-white">{template.tasks}</p>
              </div>
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Duration</p>
                <p className="text-sm font-medium text-white">{template.duration}</p>
              </div>
              <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Team Size</p>
                <p className="text-sm font-medium text-white">{template.team}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{template.usageCount} uses</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{template.rating}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {template.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                <Copy className="w-4 h-4" />
                Use Template
              </button>
              <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
