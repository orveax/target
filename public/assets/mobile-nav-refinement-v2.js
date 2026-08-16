/* TARGET — Mobile Navigation Refinement V2 runtime
   Post-baseline refinement — 2026-08-16
   Scope: stylesheet loader, scroll cue visibility + direction sync.
*/
(function(){
  'use strict';

  const ensureStyles = () => {
    if (document.querySelector('link[data-target-mobile-nav-v2]')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/assets/mobile-nav-refinement-v2.css?v=20260816-01';
    link.dataset.targetMobileNavV2 = 'true';
    document.head.appendChild(link);
  };

  const init = () => {
    ensureStyles();

    const drawer = document.querySelector('.premium-mobile-nav');
    const scroller = drawer?.querySelector('[data-mobile-nav-scroll]');
    const cue = drawer?.querySelector('.premium-mobile-scroll-cue');
    if (!drawer || !scroller || !cue) return;

    const syncDirection = () => {
      const rtl = document.documentElement.dir === 'rtl';
      drawer.dataset.drawerDirection = rtl ? 'rtl' : 'ltr';
    };

    const syncCue = () => {
      const remaining = scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop;
      const canScroll = scroller.scrollHeight > scroller.clientHeight + 8;
      cue.classList.toggle('is-visible', canScroll && remaining > 24);
    };

    let raf = 0;
    const scheduleCue = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        syncCue();
      });
    };

    scroller.addEventListener('scroll', scheduleCue, {passive:true});
    window.addEventListener('resize', scheduleCue, {passive:true});
    drawer.addEventListener('shown.bs.offcanvas', () => {
      syncDirection();
      requestAnimationFrame(syncCue);
    });

    const observer = new MutationObserver((mutations) => {
      if (mutations.some((m) => m.attributeName === 'dir' || m.attributeName === 'lang')) {
        syncDirection();
        scheduleCue();
      }
    });
    observer.observe(document.documentElement, {attributes:true, attributeFilter:['dir','lang']});

    syncDirection();
    syncCue();
  };

  ensureStyles();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
