(() => {
  const applyAuditFixes = () => {
    // Home: replace unsupported legacy icon before the shared Lucide hydration runs.
    document.querySelectorAll('[data-lucide="jar"]').forEach((node) => {
      node.setAttribute('data-lucide', 'candy');
    });

    // How We Work: replace the fragile pseudo-element image with real semantic media.
    const infoLayout = document.querySelector('.page-capabilities .work-info-layout');
    if (infoLayout && !infoLayout.querySelector('.work-info-media')) {
      const figure = document.createElement('figure');
      figure.className = 'work-info-media';
      figure.innerHTML = `
        <img
          src="/images/home-food-trade-editorial-v1.png"
          alt="منتجات غذائية ومعلومات منتج جاهزة للمراجعة"
          data-ar-alt="منتجات غذائية ومعلومات منتج جاهزة للمراجعة"
          data-en-alt="Food products and product information prepared for review"
          width="1600"
          height="900"
          loading="lazy"
          decoding="async"
        />
        <figcaption>
          <i data-lucide="clipboard-check" aria-hidden="true"></i>
          <span
            data-ar="معلومات أوضح عن المنتج تجعل مراجعة الفرصة أسرع وأكثر دقة."
            data-en="Clearer product information makes the opportunity review faster and more precise."
          >معلومات أوضح عن المنتج تجعل مراجعة الفرصة أسرع وأكثر دقة.</span>
        </figcaption>`;
      const cues = infoLayout.querySelector('.work-info-cues');
      infoLayout.insertBefore(figure, cues || null);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAuditFixes, { once: true });
  } else {
    applyAuditFixes();
  }
})();
