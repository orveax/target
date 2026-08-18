/* TARGET — Interaction Enhancement Layer V1
 * Progressive runtime behavior only.
 * Form delivery/validation is intentionally owned by form-delivery-v1.js + premium-v6.js.
 */
(() => {
  'use strict';

  if (window.__TARGET_INTERACTIONS_V1__) return;
  window.__TARGET_INTERACTIONS_V1__ = true;

  const doc = document;
  const root = doc.documentElement;
  const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
  const headerOffset = () => (doc.querySelector('.site-header')?.getBoundingClientRect().height || 76) + 18;
  const onReady = (fn) => doc.readyState === 'loading'
    ? doc.addEventListener('DOMContentLoaded', fn, { once: true })
    : fn();

  function safeModule(name, fn) {
    try {
      fn();
    } catch (error) {
      console.warn(`[TARGET interactions] ${name} skipped`, error);
    }
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
    try {
      url = new URL(anchor.href, location.href);
    } catch {
      return null;
    }

    if (url.origin !== location.origin) return null;
    if (/\.(pdf|zip|jpg|jpeg|png|webp|svg|avif)$/i.test(url.pathname)) return null;
    return url;
  }

  function scrollToTarget(target, focus = true) {
    if (!target) return;
    const top = Math.max(0, window.scrollY + target.getBoundingClientRect().top - headerOffset());
    window.scrollTo({ top, behavior: reducedMotion() ? 'auto' : 'smooth' });

    if (!focus) return;
    window.setTimeout(() => {
      const focusTarget = target.matches('details') ? target.querySelector('summary') : target;
      if (!focusTarget) return;
      if (!focusTarget.hasAttribute('tabindex') && !focusTarget.matches('a,button,input,select,textarea,summary')) {
        focusTarget.setAttribute('tabindex', '-1');
      }
      focusTarget.focus?.({ preventScroll: true });
    }, reducedMotion() ? 0 : 380);
  }

  function initPageTransitions() {
    const main = doc.querySelector('main');
    if (!main || reducedMotion()) return;

    main.animate(
      [{ opacity: 0.72, transform: 'translateY(7px)' }, { opacity: 1, transform: 'translateY(0)' }],
      { duration: 230, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'both' },
    );

    let navigating = false;
    doc.addEventListener('click', (event) => {
      if (navigating || !isPlainLeftClick(event)) return;
      const anchor = event.target.closest('a[href]');
      const url = resolvedInternalLink(anchor);
      if (!url || (url.pathname === location.pathname && url.search === location.search)) return;

      event.preventDefault();
      navigating = true;
      const animation = main.animate(
        [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0.18, transform: 'translateY(-6px)' }],
        { duration: 135, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' },
      );
      animation.finished.catch(() => undefined).finally(() => location.assign(url.href));
      window.setTimeout(() => {
        if (navigating) location.assign(url.href);
      }, 220);
    });

    window.addEventListener('pageshow', (event) => {
      if (!event.persisted) return;
      navigating = false;
      main.getAnimations().forEach((animation) => animation.cancel());
      main.animate([{ opacity: 0.82 }, { opacity: 1 }], { duration: 160, easing: 'ease-out' });
    });
  }

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

        heading?.animate(
          [{ opacity: 0.15, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 330, easing: 'cubic-bezier(.2,.7,.2,1)' },
        );
        if (media && media !== heading) {
          media.animate(
            [{ opacity: 0.2, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration: 360, delay: 35, easing: 'cubic-bezier(.2,.7,.2,1)' },
          );
        }
        cards.forEach((card, index) => card.animate(
          [{ opacity: 0.18, transform: 'translateY(9px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 300, delay: 45 + index * 42, easing: 'cubic-bezier(.2,.7,.2,1)' },
        ));
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

    sections.forEach((section) => observer.observe(section));
  }

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

  function initNavigation() {
    const current = new URL(location.href);
    doc.querySelectorAll('.site-header a[href], .premium-mobile-nav a[href]').forEach((anchor) => {
      let url;
      try {
        url = new URL(anchor.href, current);
      } catch {
        return;
      }
      if (url.origin === current.origin && url.pathname.replace(/\/$/, '') === current.pathname.replace(/\/$/, '')) {
        anchor.setAttribute('aria-current', 'page');
      }
    });

    doc.addEventListener('click', (event) => {
      const anchor = event.target.closest('a[href*="#"]');
      if (!anchor) return;

      let url;
      try {
        url = new URL(anchor.href, location.href);
      } catch {
        return;
      }
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;

      const target = doc.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      history.pushState(null, '', url.hash);

      const offcanvasElement = anchor.closest('.offcanvas');
      if (offcanvasElement && window.bootstrap?.Offcanvas) {
        window.bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement).hide();
      }
      scrollToTarget(target, true);
    });

    doc.querySelectorAll('.premium-mobile-nav a[href]').forEach((anchor) => {
      anchor.addEventListener('click', () => {
        const offcanvasElement = anchor.closest('.offcanvas');
        if (offcanvasElement && window.bootstrap?.Offcanvas) {
          window.bootstrap.Offcanvas.getOrCreateInstance(offcanvasElement).hide();
        }
      });
    });
  }

  function initCompanyTransition() {
    doc.addEventListener('click', (event) => {
      const tile = event.target.closest('.company-tile');
      if (!tile) return;

      const currentDetail = doc.querySelector('.portfolio-detail');
      if (currentDetail && !reducedMotion()) {
        currentDetail.animate(
          [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0.55, transform: 'translateY(4px)' }],
          { duration: 105, easing: 'ease-out' },
        );
      }

      requestAnimationFrame(() => requestAnimationFrame(() => {
        const detail = doc.querySelector('.portfolio-detail');
        if (!detail) return;
        if (!reducedMotion()) {
          detail.animate(
            [{ opacity: 0.52, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }],
            { duration: 230, easing: 'cubic-bezier(.2,.7,.2,1)' },
          );
        }
        if (window.matchMedia('(max-width: 767.98px)').matches) {
          window.setTimeout(() => scrollToTarget(detail, false), reducedMotion() ? 0 : 120);
        }
      }));
    });
  }

  function initFAQ() {
    const items = [...doc.querySelectorAll('details.faq-item')];
    if (!items.length) return;

    const syncAria = (details) => details.querySelector('summary')?.setAttribute('aria-expanded', details.open ? 'true' : 'false');
    const closePeers = (details) => {
      const list = details.closest('.faq-list') || details.parentElement;
      list?.querySelectorAll('details.faq-item[open]').forEach((peer) => {
        if (peer === details) return;
        peer.open = false;
        syncAria(peer);
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
      summary?.addEventListener('pointerdown', () => {
        details.dataset.userToggle = '1';
      });
      summary?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') details.dataset.userToggle = '1';
      });
      details.addEventListener('toggle', () => {
        syncAria(details);
        if (!details.open) {
          delete details.dataset.userToggle;
          return;
        }
        closePeers(details);
        if (details.dataset.userToggle === '1' && details.id && location.hash !== `#${details.id}`) {
          history.pushState({ faq: details.id }, '', `#${details.id}`);
        }
        delete details.dataset.userToggle;
      });
    });

    window.addEventListener('popstate', () => {
      if (location.hash) openHash(false);
    });
    window.addEventListener('hashchange', () => {
      if (location.hash) openHash(false);
    });
    window.setTimeout(() => openHash(false), 40);
  }

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
        { duration: next ? 190 : 150, easing: 'ease-out', fill: 'forwards' },
      );
    };

    const evaluate = () => {
      const maxScroll = Math.max(1, doc.documentElement.scrollHeight - innerHeight);
      const progress = scrollY / maxScroll;
      const engaged = progress >= 0.18 || scrollY >= innerHeight * 0.34;
      setVisible(engaged && !footerVisible);
    };

    setVisible(false);
    window.addEventListener('scroll', evaluate, { passive: true });
    window.addEventListener('resize', evaluate, { passive: true });

    const footer = doc.querySelector('.target-footer-v6, .site-footer, footer');
    if (footer && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        footerVisible = entries.some((entry) => entry.isIntersecting);
        evaluate();
      }, { threshold: 0.03 });
      observer.observe(footer);
    }
    evaluate();
  }

  function init() {
    safeModule('navigation', initNavigation);
    safeModule('page transitions', initPageTransitions);
    safeModule('scroll reveal', initScrollReveal);
    safeModule('prefetch', initPrefetch);
    safeModule('company transition', initCompanyTransition);
    safeModule('FAQ', initFAQ);
    safeModule('WhatsApp', initWhatsAppVisibility);
    root.dataset.targetInteractions = 'v1';
  }

  onReady(init);
})();
