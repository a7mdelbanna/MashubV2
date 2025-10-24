Prompt for Claude Code — Update Projects / Apps / Agile (remove Services, add App types, pricing, credentials, checklists)

Goal:
Refactor the existing module so Project → App is the core hierarchy, with Services removed. Each App is typed (POS, mobile app, website, advertising, etc.), bound to one Client, and can have its own pricing, features, credentials, assets, and release workflow. A Project can include multiple Apps and therefore can indirectly involve multiple Clients (one per App). Agile (epics/stories/tasks/sprints) powers both project-level and app-level views.

A) Remove “Services” and migrate pricing/packages

Remove the Services section entirely from UI and navigation.

Migrate all pricing/package definitions that currently live under Services into a Project-level Pricing Catalog that can be assigned or cloned into each App inside the project.

Allow each App to select/modify/clone a pricing/package from that catalog (or create a new one) so we support app-specific pricing.

Keep historical integrity by retaining prior package/pricing references for existing records (read-only).

Outcome: Pricing options originate from the legacy Services model (captured once), then live under Project Catalog, and finally attach to specific Apps for real usage and billing context.

B) Core hierarchy and relationships

Project = parent delivery container.

A Project can include multiple Apps (deliverables).

Because each App belongs to one Client, a Project can indirectly touch multiple Clients.

App = a single client instance of our productized output.

App Types (required): POS, Mobile Application, Website, Advertising, and allow adding more types later.

Each App must belong to exactly one Client.

Actions:

Ensure Project detail shows a Deliverables → Apps section (cards list).

On each App card show: Type, Client, Plan/Package, Current Version, Next Release, Flags.

C) App record — fields and essentials

For every App, include these fields and sections:

Identity & Type

App Type (POS / Mobile App / Website / Advertising / …)

Client (exactly one)

Names: English name (required), Arabic name (required)

Descriptions: English description, Arabic description

Branding & Assets

Color palette (primary/secondary/accents)

Asset links: logo, splash, animations/lotties, store graphics (as links/attachments)

Store & Environment

Store ID (or equivalent tenant/store identifier)

Environments: dev / staging / production (just labeled slots)

Important URLs: admin URL, storefront URL, API base, status page, etc.

Security & Credentials

Secure credentials section for logins/passwords/API keys.

Use a vaulted/secret pattern (masked by default, copy-on-click).

Show labels and owners; avoid plain-text exposure in lists.

Allow attachments for encrypted keyfiles, if needed.

Features & Flags

Feature flags (modules/widgets toggles).

Package/Plan: selected from the Project Pricing Catalog; allow per-App overrides.

Release & Versioning

Current version, release channel (staging/production), next scheduled release date.

Releases tab: planned/shipped/rolled back with notes.

Agile linkage

Last bugs or tasks: auto-surface the most recent/open items from the Agile boards that are linked to this App.

Quick filters: Open Bugs, Ready for QA, In Progress.

D) Project record — views and aggregation

Project Overview must show:

Health (traffic light): Delivery, Budget, Timing

Team: manager + members, capacity snapshot (velocity)

Sprints: current sprint summary (goal, committed, done, spillover)

Deliverables → Apps: the list of Apps with status chips (type, version, next release)

Pricing Catalog: the migrated packages/pricing options available to attach/clone into Apps

Aggregate Bugs/Tasks: a unified Issues view that collects all open bugs/tasks across every App under this Project (searchable/filterable)

Checklists: see section E below

Clients in a Project:

Since each App has one Client, the Project can show a Clients involved panel (chips per client, click to open client view).

E) Production checklists (templates at Project level)

Add a “Pre-Production Checklist” section on the Project with support for templates.

Examples per App Type (POS/Mobile/Website/Advertising): branding finalized, store ID configured, payment gateways set, analytics, legal pages, QA pass, performance checks, app store metadata, etc.

Templates can be attached when creating a Project and edited later.

Each App can show the subset of checklist items relevant to its type (auto-filter by App Type), and completion rolls up to project status.

F) Teams, tickets, and scoping

Assign a Team to the Project (PM, devs, QA, design).

Tickets (tasks/bugs) can be opened at two scopes:

Project-level (applies to the whole solution, not a single store/app)

App-level (linked to one specific App/store)

When creating a ticket, the user must choose Scope = Project or Scope = App, and if App, select the target App.

The Project Issues view should support filter: Scope (Project vs App), App, Type (bug/task), Status.

G) Agile: epics → stories → tasks → sprints

Keep the standard stack: Epic → Story → Task, grouped in Sprints.

A Sprint has Goal, Capacity, Committed scope, Definition of Done, and Burn progress.

Stories/tasks can be linked either to Project (generic) or to a specific App.

The App detail surfaces its linked stories/tasks; the Project aggregates all.

H) Pricing and packages — flow recap

Import the legacy Services pricing/packages into a Project Pricing Catalog (one-time migration step).

On each App, choose a package/plan from the Catalog or clone & edit for this App.

Allow per-App pricing overrides (e.g., custom add-ons, discounts).

Keep history (who changed which package and when).

I) Navigation & UX essentials

Project → Apps tab (cards): open App detail in one click.

Project → Issues tab: all bugs/tasks across Apps; filter by App and Scope.

App → Overview: type, client, version, flags, package, store ID, assets, credentials (masked), latest issues.

App → Releases tab: timeline of versions per environment.

App → Agile: focused board filtered to this App.

Client → Apps: list all Apps owned by that Client across projects.

J) Acceptance criteria

I can create a Project, attach a Team, pick a Checklist Template, and see Health.

I can add Apps (POS/Mobile/Website/Advertising…), each tied to one Client with bilingual name/description, store ID, assets, palette, credentials (masked), features, and package/plan.

I can select a package for an App from the Project Pricing Catalog, or clone and edit it for that App.

I can create tickets at Project scope or App scope and see them in the right place.

The Project Issues view aggregates all bugs/tasks across all Apps; the App view shows only its own.

The Services section is gone, and all prior pricing is now accessible via the Project Pricing Catalog and selectable per App.

Releases exist per App, with current version and next release visible; Project shows upcoming releases across its Apps.