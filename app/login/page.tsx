'use client'

import { useState } from 'react'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { GlassCard } from '@/components/ui/glass-card'
import { Button } from '@/components/ui/button'
import {
  Rocket, Mail, Lock, User, Building2, Briefcase, UserCheck,
  ShieldCheck, ArrowRight, Loader2
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface LoginData {
  email: string
  password: string
  portal: 'superadmin' | 'admin' | 'employee' | 'client'
}

const portals = [
  {
    id: 'admin',
    name: 'Admin Portal',
    description: 'For company administrators',
    icon: ShieldCheck,
    gradient: 'from-blue-600 to-purple-600'
  },
  {
    id: 'employee',
    name: 'Employee Portal',
    description: 'For team members',
    icon: User,
    gradient: 'from-emerald-600 to-green-600'
  },
  {
    id: 'client',
    name: 'Client Portal',
    description: 'For clients and customers',
    icon: Building2,
    gradient: 'from-orange-600 to-red-600'
  },
  {
    id: 'superadmin',
    name: 'Super Admin',
    description: 'Platform administration',
    icon: Rocket,
    gradient: 'from-purple-600 to-pink-600'
  }
]

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [data, setData] = useState<LoginData>({
    email: '',
    password: '',
    portal: 'admin'
  })

  const handleInputChange = (field: keyof LoginData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!data.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!data.password) {
      newErrors.password = 'Password is required'
    }

    if (!data.portal) {
      newErrors.portal = 'Please select a portal'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    try {
      // Here we would call the auth context signIn method
      // For now, simulate the login
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Redirect based on portal
      switch (data.portal) {
        case 'superadmin':
          router.push('/superadmin')
          break
        case 'admin':
          router.push('/dashboard')
          break
        case 'employee':
          router.push('/employee')
          break
        case 'client':
          router.push('/client')
          break
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ submit: 'Invalid email or password' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Rocket className="h-10 w-10 text-blue-600" />
            <span className="text-3xl font-bold gradient-text">MasHub</span>
          </Link>
        </div>

        {/* Login Card */}
        <GlassCard className="p-8">
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Sign in to your account to continue
            </p>

            {/* Portal Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Select Portal
              </label>
              <div className="grid grid-cols-2 gap-3">
                {portals.map((portal) => (
                  <button
                    key={portal.id}
                    type="button"
                    onClick={() => handleInputChange('portal', portal.id)}
                    className={cn(
                      "relative p-4 rounded-lg border transition-all duration-300",
                      data.portal === portal.id
                        ? "bg-gradient-to-r border-transparent text-white shadow-lg scale-105"
                        : "bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border-white/20 dark:border-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-800/70",
                      data.portal === portal.id && portal.gradient
                    )}
                  >
                    <portal.icon className={cn(
                      "h-6 w-6 mb-2 mx-auto",
                      data.portal === portal.id ? "text-white" : "text-gray-600 dark:text-gray-400"
                    )} />
                    <div className={cn(
                      "text-sm font-medium",
                      data.portal === portal.id ? "text-white" : "text-gray-900 dark:text-white"
                    )}>
                      {portal.name}
                    </div>
                  </button>
                ))}
              </div>
              {errors.portal && (
                <p className="text-red-500 text-sm mt-2">{errors.portal}</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={cn(
                      "w-full pl-10 pr-4 py-2 rounded-lg",
                      "bg-white/50 dark:bg-gray-800/50 backdrop-blur-md",
                      "border",
                      errors.email ? "border-red-500" : "border-white/20 dark:border-gray-700/50",
                      "text-gray-900 dark:text-white",
                      "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                      "focus:bg-white/70 dark:focus:bg-gray-800/70",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500",
                      "transition-all duration-300"
                    )}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="password"
                    value={data.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={cn(
                      "w-full pl-10 pr-4 py-2 rounded-lg",
                      "bg-white/50 dark:bg-gray-800/50 backdrop-blur-md",
                      "border",
                      errors.password ? "border-red-500" : "border-white/20 dark:border-gray-700/50",
                      "text-gray-900 dark:text-white",
                      "placeholder:text-gray-400 dark:placeholder:text-gray-500",
                      "focus:bg-white/70 dark:focus:bg-gray-800/70",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500",
                      "transition-all duration-300"
                    )}
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 rounded"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error Message */}
              {errors.submit && (
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                  {errors.submit}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="gradient"
                className="w-full"
                icon={loading ? Loader2 : ArrowRight}
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Start free trial
              </Link>
            </div>
          </div>
        </GlassCard>

        {/* Security Note */}
        <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
          <Lock className="h-3 w-3 inline mr-1" />
          Secured with 256-bit encryption
        </div>
      </div>
    </div>
  )
}