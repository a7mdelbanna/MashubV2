import {
  Project, App, PricingCatalogItem, ChecklistTemplate,
  TeamMember, AppType, AppCredential, AppVersion,
  ReleaseHistoryEntry, FeatureAddon
} from '@/types'

// ============================================================================
// PRICING CATALOG (Migrated from Services)
// ============================================================================

export const MOCK_PRICING_CATALOG: PricingCatalogItem[] = [
  // POS System Packages
  {
    id: 'pkg_pos_starter',
    projectId: 'proj_retail_suite',
    name: 'POS Starter',
    description: 'Basic point-of-sale solution for small businesses',
    category: 'POS Plans',
    pricing: {
      model: 'subscription',
      amount: 299,
      currency: 'USD',
      interval: 'month'
    },
    features: [
      'Basic POS',
      'Inventory Management',
      '1 User License',
      'Sales Reports',
      'Email Support'
    ],
    limits: {
      users: 1,
      transactions: 1000,
      storage: 5
    },
    migratedFrom: {
      serviceId: 'srv1',
      serviceName: 'ShopLeez POS',
      migratedAt: new Date('2024-01-15')
    },
    appsUsing: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'pkg_pos_professional',
    projectId: 'proj_retail_suite',
    name: 'POS Professional',
    description: 'Advanced POS with multi-store support',
    category: 'POS Plans',
    pricing: {
      model: 'subscription',
      amount: 599,
      currency: 'USD',
      interval: 'month'
    },
    features: [
      'Advanced POS',
      'Multi-store Support',
      '5 User Licenses',
      'Advanced Analytics',
      'Inventory Forecasting',
      '24/7 Support'
    ],
    limits: {
      users: 5,
      transactions: 10000,
      storage: 50
    },
    migratedFrom: {
      serviceId: 'srv1',
      serviceName: 'ShopLeez POS',
      migratedAt: new Date('2024-01-15')
    },
    appsUsing: 3,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'pkg_pos_enterprise',
    projectId: 'proj_retail_suite',
    name: 'POS Enterprise',
    description: 'Full-featured enterprise POS solution',
    category: 'POS Plans',
    pricing: {
      model: 'subscription',
      amount: 1299,
      currency: 'USD',
      interval: 'month'
    },
    features: [
      'Full Features',
      'Unlimited Users',
      'API Access',
      'Custom Reports',
      'White Label',
      'Dedicated Support'
    ],
    limits: {
      users: -1, // unlimited
      transactions: -1,
      storage: 500
    },
    migratedFrom: {
      serviceId: 'srv1',
      serviceName: 'ShopLeez POS',
      migratedAt: new Date('2024-01-15')
    },
    appsUsing: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },

  // Mobile App Packages
  {
    id: 'pkg_mobile_core',
    projectId: 'proj_fintech_platform',
    name: 'Core Banking',
    description: 'Essential mobile banking features',
    category: 'Mobile Banking',
    pricing: {
      model: 'one_time',
      amount: 4999,
      currency: 'USD'
    },
    features: [
      'Account Management',
      'Money Transfers',
      'Bill Payments',
      'Transaction History',
      'Push Notifications'
    ],
    limits: {
      users: 10000
    },
    migratedFrom: {
      serviceId: 'srv3',
      serviceName: 'Mobile Banking App',
      migratedAt: new Date('2024-01-15')
    },
    appsUsing: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'pkg_mobile_advanced',
    projectId: 'proj_fintech_platform',
    name: 'Advanced Banking',
    description: 'Full-featured banking with investments',
    category: 'Mobile Banking',
    pricing: {
      model: 'one_time',
      amount: 9999,
      currency: 'USD'
    },
    features: [
      'All Core Features',
      'Investment Tools',
      'Loan Management',
      'Card Management',
      'Biometric Security',
      'Multi-currency Support'
    ],
    limits: {
      users: 50000
    },
    migratedFrom: {
      serviceId: 'srv3',
      serviceName: 'Mobile Banking App',
      migratedAt: new Date('2024-01-15')
    },
    appsUsing: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },

  // Website Packages
  {
    id: 'pkg_web_basic',
    projectId: 'proj_ecommerce_platform',
    name: 'Basic Store',
    description: 'Entry-level e-commerce website',
    category: 'Website Packages',
    pricing: {
      model: 'one_time',
      amount: 799,
      currency: 'USD'
    },
    features: [
      '50 Products',
      'Payment Gateway',
      'Basic Theme',
      'Order Management',
      'Email Support'
    ],
    limits: {
      storage: 10,
      apiCalls: 10000
    },
    migratedFrom: {
      serviceId: 'srv2',
      serviceName: 'E-Commerce Platform',
      migratedAt: new Date('2024-01-15')
    },
    appsUsing: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'pkg_web_pro',
    projectId: 'proj_ecommerce_platform',
    name: 'Pro Store',
    description: 'Professional e-commerce with marketing',
    category: 'Website Packages',
    pricing: {
      model: 'subscription',
      amount: 1499,
      currency: 'USD',
      interval: 'month'
    },
    features: [
      'Unlimited Products',
      'Custom Theme',
      'Marketing Tools',
      'SEO Optimization',
      'Analytics Dashboard',
      'Priority Support'
    ],
    limits: {
      storage: 100,
      apiCalls: 100000
    },
    migratedFrom: {
      serviceId: 'srv2',
      serviceName: 'E-Commerce Platform',
      migratedAt: new Date('2024-01-15')
    },
    appsUsing: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
]

// ============================================================================
// FEATURE ADDONS (Project-level features/modules)
// ============================================================================

export const MOCK_FEATURE_ADDONS: FeatureAddon[] = [
  // POS & Retail Addons (for proj_retail_suite)
  {
    id: 'addon_inventory',
    projectId: 'proj_retail_suite',
    name: 'Inventory Management',
    description: 'Advanced inventory tracking with multi-location support',
    category: 'Core Features',
    technicalName: 'inventory_management',
    pricing: {
      model: 'subscription',
      amount: 99,
      currency: 'USD',
      interval: 'month'
    },
    appsUsing: 5,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'addon_analytics',
    projectId: 'proj_retail_suite',
    name: 'Advanced Analytics',
    description: 'Real-time analytics and custom reporting dashboard',
    category: 'Analytics',
    technicalName: 'advanced_analytics',
    pricing: {
      model: 'subscription',
      amount: 149,
      currency: 'USD',
      interval: 'month'
    },
    appsUsing: 3,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'addon_multistore',
    projectId: 'proj_retail_suite',
    name: 'Multi-Store Support',
    description: 'Manage multiple store locations from one dashboard',
    category: 'Core Features',
    technicalName: 'multi_store',
    pricing: {
      model: 'subscription',
      amount: 199,
      currency: 'USD',
      interval: 'month'
    },
    appsUsing: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'addon_loyalty',
    projectId: 'proj_retail_suite',
    name: 'Loyalty Program',
    description: 'Customer loyalty points and rewards system',
    category: 'Customer Engagement',
    technicalName: 'loyalty_program',
    pricing: {
      model: 'subscription',
      amount: 79,
      currency: 'USD',
      interval: 'month'
    },
    appsUsing: 4,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'addon_employee_mgmt',
    projectId: 'proj_retail_suite',
    name: 'Employee Management',
    description: 'Staff scheduling, time tracking, and performance metrics',
    category: 'HR & Management',
    technicalName: 'employee_management',
    pricing: {
      model: 'subscription',
      amount: 129,
      currency: 'USD',
      interval: 'month'
    },
    appsUsing: 3,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'addon_customer_mgmt',
    projectId: 'proj_retail_suite',
    name: 'Customer Management',
    description: 'CRM features with customer profiles and purchase history',
    category: 'Customer Engagement',
    technicalName: 'customer_management',
    pricing: {
      model: 'subscription',
      amount: 89,
      currency: 'USD',
      interval: 'month'
    },
    appsUsing: 6,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'addon_mobile_pos',
    projectId: 'proj_retail_suite',
    name: 'Mobile POS',
    description: 'Process transactions on mobile devices',
    category: 'Mobile Features',
    technicalName: 'mobile_pos',
    pricing: {
      model: 'subscription',
      amount: 119,
      currency: 'USD',
      interval: 'month'
    },
    appsUsing: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'addon_offline_mode',
    projectId: 'proj_retail_suite',
    name: 'Offline Mode',
    description: 'Continue operations without internet connection',
    category: 'Core Features',
    technicalName: 'offline_mode',
    pricing: {
      model: 'one_time',
      amount: 499,
      currency: 'USD'
    },
    appsUsing: 3,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'addon_dark_mode',
    projectId: 'proj_retail_suite',
    name: 'Dark Mode',
    description: 'Eye-friendly dark theme for the application',
    category: 'UI/UX',
    technicalName: 'dark_mode',
    appsUsing: 8,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'addon_biometric',
    projectId: 'proj_retail_suite',
    name: 'Biometric Authentication',
    description: 'Fingerprint and face recognition login',
    category: 'Security',
    technicalName: 'biometric_auth',
    pricing: {
      model: 'one_time',
      amount: 299,
      currency: 'USD'
    },
    appsUsing: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'addon_push_notifications',
    projectId: 'proj_retail_suite',
    name: 'Push Notifications',
    description: 'Send notifications to customers and staff',
    category: 'Communication',
    technicalName: 'push_notifications',
    pricing: {
      model: 'usage_based',
      amount: 0.01,
      currency: 'USD'
    },
    appsUsing: 5,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'addon_multi_currency',
    projectId: 'proj_retail_suite',
    name: 'Multi-Currency Support',
    description: 'Accept and process multiple currencies',
    category: 'Payments',
    technicalName: 'multi_currency',
    pricing: {
      model: 'subscription',
      amount: 59,
      currency: 'USD',
      interval: 'month'
    },
    appsUsing: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'addon_tax_management',
    projectId: 'proj_retail_suite',
    name: 'Tax Management',
    description: 'Automated tax calculation and reporting',
    category: 'Finance',
    technicalName: 'tax_management',
    pricing: {
      model: 'subscription',
      amount: 79,
      currency: 'USD',
      interval: 'month'
    },
    appsUsing: 7,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'addon_invoicing',
    projectId: 'proj_retail_suite',
    name: 'Invoicing',
    description: 'Generate and send professional invoices',
    category: 'Finance',
    technicalName: 'invoicing',
    pricing: {
      model: 'subscription',
      amount: 49,
      currency: 'USD',
      interval: 'month'
    },
    appsUsing: 4,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'addon_payment_gateway',
    projectId: 'proj_retail_suite',
    name: 'Payment Gateway Integration',
    description: 'Connect with popular payment processors',
    category: 'Payments',
    technicalName: 'payment_gateway',
    pricing: {
      model: 'subscription',
      amount: 99,
      currency: 'USD',
      interval: 'month'
    },
    appsUsing: 6,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },

  // FinTech Project Addons (for proj_fintech_platform)
  {
    id: 'addon_kyc_verification',
    projectId: 'proj_fintech_platform',
    name: 'KYC Verification',
    description: 'Automated identity verification and compliance',
    category: 'Security & Compliance',
    technicalName: 'kyc_verification',
    pricing: {
      model: 'usage_based',
      amount: 2.50,
      currency: 'USD'
    },
    appsUsing: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'addon_fraud_detection',
    projectId: 'proj_fintech_platform',
    name: 'Fraud Detection',
    description: 'AI-powered fraud detection and prevention',
    category: 'Security & Compliance',
    technicalName: 'fraud_detection',
    pricing: {
      model: 'subscription',
      amount: 299,
      currency: 'USD',
      interval: 'month'
    },
    appsUsing: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'addon_banking_api',
    projectId: 'proj_fintech_platform',
    name: 'Banking API Integration',
    description: 'Connect with bank accounts for transactions',
    category: 'Integrations',
    technicalName: 'banking_api',
    pricing: {
      model: 'subscription',
      amount: 499,
      currency: 'USD',
      interval: 'month'
    },
    appsUsing: 3,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'addon_crypto_wallet',
    projectId: 'proj_fintech_platform',
    name: 'Crypto Wallet',
    description: 'Support for cryptocurrency transactions',
    category: 'Payments',
    technicalName: 'crypto_wallet',
    pricing: {
      model: 'subscription',
      amount: 199,
      currency: 'USD',
      interval: 'month'
    },
    appsUsing: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: 'addon_risk_analytics',
    projectId: 'proj_fintech_platform',
    name: 'Risk Analytics',
    description: 'Credit risk assessment and portfolio analysis',
    category: 'Analytics',
    technicalName: 'risk_analytics',
    pricing: {
      model: 'subscription',
      amount: 399,
      currency: 'USD',
      interval: 'month'
    },
    appsUsing: 2,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
]

// ============================================================================
// CLIENTS (for reference)
// ============================================================================

export const MOCK_CLIENTS = [
  { id: 'client_techcorp', name: 'TechCorp Inc.', logo: 'TC' },
  { id: 'client_financehub', name: 'FinanceHub', logo: 'FH' },
  { id: 'client_retailchain', name: 'RetailChain Pro', logo: 'RC' },
  { id: 'client_globaHR', name: 'GlobalHR Solutions', logo: 'GH' },
  { id: 'client_medicare', name: 'MediCare Plus', logo: 'MP' }
]

// ============================================================================
// CHECKLIST TEMPLATES
// ============================================================================

export const MOCK_CHECKLIST_TEMPLATES: ChecklistTemplate[] = [
  {
    id: 'checklist_pos',
    name: 'POS Production Checklist',
    description: 'Pre-production checklist for POS systems',
    appTypes: ['pos'],
    items: [
      {
        id: 'pos_1',
        title: 'Branding assets finalized',
        description: 'Logo, colors, and splash screen approved',
        category: 'branding',
        required: true,
        order: 1,
        completed: false
      },
      {
        id: 'pos_2',
        title: 'Payment gateway configured',
        description: 'Stripe/Square integration tested',
        category: 'technical',
        required: true,
        order: 2,
        completed: false
      },
      {
        id: 'pos_3',
        title: 'Store ID and credentials set',
        description: 'Production credentials added to vault',
        category: 'technical',
        required: true,
        order: 3,
        completed: false
      },
      {
        id: 'pos_4',
        title: 'Terms of service added',
        description: 'Legal pages and policies in place',
        category: 'legal',
        required: true,
        order: 4,
        completed: false
      },
      {
        id: 'pos_5',
        title: 'QA testing completed',
        description: 'All test cases passed',
        category: 'qa',
        required: true,
        order: 5,
        completed: false
      },
      {
        id: 'pos_6',
        title: 'Performance benchmarks met',
        description: 'Load testing and optimization done',
        category: 'qa',
        required: true,
        order: 6,
        completed: false
      }
    ],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'checklist_mobile',
    name: 'Mobile App Production Checklist',
    description: 'Pre-production checklist for mobile applications',
    appTypes: ['mobile_app'],
    items: [
      {
        id: 'mobile_1',
        title: 'App store metadata ready',
        description: 'Screenshots, descriptions, keywords prepared',
        category: 'deployment',
        required: true,
        order: 1,
        completed: false
      },
      {
        id: 'mobile_2',
        title: 'Branding finalized',
        description: 'App icon, splash screen, colors approved',
        category: 'branding',
        required: true,
        order: 2,
        completed: false
      },
      {
        id: 'mobile_3',
        title: 'Push notifications configured',
        description: 'Firebase/APNS setup and tested',
        category: 'technical',
        required: true,
        order: 3,
        completed: false
      },
      {
        id: 'mobile_4',
        title: 'Analytics integrated',
        description: 'Google Analytics/Mixpanel tracking',
        category: 'technical',
        required: false,
        order: 4,
        completed: false
      },
      {
        id: 'mobile_5',
        title: 'Security audit passed',
        description: 'Penetration testing and code review',
        category: 'qa',
        required: true,
        order: 5,
        completed: false
      },
      {
        id: 'mobile_6',
        title: 'Privacy policy published',
        description: 'GDPR/CCPA compliance verified',
        category: 'legal',
        required: true,
        order: 6,
        completed: false
      }
    ],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'checklist_website',
    name: 'Website Production Checklist',
    description: 'Pre-production checklist for websites',
    appTypes: ['website'],
    items: [
      {
        id: 'web_1',
        title: 'Domain and SSL configured',
        description: 'Custom domain with HTTPS',
        category: 'deployment',
        required: true,
        order: 1,
        completed: false
      },
      {
        id: 'web_2',
        title: 'SEO optimization done',
        description: 'Meta tags, sitemap, robots.txt',
        category: 'technical',
        required: true,
        order: 2,
        completed: false
      },
      {
        id: 'web_3',
        title: 'Performance score >90',
        description: 'Lighthouse audit passed',
        category: 'qa',
        required: true,
        order: 3,
        completed: false
      },
      {
        id: 'web_4',
        title: 'Cookie consent implemented',
        description: 'GDPR cookie banner active',
        category: 'legal',
        required: true,
        order: 4,
        completed: false
      }
    ],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10')
  }
]

// ============================================================================
// SAMPLE APPS
// ============================================================================

export const MOCK_APPS: App[] = [
  // POS App
  {
    id: 'app_shopleez_techcorp',
    tenantId: 'tenant_default',
    projectId: 'proj_retail_suite',
    type: 'pos',
    nameEn: 'TechCorp POS',
    nameAr: 'نقاط البيع تك كورب',
    descriptionEn: 'Advanced point-of-sale system for TechCorp retail stores',
    descriptionAr: 'نظام نقاط بيع متقدم لمتاجر تك كورب',
    client: {
      id: 'client_techcorp',
      name: 'TechCorp Inc.',
      logo: 'TC'
    },
    branding: {
      primaryColor: '#3b82f6',
      secondaryColor: '#1e40af',
      accentColor: '#60a5fa',
      logo: 'TC',
      logoUrl: 'https://example.com/techcorp-logo.png'
    },
    storeId: 'TC-STORE-001',
    environments: {
      dev: {
        url: 'https://dev-pos.techcorp.com',
        apiEndpoint: 'https://dev-api.techcorp.com',
        version: '2.3.0-dev',
        lastDeployed: new Date('2024-01-20'),
        status: 'active'
      },
      staging: {
        url: 'https://staging-pos.techcorp.com',
        apiEndpoint: 'https://staging-api.techcorp.com',
        version: '2.2.5',
        lastDeployed: new Date('2024-01-18'),
        status: 'active'
      },
      production: {
        url: 'https://pos.techcorp.com',
        apiEndpoint: 'https://api.techcorp.com',
        version: '2.2.3',
        lastDeployed: new Date('2024-01-15'),
        status: 'active'
      }
    },
    urls: {
      admin: 'https://pos.techcorp.com/admin',
      storefront: 'https://shop.techcorp.com',
      apiBase: 'https://api.techcorp.com',
      statusPage: 'https://status.techcorp.com',
      documentation: 'https://docs.techcorp.com'
    },
    credentials: [
      {
        id: 'cred_1',
        label: 'Admin Login',
        type: 'login',
        username: 'admin@techcorp.com',
        value: '*********************', // Encrypted
        owner: 'Sarah Chen',
        expiresAt: new Date('2024-12-31'),
        notes: 'Main admin account',
        createdAt: new Date('2024-01-01'),
        lastAccessedAt: new Date('2024-01-20')
      },
      {
        id: 'cred_2',
        label: 'Stripe API Key',
        type: 'api_key',
        value: 'sk_live_*********************',
        owner: 'Mike Johnson',
        notes: 'Production payment processing',
        createdAt: new Date('2024-01-01'),
        lastAccessedAt: new Date('2024-01-19')
      },
      {
        id: 'cred_3',
        label: 'Database Connection',
        type: 'database',
        username: 'db_techcorp',
        value: 'postgresql://*********************',
        owner: 'DevOps Team',
        notes: 'Production database',
        createdAt: new Date('2024-01-01')
      }
    ],
    features: {
      enabled: ['inventory', 'analytics', 'multi_store', 'loyalty_program'],
      modules: ['sales', 'inventory', 'reports', 'customers', 'employees']
    },
    pricing: {
      catalogItemId: 'pkg_pos_professional',
      appliedAt: new Date('2024-01-15'),
      appliedBy: 'Sarah Chen'
    },
    releases: {
      current: {
        version: '2.2.3',
        buildNumber: 223,
        releaseDate: new Date('2024-01-15'),
        releaseChannel: 'production',
        notes: 'Bug fixes and performance improvements'
      },
      upcoming: {
        version: '2.3.0',
        targetDate: new Date('2024-02-01'),
        features: ['Dark mode', 'Offline mode', 'Receipt customization'],
        status: 'in_progress'
      },
      history: [
        {
          version: '2.2.2',
          releaseDate: new Date('2024-01-10'),
          releaseChannel: 'production',
          status: 'shipped',
          notes: 'Security updates',
          releasedBy: 'Mike Johnson'
        },
        {
          version: '2.2.0',
          releaseDate: new Date('2024-01-01'),
          releaseChannel: 'production',
          status: 'shipped',
          notes: 'New year release with multi-store support'
        }
      ]
    },
    status: 'production',
    health: {
      uptime: 99.8,
      lastChecked: new Date('2024-01-20'),
      issues: 2
    },
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-20'),
    lastDeployedAt: new Date('2024-01-15')
  },

  // Mobile Banking App
  {
    id: 'app_banking_financehub',
    tenantId: 'tenant_default',
    projectId: 'proj_fintech_platform',
    type: 'mobile_app',
    nameEn: 'FinanceHub Mobile',
    nameAr: 'فاينانس هاب موبايل',
    descriptionEn: 'Secure mobile banking with biometric authentication',
    descriptionAr: 'خدمات مصرفية آمنة عبر الهاتف المحمول',
    client: {
      id: 'client_financehub',
      name: 'FinanceHub',
      logo: 'FH'
    },
    branding: {
      primaryColor: '#10b981',
      secondaryColor: '#047857',
      accentColor: '#34d399',
      logo: 'FH',
      splashScreen: 'https://example.com/financehub-splash.png',
      animations: [
        'https://example.com/lottie/success.json',
        'https://example.com/lottie/loading.json'
      ],
      storeGraphics: [
        'https://example.com/screenshots/login.png',
        'https://example.com/screenshots/dashboard.png',
        'https://example.com/screenshots/transfer.png'
      ]
    },
    storeId: 'FH-APP-001',
    environments: {
      production: {
        url: 'app.financehub.com',
        apiEndpoint: 'https://api.financehub.com/v2',
        version: '3.1.2',
        lastDeployed: new Date('2024-01-18'),
        status: 'active'
      }
    },
    urls: {
      apiBase: 'https://api.financehub.com',
      statusPage: 'https://status.financehub.com',
      documentation: 'https://developers.financehub.com'
    },
    credentials: [
      {
        id: 'cred_fh_1',
        label: 'API Client Secret',
        type: 'api_key',
        value: 'fh_secret_*********************',
        owner: 'David Lee',
        expiresAt: new Date('2025-01-01'),
        notes: 'OAuth client credentials',
        createdAt: new Date('2023-11-01')
      },
      {
        id: 'cred_fh_2',
        label: 'Firebase Config',
        type: 'certificate',
        value: '{"project_id": "financehub-mobile", ...}',
        owner: 'Sophie Brown',
        notes: 'Push notifications configuration',
        attachments: ['firebase-admin-sdk.json'],
        createdAt: new Date('2023-11-01')
      }
    ],
    features: {
      enabled: ['biometric_auth', 'push_notifications', 'offline_mode', 'dark_mode'],
      modules: ['accounts', 'transfers', 'bills', 'investments', 'cards']
    },
    pricing: {
      catalogItemId: 'pkg_mobile_advanced',
      appliedAt: new Date('2023-11-01'),
      appliedBy: 'David Lee'
    },
    releases: {
      current: {
        version: '3.1.2',
        buildNumber: 312,
        releaseDate: new Date('2024-01-18'),
        releaseChannel: 'production',
        notes: 'Critical security patch'
      },
      upcoming: {
        version: '3.2.0',
        targetDate: new Date('2024-02-15'),
        features: ['Cryptocurrency support', 'Budget tracking', 'Voice commands'],
        status: 'qa'
      },
      history: [
        {
          version: '3.1.0',
          releaseDate: new Date('2024-01-05'),
          releaseChannel: 'production',
          status: 'shipped',
          notes: 'Major update with investment tools'
        }
      ]
    },
    status: 'production',
    health: {
      uptime: 99.95,
      lastChecked: new Date('2024-01-20'),
      issues: 0
    },
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2024-01-20'),
    lastDeployedAt: new Date('2024-01-18')
  },

  // E-Commerce Website
  {
    id: 'app_ecommerce_retailchain',
    tenantId: 'tenant_default',
    projectId: 'proj_ecommerce_platform',
    type: 'website',
    nameEn: 'RetailChain Shop',
    nameAr: 'متجر ريتيل تشين',
    descriptionEn: 'Modern e-commerce platform with AI recommendations',
    descriptionAr: 'منصة تجارة إلكترونية حديثة مع توصيات ذكية',
    client: {
      id: 'client_retailchain',
      name: 'RetailChain Pro',
      logo: 'RC'
    },
    branding: {
      primaryColor: '#f59e0b',
      secondaryColor: '#d97706',
      accentColor: '#fbbf24',
      logo: 'RC'
    },
    storeId: 'RC-WEB-001',
    environments: {
      dev: {
        url: 'https://dev.retailchain.shop',
        apiEndpoint: 'https://dev-api.retailchain.shop',
        version: '1.5.0-dev',
        lastDeployed: new Date('2024-01-19'),
        status: 'active'
      },
      production: {
        url: 'https://www.retailchain.shop',
        apiEndpoint: 'https://api.retailchain.shop',
        version: '1.4.2',
        lastDeployed: new Date('2024-01-12'),
        status: 'active'
      }
    },
    urls: {
      admin: 'https://admin.retailchain.shop',
      storefront: 'https://www.retailchain.shop',
      apiBase: 'https://api.retailchain.shop'
    },
    credentials: [
      {
        id: 'cred_rc_1',
        label: 'Stripe Webhook Secret',
        type: 'api_key',
        value: 'whsec_*********************',
        owner: 'Emma Davis',
        createdAt: new Date('2024-01-01')
      }
    ],
    features: {
      enabled: ['ai_recommendations', 'wishlist', 'reviews', 'loyalty'],
      modules: ['products', 'cart', 'checkout', 'orders', 'customers']
    },
    pricing: {
      catalogItemId: 'pkg_web_pro',
      appliedAt: new Date('2024-01-01'),
      appliedBy: 'Sarah Chen'
    },
    releases: {
      current: {
        version: '1.4.2',
        releaseDate: new Date('2024-01-12'),
        releaseChannel: 'production',
        notes: 'SEO improvements and bug fixes'
      },
      history: []
    },
    status: 'production',
    health: {
      uptime: 99.7,
      lastChecked: new Date('2024-01-20'),
      issues: 1
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20'),
    lastDeployedAt: new Date('2024-01-12')
  }
]

// ============================================================================
// PROJECTS (Updated with Apps)
// ============================================================================

export const MOCK_PROJECTS: Project[] = [
  {
    id: 'proj_retail_suite',
    tenantId: 'tenant_default',
    name: 'Retail Technology Suite',
    description: 'Comprehensive POS and retail management solution for multiple clients',
    type: 'agile',
    status: 'in_progress',
    budget: 250000,
    spent: 165000,
    startDate: new Date('2023-12-01'),
    dueDate: new Date('2024-06-30'),
    manager: {
      id: 'user_2',
      name: 'Sarah Chen'
    },
    team: [
      { id: 'user_5', name: 'David Kim', role: 'Backend Developer', capacity: 40 },
      { id: 'user_6', name: 'Jessica Williams', role: 'Frontend Developer', capacity: 40 },
      { id: 'user_3', name: 'Michael Chen', role: 'QA Engineer', capacity: 30 }
    ],
    progress: 66,

    // New: Apps (replacing direct client relationship)
    apps: [MOCK_APPS[0], MOCK_APPS[2]], // TechCorp POS, RetailChain Shop

    // New: Pricing Catalog
    pricingCatalog: MOCK_PRICING_CATALOG.filter(item => item.projectId === 'proj_retail_suite'),

    // New: Checklist Templates
    checklistTemplates: [MOCK_CHECKLIST_TEMPLATES[0], MOCK_CHECKLIST_TEMPLATES[2]],

    // Health indicators
    health: {
      delivery: 'on_track',
      budget: 'on_budget',
      timing: 'on_time'
    },

    // Agile metrics
    velocity: 32,
    currentSprint: {
      id: 'sprint_retail_12',
      name: 'Sprint 12 - Multi-store Features',
      goal: 'Implement multi-store support for TechCorp POS',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-29'),
      committed: 34,
      completed: 28
    },

    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2024-01-20')
  },

  {
    id: 'proj_fintech_platform',
    tenantId: 'tenant_default',
    name: 'Mobile Banking Platform',
    description: 'Secure mobile banking application with advanced features',
    type: 'fixed_price',
    status: 'in_progress',
    budget: 185000,
    spent: 156000,
    startDate: new Date('2023-11-01'),
    dueDate: new Date('2024-03-31'),
    manager: {
      id: 'user_3',
      name: 'Michael Chen'
    },
    team: [
      { id: 'user_5', name: 'David Kim', role: 'iOS Developer', capacity: 40 },
      { id: 'user_6', name: 'Jessica Williams', role: 'Android Developer', capacity: 40 },
      { id: 'user_7', name: 'Robert Martinez', role: 'Backend Developer', capacity: 40 }
    ],
    progress: 85,

    // New: Apps
    apps: [MOCK_APPS[1]], // FinanceHub Mobile

    // New: Pricing Catalog
    pricingCatalog: MOCK_PRICING_CATALOG.filter(item => item.projectId === 'proj_fintech_platform'),

    // New: Checklist Templates
    checklistTemplates: [MOCK_CHECKLIST_TEMPLATES[1]],

    health: {
      delivery: 'on_track',
      budget: 'on_budget',
      timing: 'on_time'
    },

    velocity: 28,
    currentSprint: {
      id: 'sprint_fintech_8',
      name: 'Sprint 8 - Security Hardening',
      goal: 'Complete security audit and implement fixes',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-29'),
      committed: 24,
      completed: 22
    },

    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2024-01-20')
  },

  {
    id: 'proj_ecommerce_platform',
    tenantId: 'tenant_default',
    name: 'E-Commerce Platform Development',
    description: 'AI-powered e-commerce platform with advanced analytics',
    type: 'time_material',
    status: 'planning',
    budget: 120000,
    spent: 15000,
    startDate: new Date('2024-01-01'),
    dueDate: new Date('2024-08-31'),
    manager: {
      id: 'user_4',
      name: 'Emily Rodriguez'
    },
    team: [
      { id: 'user_6', name: 'Jessica Williams', role: 'Full Stack Developer', capacity: 40 },
      { id: 'user_8', name: 'Amanda Taylor', role: 'UI/UX Designer', capacity: 30 }
    ],
    progress: 12,

    // New: Apps
    apps: [MOCK_APPS[2]], // RetailChain Shop (also in retail suite - multi-project app)

    // New: Pricing Catalog
    pricingCatalog: MOCK_PRICING_CATALOG.filter(item => item.projectId === 'proj_ecommerce_platform'),

    // New: Checklist Templates
    checklistTemplates: [MOCK_CHECKLIST_TEMPLATES[2]],

    health: {
      delivery: 'on_track',
      budget: 'under',
      timing: 'early'
    },

    velocity: 0,
    currentSprint: {
      id: 'sprint_ecom_1',
      name: 'Sprint 1 - Project Setup',
      goal: 'Initialize project structure and CI/CD',
      startDate: new Date('2024-01-08'),
      endDate: new Date('2024-01-22'),
      committed: 18,
      completed: 16
    },

    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-20')
  }
]

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all clients involved in a project (via its apps)
 */
export function getProjectClients(projectId: string): { id: string; name: string; logo?: string }[] {
  const project = MOCK_PROJECTS.find(p => p.id === projectId)
  if (!project) return []

  // Extract unique clients from apps
  const clientMap = new Map()
  project.apps.forEach(app => {
    if (!clientMap.has(app.client.id)) {
      clientMap.set(app.client.id, app.client)
    }
  })

  return Array.from(clientMap.values())
}

/**
 * Get all apps for a specific client across all projects
 */
export function getClientApps(clientId: string): App[] {
  return MOCK_APPS.filter(app => app.client.id === clientId)
}

/**
 * Get pricing catalog item by ID
 */
export function getPricingCatalogItem(catalogItemId: string): PricingCatalogItem | undefined {
  return MOCK_PRICING_CATALOG.find(item => item.id === catalogItemId)
}

/**
 * Get app health summary for a project
 */
export function getProjectAppHealth(projectId: string) {
  const project = MOCK_PROJECTS.find(p => p.id === projectId)
  if (!project) return null

  const apps = project.apps
  const totalIssues = apps.reduce((sum, app) => sum + (app.health.issues || 0), 0)
  const avgUptime = apps.reduce((sum, app) => sum + (app.health.uptime || 0), 0) / apps.length

  return {
    totalApps: apps.length,
    totalIssues,
    avgUptime: avgUptime.toFixed(2),
    appsInProduction: apps.filter(a => a.status === 'production').length,
    appsInDevelopment: apps.filter(a => a.status === 'development').length
  }
}
