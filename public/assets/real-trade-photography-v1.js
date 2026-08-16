/* TARGET — Real Trade Photography Pass V1
 * Replaces controlled editorial/placeholder imagery with real free-to-use trade photography.
 * Runtime-only visual source pass. No page structure, grid, card or locked CSS baseline changes.
 * Source: Pexels. Company-specific product/logo media is intentionally excluded.
 */
(() => {
  'use strict';

  if (window.__TARGET_REAL_TRADE_PHOTOGRAPHY_V1__) return;
  window.__TARGET_REAL_TRADE_PHOTOGRAPHY_V1__ = true;

  const doc = document;
  const root = doc.documentElement;
  const isAr = () => root.lang !== 'en';

  const pexels = (id, width = 1600, height = 1100) =>
    `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}&h=${height}&fit=crop`;

  const PHOTO = Object.freeze({
    factory: pexels('36823725', 1800, 1200),
    warehouse: pexels('4481260', 1600, 1100),
    warehouseAisle: pexels('4483862', 1600, 1100),
    dohaAerial: pexels('31583097', 1800, 1200),
    dohaWaterfront: pexels('35296431', 1800, 1200),
    quality: pexels('5953751', 1600, 1100),
    tea: pexels('8330390', 1200, 900),
    juice: pexels('8679342', 1200, 900),
    honey: pexels('5634207', 1200, 900),
    dairy: pexels('10591603', 1200, 900),
    fmcg: pexels('12081286', 1200, 900),
  });

  function setImage(selector, src, arAlt, enAlt, options = {}) {
    const img = doc.querySelector(selector);
    if (!img) return;
    img.src = src;
    img.removeAttribute('srcset');
    img.dataset.arAlt = arAlt;
    img.dataset.enAlt = enAlt;
    img.alt = isAr() ? arAlt : enAlt;
    img.decoding = 'async';
    if (options.eager) {
      img.loading = 'eager';
      img.fetchPriority = 'high';
    } else {
      img.loading = 'lazy';
      img.removeAttribute('fetchpriority');
    }
    img.dataset.realTradePhoto = 'v1';
  }

  function setBackground(selector, src, position = 'center') {
    const node = doc.querySelector(selector);
    if (!node) return;
    node.style.setProperty('background-image', `url("${src}")`, 'important');
    node.style.setProperty('background-position', position, 'important');
    node.style.setProperty('background-size', 'cover', 'important');
    node.dataset.realTradePhoto = 'v1';
  }

  function syncLanguageAlts() {
    doc.querySelectorAll('img[data-real-trade-photo="v1"][data-ar-alt][data-en-alt]').forEach((img) => {
      img.alt = isAr() ? img.dataset.arAlt : img.dataset.enAlt;
    });
  }

  function applyHome() {
    setBackground('.page-home .hc-hero-media, .home-canonical .hc-hero-media', PHOTO.factory, 'center 52%');
  }

  function applyAbout() {
    setImage(
      '.page-about .about-hero__media img, .about-canonical .about-hero__media img',
      PHOTO.dohaWaterfront,
      'أفق الدوحة وواجهة المدينة الحديثة في قطر',
      'Doha skyline and modern waterfront in Qatar',
      { eager: true }
    );
    setImage(
      '.page-about .about-who__media img, .about-canonical .about-who__media img',
      PHOTO.warehouse,
      'عمليات مخزن وتجهيز شحنات ضمن بيئة لوجستية تجارية',
      'Warehouse operations and shipment preparation in a commercial logistics environment'
    );
  }

  function applyHowWeWork() {
    // The canonical hero is intentionally a route composition, not a photo slot.
    // Replace only the existing supporting media added by the visual audit layer.
    const applySupport = () => setImage(
      '.page-capabilities .work-info-media img',
      PHOTO.quality,
      'فحص جودة منتج غذائي داخل منشأة إنتاج',
      'Food product quality inspection inside a production facility'
    );
    applySupport();
    const observer = new MutationObserver(() => {
      if (doc.querySelector('.page-capabilities .work-info-media img')) {
        applySupport();
        observer.disconnect();
      }
    });
    if (!doc.querySelector('.page-capabilities .work-info-media img')) observer.observe(doc.body, { childList: true, subtree: true });
  }

  function applyPortfolio() {
    setImage(
      '.page-food-portfolio .portfolio-hero-media img',
      PHOTO.fmcg,
      'رفوف منتجات غذائية حقيقية في بيئة بيع بالتجزئة',
      'Real food products displayed in a retail environment',
      { eager: true }
    );
    setBackground('.page-food-portfolio .media-tea', PHOTO.tea, 'center');
    setBackground('.page-food-portfolio .media-juice', PHOTO.juice, 'center');
    setBackground('.page-food-portfolio .media-honey', PHOTO.honey, 'center');
    setBackground('.page-food-portfolio .media-dairy', PHOTO.dairy, 'center');
    setBackground('.page-food-portfolio .media-fmcg', PHOTO.fmcg, 'center');
  }

  function applyQatarMarket() {
    setImage(
      '.page-qatar-market .qm-hero-media img',
      PHOTO.dohaAerial,
      'منظر جوي حقيقي لأفق الدوحة والسوق القطري',
      'Real aerial view of Doha and the Qatar market context',
      { eager: true }
    );
    setImage(
      '.page-qatar-market .qm-context-media img',
      PHOTO.fmcg,
      'قنوات بيع فعلية ومنتجات غذائية معروضة في متجر',
      'Real retail channels with food products displayed in store'
    );
  }

  function applySuppliers() {
    setImage(
      '.page-suppliers .fs-hero-media img',
      PHOTO.factory,
      'منشأة إنتاج غذائي حقيقية وخط تجهيز صناعي',
      'Real food production facility and industrial processing line',
      { eager: true }
    );
    setImage(
      '.page-suppliers .fs-prepare-media img',
      PHOTO.quality,
      'فحص جودة منتج غذائي قبل مناقشة الفرصة التجارية',
      'Food product quality inspection before commercial opportunity review'
    );
  }

  function applyContact() {
    setImage(
      '.page-contact .ct-hero-media img',
      PHOTO.warehouseAisle,
      'بيئة لوجستية حقيقية لتخزين وتجهيز البضائع والشحنات',
      'Real logistics environment for storage, goods handling and shipment preparation',
      { eager: true }
    );
  }

  function apply() {
    const page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    if (page === 'index.html' || page === '') applyHome();
    if (page === 'about.html') applyAbout();
    if (page === 'capabilities.html') applyHowWeWork();
    if (page === 'food-portfolio.html') applyPortfolio();
    if (page === 'qatar-market.html') applyQatarMarket();
    if (page === 'suppliers.html') applySuppliers();
    if (page === 'contact.html') applyContact();
    syncLanguageAlts();

    new MutationObserver(syncLanguageAlts).observe(root, { attributes: true, attributeFilter: ['lang'] });
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', apply, { once: true });
  else apply();
})();
