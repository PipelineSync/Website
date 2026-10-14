# Privacy policy: proposed draft

> **DRAFT FOR LEGAL REVIEW. NOT LEGAL ADVICE.**
> This is a working draft prepared to replace the WordPress boilerplate currently at `src/about/privacy-policy/index.njk` (`/about/privacy-policy/`). It must be reviewed by a qualified lawyer before publication, with particular attention to the laws of the Philippines (where the team is based) and of each market served. Do not publish it as-is.

Prepared: 2026-10-14.

---

## A. What changes versus the current policy

| Current policy (WordPress boilerplate) | Proposed policy |
|---|---|
| Describes comments, Gravatar, media uploads, login cookies, password resets and a spam-check service. **None of these exist on the static site.** | Removed. |
| Does not name the business, a contact address or a contact email. | Names PipelineSync and gives a contact email. Legal entity and address to be added (`TODO(owner)`). |
| Does not mention the HubSpot consultation form, HubSpot tracking code or HubSpot chat. | Describes what each collects and why. |
| Does not mention Google Analytics 4, Google Fonts or the Font Awesome CDN. | Describes them (GA4 only if enabled). |
| No cookie table or consent explanation. | Cookie section, consent banner, how to change choices. |
| No legal bases, no international transfers, no rights by region, no retention periods. | Adds legal bases (UK/EU GDPR), transfers (including to the team in the Philippines), rights under UK/EU GDPR, Australia, Canada and US state laws, retention, children, changes, complaints. |
| Meta description mentions "comments, media". | New description needed (developer task), e.g. "How PipelineSync collects and uses personal data from our website, consultation form, HubSpot chat and analytics, and how to exercise your rights." |

## B. Owner and legal decisions needed (`TODO(owner)`)

1. **Legal entity name** (registered company name, if different from "PipelineSync") and **registration number**.
2. **Registered address** (and whether to publish it).
3. **Privacy contact / Data Protection Officer.** Default proposal: Allen Trinidad, allentrinidad@pipelinesync.net. Consider a role address (e.g. privacy@pipelinesync.net) so the policy survives staff changes. Under the Philippines Data Privacy Act a DPO must be designated and may need registration with the National Privacy Commission: **lawyer to confirm**.
4. **EU / UK representative:** whether one is required (GDPR Art. 27 / UK GDPR Art. 27) given the volume and nature of EU/UK processing. **Lawyer to confirm.**
5. **Retention periods** (section 9 has proposals to accept or change).
6. **Exact consultation form fields** (HubSpot form `925b2a78-2998-4846-a6e8-a7514007fb93`, portal `247123252`). The draft lists likely fields; confirm against the live form.
7. **GA4:** enabled or not. If not, delete the GA4 rows.
8. **Cookie banner:** HubSpot's banner or a custom one, and which regions get opt-in.
9. **HubSpot data hosting region.** The site loads scripts from `js-na2.hs-scripts.com` and `js-na2.hsforms.net`, which suggests a North America data centre. Confirm in HubSpot account settings.
10. **Marketing emails:** do you send newsletters or marketing emails to form submitters? If yes, add a consent checkbox to the form and a section on marketing.
11. **Any other tools** that receive personal data (e.g. Zoom or Google Meet for calls, a scheduling tool, an email provider other than HubSpot, WhatsApp Business). List them so section 7 is complete.
12. **Governing law / main establishment** for the policy and the Philippines Data Privacy Act position: **lawyer to confirm.**

---

## C. Proposed policy text

*Text below is written for the page. Square-bracketed items must be completed before publication.*

### Privacy Policy

Last updated: [DATE]

This policy explains what personal data PipelineSync collects when you visit pipelinesync.net, contact us or book a consultation, why we collect it, who we share it with, and the choices and rights you have.

### 1. Who we are

PipelineSync ("we", "us") is a HubSpot Solutions Partner. Our website is https://pipelinesync.net/.

- Legal entity: [TODO(owner): registered company name and number]
- Address: [TODO(owner): registered address]
- Privacy contact: [TODO(owner): name/role], allentrinidad@pipelinesync.net

For data collected through this website, we are the **controller** (the organisation that decides how and why the data is used). When we work inside a client's HubSpot portal as part of a project, we act on that client's instructions and our client's own privacy policy applies to that data; this policy does not cover it.

### 2. The short version

- We collect what you type into our consultation form or chat, and information about how you use our site.
- We use it to reply to you, to run consultations and projects, and to understand which pages are useful.
- We use HubSpot to store enquiries and run chat, Netlify to host the site, and Google for fonts and (if enabled) analytics.
- We do not sell your personal data and we do not use it for third-party advertising.
- You can ask to see, correct or delete your data at any time by emailing allentrinidad@pipelinesync.net.

### 3. What we collect

| Source | Data | Notes |
|---|---|---|
| Consultation form ("Book a free consultation", powered by HubSpot) | Name, email address, company, and any details you choose to share about your CRM or project. [TODO(owner): confirm fields, e.g. phone, job title, company size, message] | Required fields are marked on the form. |
| HubSpot chat | Your messages, and name/email if you provide them; chat transcript. | |
| Email, phone and WhatsApp | Your contact details and the content of your messages. | If you contact us on WhatsApp, WhatsApp (Meta) also processes data under its own terms. |
| HubSpot tracking code | Pages viewed, visit dates and times, referring website, campaign (UTM) parameters, approximate location derived from IP address, device and browser type. Linked to your contact record if you submit the form. | Only with your consent where consent is required (see section 5). |
| Google Analytics 4 *(only if enabled)* | Pages viewed, events (for example form submission, clicks on phone/WhatsApp/email links, ROI calculator use), device and browser type, approximate location. IP addresses are not stored by GA4. | Only with your consent where required. |
| Hosting (Netlify) | Server logs: IP address, requested URL, date and time, browser user agent. | Used for security and delivery. |
| Fonts and icons | When a page loads, your browser requests fonts from Google Fonts (fonts.googleapis.com, fonts.gstatic.com) [and icons from cdnjs.cloudflare.com], which receive your IP address and browser details. | [TODO(developer): remove the cdnjs row if icons are self-hosted after the SEO work.] |
| ROI calculator | Numbers you enter are processed in your browser and are not sent to us [TODO(developer): confirm]. | |

We do not knowingly collect sensitive data (such as health, religion or financial account details). Please do not include it in forms or messages.

### 4. Why we use it and our legal bases

The legal bases below apply where UK GDPR or EU GDPR applies. Elsewhere we use your data for the same purposes in line with local law.

| Purpose | Data | Legal basis (UK/EU GDPR) |
|---|---|---|
| Reply to your enquiry and arrange a consultation | Form, chat, email, phone/WhatsApp data | Steps you asked us to take before a contract (Art. 6(1)(b)); otherwise our legitimate interest in responding to business enquiries (Art. 6(1)(f)) |
| Deliver and manage a project | Contact and project communications | Performance of a contract (Art. 6(1)(b)) |
| Understand how the site is used and improve it | HubSpot tracking, GA4 | Consent (Art. 6(1)(a)) where required by cookie law; you can withdraw it at any time |
| Know which page or campaign an enquiry came from | HubSpot tracking, UTM parameters | Consent where required; otherwise legitimate interests |
| Keep the site secure and working | Server logs, strictly necessary cookies | Legitimate interests (Art. 6(1)(f)) |
| Keep business and tax records; meet legal obligations | Contract and invoicing records | Legal obligation (Art. 6(1)(c)) |
| [Marketing emails, only if you opt in: TODO(owner)] | Email address | Consent (Art. 6(1)(a)) |

We do not use your data for automated decisions that have legal or similarly significant effects on you.

### 5. Cookies and consent

When you first visit, a cookie banner asks for your choice. [TODO(owner): banner provider and which regions see opt-in.] Strictly necessary cookies are always on. Analytics cookies are set only if you accept them where consent is required. You can change your choice at any time using [the "Cookie settings" link in the footer / TODO(developer)] or by clearing cookies in your browser.

| Cookie | Provider | Purpose | Type | Duration (approx.) |
|---|---|---|---|---|
| `__hs_cookie_cat_pref`, `__hs_opt_out`, `__hs_do_not_track` | HubSpot | Remember your consent choice | Necessary | Up to 13 months |
| `__hstc` | HubSpot | Track visits (first, last, current visit, session count) | Analytics | 13 months |
| `hubspotutk` | HubSpot | Visitor identity; links visits to a form submission | Analytics | 13 months |
| `__hssc`, `__hssrc` | HubSpot | Session tracking | Analytics | 30 minutes / session |
| `messagesUtk` | HubSpot | Recognise chat visitors and keep chat history | Functional | 13 months |
| `_ga`, `_ga_<ID>` *(only if GA4 is enabled)* | Google | Distinguish visitors and sessions | Analytics | Up to 2 years (configurable) |
| Browser storage (sessionStorage/localStorage) | PipelineSync | Remember interface state, for example that the loading screen has been shown | Necessary | Session / until cleared |

[TODO(developer): confirm the exact list after the SEO and consent changes ship, using the HubSpot cookie scan and browser DevTools. HubSpot's own cookie documentation lists current names and durations.]

Where required by law (for example in California), we treat a Global Privacy Control signal from your browser as a request to opt out of analytics tracking that could count as "sharing". [TODO(legal/developer): confirm implementation.]

### 6. Who we share data with

We do not sell personal data. We share it only with service providers who process it for us under contract (processors), and when the law requires.

| Provider | What they do for us | Data |
|---|---|---|
| HubSpot, Inc. | CRM, forms, chat, website tracking, email | Form, chat, contact and tracking data |
| Netlify, Inc. | Website hosting and delivery | Server logs |
| Google LLC / Google Ireland | Google Fonts; Google Analytics 4 (if enabled) | IP address, browser data; analytics data |
| [Cloudflare (cdnjs)] | Icon library delivery [remove if self-hosted] | IP address, browser data |
| [TODO(owner): video call, scheduling, email, accounting tools] | | |

We may also disclose data to professional advisers, to a buyer or successor if our business is sold or restructured, or where required by law or to protect our rights.

### 7. International transfers

Our team works from the Philippines, and our main service providers are based in the United States. Your data may therefore be stored or accessed outside your country, including in the United States and the Philippines.

Where UK or EU data protection law applies, we protect these transfers using recognised safeguards, such as the EU-US Data Privacy Framework (and UK Extension) where the provider is certified, the European Commission's Standard Contractual Clauses, and the UK International Data Transfer Addendum. [TODO(legal): confirm the mechanism for transfers to the Philippines team and for each provider.] For Australian, Canadian and other visitors, we take reasonable steps to ensure overseas recipients protect your data to a comparable standard. You can ask us for more information about these safeguards.

### 8. How we protect data

Access to our HubSpot account is limited to team members who need it, with individual logins and [TODO(owner): two-factor authentication]. All client work is done by our own team; we do not subcontract client builds. The website is served over HTTPS.

### 9. How long we keep data

[TODO(owner): confirm or change these proposed periods.]

| Data | Proposed retention |
|---|---|
| Enquiries that do not become clients (form, chat, email) | [24 months] after last contact, then deleted or anonymised |
| Client contacts and project communications | Duration of the engagement plus [6 years] for legal, tax and contractual purposes |
| HubSpot tracking data not linked to a contact | Per HubSpot settings [TODO(owner)] |
| GA4 event data (if enabled) | 14 months |
| Netlify server logs | Per Netlify's retention [TODO(owner): confirm] |
| Consent records | As long as needed to show consent was given |

### 10. Your rights

You can contact us at allentrinidad@pipelinesync.net to exercise any of the rights below. We will reply within the time the law requires (normally one month under UK/EU GDPR, 30 days under PIPEDA, 45 days under most US state laws). We may need to confirm your identity first. We will not treat you differently for exercising your rights.

**UK and EU (UK GDPR / EU GDPR):** access, rectification, erasure, restriction, data portability, objection to processing based on legitimate interests, and withdrawal of consent at any time. You can complain to the UK Information Commissioner's Office (ico.org.uk) or your local EU supervisory authority.

**Australia (Privacy Act 1988 and the Australian Privacy Principles):** access to and correction of your personal information. If you are not satisfied with our response, you can complain to the Office of the Australian Information Commissioner (oaic.gov.au).

**Canada (PIPEDA):** access to your personal information, correction of inaccurate information, and withdrawal of consent (subject to legal and contractual limits). You can complain to the Office of the Privacy Commissioner of Canada (priv.gc.ca).

**United States (state privacy laws such as the California Consumer Privacy Act as amended by the CPRA, where they apply to us):** the right to know what personal information we collect, use and disclose; to access, correct and delete it; and to opt out of "sale" or "sharing" for cross-context behavioural advertising. We do not sell personal information and do not share it for cross-context behavioural advertising. You may use an authorised agent. [TODO(legal): confirm which state laws apply given PipelineSync's size and revenue thresholds.]

**Philippines (Data Privacy Act of 2012):** [TODO(legal): add data subject rights and the National Privacy Commission complaint route if the Act applies to PipelineSync as a Philippines-based business.]

### 11. Children

Our website and services are for businesses. They are not directed at children under 16, and we do not knowingly collect their personal data. If you believe a child has given us personal data, contact us and we will delete it.

### 12. Links to other websites

Our site links to other sites, such as LinkedIn, Upwork, Instagram, Facebook, WhatsApp and the HubSpot Solutions Directory. Their own privacy policies apply when you visit them.

### 13. Changes to this policy

We will update this policy when our practices or the law change. The "Last updated" date at the top shows the latest version. If we make significant changes, we will make that clear on this page.

### 14. Contact

PipelineSync
[TODO(owner): legal entity name]
[TODO(owner): registered address]
Email: allentrinidad@pipelinesync.net
Phone: +1 (646) 729-2936

---

## D. Implementation notes for the developer (after legal sign-off)

- Replace the body of `src/about/privacy-policy/index.njk`; keep the URL `/about/privacy-policy/`.
- Update `title`/`description` front matter (description 140–160 characters, no mention of comments or media).
- Render the email with the site's existing JS email-obfuscation pattern, as elsewhere on the site.
- Add a "Cookie settings" link in the footer that reopens the consent banner.
- Set `lastmod` to the publication date.
