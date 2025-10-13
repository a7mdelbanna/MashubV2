# Team Access & Permissions System - Comprehensive Plan

## 📊 Current State Analysis

### ✅ What We Have

#### **1. Type System (Excellent Foundation)**
```typescript
// User Roles (7 levels)
'super_admin' | 'admin' | 'manager' | 'employee' | 'client' | 'vendor' | 'guest'

// Permission Structure
{
  resource: string          // e.g., "projects", "invoices", "finance"
  actions: PermissionAction[]  // create, read, update, delete, export, import, approve
  scope: PermissionScope    // global, tenant, team, personal
  conditions: PermissionCondition[]  // field-based rules
}

// Role Structure
{
  name: string
  permissions: Permission[]
  inheritsFrom: string[]    // role inheritance
  isSystemRole: boolean
  isCustomRole: boolean
}
```

#### **2. Platform Modules (16 total)**
- **Core**: Projects, Clients, Services, Products
- **HR**: Candidates, Courses
- **Finance**: Finance, Invoices, Purchases, Vendors
- **Support**: Help, Support, Visits
- **Admin**: Settings, Dashboard

#### **3. Permission Actions (8 types)**
- `create` - Add new records
- `read` - View records
- `update` - Modify records
- `delete` - Remove records
- `export` - Download data
- `import` - Upload data
- `approve` - Workflow approval
- `custom` - Special actions

#### **4. Permission Scopes (4 levels)**
- `global` - All data across tenant
- `tenant` - Tenant-specific data
- `team` - Team member's data only
- `personal` - User's own data only

---

## 🎯 What We Need to Build

### **1. Team Members Management Page**
**Location**: `/dashboard/settings/team`

**Features:**
- **Member List** with search, filter, sort
  - Show: Avatar, Name, Email, Role, Status, Teams, Last Active
  - Quick actions: Edit, Suspend, Delete, Send Invite
  - Bulk actions: Change role, Add to team, Suspend multiple

- **Add Member Modal**
  - Basic info: Name, Email, Phone
  - Role selection (with preview of permissions)
  - Team assignment
  - Custom permissions override
  - Send invitation toggle

- **Member Detail View**
  - Personal info
  - Current role & permissions
  - Team memberships
  - Activity log
  - Login history
  - Permission override editor

---

### **2. Roles Management Page**
**Location**: `/dashboard/settings/roles`

**System Roles (Pre-defined, Can't Delete):**

#### **Super Admin** (Full Access)
```typescript
permissions: [
  { resource: '*', actions: ['*'], scope: 'global' }
]
```
- **Access**: Everything
- **Use Case**: Platform owner, system administrator
- **Count**: Usually 1-2 people

#### **Admin** (Almost Full Access)
```typescript
permissions: [
  { resource: '*', actions: ['create','read','update','delete','export'], scope: 'tenant' },
  { resource: 'settings', actions: ['read','update'], scope: 'tenant' },
  { resource: 'team', actions: ['read','update'], scope: 'tenant' }
]
```
- **Access**: All modules except system settings
- **Restrictions**: Can't delete tenant, can't manage super admins
- **Use Case**: Company administrator, IT manager

#### **Manager** (Operational Management)
```typescript
permissions: [
  { resource: 'projects', actions: ['create','read','update','approve'], scope: 'team' },
  { resource: 'clients', actions: ['create','read','update'], scope: 'team' },
  { resource: 'invoices', actions: ['create','read','approve'], scope: 'team' },
  { resource: 'finance', actions: ['read'], scope: 'team' },
  { resource: 'team', actions: ['read'], scope: 'team' }
]
```
- **Access**: Team-level data for core modules
- **Restrictions**: Can't access finance details, settings
- **Use Case**: Project managers, team leads

#### **Employee** (Standard User)
```typescript
permissions: [
  { resource: 'projects', actions: ['read','update'], scope: 'personal' },
  { resource: 'clients', actions: ['read'], scope: 'personal' },
  { resource: 'courses', actions: ['read'], scope: 'global' },
  { resource: 'help', actions: ['create','read'], scope: 'personal' }
]
```
- **Access**: Own work, view clients, take courses, create support tickets
- **Use Case**: Regular team members, developers, designers

#### **Client** (External User)
```typescript
permissions: [
  { resource: 'projects', actions: ['read'], scope: 'personal' },
  { resource: 'invoices', actions: ['read'], scope: 'personal' },
  { resource: 'help', actions: ['create','read'], scope: 'personal' }
]
```
- **Access**: Own projects, invoices, support tickets
- **Use Case**: External clients, customers

#### **Vendor** (External Partner)
```typescript
permissions: [
  { resource: 'purchases', actions: ['read','update'], scope: 'personal' },
  { resource: 'products', actions: ['read'], scope: 'global' }
]
```
- **Access**: Own purchase orders, product catalog
- **Use Case**: Suppliers, vendors

#### **Guest** (Read-Only)
```typescript
permissions: [
  { resource: 'projects', actions: ['read'], scope: 'personal' },
  { resource: 'help', actions: ['read'], scope: 'global' }
]
```
- **Access**: Very limited, mostly read-only
- **Use Case**: Auditors, temporary access

**Custom Roles:**
- Create new roles from scratch or templates
- Copy existing role as starting point
- Set expiry date for temporary roles
- Role templates: "Accountant", "Sales Rep", "Support Agent"

---

### **3. Permissions Matrix Page**
**Location**: `/dashboard/settings/permissions`

**Visual Matrix (Table View):**
```
                    Super Admin  Admin  Manager  Employee  Client  Vendor  Guest
┌──────────────────────────────────────────────────────────────────────────────┐
│ PROJECTS                                                                     │
│  - View                   ✓        ✓      ✓        ✓        ✓       -       ✓ │
│  - Create                 ✓        ✓      ✓        -        -       -       - │
│  - Edit                   ✓        ✓      ✓        ✓        -       -       - │
│  - Delete                 ✓        ✓      -        -        -       -       - │
│  - Approve                ✓        ✓      ✓        -        -       -       - │
│  - Export                 ✓        ✓      ✓        -        -       -       - │
├──────────────────────────────────────────────────────────────────────────────┤
│ CLIENTS                                                                      │
│  - View                   ✓        ✓      ✓        ✓        -       -       - │
│  - Create                 ✓        ✓      ✓        -        -       -       - │
│  - Edit                   ✓        ✓      ✓        -        -       -       - │
│  - Delete                 ✓        ✓      -        -        -       -       - │
│  - Export                 ✓        ✓      ✓        -        -       -       - │
├──────────────────────────────────────────────────────────────────────────────┤
│ FINANCE                                                                      │
│  - View                   ✓        ✓      ✓*       -        -       -       - │
│  - Create                 ✓        ✓      -        -        -       -       - │
│  - Edit                   ✓        ✓      -        -        -       -       - │
│  - Approve                ✓        ✓      ✓*       -        -       -       - │
│  - Export                 ✓        ✓      -        -        -       -       - │
└──────────────────────────────────────────────────────────────────────────────┘

* Team scope only
```

**Interactive Features:**
- Click cell to toggle permission
- Hover to see scope (global/tenant/team/personal)
- Filter by module
- Compare roles side-by-side
- Export matrix as PDF/CSV

---

### **4. Access Control UI Components**

#### **A. Quick Role Selector**
```typescript
// Dropdown component for fast role assignment
<RoleSelector
  user={user}
  currentRole="employee"
  onChange={(newRole) => updateUserRole(user.id, newRole)}
/>
```

#### **B. Permission Builder**
```typescript
// Drag-and-drop permission builder
<PermissionBuilder
  module="projects"
  actions={['create', 'read', 'update', 'delete']}
  scope="team"
  conditions={[
    { field: 'status', operator: 'in', value: ['draft', 'in_progress'] }
  ]}
/>
```

#### **C. Module Access Grid**
```typescript
// Visual grid showing module access
<ModuleAccessGrid
  role="manager"
  modules={allModules}
  onToggle={(module, enabled) => updateModuleAccess(module, enabled)}
/>
```

---

## 🏗️ Database Schema (LocalStorage Structure)

### **Users Storage**
```typescript
localStorage.setItem('mashub_users', JSON.stringify([
  {
    id: 'user_1',
    tenantId: 'tenant_1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@company.com',
    role: 'manager',
    permissions: [...],
    teams: ['team_dev', 'team_sales'],
    status: 'active',
    createdAt: '2024-01-01'
  }
]))
```

### **Roles Storage**
```typescript
localStorage.setItem('mashub_roles', JSON.stringify([
  {
    id: 'role_manager',
    name: 'Manager',
    slug: 'manager',
    isSystemRole: true,
    permissions: [...],
    usersCount: 5,
    createdAt: '2024-01-01'
  }
]))
```

### **Teams Storage**
```typescript
localStorage.setItem('mashub_teams', JSON.stringify([
  {
    id: 'team_dev',
    name: 'Development Team',
    members: [
      { userId: 'user_1', role: 'lead' },
      { userId: 'user_2', role: 'member' }
    ],
    permissions: [...],
    createdAt: '2024-01-01'
  }
]))
```

---

## 🎨 UI/UX Design

### **Page 1: Team Members (`/dashboard/settings/team`)**

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Team Members                                    [+ Invite]      │
│  Manage your team and assign roles                               │
├─────────────────────────────────────────────────────────────────┤
│  [Search...] [Filter: All Roles ▼] [Filter: All Teams ▼]       │
├─────────────────────────────────────────────────────────────────┤
│  ☑ [Avatar] John Doe              Role: Manager    Teams: 2     │
│     john@company.com              Status: Active   Last: 2h ago  │
│     [Edit] [Permissions] [Suspend]                               │
├─────────────────────────────────────────────────────────────────┤
│  ☑ [Avatar] Jane Smith            Role: Employee   Teams: 1     │
│     jane@company.com              Status: Active   Last: 5m ago  │
│     [Edit] [Permissions] [Suspend]                               │
└─────────────────────────────────────────────────────────────────┘
```

**Actions:**
- Add/Invite Member
- Edit Member Info
- View/Edit Permissions
- Suspend/Activate
- Delete Member
- Bulk Operations

### **Page 2: Roles Management (`/dashboard/settings/roles`)**

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Roles & Permissions                     [+ Create Role]        │
│  Define roles and their access levels                           │
├─────────────────────────────────────────────────────────────────┤
│  System Roles                                                    │
│  ┌──────────────────┐ ┌──────────────────┐ ┌─────────────────┐│
│  │ Super Admin      │ │ Admin            │ │ Manager         ││
│  │ Full access      │ │ Almost full      │ │ Team management ││
│  │ 👥 2 users       │ │ 👥 5 users       │ │ 👥 8 users      ││
│  │ [View]           │ │ [View] [Edit]    │ │ [View] [Edit]   ││
│  └──────────────────┘ └──────────────────┘ └─────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│  Custom Roles                                                    │
│  ┌──────────────────┐ ┌──────────────────┐                     │
│  │ Accountant       │ │ Sales Rep        │                     │
│  │ Finance access   │ │ Client management│                     │
│  │ 👥 3 users       │ │ 👥 12 users      │                     │
│  │ [Edit] [Delete]  │ │ [Edit] [Delete]  │                     │
│  └──────────────────┘ └──────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘
```

### **Page 3: Permission Matrix (`/dashboard/settings/permissions`)**

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Permission Matrix                        [Export] [Compare]    │
│  Visual overview of all permissions                             │
├─────────────────────────────────────────────────────────────────┤
│  [Select Roles: ☑ All ▼]  [Select Modules: ☑ All ▼]           │
├─────────────────────────────────────────────────────────────────┤
│  Interactive Matrix (see above in plan)                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Implementation Checklist

### **Phase 1: Core Infrastructure** (Priority: HIGH)
- [ ] Create user management utility functions
- [ ] Create role management utility functions
- [ ] Create permission checking functions
- [ ] Set up default roles with permissions
- [ ] Create mock user data for testing

### **Phase 2: Team Members Page** (Priority: HIGH)
- [ ] Team members list view
- [ ] Add/Invite member modal
- [ ] Edit member modal
- [ ] Permission override editor
- [ ] Bulk actions toolbar
- [ ] Activity log viewer

### **Phase 3: Roles Management Page** (Priority: HIGH)
- [ ] System roles display (read-only)
- [ ] Custom roles CRUD
- [ ] Role creation wizard
- [ ] Role templates
- [ ] Role inheritance UI
- [ ] Users count per role

### **Phase 4: Permissions Matrix** (Priority: MEDIUM)
- [ ] Interactive matrix table
- [ ] Toggle permissions
- [ ] Scope indicators
- [ ] Role comparison view
- [ ] Export functionality
- [ ] Permission templates

### **Phase 5: Access Control Components** (Priority: MEDIUM)
- [ ] RoleSelector component
- [ ] PermissionBuilder component
- [ ] ModuleAccessGrid component
- [ ] PermissionScope indicator
- [ ] Access denied pages

### **Phase 6: Integration** (Priority: LOW)
- [ ] Add permission checks to all modules
- [ ] Implement scope-based filtering
- [ ] Add audit logging
- [ ] Add permission inheritance
- [ ] Add temporary access grants

---

## 🔐 Permission Examples by Module

### **Projects Module**
```typescript
{
  resource: 'projects',
  actions: [
    { action: 'create', allowed: true },
    { action: 'read', allowed: true },
    { action: 'update', allowed: true },
    { action: 'delete', allowed: false }
  ],
  scope: 'team',
  conditions: [
    { field: 'status', operator: 'not_in', value: ['archived', 'cancelled'] }
  ]
}
```

### **Finance Module**
```typescript
{
  resource: 'finance',
  actions: [
    { action: 'read', allowed: true },
    { action: 'approve', allowed: true }
  ],
  scope: 'team',
  conditions: [
    { field: 'amount', operator: 'less_than', value: 10000 }
  ]
}
```

### **Settings Module**
```typescript
{
  resource: 'settings',
  actions: [
    { action: 'read', allowed: true },
    { action: 'update', allowed: false }  // Only admins can update
  ],
  scope: 'tenant'
}
```

---

## 🎯 Key Features Summary

### **1. Flexible Permission Model**
- Resource-based (module-level)
- Action-based (operation-level)
- Scope-based (data-level)
- Condition-based (field-level)

### **2. Role Hierarchy**
- System roles (pre-defined)
- Custom roles (user-created)
- Role inheritance
- Role templates

### **3. Team Management**
- Multiple teams per user
- Team-level permissions
- Team leaders
- Cross-team collaboration

### **4. User Management**
- Invite system
- Role assignment
- Permission overrides
- Activity tracking
- Bulk operations

### **5. Visual Tools**
- Permission matrix
- Role comparison
- Access analyzer
- Permission templates
- Audit logs

---

## 🚀 Next Steps

1. **Review & Approve Plan** - Get feedback on structure
2. **Create Mock Data** - Set up realistic user/role data
3. **Build Core Functions** - Permission checking utilities
4. **Implement Team Page** - First UI implementation
5. **Test & Iterate** - Refine based on usage

---

**Total Estimated Pages:** 3 main pages + 2 modals + 5 components
**Estimated Build Time:** 6-8 hours for full implementation
**Priority:** HIGH - Critical for multi-user platform

---

This comprehensive plan ensures a robust, flexible, and user-friendly team access management system that scales with your platform's growth! 🎉
