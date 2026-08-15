/* TARGET — Contact Us refinement V2 | verified location + contact channels */
(function(){
  'use strict';
  const MAP_URL='https://maps.app.goo.gl/CMoYWXAr7wzzx1Yw5';
  const MAP_EMBED='https://www.google.com/maps?q=25.1753889,51.6052222&z=17&output=embed';
  const PHONE_DISPLAY='+974 7791 0919';
  const PHONE_TEL='+97477910919';
  const WHATSAPP_URL='https://wa.me/97477910919';
  const SOCIALS=[
    ['facebook','Facebook','https://www.facebook.com/targetft'],
    ['instagram','Instagram','https://www.instagram.com/targetft/'],
    ['tiktok','TikTok','https://www.tiktok.com/@targetft']
  ];

  function setBiText(node,ar,en){
    if(!node)return;
    node.dataset.ar=ar;node.dataset.en=en;
    node.textContent=document.documentElement.lang==='en'?en:ar;
  }
  function localize(scope){
    const en=document.documentElement.lang==='en';
    scope?.querySelectorAll('[data-ar][data-en]').forEach((node)=>{node.textContent=en?node.dataset.en:node.dataset.ar;});
  }
  function initContactMap(){
    if(!document.body.classList.contains('page-contact'))return;
    const section=document.querySelector('.ct-location');
    const map=document.querySelector('.ct-map-context');
    if(!section||!map)return;
    setBiText(section.querySelector('.ct-location-copy h2'),'موقع تارقت المعتمد في قطر.','TARGET approved location in Qatar.');
    setBiText(section.querySelector('.ct-location-copy > p'),'استخدم الخريطة للوصول إلى موقع تارقت عند الإحداثيات 25°10\'31.4″N 51°36\'18.8″E، أو افتح الموقع مباشرة في خرائط Google.','Use the map to view TARGET at 25°10\'31.4″N 51°36\'18.8″E, or open the location directly in Google Maps.');
    setBiText(section.querySelector('.ct-location-fact strong'),'الموقع المعتمد','Approved Location');
    setBiText(section.querySelector('.ct-location-fact span'),'25°10\'31.4″N 51°36\'18.8″E','25°10\'31.4″N 51°36\'18.8″E');
    map.removeAttribute('role');
    map.removeAttribute('aria-label');
    map.innerHTML=`<iframe title="TARGET location on Google Maps" src="${MAP_EMBED}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe><a class="ct-map-open" href="${MAP_URL}" target="_blank" rel="noopener noreferrer"><i data-lucide="map-pinned"></i><span data-ar="فتح الموقع في خرائط Google" data-en="Open in Google Maps">فتح الموقع في خرائط Google</span></a>`;
  }

  function initVerifiedContact(){
    if(!document.body.classList.contains('page-contact')||document.querySelector('.ct-verified-contact'))return;
    const support=document.querySelector('.ct-support');
    if(!support)return;
    const socialHtml=SOCIALS.map(([icon,label,url])=>`<a class="ct-social-link" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="TARGET on ${label}"><i class="bi bi-${icon}"></i><span>${label}</span></a>`).join('');
    support.insertAdjacentHTML('beforebegin',`
      <section class="ct-verified-contact" aria-labelledby="ct-verified-title">
        <div class="container ct-verified-grid">
          <article class="ct-direct-card">
            <span class="ct-kicker" data-ar="تواصل مباشر" data-en="Direct Contact">تواصل مباشر</span>
            <h2 id="ct-verified-title" data-ar="الهاتف وWhatsApp" data-en="Phone & WhatsApp">الهاتف وWhatsApp</h2>
            <p data-ar="استخدم الرقم الرسمي للتواصل المباشر مع تارقت." data-en="Use the official number for direct contact with TARGET.">استخدم الرقم الرسمي للتواصل المباشر مع تارقت.</p>
            <div class="ct-direct-actions">
              <a class="ct-phone-link" href="tel:${PHONE_TEL}"><i data-lucide="phone"></i><span dir="ltr">${PHONE_DISPLAY}</span></a>
              <a class="ct-whatsapp-link" href="${WHATSAPP_URL}" target="_blank" rel="noopener noreferrer"><i class="bi bi-whatsapp"></i><span data-ar="فتح WhatsApp" data-en="Open WhatsApp">فتح WhatsApp</span></a>
            </div>
          </article>
          <article class="ct-social-card">
            <span class="ct-kicker" data-ar="تابع تارقت" data-en="Follow TARGET">تابع تارقت</span>
            <h2 data-ar="قنواتنا الاجتماعية" data-en="Our Social Channels">قنواتنا الاجتماعية</h2>
            <p data-ar="تابع حساب TARGET الرسمي على المنصات المعتمدة." data-en="Follow TARGET on the approved official social channels.">تابع حساب TARGET الرسمي على المنصات المعتمدة.</p>
            <div class="ct-social-links">${socialHtml}</div>
          </article>
        </div>
      </section>`);
    localize(document.querySelector('.ct-verified-contact'));
  }

  function init(){
    initContactMap();
    initVerifiedContact();
    if(window.lucide&&typeof window.lucide.createIcons==='function')window.lucide.createIcons({attrs:{'aria-hidden':'true'}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
