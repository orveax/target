/* Homepage canonical FAQ: keyboard-safe, one clear answer at a time. */
(function(){
  function initHomepageFaq(){
    document.querySelectorAll('[data-home-faq]').forEach((button)=>{
      if(button.dataset.homeFaqBound==='true') return;
      button.dataset.homeFaqBound='true';
      button.addEventListener('click',()=>{
        const item=button.closest('.hc-faq-item');
        const panel=item?.querySelector('.hc-faq-panel');
        const open=button.getAttribute('aria-expanded')==='true';
        document.querySelectorAll('[data-home-faq]').forEach((other)=>{
          const otherItem=other.closest('.hc-faq-item');
          const otherPanel=otherItem?.querySelector('.hc-faq-panel');
          other.setAttribute('aria-expanded','false');
          otherItem?.classList.remove('is-open');
          if(otherPanel) otherPanel.hidden=true;
        });
        if(!open && item && panel){
          button.setAttribute('aria-expanded','true');
          item.classList.add('is-open');
          panel.hidden=false;
        }
      });
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initHomepageFaq);
  else initHomepageFaq();
})();
