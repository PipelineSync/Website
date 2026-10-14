# SEO and AI search roadmap

**This is the working plan for pipelinesync.net (adopted October 2026).** The full plan with rationale is in [PipelineSync-SEO-AI-Search-Plan.pdf](PipelineSync-SEO-AI-Search-Plan.pdf); details live in the other files in this folder. Update the status column as work ships.

Goals: be findable (technical), be the best answer (content), be recommended (authority), for Google and for AI assistants (Google AI Overviews/AI Mode, ChatGPT, Perplexity, Copilot, Gemini, Claude).

## Status

| When | Item | Owner | Status |
|---|---|---|---|
| Weeks 1–2 | SEO foundation, keyword map, six service pages (PR #15) | Claude | Done |
| Weeks 1–2 | GA4 `G-ZYR7TRJ6T8` with consent mode; HubSpot banner for EU/UK/CH | Owner + Claude | Done |
| Weeks 1–2 | Explicit AI crawler policy in `robots.txt` (search and training bots allowed) | Claude | Done |
| Weeks 1–2 | `/llms.txt` generated from site data | Claude | Done |
| Weeks 1–2 | IndexNow ping after each production deploy (`netlify/plugins/indexnow`) | Claude | Done |
| Weeks 1–2 | `ai_referral` GA4 event for visits from AI assistants | Claude | Done |
| Weeks 1–2 | Verify Google Search Console (DNS) and submit sitemap | Owner | Open |
| Weeks 1–2 | Verify Bing Webmaster Tools (import from GSC) | Owner | Open |
| Weeks 1–2 | Mark `generate_lead` as GA4 key event; link GA4 ↔ GSC; create "AI assistants" channel group | Owner | Open |
| Weeks 1–2 | Add "How did you hear about us?" field (with "AI assistant" option) to the HubSpot consultation form | Owner | Open |
| Weeks 1–2 | Publish the three template files; confirm article authors | Owner | Open |
| Weeks 1–2 | Align all profile descriptions (HubSpot directory, LinkedIn, Upwork); start review sequence; baseline AI prompt check | Owner | Open |
| Month 1 (Nov 2026) | Articles: Salesforce to HubSpot migration checklist; HubSpot lifecycle stages explained. Refresh: mapping sheet, lead routing guide | Claude + team | Planned |
| Month 1 | Clutch and G2 profiles; weekly HubSpot Community answers | Owner | Planned |
| Month 2 (Dec 2026) | Articles: deduplication in HubSpot; lead routing best practices. Refresh: cleanup playbook, duplicate data | Claude + team | Planned |
| Month 3 (Jan 2027) | Articles: implementation checklist; audit checklist. Refresh: architecture blueprint, governance checklist. First case study | Claude + team | Planned |
| Months 2–3 | Core Web Vitals field data review; guest article pitches; "best HubSpot partner" list outreach | Claude / Owner | Planned |
| Month 4 (Feb 2027) | Articles: Pipedrive vs HubSpot; Professional vs Enterprise. Refresh: decision tree, pipeline article | Claude + team | Planned |
| Month 5 (Mar 2027) | Articles: attribution reporting; Pipedrive to HubSpot migration. Refresh: attribution, integration governance | Claude + team | Planned |
| Month 6 (Apr 2027) | Articles: RevOps consultant; outsourced admin vs in-house. Refresh: automation, adoption. Re-rank backlog with GSC data. Second case study. Enforce CSP | Claude + team | Planned |
| Months 7–9 | 6 articles from re-ranked backlog; integration landing pages (real projects only); original data piece | Claude + team | Planned |
| Months 10–12 | 6 articles; refresh service pages; full technical re-audit; annual review | Claude + team | Planned |

## Recurring

- **Monthly (30 min):** GSC queries/pages, indexing errors, AI prompt check (20 prompts, PDF appendix), leads by channel incl. AI assistants, confirm next month's 2 articles + 2 refreshes.
- **Every content change:** follow the writing rules in `content-plan.md` §7 and the answer-first format (question H2, 40–60 word answer, then detail, FAQ). No invented facts or statistics.
- **Every PR:** `npm run check` must pass with 0 failures; regenerate social cards after title changes (`npm run og-images`).

## AI visibility prompts

The 20 prompts to check monthly are in the PDF appendix. Log results in a sheet: prompt, assistant, mentioned (Y/N), cited with link (Y/N), competitors named.
