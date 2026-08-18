import { chromium } from 'playwright';

const origin = process.env.TARGET_AUDIT_ORIGIN || 'http://127.0.0.1:4173';
const chromePath = process.env.CHROME_PATH;
if (!chromePath) throw new Error('CHROME_PATH is required for runtime coverage audit.');

const pages = [
  '/index.html',
  '/about.html',
  '/capabilities.html',
  '/products-companies.html',
  '/qatar-market.html',
  '/suppliers.html',
  '/contact.html',
  '/company-profile.html',
  '/faq.html',
  '/privacy.html',
  '/terms.html',
  '/404.html',
];

const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
];

const cssTotals = new Map();
const jsTotals = new Map();
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

const browser = await chromium.launch({ headless: true, executablePath: chromePath });

try {
  for (const viewport of viewports) {
    for (const pagePath of pages) {
      const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
      const page = await context.newPage();

      await page.route('**/*', async (route) => {
        const type = route.request().resourceType();
        if (['image', 'media', 'font'].includes(type)) return route.abort();
        return route.continue();
      });

      page.on('request', (request) => {
        const url = request.url();
        if (firstPartyAsset(url)) loadedFirstParty.add(normalizeUrl(url));
      });
      page.on('pageerror', (error) => failures.push(`${pagePath} ${viewport.name}: pageerror: ${error.message}`));

      await Promise.all([
        page.coverage.startCSSCoverage({ resetOnNavigation: false }),
        page.coverage.startJSCoverage({ resetOnNavigation: false }),
      ]);

      try {
        await page.goto(`${origin}${pagePath}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
        await page.waitForTimeout(700);

        const toggle = page.locator('[data-lang-toggle]').first();
        if (await toggle.count()) {
          await toggle.click();
          await page.waitForTimeout(180);
        }

        await page.evaluate(() => {
          window.scrollTo(0, document.documentElement.scrollHeight);
        });
        await page.waitForTimeout(180);
      } catch (error) {
        failures.push(`${pagePath} ${viewport.name}: ${error.message}`);
      }

      const css = await page.coverage.stopCSSCoverage();
      const js = await page.coverage.stopJSCoverage();
      recordCoverage(cssTotals, css);
      recordCoverage(jsTotals, js);
      await context.close();
    }
  }
} finally {
  await browser.close();
}

function printReport(title, store) {
  console.log(`\n=== ${title} ===`);
  const entries = [...store.entries()].sort((a, b) => {
    const aRatio = a[1].total ? a[1].used / a[1].total : 0;
    const bRatio = b[1].total ? b[1].used / b[1].total : 0;
    return aRatio - bRatio || a[0].localeCompare(b[0]);
  });

  for (const [url, data] of entries) {
    const ratio = data.total ? Math.min(100, (data.used / data.total) * 100) : 0;
    console.log(`${ratio.toFixed(1).padStart(6)}%  ${String(data.total).padStart(8)} bytes  ${url}`);
  }
}

printReport('First-party CSS runtime coverage', cssTotals);
printReport('First-party JS runtime coverage', jsTotals);

const covered = new Set([...cssTotals.keys(), ...jsTotals.keys()]);
const loadedWithoutCoverage = [...loadedFirstParty].filter((url) => !covered.has(url)).sort();
console.log('\n=== Loaded first-party assets without coverage entry ===');
if (loadedWithoutCoverage.length) loadedWithoutCoverage.forEach((url) => console.log(`- ${url}`));
else console.log('- none');

const zeroCss = [...cssTotals.entries()]
  .filter(([, data]) => data.used === 0)
  .map(([url]) => url)
  .sort();
const zeroJs = [...jsTotals.entries()]
  .filter(([, data]) => data.used === 0)
  .map(([url]) => url)
  .sort();

console.log('\n=== Zero-use first-party CSS candidates ===');
if (zeroCss.length) zeroCss.forEach((url) => console.log(`- ${url}`));
else console.log('- none');
console.log('\n=== Zero-execution first-party JS candidates ===');
if (zeroJs.length) zeroJs.forEach((url) => console.log(`- ${url}`));
else console.log('- none');

if (failures.length) {
  console.error('\n=== Runtime coverage execution failures ===');
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
}
