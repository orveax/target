# TARGET Website v1.0.0 — Release Notes

Release status: FINAL FROZEN
Frozen production code commit: `2c13b87628d023143f2cfeeb590392859e2739f4`
Release date: 2026-08-19

## Release summary

TARGET v1.0.0 is the completed bilingual corporate website for TARGET For Food Trading. The release closes the initial website implementation and establishes the code, responsive behavior, design system, content routes and technical QA baseline for production use.

## Included

- Complete Arabic / English public website
- RTL / LTR parity
- Desktop, tablet and mobile responsive navigation
- Final header / mega-menu / offcanvas navigation system
- Final numbered-card design system
- Compact section navigator system
- Company Profile resource page and PDF download flow
- Supplier and product portfolio structure
- Supplier enquiry and contact experiences
- FAQ and legal pages
- SEO / canonical / sitemap foundation
- Production static build

## Engineering closure

The v1.0.0 frozen code passed:

- TARGET Final Site Freeze QA — SUCCESS
- TARGET Code Hard Audit V1 — SUCCESS
- Astro / TypeScript — clean
- JavaScript syntax — clean
- CSS structure — clean
- ESLint — clean
- unused source/dependency scan — clean
- repository structure/reference scan — clean
- runtime coverage — clean
- production dependency security audit — clean

## Architectural cleanup completed before freeze

- Removed disconnected legacy source tree
- Removed redundant runtime scripts and stale compatibility logic
- Removed Pinia global store and replaced single-component state with local Vue state
- Consolidated TARGET design-system foundation
- Removed duplicate CSS ownership and historical patch accumulation
- Moved production DOM content from runtime injection into Astro source
- Reduced CI to permanent release/code gates
- Locked dependencies with package-lock.json and npm ci

## Post-release policy

This release is frozen. Future work must be categorized as:

- Bug Fix
- Content Maintenance
- Change Request / V2

The frozen v1.0.0 implementation must not be reopened for discretionary polish.
