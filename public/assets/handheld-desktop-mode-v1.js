/* TARGET — Handheld Desktop-Request Detection V1 | 2026-08-17
 * Detects the Android/iOS 'Desktop site' hybrid: a small touch device exposing
 * a wide layout viewport. Adds one root class only; no viewport rewriting.
 */
(function(){
  'use strict';
  const root=document.documentElement;
  function sync(){
    const touch=(navigator.maxTouchPoints||0)>0 || (window.matchMedia&&matchMedia('(pointer:coarse)').matches);
    const shortSide=Math.min(screen.width||9999,screen.height||9999);
    const wideLayout=window.innerWidth>=760 && window.innerWidth<=1180;
    root.classList.toggle('handheld-desktop-mode',Boolean(touch && shortSide<=620 && wideLayout));
  }
  sync();
  window.addEventListener('resize',sync,{passive:true});
  window.addEventListener('orientationchange',sync,{passive:true});
})();
