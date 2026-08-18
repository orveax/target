/* TARGET — Premium Corporate v6 interactions
 * Shared runtime baseline only: language, icons, field-level validation,
 * active navigation state and quick utility actions.
 * Page-specific/navigation/form-delivery behavior is owned by dedicated layers.
 */
(() => {
  'use strict';

  const root = document.documentElement;
  const isArabic = () => root.lang !== 'en';

  function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ attrs: { 'aria-hidden': 'true' } });
    }
  }

  function applyLanguage(lang) {
    const ar = lang !== 'en';
    root.lang = ar ? 'ar' : 'en';
    root.dir = ar ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-ar][data-en]').forEach((node) => {
      const value = ar ? node.dataset.ar : node.dataset.en;
      if (node.matches('input,textarea')) node.placeholder = value;
      else node.textContent = value;
    });

    document.querySelectorAll('[data-ar-aria][data-en-aria]').forEach((node) => {
      node.setAttribute('aria-label', ar ? node.dataset.arAria : node.dataset.enAria);
    });

    document.querySelectorAll('[data-lang-toggle]').forEach((button) => {
      button.textContent = ar ? 'EN' : 'AR';
      button.setAttribute('aria-label', ar ? 'Switch to English' : 'التبديل إلى العربية');
    });

    document.querySelectorAll('[data-ar-placeholder][data-en-placeholder]').forEach((node) => {
      node.placeholder = ar ? node.dataset.arPlaceholder : node.dataset.enPlaceholder;
    });

    try {
      localStorage.setItem('target-language', ar ? 'ar' : 'en');
    } catch {
      /* Storage may be unavailable in privacy-restricted browser contexts. */
    }

    requestAnimationFrame(initIcons);
  }

  function initLanguage() {
    let lang = 'ar';
    try {
      lang = localStorage.getItem('target-language') || 'ar';
    } catch {
      /* Fall back to Arabic when browser storage is unavailable. */
    }

    applyLanguage(lang);
    document.addEventListener('click', (event) => {
      const button = event.target.closest('[data-lang-toggle]');
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      applyLanguage(isArabic() ? 'en' : 'ar');
    });
  }

  function fieldMessage(field) {
    if (field.validity.valueMissing) return isArabic() ? 'هذا الحقل مطلوب.' : 'This field is required.';
    if (field.validity.typeMismatch) return isArabic() ? 'يرجى إدخال بريد إلكتروني صحيح.' : 'Enter a valid email address.';
    if (field.validity.tooShort) return isArabic() ? 'يرجى إضافة تفاصيل أكثر.' : 'Please add a little more detail.';
    if (field.validity.patternMismatch) return isArabic() ? 'يرجى مراجعة صيغة هذا الحقل.' : 'Please check this field format.';
    return isArabic() ? 'يرجى مراجعة هذا الحقل.' : 'Please review this field.';
  }

  function errorNode(field) {
    const id = `${field.id}-error`;
    let node = document.getElementById(id);
    if (!node) {
      node = document.createElement('div');
      node.id = id;
      node.className = 'invalid-feedback';
      field.insertAdjacentElement('afterend', node);
    }
    field.setAttribute('aria-describedby', id);
    return node;
  }

  function validateField(field) {
    if (field.type === 'checkbox') {
      const valid = field.checked || !field.required;
      field.setAttribute('aria-invalid', valid ? 'false' : 'true');
      const wrapper = field.closest('.privacy-check') || field.parentElement;
      if (!wrapper) return valid;

      let message = wrapper.querySelector('.invalid-feedback');
      if (!message) {
        message = document.createElement('div');
        message.className = 'invalid-feedback d-block w-100';
        wrapper.appendChild(message);
      }
      message.textContent = valid ? '' : fieldMessage(field);
      return valid;
    }

    const valid = field.checkValidity();
    field.classList.toggle('is-invalid', !valid);
    field.setAttribute('aria-invalid', valid ? 'false' : 'true');
    errorNode(field).textContent = valid ? '' : fieldMessage(field);
    return valid;
  }

  function initFieldValidation() {
    document.querySelectorAll('form[data-target-form]').forEach((form) => {
      const fields = [...form.querySelectorAll('input,select,textarea')]
        .filter((field) => !['hidden', 'submit', 'button'].includes(field.type));

      fields.forEach((field) => {
        const validationEvent = field.tagName === 'SELECT' || field.type === 'checkbox' ? 'change' : 'blur';
        field.addEventListener(validationEvent, () => validateField(field));
        if (field.type !== 'checkbox') {
          field.addEventListener('input', () => {
            if (field.classList.contains('is-invalid')) validateField(field);
          });
        }
      });
    });
  }

  function setActiveNav() {
    const current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('[data-nav-file]').forEach((link) => {
      if ((link.dataset.navFile || '').toLowerCase() !== current) return;
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    });
  }

  function initQuickActions() {
    if (document.querySelector('.site-quick-actions')) return;

    document.body.insertAdjacentHTML(
      'beforeend',
      '<div class="site-quick-actions" aria-label="Quick actions"><a class="quick-whatsapp" href="https://wa.me/97477910919" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp TARGET"><i class="bi bi-whatsapp"></i><span data-ar="واتساب" data-en="WhatsApp">واتساب</span></a><button class="quick-top" type="button" aria-label="Go to top"><i class="bi bi-arrow-up"></i><span data-ar="أعلى" data-en="Top">أعلى</span></button></div>',
    );

    document.querySelector('.quick-top')?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    initQuickActions();
    initIcons();
    initFieldValidation();
    setActiveNav();
  });
})();

/* Progressive runtime layers. */
import('/assets/target-interactions-v1.js?v=20260816-01')
  .catch((error) => console.warn('[TARGET interactions] layer unavailable', error));
import('/assets/target-experience-v1.js?v=20260816-01')
  .catch((error) => console.warn('[TARGET experience] layer unavailable', error));
import('/assets/target-section-nav-v2.js?v=20260816-04')
  .catch((error) => console.warn('[TARGET section nav] V2 unavailable', error));
import('/assets/real-trade-photography-v1.js?v=20260816-01')
  .catch((error) => console.warn('[TARGET photography] V1 unavailable', error));
import('/assets/mobile-nav-refinement-v2.js?v=20260816-01')
  .catch((error) => console.warn('[TARGET mobile nav] V2 unavailable', error));
