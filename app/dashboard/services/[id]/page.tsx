'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, Edit, Trash2, Settings, Copy, Share2,
  Star, Clock, DollarSign, Users, Calendar, CheckCircle2,
  AlertCircle, TrendingUp, FileText, BarChart3, Activity,
  Package, Zap, Shield, Globe, Code, Smartphone, Palette,
  Database, Cloud, Monitor, Headphones, Trophy, Target,
  Briefcase, Filter, Search, MoreVertical, ExternalLink,
  MessageSquare, Heart, ThumbsUp, Download, Tag, Bookmark
} from 'lucide-react'
import Link from 'next/link'

// Mock service data
const serviceData = {
  id: 's1',
  name: 'Custom Web Application Development',
  description: 'Complete web application development service including frontend, backend, database design, and deployment. Perfect for businesses looking to digitize their operations with modern, responsive web applications.',
  category: 'Web Development',
  subcategory: 'Full Stack Development',
  type: 'Custom Development',
  status: 'active',
  tier: 'premium',
  pricing: {
    model: 'project-based',
    basePrice: 15000,
    currency: 'USD',
    hourlyRate: 150,
    minProject: 5000,
    maxProject: 100000,
    packages: [
      {
        name: 'Starter',
        price: 15000,
        description: 'Basic web application with essential features',
        features: [
          'Responsive Design',
          'User Authentication',
          'Basic Admin Panel',
          'Database Integration',
          '3 Months Support'
        ],
        duration: '6-8 weeks',
        revisions: 3
      },
      {
        name: 'Professional',
        price: 35000,
        description: 'Advanced web application with comprehensive features',
        features: [
          'Everything in Starter',
          'Advanced Admin Dashboard',
          'API Integration',
          'Payment Processing',
          'Analytics Dashboard',
          'Email Integration',
          '6 Months Support'
        ],
        duration: '10-12 weeks',
        revisions: 5,
        popular: true
      },
      {
        name: 'Enterprise',
        price: 75000,
        description: 'Enterprise-grade solution with custom features',
        features: [
          'Everything in Professional',
          'Custom Integrations',
          'Advanced Security',
          'Multi-tenant Support',
          'Real-time Features',
          'Custom Reporting',
          '12 Months Support',
          'Dedicated Account Manager'
        ],
        duration: '16-20 weeks',
        revisions: 'Unlimited'
      }
    ]
  },
  features: [
    'Modern UI/UX Design',
    'Responsive & Mobile-First',
    'RESTful API Development',
    'Database Design & Optimization',
    'User Authentication & Authorization',
    'Payment Gateway Integration',
    'Email & SMS Integration',
    'Cloud Deployment',
    'Performance Optimization',
    'Security Best Practices',
    'Testing & Quality Assurance',
    'Documentation & Training'
  ],
  technologies: [
    'React', 'Next.js', 'Node.js', 'Express.js', 'PostgreSQL',
    'MongoDB', 'Redis', 'AWS', 'Docker', 'TypeScript',
    'Tailwind CSS', 'Stripe', 'SendGrid', 'JWT'
  ],
  portfolio: [
    {
      id: 'p1',
      title: 'E-commerce Platform',
      description: 'Modern e-commerce solution with inventory management',
      image: '/placeholder-project.jpg',
      tech: ['React', 'Node.js', 'PostgreSQL'],
      url: 'https://example.com',
      completion: '2024'
    },
    {
      id: 'p2',
      title: 'Healthcare Management System',
      description: 'Patient management system for healthcare providers',
      image: '/placeholder-project.jpg',
      tech: ['Next.js', 'MongoDB', 'AWS'],
      url: 'https://example.com',
      completion: '2024'
    },
    {
      id: 'p3',
      title: 'Real Estate Portal',
      description: 'Property listing and management platform',
      image: '/placeholder-project.jpg',
      tech: ['React', 'Express.js', 'PostgreSQL'],
      url: 'https://example.com',
      completion: '2023'
    }
  ],
  reviews: [
    {
      id: 'r1',
      client: 'TechCorp Inc.',
      clientLogo: 'TC',
      rating: 5,
      title: 'Exceptional Web Development Service',
      content: 'The team delivered an outstanding web application that exceeded our expectations. The attention to detail, code quality, and project management were top-notch.',
      date: '2024-02-15',
      project: 'E-commerce Platform',
      helpful: 12,
      verified: true
    },
    {
      id: 'r2',
      client: 'HealthCare Plus',
      clientLogo: 'HP',
      rating: 5,
      title: 'Professional and Efficient',
      content: 'Great communication throughout the project. They understood our requirements perfectly and delivered a robust healthcare management system.',
      date: '2024-01-20',
      project: 'Healthcare Management System',
      helpful: 8,
      verified: true
    },
    {
      id: 'r3',
      client: 'RealEstate Pro',
      clientLogo: 'RP',
      rating: 4,
      title: 'Quality Development Work',
      content: 'Solid development skills and good project delivery. The real estate portal works great and our users love the interface.',
      date: '2023-12-10',
      project: 'Real Estate Portal',
      helpful: 5,
      verified: true
    }
  ],
  stats: {
    projectsCompleted: 47,
    clientsSatisfied: 42,
    avgRating: 4.8,
    responseTime: '2 hours',
    completionRate: 98,
    onTimeDelivery: 96
  },
  timeline: {
    consultation: '1-2 days',
    planning: '3-5 days',
    design: '1-2 weeks',
    development: '8-16 weeks',
    testing: '1-2 weeks',
    deployment: '2-3 days'
  },
  faqs: [
    {
      question: 'What is included in the web development service?',
      answer: 'Our service includes complete frontend and backend development, database design, responsive UI/UX, user authentication, admin panel, testing, documentation, and deployment.'
    },
    {
      question: 'How long does a typical project take?',
      answer: 'Project timeline depends on complexity. Simple applications take 6-8 weeks, while complex enterprise solutions can take 16-20 weeks. We provide detailed timelines during consultation.'
    },
    {
      question: 'Do you provide ongoing support and maintenance?',
      answer: 'Yes, all packages include support ranging from 3-12 months. We also offer ongoing maintenance plans for long-term support and feature updates.'
    },
    {
      question: 'Can you integrate with existing systems?',
      answer: 'Absolutely! We specialize in integrating with existing databases, APIs, payment systems, and third-party services to ensure seamless workflow.'
    },
    {
      question: 'What technologies do you use?',
      answer: 'We use modern technologies like React, Node.js, PostgreSQL, AWS, and more. Technology stack is chosen based on project requirements and scalability needs.'
    }
  ],
  createdDate: '2023-01-15',
  lastUpdated: '2024-02-28',
  availability: 'Available',
  responseRate: 98
}

export default function ServiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedPackage, setSelectedPackage] = useState(1) // Professional package
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [showAllFAQs, setShowAllFAQs] = useState(false)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'packages', label: 'Packages & Pricing', icon: Package },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'process', label: 'Process', icon: Activity }
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          "h-4 w-4",
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
        )}
      />
    ))
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard/services">
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </button>
        </Link>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{serviceData.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Package className="h-4 w-4" />
                  <span>{serviceData.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(Math.floor(serviceData.stats.avgRating))}
                  <span className="ml-1">{serviceData.stats.avgRating}</span>
                  <span>({serviceData.reviews.length} reviews)</span>
                </div>
                <div className={cn(
                  "px-2 py-1 rounded-lg text-xs font-medium",
                  serviceData.status === 'active'
                    ? "bg-green-400/10 text-green-400"
                    : "bg-gray-600/10 text-gray-400"
                )}>
                  {serviceData.availability}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Bookmark className="h-5 w-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Share2 className="h-5 w-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <MoreVertical className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-blue">
              <CheckCircle2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{serviceData.stats.projectsCompleted}</span>
          </div>
          <p className="text-gray-400 text-sm">Projects Completed</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-green">
              <Users className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">{serviceData.stats.clientsSatisfied}</span>
          </div>
          <p className="text-gray-400 text-sm">Happy Clients</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-yellow">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">{serviceData.stats.responseTime}</span>
          </div>
          <p className="text-gray-400 text-sm">Avg Response Time</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-purple">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">{serviceData.stats.completionRate}%</span>
          </div>
          <p className="text-gray-400 text-sm">Success Rate</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-2 mb-8">
        <div className="flex space-x-1">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all",
                  activeTab === tab.id
                    ? "gradient-purple text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
              {/* Description */}
              <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-white mb-4">Service Description</h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  {serviceData.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-white mb-3">Key Features</h4>
                    <div className="space-y-2">
                      {serviceData.features.slice(0, 6).map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-white mb-3">Technologies Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {serviceData.technologies.slice(0, 8).map(tech => (
                        <span key={tech} className="px-3 py-1 rounded-lg bg-gray-800 text-gray-300 text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Process Timeline */}
              <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8">
                <h3 className="text-xl font-semibold text-white mb-6">Development Process</h3>
                <div className="space-y-4">
                  {Object.entries(serviceData.timeline).map(([phase, duration], index) => (
                    <div key={phase} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full gradient-purple flex items-center justify-center text-white text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-white capitalize font-medium">{phase}</span>
                          <span className="text-gray-400 text-sm">{duration}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Starting Price</span>
                    <span className="text-white font-medium">${serviceData.pricing.basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Delivery Time</span>
                    <span className="text-white font-medium">6-20 weeks</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Revision Rounds</span>
                    <span className="text-white font-medium">3-Unlimited</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Response Rate</span>
                    <span className="text-white font-medium">{serviceData.responseRate}%</span>
                  </div>
                </div>

                <button className="w-full mt-6 px-6 py-3 rounded-xl gradient-purple text-white font-medium hover:opacity-90 transition-all">
                  Get Started
                </button>
              </div>

              {/* Contact Card */}
              <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Need Custom Quote?</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Discuss your specific requirements with our team to get a tailored solution and pricing.
                </p>
                <div className="space-y-3">
                  <button className="w-full px-4 py-2 rounded-lg border border-gray-700 text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Send Message
                  </button>
                  <button className="w-full px-4 py-2 rounded-lg border border-gray-700 text-white hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {serviceData.pricing.packages.map((pkg, index) => (
                <div
                  key={index}
                  className={cn(
                    "rounded-2xl backdrop-blur-xl border p-8 relative",
                    pkg.popular
                      ? "bg-purple-900/20 border-purple-500"
                      : "bg-gray-900/50 border-gray-800"
                  )}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="px-4 py-1 rounded-full gradient-purple text-white text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                    <div className="text-3xl font-bold text-white mb-2">
                      ${pkg.price.toLocaleString()}
                    </div>
                    <p className="text-gray-400 text-sm">{pkg.description}</p>
                  </div>

                  <div className="space-y-3 mb-8">
                    {pkg.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-400 flex-shrink-0" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Delivery Time:</span>
                      <span className="text-white">{pkg.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Revisions:</span>
                      <span className="text-white">{pkg.revisions}</span>
                    </div>
                  </div>

                  <button
                    className={cn(
                      "w-full px-6 py-3 rounded-xl font-medium transition-all",
                      pkg.popular
                        ? "gradient-purple text-white hover:opacity-90"
                        : "bg-gray-800 text-white hover:bg-gray-700"
                    )}
                  >
                    Select Package
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {serviceData.portfolio.map(project => (
                <div
                  key={project.id}
                  className="group rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 overflow-hidden hover:border-purple-500/50 transition-all"
                >
                  <div className="aspect-video bg-gray-800 relative overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center">
                      <Monitor className="h-12 w-12 text-gray-500" />
                    </div>
                    <div className="absolute top-4 right-4">
                      <button className="p-2 bg-black/50 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-4">{project.description}</p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map(tech => (
                        <span key={tech} className="px-2 py-1 rounded bg-gray-800 text-gray-300 text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Completed: {project.completion}</span>
                      <button className="text-purple-400 hover:text-purple-300 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* Reviews Summary */}
            <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-2">{serviceData.stats.avgRating}</div>
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {renderStars(5)}
                  </div>
                  <p className="text-gray-400 text-sm">{serviceData.reviews.length} reviews</p>
                </div>

                <div className="md:col-span-2">
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(stars => {
                      const count = serviceData.reviews.filter(r => r.rating === stars).length
                      const percentage = (count / serviceData.reviews.length) * 100

                      return (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-sm text-gray-400 w-8">{stars} ★</span>
                          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-400 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-400 w-8">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-6">
              {serviceData.reviews.slice(0, showAllReviews ? serviceData.reviews.length : 3).map(review => (
                <div key={review.id} className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full gradient-purple flex items-center justify-center text-white font-medium">
                      {review.clientLogo}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-white">{review.client}</h4>
                        {review.verified && (
                          <div className="flex items-center gap-1 text-green-400 text-sm">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Verified</span>
                          </div>
                        )}
                        <span className="text-gray-400 text-sm">
                          {new Date(review.date).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mb-3">
                        {renderStars(review.rating)}
                        <span className="text-gray-400 text-sm">for {review.project}</span>
                      </div>

                      <h5 className="font-medium text-white mb-2">{review.title}</h5>
                      <p className="text-gray-300 mb-4">{review.content}</p>

                      <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                          <ThumbsUp className="h-4 w-4" />
                          <span className="text-sm">Helpful ({review.helpful})</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {serviceData.reviews.length > 3 && (
                <div className="text-center">
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="px-6 py-3 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-colors"
                  >
                    {showAllReviews ? 'Show Less' : 'Show All Reviews'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Process Tab */}
        {activeTab === 'process' && (
          <div className="space-y-8">
            {/* Timeline */}
            <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Development Timeline</h3>
              <div className="space-y-6">
                {Object.entries(serviceData.timeline).map(([phase, duration], index) => (
                  <div key={phase} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full gradient-purple flex items-center justify-center text-white font-medium">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-white capitalize mb-2">{phase}</h4>
                      <p className="text-gray-400 mb-2">Duration: {duration}</p>
                      <p className="text-gray-300 text-sm">
                        {phase === 'consultation' && 'Initial project discussion, requirement gathering, and feasibility analysis.'}
                        {phase === 'planning' && 'Detailed project planning, architecture design, and technical specifications.'}
                        {phase === 'design' && 'UI/UX design, wireframing, prototyping, and design system creation.'}
                        {phase === 'development' && 'Frontend and backend development, database setup, and feature implementation.'}
                        {phase === 'testing' && 'Quality assurance, bug fixes, performance optimization, and security testing.'}
                        {phase === 'deployment' && 'Production deployment, final testing, and go-live support.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQs */}
            <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-8">
              <h3 className="text-xl font-semibold text-white mb-6">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {serviceData.faqs.slice(0, showAllFAQs ? serviceData.faqs.length : 3).map((faq, index) => (
                  <div key={index} className="border-b border-gray-800 pb-4 last:border-b-0">
                    <h4 className="font-medium text-white mb-2">{faq.question}</h4>
                    <p className="text-gray-300 text-sm">{faq.answer}</p>
                  </div>
                ))}

                {serviceData.faqs.length > 3 && (
                  <button
                    onClick={() => setShowAllFAQs(!showAllFAQs)}
                    className="text-purple-400 hover:text-purple-300 transition-colors text-sm"
                  >
                    {showAllFAQs ? 'Show Less' : 'Show All FAQs'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}