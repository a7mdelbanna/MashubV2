'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles, Building2, User, Mail, Lock, ArrowRight, ArrowLeft,
  Check, Briefcase, Users, Globe, Phone, Loader2,
  ChevronRight, Star, Zap, Shield, Award, DollarSign
} from 'lucide-react'

interface SignupData {
  companyName: string
  companySize: string
  industry: string
  website?: string
  adminName: string
  adminEmail: string
  adminPassword: string
  adminPhone?: string
  subdomain: string
  timezone: string
  currency: string
  plan: 'trial' | 'starter' | 'pro'
  acceptTerms: boolean
}

const steps = [
  {
    id: 1,
    name: 'Company Info',
    icon: Building2,
    description: 'Tell us about your business',
    gradient: 'gradient-blue'
  },
  {
    id: 2,
    name: 'Admin Account',
    icon: User,
    description: 'Create your administrator account',
    gradient: 'gradient-green'
  },
  {
    id: 3,
    name: 'Workspace',
    icon: Globe,
    description: 'Configure your workspace',
    gradient: 'gradient-orange'
  },
  {
    id: 4,
    name: 'Choose Plan',
    icon: Award,
    description: 'Select the perfect plan',
    gradient: 'gradient-purple'
  }
]

const companySizes = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '500+', label: '500+ employees' }
]

const industries = [
  { value: 'software', label: 'Software Development' },
  { value: 'mobile', label: 'Mobile App Development' },
  { value: 'web', label: 'Web Development' },
  { value: 'consulting', label: 'IT Consulting' },
  { value: 'digital', label: 'Digital Agency' },
  { value: 'other', label: 'Other' }
]

const timezones = [
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)' }
]

const currencies = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' },
  { value: 'JPY', label: 'JPY - Japanese Yen' }
]

const plans = [
  {
    id: 'trial',
    name: '14-Day Trial',
    price: 0,
    description: 'Try all features',
    features: ['5 Users', '10 Projects', 'Basic Features', 'Community Support'],
    gradient: 'gradient-blue',
    popular: false
  },
  {
    id: 'starter',
    name: 'Starter',
    price: 99,
    description: 'Small teams',
    features: ['15 Users', '50 Projects', 'Core Features', 'Email Support'],
    gradient: 'gradient-green',
    popular: false
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 299,
    description: 'Growing teams',
    features: ['50 Users', 'Unlimited Projects', 'Advanced Features', 'Priority Support'],
    gradient: 'gradient-purple',
    popular: true
  }
]

export default function SignupPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [mounted, setMounted] = useState(false)
  const [data, setData] = useState<SignupData>({
    companyName: '',
    companySize: '',
    industry: '',
    website: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    adminPhone: '',
    subdomain: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    currency: 'USD',
    plan: 'trial',
    acceptTerms: false
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleInputChange = (field: keyof SignupData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!data.companyName) newErrors.companyName = 'Company name is required'
        if (!data.companySize) newErrors.companySize = 'Please select company size'
        if (!data.industry) newErrors.industry = 'Please select your industry'
        break
      case 2:
        if (!data.adminName) newErrors.adminName = 'Name is required'
        if (!data.adminEmail) newErrors.adminEmail = 'Email is required'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.adminEmail)) {
          newErrors.adminEmail = 'Please enter a valid email'
        }
        if (!data.adminPassword) newErrors.adminPassword = 'Password is required'
        else if (data.adminPassword.length < 8) {
          newErrors.adminPassword = 'Password must be at least 8 characters'
        }
        break
      case 3:
        if (!data.subdomain) newErrors.subdomain = 'Subdomain is required'
        else if (!/^[a-z0-9-]+$/.test(data.subdomain)) {
          newErrors.subdomain = 'Only lowercase letters, numbers, and hyphens allowed'
        }
        break
      case 4:
        if (!data.acceptTerms) newErrors.acceptTerms = 'You must accept the terms'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      router.push('/dashboard')
    } catch (error) {
      console.error('Signup error:', error)
      setErrors({ submit: 'Failed to create account. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 gradient-purple rounded-full opacity-20 blur-3xl animate-float" />
        <div className="absolute top-60 -left-40 w-80 h-80 gradient-blue rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-40 w-60 h-60 gradient-green rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Header */}
      <div className="relative z-10 px-6 py-6 border-b border-gray-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">MasHub</span>
          </Link>
          <Link href="/login" className="text-gray-400 hover:text-white transition-colors group">
            Already have an account?
            <span className="text-purple-400 ml-1 group-hover:text-purple-300">Sign in</span>
            <ChevronRight className="inline-block h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          {/* Progress Steps */}
          <div className="mb-12">
            <div className="relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-0 right-0 h-0.5 bg-gray-800">
                <motion.div
                  className="h-full gradient-purple"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>

              {/* Step Circles */}
              <div className="relative flex justify-between">
                {steps.map((step, index) => {
                  const isActive = currentStep === step.id
                  const isCompleted = currentStep > step.id

                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div className={cn(
                        "relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                        isActive && step.gradient,
                        isCompleted && "gradient-green",
                        !isActive && !isCompleted && "bg-gray-800 border-2 border-gray-700"
                      )}>
                        {isCompleted ? (
                          <Check className="h-5 w-5 text-white" />
                        ) : (
                          <step.icon className={cn(
                            "h-5 w-5",
                            isActive ? "text-white" : "text-gray-500"
                          )} />
                        )}

                        {isActive && (
                          <div className={cn(
                            "absolute inset-0 rounded-full blur-lg opacity-50 animate-pulse",
                            step.gradient
                          )} />
                        )}
                      </div>

                      <div className="mt-3 text-center">
                        <p className={cn(
                          "text-sm font-medium",
                          isActive ? "text-purple-400" : "text-gray-500"
                        )}>
                          {step.name}
                        </p>
                        {isActive && (
                          <p className="text-xs text-gray-500 mt-1">
                            {step.description}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="relative">
            <div className="absolute inset-0 gradient-purple opacity-10 blur-3xl" />

            <div className="relative rounded-3xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8 md:p-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Step 1: Company Information */}
                  {currentStep === 1 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <div className="inline-flex p-4 rounded-2xl gradient-blue mb-4">
                          <Building2 className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                          Tell us about your company
                        </h2>
                        <p className="text-gray-400">
                          We'll customize your experience based on your needs
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          value={data.companyName}
                          onChange={(e) => handleInputChange('companyName', e.target.value)}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl bg-gray-800/50 border transition-all",
                            "text-white placeholder-gray-500",
                            "focus:bg-gray-800 focus:outline-none",
                            errors.companyName ? "border-red-500" : "border-gray-700 focus:border-purple-500"
                          )}
                          placeholder="Enter your company name"
                        />
                        {errors.companyName && (
                          <p className="text-red-400 text-sm mt-1">{errors.companyName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Company Size
                        </label>
                        <select
                          value={data.companySize}
                          onChange={(e) => handleInputChange('companySize', e.target.value)}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl bg-gray-800/50 border transition-all",
                            "text-white",
                            "focus:bg-gray-800 focus:outline-none",
                            errors.companySize ? "border-red-500" : "border-gray-700 focus:border-purple-500"
                          )}
                        >
                          <option value="">Select company size</option>
                          {companySizes.map(size => (
                            <option key={size.value} value={size.value}>{size.label}</option>
                          ))}
                        </select>
                        {errors.companySize && (
                          <p className="text-red-400 text-sm mt-1">{errors.companySize}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Industry
                        </label>
                        <select
                          value={data.industry}
                          onChange={(e) => handleInputChange('industry', e.target.value)}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl bg-gray-800/50 border transition-all",
                            "text-white",
                            "focus:bg-gray-800 focus:outline-none",
                            errors.industry ? "border-red-500" : "border-gray-700 focus:border-purple-500"
                          )}
                        >
                          <option value="">Select your industry</option>
                          {industries.map(industry => (
                            <option key={industry.value} value={industry.value}>{industry.label}</option>
                          ))}
                        </select>
                        {errors.industry && (
                          <p className="text-red-400 text-sm mt-1">{errors.industry}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Website (Optional)
                        </label>
                        <input
                          type="url"
                          value={data.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                          placeholder="https://yourcompany.com"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Admin Account */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <div className="inline-flex p-4 rounded-2xl gradient-green mb-4">
                          <User className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                          Create your admin account
                        </h2>
                        <p className="text-gray-400">
                          This will be the primary administrator for your workspace
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={data.adminName}
                          onChange={(e) => handleInputChange('adminName', e.target.value)}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl bg-gray-800/50 border transition-all",
                            "text-white placeholder-gray-500",
                            "focus:bg-gray-800 focus:outline-none",
                            errors.adminName ? "border-red-500" : "border-gray-700 focus:border-purple-500"
                          )}
                          placeholder="John Doe"
                        />
                        {errors.adminName && (
                          <p className="text-red-400 text-sm mt-1">{errors.adminName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={data.adminEmail}
                          onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl bg-gray-800/50 border transition-all",
                            "text-white placeholder-gray-500",
                            "focus:bg-gray-800 focus:outline-none",
                            errors.adminEmail ? "border-red-500" : "border-gray-700 focus:border-purple-500"
                          )}
                          placeholder="john@company.com"
                        />
                        {errors.adminEmail && (
                          <p className="text-red-400 text-sm mt-1">{errors.adminEmail}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Password
                        </label>
                        <input
                          type="password"
                          value={data.adminPassword}
                          onChange={(e) => handleInputChange('adminPassword', e.target.value)}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl bg-gray-800/50 border transition-all",
                            "text-white placeholder-gray-500",
                            "focus:bg-gray-800 focus:outline-none",
                            errors.adminPassword ? "border-red-500" : "border-gray-700 focus:border-purple-500"
                          )}
                          placeholder="Minimum 8 characters"
                        />
                        {errors.adminPassword && (
                          <p className="text-red-400 text-sm mt-1">{errors.adminPassword}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="tel"
                          value={data.adminPhone}
                          onChange={(e) => handleInputChange('adminPhone', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Workspace Setup */}
                  {currentStep === 3 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <div className="inline-flex p-4 rounded-2xl gradient-orange mb-4">
                          <Globe className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                          Set up your workspace
                        </h2>
                        <p className="text-gray-400">
                          Configure your workspace URL and preferences
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Workspace URL
                        </label>
                        <div className="flex">
                          <input
                            type="text"
                            value={data.subdomain}
                            onChange={(e) => handleInputChange('subdomain', e.target.value.toLowerCase())}
                            className={cn(
                              "flex-1 px-4 py-3 rounded-l-xl bg-gray-800/50 border-y border-l transition-all",
                              "text-white placeholder-gray-500",
                              "focus:bg-gray-800 focus:outline-none",
                              errors.subdomain ? "border-red-500" : "border-gray-700 focus:border-purple-500"
                            )}
                            placeholder="yourcompany"
                          />
                          <div className="px-4 py-3 rounded-r-xl bg-gray-800/30 border-y border-r border-gray-700 text-gray-400">
                            .mashub.io
                          </div>
                        </div>
                        {errors.subdomain && (
                          <p className="text-red-400 text-sm mt-1">{errors.subdomain}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Timezone
                        </label>
                        <select
                          value={data.timezone}
                          onChange={(e) => handleInputChange('timezone', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                        >
                          {timezones.map(tz => (
                            <option key={tz.value} value={tz.value}>{tz.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Currency
                        </label>
                        <select
                          value={data.currency}
                          onChange={(e) => handleInputChange('currency', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                        >
                          {currencies.map(currency => (
                            <option key={currency.value} value={currency.value}>{currency.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Choose Plan */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="text-center mb-8">
                        <div className="inline-flex p-4 rounded-2xl gradient-purple mb-4">
                          <Award className="h-8 w-8 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                          Choose your plan
                        </h2>
                        <p className="text-gray-400">
                          Start with a 14-day free trial, no credit card required
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {plans.map((plan) => (
                          <div
                            key={plan.id}
                            onClick={() => handleInputChange('plan', plan.id)}
                            className={cn(
                              "relative p-6 rounded-2xl cursor-pointer transition-all duration-300",
                              "border-2",
                              data.plan === plan.id
                                ? "border-purple-500 bg-gray-800/70"
                                : "border-gray-700 bg-gray-800/30 hover:border-gray-600 hover:bg-gray-800/50"
                            )}
                          >
                            {plan.popular && (
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <span className="px-3 py-1 rounded-full gradient-purple text-white text-xs font-medium flex items-center">
                                  <Star className="h-3 w-3 mr-1" />
                                  Popular
                                </span>
                              </div>
                            )}

                            <div className={cn(
                              "inline-flex p-2 rounded-lg mb-4",
                              plan.gradient
                            )}>
                              <Zap className="h-5 w-5 text-white" />
                            </div>

                            <h3 className="text-lg font-semibold text-white mb-1">{plan.name}</h3>
                            <p className="text-sm text-gray-400 mb-4">{plan.description}</p>

                            <div className="mb-4">
                              {plan.price === 0 ? (
                                <span className="text-2xl font-bold text-white">Free</span>
                              ) : (
                                <div>
                                  <span className="text-2xl font-bold text-white">${plan.price}</span>
                                  <span className="text-sm text-gray-400">/month</span>
                                </div>
                              )}
                            </div>

                            <ul className="space-y-2">
                              {plan.features.map((feature, i) => (
                                <li key={i} className="flex items-center text-sm text-gray-300">
                                  <Check className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>

                            {data.plan === plan.id && (
                              <div className="absolute inset-0 rounded-2xl border-2 border-purple-500 pointer-events-none">
                                <div className="absolute -top-2 -right-2">
                                  <div className="w-6 h-6 rounded-full gradient-purple flex items-center justify-center">
                                    <Check className="h-3 w-3 text-white" />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="mt-6">
                        <label className="flex items-start">
                          <input
                            type="checkbox"
                            checked={data.acceptTerms}
                            onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                            className="mt-1 mr-3 h-4 w-4 rounded border-gray-700 bg-gray-800 text-purple-500 focus:ring-purple-500"
                          />
                          <span className="text-sm text-gray-400">
                            I agree to the{' '}
                            <Link href="/terms" className="text-purple-400 hover:text-purple-300 transition-colors">
                              Terms of Service
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-purple-400 hover:text-purple-300 transition-colors">
                              Privacy Policy
                            </Link>
                          </span>
                        </label>
                        {errors.acceptTerms && (
                          <p className="text-red-400 text-sm mt-2">{errors.acceptTerms}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    {currentStep > 1 && (
                      <button
                        onClick={handleBack}
                        disabled={loading}
                        className="px-6 py-3 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-all flex items-center"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                      </button>
                    )}

                    <button
                      onClick={handleNext}
                      disabled={loading}
                      className={cn(
                        "px-6 py-3 rounded-xl gradient-purple text-white hover:opacity-90 transition-all flex items-center",
                        currentStep === 1 && "ml-auto"
                      )}
                    >
                      {currentStep === 4 ? (
                        loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating Workspace...
                          </>
                        ) : (
                          <>
                            Launch Workspace
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </>
                        )
                      ) : (
                        <>
                          Continue
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </button>
                  </div>

                  {errors.submit && (
                    <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                      {errors.submit}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Security Note */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-800/30 border border-gray-700">
              <Shield className="h-4 w-4 text-green-400 mr-2" />
              <span className="text-sm text-gray-400">
                Your data is secured with enterprise-grade encryption
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}