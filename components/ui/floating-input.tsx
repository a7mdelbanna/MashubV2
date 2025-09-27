'use client'

import { useState, InputHTMLAttributes, SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

interface FloatingInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  icon?: LucideIcon
  error?: string
}

export function FloatingInput({
  label,
  icon: Icon,
  error,
  className,
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false)
  const hasValue = value && value.toString().length > 0

  return (
    <div className="relative group">
      <div className={cn(
        "relative transition-all duration-300",
        focused && "transform scale-[1.02]"
      )}>
        {Icon && (
          <Icon className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-300 z-10",
            focused || hasValue ? "text-blue-500" : "text-gray-400",
            error && "text-red-500"
          )} />
        )}

        <input
          value={value}
          onChange={onChange}
          onFocus={(e) => {
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
          className={cn(
            "peer w-full h-14 px-4 pt-4 pb-1 rounded-2xl",
            Icon && "pl-12",
            "bg-white/10 dark:bg-gray-800/10",
            "backdrop-blur-xl",
            "border-2 transition-all duration-300",
            "text-gray-900 dark:text-white",
            "placeholder-transparent",
            "outline-none",
            !error && "border-gray-200/20 dark:border-gray-700/20",
            !error && "hover:border-gray-300/30 dark:hover:border-gray-600/30",
            !error && "focus:border-blue-500/50",
            error && "border-red-500/50 focus:border-red-500",
            "hover:bg-white/20 dark:hover:bg-gray-800/20",
            "focus:bg-white/30 dark:focus:bg-gray-800/30",
            "group-hover:shadow-lg",
            className
          )}
          placeholder={label}
          {...props}
        />

        <label className={cn(
          "absolute left-4 transition-all duration-300 pointer-events-none",
          Icon && "left-12",
          "text-gray-500 dark:text-gray-400",
          (focused || hasValue) && "top-2 text-xs",
          (focused || hasValue) && !error && "text-blue-500",
          (focused || hasValue) && error && "text-red-500",
          !(focused || hasValue) && "top-1/2 -translate-y-1/2",
        )}>
          {label}
        </label>

        {/* Glow effect on focus */}
        <div className={cn(
          "absolute inset-0 rounded-2xl transition-opacity duration-300",
          "bg-gradient-to-r from-blue-500/20 to-purple-500/20",
          "blur-xl",
          focused ? "opacity-100" : "opacity-0"
        )} />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500 animate-slide-down">{error}</p>
      )}
    </div>
  )
}

interface FloatingSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  icon?: LucideIcon
  error?: string
  options: { value: string; label: string }[]
}

export function FloatingSelect({
  label,
  icon: Icon,
  error,
  options,
  className,
  value,
  onChange,
  onFocus,
  onBlur,
  ...props
}: FloatingSelectProps) {
  const [focused, setFocused] = useState(false)
  const hasValue = value && value.toString().length > 0

  return (
    <div className="relative group">
      <div className={cn(
        "relative transition-all duration-300",
        focused && "transform scale-[1.02]"
      )}>
        {Icon && (
          <Icon className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 transition-all duration-300 z-10",
            focused || hasValue ? "text-blue-500" : "text-gray-400",
            error && "text-red-500"
          )} />
        )}

        <select
          value={value}
          onChange={onChange}
          onFocus={(e) => {
            setFocused(true)
            onFocus?.(e)
          }}
          onBlur={(e) => {
            setFocused(false)
            onBlur?.(e)
          }}
          className={cn(
            "peer w-full h-14 px-4 pt-4 pb-1 rounded-2xl appearance-none cursor-pointer",
            Icon && "pl-12",
            "bg-white/10 dark:bg-gray-800/10",
            "backdrop-blur-xl",
            "border-2 transition-all duration-300",
            "text-gray-900 dark:text-white",
            "outline-none",
            !error && "border-gray-200/20 dark:border-gray-700/20",
            !error && "hover:border-gray-300/30 dark:hover:border-gray-600/30",
            !error && "focus:border-blue-500/50",
            error && "border-red-500/50 focus:border-red-500",
            "hover:bg-white/20 dark:hover:bg-gray-800/20",
            "focus:bg-white/30 dark:focus:bg-gray-800/30",
            "group-hover:shadow-lg",
            className
          )}
          {...props}
        >
          <option value="" disabled>Select {label}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom arrow */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        <label className={cn(
          "absolute left-4 transition-all duration-300 pointer-events-none",
          Icon && "left-12",
          "text-gray-500 dark:text-gray-400",
          (focused || hasValue) && "top-2 text-xs",
          (focused || hasValue) && !error && "text-blue-500",
          (focused || hasValue) && error && "text-red-500",
          !(focused || hasValue) && "top-1/2 -translate-y-1/2",
        )}>
          {label}
        </label>

        {/* Glow effect on focus */}
        <div className={cn(
          "absolute inset-0 rounded-2xl transition-opacity duration-300",
          "bg-gradient-to-r from-blue-500/20 to-purple-500/20",
          "blur-xl",
          focused ? "opacity-100" : "opacity-0"
        )} />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500 animate-slide-down">{error}</p>
      )}
    </div>
  )
}