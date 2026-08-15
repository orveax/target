/* TARGET — verified WhatsApp contact activation */
document.addEventListener('DOMContentLoaded',()=>{
  const quick=document.querySelector('.quick-whatsapp');
  if(!quick)return;
  quick.setAttribute('href','https://wa.me/97477910919');
  quick.setAttribute('target','_blank');
  quick.setAttribute('rel','noopener noreferrer');
  quick.removeAttribute('aria-disabled');
  quick.classList.remove('is-pending');
});
