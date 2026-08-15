/* TARGET — Interaction Enhancement Layer V1
 * Progressive JavaScript only. No structural or stylesheet dependency changes.
 * Modules: page transition, reveal, prefetch, forms, navigation, company transition, FAQ intelligence, WhatsApp visibility.
 */
(() => {
  'use strict';

  if (window.__TARGET_INTERACTIONS_V1__) return;
  window.__TARGET_INTERACTIONS_V1__ = true;

  const doc = document;
  const root = doc.documentElement;
  const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  const isAr = () => root.lang !== 'en';
  const text = (ar, en) => isAr() ? ar : en;
  const headerOffset = () => (doc.querySelector('.site-header')?.getBoundingClientRect().height || 76) + 18;
  const onReady = (fn) => doc.readyState === 'loading' ? doc.addEventListener('DOMContentLoaded', fn, { once: true }) : fn();

  function safeModule(name, fn) {
    try { fn(); }
    catch (error) { console.warn(`[TARGET interactions] ${name} skipped`, error); }
  }

  function isPlainLeftClick(event) {
    return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
  }

  function resolvedInternalLink(anchor) {
    if (!anchor || anchor.hasAttribute('download')) return null;
    const target = anchor.getAttribute('target');
    if (target && target !== '_self') return null;
    const raw = anchor.getAttribute('href') || '';
    if (!raw || raw.startsWith('#') || /^(mailto:|tel:|javascript:)/i.test(raw)) return null;
    let url;
    try { url = new URL(anchor.href, location.href); } catch (_) { return null; }
    if (url.origin !== location.origin) return null;
    if (/\.(pdf|zip|jpg|jpeg|png|webp|svg|avif)$/i.test(url.pathname)) return null;
    return url;
  }

  function scrollToTarget(target, focus = true) {
    if (!target) return;
    const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - headerOffset());
    window.scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' });
    if (focus) {
      window.setTimeout(() => {
        const focusTarget = target.matches('details') ? target.querySelector('summary') : target;
        if (!focusTarget) return;
        if (!focusTarget.hasAttribute('tabindex') && !focusTarget.matches('a,button,input,select,textarea,summary')) focusTarget.setAttribute('tabindex', '-1');
        focusTarget.focus?.({ preventScroll: true });
      }, reducedMotion() ? 0 : 380);
    }
  }

  /* 1 — Page transitions */
  function initPageTransitions() {
    const main = doc.querySelector('main');
    if (!main || reducedMotion()) return;

    main.animate(
      [{ opacity: 0.72, transform: 'translateY(7px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 230, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'both' }
    );

    let navigating = false;
    doc.addEventListener('click', (event) => {
      if (navigating || !isPlainLeftClick(event)) return;
      const anchor = event.target.closest('a[href]');
      const url = resolvedInternalLink(anchor);
      if (!url) return;
      if (url.pathname === location.pathname && url.search === location.search) return;

      event.preventDefault();
      navigating = true;
      try { sessionStorage.setItem('target:navigation', url.href); } catch (_) {}

      const animation = main.animate(
        [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0.18, transform: 'translateY(-6px)' }],
        { duration: 135, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' }
      );
      animation.finished.catch(() => {}).finally(() => location.assign(url.href));
      window.setTimeout(() => { if (navigating) location.assign(url.href); }, 220);
    });

    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        navigating = false;
        main.getAnimations().forEach((a) => a.cancel());
        main.animate([{ opacity: .82 }, { opacity: 1 }], { duration: 160, easing: 'ease-out' });
      }
    });
  }

  /* 2 — Subtle scroll reveal */
  function initScrollReveal() {
    if (reducedMotion() || !('IntersectionObserver' in window)) return;
    const sections = [...doc.querySelectorAll('main > section, main > article')];
    if (!sections.length) return;

    const seen = new WeakSet();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        seen.add(entry.target);
        observer.unobserve(entry.target);
        const section = entry.target;
        const heading = section.querySelector('h1,h2');
        const media = section.querySelector('figure, [class*="visual"], [class*="media"]');
        const cards = [...section.querySelectorAll('[class*="grid"] > article, [class*="grid"] > a, [class*="grid"] > button, .faq-item')].slice(0, 8);

        if (heading) heading.animate(
          [{ opacity: .15, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 330, easing: 'cubic-bezier(.2,.7,.2,1)' }
        );
        if (media && media !== heading) media.animate(
          [{ opacity: .2, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 360, delay: 35, easing: 'cubic-bezier(.2,.7,.2,1)' }
        );
        cards.forEach((card, index) => card.animate(
          [{ opacity: .18, transform: 'translateY(9px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 300, delay: 45 + index * 42, easing: 'cubic-bezier(.2,.7,.2,1)' }
        ));
      });
    }, { threshold: .12, rootMargin: '0px 0px -7% 0px' });

    sections.forEach((section) => observer.observe(section));
  }

  /* 3 — Smart internal prefetch */
  function initPrefetch() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '')) return;
    const prefetched = new Set();

    const prefetch = (anchor) => {
      const url = resolvedInternalLink(anchor);
      if (!url || url.pathname === location.pathname || prefetched.has(url.href)) return;
      prefetched.add(url.href);
      const link = doc.createElement('link');
      link.rel = 'prefetch';
      link.href = url.href;
      link.as = 'document';
      doc.head.appendChild(link);
    };

    doc.addEventListener('pointerenter', (event) => {
      const anchor = event.target.closest?.('a[href]');
      if (anchor) prefetch(anchor);
    }, true);
    doc.addEventListener('focusin', (event) => {
      const anchor = event.target.closest?.('a[href]');
      if (anchor) prefetch(anchor);
    });
    doc.addEventListener('touchstart', (event) => {
      const anchor = event.target.closest?.('a[href]');
      if (anchor) prefetch(anchor);
    }, { passive: true });
  }

  /* 4 — Form UX engine */
  function initFormUX() {
    doc.querySelectorAll('form[data-target-form]').forEach((form) => {
      if (form.dataset.targetInteractionForm === '1') return;
      form.dataset.targetInteractionForm = '1';

      const submit = form.querySelector('button[type="submit"]');
      const submitLabel = submit?.querySelector('span');
      const summary = form.querySelector('[data-validation-summary]');
      const success = form.querySelector('[data-form-success]');
      const fields = [...form.querySelectorAll('input,select,textarea')].filter((field) => !['hidden','submit','button'].includes(field.type));

      fields.forEach((field) => {
        if (field.type === 'email') field.setAttribute('inputmode', 'email');
        if (field.type === 'tel') field.setAttribute('inputmode', 'tel');
      });

      function fieldMessage(field) {
        if (field.validity.valueMissing) return text('هذا الحقل مطلوب.', 'This field is required.');
        if (field.validity.typeMismatch) return text('يرجى إدخال بريد إلكتروني صحيح.', 'Enter a valid email address.');
        if (field.validity.tooShort) return text('يرجى إضافة تفاصيل أكثر.', 'Please add a little more detail.');
        if (field.validity.patternMismatch) return text('يرجى مراجعة صيغة هذا الحقل.', 'Please check this field format.');
        return text('يرجى مراجعة هذا الحقل.', 'Please review this field.');
      }

      function validate(field) {
        const valid = field.type === 'checkbox' ? (!field.required || field.checked) : field.checkValidity();
        field.setAttribute('aria-invalid', valid ? 'false' : 'true');
        if (field.type !== 'checkbox') field.classList.toggle('is-invalid', !valid);

        const wrapper = field.type === 'checkbox' ? (field.closest('.privacy-check') || field.parentElement) : null;
        let error = field.type === 'checkbox' ? wrapper?.querySelector('.invalid-feedback') : doc.getElementById(`${field.id}-error`);
        if (!error) {
          error = doc.createElement('div');
          error.className = field.type === 'checkbox' ? 'invalid-feedback d-block w-100' : 'invalid-feedback';
          if (field.id) error.id = `${field.id}-error`;
          if (field.type === 'checkbox') wrapper?.appendChild(error); else field.insertAdjacentElement('afterend', error);
        }
        if (error) error.textContent = valid ? '' : fieldMessage(field);
        if (!valid && error?.id) field.setAttribute('aria-describedby', error.id);
        return valid;
      }

      form.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (form.dataset.submitting === '1') return;

        let firstInvalid = null;
        fields.forEach((field) => { if (!validate(field) && !firstInvalid) firstInvalid = field; });
        if (firstInvalid) {
          summary?.classList.add('is-visible');
          success?.classList.remove('is-visible');
          firstInvalid.focus({ preventScroll: true });
          scrollToTarget(firstInvalid.closest('.ct-field,.fs-field,.privacy-check') || firstInvalid, false);
          return;
        }

        summary?.classList.remove('is-visible');
        success?.classList.remove('is-visible');
        form.dataset.submitting = '1';
        if (submit) { submit.disabled = true; submit.setAttribute('aria-busy', 'true'); }
        if (submitLabel) submitLabel.textContent = text('جارٍ الإرسال…', 'Sending…');

        window.setTimeout(() => {
          success?.classList.add('is-visible');
          success?.focus({ preventScroll: true });
          if (submitLabel) submitLabel.textContent = text('تم الإرسال', 'Submitted');
          if (success) scrollToTarget(success, false);

          window.setTimeout(() => {
            form.dataset.submitting = '0';
            if (submit) { submit.disabled = false; submit.removeAttribute('aria-busy'); }
            if (submitLabel) submitLabel.textContent = isAr() ? (submitLabel.dataset.ar || 'إرسال') : (submitLabel.dataset.en || 'Submit');
          }, 1250);
        }, 320);
      }, true);
    });
  }

  /* 5 — Navigation & mobile-menu intelligence */
  function initNavigation() {
    const current = new URL(location.href);
    doc.querySelectorAll('.site-header a[href], .premium-mobile-nav a[href]').forEach((anchor) => {
      let url;
      try { url = new URL(anchor.href, current); } catch (_) { return; }
      if (url.origin === current.origin && url.pathname.replace(/\/$/, '') === current.pathname.replace(/\/$/, '')) {
        anchor.setAttribute('aria-current', 'page');
      }
    });

    doc.addEventListener('click', (event) => {
      const anchor = event.target.closest('a[href*="#"]');
      if (!anchor) return;
      let url;
      try { url = new URL(anchor.href, location.href); } catch (_) { return; }
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
      const target = doc.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      history.pushState(null, '', url.hash);
      const offcanvasElement = anchor.closest('.offcanvas');
      if (offcanvasElement && window.bootstrap?.Offcanvas) window.bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement).hide();
      scrollToTarget(target, true);
    });

    doc.querySelectorAll('.premium-mobile-nav a[href]').forEach((anchor) => {
      anchor.addEventListener('click', () => {
        const offcanvasElement = anchor.closest('.offcanvas');
        if (offcanvasElement && window.bootstrap?.Offcanvas) window.bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement).hide();
      });
    });
  }

  /* 6 — Company selection transition */
  function initCompanyTransition() {
    doc.addEventListener('click', (event) => {
      const tile = event.target.closest('.company-tile');
      if (!tile) return;
      const currentDetail = doc.querySelector('.portfolio-detail');
      if (currentDetail && !reducedMotion()) currentDetail.animate(
        [{ opacity: 1, transform: 'translateY(0)' }, { opacity: .55, transform: 'translateY(4px)' }],
        { duration: 105, easing: 'ease-out' }
      );

      requestAnimationFrame(() => requestAnimationFrame(() => {
        const detail = doc.querySelector('.portfolio-detail');
        if (!detail) return;
        if (!reducedMotion()) detail.animate(
          [{ opacity: .52, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 230, easing: 'cubic-bezier(.2,.7,.2,1)' }
        );
        if (window.matchMedia('(max-width: 767.98px)').matches) {
          window.setTimeout(() => scrollToTarget(detail, false), reducedMotion() ? 0 : 120);
        }
      }));
    });
  }

  /* 7 — FAQ deep links + accordion intelligence */
  function initFAQ() {
    const items = [...doc.querySelectorAll('details.faq-item')];
    if (!items.length) return;

    const syncAria = (details) => details.querySelector('summary')?.setAttribute('aria-expanded', details.open ? 'true' : 'false');
    const closePeers = (details) => {
      const list = details.closest('.faq-list') || details.parentElement;
      list?.querySelectorAll('details.faq-item[open]').forEach((peer) => {
        if (peer !== details) { peer.open = false; syncAria(peer); }
      });
    };
    const openHash = (focus = true) => {
      if (!location.hash) return false;
      const details = doc.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (!details?.matches('details.faq-item')) return false;
      closePeers(details);
      details.open = true;
      syncAria(details);
      scrollToTarget(details, focus);
      return true;
    };

    items.forEach((details) => {
      const summary = details.querySelector('summary');
      syncAria(details);
      summary?.addEventListener('pointerdown', () => { details.dataset.userToggle = '1'; });
      summary?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') details.dataset.userToggle = '1';
      });
      details.addEventListener('toggle', () => {
        syncAria(details);
        if (!details.open) { delete details.dataset.userToggle; return; }
        closePeers(details);
        if (details.dataset.userToggle === '1' && details.id && location.hash !== `#${details.id}`) {
          history.pushState({ faq: details.id }, '', `#${details.id}`);
        }
        delete details.dataset.userToggle;
      });
    });

    window.addEventListener('popstate', () => { if (location.hash) openHash(false); });
    window.addEventListener('hashchange', () => { if (location.hash) openHash(false); });
    window.setTimeout(() => openHash(false), 40);
  }

  /* 8 — Smart WhatsApp visibility */
  function initWhatsAppVisibility() {
    const whatsapp = doc.querySelector('.quick-whatsapp');
    if (!whatsapp) return;
    let footerVisible = false;
    let visible = true;

    const setVisible = (next) => {
      if (visible === next) return;
      visible = next;
      whatsapp.style.pointerEvents = next ? '' : 'none';
      whatsapp.style.visibility = next ? 'visible' : 'hidden';
      if (reducedMotion()) {
        whatsapp.style.opacity = next ? '1' : '0';
        whatsapp.style.transform = next ? '' : 'translateY(8px)';
        return;
      }
      whatsapp.animate(
        next
          ? [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }]
          : [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(10px)' }],
        { duration: next ? 190 : 150, easing: 'ease-out', fill: 'forwards' }
      );
    };

    const evaluate = () => {
      const maxScroll = Math.max(1, doc.documentElement.scrollHeight - innerHeight);
      const progress = scrollY / maxScroll;
      const engaged = progress >= .18 || scrollY >= innerHeight * .34;
      setVisible(engaged && !footerVisible);
    };

    visible = true;
    setVisible(false);
    window.addEventListener('scroll', evaluate, { passive: true });
    window.addEventListener('resize', evaluate, { passive: true });

    const footer = doc.querySelector('.site-footer');
    if (footer && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        footerVisible = entries.some((entry) => entry.isIntersecting);
        evaluate();
      }, { threshold: .03 });
      observer.observe(footer);
    }
    evaluate();
  }

  function init() {
    safeModule('navigation', initNavigation);
    safeModule('page transitions', initPageTransitions);
    safeModule('scroll reveal', initScrollReveal);
    safeModule('prefetch', initPrefetch);
    safeModule('forms', initFormUX);
    safeModule('company transition', initCompanyTransition);
    safeModule('FAQ', initFAQ);
    safeModule('WhatsApp', initWhatsAppVisibility);
    root.dataset.targetInteractions = 'v1';
  }

  onReady(init);
})();
