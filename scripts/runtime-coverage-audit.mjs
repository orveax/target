import fs from 'node:fs';
import { chromium } from 'playwright';

const origin = process.env.TARGET_AUDIT_ORIGIN || 'http://127.0.0.1:4173';
const chromePath = process.env.CHROME_PATH;
if (!chromePath) throw new Error('CHROME_PATH is required for runtime coverage audit.');

const pages = [
  '/index.html','/about.html','/capabilities.html','/products-companies.html',
  '/qatar-market.html','/suppliers.html','/contact.html','/company-profile.html',
  '/faq.html','/privacy.html','/terms.html','/404.html',
];
const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
];

const cssTotals = new Map();
const jsTotals = new Map();
const selectorStats = new Map();
const loadedFirstParty = new Set();
const failures = [];

const normalizeUrl = (url) => {
  try {
    const parsed = new URL(url);
    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return url;
  }
};
const firstPartyAsset = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.origin === origin && parsed.pathname.startsWith('/assets/');
  } catch {
    return false;
  }
};
const recordCoverage = (store, entries) => {
  for (const entry of entries) {
    if (!firstPartyAsset(entry.url)) continue;
    const key = normalizeUrl(entry.url);
    const current = store.get(key) || { total: 0, used: 0, visits: 0 };
    const textLength = entry.text?.length || 0;
    const used = (entry.ranges || []).reduce((sum, range) => sum + Math.max(0, range.end - range.start), 0);
    current.total = Math.max(current.total, textLength);
    current.used += used;
    current.visits += 1;
    store.set(key, current);
  }
};
function recordSelectors(entries) {
  for (const entry of entries) {
    const href = normalizeUrl(entry.href);
    const fileStats = selectorStats.get(href) || new Map();
    const current = fileStats.get(entry.selector) || { seen: 0, matched: 0 };
    current.seen += 1;
    if (entry.matched) current.matched += 1;
    fileStats.set(entry.selector, current);
    selectorStats.set(href, fileStats);
  }
}
async function collectSelectors(page) {
  const entries = await page.evaluate((auditOrigin) => {
    const results = [];
    const dynamicPseudo = /:(?:hover|active|focus|focus-visible|focus-within|visited|link|target)\b/gi;
    const pseudoElement = /::[a-z-]+(?:\([^)]*\))?|:(?:before|after)\b/gi;
    const cleanSelector = (selector) => selector.replace(pseudoElement, '').replace(dynamicPseudo, '').trim();

    const walkRules = (rules, href) => {
      for (const rule of rules) {
        if (rule.type === CSSRule.STYLE_RULE && rule.selectorText) {
          const selector = rule.selectorText.trim();
          const query = cleanSelector(selector);
          if (!query) continue;
          let matched = false;
          try { matched = Boolean(document.querySelector(query)); } catch { /* report unsupported selectors as unmatched */ }
          results.push({ href, selector, matched });
          continue;
        }
        if (!rule.cssRules) continue;
        if (rule.type === CSSRule.MEDIA_RULE && !matchMedia(rule.conditionText).matches) continue;
        if (rule.type === CSSRule.SUPPORTS_RULE && !CSS.supports(rule.conditionText)) continue;
        walkRules(rule.cssRules, href);
      }
    };

    for (const sheet of document.styleSheets) {
      if (!sheet.href) continue;
      let url;
      try { url = new URL(sheet.href); } catch { continue; }
      if (url.origin !== auditOrigin || !url.pathname.startsWith('/assets/')) continue;
      try { walkRules(sheet.cssRules, sheet.href); } catch { /* byte coverage still tracks inaccessible sheets */ }
    }
    return results;
  }, origin);
  recordSelectors(entries);
}

const browser = await chromium.launch({ headless: true, executablePath: chromePath });
try {
  for (const viewport of viewports) {
    for (const pagePath of pages) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
      const page = await context.newPage();
      await page.route('**/*', async (route) => {
        if (['image','media','font'].includes(route.request().resourceType())) return route.abort();
        return route.continue();
      });
      page.on('request', (request) => {
        if (firstPartyAsset(request.url())) loadedFirstParty.add(normalizeUrl(request.url()));
      });
      page.on('pageerror', (error) => failures.push(`${pagePath} ${viewport.name}: pageerror: ${error.message}`));

      await Promise.all([
        page.coverage.startCSSCoverage({ resetOnNavigation: false }),
        page.coverage.startJSCoverage({ resetOnNavigation: false }),
      ]);

      try {
        await page.goto(`${origin}${pagePath}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(420);
        await collectSelectors(page);

        const toggle = page.locator('[data-lang-toggle]').first();
        if (await toggle.count()) {
          await toggle.click();
          await page.waitForTimeout(100);
        }
        await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
        await page.waitForTimeout(100);
      } catch (error) {
        failures.push(`${pagePath} ${viewport.name}: ${error.message}`);
      }

      recordCoverage(cssTotals, await page.coverage.stopCSSCoverage());
      recordCoverage(jsTotals, await page.coverage.stopJSCoverage());
      await context.close();
    }
  }
} finally {
  await browser.close();
}

const coverageSummary = (store) => [...store.entries()]
  .map(([url,data]) => ({ url, total:data.total, used:data.used, visits:data.visits, ratio:data.total ? Math.min(100,(data.used/data.total)*100) : 0 }))
  .sort((a,b) => a.ratio-b.ratio || a.url.localeCompare(b.url));
const selectorSummary = [...selectorStats.entries()].map(([href,selectors]) => {
  const all = [...selectors.entries()];
  const unmatched = all.filter(([,stats]) => stats.matched === 0).map(([selector]) => selector);
  return { href, total:all.length, reached:all.length-unmatched.length, unmatched };
}).sort((a,b) => a.href.localeCompare(b.href));
const zeroCss = coverageSummary(cssTotals).filter((item) => item.used === 0).map((item) => item.url);
const zeroJs = coverageSummary(jsTotals).filter((item) => item.used === 0).map((item) => item.url);
const covered = new Set([...cssTotals.keys(),...jsTotals.keys()]);
const loadedWithoutCoverage = [...loadedFirstParty].filter((url) => !covered.has(url)).sort();

const report = {
  css: coverageSummary(cssTotals),
  js: coverageSummary(jsTotals),
  selectors: selectorSummary,
  zeroCss,
  zeroJs,
  loadedWithoutCoverage,
  failures,
};
fs.writeFileSync('runtime-coverage-report.json', JSON.stringify(report, null, 2));

console.log('\n=== Runtime coverage summary ===');
console.log(`CSS assets: ${report.css.length}; zero-use: ${zeroCss.length}`);
console.log(`JS assets: ${report.js.length}; zero-execution: ${zeroJs.length}`);
console.log(`Runtime failures: ${failures.length}`);
console.log('\n=== Selector reachability summary ===');
selectorSummary
  .filter((item) => item.unmatched.length)
  .sort((a,b) => (b.unmatched.length/b.total)-(a.unmatched.length/a.total))
  .slice(0,20)
  .forEach((item) => console.log(`${item.href}: ${item.reached}/${item.total} reached; ${item.unmatched.length} unmatched`));
console.log('\n=== Zero-use CSS ===');
console.log(zeroCss.length ? zeroCss.join('\n') : 'none');
console.log('\n=== Runtime failures ===');
console.log(failures.length ? failures.join('\n') : 'none');

if (failures.length) process.exitCode = 1;
