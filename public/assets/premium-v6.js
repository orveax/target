/* TARGET — Premium Corporate v6 interactions */
(function(){
  'use strict';
  const root=document.documentElement;

  /* Production visual hotfix is injected centrally so every preserved legacy page receives the same image correction without duplicating markup changes. */
  const hotfix=document.createElement('link');
  hotfix.rel='stylesheet';
  hotfix.href='/assets/production-hotfix.css?v=20260815-10';
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
  function initBrandFallback(){document.querySelectorAll('.brand-logo,.footer-logo').forEach((img)=>{img.addEventListener('error',()=>{img.classList.add('is-missing');img.alt='TARGET';});});}
  function setActiveNav(){const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();document.querySelectorAll('[data-nav-file],.site-footer a[href]').forEach((link)=>{const target=(link.dataset.navFile||link.getAttribute('href')||'').split('/').pop().toLowerCase();if(target===current){link.classList.add('active');link.setAttribute('aria-current','page');}});}
  document.addEventListener('DOMContentLoaded',()=>{initLanguage();initIcons();initForms();initDisabledSocial();initBrandFallback();setActiveNav();});
})();
