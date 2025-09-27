'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import {
  Sparkles, Zap, Shield, Users, BarChart3, Globe,
  ArrowRight, Check, Rocket, Building2, HeadphonesIcon,
  Briefcase, DollarSign, FileText, Lock, Star,
  TrendingUp, Package, Code2, Palette
} from 'lucide-react'

const features = [
  {
    icon: Briefcase,
    title: 'Project Management',
    description: 'Advanced Kanban boards, Gantt charts, and real-time collaboration tools.',
    gradient: 'gradient-blue'
  },
  {
    icon: DollarSign,
    title: 'Financial Hub',
    description: 'Complete invoicing, payments, expenses, and financial reporting.',
    gradient: 'gradient-green'
  },
  {
    icon: Users,
    title: 'HR & Recruitment',
    description: 'Streamlined employee management, recruitment, and training workflows.',
    gradient: 'gradient-purple'
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Real-time KPIs, custom dashboards, and performance metrics.',
    gradient: 'gradient-orange'
  },
  {
    icon: Shield,
    title: 'Multi-Portal System',
    description: 'Dedicated portals for employees, clients, and candidates.',
    gradient: 'gradient-pink'
  },
  {
    icon: Zap,
    title: 'Automation Engine',
    description: 'Powerful workflow automation with custom triggers and actions.',
    gradient: 'gradient-yellow'
  }
]

const pricingPlans = [
  {
    name: 'Starter',
    price: 99,
    description: 'Perfect for small teams',
    features: [
      '15 Team Members',
      '50 Active Projects',
      'Core Features Access',
      'Email Support',
      'API Integration',
      '50GB Cloud Storage'
    ],
    gradient: 'gradient-blue',
    popular: false
  },
  {
    name: 'Professional',
    price: 299,
    description: 'For growing companies',
    features: [
      '50 Team Members',
      'Unlimited Projects',
      'Advanced Features',
      'Priority Support 24/7',
      'Custom Integrations',
      'White Label Options',
      '500GB Cloud Storage'
    ],
    gradient: 'gradient-purple',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Tailored solutions',
    features: [
      'Unlimited Everything',
      'Dedicated Account Manager',
      'Custom Development',
      'SLA Guarantee',
      'On-Premise Deployment',
      'Advanced Security',
      'Unlimited Storage'
    ],
    gradient: 'gradient-green',
    popular: false
  }
]

const stats = [
  { value: '500+', label: 'Software Houses', icon: Building2, gradient: 'gradient-blue' },
  { value: '10K+', label: 'Active Users', icon: Users, gradient: 'gradient-purple' },
  { value: '$50M+', label: 'Processed', icon: DollarSign, gradient: 'gradient-green' },
  { value: '99.9%', label: 'Uptime SLA', icon: Shield, gradient: 'gradient-orange' }
]

export default function LandingPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 gradient-purple rounded-full opacity-20 blur-3xl animate-float" />
        <div className="absolute top-60 -left-40 w-80 h-80 gradient-blue rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-40 w-60 h-60 gradient-green rounded-full opacity-20 blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6 border-b border-gray-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">MasHub</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/features" className="text-gray-400 hover:text-white transition-colors">Features</Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link>
            <Link href="/docs" className="text-gray-400 hover:text-white transition-colors">Documentation</Link>
            <Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/login">
              <button className="px-4 py-2 text-gray-300 hover:text-white transition-colors">
                Sign In
              </button>
            </Link>
            <Link href="/signup">
              <button className="px-6 py-2.5 rounded-xl gradient-purple text-white font-medium hover:opacity-90 transition-all duration-300 shadow-lg">
                Start Free Trial
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className={cn(
              "inline-flex items-center px-4 py-2 rounded-full bg-purple-600/20 border border-purple-500/30 mb-8",
              "animate-fade-in"
            )}>
              <Sparkles className="h-4 w-4 text-purple-400 mr-2" />
              <span className="text-sm text-purple-300 font-medium">Trusted by 500+ Software Houses Worldwide</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-up">
              The Complete Business OS
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                for Software Houses
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
              Manage projects, finances, HR, clients, and operations from a single powerful platform.
              Built specifically for modern software development companies.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link href="/signup">
                <button className="group px-8 py-4 rounded-xl gradient-purple text-white font-medium hover:opacity-90 transition-all duration-300 shadow-xl flex items-center">
                  <Rocket className="h-5 w-5 mr-2" />
                  Start 14-Day Free Trial
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button className="px-8 py-4 rounded-xl bg-gray-800/50 backdrop-blur-xl border border-gray-700 text-white font-medium hover:bg-gray-800 transition-all duration-300">
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 mt-12 text-sm">
              <div className="flex items-center text-gray-400">
                <Check className="h-4 w-4 text-green-400 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center text-gray-400">
                <Check className="h-4 w-4 text-green-400 mr-2" />
                Setup in 5 minutes
              </div>
              <div className="flex items-center text-gray-400">
                <Check className="h-4 w-4 text-green-400 mr-2" />
                Cancel anytime
              </div>
            </div>
          </div>

          {/* Hero Image/Preview */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 gradient-purple opacity-20 blur-3xl" />
            <div className="relative rounded-3xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-2">
              <div className="rounded-2xl bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-8">
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-xl bg-gray-800/50 h-32 animate-pulse-glow" style={{ animationDelay: `${i * 200}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent ml-2">
                Scale Your Business
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Comprehensive tools designed for modern software development teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="group relative">
                  {/* Hover Glow */}
                  <div className={cn(
                    "absolute -inset-0.5 rounded-2xl opacity-0 group-hover:opacity-60 blur-xl transition-opacity duration-500",
                    feature.gradient
                  )} />

                  {/* Card */}
                  <div className="relative h-full rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6 group-hover:bg-gray-900/70 transition-all duration-300">
                    <div className={cn(
                      "inline-flex p-3 rounded-xl mb-4",
                      feature.gradient
                    )}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-gradient-to-r from-violet-600/10 to-purple-600/10 border border-violet-500/20 p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center",
                    stat.gradient
                  )}>
                    <stat.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                  <p className="text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Simple, Transparent
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent ml-2">
                Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-400">
              Choose the perfect plan for your team size and needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className={cn(
                  "relative rounded-2xl bg-gray-900/50 backdrop-blur-xl border p-8 transition-all duration-300",
                  plan.popular ? "border-purple-500 shadow-2xl shadow-purple-500/20" : "border-gray-800 hover:border-gray-700"
                )}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 rounded-full gradient-purple text-white text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-gray-400">{plan.description}</p>
                  </div>

                  <div className="text-center mb-8">
                    {typeof plan.price === 'number' ? (
                      <div>
                        <span className="text-5xl font-bold text-white">${plan.price}</span>
                        <span className="text-gray-400 ml-2">/month</span>
                      </div>
                    ) : (
                      <span className="text-4xl font-bold text-white">{plan.price}</span>
                    )}
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <Check className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className={cn(
                    "w-full py-3 rounded-xl font-medium transition-all duration-300",
                    plan.popular
                      ? "gradient-purple text-white shadow-lg hover:opacity-90"
                      : "bg-gray-800 text-white hover:bg-gray-700 border border-gray-700"
                  )}>
                    {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent ml-2">
              Software Business?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join hundreds of software houses streamlining their operations with MasHub
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link href="/signup">
              <button className="group px-8 py-4 rounded-xl gradient-purple text-white font-medium hover:opacity-90 transition-all duration-300 shadow-xl flex items-center">
                <Rocket className="h-5 w-5 mr-2" />
                Get Started Today
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <button className="px-8 py-4 rounded-xl bg-gray-800/50 backdrop-blur-xl border border-gray-700 text-white font-medium hover:bg-gray-800 transition-all duration-300">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative px-6 py-12 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg gradient-purple flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">MasHub</span>
              </div>
              <p className="text-gray-400 text-sm">
                The complete business OS for modern software houses
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/integrations" className="hover:text-white transition-colors">Integrations</Link></li>
                <li><Link href="/changelog" className="hover:text-white transition-colors">Changelog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
                <li><Link href="/api" className="hover:text-white transition-colors">API Reference</Link></li>
                <li><Link href="/guides" className="hover:text-white transition-colors">Guides</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800/50 text-center text-gray-400 text-sm">
            <p>&copy; 2024 MasHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}