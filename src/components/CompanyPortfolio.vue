<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { usePortfolioStore } from '../stores/portfolio';
import { companies } from '../data/companies';

const store = usePortfolioStore();
const company = computed(() => companies[store.companyIndex]);
const product = computed(() => company.value.products[store.productIndex]);
const isAr = computed(() => store.language === 'ar');
let observer: MutationObserver | undefined;

onMounted(() => {
  const sync = () => store.setLanguage(document.documentElement.lang === 'en' ? 'en' : 'ar');
  sync();
  observer = new MutationObserver(sync);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
});
onBeforeUnmount(() => observer?.disconnect());

function spriteStyle(c:any,p:any,zoom=1){
  const col=p.spriteIndex%c.spriteCols;
  const row=Math.floor(p.spriteIndex/c.spriteCols);
  const x=c.spriteCols<=1?0:(col/(c.spriteCols-1))*100;
  const y=c.spriteRows<=1?0:(row/(c.spriteRows-1))*100;
  return {backgroundImage:`url(${c.sprite})`,backgroundSize:`${c.spriteCols*100*zoom}% ${c.spriteRows*100*zoom}%`,backgroundPosition:`${x}% ${y}%`};
}
function nextProduct(){store.selectProduct((store.productIndex+1)%company.value.products.length)}
function prevProduct(){store.selectProduct((store.productIndex-1+company.value.products.length)%company.value.products.length)}
function requestHref(c:any){
  const subject = isAr.value ? `طلب ملف منتجات — ${c.nameAr}` : `Product portfolio request — ${c.nameEn}`;
  const body = isAr.value ? `مرحبًا، أرغب في طلب ملف منتجات ${c.nameAr}.` : `Hello, I would like to request the product portfolio for ${c.nameEn}.`;
  return `mailto:partners@targetft.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
</script>

<template>
<section class="portfolio-app" :dir="isAr?'rtl':'ltr'">
  <div class="portfolio-company-grid">
    <button v-for="(c,ci) in companies" :key="c.id" type="button" class="company-tile" :class="{active:store.companyIndex===ci}" :aria-pressed="store.companyIndex===ci" @click="store.selectCompany(ci)">
      <span class="company-tile-photo" :style="spriteStyle(c,c.products[0])"></span><span class="company-tile-overlay"></span>
      <span class="company-tile-content"><span class="company-kicker">{{isAr?'مجال اهتمام':'In Focus'}}</span><strong>{{isAr?c.nameAr:c.nameEn}}</strong><small>{{isAr?c.categoryAr:c.categoryEn}}</small><span class="company-count">{{c.products.length}} {{isAr?'منتجات':'products'}}</span></span>
    </button>
  </div>

  <div class="portfolio-detail">
    <aside class="company-summary">
      <div class="company-summary-cover"><span class="company-summary-photo" :style="spriteStyle(company,company.products[0])"></span></div>
      <div class="company-summary-body">
        <span class="portfolio-label">{{isAr?'شركات ومنتجات محل اهتمامنا':'Companies & Products in Focus'}}</span>
        <h3>{{isAr?company.nameAr:company.nameEn}}</h3><p class="company-category">{{isAr?company.categoryAr:company.categoryEn}}</p><p>{{isAr?company.descriptionAr:company.descriptionEn}}</p>
        <p v-if="'noteAr' in company" class="company-note">{{isAr?company.noteAr:company.noteEn}}</p>
        <div class="claim-note"><i class="bi bi-shield-check"></i><span>{{isAr?'العرض تعريفي ولا يعني وكالة أو تمثيلًا أو حصرية.':'Displayed for information only; no agency, representation or exclusivity claim is implied.'}}</span></div>
        <div class="company-actions">
          <a v-if="company.brochure" class="portfolio-brochure" :href="company.brochure">{{isAr?'تحميل بروشور المنتجات':'Download Product Brochure'}}</a>
          <a v-else class="portfolio-brochure portfolio-brochure-outline" :href="requestHref(company)"><i class="bi bi-envelope"></i>{{isAr?'اطلب ملف المنتجات':'Request product portfolio'}}</a>
        </div>
      </div>
    </aside>

    <div class="product-stage">
      <div class="product-stage-head"><div><span class="portfolio-label">{{isAr?'معرض المنتجات':'Product Gallery'}}</span><h3>{{isAr?product.nameAr:product.nameEn}}</h3></div><span class="illustrative-badge"><i class="bi bi-images"></i>{{isAr?'صور توضيحية قابلة للاستبدال':'Replaceable illustrative media'}}</span></div>
      <div class="media-layout">
        <div class="product-visual product-visual-main" :style="spriteStyle(company,product)" role="img" :aria-label="isAr?product.nameAr:product.nameEn"><div class="product-visual-gradient"></div><div class="product-visual-caption"><span>{{isAr?company.nameAr:company.nameEn}}</span><strong>{{isAr?product.nameAr:product.nameEn}}</strong></div><button class="gallery-arrow prev" @click="prevProduct"><i class="bi" :class="isAr?'bi-arrow-right':'bi-arrow-left'"></i></button><button class="gallery-arrow next" @click="nextProduct"><i class="bi" :class="isAr?'bi-arrow-left':'bi-arrow-right'"></i></button></div>
        <div class="media-secondary"><div class="product-visual detail" :style="spriteStyle(company,product,1.16)"><span>{{isAr?'تفصيل بصري':'Detail view'}}</span></div><div class="product-visual detail alternate" :style="spriteStyle(company,product,1.3)"><span>{{isAr?'زاوية بديلة':'Alternate crop'}}</span></div></div>
      </div>
      <div class="product-tabs"><button v-for="(p,pi) in company.products" :key="p.slug" type="button" :class="{active:store.productIndex===pi}" @click="store.selectProduct(pi)"><span class="product-thumb" :style="spriteStyle(company,p)"></span><span>{{isAr?p.nameAr:p.nameEn}}</span></button></div>
      <div class="company-product-index"><div class="company-product-index-head"><span>{{isAr?'أصناف الشركة المسجلة':'Listed company products'}}</span><strong>{{company.products.length}} {{isAr?'صنفًا':'items'}}</strong></div><div class="company-product-tags"><button v-for="(p,pi) in company.products" :key="`${p.slug}-tag`" type="button" :class="{active:store.productIndex===pi}" @click="store.selectProduct(pi)">{{isAr?p.nameAr:p.nameEn}}</button></div></div>
    </div>
  </div>
</section>
</template>

<style>
.portfolio-app{--green:#0c4931;--deep:#073b29;--sand:#c09552;--cream:#f5eee4;--line:#e4ded5;--ink:#242824;color:var(--ink)}
.portfolio-company-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-bottom:28px}.company-tile{position:relative;overflow:hidden;min-height:245px;padding:0;border:1px solid rgba(12,73,49,.13);border-radius:20px;background:#fff;text-align:inherit;box-shadow:0 14px 36px rgba(12,73,49,.08);transition:.25s}.company-tile:hover,.company-tile.active{transform:translateY(-4px);border-color:rgba(192,149,82,.75);box-shadow:0 22px 42px rgba(12,73,49,.14)}.company-tile-photo{position:absolute;inset:0;background-repeat:no-repeat;transform:scale(1.04);transition:.35s}.company-tile:hover .company-tile-photo,.company-tile.active .company-tile-photo{transform:scale(1.09)}.company-tile-overlay{position:absolute;inset:0;background:linear-gradient(180deg,rgba(4,35,24,.02) 10%,rgba(5,46,31,.94) 100%)}.company-tile-content{position:absolute;inset-inline:18px;bottom:18px;color:#fff;display:grid;gap:5px}.company-tile-content strong{font-size:1.35rem}.company-tile-content small{color:rgba(255,255,255,.84);line-height:1.4}.company-kicker{font-size:.72rem;font-weight:800;color:#ead3a6}.company-count{font-size:.72rem;opacity:.76}
.portfolio-detail{display:grid;grid-template-columns:minmax(290px,.72fr) minmax(0,1.7fr);gap:22px}.company-summary,.product-stage{border:1px solid var(--line);border-radius:22px;background:#fff;box-shadow:0 16px 40px rgba(12,73,49,.07);overflow:hidden}.company-summary-cover{height:195px;overflow:hidden;background:#eef2ef}.company-summary-photo{display:block;width:100%;height:100%;background-repeat:no-repeat;transform:scale(1.02)}.company-summary-body{padding:24px}.portfolio-label{display:inline-flex;color:var(--green);font-size:.72rem;font-weight:800}.company-summary h3,.product-stage h3{font-size:1.85rem;margin:.4rem 0}.company-category{font-weight:800;color:var(--green)}.company-summary p{line-height:1.75;color:#646b66}.company-note{padding:12px;border-radius:12px;background:#faf5ed;font-size:.82rem}.claim-note{display:flex;gap:9px;margin-top:18px;padding:12px;border-radius:12px;background:#eef5f1;color:var(--green);font-size:.78rem;line-height:1.55}.company-actions{display:grid;gap:10px;margin-top:16px}.portfolio-brochure{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 14px;border-radius:10px;background:var(--green);color:#fff;text-decoration:none;font-weight:700}.portfolio-brochure:hover{color:#fff;background:var(--deep)}.portfolio-brochure-outline{border:1px solid rgba(12,73,49,.2);background:#fff;color:var(--green)}.portfolio-brochure-outline:hover{background:#eef5f1;color:var(--green)}
.product-stage{padding:24px}.product-stage-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;margin-bottom:18px}.illustrative-badge{display:inline-flex;align-items:center;gap:7px;padding:8px 10px;border:1px solid #e2d6c6;border-radius:999px;background:#faf5ed;color:#826633;font-size:.72rem;font-weight:700}.media-layout{display:grid;grid-template-columns:minmax(0,1.65fr) minmax(170px,.55fr);gap:10px}.product-visual{position:relative;border-radius:18px;background-repeat:no-repeat;overflow:hidden}.product-visual-main{min-height:430px}.product-visual-gradient{position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,rgba(4,35,24,.84))}.product-visual-caption{position:absolute;inset-inline:24px;bottom:22px;color:#fff}.product-visual-caption span{display:block;font-size:.8rem;opacity:.76}.product-visual-caption strong{font-size:1.6rem}.media-secondary{display:grid;grid-template-rows:1fr 1fr;gap:10px}.product-visual.detail{min-height:205px;display:flex;align-items:flex-end;padding:14px;color:#fff;font-size:.72rem;font-weight:800;box-shadow:inset 0 -70px 50px -50px rgba(4,35,24,.9)}.gallery-arrow{position:absolute;top:50%;translate:0 -50%;display:grid;place-items:center;width:44px;height:44px;border:1px solid rgba(255,255,255,.4);border-radius:50%;background:rgba(7,59,41,.72);color:#fff}.gallery-arrow.prev{inset-inline-start:16px}.gallery-arrow.next{inset-inline-end:16px}.product-tabs{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:9px;margin-top:12px}.product-tabs button{display:grid;grid-template-columns:58px 1fr;align-items:center;gap:8px;min-height:64px;padding:6px;border:1px solid var(--line);border-radius:12px;background:#fff;color:#525954;text-align:inherit;font-size:.78rem;font-weight:700}.product-tabs button:hover,.product-tabs button.active{border-color:var(--sand);background:#faf5ed;color:var(--green)}.product-thumb{display:block;width:58px;height:50px;border-radius:9px;background-repeat:no-repeat}.company-product-index{margin-top:18px;padding-top:18px;border-top:1px solid var(--line)}.company-product-index-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;color:var(--green);font-size:.82rem;font-weight:800}.company-product-index-head strong{padding:4px 8px;border-radius:999px;background:#eef5f1;font-size:.72rem}.company-product-tags{display:flex;flex-wrap:wrap;gap:8px}.company-product-tags button{padding:8px 11px;border:1px solid var(--line);border-radius:999px;background:#fff;color:#59615b;font-size:.78rem;font-weight:700}.company-product-tags button:hover,.company-product-tags button.active{border-color:var(--sand);background:#faf5ed;color:var(--green)}
@media(max-width:1100px){.portfolio-company-grid{grid-template-columns:repeat(2,1fr)}.portfolio-detail{grid-template-columns:1fr}.company-summary{display:grid;grid-template-columns:280px 1fr}.company-summary-cover{height:100%}.product-tabs{grid-template-columns:repeat(4,1fr)}}
@media(max-width:700px){.portfolio-company-grid{grid-template-columns:1fr 1fr;gap:10px}.company-tile{min-height:175px;border-radius:15px}.company-tile-content{inset-inline:12px;bottom:12px}.company-tile-content strong{font-size:1.05rem}.company-summary{display:block}.company-summary-cover{height:180px}.product-stage{padding:14px}.product-stage-head{display:block}.illustrative-badge{margin-top:8px}.media-layout{grid-template-columns:1fr}.product-visual-main{min-height:310px}.media-secondary{grid-template-columns:1fr 1fr;grid-template-rows:1fr}.product-visual.detail{min-height:120px}.product-tabs{display:flex;overflow:auto}.product-tabs button{min-width:170px}}
</style>
