# MassHub Finance Model — What It Is and Why It Works

This brief explains the finance module in clear, human terms—no code. It tells Cloud Code **what** to build and **why** each part matters. The goal is a dependable, transparent system that supports real‑world operations in a software house.

---

## 1) Purpose in One Line

Give MassHub a single, trustworthy place to handle **money flows** across **multiple currencies**, **multiple accounts**, different **payment methods**, and detailed **reporting**—so decisions are fast, records are clean, and audits are painless.

---

## 2) Core Ideas (What & Why)

### A) Currencies & FX Rates

**What:** Support many currencies with one **default currency** for reporting. Get exchange rates automatically from an API and **snapshot** the rate used at the time of each transaction.
**Why:** Teams operate in EGP, USD, etc. Reports must be comparable in a single currency. Snapshots prevent historical reports from changing when FX rates move later.

Practical example: A USD payment arrives today. We convert it to the default currency (say EGP) using today’s rate and store that exact rate with the transaction, forever.

---

### B) Accounts (Internal Money Stores)

**What:** Accounts represent where money actually sits: bank accounts, cash boxes, PSP balances (e.g., Stripe or Paymob), wallets.
**Why:** Accurate balances per currency and per place. Teams need to know “how much is in CIB‑EGP vs. Wise‑USD vs. Stripe‑USD.” Each account has one currency.

---

### C) Payment Methods (Client‑Facing Ways to Pay)

**What:** The options shown to clients when paying (Stripe, Paymob, bank transfer, cash deposit, manual wallet, etc.). Each method has a logo, description, and—if automatic—API credentials. Each method maps to one or more **Accounts** where money settles.
**Why:** Separates **client experience** (how they pay) from **internal storage** (which account gets the funds). Clear for clients, tidy for bookkeeping.

**Key difference:**

* **Payment Method** = what the client sees and how they pay (branding + instructions + automation where possible).
* **Account** = internal balance where funds live (in one currency), visible only to staff.

---

### D) Categories (Nested)

**What:** Income and expense categories that can be nested (e.g., Expense → Office → Rent → Cairo HQ). Unlimited depth.
**Why:** Fine‑grained reporting now; flexible growth later. Lets finance split costs and revenues the way leadership thinks about the business.

---

### E) Contacts (Unified Counterparties)

**What:** One place for all counterparties: vendors, landlords, service providers, partners, and even clients when relevant.
**Why:** Replaces a narrow “Vendor” idea with a single source of truth. Every transaction can be linked to the right person/company for context.

---

### F) Transactions (The Money Moves)

**What:** Three basics—**Income**, **Expense**, **Transfer**—with support for fees, refunds, and chargebacks. Each transaction:

* Happens in one currency.
* Stores the **exact FX rate** used if the default currency differs.
* Can link to an **Account**, optional **Payment Method**, **Category**, and **Contact**.
* Can include attachments (invoices, receipts, statements).
  **Why:** Covers all daily flows while keeping a clean audit trail.

---

### G) Recurring Items

**What:** Any common, repeated expense or income (e.g., rent, SaaS subscriptions, monthly retainers) can be scheduled to draft automatically for review and posting.
**Why:** Saves time, reduces errors, and ensures nothing is forgotten.

---

### H) Reconciliation

**What:** Periodically match each account’s statement to posted transactions; track opening/closing balances; mark differences; attach notes.
**Why:** Confirms that records equal reality—critical for trust and audits.

---

### I) Roles & Permissions

**What:** Finance Admin (full control), Accountant (post/manage), Approver (review/approve), Viewer (read‑only). Fine‑grained actions (create, edit, post, void, reconcile).
**Why:** Protects sensitive data and supports healthy separation of duties.

---

## 3) How It Fits Together (End‑to‑End Flow)

1. **Set the default currency** (e.g., EGP). Enable any extra currencies used by clients or banks.
2. **Connect FX provider** so the system can fetch and snapshot rates.
3. **Create Accounts** (e.g., “CIB‑EGP,” “Wise‑USD,” “Stripe‑USD,” “Cash‑EGP”). Each has a single currency.
4. **Create Payment Methods** (Stripe, Paymob, Bank Transfer, Manual Wallet) with branding + instructions. Map each method to the right account(s) per currency.
5. **Define Categories** (income and expense) with nested structure for reporting.
6. **Add Contacts** (vendors, landlords, service providers, clients).
7. **Record Transactions**:

   * Pick currency → see only accounts that use that currency.
   * For non‑default currency, snapshot the FX rate at posting.
   * Attach category, contact, payment method (when relevant), and files.
8. **Schedule Recurring** items where needed (e.g., rent on the 1st monthly).
9. **Reconcile** accounts against bank/PSP statements.
10. **Report** by account, currency, category, project/client, and time—always viewable in the default currency with transparent FX details.

---

## 4) Real‑World Scenarios (Concrete Examples)

* **Client pays an invoice via Stripe in USD** → Payment Method: Stripe (client sees logo). Funds settle to **Stripe‑USD account**. System snapshots the USD→EGP rate and shows the EGP value in reports.
* **Office rent in EGP** → Expense to **CIB‑EGP** account, Category: Expense → Office → Rent → Cairo HQ, Contact: Landlord. Appears in monthly burn charts.
* **Transfer from Wise‑USD to CIB‑EGP** → Transfer transaction with the FX snapshot. Optional bank fees added as a related fee item.
* **Manual wallet top‑up** (client sends to a wallet, finance verifies) → Payment Method: Manual Wallet with instructions; income posted to the mapped account after verification.

---

## 5) Reporting We Expect (Why It Matters)

* **Balances by Account** (native currency) and **consolidated** in default currency.
* **Cash flow** by period and by category tree (nesting preserved).
* **Revenue by client / project** (using Contacts + Categories or tags from Projects).
* **Expense breakdowns** (vendors, services, locations), with drill‑down to attachments.
* **FX exposure** (how much in non‑default currencies, realized/unrealized impact).

These reports support leadership decisions (pricing, hiring, runway, vendor negotiations) and support finance hygiene (audits, tax prep, investor updates).

---

## 6) Guardrails & Good Practices (Why They Protect Us)

* **FX snapshots are immutable** once a transaction is posted → preserves historical truth.
* **Posting vs Draft** → allows review/approval before numbers impact reports.
* **Voids with reason** → never delete money history; keep an audit trail.
* **Reconciliation logs** → prove that books match statements.
* **Attachments** → evidence lives with the transaction.
* **Role separation** → the person who creates a payment should not be the only one who approves it.

---

## 7) Integrations Now vs Later

* **Now:** FX provider for rates; optional Stripe/Paymob for automated payments; simple tax fields (VAT %, withholding %), not a full tax engine.
* **Later:** Export to ERPs, advanced tax rules by country, automatic bank feeds, project‑level P&L rollups, purchase orders & approvals.

---

## 8) UX Rules of Thumb (Clarity for Users)

* When a currency is chosen, **only show accounts** in that currency in the dropdown.
* Show the **client‑facing** Payment Methods with clear logos/instructions; hide account details from clients.
* Always display the **native amount** and the **default‑currency amount** side by side with the **exact rate used**.
* Keep category pickers hierarchical and searchable.
* Make reconciliation a guided checklist.

---

## 9) Recurring & Approvals (Reducing Risk)

* Recurring items create **drafts** on schedule. Finance reviews → posts.
* High‑value thresholds can require an **Approver** role before posting.

---

## 10) Open Questions Cloud Code Should Ultra‑Think

1. **Fees & chargebacks:** Represent as linked sub‑items or separate transactions? (Goal: clarity in reports.)
2. **Multiple settlement accounts per method:** If Stripe can settle to different accounts by currency, how should selection logic work?
3. **FX provider fallback:** If the main API fails, should we cache yesterday’s rate, use a secondary source, or block posting?
4. **Tax annotations:** Minimal fields now (VAT/withholding). How to surface on reports without over‑engineering?
5. **Project tagging:** Best way to link transactions to internal projects for P&L by project without duplicating category logic?
6. **Data retention & privacy:** What attachment retention policy and access rules do we need for audits vs. privacy compliance?

---

## 11) Success Criteria (How We’ll Know It Works)

* Any user can answer “How much cash do we have?” by account and consolidated in the default currency.
* New transactions are posted in under 60 seconds with the right account, category, and FX snapshot.
* Monthly reconciliation completes without unexplained differences.
* Leadership can see revenue/expense trends by category, project, and contact.
* Auditors can trace any number to its source document in one click.

---

**Bottom line:** This module makes money flows simple to operate, reliable to audit, and useful for decision‑making—while staying flexible for multiple currencies, accounts, and payment options.
