/* TARGET — Premium Header V2 runtime | 2026-08-19
 * Accessible desktop mega-menu state only.
 * Mobile/tablet navigation remains Bootstrap offcanvas; close-control geometry is CSS-owned.
 */
(() => {
  'use strict';
  if (window.__TARGET_HEADER_V2__) return;
  window.__TARGET_HEADER_V2__ = true;

  const root = document.querySelector('[data-th2-mega]');
  if (!root) return;
  const toggle = root.querySelector('[data-th2-mega-toggle]');
  const panel = root.querySelector('[data-th2-mega-panel]');
  if (!toggle || !panel) return;

  const open = () => {
    root.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
  };
  const close = () => {
    root.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', (event) => {
    event.preventDefault();
    root.classList.contains('is-open') ? close() : open();
  });

  document.addEventListener('pointerdown', (event) => {
    if (!root.contains(event.target)) close();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape' || !root.classList.contains('is-open')) return;
    close();
    toggle.focus();
  });

  root.addEventListener('focusout', () => {
    window.requestAnimationFrame(() => {
      if (!root.contains(document.activeElement)) close();
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth < 1200) close();
  }, { passive: true });
})();
