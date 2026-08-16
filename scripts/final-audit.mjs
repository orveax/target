import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const fail = (message) => { throw new Error(message); };
const assert = (condition, message) => { if (!condition) fail(message); };
const read = (file) => fs.readFileSync(path.join(dist, file), 'utf8');

const publicPages = [
  'index.html',
  'about.html',
  'capabilities.html',
  'food-portfolio.html',
  'qatar-market.html',
  'suppliers.html',
  'contact.html',
  'company-profile.html',
  'faq.html',
  'privacy.html',
  'terms.html',
];
const utilityPages = ['404.html'];
const trackedPages = [...publicPages, ...utilityPages];

assert(fs.existsSync(dist), 'dist/ is missing. Run the Astro build first.');

for (const file of trackedPages) {
  assert(fs.existsSync(path.join(dist, file)), `Missing tracked route: ${file}`);
}

const rootHtml = fs.readdirSync(dist).filter((name) => name.endsWith('.html')).sort();
const expectedRootHtml = [...trackedPages].sort();
assert(JSON.stringify(rootHtml) === JSON.stringify(expectedRootHtml), `Unexpected root HTML route inventory. Expected ${expectedRootHtml.join(', ')}; found ${rootHtml.join(', ')}`);
assert(!rootHtml.includes('product-profile.html'), 'Untracked duplicate product-profile.html must not ship.');

function checkDuplicateIds(html, file) {
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map((m) => m[1]);
  const seen = new Set();
  const duplicates = new Set();
  for (const id of ids) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }
  assert(duplicates.size === 0, `${file} has duplicate IDs: ${[...duplicates].join(', ')}`);
}

function checkImages(html, file) {
  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  for (const img of images) {
    assert(/\balt=["'][^"']*["']/i.test(img), `${file} has an <img> without alt.`);
  }
}

function checkBlankTargets(html, file) {
  const anchors = [...html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)].map((m) => m[0]);
  for (const anchor of anchors) {
    assert(/\brel=["'][^"']*noopener[^"']*noreferrer[^"']*["']/i.test(anchor), `${file} has target=_blank without noopener noreferrer.`);
  }
}

function checkLocalHtmlLinks(html, file) {
  const links = [...html.matchAll(/\bhref=["']([^"']+)["']/gi)].map((m) => m[1]);
  for (const href of links) {
    if (/^(https?:|mailto:|tel:|#|javascript:)/i.test(href)) continue;
    const clean = href.split('#')[0].split('?')[0];
    if (!clean || !clean.endsWith('.html')) continue;
    const target = clean.replace(/^\//, '');
    assert(fs.existsSync(path.join(dist, target)), `${file} links to missing local page: ${href}`);
  }
}

function checkLocalAssets(html, file) {
  const urls = [];
  for (const m of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)) urls.push(m[1]);
  for (const url of urls) {
    if (/^(https?:|mailto:|tel:|#|data:|javascript:)/i.test(url)) continue;
    const clean = url.split('?')[0].split('#')[0];
    if (!clean || clean.endsWith('.html')) continue;
    if (!/\.(css|js|svg|png|jpg|jpeg|webp|avif|ico|json|pdf)$/i.test(clean)) continue;
    const target = clean.replace(/^\//, '');
    assert(fs.existsSync(path.join(dist, target)), `${file} references missing local asset: ${url}`);
  }
}

for (const file of trackedPages) {
  const html = read(file);
  assert(/<!doctype html>/i.test(html), `${file} is missing a doctype.`);
  assert(/<html\b[^>]*lang=["']ar["'][^>]*dir=["']rtl["']/i.test(html), `${file} is missing the Arabic RTL baseline.`);
  assert(/<meta\s+name=["']description["']\s+content=["'][^"']+["']/i.test(html), `${file} is missing a meta description.`);
  assert(/<title>[^<]+<\/title>/i.test(html), `${file} is missing a page title.`);
  assert(/<main\b[^>]*id=["']main["']/i.test(html), `${file} is missing the main landmark.`);
  assert(html.includes('form-delivery-v1.js?v=20260817-01'), `${file} is missing the final form-delivery guard.`);
  assert(html.includes('final-site-freeze-v1.css?v=20260817-01'), `${file} is missing the final site-freeze CSS guard.`);
  assert(!html.includes('RFX'), `${file} still exposes the stray RFX footer label.`);
  assert(!/href=["']#["']/i.test(html), `${file} contains an empty # link.`);

  const h1Count = (html.match(/<h1\b/gi) || []).length;
  assert(h1Count === 1, `${file} must contain exactly one H1; found ${h1Count}.`);

  checkDuplicateIds(html, file);
  checkImages(html, file);
  checkBlankTargets(html, file);
  checkLocalHtmlLinks(html, file);
  checkLocalAssets(html, file);
}

const notFound = read('404.html');
assert(/<meta\s+name=["']robots["']\s+content=["']noindex,follow["']/i.test(notFound), '404.html must be noindex,follow.');
for (const file of publicPages) {
  const html = read(file);
  assert(!/content=["']noindex/i.test(html), `${file} must remain indexable.`);
}

for (const file of ['contact.html', 'suppliers.html']) {
  const html = read(file);
  assert(html.includes('data-target-form'), `${file} is missing the controlled form marker.`);
  const deliveryIndex = html.indexOf('form-delivery-v1.js?v=20260817-01');
  const legacyIndex = html.indexOf('premium-v6.js?v=20260816-01');
  assert(deliveryIndex >= 0 && legacyIndex >= 0 && deliveryIndex < legacyIndex, `${file} must load the truthful form-delivery layer before legacy form handlers.`);
  assert(/privacy\.html/i.test(html), `${file} is missing the privacy acknowledgement route.`);
}

const deliveryJs = read('assets/form-delivery-v1.js');
assert(deliveryJs.includes('mailto:'), 'Form delivery fallback must prepare an email draft.');
assert(deliveryJs.includes('partners@targetft.com'), 'Supplier form fallback must route to partners@targetft.com.');
assert(deliveryJs.includes('sales@targetft.com'), 'Sales enquiry fallback must route to sales@targetft.com.');
assert(deliveryJs.includes('info@targetft.com'), 'General enquiry fallback must route to info@targetft.com.');
assert(deliveryJs.includes('stopImmediatePropagation'), 'Form delivery layer must block simulated legacy receipt handlers.');

const companies = JSON.parse(read('content/companies.json'));
for (const company of companies.companies || []) {
  if (company?.brochure?.status === 'temporary_internal_placeholder') {
    assert(company.brochure.enabled === false, `${company.slug}: temporary internal brochure must not be publicly downloadable.`);
  }
}

assert(fs.existsSync(path.join(dist, 'robots.txt')), 'robots.txt is missing.');
assert(fs.existsSync(path.join(dist, 'sitemap.xml')), 'sitemap.xml is missing.');
const robots = read('robots.txt');
assert(robots.includes('Sitemap: https://targetft.com/sitemap.xml'), 'robots.txt sitemap declaration is missing.');
const sitemap = read('sitemap.xml');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
assert(sitemapUrls.length === 11, `Sitemap must contain 11 public URLs; found ${sitemapUrls.length}.`);
assert(!sitemap.includes('404'), '404 must not appear in sitemap.xml.');
assert(!sitemap.includes('product-profile'), 'Untracked product-profile must not appear in sitemap.xml.');

const headers = read('_headers');
for (const required of ['X-Content-Type-Options: nosniff', 'Referrer-Policy: strict-origin-when-cross-origin', 'X-Frame-Options: SAMEORIGIN', 'Permissions-Policy:']) {
  assert(headers.includes(required), `_headers is missing: ${required}`);
}

const companyProfile = read('company-profile.html');
assert(!/href=["'][^"']*company-profile[^"']*\.pdf/i.test(companyProfile), 'Company Profile page must not expose a final PDF download until the approved asset exists.');

console.log('TARGET FINAL AUDIT: PASS');
console.log(`Tracked routes: ${trackedPages.length} (${publicPages.length} public + ${utilityPages.length} utility)`);
console.log('Forms: transparent email-client delivery fallback active');
console.log('Placeholder brochures: public download disabled');
console.log('SEO utilities: robots.txt + 11-URL sitemap present');
