(function () {
  'use strict';

  const SELECTOR = '[data-company-cards]';
  let lastPayload = null;

  function dataUrl() {
    return document.body?.dataset.companyDataUrl || 'content/companies.json';
  }

  function brochureBase() {
    return document.body?.dataset.brochureBase || '';
  }

  function resolveAssetPath(path) {
    if (!path) return '';
    if (/^(?:https?:|\/)/i.test(path)) return path;
    return brochureBase() + path;
  }

  function isArabic() {
    return (document.documentElement.lang || '').toLowerCase().startsWith('ar') || document.documentElement.dir === 'rtl';
  }

  function text(value) {
    return value == null ? '' : String(value);
  }

  function createProductList(products) {
    const list = document.createElement('ul');
    list.className = 'company-card__products list-unstyled d-flex flex-wrap gap-2 mb-0';

    products.forEach((product) => {
      const item = document.createElement('li');
      item.className = 'wf-chip company-card__product';
      item.textContent = product;
      list.appendChild(item);
    });

    return list;
  }

  async function brochureExists(path) {
    if (!path) return false;
    try {
      const response = await fetch(path, { method: 'HEAD', cache: 'no-store' });
      return response.ok;
    } catch (_) {
      return false;
    }
  }

  function createBrochureButton(company, ar) {
    const brochure = company.brochure || {};
    if (brochure.enabled !== true) return null;

    const resolvedPath = resolveAssetPath(brochure.path);
    if (!resolvedPath) return null;

    const link = document.createElement('a');
    link.className = 'btn btn-outline-dark btn-sm mt-3 company-card__brochure';
    link.href = resolvedPath;
    link.setAttribute('download', '');
    link.hidden = true;
    link.innerHTML = '<i class="bi bi-file-earmark-arrow-down" aria-hidden="true"></i><span></span>';
    link.querySelector('span').textContent = ar ? 'تحميل بروشور المنتجات' : 'Download Product Brochure';

    brochureExists(resolvedPath).then((exists) => {
      link.hidden = !exists;
    });

    return link;
  }

  function createCard(company, ar) {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-xl-3';

    const card = document.createElement('article');
    card.className = 'wf-card company-card h-100';
    card.dataset.companyId = company.id;

    const eyebrow = document.createElement('div');
    eyebrow.className = 'wf-kicker mb-2';
    eyebrow.textContent = ar ? text(company.categoryAr) : text(company.categoryEn);

    const title = document.createElement('h3');
    title.className = 'h4 mb-3';
    title.textContent = ar ? text(company.nameAr) : text(company.nameEn);

    const products = ar ? company.productsAr || [] : company.productsEn || [];

    card.appendChild(eyebrow);
    card.appendChild(title);
    card.appendChild(createProductList(products));

    const brochure = createBrochureButton(company, ar);
    if (brochure) card.appendChild(brochure);

    col.appendChild(card);
    return col;
  }

  function paint(payload) {
    const host = document.querySelector(SELECTOR);
    if (!host || !payload) return;

    const companies = (payload.companies || []).filter((company) => company.status === 'active');
    const ar = isArabic();
    host.replaceChildren();
    companies.forEach((company) => host.appendChild(createCard(company, ar)));
  }

  async function renderCompanyCards() {
    const host = document.querySelector(SELECTOR);
    if (!host) return;

    try {
      if (!lastPayload) {
        const response = await fetch(dataUrl(), { cache: 'no-store' });
        if (!response.ok) throw new Error(`Company data request failed: ${response.status}`);
        lastPayload = await response.json();
      }
      paint(lastPayload);
    } catch (error) {
      console.error('[TARGET] Company cards could not be rendered.', error);
      host.hidden = true;
    }
  }

  document.addEventListener('DOMContentLoaded', renderCompanyCards);

  const languageObserver = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.attributeName === 'lang' || mutation.attributeName === 'dir')) {
      paint(lastPayload);
    }
  });
  languageObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });

  window.TargetCompanyCards = { render: renderCompanyCards };
})();
