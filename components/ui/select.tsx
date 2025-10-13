'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface SelectOption {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

interface SelectProps {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  label?: string
  error?: string
  required?: boolean
}

export default function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  disabled = false,
  label,
  error,
  required = false
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(opt => opt.value === value)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          setFocusedIndex(prev =>
            prev < options.length - 1 ? prev + 1 : prev
          )
          break
        case 'ArrowUp':
          event.preventDefault()
          setFocusedIndex(prev => prev > 0 ? prev - 1 : prev)
          break
        case 'Enter':
          event.preventDefault()
          if (focusedIndex >= 0 && !options[focusedIndex].disabled) {
            onChange(options[focusedIndex].value)
            setIsOpen(false)
          }
          break
        case 'Escape':
          event.preventDefault()
          setIsOpen(false)
          break
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, focusedIndex, options, onChange])

  // Auto-scroll focused option into view
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && dropdownRef.current) {
      const focusedElement = dropdownRef.current.children[focusedIndex] as HTMLElement
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [focusedIndex, isOpen])

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
      setFocusedIndex(-1)
    }
  }

  const handleSelect = (optionValue: string, optionDisabled?: boolean) => {
    if (!optionDisabled) {
      onChange(optionValue)
      setIsOpen(false)
    }
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}

      {/* Select Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={`
          w-full px-4 py-3 rounded-xl
          bg-gray-800/50 border border-gray-700
          text-left text-white
          flex items-center justify-between
          transition-all duration-200
          ${!disabled && 'hover:bg-gray-800 hover:border-gray-600'}
          ${isOpen && 'bg-gray-800 border-purple-500 ring-2 ring-purple-500/20'}
          ${error && 'border-red-500'}
          ${disabled && 'opacity-50 cursor-not-allowed'}
          focus:outline-none
        `}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {selectedOption?.icon && (
            <div className="flex-shrink-0 text-gray-400">
              {selectedOption.icon}
            </div>
          )}
          <span className={`truncate ${!selectedOption && 'text-gray-500'}`}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <ChevronDown
          className={`
            h-5 w-5 text-gray-400 flex-shrink-0 ml-2
            transition-transform duration-200
            ${isOpen && 'rotate-180'}
          `}
        />
      </button>

      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="
            absolute z-50 w-full mt-2
            rounded-xl overflow-hidden
            bg-gray-900 border border-gray-700
            shadow-2xl shadow-purple-500/10
            animate-scale-in origin-top
          "
        >
          <div
            ref={dropdownRef}
            className="max-h-60 overflow-y-auto overscroll-contain py-1"
          >
            {options.map((option, index) => {
              const isSelected = option.value === value
              const isFocused = index === focusedIndex

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleSelect(option.value, option.disabled)}
                  disabled={option.disabled}
                  className={`
                    w-full px-4 py-2.5
                    flex items-center justify-between gap-3
                    transition-all duration-150
                    ${!option.disabled && 'cursor-pointer'}
                    ${option.disabled && 'opacity-40 cursor-not-allowed'}
                    ${isFocused && !option.disabled && 'bg-purple-500/10'}
                    ${!isFocused && !option.disabled && 'hover:bg-gray-800'}
                    ${isSelected && 'bg-purple-500/20'}
                  `}
                  onMouseEnter={() => setFocusedIndex(index)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {option.icon && (
                      <div className={`
                        flex-shrink-0
                        ${isSelected ? 'text-purple-400' : 'text-gray-400'}
                      `}>
                        {option.icon}
                      </div>
                    )}
                    <span className={`
                      truncate text-left
                      ${isSelected ? 'text-purple-300 font-medium' : 'text-gray-300'}
                    `}>
                      {option.label}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="h-4 w-4 text-purple-400 flex-shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
