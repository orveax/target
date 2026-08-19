# TARGET Website — Final Handover

Status: COMPLETED / FINAL FROZEN
Project: TARGET For Food Trading
Domain: targetft.com
Frozen production code commit: 2c13b87628d023143f2cfeeb590392859e2739f4
Release baseline: v1.0.0

## Delivered scope

- Arabic / English corporate website
- Responsive desktop, tablet and mobile experience
- Home
- About TARGET
- How We Work
- Products & Companies
- Qatar Market
- For Suppliers
- Contact
- Company Profile
- FAQ
- Privacy Policy
- Terms & Conditions
- 404 recovery page
- Company Profile PDF resource integration
- Supplier / product data structure
- SEO foundation, sitemap and canonical routing
- GitHub source repository and CI quality gates

## Technical baseline

- Astro 7.2.0
- Vue 3.5.40
- Static production output
- Locked dependency graph through package-lock.json and npm ci
- Arabic RTL / English LTR
- Production code audited through TARGET Code Hard Audit V1

## Quality gates at freeze

Frozen code commit `2c13b87628d023143f2cfeeb590392859e2739f4` passed:

- TARGET Final Site Freeze QA
- TARGET Code Hard Audit V1
- Astro production build
- Astro / TypeScript checks
- JavaScript syntax checks
- CSS structural checks
- ESLint
- unused source/dependency scan
- repository structure/reference scan
- runtime coverage audit
- production dependency security audit

## Content and asset ownership

- Business/content source of truth: TARGET Notion workspace
- Brand / approved delivery assets: TARGET Google Drive
- Product and supplier source data: `public/content/companies.json`
- Company Profile asset configuration: `src/data/companyProfile.ts`

## Safe update rules

The frozen v1.0.0 code must not be reopened for design polish. Changes after closure are classified as one of:

1. Bug Fix — correction of a reproducible defect.
2. Content Maintenance — approved data/content/asset replacement without redesign.
3. Change Request / V2 — new feature, new page, new component, redesign or structural modification.

Before every production change:

1. update source/data rather than patching rendered DOM;
2. run the permanent CI gates;
3. verify Arabic and English behavior;
4. confirm responsive behavior for affected components;
5. retain the canonical route and SEO contract.

## Common maintenance operations

### Add or update a supplier/company
Update `public/content/companies.json` and the corresponding product assets. Do not introduce a second data source.

### Replace a company brochure
Replace the approved brochure asset and update only the brochure metadata/path in the company data record. Do not hard-code brochure logic in page components.

### Replace the Company Profile PDF
Update the approved PDF asset referenced by `src/data/companyProfile.ts`; keep the public Company Profile page and download CTA contract intact.

### Contact details
Update verified contact details in the source-of-truth data/content layer. Do not publish placeholder phone, address or social URLs.

## Production release checklist

- custom production domain connected
- HTTPS valid
- www/non-www redirect policy confirmed
- canonical URLs resolve to targetft.com
- sitemap.xml accessible
- robots.txt accessible
- Company Profile PDF downloadable
- Contact and supplier enquiry behavior verified
- no placeholder contact data exposed
- final release backed up

## Closure

TARGET Corporate Website v1.0.0 is considered complete at the frozen production code commit above. Any work beyond the defined maintenance rules is a Change Request / V2.
