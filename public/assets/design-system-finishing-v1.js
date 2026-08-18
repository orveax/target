/* TARGET — Design System Finishing V1 | 2026-08-19
 * Final pre-freeze behavior contract:
 * 1) under-header section navigation uses short authored section labels (kickers), never long H2 copy;
 * 2) numbered cards automatically use the shared oversized background-number treatment.
 * Runtime is idempotent: it only mutates DOM when the target value actually changes.
 */
(() => {
  'use strict';
  if (window.__TARGET_DESIGN_SYSTEM_FINISHING_V1__) return;
  window.__TARGET_DESIGN_SYSTEM_FINISHING_V1__ = true;

  const doc = document;
  const root = doc.documentElement;
  let queued = false;

  const currentLanguageText = (node) => {
    if (!node) return '';
    const key = root.lang === 'en' ? 'en' : 'ar';
    return (node.dataset?.[key] || node.textContent || '').trim();
  };

  const compactWords = (value, maxWords = 4) => {
    const clean = String(value || '').replace(/\s+/g, ' ').replace(/[.!؟?،,:;]+$/g, '').trim();
    if (!clean) return '';
    const words = clean.split(' ');
    return words.length <= maxWords ? clean : words.slice(0, maxWords).join(' ');
  };

  const ownSectionSemanticLabel = (section) => {
    if (!section) return null;
    const selectors = [
      '[class*="kicker"]',
      '[class*="section-label"]',
      '[class*="section-tag"]',
      '[class*="section-eyebrow"]'
    ];
    const nodes = [...section.querySelectorAll(selectors.join(','))];
    return nodes.find((node) => node.closest('section') === section && currentLanguageText(node));
  };

  const navigableSections = () => [...doc.querySelectorAll('main > section')].filter((section) => {
    const heading = section.querySelector('h2,h1');
    return heading && !section.matches(':first-child') && !/final|closing/i.test(section.className || '');
  });

  function syncGenericSectionNav() {
    const nav = doc.querySelector('.target-section-nav.target-section-nav--under-header, .target-section-nav');
    if (!nav) return;
    const buttons = [...nav.querySelectorAll('button')];
    if (!buttons.length) return;

    const sections = navigableSections();
    buttons.forEach((button, index) => {
      const section = sections[index];
      const label = button.querySelector('.target-section-nav-label');
      if (!section || !label) return;

      const heading = section.querySelector('h2,h1');
      const semantic = ownSectionSemanticLabel(section);
      const full = currentLanguageText(heading) || `Section ${index + 1}`;
      const compact = compactWords(currentLanguageText(semantic) || full, semantic ? 4 : 3);

      if (label.textContent !== compact) label.textContent = compact;
      if (label.dataset.compactLabel !== 'true') label.dataset.compactLabel = 'true';
      const sectionId = section.id || '';
      if (button.dataset.targetSectionId !== sectionId) button.dataset.targetSectionId = sectionId;
      if (button.dataset.compactNav !== 'true') button.dataset.compactNav = 'true';
      if (button.getAttribute('aria-label') !== full) button.setAttribute('aria-label', full);
      if (button.title !== full) button.title = full;
    });
    if (nav.dataset.designSystemCompact !== 'true') nav.dataset.designSystemCompact = 'true';
  }

  function syncFaqOwnedNavigator() {
    const band = doc.querySelector('.page-faq .faq-topic-band');
    if (!band) return;
    const replacements = new Map([
      ['عن تارقت والسوق القطري', ['تارقت وقطر', 'TARGET & Qatar']],
      ['About TARGET & Qatar', ['تارقت وقطر', 'TARGET & Qatar']],
      ['المنتجات والموردون', ['المنتجات والموردون', 'Products & Suppliers']],
      ['Products & Suppliers', ['المنتجات والموردون', 'Products & Suppliers']],
      ['وضوح التعامل', ['وضوح التعامل', 'Commercial Clarity']],
      ['Commercial Clarity', ['وضوح التعامل', 'Commercial Clarity']],
      ['التواصل والموارد', ['التواصل والموارد', 'Contact & Resources']],
      ['Contact & Resources', ['التواصل والموارد', 'Contact & Resources']]
    ]);

    band.querySelectorAll('[data-ar][data-en]').forEach((node) => {
      const key = node.dataset.ar || node.dataset.en || '';
      const pair = replacements.get(key);
      if (!pair) return;
      if (node.dataset.ar !== pair[0]) node.dataset.ar = pair[0];
      if (node.dataset.en !== pair[1]) node.dataset.en = pair[1];
      const visible = root.lang === 'en' ? pair[1] : pair[0];
      if (node.textContent !== visible) node.textContent = visible;
    });
    if (band.dataset.designSystemCompact !== 'true') band.dataset.designSystemCompact = 'true';
  }

  function parseRgb(value) {
    const match = String(value || '').match(/rgba?\((\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)[,\s]+(\d+(?:\.\d+)?)(?:[,\s/]+(\d+(?:\.\d+)?))?/i);
    if (!match) return null;
    return { r:+match[1], g:+match[2], b:+match[3], a:match[4] == null ? 1 : +match[4] };
  }

  function surfaceIsDark(card) {
    let node = card;
    for (let depth = 0; node && depth < 3; depth += 1, node = node.parentElement) {
      const style = getComputedStyle(node);
      const rgb = parseRgb(style.backgroundColor);
      if (rgb && rgb.a > .08) {
        const luminance = (rgb.r * .2126 + rgb.g * .7152 + rgb.b * .0722) / 255;
        if (luminance < .42) return true;
        if (luminance > .72) return false;
      }
      const image = style.backgroundImage || '';
      if (/12\s*,\s*73\s*,\s*49|7\s*,\s*59\s*,\s*41|38\s*,\s*38\s*,\s*38|#0c4931|#073b29|#262626/i.test(image)) return true;
    }
    const classText = `${card.className || ''} ${card.parentElement?.className || ''}`.toLowerCase();
    return /(?:dark|forest|focus|featured|primary|cta|after)/.test(classText);
  }

  function scanNumberedCards(scope = doc) {
    const markerSelector = [
      'article [class*="number"]',
      'article [class*="index"]',
      'article [class*="-num"]',
      'li [class*="number"]',
      'li [class*="index"]',
      'li [class*="-num"]',
      '[class*="card"] [class*="number"]',
      '[class*="card"] [class*="index"]',
      '[class*="card"] [class*="-num"]'
    ].join(',');

    scope.querySelectorAll(markerSelector).forEach((marker) => {
      const value = (marker.textContent || '').trim();
      if (!/^0?\d{1,2}$/.test(value)) return;
      if (marker.closest('.target-section-nav,.faq-topic-band,.privacy-toc,.terms-toc')) return;

      const card = marker.closest('article,[class*="card"],li');
      if (!card || card === marker) return;

      if (!card.classList.contains('target-numbered-card')) card.classList.add('target-numbered-card');
      if (!marker.classList.contains('target-card-number-bg')) marker.classList.add('target-card-number-bg');
      if (surfaceIsDark(card) && !card.classList.contains('target-numbered-card--dark')) card.classList.add('target-numbered-card--dark');
      if (card.dataset.numberedCardSystem !== 'background') card.dataset.numberedCardSystem = 'background';
    });
  }

  function sync() {
    syncGenericSectionNav();
    syncFaqOwnedNavigator();
    scanNumberedCards();
  }

  function queueSync() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      sync();
    });
  }

  const start = () => {
    sync();
    new MutationObserver(queueSync).observe(doc.body, { childList:true, subtree:true });
    new MutationObserver(queueSync).observe(root, { attributes:true, attributeFilter:['lang','dir'] });
    window.addEventListener('load', queueSync, { once:true });
  };

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', start, { once:true });
  else start();
})();
