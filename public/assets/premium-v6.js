/* TARGET — Premium Corporate v6 interactions */
(function(){
  'use strict';
  const root=document.documentElement;

  function isArabic(){return root.lang!=='en'}
  function applyLanguage(lang){
    const ar=lang!=='en';root.lang=ar?'ar':'en';root.dir=ar?'rtl':'ltr';
    document.querySelectorAll('[data-ar][data-en]').forEach((node)=>{const value=ar?node.dataset.ar:node.dataset.en;if(node.matches('input,textarea')) node.placeholder=value;else node.textContent=value;});
    document.querySelectorAll('[data-ar-aria][data-en-aria]').forEach((node)=>node.setAttribute('aria-label',ar?node.dataset.arAria:node.dataset.enAria));
    document.querySelectorAll('[data-lang-toggle]').forEach((button)=>{button.textContent=ar?'EN':'AR';button.setAttribute('aria-label',ar?'Switch to English':'التبديل إلى العربية');});
    document.querySelectorAll('[data-ar-placeholder][data-en-placeholder]').forEach((node)=>{node.placeholder=ar?node.dataset.arPlaceholder:node.dataset.enPlaceholder;});
    try{localStorage.setItem('target-language',ar?'ar':'en')}catch(_){ } requestAnimationFrame(initIcons);
  }
  function initIcons(){if(window.lucide&&typeof window.lucide.createIcons==='function'){window.lucide.createIcons({attrs:{'aria-hidden':'true'}});}}
  function initLanguage(){
    let lang='ar';try{lang=localStorage.getItem('target-language')||'ar'}catch(_){ }
    applyLanguage(lang);
    document.addEventListener('click',(event)=>{
      const button=event.target.closest('[data-lang-toggle]');
      if(!button)return;
      event.preventDefault();event.stopPropagation();
      applyLanguage(isArabic()?'en':'ar');
    });
  }
  function fieldMessage(field){const ar=isArabic();if(field.validity.valueMissing)return ar?'هذا الحقل مطلوب.':'This field is required.';if(field.validity.typeMismatch)return ar?'يرجى إدخال بريد إلكتروني صحيح.':'Enter a valid email address.';if(field.validity.tooShort)return ar?'يرجى إضافة تفاصيل أكثر.':'Please add a little more detail.';if(field.validity.patternMismatch)return ar?'يرجى مراجعة صيغة هذا الحقل.':'Please check this field format.';return ar?'يرجى مراجعة هذا الحقل.':'Please review this field.';}
  function errorNode(field){const id=field.id+'-error';let node=document.getElementById(id);if(!node){node=document.createElement('div');node.id=id;node.className='invalid-feedback';field.insertAdjacentElement('afterend',node);}field.setAttribute('aria-describedby',id);return node;}
  function validateField(field){
    if(field.type==='checkbox'){
      const valid=field.checked||!field.required;field.setAttribute('aria-invalid',valid?'false':'true');
      const wrapper=field.closest('.privacy-check')||field.parentElement;let message=wrapper.querySelector('.invalid-feedback');
      if(!message){message=document.createElement('div');message.className='invalid-feedback d-block w-100';wrapper.appendChild(message)}
      message.textContent=valid?'':fieldMessage(field);return valid;
    }
    const valid=field.checkValidity();field.classList.toggle('is-invalid',!valid);field.setAttribute('aria-invalid',valid?'false':'true');const node=errorNode(field);node.textContent=valid?'':fieldMessage(field);return valid;
  }
  function initForms(){
    document.querySelectorAll('[data-target-form]').forEach((form)=>{
      const summary=form.querySelector('[data-validation-summary]');const success=form.querySelector('[data-form-success]');
      const submit=form.querySelector('button[type="submit"]');
      const fields=[...form.querySelectorAll('input,select,textarea')].filter((f)=>f.type!=='hidden'&&f.type!=='submit');
      fields.forEach((field)=>{const event=field.tagName==='SELECT'||field.type==='checkbox'?'change':'blur';field.addEventListener(event,()=>validateField(field));if(field.type!=='checkbox')field.addEventListener('input',()=>{if(field.classList.contains('is-invalid'))validateField(field)});});
      form.addEventListener('submit',(event)=>{
        event.preventDefault();let firstInvalid=null;fields.forEach((field)=>{if(!validateField(field)&&!firstInvalid)firstInvalid=field});
        if(firstInvalid){summary?.classList.add('is-visible');success?.classList.remove('is-visible');firstInvalid.focus();return;}
        summary?.classList.remove('is-visible');if(submit){submit.disabled=true;submit.setAttribute('aria-busy','true');}
        window.setTimeout(()=>{success?.classList.add('is-visible');success?.focus();if(submit){submit.disabled=false;submit.removeAttribute('aria-busy');}},180);
      });
    });
  }
  function initDisabledSocial(){document.querySelectorAll('[data-social-pending]').forEach((item)=>item.remove());}
  function setActiveNav(){const current=(location.pathname.split('/').pop()||'index.html').toLowerCase();document.querySelectorAll('[data-nav-file]').forEach((link)=>{if((link.dataset.navFile||'').toLowerCase()===current){link.classList.add('active');link.setAttribute('aria-current','page');}});}
  function normalizeFooter(){
    document.querySelectorAll('.site-footer').forEach((footer)=>{
      footer.querySelectorAll('.footer-logo').forEach((logo)=>{logo.src='/assets/brand/target-logo-horizontal-cream.svg';});
      const bottom=footer.querySelector('.footer-bottom');
      if(bottom){bottom.innerHTML='<span>targetft.com</span><span data-ar="جميع الحقوق محفوظة © TARGET 2026 — RFX" data-en="TARGET 2026 © All rights reserved — RFX">جميع الحقوق محفوظة © TARGET 2026 — RFX</span>';}
    });
  }
  function initMegaMenu(){
    const item=document.querySelector('.site-header .mega-nav-item');const toggle=item?.querySelector('.mega-toggle');if(!item||!toggle)return;
    const close=()=>{item.classList.remove('is-mega-open');toggle.setAttribute('aria-expanded','false');};
    toggle.addEventListener('click',(event)=>{event.preventDefault();const open=item.classList.toggle('is-mega-open');toggle.setAttribute('aria-expanded',String(open));});
    document.addEventListener('click',(event)=>{if(!item.contains(event.target))close();});
    document.addEventListener('keydown',(event)=>{if(event.key==='Escape')close();});
  }
  function initHeaderAndUtilities(){
    if(!document.querySelector('.site-quick-actions')){
      document.body.insertAdjacentHTML('beforeend','<div class="site-quick-actions" aria-label="Quick actions"><a class="quick-whatsapp" href="https://wa.me/97477910919" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp TARGET"><i class="bi bi-whatsapp"></i><span data-ar="واتساب" data-en="WhatsApp">واتساب</span></a><button class="quick-top" type="button" aria-label="Go to top"><i class="bi bi-arrow-up"></i><span data-ar="أعلى" data-en="Top">أعلى</span></button></div>');
      document.querySelector('.quick-top')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
    }
    document.querySelectorAll('[data-company-profile-download]').forEach((button)=>button.addEventListener('click',(event)=>{event.preventDefault();window.print();}));
  }
  document.addEventListener('DOMContentLoaded',()=>{initLanguage();normalizeFooter();initMegaMenu();initHeaderAndUtilities();initIcons();initForms();initDisabledSocial();setActiveNav();});
})();
