/* TARGET — Mobile Navigation Polish V1 runtime
 * Controls only the bottom scroll affordance for the mobile offcanvas.
 */
(() => {
  'use strict';
  if (window.__TARGET_MOBILE_NAV_POLISH_V1__) return;
  window.__TARGET_MOBILE_NAV_POLISH_V1__ = true;

  const doc = document;
  const nav = doc.getElementById('mobileNav');
  if (!nav) return;

  const scroller = nav.querySelector('[data-mobile-nav-scroll]');
  const cue = nav.querySelector('.premium-mobile-scroll-cue');
  if (!scroller || !cue) return;

  let ticking = false;

  function updateCue() {
    ticking = false;
    const overflow = scroller.scrollHeight > scroller.clientHeight + 4;
    const remaining = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
    cue.classList.toggle('is-visible', overflow && remaining > 10);
  }

  function queueUpdate() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateCue);
  }

  scroller.addEventListener('scroll', queueUpdate, { passive: true });
  window.addEventListener('resize', queueUpdate, { passive: true });
  window.addEventListener('orientationchange', queueUpdate, { passive: true });
  nav.addEventListener('show.bs.offcanvas', queueUpdate);
  nav.addEventListener('shown.bs.offcanvas', queueUpdate);
  nav.addEventListener('hidden.bs.offcanvas', () => cue.classList.remove('is-visible'));

  if ('ResizeObserver' in window) {
    const resizeObserver = new ResizeObserver(queueUpdate);
    resizeObserver.observe(scroller);
  }

  const langObserver = new MutationObserver(queueUpdate);
  langObserver.observe(doc.documentElement, { attributes: true, attributeFilter: ['dir', 'lang'] });

  window.requestAnimationFrame(updateCue);
})();
