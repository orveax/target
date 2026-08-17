/* TARGET — Products & Companies Polish V2 — product photo album */
(() => {
  const pexels = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=900`;
  const commons = (file) => `https://commons.wikimedia.org/wiki/Special:Redirect/file/${encodeURIComponent(file)}`;
  const atlasUrl = '/assets/products/illustrative-product-atlas.webp';

  const atlasIndex = {
    'ينسون':0,'Anise':0,'كمومايل':1,'Chamomile':1,'قرفة':2,'Cinnamon':2,'شاي أخضر':3,'Green Tea':3,'زعتر':4,'Thyme':4,
    'نعناع':5,'Mint':5,'شاي':7,'Tea':7,'كركديه':8,'Hibiscus':8,'شاي أبيض':9,'White Tea':9,
    'حمام':10,'Pigeon':10,'كفتة':11,'Kofta':11,'محشي':12,'Mahshi / Stuffed Vegetables':12,'جبنة رومي':14,'Roumy Cheese':14,
    'عسل نحل':15,'Bee Honey':15,'حلويات شامية':16,'Levantine Sweets':16,'عسل أسود':17,'Sugarcane Molasses':17,
    'تمر هندي':18,'Tamarind':18,'جوافة':19,'Guava':19,'خروب':20,'Carob':20,'مانجو':21,'Mango':21,'برتقال':22,'Orange':22,'رمان':23,'Pomegranate':23,
    'تليا':24,'Linden / Tilia':24
  };

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

  function applyAtlasFallback(card, figure, img, name) {
    const index = atlasIndex[name];
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

    names.forEach((name) => {
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
      img.addEventListener('error', () => applyAtlasFallback(card, figure, img, name), { once: true });
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
