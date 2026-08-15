/* TARGET — Experience & Brand Layer V1
 * Runtime-only progressive enhancement. No source HTML/CSS restructuring.
 * Modules: branded motion, smart section nav, contextual CTA, contextual WhatsApp,
 * company deep links, branded feedback.
 */
(() => {
  'use strict';

  if (window.__TARGET_EXPERIENCE_V1__) return;
  window.__TARGET_EXPERIENCE_V1__ = true;

  const doc = document;
  const root = doc.documentElement;
  const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  const isAr = () => root.lang !== 'en';
  const txt = (ar, en) => isAr() ? ar : en;
  const path = () => (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const headerOffset = () => (doc.querySelector('.site-header')?.getBoundingClientRect().height || 76) + 16;

  function onReady(fn) {
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  }

  function safe(name, fn) {
    try { return fn(); }
    catch (error) { console.warn(`[TARGET experience] ${name} skipped`, error); }
  }

  function scrollToElement(el) {
    if (!el) return;
    const top = Math.max(0, window.scrollY + el.getBoundingClientRect().top - headerOffset());
    window.scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }

  function injectRuntimeStyles() {
    if (doc.getElementById('target-experience-v1-styles')) return;
    const style = doc.createElement('style');
    style.id = 'target-experience-v1-styles';
    style.textContent = `
      .target-motion-accent{display:block;width:44px;height:2px;margin-block:12px 8px;border-radius:99px;background:#C09552;transform-origin:center;pointer-events:none}
      .target-section-nav{position:fixed;z-index:1035;inset-inline-start:14px;top:50%;transform:translateY(-50%);display:grid;gap:7px;padding:9px;border:1px solid rgba(12,73,49,.12);border-radius:16px;background:rgba(255,254,251,.92);box-shadow:0 14px 34px rgba(38,38,38,.10);backdrop-filter:blur(12px)}
      .target-section-nav button{display:flex;align-items:center;gap:8px;max-width:190px;padding:7px 9px;border:0;border-radius:10px;background:transparent;color:#626962;font:700 .72rem/1.35 Tajawal,Manrope,sans-serif;text-align:start;cursor:pointer;transition:background .18s ease,color .18s ease,transform .18s ease}
      .target-section-nav button::before{content:attr(data-index);display:grid;place-items:center;flex:0 0 27px;width:27px;height:27px;border-radius:9px;background:#F4EDE4;color:#0C4931;font:800 .62rem/1 Manrope,sans-serif}
      .target-section-nav button:hover,.target-section-nav button:focus-visible{background:rgba(12,73,49,.065);color:#0C4931;outline:none}
      .target-section-nav button[aria-current="true"]{background:#0C4931;color:#fff}
      .target-section-nav button[aria-current="true"]::before{background:#C09552;color:#262626}
      .target-section-nav-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .target-context-cta{position:fixed;z-index:1036;right:18px;left:auto;bottom:18px;display:flex;align-items:center;gap:12px;max-width:min(520px,calc(100vw - 36px));padding:10px 10px 10px 16px;border:1px solid rgba(244,237,228,.16);border-radius:16px;background:rgba(38,38,38,.96);color:#F4EDE4;box-shadow:0 18px 44px rgba(38,38,38,.22);backdrop-filter:blur(12px);opacity:0;transform:translateY(12px);pointer-events:none;transition:opacity .2s ease,transform .2s ease}
      .target-context-cta.is-visible{opacity:1;transform:none;pointer-events:auto}
      .target-context-cta-copy{display:grid;gap:2px;min-width:0}.target-context-cta-copy small{color:#C09552;font-weight:800;font-size:.67rem}.target-context-cta-copy strong{font-size:.83rem;line-height:1.35}
      .target-context-cta a{display:inline-flex;align-items:center;justify-content:center;min-height:40px;padding-inline:14px;border-radius:11px;background:#C09552;color:#262626;font-weight:800;font-size:.78rem;text-decoration:none;white-space:nowrap}
      .target-feedback-region{position:fixed;z-index:1090;inset-inline-end:18px;top:96px;display:grid;gap:8px;width:min(360px,calc(100vw - 36px));pointer-events:none}
      .target-feedback-toast{display:flex;align-items:flex-start;gap:10px;padding:13px 14px;border:1px solid rgba(244,237,228,.18);border-radius:14px;background:#0C4931;color:#F4EDE4;box-shadow:0 16px 34px rgba(38,38,38,.18);font-size:.82rem;line-height:1.55;opacity:0;transform:translateY(-8px)}
      .target-feedback-toast::before{content:"✓";display:grid;place-items:center;flex:0 0 24px;width:24px;height:24px;border-radius:8px;background:#C09552;color:#262626;font:900 .75rem/1 Manrope,sans-serif}
      .target-feedback-toast.is-info::before{content:"→"}
      .target-feedback-toast.is-error{background:#262626}.target-feedback-toast.is-error::before{content:"!";color:#262626}
      @media(max-width:1199.98px){.target-section-nav{inset-inline:10px;max-width:54px}.target-section-nav-label{display:none}.target-section-nav button{padding:5px}}
      @media(max-width:767.98px){.target-section-nav{top:auto;bottom:136px;inset-inline-start:10px;transform:none;display:flex;max-width:calc(100vw - 20px);overflow:auto;padding:7px}.target-section-nav button{flex:0 0 auto}.target-context-cta{right:10px;left:10px;bottom:72px;max-width:none;justify-content:space-between}.target-context-cta-copy strong{font-size:.78rem}.target-context-cta a{min-height:38px;padding-inline:12px}.target-feedback-region{inset-inline:10px;top:82px;width:auto}}
      @media(prefers-reduced-motion:reduce){.target-section-nav button,.target-context-cta{transition:none!important}.target-feedback-toast{transform:none!important}}
    `;
    doc.head.appendChild(style);
  }

  /* F — Branded feedback system */
  const feedback = (() => {
    let region;
    function ensureRegion() {
      if (region) return region;
      region = doc.createElement('div');
      region.className = 'target-feedback-region';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'false');
      doc.body.appendChild(region);
      return region;
    }
    function show(ar, en, type = 'success', duration = 2200) {
      const container = ensureRegion();
      const toast = doc.createElement('div');
      toast.className = `target-feedback-toast is-${type}`;
      toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
      toast.textContent = txt(ar, en);
      container.appendChild(toast);
      if (reducedMotion()) toast.style.opacity = '1';
      else toast.animate(
        [{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 180, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' }
      );
      window.setTimeout(() => {
        if (reducedMotion()) toast.remove();
        else toast.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 150, fill: 'forwards' }).finished.catch(() => {}).finally(() => toast.remove());
      }, duration);
    }
    return { show };
  })();
  window.TargetFeedback = feedback;
  doc.addEventListener('target:feedback', (event) => {
    const d = event.detail || {};
    feedback.show(d.ar || '', d.en || d.ar || '', d.type || 'success', d.duration || 2200);
  });

  /* A — Branded motion language: direction + connection + market */
  function initBrandedMotion() {
    if (reducedMotion()) return;
    const hero = doc.querySelector('main > section:first-of-type');
    if (hero) {
      const copy = hero.querySelector('[class*="hero-copy"], [class*="hero_content"], [class*="hero-content"]') || hero.firstElementChild;
      const eyebrow = copy?.querySelector('[class*="eyebrow"], [class*="kicker"]');
      if (eyebrow && !copy.querySelector('.target-motion-accent')) {
        const accent = doc.createElement('span');
        accent.className = 'target-motion-accent';
        accent.setAttribute('aria-hidden', 'true');
        eyebrow.insertAdjacentElement('afterend', accent);
      }
      const sequence = copy ? [
        copy.querySelector('[class*="eyebrow"], [class*="kicker"]'),
        copy.querySelector('.target-motion-accent'),
        copy.querySelector('h1'),
        copy.querySelector('p'),
        copy.querySelector('[class*="actions"], [class*="cta"]')
      ].filter(Boolean) : [];
      sequence.forEach((el, index) => {
        el.getAnimations?.().forEach((a) => a.cancel());
        const x = isAr() ? 12 : -12;
        const keyframes = el.classList.contains('target-motion-accent')
          ? [{ opacity: .15, transform: 'scaleX(.25)' }, { opacity: 1, transform: 'scaleX(1)' }]
          : [{ opacity: .1, transform: `translateX(${x}px)` }, { opacity: 1, transform: 'translateX(0)' }];
        el.animate(keyframes, { duration: 300, delay: 45 + index * 70, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'both' });
      });
      const media = hero.querySelector('figure,[class*="hero-media"],[class*="hero-visual"]');
      media?.animate([{ opacity: .55, transform: 'scale(1.012)' }, { opacity: 1, transform: 'scale(1)' }], { duration: 520, delay: 180, easing: 'cubic-bezier(.2,.7,.2,1)' });
    }

    if (!('IntersectionObserver' in window)) return;
    const processGroups = [...doc.querySelectorAll('[class*="steps"], [class*="route"], [class*="process"]')].filter((el) => el.querySelectorAll('article,button,a').length >= 3);
    const seen = new WeakSet();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target); observer.unobserve(entry.target);
        [...entry.target.querySelectorAll(':scope > article,:scope > button,:scope > a, :scope > * > article')].slice(0, 8).forEach((node, i) => {
          const x = isAr() ? 10 : -10;
          node.animate([{ opacity: .4, transform: `translateX(${x}px)` }, { opacity: 1, transform: 'translateX(0)' }], { duration: 240, delay: i * 48, easing: 'cubic-bezier(.2,.7,.2,1)' });
        });
      });
    }, { threshold: .18 });
    processGroups.forEach((group) => observer.observe(group));
  }

  /* B — Smart section navigation */
  function initSectionNavigation() {
    if (!('IntersectionObserver' in window)) return;
    const candidates = [...doc.querySelectorAll('main > section')].filter((section) => {
      const heading = section.querySelector('h2,h1');
      return heading && !section.matches(':first-child') && !/final|closing/i.test(section.className || '');
    });
    if (candidates.length < 3) return;

    const nav = doc.createElement('nav');
    nav.className = 'target-section-nav';
    nav.setAttribute('aria-label', txt('التنقل بين أقسام الصفحة', 'Page section navigation'));

    const entries = candidates.map((section, index) => {
      const heading = section.querySelector('h2,h1');
      if (!section.id) section.id = `target-section-${index + 1}`;
      const button = doc.createElement('button');
      button.type = 'button';
      button.dataset.index = String(index + 1).padStart(2, '0');
      button.innerHTML = `<span class="target-section-nav-label"></span>`;
      const updateLabel = () => {
        button.querySelector('.target-section-nav-label').textContent = heading?.textContent?.trim() || txt(`القسم ${index + 1}`, `Section ${index + 1}`);
        button.setAttribute('aria-label', heading?.textContent?.trim() || txt(`القسم ${index + 1}`, `Section ${index + 1}`));
      };
      updateLabel();
      button.addEventListener('click', () => {
        history.replaceState(null, '', `#${section.id}`);
        scrollToElement(section);
      });
      nav.appendChild(button);
      return { section, button, heading, updateLabel };
    });
    doc.body.appendChild(nav);

    const observer = new IntersectionObserver((visible) => {
      const active = visible.filter((item) => item.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) return;
      entries.forEach(({ section, button }) => button.setAttribute('aria-current', section === active.target ? 'true' : 'false'));
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, .15, .35, .65] });
    entries.forEach(({ section }) => observer.observe(section));

    new MutationObserver(() => entries.forEach(({ updateLabel }) => updateLabel())).observe(root, { attributes: true, attributeFilter: ['lang'] });
  }

  /* C — Contextual CTA */
  const ctaMap = {
    'index.html': ['لديك منتج غذائي؟ ناقش الفرصة معنا','Have a food product? Discuss the opportunity','ابدأ النقاش','Start','suppliers.html'],
    'about.html': ['تعرف على طريقة عمل تارقت من البداية للسوق','See how TARGET works from first review to market','كيف نعمل','How We Work','capabilities.html'],
    'capabilities.html': ['جاهز لإرسال معلومات المنتج؟','Ready to share product information?','ناقش منتجك','Discuss Product','suppliers.html'],
    'food-portfolio.html': ['لديك منتج ضمن هذه الفئات؟','Have a product within these categories?','ناقشه معنا','Discuss It','suppliers.html'],
    'qatar-market.html': ['هل منتجك مناسب للسوق القطري؟','Could your product fit the Qatar market?','ابدأ المراجعة','Start Review','suppliers.html'],
    'suppliers.html': ['ابدأ بمعلومات واضحة عن المنتج والفرصة','Start with clear product and opportunity information','أرسل البيانات','Submit Details','#product-review'],
    'contact.html': ['اختر القناة المناسبة وأرسل استفسارك','Choose the right channel and send your enquiry','أرسل استفسارك','Send Enquiry','#quick-enquiry'],
    'company-profile.html': ['بعد التعرف على تارقت، ناقش منتجك معنا','After exploring TARGET, discuss your product with us','ناقش منتجك','Discuss Product','suppliers.html'],
    'faq.html': ['لم تجد الإجابة التي تحتاجها؟','Didn’t find the answer you need?','تواصل معنا','Contact Us','contact.html']
  };

  function initContextualCTA() {
    const config = ctaMap[path()];
    if (!config) return;
    const [arText,enText,arAction,enAction,href] = config;
    const bar = doc.createElement('aside');
    bar.className = 'target-context-cta';
    bar.setAttribute('aria-label', txt('الخطوة التالية', 'Next step'));
    bar.innerHTML = `<span class="target-context-cta-copy"><small data-ar="الخطوة التالية" data-en="Next Step">${txt('الخطوة التالية','Next Step')}</small><strong data-ar="${arText}" data-en="${enText}">${txt(arText,enText)}</strong></span><a href="${href}"><span data-ar="${arAction}" data-en="${enAction}">${txt(arAction,enAction)}</span></a>`;
    doc.body.appendChild(bar);

    let footerVisible = false;
    const sync = () => {
      const progress = (window.scrollY + window.innerHeight) / Math.max(doc.documentElement.scrollHeight, 1);
      bar.classList.toggle('is-visible', progress > .30 && !footerVisible);
    };
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync, { passive: true });
    const footer = doc.querySelector('.site-footer,footer');
    if (footer && 'IntersectionObserver' in window) new IntersectionObserver(([entry]) => { footerVisible = !!entry?.isIntersecting; sync(); }, { threshold: .05 }).observe(footer);
    sync();
  }

  /* D — WhatsApp contextual messages */
  const whatsappMap = {
    'index.html': ['مرحبًا، لدي استفسار بخصوص تارقت لتجارة الأغذية وأرغب في معرفة المسار المناسب.','Hello, I have an enquiry about TARGET Food Trading and would like to know the right route.'],
    'about.html': ['مرحبًا، اطلعت على نبذة تارقت وأرغب في مناقشة فرصة تجارية.','Hello, I reviewed TARGET’s company overview and would like to discuss a commercial opportunity.'],
    'capabilities.html': ['مرحبًا، اطلعت على طريقة عمل تارقت ولدي منتج أرغب في مناقشته.','Hello, I reviewed how TARGET works and have a product I would like to discuss.'],
    'food-portfolio.html': ['مرحبًا، أتواصل بخصوص منتج أو شركة ضمن نطاق المنتجات المعروضة في موقع تارقت.','Hello, I am contacting you about a product or company related to the categories shown on TARGET’s website.'],
    'qatar-market.html': ['مرحبًا، لدي منتج وأرغب في مناقشة مدى ملاءمته للسوق القطري.','Hello, I have a product and would like to discuss its potential fit for the Qatar market.'],
    'suppliers.html': ['مرحبًا، لدي منتج غذائي وأرغب في مناقشة فرصته في السوق القطري.','Hello, I have a food product and would like to discuss its opportunity in the Qatar market.'],
    'contact.html': ['مرحبًا، لدي استفسار عام بخصوص تارقت لتجارة الأغذية.','Hello, I have a general enquiry about TARGET Food Trading.'],
    'company-profile.html': ['مرحبًا، اطلعت على الملف التعريفي لتارقت وأرغب في التواصل بخصوص فرصة تجارية.','Hello, I reviewed TARGET’s company profile and would like to discuss a commercial opportunity.'],
    'faq.html': ['مرحبًا، لدي استفسار لم أجد إجابته في الأسئلة الشائعة.','Hello, I have an enquiry that I could not resolve in the FAQ.']
  };

  function initContextualWhatsApp() {
    const config = whatsappMap[path()] || whatsappMap['index.html'];
    const update = () => {
      let message = txt(config[0], config[1]);
      const company = new URL(location.href).searchParams.get('company');
      if (company && path() === 'food-portfolio.html') message += txt(` الشركة: ${company}.`, ` Company: ${company}.`);
      const href = `https://wa.me/97477910919?text=${encodeURIComponent(message)}`;
      doc.querySelectorAll('a[href*="wa.me/97477910919"],a.quick-whatsapp').forEach((anchor) => {
        anchor.href = href;
        if (anchor.dataset.targetWhatsappBound !== '1') {
          anchor.dataset.targetWhatsappBound = '1';
          anchor.addEventListener('click', () => feedback.show('سيتم فتح واتساب برسالة مناسبة لهذه الصفحة.','WhatsApp will open with a message relevant to this page.','info',1500));
        }
      });
    };
    update();
    const bodyObserver = new MutationObserver(update);
    bodyObserver.observe(doc.body, { childList: true, subtree: true });
    new MutationObserver(update).observe(root, { attributes: true, attributeFilter: ['lang'] });
    doc.addEventListener('target:company-change', update);
  }

  /* E — Company deep linking */
  async function initCompanyDeepLinking() {
    if (path() !== 'food-portfolio.html') return;
    let activeCompanies = [];
    try {
      const response = await fetch('/content/companies.json', { cache: 'no-store' });
      const payload = await response.json();
      activeCompanies = (payload?.companies || []).filter((c) => c?.status === 'active' && c?.slug);
    } catch (error) {
      console.warn('[TARGET experience] company metadata unavailable', error);
      return;
    }
    if (!activeCompanies.length) return;

    let applyingUrl = false;
    const bindTiles = () => {
      const tiles = [...doc.querySelectorAll('.company-tile')];
      if (tiles.length < activeCompanies.length) return false;
      tiles.slice(0, activeCompanies.length).forEach((tile, index) => {
        const company = activeCompanies[index];
        tile.dataset.companySlug = company.slug;
        if (tile.dataset.targetDeepLinkBound === '1') return;
        tile.dataset.targetDeepLinkBound = '1';
        tile.addEventListener('click', () => {
          if (applyingUrl) return;
          const url = new URL(location.href);
          url.searchParams.set('company', company.slug);
          history.replaceState({ company: company.slug }, '', `${url.pathname}?${url.searchParams.toString()}${url.hash}`);
          feedback.show(`تم اختيار ${company.nameAr || company.slug}.`, `${company.nameEn || company.slug} selected.`, 'info', 1200);
          doc.dispatchEvent(new CustomEvent('target:company-change', { detail: { slug: company.slug } }));
        });
      });
      return true;
    };

    const applyFromUrl = () => {
      const slug = new URL(location.href).searchParams.get('company');
      if (!slug) return;
      const index = activeCompanies.findIndex((c) => c.slug === slug);
      const tiles = [...doc.querySelectorAll('.company-tile')];
      if (index < 0 || !tiles[index]) return;
      if (tiles[index].classList.contains('active')) return;
      applyingUrl = true;
      tiles[index].click();
      window.setTimeout(() => { applyingUrl = false; }, 80);
    };

    if (!bindTiles()) {
      const observer = new MutationObserver(() => { if (bindTiles()) { applyFromUrl(); observer.disconnect(); } });
      observer.observe(doc.body, { childList: true, subtree: true });
      window.setTimeout(() => observer.disconnect(), 6000);
    } else applyFromUrl();

    window.addEventListener('popstate', applyFromUrl);
  }

  function initFormFeedback() {
    doc.querySelectorAll('[data-form-success]').forEach((success) => {
      let wasVisible = success.classList.contains('is-visible');
      new MutationObserver(() => {
        const visible = success.classList.contains('is-visible');
        if (visible && !wasVisible) feedback.show('تم استلام طلبك بنجاح.','Your submission has been received.','success',2200);
        wasVisible = visible;
      }).observe(success, { attributes: true, attributeFilter: ['class'] });
    });
  }

  onReady(() => {
    injectRuntimeStyles();
    safe('Branded Motion', initBrandedMotion);
    safe('Section Navigation', initSectionNavigation);
    safe('Contextual CTA', initContextualCTA);
    safe('Contextual WhatsApp', initContextualWhatsApp);
    safe('Company Deep Linking', () => { initCompanyDeepLinking(); });
    safe('Form Feedback', initFormFeedback);
  });
})();
