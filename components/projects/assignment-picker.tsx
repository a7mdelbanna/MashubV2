'use client'

import { useState } from 'react'
import { User, Users, ChevronDown, Check } from 'lucide-react'
import { TeamMember } from '@/types'

interface AssignmentOption {
  id: string
  name: string
  type: 'user' | 'team'
  avatar?: string
  role?: string
}

interface AssignmentPickerProps {
  teamMembers: TeamMember[]
  teams?: string[] // Available team/role names
  value?: { assignedTo: string; assignedType: 'user' | 'team' } | null
  onChange: (assignment: { assignedTo: string; assignedType: 'user' | 'team' } | null) => void
  placeholder?: string
  className?: string
}

export function AssignmentPicker({
  teamMembers,
  teams = ['Development Team', 'QA Team', 'Design Team', 'DevOps Team'],
  value,
  onChange,
  placeholder = 'Assign to...',
  className = ''
}: AssignmentPickerProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Build options list
  const userOptions: AssignmentOption[] = teamMembers.map(member => ({
    id: member.id,
    name: member.name,
    type: 'user' as const,
    avatar: member.avatar,
    role: member.role
  }))

  const teamOptions: AssignmentOption[] = teams.map(teamName => ({
    id: teamName,
    name: teamName,
    type: 'team' as const
  }))

  const allOptions = [...userOptions, ...teamOptions]

  // Find selected option
  const selectedOption = value
    ? allOptions.find(opt => opt.id === value.assignedTo && opt.type === value.assignedType)
    : null

  const handleSelect = (option: AssignmentOption) => {
    onChange({
      assignedTo: option.id,
      assignedType: option.type
    })
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange(null)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg
                   text-left text-sm text-gray-300 hover:bg-gray-800
                   focus:outline-none focus:ring-2 focus:ring-purple-500
                   flex items-center justify-between gap-2"
      >
        {selectedOption ? (
          <div className="flex items-center gap-2">
            {selectedOption.type === 'user' ? (
              <>
                {selectedOption.avatar ? (
                  <img
                    src={selectedOption.avatar}
                    alt={selectedOption.name}
                    className="w-5 h-5 rounded-full"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                    <User className="w-3 h-3 text-white" />
                  </div>
                )}
                <span>{selectedOption.name}</span>
                {selectedOption.role && (
                  <span className="text-xs text-gray-500">({selectedOption.role})</span>
                )}
              </>
            ) : (
              <>
                <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                  <Users className="w-3 h-3 text-white" />
                </div>
                <span>{selectedOption.name}</span>
              </>
            )}
          </div>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Options */}
          <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-64 overflow-y-auto">
            {/* Clear option */}
            {value && (
              <>
                <button
                  type="button"
                  onClick={handleClear}
                  className="w-full px-3 py-2 text-left text-sm text-gray-400 hover:bg-gray-700/50
                             flex items-center gap-2 border-b border-gray-700"
                >
                  <span>Clear assignment</span>
                </button>
              </>
            )}

            {/* Team Members */}
            {userOptions.length > 0 && (
              <>
                <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-900/50">
                  Team Members
                </div>
                {userOptions.map(option => (
                  <button
                    key={`user-${option.id}`}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700/50
                               flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      {option.avatar ? (
                        <img
                          src={option.avatar}
                          alt={option.name}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center">
                          <User className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span>{option.name}</span>
                        {option.role && (
                          <span className="text-xs text-gray-500">{option.role}</span>
                        )}
                      </div>
                    </div>
                    {value?.assignedTo === option.id && value?.assignedType === 'user' && (
                      <Check className="w-4 h-4 text-purple-500" />
                    )}
                  </button>
                ))}
              </>
            )}

            {/* Teams */}
            {teamOptions.length > 0 && (
              <>
                <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-900/50 border-t border-gray-700">
                  Teams
                </div>
                {teamOptions.map(option => (
                  <button
                    key={`team-${option.id}`}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:bg-gray-700/50
                               flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                        <Users className="w-3 h-3 text-white" />
                      </div>
                      <span>{option.name}</span>
                    </div>
                    {value?.assignedTo === option.id && value?.assignedType === 'team' && (
                      <Check className="w-4 h-4 text-purple-500" />
                    )}
                  </button>
                ))}
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
