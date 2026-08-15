<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { usePortfolioStore } from '../stores/portfolio';

const store = usePortfolioStore();
const records = ref<any[]>([]);
const isAr = computed(() => store.language === 'ar');
const companies = computed(() => records.value.filter(c => c?.status === 'active' && c?.nameAr && c?.nameEn));
const company = computed(() => companies.value[store.companyIndex] || companies.value[0] || null);
const products = computed(() => {
  if (!company.value) return [];
  const ar = company.value.productsAr || [];
  const en = company.value.productsEn || [];
  return ar.map((nameAr:string, index:number) => ({ nameAr, nameEn: en[index] || nameAr }));
});
let observer: MutationObserver | undefined;

async function loadCompanies(){
  try{
    const response = await fetch('/content/companies.json', { cache: 'no-store' });
    const payload = await response.json();
    records.value = Array.isArray(payload?.companies) ? payload.companies : [];
    if (store.companyIndex >= companies.value.length) store.selectCompany(0);
  }catch(error){
    console.error('Unable to load TARGET company records', error);
    records.value = [];
  }
}

onMounted(() => {
  const sync = () => store.setLanguage(document.documentElement.lang === 'en' ? 'en' : 'ar');
  sync();
  loadCompanies();
  observer = new MutationObserver(sync);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
});
onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <section class="portfolio-app" :dir="isAr ? 'rtl' : 'ltr'">
    <div v-if="companies.length" class="portfolio-company-grid" role="tablist" :aria-label="isAr ? 'الشركات والمنتجات محل الاهتمام' : 'Companies and products in focus'">
      <button v-for="(c, ci) in companies" :key="c.id" type="button" class="company-tile" :class="{ active: store.companyIndex === ci }" role="tab" :aria-selected="store.companyIndex === ci" @click="store.selectCompany(ci)">
        <span class="company-tile-top"><span class="company-tile-mark">{{ String(ci + 1).padStart(2, '0') }}</span><span class="company-tile-state">{{ isAr ? 'استعرض المنتجات' : 'View products' }}</span></span>
        <span class="company-tile-content"><span class="company-kicker">{{ isAr ? 'ضمن نطاق الاهتمام الحالي' : 'Within current focus' }}</span><strong>{{ isAr ? c.nameAr : c.nameEn }}</strong><small>{{ isAr ? c.categoryAr : c.categoryEn }}</small><span class="company-count">{{ (c.productsAr || []).length }} {{ isAr ? 'منتجات مدرجة' : 'listed products' }}</span></span>
      </button>
    </div>

    <article v-if="company" class="portfolio-detail" role="tabpanel">
      <header class="company-summary">
        <span class="portfolio-label">{{ isAr ? 'الشركة المختارة' : 'Selected Company' }}</span>
        <h3>{{ isAr ? company.nameAr : company.nameEn }}</h3>
        <p class="company-category">{{ isAr ? company.categoryAr : company.categoryEn }}</p>
        <div class="claim-note"><i class="bi bi-shield-check"></i><span>{{ isAr ? 'عرض الشركة والمنتجات هنا للتعريف فقط؛ ولا يعني وكالة أو تمثيلًا أو حصرية أو حقوق توزيع.' : 'Company and product display is for information only; no agency, representation, exclusivity or distribution rights are implied.' }}</span></div>
      </header>

      <section class="company-products" :aria-label="isAr ? 'المنتجات المدرجة' : 'Listed products'">
        <div class="company-products-head"><div><span class="portfolio-label">{{ isAr ? 'المنتجات المدرجة' : 'Listed Products' }}</span><h3>{{ isAr ? `منتجات ${company.nameAr}` : `${company.nameEn} products` }}</h3></div><span class="product-count">{{ products.length }} {{ isAr ? 'منتجات' : 'products' }}</span></div>
        <p class="products-intro">{{ isAr ? 'الأسماء التالية مستمدة مباشرة من مصدر البيانات المعتمد للموقع. الصور والشعارات والبروشورات تُستبدل أو تُفعّل عند اعتماد الأصل المناسب.' : 'The names below are loaded directly from the approved website data source. Images, logos and brochures are replaced or enabled when approved assets are available.' }}</p>
        <ul class="company-product-list"><li v-for="(p, pi) in products" :key="`${company.slug}-${pi}`"><span>{{ String(pi + 1).padStart(2, '0') }}</span>{{ isAr ? p.nameAr : p.nameEn }}</li></ul>
        <a v-if="company.brochure?.enabled" class="portfolio-contact" :href="`/${company.brochure.path}`" target="_blank" rel="noopener"><i class="bi bi-file-earmark-arrow-down"></i>{{ isAr ? 'تحميل بروشور المنتجات' : 'Download Product Brochure' }}</a>
        <div v-else class="brochure-pending" aria-disabled="true"><i class="bi bi-file-earmark"></i><span>{{ isAr ? 'بروشور المنتجات غير مفعّل حاليًا' : 'Product brochure is not currently enabled' }}</span></div>
      </section>
    </article>

    <div v-else class="portfolio-empty" role="status">{{ isAr ? 'لا توجد سجلات شركات مفعلة للعرض حاليًا.' : 'No company records are currently enabled for display.' }}</div>
  </section>
</template>

<style>
.portfolio-app{--green:#0c4931;--deep:#073b29;--sand:#c09552;--line:rgba(12,73,49,.12);--ink:#262626;color:var(--ink)}
.portfolio-company-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-bottom:24px}.company-tile{position:relative;min-height:190px;padding:20px;border:1px solid var(--line);border-radius:18px;background:#fff;color:var(--ink);text-align:inherit;box-shadow:0 8px 24px rgba(38,38,38,.045);transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease,background .2s ease,color .2s ease}.company-tile:hover,.company-tile.active{border-color:var(--sand);background:var(--green);color:#fff;box-shadow:0 18px 34px rgba(12,73,49,.14);transform:translateY(-2px)}.company-tile-top{position:absolute;inset-inline:16px;inset-block-start:15px;display:flex;align-items:center;justify-content:space-between;gap:8px}.company-tile-mark{color:var(--green);font:800 .72rem/1 Manrope,sans-serif}.company-tile-state{padding:5px 8px;border:1px solid rgba(12,73,49,.12);border-radius:999px;background:#f5f8f5;color:var(--green);font-size:.65rem;font-weight:800;opacity:0;transform:translateY(-3px);transition:.2s}.company-tile:hover .company-tile-state,.company-tile.active .company-tile-state{opacity:1;transform:none}.company-tile.active .company-tile-mark{color:#ead3a6}.company-tile.active .company-tile-state,.company-tile:hover .company-tile-state{border-color:rgba(255,255,255,.18);background:rgba(255,255,255,.12);color:#fff}.company-tile-content{display:grid;align-content:end;min-height:148px;gap:6px}.company-kicker,.portfolio-label{color:var(--green);font-size:.72rem;font-weight:800}.company-tile.active .company-kicker,.company-tile:hover .company-kicker{color:#ead3a6}.company-tile-content strong{font-size:1.34rem}.company-tile-content small{line-height:1.55;color:#69716b}.company-tile.active small,.company-tile:hover small{color:rgba(255,255,255,.83)}.company-count{margin-top:4px;font-size:.75rem;font-weight:700;color:#778078}.company-tile.active .company-count,.company-tile:hover .company-count{color:#fff}
.portfolio-detail{display:grid;grid-template-columns:minmax(280px,.82fr) minmax(0,1.5fr);gap:16px;padding:8px;border:1px solid rgba(12,73,49,.08);border-radius:24px;background:linear-gradient(145deg,#edf4ef,#fbf8f2)}.company-summary,.company-products{padding:28px;border-radius:18px;background:#fff}.company-summary{position:relative;overflow:hidden;border:0;background:linear-gradient(155deg,#0c5138,#073b29);color:#fff;box-shadow:0 18px 36px rgba(7,59,41,.15)}.company-summary::after{content:'';position:absolute;inset-inline-end:-80px;inset-block-start:-70px;width:230px;height:230px;border-radius:50%;background:radial-gradient(circle,rgba(216,184,121,.28),transparent 67%)}.company-summary>*{position:relative;z-index:1}.company-summary .portfolio-label{color:#e3c38d}.company-summary h3,.company-products h3{margin:.45rem 0;font-size:1.8rem}.company-summary h3{color:#fff}.company-category{color:#e6c993;font-weight:800;line-height:1.6}.claim-note{display:flex;gap:8px;margin-top:20px;padding:13px;border-radius:12px;background:rgba(255,255,255,.11);color:#fff;font-size:.8rem;line-height:1.6}.company-products{border:0;box-shadow:none}.company-products-head{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}.product-count{padding:7px 10px;border-radius:999px;background:#eef5f1;color:var(--green);font-size:.76rem;font-weight:800;white-space:nowrap}.products-intro{margin:15px 0 18px;color:#69716b;line-height:1.75;font-size:.9rem}.company-product-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin:0;padding:0;list-style:none}.company-product-list li{display:flex;align-items:center;gap:10px;min-height:48px;padding:10px 12px;border:1px solid var(--line);border-radius:11px;background:#fff;color:#3f4841;font-size:.88rem;font-weight:700}.company-product-list li span{color:var(--sand);font:800 .68rem/1 Manrope,sans-serif}.portfolio-contact{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:50px;margin-top:18px;padding:11px 15px;border-radius:12px;background:var(--green);color:#fff;text-decoration:none;font-weight:800}.portfolio-contact:hover{background:var(--deep);color:#fff}.brochure-pending{display:inline-flex;align-items:center;gap:8px;margin-top:18px;padding:10px 12px;border:1px solid var(--line);border-radius:12px;background:#f7f5f1;color:#74766f;font-size:.82rem;font-weight:700}.portfolio-empty{padding:28px;border:1px dashed var(--line);border-radius:16px;background:#fff;color:#69716b;text-align:center}
@media(max-width:1100px){.portfolio-company-grid{grid-template-columns:repeat(2,1fr)}.portfolio-detail{grid-template-columns:1fr}}
@media(max-width:700px){.portfolio-company-grid{grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}.company-tile{min-height:148px;padding:14px;border-radius:16px}.company-tile-top{inset-inline:13px;inset-block-start:12px}.company-tile-state{display:none}.company-tile-content{min-height:116px;gap:4px}.company-tile-content strong{font-size:1.1rem;line-height:1.2}.company-tile-content small{font-size:.72rem;line-height:1.45}.company-count{font-size:.66rem}.portfolio-detail{grid-template-columns:1fr;gap:0;padding:0;border-radius:20px;background:transparent}.company-summary{border-radius:20px 20px 0 0;padding:22px 18px}.company-products{border-radius:0 0 20px 20px;padding:20px 18px;box-shadow:0 12px 28px rgba(12,73,49,.07)}.company-summary h3,.company-products h3{font-size:1.45rem}.company-product-list{grid-template-columns:1fr}.company-product-list li{min-height:49px;border-radius:12px}.portfolio-contact,.brochure-pending{width:100%;justify-content:center}}
</style>
