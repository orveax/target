/* TARGET — Form Delivery V1 — final audit fallback
 * Purpose: provide a real, transparent delivery path until a first-party form endpoint is connected.
 * Valid submissions open the visitor's email client with the form data addressed to the correct TARGET mailbox.
 * This layer owns submit events in capture phase so legacy simulated-success handlers cannot claim receipt.
 */
(() => {
  'use strict';

  if (window.__TARGET_FORM_DELIVERY_V1__) return;
  window.__TARGET_FORM_DELIVERY_V1__ = true;

  const doc = document;
  const root = doc.documentElement;
  const isAr = () => root.lang !== 'en';
  const text = (ar, en) => isAr() ? ar : en;

  const fieldLabels = {
    name: ['الاسم', 'Name'],
    company: ['الشركة أو العلامة', 'Company or Brand'],
    country: ['الدولة', 'Country'],
    email: ['البريد الإلكتروني', 'Email'],
    phone: ['الهاتف أو WhatsApp', 'Phone or WhatsApp'],
    product: ['المنتج أو الفئة', 'Product or Category'],
    opportunity: ['موضوع النقاش', 'Discussion Type'],
    summary: ['ملخص المنتج والفرصة', 'Product & Opportunity Summary'],
    intent: ['نوع الاستفسار', 'Enquiry Type'],
    subject: ['الموضوع', 'Subject'],
    message: ['الرسالة', 'Message'],
  };

  function recipientFor(form) {
    if (doc.body.classList.contains('page-suppliers')) return 'partners@targetft.com';
    const intent = form.elements?.intent?.value || '';
    if (intent === 'sales' || intent === 'quote') return 'sales@targetft.com';
    return 'info@targetft.com';
  }

  function fieldDisplayValue(field) {
    if (!field) return '';
    if (field.tagName === 'SELECT') return field.selectedOptions?.[0]?.textContent?.trim() || field.value || '';
    return String(field.value || '').trim();
  }

  function buildMail(form) {
    const recipient = recipientFor(form);
    const values = {};
    [...form.elements].forEach((field) => {
      const name = field?.name;
      if (!name || ['submit', 'button', 'checkbox'].includes(field.type)) return;
      const value = fieldDisplayValue(field);
      if (value) values[name] = value.slice(0, 1400);
    });

    const supplier = doc.body.classList.contains('page-suppliers');
    const subjectLead = supplier
      ? (values.company || values.product || values.name || 'Product Review')
      : (values.subject || values.intent || values.name || 'Website Enquiry');
    const subject = supplier ? `TARGET Product Review — ${subjectLead}` : `TARGET Website Enquiry — ${subjectLead}`;

    const lines = [];
    lines.push(text('مرسل من نموذج موقع TARGET', 'Sent from the TARGET website form'));
    lines.push(`Page: ${location.href}`);
    lines.push('');
    Object.entries(values).forEach(([name, value]) => {
      const label = fieldLabels[name];
      lines.push(`${label ? (isAr() ? label[0] : label[1]) : name}: ${value}`);
    });
    lines.push('');
    lines.push(text('تمت الموافقة على سياسة الخصوصية داخل النموذج قبل تجهيز هذه الرسالة.', 'The Privacy Policy acknowledgement was completed in the form before this email draft was prepared.'));

    return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`;
  }

  function setDeliveryStatus(form) {
    const success = form.querySelector('[data-form-success]');
    if (!success) return;
    const copy = success.querySelector('.icon-inline > span:last-child, span[data-ar][data-en]');
    if (!copy) return;
    const ar = 'تم تجهيز رسالتك في تطبيق البريد. أكمل الإرسال من نافذة البريد التي ستفتح الآن. إذا لم يفتح تطبيق البريد، استخدم قناة البريد المباشرة الظاهرة في الصفحة.';
    const en = 'Your message has been prepared in your email app. Complete the send from the email window that opens now. If no email app opens, use the direct email channel shown on this page.';
    copy.dataset.ar = ar;
    copy.dataset.en = en;
    copy.textContent = isAr() ? ar : en;
  }

  function addDeliveryNote(form) {
    if (form.querySelector('[data-form-delivery-note]')) return;
    const submit = form.querySelector('button[type="submit"]');
    const holder = submit?.closest('.ct-field-wide,.fs-field-wide') || submit?.parentElement;
    if (!holder) return;
    const note = doc.createElement('div');
    note.className = 'form-delivery-note';
    note.setAttribute('data-form-delivery-note', '');
    note.dataset.ar = 'سيتم فتح تطبيق البريد على جهازك لإكمال الإرسال. لن تظهر رسالة استلام قبل أن ترسل البريد فعليًا.';
    note.dataset.en = 'Your email app will open to complete the submission. No receipt message is shown until you actually send the email.';
    note.textContent = isAr() ? note.dataset.ar : note.dataset.en;
    holder.insertAdjacentElement('beforebegin', note);
  }

  function normalizeFooterCredit() {
    const bottom = doc.querySelector('.site-footer .footer-bottom');
    const credit = bottom?.querySelector('span:last-child');
    if (!credit) return;
    credit.dataset.ar = 'جميع الحقوق محفوظة © TARGET 2026';
    credit.dataset.en = 'TARGET 2026 © All rights reserved';
    credit.textContent = isAr() ? credit.dataset.ar : credit.dataset.en;
  }

  function initialize() {
    doc.querySelectorAll('form[data-target-form]').forEach((form) => {
      form.dataset.deliveryMode = 'email-client';
      setDeliveryStatus(form);
      addDeliveryNote(form);
    });
    window.setTimeout(normalizeFooterCredit, 0);
  }

  doc.addEventListener('submit', (event) => {
    const form = event.target?.closest?.('form[data-target-form]');
    if (!form) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    const fields = [...form.querySelectorAll('input,select,textarea')].filter((field) => !['hidden', 'submit', 'button'].includes(field.type));
    let firstInvalid = null;
    fields.forEach((field) => {
      const valid = field.type === 'checkbox' ? (!field.required || field.checked) : field.checkValidity();
      field.setAttribute('aria-invalid', valid ? 'false' : 'true');
      if (!valid && !firstInvalid) firstInvalid = field;
    });

    const summary = form.querySelector('[data-validation-summary]');
    const success = form.querySelector('[data-form-success]');
    if (firstInvalid) {
      summary?.classList.add('is-visible');
      success?.classList.remove('is-visible');
      firstInvalid.focus({ preventScroll: false });
      firstInvalid.reportValidity?.();
      return;
    }

    summary?.classList.remove('is-visible');
    setDeliveryStatus(form);
    success?.classList.add('is-visible');
    success?.focus({ preventScroll: true });

    const submit = form.querySelector('button[type="submit"]');
    if (submit) {
      submit.setAttribute('aria-busy', 'true');
      window.setTimeout(() => submit.removeAttribute('aria-busy'), 900);
    }

    window.location.href = buildMail(form);
  }, true);

  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
