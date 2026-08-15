/* TARGET — Contact Us refinement V2 | approved map link + location copy */
(function(){
  'use strict';
  const MAP_URL='https://maps.app.goo.gl/CMoYWXAr7wzzx1Yw5';
  function setBiText(node,ar,en){
    if(!node)return;
    node.dataset.ar=ar;node.dataset.en=en;
    node.textContent=document.documentElement.lang==='en'?en:ar;
  }
  function initContactMap(){
    if(!document.body.classList.contains('page-contact'))return;
    const section=document.querySelector('.ct-location');
    const map=document.querySelector('.ct-map-context');
    if(!section||!map)return;
    setBiText(section.querySelector('.ct-location-copy h2'),'موقع تارقت على خرائط Google.','TARGET on Google Maps.');
    setBiText(section.querySelector('.ct-location-copy > p'),'استخدم الخريطة للوصول إلى الموقع المعتمد، أو افتح الموقع مباشرة في خرائط Google.','Use the map to view the approved location, or open it directly in Google Maps.');
    setBiText(section.querySelector('.ct-location-fact strong'),'الموقع المعتمد','Approved Location');
    setBiText(section.querySelector('.ct-location-fact span'),'افتح الموقع في خرائط Google للحصول على الاتجاهات والتفاصيل المحدثة.','Open the location in Google Maps for directions and current details.');
    map.removeAttribute('role');
    map.removeAttribute('aria-label');
    map.innerHTML=`<iframe title="TARGET location on Google Maps" src="${MAP_URL}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe><a class="ct-map-open" href="${MAP_URL}" target="_blank" rel="noopener noreferrer"><i data-lucide="map-pinned"></i><span data-ar="فتح الموقع في خرائط Google" data-en="Open in Google Maps">فتح الموقع في خرائط Google</span></a>`;
    if(window.lucide&&typeof window.lucide.createIcons==='function')window.lucide.createIcons({attrs:{'aria-hidden':'true'}});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initContactMap);else initContactMap();
})();
