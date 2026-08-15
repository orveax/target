/* T5 — do not expose an unverified WhatsApp destination */
document.addEventListener('DOMContentLoaded',()=>{
  const quick=document.querySelector('.quick-whatsapp');
  if(!quick)return;
  quick.removeAttribute('target');
  quick.removeAttribute('rel');
  quick.setAttribute('href','#');
  quick.setAttribute('aria-disabled','true');
  quick.classList.add('is-pending');
  quick.addEventListener('click',(event)=>event.preventDefault());
});
