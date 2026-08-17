/* TARGET — Products & Companies Polish V2 — product photo album */
(() => {
  const pexels = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900`;
  const commons = (file) => `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}`;
  const atlasUrl = '/assets/products/illustrative-product-atlas.webp';

  const atlasSets = [
    {
      ar:['شاي','ينسون','كمومايل','قرفة','شاي أخضر','نعناع','تليا','شاي أبيض','زعتر','كركديه'],
      en:['Tea','Anise','Chamomile','Cinnamon','Green Tea','Mint','Linden / Tilia','White Tea','Thyme','Hibiscus'],
      indices:[7,0,1,2,3,6,5,9,8,4]
    },
    {
      ar:['جبنة رومي','حمام','كفتة','محشي','ممبار'],
      en:['Roumy Cheese','Pigeon','Kofta','Mahshi / Stuffed Vegetables','Mombar'],
      indices:[14,13,10,11,12]
    },
    {
      ar:['عسل نحل','عسل أسود','حلويات شامية'],
      en:['Bee Honey','Sugarcane Molasses','Levantine Sweets'],
      indices:[15,17,16]
    },
    {
      ar:['برتقال','كركديه','خروب','تمر هندي','جوافة','مانجو','رمان'],
      en:['Orange','Hibiscus','Carob','Tamarind','Guava','Mango','Pomegranate'],
      indices:[22,20,18,24,19,21,23]
    }
  ];

  const library = {
    'شاي': { src: pexels('6448540') },
    'Tea': { src: pexels('6448540') },
    'ينسون': {
      src: commons('AniseSeeds.jpg'),
      credit: { href: 'https://commons.wikimedia.org/wiki/File:AniseSeeds.jpg', ar: 'Wikimedia Commons · Public Domain', en: 'Wikimedia Commons · Public Domain' }
    },
    'Anise': {
      src: commons('AniseSeeds.jpg'),
      credit: { href: 'https://commons.wikimedia.org/wiki/File:AniseSeeds.jpg', ar: 'Wikimedia Commons · Public Domain', en: 'Wikimedia Commons · Public Domain' }
    },
    'كمومايل': { src: pexels('16221903') },
    'Chamomile': { src: pexels('16221903') },
    'قرفة': { src: pexels('71128') },
    'Cinnamon': { src: pexels('71128') },
    'شاي أخضر': { src: pexels('463445') },
    'Green Tea': { src: pexels('463445') },
    'نعناع': { src: pexels('5498007') },
    'Mint': { src: pexels('5498007') },
    'تليا': { src: pexels('30640777') },
    'Linden / Tilia': { src: pexels('30640777') },
    'شاي أبيض': { src: pexels('7136271') },
    'White Tea': { src: pexels('7136271') },
    'زعتر': { src: pexels('5501053') },
    'Thyme': { src: pexels('5501053') },
    'كركديه': { src: pexels('8678927') },
    'Hibiscus': { src: pexels('8678927') },

    'جبنة رومي': { src: pexels('8287396') },
    'Roumy Cheese': { src: pexels('8287396') },
    'حمام': {
      src: commons('Hamam mahshi.jpg'),
      credit: { href: 'https://commons.wikimedia.org/wiki/File:Hamam_mahshi.jpg', ar: 'medea_material · CC BY 2.0', en: 'medea_material · CC BY 2.0' }
    },
    'Pigeon': {
      src: commons('Hamam mahshi.jpg'),
      credit: { href: 'https://commons.wikimedia.org/wiki/File:Hamam_mahshi.jpg', ar: 'medea_material · CC BY 2.0', en: 'medea_material · CC BY 2.0' }
    },
    'كفتة': { src: pexels('37206690') },
    'Kofta': { src: pexels('37206690') },
    'محشي': { src: pexels('31953512') },
    'Mahshi / Stuffed Vegetables': { src: pexels('31953512') },
    'ممبار': {
      src: commons('Egyptian food (mombar).jpg'),
      credit: { href: 'https://commons.wikimedia.org/wiki/File:Egyptian_food_(mombar).jpg', ar: 'Ahmed Elsayed45 · CC BY-SA 4.0', en: 'Ahmed Elsayed45 · CC BY-SA 4.0' }
    },
    'Mombar': {
      src: commons('Egyptian food (mombar).jpg'),
      credit: { href: 'https://commons.wikimedia.org/wiki/File:Egyptian_food_(mombar).jpg', ar: 'Ahmed Elsayed45 · CC BY-SA 4.0', en: 'Ahmed Elsayed45 · CC BY-SA 4.0' }
    },

    'عسل نحل': { src: pexels('5634207') },
    'Bee Honey': { src: pexels('5634207') },
    'عسل أسود': {
      src: commons('Blackstrapmolasses.JPG'),
      credit: { href: 'https://commons.wikimedia.org/wiki/File:Blackstrapmolasses.JPG', ar: 'Badagnani · CC BY 3.0', en: 'Badagnani · CC BY 3.0' }
    },
    'Sugarcane Molasses': {
      src: commons('Blackstrapmolasses.JPG'),
      credit: { href: 'https://commons.wikimedia.org/wiki/File:Blackstrapmolasses.JPG', ar: 'Badagnani · CC BY 3.0', en: 'Badagnani · CC BY 3.0' }
    },
    'حلويات شامية': { src: pexels('20183042') },
    'Levantine Sweets': { src: pexels('20183042') },

    'برتقال': { src: pexels('11009212') },
    'Orange': { src: pexels('11009212') },
    'خروب': {
      src: commons('Carob pods and leaves in majorca arp.jpg'),
      credit: { href: 'https://commons.wikimedia.org/wiki/File:Carob_pods_and_leaves_in_majorca_arp.jpg', ar: 'Arpingstone · Public Domain', en: 'Arpingstone · Public Domain' }
    },
    'Carob': {
      src: commons('Carob pods and leaves in majorca arp.jpg'),
      credit: { href: 'https://commons.wikimedia.org/wiki/File:Carob_pods_and_leaves_in_majorca_arp.jpg', ar: 'Arpingstone · Public Domain', en: 'Arpingstone · Public Domain' }
    },
    'تمر هندي': { src: pexels('18495829') },
    'Tamarind': { src: pexels('18495829') },
    'جوافة': { src: pexels('5945791') },
    'Guava': { src: pexels('5945791') },
    'مانجو': { src: pexels('7156058') },
    'Mango': { src: pexels('7156058') },
    'رمان': { src: pexels('7033816') },
    'Pomegranate': { src: pexels('7033816') }
  };

  let queued = false;

  function resolveAtlasIndices(names) {
    const signature = names.join('|');
    const set = atlasSets.find((item) => item.ar.join('|') === signature || item.en.join('|') === signature);
    return set?.indices || [];
  }

  function applyAtlasFallback(card, figure, img, index) {
    if (!Number.isInteger(index)) {
      card.classList.add('is-fallback');
      return;
    }
    const col = index % 5;
    const row = Math.floor(index / 5);
    card.classList.add('is-atlas-fallback');
    figure.style.backgroundImage = `url("${atlasUrl}")`;
    figure.style.backgroundSize = '500% 500%';
    figure.style.backgroundPosition = `${col * 25}% ${row * 25}%`;
    figure.style.backgroundRepeat = 'no-repeat';
    img.remove();
  }

  function upgradeAlbum() {
    const app = document.querySelector('.page-food-portfolio .portfolio-app');
    if (!app) return;

    const gallery = app.querySelector('.product-gallery');
    const tags = [...app.querySelectorAll('.product-tags span')];
    if (!gallery || !tags.length) return;

    const names = tags.map((el) => (el.textContent || '').trim()).filter(Boolean);
    const signature = names.join('|');
    if (!signature || gallery.dataset.photoSignature === signature) return;

    gallery.dataset.photoSignature = signature;
    gallery.classList.add('product-gallery--photo');
    gallery.replaceChildren();

    const isAr = document.documentElement.lang !== 'en';
    const fallbackIndices = resolveAtlasIndices(names);

    names.forEach((name, position) => {
      const media = library[name];
      const card = document.createElement('article');
      card.className = 'product-photo-card';
      card.setAttribute('role', 'listitem');

      const figure = document.createElement('figure');
      figure.className = 'product-photo-frame';

      const img = document.createElement('img');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.alt = name;
      img.src = media?.src || '/images/home-food-trade-editorial-v1.png';
      img.addEventListener('error', () => applyAtlasFallback(card, figure, img, fallbackIndices[position]), { once: true });
      figure.appendChild(img);

      const copy = document.createElement('div');
      copy.className = 'product-photo-copy';
      const title = document.createElement('strong');
      title.textContent = name;
      copy.appendChild(title);

      if (media?.credit) {
        const credit = document.createElement('a');
        credit.className = 'product-photo-credit';
        credit.href = media.credit.href;
        credit.target = '_blank';
        credit.rel = 'noopener noreferrer';
        credit.textContent = isAr ? media.credit.ar : media.credit.en;
        copy.appendChild(credit);
      }

      card.append(figure, copy);
      gallery.appendChild(card);
    });

    const intro = app.querySelector('.products-intro');
    if (intro) {
      intro.classList.add('products-intro--photo');
      intro.textContent = isAr
        ? 'صور مرجعية مجانية توضح نوع المنتج بصريًا. تُستبدل بصور العبوات الأصلية للشركة عند اعتمادها، بدون تغيير تصميم الألبوم.'
        : 'Free reference photography is used to identify each product visually. Approved company packshots can replace it later without changing the album design.';
    }
  }

  function scheduleUpgrade() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      upgradeAlbum();
    });
  }

  function start() {
    if (!document.body.classList.contains('page-food-portfolio')) return;
    scheduleUpgrade();
    const app = document.querySelector('.portfolio-app');
    if (app) new MutationObserver(scheduleUpgrade).observe(app, { childList: true, subtree: true, characterData: true });
    new MutationObserver(scheduleUpgrade).observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
