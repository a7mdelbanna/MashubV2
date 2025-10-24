'use client'

import { useState } from 'react'
import {
  Rocket, Mail, Lock, User, Building2, ShieldCheck, ArrowRight, Sparkles
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
    gradient: 'gradient-blue'
  },
  {
    id: 'employee',
    name: 'Employee Portal',
    description: 'For team members',
    icon: User,
    gradient: 'gradient-green'
  },
  {
    id: 'client',
    name: 'Client Portal',
    description: 'For clients and customers',
    icon: Building2,
    gradient: 'gradient-orange'
  },
  {
    id: 'superadmin',
    name: 'Super Admin',
    description: 'Platform administration',
    icon: Rocket,
    gradient: 'gradient-purple'
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 gradient-purple rounded-full opacity-20 blur-3xl animate-float" />
        <div className="absolute top-60 -left-40 w-80 h-80 gradient-blue rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-40 w-60 h-60 gradient-green rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8 animate-fade-in">
            <Link href="/" className="inline-flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 rounded-xl gradient-purple flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <span className="text-3xl font-bold text-white">MasHub</span>
            </Link>
            <p className="text-gray-400 text-sm mt-3">Business OS for Software Houses</p>
          </div>

          {/* Login Card */}
          <div className="rounded-3xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8 animate-slide-up">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                Welcome back
              </h2>
              <p className="text-gray-400">
                Sign in to your account to continue
              </p>
            </div>

            {/* Portal Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Select Portal
              </label>
              <div className="grid grid-cols-2 gap-4">
                {portals.map((portal, index) => (
                  <button
                    key={portal.id}
                    type="button"
                    onClick={() => handleInputChange('portal', portal.id)}
                    className={cn(
                      "group relative rounded-xl p-5 transition-all duration-300",
                      data.portal === portal.id
                        ? "bg-gray-800 border-2 border-purple-500"
                        : "bg-gray-800/50 border-2 border-gray-700 hover:border-gray-600 hover:bg-gray-800/70"
                    )}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={cn(
                      "w-full h-20 rounded-lg mb-3 flex items-center justify-center transition-all duration-300",
                      data.portal === portal.id ? portal.gradient : "bg-gray-700/50"
                    )}>
                      <portal.icon className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-white text-sm font-medium text-center">
                      {portal.name}
                    </p>
                  </button>
                ))}
              </div>
              {errors.portal && (
                <p className="text-red-400 text-sm mt-2">{errors.portal}</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={cn(
                      "w-full pl-12 pr-4 py-3.5 rounded-xl",
                      "bg-gray-800/50 backdrop-blur-md",
                      "border-2",
                      errors.email ? "border-red-500" : "border-gray-700",
                      "text-white placeholder:text-gray-500",
                      "focus:bg-gray-800 focus:border-purple-500",
                      "focus:outline-none",
                      "transition-all duration-300"
                    )}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-2">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="password"
                    value={data.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={cn(
                      "w-full pl-12 pr-4 py-3.5 rounded-xl",
                      "bg-gray-800/50 backdrop-blur-md",
                      "border-2",
                      errors.password ? "border-red-500" : "border-gray-700",
                      "text-white placeholder:text-gray-500",
                      "focus:bg-gray-800 focus:border-purple-500",
                      "focus:outline-none",
                      "transition-all duration-300"
                    )}
                    placeholder="Enter your password"
                  />
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-2">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 rounded bg-gray-800 border-gray-700 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-gray-400">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Error Message */}
              {errors.submit && (
                <div className="p-4 rounded-xl bg-red-900/20 border border-red-500/50 text-red-400 text-sm">
                  {errors.submit}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full py-4 rounded-xl font-medium transition-all duration-300",
                  "gradient-purple text-white shadow-lg",
                  "hover:opacity-90 hover:shadow-xl",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "flex items-center justify-center"
                )}
              >
                {loading ? (
                  <>
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                Start free trial
              </Link>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-6 text-center text-xs text-gray-500 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <Lock className="h-3 w-3 inline mr-1" />
            Secured with 256-bit encryption
          </div>
        </div>
      </div>
    </div>
  )
}
