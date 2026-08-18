/* TARGET — Premium Header V2 runtime | 2026-08-19
 * Accessible desktop mega-menu state + navigation micro-alignment.
 * Mobile/tablet navigation remains Bootstrap offcanvas.
 */
(() => {
  'use strict';
  if (window.__TARGET_HEADER_V2__) return;
  window.__TARGET_HEADER_V2__ = true;

  /* Keep the offcanvas close glyph optically centered on tablet/iPad as well as handset.
   * The button geometry is owned by CSS; this only normalizes the Lucide SVG itself.
   */
  const normalizeCloseGlyph = () => {
    const button = document.querySelector('.th2-mobile-close');
    if (!button) return;

    const icon = button.querySelector('svg, [data-lucide="x"]');
    if (!icon) return;

    icon.setAttribute('width', '20');
    icon.setAttribute('height', '20');
    icon.setAttribute('stroke-width', '1.8');
    icon.style.display = 'block';
    icon.style.margin = '0';
    icon.style.padding = '0';
    icon.style.transform = 'none';
    icon.style.flex = '0 0 auto';
    button.style.lineHeight = '0';
  };

  window.requestAnimationFrame(() => window.requestAnimationFrame(normalizeCloseGlyph));
  window.addEventListener('load', normalizeCloseGlyph, { once: true });

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
