# Phase 0 — Technical SEO, GEO, AEO & AIEO Audit Report
**Target Site**: Zafoor Clinic Public Website (`WEB/`)  
**Canonical Production Domain**: `https://zafoorclinic.com`  
**Framework**: Vite 8 + React 19 SPA (Client-Side Rendered)  
**Date of Audit**: August 21, 2026  

---

## 1. Executive Summary & Root Cause Analysis

Zafoor Clinic is a doctor-led multi-specialty skin, hair, laser, diabetes and family medicine clinic located in George Town, Chennai, headed by Dr. Mufeeda Roohi. While the site features rich, doctor-verified clinical copy, services, patient reviews, and FAQs in `src/data/content.js`, **100% of this content is rendered purely on the client side via React 19**.

### The Core Blocker: Client-Side Rendering (CSR) Gap
When crawlers or HTTP clients request `https://zafoorclinic.com/`, the built Vite output (`dist/index.html`) returns:
```html
<body>
  <div id="root"></div>
</body>
```
- **Search Engines (Googlebot, Bingbot)**: May eventually execute JavaScript, but suffer from significant rendering delays, crawl budget waste, and suboptimal indexing.
- **AI Answer Engines & LLM Crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot, OAI-SearchBot)**: **Do not reliably execute JavaScript**. They read the raw initial HTML response. To these engines, Zafoor Clinic appears as a blank page with zero clinic services, zero doctor credentials, and zero location text.

---

## 2. Page & Route Inventory

| Route / Section | Purpose | Existing Content Status | SSR / Static State |
| :--- | :--- | :--- | :--- |
| `/` (`#home`) | Hero section with clinic identity & CTAs | Rich copy in `content.js` | ❌ Blank `#root` |
| `#about` | Clinic philosophy & George Town location | In `About.jsx` | ❌ Blank `#root` |
| `#doctor` | Dr. Mufeeda Roohi bio, qualifications & role | In `DoctorBanner.jsx` | ❌ Blank `#root` |
| `#services` | 24 medical & cosmetology services across 3 departments | In `Services.jsx` | ❌ Blank `#root` |
| `#procedure` | Clinical procedure walkthrough videos | In `VideoSection.jsx` | ❌ Blank `#root` |
| `#gallery` | Real clinic before/after treatment outcomes | In `Gallery.jsx` | ❌ Blank `#root` |
| `#video-reviews` | Video testimonials from patients | In `VideoSection.jsx` | ❌ Blank `#root` |
| `#testimonials` | Written patient testimonials | In `Reviews.jsx` | ❌ Blank `#root` |
| `#faqs` | Patient FAQs (walk-ins, PRP sessions, timings) | In `FAQ.jsx` | ❌ Blank `#root` |
| `#booking` | Live appointment booking widget | In `Booking.jsx` (connected to CRM) | ❌ Blank `#root` |
| `#contact` | Clinic timings, address, WhatsApp, phone | In `Footer.jsx` & `ContactForm.jsx` | ❌ Blank `#root` |

---

## 3. Crawl Infrastructure & Meta Tag Audit

### Current Status:
1. **Title & Meta Description**:
   - Static in `index.html`. Well-crafted, but only attached to the main shell.
2. **Canonical URL**:
   - Present: `<link rel="canonical" href="https://zafoorclinic.com/">`.
3. **Open Graph & Twitter Cards**:
   - Present, pointing to `https://zafoorclinic.com/` and Blob storage images.
4. **Existing XML Sitemap (`public/sitemap.xml`)**:
   - **Critical Bug**: Contains hash fragment URLs (`https://zafoorclinic.com/#services`, `#faqs`, etc.). Search engine sitemap specifications (sitemaps.org / Google Search Console) explicitly reject or ignore URLs containing hash fragments.
5. **Existing `robots.txt` (`public/robots.txt`)**:
   - Generic `User-agent: * Allow: /`.
   - **Missing**: Explicit allowances for modern AI search bots (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, `anthropic-ai`, `CCBot`, `OAI-SearchBot`, `Applebot-Extended`).
6. **Machine-Readable Summary (`llms.txt`)**:
   - **Missing**: No `llms.txt` file exists for LLM direct retrieval.

---

## 4. Structured Data (Schema.org) Audit

### Current State:
- `MedicalClinic` schema and `FAQPage` schema are embedded in `index.html`.
- **Gaps Identified**:
  - Missing separate `@type: "Physician"` or `"Person"` schema for Dr. Mufeeda Roohi linked via `@id` or `founder`/`employee`.
  - Missing structured `@type: "MedicalBusiness"` / `@type: "LocalBusiness"` with `MedicalSpecialty` enumerations.
  - Missing explicit `@type: "MedicalProcedure"` / `@type: "Service"` schemas for key treatments (PRP Therapy, GFC Therapy, Laser Treatments, Diabetic Foot Care, Neuropathy Screening).
  - Missing `@type: "Review"` / `AggregateRating` structured markup for real verified testimonials.
  - Missing `@type: "BreadcrumbList"` schema.

---

## 5. Identified Clinic Entities (From Existing Content Only)

All entity data extracted strictly from verified on-page data in `src/data/content.js`:
- **Clinic Name**: Zafoor Clinic
- **Specialties**: Aesthetic Medicine, Diabetology, Family Medicine, Dermatology, Cosmetology, ENT, Pediatrics, Gynaecology, Eye Care
- **Lead Doctor**: Dr. Mufeeda Roohi (Founder & Chief Physician — Family Physician, Diabetologist and Aesthetic Physician)
- **Address**: No. 69/68, St. Xavier Street, George Town, Chennai, Tamil Nadu - 600001, India (Opposite Huda Mosque, Broadway)
- **Geo Coordinates**: Latitude `13.0958`, Longitude `80.2891`
- **Phone**: `+91 8940399403` (`89403 99403`)
- **Email**: `ZafoorClinic@gmail.com`
- **Hours**: Monday to Sunday: 6:00 PM – 10:00 PM (`Mo-Su 18:00-22:00`)
- **Socials**: Instagram `https://www.instagram.com/dr.mufeeda_roohi/`, WhatsApp `https://wa.me/918940399403`

---

## 6. Implementation Action Plan

1. **Phase 1 (Rendering Fix)**: Implement build-time static HTML prerendering (`prerender.mjs` / Vite SSG integration) so that `dist/index.html` contains full semantic markup of all sections, headings, services, doctor bios, and testimonials. Enable smooth client-side hydration via `hydrateRoot`.
2. **Phase 2 (SEO Metadata)**: Upgrade `<head>` tags with complete geographic tags, enhanced OpenGraph tags, canonicals, and verified meta descriptions.
3. **Phase 3 (Crawl Infrastructure)**: Rebuild `sitemap.xml` (valid sitemaps.org format) and `robots.txt` (explicit AI crawler permissions + sitemap reference). Add IndexNow deploy hook.
4. **Phase 4 (Schema.org JSON-LD)**: Inject rich multi-entity JSON-LD (`MedicalClinic`, `Physician`, `MedicalProcedure`, `FAQPage`, `Review`, `BreadcrumbList`).
5. **Phase 5 (AEO)**: Verify semantic heading hierarchy (`H1` -> `H2` -> `H3`), question-and-direct-answer structures.
6. **Phase 6 (GEO / AIEO)**: Publish `llms.txt` and `llms-full.txt` at site root with verified facts, clinic offerings, and contact details.
7. **Phase 7 (Core Web Vitals)**: Ensure explicit dimensions on hero/clinic images to prevent CLS, font preloading, and lazy loading on below-the-fold media.
8. **Phase 8 (Verification & Final Report)**: Verify curl outputs, schema validation, and produce the comprehensive deliverable report.
