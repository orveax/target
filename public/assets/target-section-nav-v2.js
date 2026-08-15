/* TARGET — Smart Section Navigation V2
 * Under-header journey strip inspired by the approved Abshertam navigation pattern.
 * Runtime override only: preserves page source structure and locked CSS baseline.
 */
(() => {
  'use strict';

  if (window.__TARGET_SECTION_NAV_V2__) return;
  window.__TARGET_SECTION_NAV_V2__ = true;

  const doc = document;
  const root = doc.documentElement;
  const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

  function injectStyles() {
    if (doc.getElementById('target-section-nav-v2-styles')) return;
    const style = doc.createElement('style');
    style.id = 'target-section-nav-v2-styles';
    style.textContent = `
      .target-section-nav.target-section-nav--under-header{
        position:sticky!important;
        z-index:1029!important;
        top:var(--target-section-nav-top,0px)!important;
        right:auto!important;
        bottom:auto!important;
        left:auto!important;
        inset-inline:auto!important;
        width:100%!important;
        max-width:none!important;
        transform:none!important;
        display:block!important;
        padding:0!important;
        margin:0!important;
        border:0!important;
        border-bottom:1px solid rgba(12,73,49,.10)!important;
        border-radius:0!important;
        background:rgba(255,254,251,.965)!important;
        box-shadow:0 8px 22px rgba(38,38,38,.045)!important;
        backdrop-filter:blur(14px)!important;
        -webkit-backdrop-filter:blur(14px)!important;
        overflow:hidden!important;
      }
      .target-section-nav-track{
        width:min(1200px,calc(100% - 36px));
        margin-inline:auto;
        display:flex;
        align-items:stretch;
        justify-content:center;
        gap:2px;
        overflow-x:auto;
        overflow-y:hidden;
        scrollbar-width:none;
        overscroll-behavior-inline:contain;
        scroll-behavior:smooth;
      }
      .target-section-nav-track::-webkit-scrollbar{display:none}
      .target-section-nav.target-section-nav--under-header button{
        position:relative!important;
        flex:0 0 auto!important;
        display:inline-flex!important;
        align-items:center!important;
        justify-content:center!important;
        gap:7px!important;
        min-height:48px!important;
        max-width:none!important;
        padding:0 14px!important;
        border:0!important;
        border-radius:0!important;
        background:transparent!important;
        color:#686E69!important;
        box-shadow:none!important;
        font:700 .78rem/1.3 Tajawal,Manrope,sans-serif!important;
        text-align:center!important;
        white-space:nowrap!important;
        cursor:pointer!important;
        transform:none!important;
        transition:color .18s ease,background .18s ease!important;
      }
      .target-section-nav.target-section-nav--under-header button::before{
        content:attr(data-index)!important;
        display:inline!important;
        flex:0 0 auto!important;
        width:auto!important;
        height:auto!important;
        margin:0!important;
        padding:0!important;
        border:0!important;
        border-radius:0!important;
        background:transparent!important;
        color:#B88943!important;
        font:800 .61rem/1 Manrope,sans-serif!important;
      }
      .target-section-nav.target-section-nav--under-header button::after{
        content:"";
        position:absolute;
        right:12px;
        bottom:0;
        left:12px;
        height:2px;
        border-radius:99px 99px 0 0;
        background:#C09552;
        transform:scaleX(0);
        transform-origin:center;
        transition:transform .2s ease;
      }
      .target-section-nav.target-section-nav--under-header button:hover,
      .target-section-nav.target-section-nav--under-header button:focus-visible{
        background:rgba(12,73,49,.035)!important;
        color:#0C4931!important;
        outline:none!important;
      }
      .target-section-nav.target-section-nav--under-header button:focus-visible{
        box-shadow:inset 0 0 0 2px rgba(192,149,82,.35)!important;
      }
      .target-section-nav.target-section-nav--under-header button[aria-current="true"]{
        background:rgba(12,73,49,.045)!important;
        color:#0C4931!important;
      }
      .target-section-nav.target-section-nav--under-header button[aria-current="true"]::before{
        background:transparent!important;
        color:#C09552!important;
      }
      .target-section-nav.target-section-nav--under-header button[aria-current="true"]::after{transform:scaleX(1)}
      .target-section-nav.target-section-nav--under-header .target-section-nav-label{
        display:block!important;
        max-width:210px!important;
        overflow:hidden!important;
        text-overflow:ellipsis!important;
        white-space:nowrap!important;
      }
      @media(max-width:1199.98px){
        .target-section-nav-track{justify-content:flex-start;width:calc(100% - 24px)}
        .target-section-nav.target-section-nav--under-header button{min-height:46px!important;padding-inline:13px!important}
        .target-section-nav.target-section-nav--under-header .target-section-nav-label{display:block!important;max-width:180px!important}
      }
      @media(max-width:767.98px){
        .target-section-nav.target-section-nav--under-header{
          top:var(--target-section-nav-top,0px)!important;
          right:auto!important;
          bottom:auto!important;
          left:auto!important;
          inset-inline:auto!important;
          transform:none!important;
          max-width:none!important;
          overflow:hidden!important;
        }
        .target-section-nav-track{
          width:100%;
          padding-inline:10px;
          scroll-snap-type:x proximity;
        }
        .target-section-nav.target-section-nav--under-header button{
          min-height:44px!important;
          padding-inline:12px!important;
          font-size:.74rem!important;
          scroll-snap-align:center;
        }
        .target-section-nav.target-section-nav--under-header button::before{font-size:.58rem!important}
        .target-section-nav.target-section-nav--under-header .target-section-nav-label{max-width:168px!important}
      }
      @media(prefers-reduced-motion:reduce){
        .target-section-nav-track{scroll-behavior:auto!important}
        .target-section-nav.target-section-nav--under-header button,
        .target-section-nav.target-section-nav--under-header button::after{transition:none!important}
      }
    `;
    doc.head.appendChild(style);
  }

  function headerStickyOffset(header) {
    if (!header) return 0;
    const position = getComputedStyle(header).position;
    return /^(sticky|fixed)$/.test(position) ? Math.ceil(header.getBoundingClientRect().height) : 0;
  }

  function centerActiveButton(nav) {
    const track = nav.querySelector('.target-section-nav-track');
    const active = track?.querySelector('button[aria-current="true"]');
    if (!track || !active) return;
    const left = active.offsetLeft - ((track.clientWidth - active.offsetWidth) / 2);
    track.scrollTo({ left: Math.max(0, left), behavior: reducedMotion() ? 'auto' : 'smooth' });
  }

  function upgrade(nav) {
    if (!nav || nav.dataset.sectionNavV2 === '1') return;
    nav.dataset.sectionNavV2 = '1';
    nav.classList.add('target-section-nav--under-header');

    const header = doc.querySelector('.site-header');
    const track = doc.createElement('div');
    track.className = 'target-section-nav-track';
    track.setAttribute('role', 'presentation');
    [...nav.children].forEach((child) => track.appendChild(child));
    nav.appendChild(track);

    if (header) header.insertAdjacentElement('afterend', nav);

    const syncOffset = () => nav.style.setProperty('--target-section-nav-top', `${headerStickyOffset(header)}px`);
    syncOffset();
    window.addEventListener('resize', syncOffset, { passive: true });
    window.addEventListener('orientationchange', syncOffset, { passive: true });

    const activeObserver = new MutationObserver((mutations) => {
      if (mutations.some((m) => m.type === 'attributes' && m.attributeName === 'aria-current')) {
        window.requestAnimationFrame(() => centerActiveButton(nav));
      }
    });
    track.querySelectorAll('button').forEach((button) => activeObserver.observe(button, { attributes: true, attributeFilter: ['aria-current'] }));

    window.requestAnimationFrame(() => centerActiveButton(nav));
  }

  function init() {
    injectStyles();
    const existing = doc.querySelector('.target-section-nav');
    if (existing) {
      upgrade(existing);
      return;
    }

    const observer = new MutationObserver(() => {
      const nav = doc.querySelector('.target-section-nav');
      if (!nav) return;
      observer.disconnect();
      upgrade(nav);
    });
    observer.observe(doc.body, { childList: true, subtree: true });
  }

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
