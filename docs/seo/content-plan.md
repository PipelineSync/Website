# PipelineSync content plan

Status: draft for owner review. Last updated: 2026-10-14.

Scope: HubSpot services content for B2B buyers. United States first, then Australia, Canada and the United Kingdom. Geography is expressed through copy and schema, not through per-country pages.

Sources used: `src/index.njk`, `src/solutions/index.njk`, `src/integrations/index.njk`, `src/resources/index.njk`, `src/about/index.njk`, `src/_includes/partials/faq.njk` and the 12 pages under `src/resources/`. Nothing in this plan adds facts that are not on the site. Where a fact is needed and missing, it is marked `TODO(owner)`.

> **Keyword volumes are unverified estimates.** The "Est. demand" column is a relative guess (High / Med / Low), not a number. Confirm every row in Ahrefs or Semrush (Keyword Explorer / Keyword Overview, US database first, then AU, CA, UK), and after launch in Google Search Console (Performance → Queries). Re-rank priorities once real numbers are in.

> **Keep this aligned with `docs/seo/keyword-map.md`.** One primary keyword per URL. If `/solutions/hubspot-implementation/` is built, `/solutions/` should move to a hub term (for example "HubSpot consulting services") so the two pages do not compete for "HubSpot implementation services". `TODO(owner)`: confirm the split.

---

## 1. Topic clusters

Each cluster has one pillar (a service page that converts) and supporting content (guides, articles, templates) that links up to it. Every supporting piece links to its pillar with descriptive anchor text and back to `/resources/`.

### Cluster A: HubSpot implementation and CRM architecture

| Item | URL | Status |
|---|---|---|
| **Pillar** | `/solutions/hubspot-implementation/` | Proposed new service page |
| Secondary pillars | `/solutions/hubspot-audit/`, `/solutions/hubspot-admin/` | Proposed new service pages |
| Hub | `/solutions/` (anchors `#implementation`, `#hubspot-audit`, `#ongoing-administration`, `#training-sops`) | Existing |
| Existing guide | `/resources/hubspot-crm-architecture-blueprint/` | Existing (453 words) |
| Existing guide | `/resources/integration-governance-monitoring-pipelinesync/` (also links to `/integrations/`) | Existing (397 words) |
| Existing article | `/resources/why-teams-dont-adopt-hubspot-and-how-we-fix-it-pipelinesync/` | Existing (399 words) |
| Existing template | `/resources/hubspot-governance-checklist-pipelinesync/` | Existing (350 words) |

New article ideas: A1–A8 in the table below.

### Cluster B: Data quality and CRM migration

| Item | URL | Status |
|---|---|---|
| **Pillar** | `/solutions/hubspot-migration/` | Proposed new service page |
| **Co-pillar** | `/solutions/hubspot-crm-cleanup/` | Proposed new service page |
| Hub | `/solutions/` (anchors `#migration`, `#cleanup`) | Existing |
| Existing playbook | `/resources/crm-cleanup-deduplication-system-pipelinesync/` | Existing (413 words) |
| Existing article | `/resources/the-cost-of-duplicate-data-in-hubspot-pipelinesync/` | Existing (394 words) |
| Existing template | `/resources/data-migration-mapping-sheet-pipelinesync/` | Existing (359 words) |

New article ideas: B1–B8 in the table below.

### Cluster C: RevOps, lead routing and reporting

| Item | URL | Status |
|---|---|---|
| **Pillar** | `/solutions/revops/` | Proposed new service page |
| Hub | `/solutions/` (anchor `#revops`) | Existing |
| Existing guide | `/resources/lead-routing-lifecycle-automation-pipelinesync/` | Existing (398 words) |
| Existing guide | `/resources/full-funnel-attribution-that-ceos-trust-pipelinesync/` | Existing (387 words) |
| Existing article | `/resources/why-your-hubspot-pipeline-doesnt-reflect-reality-pipelinesync/` | Existing (419 words) |
| Existing article | `/resources/automation-that-saves-10-hours-week-pipelinesync/` | Existing (376 words) |
| Existing template | `/resources/lead-routing-decision-tree-pipelinesync/` | Existing (370 words) |

New article ideas: C1–C8 in the table below.

---

## 2. Article ideas (24)

Intent: Info = informational, Comm = commercial investigation, Comp = comparison. Funnel: TOFU = top (problem aware), MOFU = middle (solution aware), BOFU = bottom (ready to hire). Est. demand = unverified relative estimate.

| ID | Working title | Target keyword | Secondary keywords | Intent | Funnel | Est. demand | Links to (service page) | Angle (PipelineSync method) | Priority |
|---|---|---|---|---|---|---|---|---|---|
| A1 | HubSpot implementation checklist: what to decide before you build | hubspot implementation checklist | hubspot setup checklist, hubspot onboarding checklist, hubspot crm setup | Info / Comm | MOFU | Med | /solutions/hubspot-implementation/ | Our four stages (audit, architecture, build, handover): nothing gets built until the data model, pipelines, lifecycle and permissions are designed and approved. | **P1** |
| A2 | How long does a HubSpot implementation take? | hubspot implementation timeline | how long to implement hubspot, hubspot onboarding timeline | Comm | BOFU | Low–Med | /solutions/hubspot-implementation/ | Uses our published ranges (audit and architecture 1–2 weeks; build 2–6 weeks depending on data volume, integrations and hubs) and explains what moves the number. | P2 |
| A3 | HubSpot deal stages: how to design a pipeline with exit criteria | hubspot deal stages best practices | hubspot pipeline setup, hubspot deal pipeline stages, sales pipeline exit criteria | Info | TOFU | Med | /solutions/hubspot-implementation/ | A stage is a verifiable buyer milestone, not a rep task ("proposal sent" vs "commercial terms confirmed"). One-sentence exit criterion per stage. | P2 |
| A4 | HubSpot custom objects: when to use them and when not to | hubspot custom objects | hubspot custom object examples, hubspot data model | Info | TOFU | Med | /solutions/hubspot-implementation/ | Objects describe what you manage; pipelines describe process. One source of truth per business concept. `TODO(owner)`: confirm which HubSpot tiers include custom objects before publishing. | P2 |
| A5 | HubSpot user permissions: a role-based setup that scales | hubspot user permissions best practices | hubspot permission sets, hubspot teams setup, hubspot admin access | Info | TOFU | Low–Med | /solutions/hubspot-implementation/ | Permission sets built around roles, restricted exports and sensitive properties, tested with real user roles, not only an admin account. Every build ships a permission matrix. | P3 |
| A6 | HubSpot Professional vs Enterprise: what changes for your CRM architecture | hubspot professional vs enterprise | hubspot enterprise features, hubspot sales hub professional vs enterprise | Comp | MOFU | Med–High | /solutions/hubspot-implementation/ | Written from the architecture angle (data model, permissions, reporting), not a pricing page. Our clients are usually on Pro or Enterprise. `TODO(owner)`: verify every feature claim against HubSpot's current product catalog on the publish date. | P2 |
| A7 | HubSpot audit checklist: how to health-check your portal | hubspot audit checklist | hubspot portal audit, hubspot health check, hubspot crm audit | Info / Comm | MOFU | Med | /solutions/hubspot-audit/ | Mirrors our paid audit: portal, data, automation, reporting, delivered as written findings with prioritised recommendations. Links the 47-point governance checklist. | **P1** |
| A8 | Outsourced HubSpot admin vs hiring in-house: how to decide | outsourced hubspot administrator | hubspot admin services, hubspot support retainer, hubspot admin job | Comm | BOFU | Low–Med | /solutions/hubspot-admin/ | For teams without an internal CRM owner: workflow changes, reporting updates, data hygiene, user support on a monthly retainer, with documentation so the system never depends on one person. | P2 |
| B1 | Salesforce to HubSpot migration checklist | salesforce to hubspot migration | salesforce to hubspot migration checklist, migrate salesforce to hubspot, crm data migration | Comm / Comp | BOFU | Med–High | /solutions/hubspot-migration/ | Source audit, field mapping sheet, dedupe before import (not after), sandbox import and QA, automation and reporting rebuild, cutover plan, training. | **P1** |
| B2 | Pipedrive vs HubSpot for B2B: when it is time to switch | pipedrive vs hubspot | hubspot vs pipedrive for b2b, pipedrive or hubspot | Comp | MOFU | High | /solutions/hubspot-migration/ | Honest trade-offs for a B2B team outgrowing a deal-focused CRM: data model, reporting, marketing alignment. Not a hit piece; says when staying put is fine. | P2 |
| B3 | Pipedrive to HubSpot migration: step by step | pipedrive to hubspot migration | migrate pipedrive to hubspot, pipedrive hubspot import | Comm | BOFU | Med | /solutions/hubspot-migration/ | Deals, activities and contacts mapped with history preserved where it matters; automation rebuilt, not just records copied. | P2 |
| B4 | Zoho CRM to HubSpot migration: what to plan for | zoho to hubspot migration | zoho crm to hubspot, migrate from zoho crm | Comm | BOFU | Low–Med | /solutions/hubspot-migration/ | Same mapping-sheet method: business meaning of every field, matching keys per object, associations and ownership mapped explicitly. | P3 |
| B5 | From spreadsheets to HubSpot: a first CRM done right | spreadsheet to hubspot | import excel into hubspot, move from spreadsheets to crm | Info / Comm | MOFU | Med | /solutions/hubspot-migration/ | For founder-led teams: normalise before import, define the data model first, so the first CRM does not become a cleanup project a year later. | P3 |
| B6 | How to deduplicate contacts and companies in HubSpot | hubspot deduplication | hubspot duplicate contacts, merge duplicates hubspot, hubspot duplicate companies | Info | TOFU / MOFU | Med–High | /solutions/hubspot-crm-cleanup/ | Segment suspected duplicates by source and match confidence before merging; protect consent, lifecycle and ownership fields; then fix the import or integration that created them. | **P1** |
| B7 | HubSpot data quality: validation rules, required properties and governance | hubspot data quality | crm data quality, hubspot data governance, hubspot property validation | Info | TOFU | Med | /solutions/hubspot-crm-cleanup/ | Cleanup only pays off when prevention is installed: stable integration keys, normalisation, controlled imports, a visible exception queue. | P2 |
| B8 | HubSpot property naming conventions (with a property catalogue) | hubspot naming conventions | hubspot property management, hubspot property catalogue | Info | TOFU | Low | /solutions/hubspot-crm-cleanup/ | Property catalogue with owner, definition, data type and allowed values; naming applied to properties, workflows, lists, views and dashboards. | P3 |
| C1 | HubSpot lead routing best practices | hubspot lead routing | hubspot lead assignment, hubspot round robin, lead rotation hubspot | Info / Comm | MOFU | Med | /solutions/revops/ | Rules that must never be broken first (territory, named accounts, product, language), then scoring and round-robin balanced with capacity; fallback owner and a no-owner queue. | **P1** |
| C2 | HubSpot lifecycle stages explained (and how they differ from lead status) | hubspot lifecycle stages | hubspot lead status, lifecycle stage vs lead status, mql sql hubspot | Info | TOFU | High | /solutions/revops/ | Lifecycle stage = relationship with the business; lead status = working state. Keeping them separate lets marketing, sales and service report on one journey. | **P1** |
| C3 | Lead response SLAs in HubSpot: how to track, alert and escalate | hubspot sla | lead response time hubspot, speed to lead hubspot, hubspot escalation workflow | Info | MOFU | Low–Med | /solutions/revops/ | An SLA is only real if the system detects a miss: stamp assignment and first-response time, escalate before expiry, daily review of unworked records. | P2 |
| C4 | HubSpot attribution reporting: which model to use and why | hubspot attribution reporting | hubspot multi-touch attribution, hubspot revenue attribution, campaign influence | Info / Comm | MOFU | Med | /solutions/revops/ | Connect first touch to closed won so marketing spend ties to revenue, not form fills. `TODO(owner)`: confirm which HubSpot tiers include attribution reports before publishing. | P2 |
| C5 | Lead scoring in HubSpot: fit vs intent | hubspot lead scoring | hubspot lead scoring best practices, fit and engagement score | Info | TOFU | Med | /solutions/revops/ | Combine who the prospect is with what they are doing (high-value pages, demo requests, repeated engagement); scoring feeds routing, not a vanity number. | P2 |
| C6 | What does a HubSpot RevOps consultant do? | hubspot revops consultant | revops consulting, revenue operations hubspot, revops agency | Comm | BOFU | Low–Med | /solutions/revops/ | The connective layer across marketing, sales and service: lifecycle definitions, routing with SLAs, automation, attribution, executive dashboards, all documented. | P2 |
| C7 | HubSpot pipeline reporting: stage aging and close-date drift | hubspot pipeline reporting | hubspot sales forecast accuracy, hubspot deal stage aging report | Info | TOFU | Low–Med | /solutions/revops/ | Separate pipeline hygiene from forecasting; report stalled deals and stage aging by owner; weekly inspection rhythm. Builds on the existing pipeline article (link, do not duplicate). | P3 |
| C8 | HubSpot executive dashboards: the reports leadership actually uses | hubspot executive dashboard | hubspot revops dashboard, hubspot sales dashboard examples | Info | MOFU | Low–Med | /solutions/revops/ | Dashboards built on top of agreed lifecycle definitions and clean data, so leadership sees conversion at every stage and where deals stall. | P3 |

Totals: 24 ideas. P1 = 6, P2 = 12, P3 = 6.

Market notes for writers: write for US buyers by default (US spelling in articles, USD only if a price is ever quoted, which it should not be). Mention that we work with teams in Australia, Canada and the UK where it is natural (for example in migration and admin pieces, "we work US business hours with live sessions scheduled in your timezone"). Do not create country variants.

---

## 3. Briefs for the top 6 P1 articles

Common to every brief:

- Byline: "By the PipelineSync team" (owner decision, Oct 2026; no individual author names), plus the Updated date.
- Links: pillar service page (once live; until then `/solutions/#<anchor>`), `/resources/`, and at least two related resources. Use descriptive anchors ("our HubSpot migration service"), never "click here".
- CTA: the existing consultation modal ("Book a free consultation", free 30-minute call). One mid-article soft CTA, one end CTA.
- Length: 1,200–1,800 words. Short paragraphs, real headings, a checklist block (the site's existing `guide-checklist` component).
- FAQs: answer in 2–4 sentences each, only with facts on the site or general HubSpot knowledge that has been checked against HubSpot's own documentation.

### Brief 1: A1. HubSpot implementation checklist: what to decide before you build

- **Target:** hubspot implementation checklist. **Pillar:** `/solutions/hubspot-implementation/`.
- **Reader:** ops lead or founder at a 10–200 person B2B company starting or restarting HubSpot.
- **Outline:**
  - H2 Why most implementations go wrong (configured quickly, never architected, never documented; from `/about/`)
  - H2 Stage 1: Audit what you have
    - H3 Portal, data, integrations, sales process
    - H3 Write down what is broken and what is costing time
  - H2 Stage 2: Design before you build
    - H3 Objects and custom properties
    - H3 Deal pipelines and stages with exit criteria
    - H3 Lifecycle stages and lead statuses
    - H3 Teams and permissions
  - H2 Stage 3: Build and test in a sandbox
    - H3 Forms, lists, workflows, sequences
    - H3 Dashboards on top, not first
  - H2 Stage 4: Train and document (SOPs, data model doc, automation logic, permission matrix)
  - H2 The checklist (reuse the six blueprint checkpoints, expanded)
  - H2 FAQs
- **FAQs:** How long does a HubSpot implementation take? Do we need a partner or can we do it ourselves? What should be documented at handover? Can we implement one hub first and add others later?
- **Internal links:** `/resources/hubspot-crm-architecture-blueprint/`, `/resources/hubspot-governance-checklist-pipelinesync/`, `/resources/why-teams-dont-adopt-hubspot-and-how-we-fix-it-pipelinesync/`, `/solutions/#process`.
- **CTA:** "Want the architecture designed before anything is built? Book a free consultation."

### Brief 2: A7. HubSpot audit checklist: how to health-check your portal

- **Target:** hubspot audit checklist. **Pillar:** `/solutions/hubspot-audit/`.
- **Reader:** someone who inherited a portal and does not trust it.
- **Outline:**
  - H2 Signs your portal needs an audit (spreadsheet checks before anyone believes a number; reps skipping stages; licences used like a basic contact database; from the home page pain points)
  - H2 Access and permissions (super admins, exports, sensitive properties)
  - H2 Data model and data quality
    - H3 Duplicates and incomplete records
    - H3 Unused and duplicate properties
  - H2 Pipelines and lifecycle
  - H2 Automation (unowned workflows, misfires on bad records)
  - H2 Integrations (field ownership, sync errors nobody sees)
  - H2 Reporting (which dashboards leadership actually uses)
  - H2 Turning findings into a prioritised plan
  - H2 FAQs
- **FAQs:** How long does a HubSpot audit take (`TODO(owner)`: confirm typical audit duration; site only states "audit and architecture typically take one to two weeks")? What do I get at the end? Does audit work carry into a build? (yes, per engagement models) How often should a portal be audited?
- **Internal links:** `/resources/hubspot-governance-checklist-pipelinesync/`, `/resources/crm-cleanup-deduplication-system-pipelinesync/`, `/resources/integration-governance-monitoring-pipelinesync/`, `/solutions/#engagement-models`.
- **CTA:** "Not sure what is wrong yet? Start with a paid audit. Book a free consultation to scope it."

### Brief 3: B1. Salesforce to HubSpot migration checklist

- **Target:** salesforce to hubspot migration. **Pillar:** `/solutions/hubspot-migration/`.
- **Reader:** RevOps or sales ops lead with a signed HubSpot contract and a Salesforce org to retire.
- **Outline:**
  - H2 Why migrations fail (data arrives without structure; team goes back to the old system)
  - H2 Before you export
    - H3 Audit the source org: objects, fields, automation, reports
    - H3 Decide what to migrate, archive, calculate or exclude
  - H2 Build the field mapping sheet
    - H3 Business meaning, data type, allowed values
    - H3 Matching keys per object
    - H3 Associations, owners, activity history
  - H2 Deduplicate before import, not after
  - H2 Sandbox import and reconciliation (counts, associations, owners, critical reports)
  - H2 Rebuild automation and reporting in HubSpot
  - H2 Cutover plan: freeze window, rollback, post-cutover checks
  - H2 Training so the team stays in HubSpot
  - H2 FAQs
- **FAQs:** How long does a Salesforce to HubSpot migration take? (site: migration 3–6 weeks) Can we keep activity history? Should we run both systems in parallel? Can HubSpot and Salesforce stay in sync instead? (link `/integrations/`, Salesforce listed as "Custom API, bi-directional sync with dedupe and field mapping")
- **Internal links:** `/resources/data-migration-mapping-sheet-pipelinesync/`, `/resources/the-cost-of-duplicate-data-in-hubspot-pipelinesync/`, `/integrations/`, `/solutions/#migration`.
- **CTA:** "Planning a Salesforce migration? Book a free consultation and bring your object list."
- **Note:** do not claim object or API behaviour without checking current Salesforce and HubSpot documentation. No client examples unless `TODO(owner)` supplies an approved one.

### Brief 4: B6. How to deduplicate contacts and companies in HubSpot

- **Target:** hubspot deduplication. **Pillar:** `/solutions/hubspot-crm-cleanup/`.
- **Outline:**
  - H2 What duplicates actually cost (split history, wrong routing, unreliable reporting; from the existing article)
  - H2 Agree a definition of a duplicate
  - H2 Find patterns before merging
    - H3 Segment by source, object, owner, last activity, match confidence
    - H3 Match on email, domain, phone, external ID, normalised name
  - H2 Choose the primary record (primary-record hierarchy)
  - H2 Merge safely: protect consent, lifecycle and ownership fields
  - H2 Companies are different from contacts (domain-based matching, deal history)
  - H2 Stop duplicates coming back (stable external ID upserts, normalisation, controlled imports, weekly exception review)
  - H2 FAQs
- **FAQs:** Does HubSpot deduplicate automatically? (`TODO(owner)`: verify current native behaviour and which tiers include duplicate management) Can a merge be undone? How long does a cleanup take? (site: 1–2 weeks) What causes most duplicates?
- **Internal links:** `/resources/crm-cleanup-deduplication-system-pipelinesync/`, `/resources/the-cost-of-duplicate-data-in-hubspot-pipelinesync/`, `/resources/integration-governance-monitoring-pipelinesync/`.
- **CTA:** "If the duplicates keep coming back, the system that creates them needs fixing. Book a free consultation."
- **Do not** reuse the home page "30%+ duplicate rate" figure as a statistic unless the owner provides its source.

### Brief 5: C1. HubSpot lead routing best practices

- **Target:** hubspot lead routing. **Pillar:** `/solutions/revops/`.
- **Outline:**
  - H2 What good routing looks like (every qualified lead: clear owner, next step, measurable response time)
  - H2 Is the record ready to route? (required fields, consent, duplicate check, nurture path for incomplete records)
  - H2 Rule order
    - H3 Territory and named accounts
    - H3 Product, language, customer status
    - H3 Round-robin balanced with capacity and out-of-office cover
  - H2 Fit and intent signals
  - H2 SLAs, timers and escalation
  - H2 The no-owner and no-response queue
  - H2 Recycled leads
  - H2 FAQs
- **FAQs:** Should we use round-robin? What happens when a rep is on leave? How fast should leads be contacted? (answer as "set by lead type and priority"; no invented benchmark) Lifecycle stage vs lead status for routing?
- **Internal links:** `/resources/lead-routing-lifecycle-automation-pipelinesync/`, `/resources/lead-routing-decision-tree-pipelinesync/`, C2 (lifecycle stages), `/solutions/#revops`.
- **CTA:** "Leads sitting unassigned? Book a free consultation."

### Brief 6: C2. HubSpot lifecycle stages explained

- **Target:** hubspot lifecycle stages. **Pillar:** `/solutions/revops/`.
- **Outline:**
  - H2 Lifecycle stage vs lead status: two different questions
  - H2 HubSpot's default lifecycle stages (subscriber through evangelist; `TODO(owner)`: verify current defaults and whether custom stages are available on the client's tier)
  - H2 Write entry and exit criteria for each stage
  - H2 Who owns the record at each handoff
  - H2 Lead status values for day-to-day work (new, working, connected, qualified, unqualified, recycled)
  - H2 Automating stage changes safely
  - H2 Reporting on the funnel once stages are trustworthy
  - H2 FAQs
- **FAQs:** Can lifecycle stages move backwards? What is the difference between MQL and SQL? Should every contact have a lifecycle stage? How do lifecycle stages relate to deal stages?
- **Internal links:** `/resources/lead-routing-lifecycle-automation-pipelinesync/`, `/resources/full-funnel-attribution-that-ceos-trust-pipelinesync/`, `/resources/hubspot-crm-architecture-blueprint/`, C1.
- **CTA:** "Want lifecycle definitions marketing and sales both sign off on? Book a free consultation."

---

## 4. Briefs for the six proposed service pages

Rules for all six: 900–1,500 words of non-duplicated copy each; reuse the existing timeline/process component and CTA partial; `Service` + `BreadcrumbList` + `FAQPage` schema (FAQ text must match visible text); no prices (scoped after a call); visible breadcrumb `Home › Solutions › <page>`; link back to `/solutions/` and keep the existing `/solutions/#…` anchors working. Copy marked "(reuse)" comes from `src/solutions/index.njk` or `src/index.njk`.

### 4.1 `/solutions/hubspot-implementation/`

| Section | Content |
|---|---|
| Primary keyword | hubspot implementation services (see cannibalisation note at top) |
| H1 | HubSpot implementation and onboarding |
| Hero lead | (reuse) "Set up the portal correctly the first time: objects, pipelines, lifecycle stages, permissions, automation, and reporting designed around your sales motion instead of HubSpot's defaults." |
| Who it is for | (reuse) New portals, or a portal that was set up quickly and never properly architected. B2B teams of roughly 10–200 people, usually on Professional or Enterprise; smaller founder-led teams that want the structure right from the start. |
| Problems | Reps skip stages; data half-filled; licences used like a basic contact database; leadership checks every report in a spreadsheet. |
| Deliverables | (reuse) Portal audit, data model design, pipeline and lifecycle architecture, permission structure, core automation, dashboard build, SOPs, team training. |
| Process | Audit → Architecture → Build (sandbox first) → Handover (reuse four-stage copy). |
| Timeline / model | 2–4 weeks (home page); fixed-scope project is the usual model. FAQ copy: audit and architecture 1–2 weeks, build 2–6 weeks depending on data volume, integrations and hubs. |
| FAQs | How long does it take? Do you work on new and existing portals? What do we get at handover? Do you train the team? Do you implement every hub? (`TODO(owner)`: confirm which hubs you implement: Sales, Marketing, Service, Operations, Content) |
| Related resources | Architecture blueprint, governance checklist, why teams do not adopt HubSpot, A1, A3. |
| CTA | "Tell us what is broken" (existing CTA partial). |

### 4.2 `/solutions/hubspot-migration/`

| Section | Content |
|---|---|
| Primary keyword | hubspot migration services |
| H1 | HubSpot migration services |
| Hero lead | (reuse) "Move from Salesforce, Pipedrive, or a legacy system with fields mapped, duplicates resolved, automation rebuilt, and history preserved where it matters. Your team lands in a working CRM, not a data dump." |
| Who it is for | (reuse) Moving to HubSpot from Salesforce, Pipedrive, Zoho, a legacy CRM, or spreadsheets. |
| Problems | (reuse) "Migrations fail when data arrives without structure and everyone quietly goes back to the old system." |
| Sub-sections | H2 per source: Salesforce, Pipedrive, Zoho, spreadsheets/legacy. Each 120–200 words, specific to what is mapped (objects, activities, owners, automation). No client names unless `TODO(owner)` provides approved ones. |
| Deliverables | (reuse) Source audit, field mapping sheet, deduplication and enrichment, sandbox import and QA, automation and reporting rebuild, cutover plan, training. |
| Process | Audit and field mapping → dedupe → sandbox import and QA → automation rebuild → cutover with training (from FAQ). |
| Timeline / model | 3–6 weeks (home page); fixed-scope project. |
| FAQs | Can you migrate from Salesforce / Pipedrive / Zoho / spreadsheets? (yes, from FAQ) Do we keep history? ("We preserve history where it matters.") Is there downtime? (`TODO(owner)`) Can you keep both systems in sync instead? (link `/integrations/`) |
| Related resources | Data migration mapping sheet, cost of duplicate data, B1, B2, B3, B4, B5. |
| CTA | Consultation modal. |

### 4.3 `/solutions/hubspot-crm-cleanup/`

| Section | Content |
|---|---|
| Primary keyword | hubspot data cleanup |
| H1 | HubSpot CRM cleanup and data quality |
| Hero lead | (reuse) "Remove duplicate, incomplete, and conflicting records, then put validation rules and governance in place so the mess does not come back." |
| Who it is for | (reuse) Portals where reporting cannot be trusted, duplicates are widespread, or fields were never governed. |
| Problems | (reuse) Three versions of the same account; automation misfiring on bad records; reports that need verifying before anyone acts. |
| Deliverables | (reuse) Data quality audit, deduplication, field standardisation, validation and governance rules, ongoing data hygiene workflows, governance SOP. |
| Process | Audit record quality across contacts, companies, deals → systematic dedupe → standardise values → install validation, required properties, naming conventions. |
| Timeline / model | 1–2 weeks (home page); fixed scope, or audit first if the size of the problem is unknown. |
| FAQs | Do you merge records by hand? ("systematically rather than by hand") How do you protect consent and ownership data? How do you stop duplicates coming back? Can this run alongside a migration? |
| Related resources | Cleanup and deduplication system, cost of duplicate data, governance checklist, B6, B7, B8. |
| CTA | Consultation modal. |

### 4.4 `/solutions/revops/`

| Section | Content |
|---|---|
| Primary keyword | hubspot revops consultant |
| H1 | HubSpot RevOps infrastructure, lead to close |
| Hero lead | (reuse) "Connect the whole path: lifecycle stages, lead routing and SLAs, sales and marketing automation, attribution, and dashboards." |
| Who it is for | (reuse) Companies where marketing, sales, and service each work well alone but do not connect into one picture. |
| Problems | Qualified leads sitting unassigned; no agreed lifecycle definitions; marketing reports form fills, not revenue; leadership cannot see where deals stall. |
| Deliverables | (reuse) Lifecycle architecture, lead scoring and routing, SLA and escalation design, sales and marketing automation, attribution setup, executive dashboards, documentation. |
| Outcomes | (reuse) "Qualified leads reach the right rep in minutes instead of sitting unassigned. Leadership can see conversion at every stage and where deals stall. Marketing can tie spend to closed revenue rather than to form fills." |
| Timeline / model | 2–4 weeks (home page); fixed scope, or retainer for ongoing optimisation. |
| FAQs | What is RevOps in HubSpot terms? Do we need Enterprise for this? (`TODO(owner)`) How do you handle leads when a rep is out? Which attribution model do you use? |
| Related resources | Lead routing and lifecycle guide, lead routing decision tree, attribution guide, pipeline article, automation article, C1–C8. |
| CTA | Consultation modal. |

### 4.5 `/solutions/hubspot-audit/`

| Section | Content |
|---|---|
| Primary keyword | hubspot audit |
| H1 | HubSpot audit |
| Hero lead | (reuse) "A structured review of your portal, data, automation, and reporting, delivered as a written findings document with prioritized recommendations." |
| Who it is for | (reuse) "For portals where nobody is certain what is wrong yet." Also teams that inherited a portal or are planning a migration or rebuild. |
| Problems | Unclear why reports disagree; unknown workflows; integrations nobody owns. |
| Deliverables | Written findings document; prioritised plan (what is working, what is broken, what is costing time). |
| Process | Discovery and audit stage copy (reuse): portal, data model, integrations, go-to-market process; friction points, gaps, quick wins. |
| Timeline / model | Paid audit first. "If you go ahead with the build, the audit work carries into it." (reuse). `TODO(owner)`: typical audit duration. |
| FAQs | What does the audit cover? What do we receive? Does the fee carry into a build? Do we need to give admin access? (`TODO(owner)`: access requirements) |
| Related resources | Governance checklist, A7, architecture blueprint. |
| CTA | "Start with an audit" → consultation modal. |

### 4.6 `/solutions/hubspot-admin/`

| Section | Content |
|---|---|
| Primary keyword | hubspot admin services |
| H1 | Ongoing HubSpot administration and optimisation |
| Hero lead | (reuse) "Monthly support for teams without an internal CRM owner. Workflow changes, reporting updates, data hygiene, and user support." |
| Who it is for | Teams without an internal CRM owner; teams after an implementation who want optimisation sprints. |
| Problems | Requests pile up; nobody owns properties or workflows; new hires are not onboarded to the system. |
| Deliverables | Workflow changes, reporting updates, data hygiene, user support, training and SOPs for new hires (supporting service). `TODO(owner)`: what a month includes (hours, response times, request channel). |
| Process | Intake → prioritise → build in sandbox where relevant → document. |
| Timeline / model | Monthly retainer; "No long lock-in" (home page). `TODO(owner)`: minimum term and notice period. |
| FAQs | What happens if we stop? (everything documented so you do not need us) How quickly do you respond? (within 24 hours on business days) Do you work our timezone? (US business hours; live sessions in your timezone) |
| Related resources | Governance checklist, automation article, A8. |
| CTA | Consultation modal. |

---

## 5. Six-month publishing calendar (2 new articles per month)

Assumes the six service pages ship first or in parallel (they are the link targets). Publish on a fixed weekday; update `/resources/` cards and the sitemap with each piece.

| Month | Article 1 | Article 2 | Refresh work the same month |
|---|---|---|---|
| Month 1 (Nov 2026) | B1 Salesforce to HubSpot migration checklist | C2 HubSpot lifecycle stages explained | Expand: data migration mapping sheet; lead routing and lifecycle guide |
| Month 2 (Dec 2026) | A1 HubSpot implementation checklist | A7 HubSpot audit checklist | Expand: cleanup and deduplication playbook (absorbs B6); cost of duplicate data |
| Month 3 (Jan 2027) | B2 Pipedrive vs HubSpot for B2B | A6 HubSpot Professional vs Enterprise | Expand: architecture blueprint; governance checklist |
| Month 4 (Feb 2027) | C4 HubSpot attribution reporting | B3 Pipedrive to HubSpot migration | Expand: lead routing decision tree; pipeline article |
| Month 5 (Mar 2027) | C6 What does a HubSpot RevOps consultant do? | A8 Outsourced HubSpot admin vs in-house | Expand: attribution guide; integration governance guide |
| Month 6 (Apr 2027) | Two from the re-ranked backlog | (chosen with GSC data) | Expand: automation article; adoption article. Review GSC and re-rank the remaining 12 ideas. |

Calendar revised Oct 2026: B6 merged into the cleanup playbook and C1 dropped (both duplicated an existing page's primary keyword). Remaining backlog after month 6 (order to be re-ranked with real data): A2, A3, A4, A5, B4, B5, B7, B8, C3, C5, C7, C8.

---

## 6. Refresh schedule for existing resources

All 12 existing pages are 350–453 words. Targets: guides and playbook 1,000–1,800 words; articles 700–1,200 words; templates 700–1,000 words plus the actual file.

| Page | Type | Now | Target | Month | What to add |
|---|---|---|---|---|---|
| hubspot-crm-architecture-blueprint | Guide | 453 | 1,400–1,800 | 3 | Worked lifecycle example, property catalogue fields, when to add a pipeline; link A1, A4 |
| crm-cleanup-deduplication-system-pipelinesync | Playbook | 413 | 1,400–1,800 | 2 | Step-by-step audit → merge → enrich → prevent; link B6, cleanup page |
| lead-routing-lifecycle-automation-pipelinesync | Guide | 398 | 1,200–1,600 | 1 | Rule order table, SLA timer setup, recycled-lead flow; link C1, C2 |
| integration-governance-monitoring-pipelinesync | Guide | 397 | 1,000–1,400 | 5 | Field ownership matrix, alerting, rollback; link `/integrations/` |
| full-funnel-attribution-that-ceos-trust-pipelinesync | Guide | 387 | 1,200–1,600 | 5 | Prerequisites (clean lifecycle data), model choice, dashboard layout; link C4 |
| why-your-hubspot-pipeline-doesnt-reflect-reality-pipelinesync | Article | 419 | 800–1,200 | 4 | Example exit criteria per stage; link A3, C7 |
| the-cost-of-duplicate-data-in-hubspot-pipelinesync | Article | 394 | 800–1,200 | 2 | Where cost shows up per team (marketing, sales, service); link B6 |
| automation-that-saves-10-hours-week-pipelinesync | Article | 376 | 800–1,200 | 6 | The specific workflows (routing, hygiene, follow-up). Title/slug implies "10 hours"; `TODO(owner)`: either source the figure or keep the on-page wording "hours every week" (slug stays) |
| why-teams-dont-adopt-hubspot-and-how-we-fix-it-pipelinesync | Article | 399 | 700–1,000 | 6 | Architecture vs training; link implementation page |
| hubspot-governance-checklist-pipelinesync | Template | 350 | 700–1,000 | 3 | All 47 points listed or linked. **`TODO(owner)`: the page says "Notion template" but links to no file. Publish the template and add the link.** |
| data-migration-mapping-sheet-pipelinesync | Template | 359 | 700–1,000 | 1 | Column definitions. **`TODO(owner)`: "Google Sheet" with no link. Publish and link.** |
| lead-routing-decision-tree-pipelinesync | Template | 370 | 700–1,000 | 4 | Decision table. **`TODO(owner)`: "Miro board" with no link. Publish and link.** |

Each refresh: update the visible "Updated" date and `lastmod`, keep the URL, fix the "In this guide" aside so it matches the real sections, add a "Related resources" block.

---

## 7. Writing rules

### Voice

- Plain, specific, direct. Short sentences. One idea per paragraph.
- Say what we do and how, not how great it is. No hype words ("revolutionary", "game-changing", "seamless", "unlock", "supercharge").
- Write to one reader ("you"). Name the role when it helps ("your sales lead", "whoever owns the portal").
- Prefer concrete nouns from HubSpot: objects, properties, pipelines, stages, workflows, permission sets.
- Use the house terms consistently: "HubSpot Solutions Partner", "technical consultancy, not a marketing agency", "audit, architect, build, hand over", "documented, not black-boxed".

### Facts

- Use only facts that appear on the site or in the business brief: founded 2025; team of eight (founder, five HubSpot implementation specialists, two support staff); no subcontracting; 12 HubSpot certifications; 10 five-star reviews across Upwork and the HubSpot Solutions Directory; 100% Job Success Score on Upwork; 5 years hands-on HubSpot; 30+ businesses helped; office in the Philippines on US business hours; reply within 24 hours on business days; service timelines as published.
- No invented statistics, benchmarks, client names, results, quotes, prices or reviews. Where a number would help, write `TODO(owner): confirm figure` and list it in the PR.
- The home page "Symptom" chips ("30%+ duplicate rate", "~8 hrs/rep lost") are illustrative. Do not quote them as findings unless the owner supplies a source.
- Client logos on the home page do not mean permission to name clients in articles. Case studies need written approval: `TODO(owner)`.
- Any HubSpot feature or tier claim must be checked against HubSpot's current documentation on the publish date; note the check date in the PR.
- Consistency check: the home page lists "Sales Hub Enterprise" among certifications; `/about/` lists "Sales Hub Software". `TODO(owner)`: confirm the correct name.

### E-E-A-T

- Bylines: articles are credited to the PipelineSync team (owner decision, Oct 2026). Do not add individual author names or author boxes. E-E-A-T comes from method, the About page and partner credentials.
- Show published and updated dates; change "updated" only when content changes materially.
- Show experience through method, not claims: checklists, decision rules and steps that are clearly from real builds.
- Link credentials to proof (HubSpot Solutions Directory listing `TODO(owner): URL`, Upwork agency profile).
- No `Review` or `AggregateRating` markup for PipelineSync itself.

### On-page

- Title ≤ 60 characters, pattern `Primary Keyword | PipelineSync`. Description 140–160 characters, specific, ends with a reason to click.
- One H1 containing the target keyword or a close variant. No skipped heading levels.
- First 100 words state the problem and who the piece is for.
- At least: one link to the pillar service page, one to `/resources/`, two to related resources. Every new page must receive at least two internal links from existing pages.
- Images: descriptive alt text; width and height set (the site checker enforces this); no inline `<style>`.
