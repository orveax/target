# TARGET — Code Hard Audit Report

- **Audited commit:** `765544fb7498af3086855da4c683804dd2ae2c8d`
- **Node:** 22
- **Dependency install:** `npm ci` from committed lockfile
- **Overall:** **FAIL**
- **Blocking stages:** CSS_STRUCTURE

| Audit gate | Result |
|---|---:|
| Astro production build | PASS |
| Astro / TypeScript check | PASS |
| JavaScript syntax | PASS |
| CSS structural validation | FAIL |
| ESLint source/runtime | PASS |
| Unused source/dependency scan | PASS |
| Repository structure/reference scan | PASS |
| Production dependency security audit | PASS |
| Runtime route/CSS/JS execution audit | PASS |

## Runtime summary

- Zero-use first-party CSS assets: **2**
- Runtime/page execution failures: **0**
- Stylesheets containing at least one selector not reached by the audit matrix: **44**

## Audit scope

Static analysis covers current Astro/Vue/TypeScript source, all shipped JavaScript syntax, structural CSS errors, lint errors, unused source/dependencies, repository references and production dependency vulnerabilities. Runtime analysis covers the built static site across the public route inventory at desktop and mobile viewports with language switching and scrolling. No screenshot or image-quality test is used by this report.
