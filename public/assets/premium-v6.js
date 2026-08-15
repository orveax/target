/* TARGET — Premium Corporate v6 interactions */
(function(){
  'use strict';
  const root=document.documentElement;

  /* Production visual hotfix is injected centrally so every preserved legacy page receives the same image correction without duplicating markup changes. */
  const hotfix=document.createElement('link');
  hotfix.rel='stylesheet';
  hotfix.href='/assets/production-hotfix.css?v=20260815-01';
  document.head.appendChild(hotfix);

  function isArabic(){return root.lang!=='en'}
  function applyLanguage(lang){
    const ar=lang!=='en';root.lang=ar?'ar':'en';root.dir=ar?'rtl':'ltr';
    document.querySelectorAll('[data-ar][data-en]').forEach((node)=>{const value=ar?node.dataset.ar:node.dataset.en;if(node.matches('input,textarea')) node.placeholder=value;else node.textContent=value;});
    document.querySelectorAll('[data-lang-toggle]').forEach((button)=>{button.textContent=ar?'EN':'AR';button.setAttribute('aria-label',ar?'Switch to English':'التبديل إلى العربية');});
    document.querySelectorAll('[data-ar-placeholder][data-en-placeholder]').forEach((node)=>{node.placeholder=ar?node.dataset.arPlaceholder:node.dataset.enPlaceholder;});
    try{localStorage.setItem('target-language',ar?'ar':'en')}catch(_){ } requestAnimationFrame(initIcons);
  }
  function initIcons(){if(window.lucide&&typeof window.lucide.createIcons==='function'){window.lucide.createIcons({attrs:{'aria-hidden':'true'}});}}
  function initLanguage(){let lang='ar';try{lang=localStorage.getItem('target-language')||'ar'}catch(_){ }applyLanguage(lang);document.querySelectorAll('[data-lang-toggle]').forEach((button)=>{button.addEventListener('click',()=>applyLanguage(isArabic()?'en':'ar'));});}
  function fieldMessage(field){const ar=isArabic();if(field.validity.valueMissing)return ar?'هذا الحقل مطلوب.':'This field is required.';if(field.validity.typeMismatch)return ar?'يرجى إدخال بريد إلكتروني صحيح.':'Enter a valid email address.';if(field.validity.tooShort)return ar?'يرجى إضافة تفاصيل أكثر.':'Please add a little more detail.';if(field.validity.patternMismatch)return ar?'يرجى مراجعة صيغة هذا الحقل.':'Please check this field format.';return ar?'يرجى مراجعة هذا الحقل.':'Please review this field.';}
  function errorNode(field){const id=field.id+'-error';let node=document.getElementById(id);if(!node){node=document.createElement('div');node.id=id;node.className='invalid-feedback';field.insertAdjacentElement('afterend',node);}field.setAttribute('aria-describedby',id);return node;}
  function validateField(field){if(field.type==='checkbox'){const valid=field.checked||!field.required;field.setAttribute('aria-invalid',valid?'false':'true');const wrapper=field.closest('.privacy-check')||field.parentElement;let message=wrapper.querySelector('.invalid-feedback');if(!message){message=document.createElement('div');message.className='invalid-feedback d-block w-100';wrapper.appendChild(message)}message.textContent=valid?'':fieldMessage(field);return valid;}const valid=field.checkValidity();field.classList.toggle('is-invalid',!valid);field.setAttribute('aria-invalid',valid?'false':'true');const node=errorNode(field);node.textContent=valid?'':fieldMessage(field);return valid;}
  function initForms(){document.querySelectorAll('[data-target-form]').forEach((form)=>{const summary=form.querySelector('[data-validation-summary]');const success=form.querySelector('[data-form-success]');const fields=[...form.querySelectorAll('input,select,textarea')].filter((f)=>f.type!=='hidden'&&f.type!=='submit');fields.forEach((field)=>{const event=field.tagName==='SELECT'||field.type==='checkbox'?'change':'blur';field.addEventListener(event,()=>validateField(field));if(field.type!=='checkbox')field.addEventListener('input',()=>{if(field.classList.contains('is-invalid'))validateField(field)});});form.addEventListener('submit',(event)=>{event.preventDefault();let firstInvalid=null;fields.forEach((field)=>{if(!validateField(field)&&!firstInvalid)firstInvalid=field});if(firstInvalid){summary?.classList.add('is-visible');success?.classList.remove('is-visible');firstInvalid.focus();return;}summary?.classList.remove('is-visible');success?.classList.add('is-visible');success?.focus();});});}
  function initDisabledSocial(){document.querySelectorAll('[data-social-pending]').forEach((item)=>{item.setAttribute('aria-disabled','true');item.addEventListener('click',(e)=>e.preventDefault());});}
  function setActiveNav(){const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();document.querySelectorAll('[data-nav-file]').forEach((link)=>{if((link.dataset.navFile||'').toLowerCase()===current){link.classList.add('active');link.setAttribute('aria-current','page');}});}
  function normalizeFooter(){
    document.querySelectorAll('.site-footer').forEach((footer)=>{
      footer.querySelectorAll('.footer-logo').forEach((logo)=>{logo.src='/assets/brand/target-logo-horizontal-cream.svg';});
      const contactBlock=[...footer.querySelectorAll('.footer-links')].find((block)=>block.querySelector('a[href^="mailto:"]'));
      if(contactBlock){contactBlock.innerHTML='<a href="mailto:info@targetft.com"><i class="bi bi-envelope"></i> info@targetft.com</a><span class="footer-contact-item"><i class="bi bi-geo-alt"></i> <span data-ar="الدوحة، قطر" data-en="Doha, Qatar">الدوحة، قطر</span></span><span class="footer-contact-item"><i class="bi bi-telephone"></i> +974 XX XXX XXX</span><a class="footer-whatsapp" href="#" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i><span data-ar="واتساب" data-en="WhatsApp">واتساب</span></a>';}
      const brand=footer.querySelector('.premium-footer-brand,.row > div:first-child');
      if(brand){let social=brand.querySelector('.footer-social');if(!social){social=document.createElement('div');social.className='footer-social';brand.appendChild(social);}social.innerHTML='<a class="social-mini" href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a><a class="social-mini" href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a><a class="social-mini" href="#" aria-label="TikTok"><i class="bi bi-tiktok"></i></a>';}
      const bottom=footer.querySelector('.footer-bottom');if(bottom){bottom.innerHTML='<span>targetft.com</span><span data-ar="جميع الحقوق محفوظة © TARGET 2026 — RFX" data-en="TARGET 2026 © All rights reserved — RFX">جميع الحقوق محفوظة © TARGET 2026 — RFX</span>';}
    });
  }
  function initMegaMenu(){
    const target=[...document.querySelectorAll('.site-header .navbar-nav .nav-link')].find((link)=>/capabilities\.html$/.test(link.getAttribute('href')||''));
    if(!target||target.closest('.mega-nav-item'))return;
    const item=target.closest('li')||target.parentElement;
    if(!item)return;
    item.classList.add('mega-nav-item');
    target.insertAdjacentHTML('afterend','<button class="mega-toggle" type="button" aria-expanded="false" aria-controls="target-mega-menu"><i data-lucide="chevron-down"></i><span class="visually-hidden">فتح قائمة الحلول</span></button><div class="target-mega-menu" id="target-mega-menu"><a href="capabilities.html"><i data-lucide="handshake"></i><span data-ar="حلولنا التجارية" data-en="Commercial Solutions">حلولنا التجارية</span><small data-ar="استيراد وتمثيل وشراكات" data-en="Import, representation & partnerships">استيراد وتمثيل وشراكات</small></a><a href="food-portfolio.html"><i data-lucide="package-open"></i><span data-ar="المنتجات والشركات" data-en="Products & Companies">المنتجات والشركات</span><small data-ar="فئات ومنتجات محل اهتمام" data-en="Categories and products in focus">فئات ومنتجات محل اهتمام</small></a><a href="company-profile.html"><i data-lucide="building-2"></i><span data-ar="ملف الشركة" data-en="Company Profile">ملف الشركة</span><small data-ar="نبذة وقدرات تارقت" data-en="Target overview and capabilities">نبذة وقدرات تارقت</small></a><a href="product-profile.html"><i data-lucide="book-open-check"></i><span data-ar="ملف المنتجات" data-en="Product Profile">ملف المنتجات</span><small data-ar="الفئات والمنتجات محل الاهتمام" data-en="Categories and products in focus">الفئات والمنتجات محل الاهتمام</small></a></div>');
    const toggle=item.querySelector('.mega-toggle');
    const close=()=>{item.classList.remove('is-mega-open');toggle.setAttribute('aria-expanded','false');};
    toggle.addEventListener('click',()=>{const open=item.classList.toggle('is-mega-open');toggle.setAttribute('aria-expanded',String(open));});
    document.addEventListener('click',(event)=>{if(!item.contains(event.target))close();});
    document.addEventListener('keydown',(event)=>{if(event.key==='Escape')close();});
  }
  function initHeaderAndUtilities(){
    document.querySelectorAll('.site-header .brand-logo,.mobile-brand-logo').forEach((logo)=>{logo.src='/assets/brand/target-logo-horizontal-cream.png';});
    document.querySelectorAll('.site-header .btn-premium').forEach((cta)=>{const label=cta.querySelector('[data-ar][data-en]');if(label){label.dataset.ar='ناقش فرصة تجارية';label.dataset.en='Discuss a Commercial Opportunity';label.textContent=isArabic()?'ناقش فرصة تجارية':'Discuss a Commercial Opportunity';}});
    if(!document.querySelector('.site-quick-actions')){document.body.insertAdjacentHTML('beforeend','<div class="site-quick-actions" aria-label="Quick actions"><a class="quick-whatsapp" href="https://wa.me/97400000000" target="_blank" rel="noopener" aria-label="WhatsApp"><i class="bi bi-whatsapp"></i><span data-ar="واتساب" data-en="WhatsApp">واتساب</span></a><button class="quick-top" type="button" aria-label="Go to top"><i class="bi bi-arrow-up"></i><span data-ar="أعلى" data-en="Top">أعلى</span></button></div>');document.querySelector('.quick-top')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));}
    document.querySelectorAll('[data-company-profile-download]').forEach((button)=>button.addEventListener('click',(event)=>{event.preventDefault();window.print();}));
  }
  document.addEventListener('DOMContentLoaded',()=>{normalizeFooter();initLanguage();initMegaMenu();initHeaderAndUtilities();initIcons();initForms();initDisabledSocial();setActiveNav();});
})();
