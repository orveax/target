<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
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
  const visuals = company.value.productVisualIndices || [];
  return ar.map((nameAr:string, index:number) => ({
    nameAr,
    nameEn: en[index] || nameAr,
    visualIndex: Number.isFinite(visuals[index]) ? visuals[index] : index,
  }));
});
const featuredProducts = computed(() => products.value.slice(0, 6));
let observer: MutationObserver | undefined;
const atlas = '/assets/products/illustrative-product-atlas.webp';

function logoMark(c:any){
  const value = String(c?.nameEn || 'T').trim();
  return value.split(/\s+/).map((part:string) => part[0]).join('').slice(0,2).toUpperCase();
}
function coverStyle(c:any){
  const image = c?.visual?.coverImage || '/images/home-food-trade-editorial-v1.png';
  return {
    backgroundImage: `linear-gradient(180deg,rgba(12,73,49,.03),rgba(12,73,49,.42)),url("${image}")`,
    backgroundPosition: c?.visual?.coverPosition || 'center',
  };
}
function spriteStyle(index:number){
  const safe = Number.isFinite(index) ? Math.max(0, Math.min(24, index)) : 0;
  const col = safe % 5;
  const row = Math.floor(safe / 5);
  return {
    backgroundImage: `url("${atlas}")`,
    backgroundSize: '500% 500%',
    backgroundPosition: `${col * 25}% ${row * 25}%`,
  };
}
async function refreshIcons(){
  await nextTick();
  (window as any).lucide?.createIcons?.();
}
async function selectCompany(index:number){
  store.selectCompany(index);
  await refreshIcons();
}
async function loadCompanies(){
  try{
    const response = await fetch('/content/companies.json', { cache: 'no-store' });
    const payload = await response.json();
    records.value = Array.isArray(payload?.companies) ? payload.companies : [];
    if (store.companyIndex >= companies.value.length) store.selectCompany(0);
    await refreshIcons();
  }catch(error){
    console.error('Unable to load TARGET company records', error);
    records.value = [];
  }
}

onMounted(() => {
  const sync = async () => {
    store.setLanguage(document.documentElement.lang === 'en' ? 'en' : 'ar');
    await refreshIcons();
  };
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
      <button
        v-for="(c, ci) in companies"
        :key="c.id"
        type="button"
        class="company-tile"
        :class="{ active: store.companyIndex === ci }"
        role="tab"
        :aria-selected="store.companyIndex === ci"
        aria-controls="company-detail"
        @click="selectCompany(ci)"
      >
        <span class="company-tile-cover" :style="coverStyle(c)">
          <span class="company-tile-number">{{ String(ci + 1).padStart(2, '0') }}</span>
          <span class="company-tile-state">{{ isAr ? 'استعرض الشركة' : 'View company' }}</span>
        </span>
        <span class="company-tile-body">
          <span class="company-logo-slot">
            <img v-if="c.logo" :src="c.logo" :alt="isAr ? `شعار ${c.nameAr}` : `${c.nameEn} logo`" />
            <span v-else>{{ logoMark(c) }}</span>
          </span>
          <span class="company-tile-copy">
            <span class="company-kicker">{{ isAr ? 'ضمن نطاق الاهتمام الحالي' : 'Within current focus' }}</span>
            <strong>{{ isAr ? c.nameAr : c.nameEn }}</strong>
            <small>{{ isAr ? c.categoryAr : c.categoryEn }}</small>
          </span>
          <span class="company-count">{{ (c.productsAr || []).length }} {{ isAr ? 'منتجات' : 'products' }}</span>
        </span>
      </button>
    </div>

    <article v-if="company" id="company-detail" class="portfolio-detail" role="tabpanel">
      <section class="company-profile-card">
        <div class="company-profile-cover" :style="coverStyle(company)">
          <span class="visual-note">{{ isAr ? 'صورة تحريرية مؤقتة' : 'Temporary editorial visual' }}</span>
        </div>
        <div class="company-profile-body">
          <div class="company-profile-heading">
            <span class="company-logo-slot company-logo-slot--large">
              <img v-if="company.logo" :src="company.logo" :alt="isAr ? `شعار ${company.nameAr}` : `${company.nameEn} logo`" />
              <span v-else>{{ logoMark(company) }}</span>
            </span>
            <div>
              <span class="portfolio-label">{{ isAr ? 'الشركة المختارة' : 'Selected Company' }}</span>
              <h3>{{ isAr ? company.nameAr : company.nameEn }}</h3>
              <p class="company-category">{{ isAr ? company.categoryAr : company.categoryEn }}</p>
            </div>
          </div>
          <p class="company-summary-copy">{{ isAr ? company.summaryAr : company.summaryEn }}</p>
          <div class="claim-note"><i data-lucide="shield-check"></i><span>{{ isAr ? 'عرض تعريفي داخلي؛ لا يعني وكالة أو تمثيلًا أو حصرية أو حقوق توزيع.' : 'Internal informational display; no agency, representation, exclusivity or distribution rights are implied.' }}</span></div>
        </div>
      </section>

      <section class="company-products" :aria-label="isAr ? 'المنتجات المدرجة' : 'Listed products'">
        <div class="company-products-head">
          <div>
            <span class="portfolio-label">{{ isAr ? 'ألبوم المنتجات' : 'Product Album' }}</span>
            <h3>{{ isAr ? `منتجات ${company.nameAr}` : `${company.nameEn} products` }}</h3>
          </div>
          <span class="product-count">{{ products.length }} {{ isAr ? 'منتجات' : 'products' }}</span>
        </div>
        <p class="products-intro">{{ isAr ? 'معاينات بصرية مؤقتة مرتبطة بفئات المنتجات. تستبدل بصور العبوات الأصلية عند اعتمادها من دون تغيير تصميم الكارت.' : 'Temporary category-related product previews. Approved packshots can replace them later without changing the card design.' }}</p>

        <div class="product-gallery" role="list">
          <article v-for="p in featuredProducts" :key="`${company.slug}-gallery-${p.nameEn}`" role="listitem">
            <span class="product-gallery-image" :style="spriteStyle(p.visualIndex)"></span>
            <strong>{{ isAr ? p.nameAr : p.nameEn }}</strong>
          </article>
        </div>

        <div class="product-tags" :aria-label="isAr ? 'قائمة المنتجات' : 'Product list'">
          <span v-for="p in products" :key="`${company.slug}-tag-${p.nameEn}`">{{ isAr ? p.nameAr : p.nameEn }}</span>
        </div>

        <div class="company-resource-row">
          <a v-if="company.brochure?.enabled" class="portfolio-brochure" :href="`/${company.brochure.path}`" :download="`${company.slug}-product-brochure.pdf`">
            <i data-lucide="file-down"></i>
            <span>{{ isAr ? 'تحميل بروشور المنتجات PDF' : 'Download Product Brochure PDF' }}</span>
          </a>
          <small v-if="company.brochure?.status === 'temporary_internal_placeholder'">{{ isAr ? 'نسخة داخلية مؤقتة — تستبدل بالبروشور المعتمد.' : 'Temporary internal PDF — replace with the approved brochure.' }}</small>
        </div>
      </section>
    </article>

    <div v-else class="portfolio-empty" role="status">{{ isAr ? 'لا توجد سجلات شركات مفعلة للعرض حاليًا.' : 'No company records are currently enabled for display.' }}</div>
  </section>
</template>

<style>
.portfolio-app{--green:#0c4931;--deep:#073b29;--sand:#c09552;--charcoal:#262626;--cream:#f4ede4;--line:rgba(12,73,49,.12);color:var(--charcoal)}
.portfolio-company-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin-bottom:30px}.company-tile{padding:0;border:1px solid var(--line);border-radius:20px;background:#fff;color:var(--charcoal);text-align:inherit;overflow:hidden;box-shadow:0 10px 28px rgba(38,38,38,.055);transition:transform .22s ease,border-color .22s ease,box-shadow .22s ease}.company-tile:hover,.company-tile.active{transform:translateY(-3px);border-color:rgba(12,73,49,.32);box-shadow:0 20px 42px rgba(12,73,49,.13)}.company-tile:focus-visible{outline:3px solid rgba(192,149,82,.48);outline-offset:3px}.company-tile-cover{position:relative;display:block;aspect-ratio:16/9;background-size:cover;background-repeat:no-repeat;border-bottom:1px solid var(--line)}.company-tile-cover::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,rgba(5,38,25,.34))}.company-tile-number,.company-tile-state{position:absolute;z-index:2;top:14px;padding:7px 9px;border-radius:999px;backdrop-filter:blur(8px);font-size:.68rem;font-weight:800}.company-tile-number{inset-inline-start:14px;background:rgba(255,255,255,.9);color:var(--green)}.company-tile-state{inset-inline-end:14px;background:rgba(12,73,49,.86);color:#fff;opacity:0;transform:translateY(-3px);transition:.18s}.company-tile:hover .company-tile-state,.company-tile.active .company-tile-state{opacity:1;transform:none}.company-tile-body{display:grid;grid-template-columns:48px 1fr;gap:13px;padding:18px;align-items:start}.company-logo-slot{display:grid;place-items:center;width:48px;height:48px;border:1px solid rgba(12,73,49,.12);border-radius:14px;background:rgba(244,237,228,.78);color:var(--green);font:800 .78rem/1 Manrope,sans-serif;overflow:hidden}.company-logo-slot img{width:80%;height:80%;object-fit:contain}.company-logo-slot--large{width:62px;height:62px;border-radius:17px;font-size:.92rem}.company-tile-copy{display:grid;gap:4px}.company-kicker,.portfolio-label{color:var(--green);font-size:.72rem;font-weight:800}.company-tile-copy strong{font-size:1.22rem;line-height:1.2}.company-tile-copy small{color:#6b726d;line-height:1.5}.company-count{grid-column:1/-1;display:inline-flex;width:max-content;margin-inline-start:auto;padding:6px 9px;border-radius:999px;background:rgba(12,73,49,.055);color:var(--green);font-size:.7rem;font-weight:800}.company-tile.active .company-count{background:var(--green);color:#fff}
.portfolio-detail{display:grid;grid-template-columns:minmax(300px,.82fr) minmax(0,1.55fr);gap:20px;padding:10px;border:1px solid rgba(12,73,49,.09);border-radius:28px;background:linear-gradient(145deg,#edf4ef,#fbf8f2);box-shadow:0 24px 50px rgba(38,38,38,.06)}.company-profile-card,.company-products{overflow:hidden;border-radius:20px;background:#fff}.company-profile-card{border:1px solid rgba(12,73,49,.10);box-shadow:0 14px 34px rgba(12,73,49,.07)}.company-profile-cover{position:relative;aspect-ratio:16/9;background-size:cover;background-repeat:no-repeat}.company-profile-cover::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(12,73,49,.02),rgba(12,73,49,.30))}.visual-note{position:absolute;z-index:2;inset-inline-start:16px;bottom:14px;padding:7px 9px;border-radius:999px;background:rgba(255,255,255,.9);color:var(--green);font-size:.65rem;font-weight:800}.company-profile-body{padding:24px}.company-profile-heading{display:flex;gap:14px;align-items:flex-start}.company-profile-heading h3,.company-products h3{margin:.35rem 0;font-size:1.75rem}.company-category{margin:0;color:var(--green);font-weight:800;line-height:1.55}.company-summary-copy{margin:18px 0 0;color:#616963;line-height:1.82}.claim-note{display:flex;align-items:flex-start;gap:9px;margin-top:18px;padding:13px 14px;border-radius:13px;background:rgba(12,73,49,.06);color:var(--green);font-size:.8rem;line-height:1.65}.claim-note svg{flex:0 0 auto;width:20px;height:20px;margin-top:1px}.company-products{padding:28px;border:1px solid rgba(12,73,49,.09)}.company-products-head{display:flex;align-items:flex-start;justify-content:space-between;gap:16px}.product-count{padding:7px 10px;border-radius:999px;background:rgba(12,73,49,.07);color:var(--green);font-size:.76rem;font-weight:800;white-space:nowrap}.products-intro{margin:14px 0 20px;color:#69716b;line-height:1.75;font-size:.9rem}.product-gallery{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.product-gallery article{overflow:hidden;border:1px solid var(--line);border-radius:14px;background:#fff;box-shadow:0 8px 20px rgba(38,38,38,.035)}.product-gallery-image{display:block;aspect-ratio:1/1;background-repeat:no-repeat;background-color:#f4f0e8}.product-gallery article strong{display:block;padding:9px 10px 11px;font-size:.78rem;line-height:1.35}.product-tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}.product-tags span{padding:8px 11px;border:1px solid rgba(12,73,49,.13);border-radius:999px;background:#fff;color:#465049;font-size:.78rem;font-weight:700;transition:.18s}.product-tags span:hover{border-color:rgba(192,149,82,.72);background:#faf4e9;color:var(--charcoal)}.company-resource-row{display:flex;flex-wrap:wrap;align-items:center;gap:12px;margin-top:22px;padding-top:18px;border-top:1px solid rgba(12,73,49,.10)}.portfolio-brochure{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:50px;padding:11px 16px;border:1px solid var(--sand);border-radius:12px;background:var(--sand);color:var(--charcoal);text-decoration:none;font-weight:800;transition:.18s}.portfolio-brochure:hover{background:#d1ae73;color:var(--charcoal);transform:translateY(-1px)}.portfolio-brochure svg{width:20px;height:20px}.company-resource-row small{max-width:310px;color:#7a7c77;line-height:1.5}.portfolio-empty{padding:28px;border:1px dashed var(--line);border-radius:16px;background:#fff;color:#69716b;text-align:center}
@media(max-width:1100px){.portfolio-company-grid{grid-template-columns:repeat(2,1fr)}.portfolio-detail{grid-template-columns:1fr}.company-profile-card{display:grid;grid-template-columns:minmax(260px,.8fr) minmax(0,1.2fr)}.company-profile-cover{height:100%;aspect-ratio:auto}}
@media(max-width:700px){.portfolio-company-grid{grid-template-columns:1fr 1fr;gap:10px;margin-bottom:18px}.company-tile{border-radius:16px}.company-tile-body{grid-template-columns:42px 1fr;padding:13px;gap:10px}.company-logo-slot{width:42px;height:42px;border-radius:12px}.company-tile-copy strong{font-size:1.06rem}.company-tile-copy small{font-size:.7rem}.company-count{font-size:.64rem}.portfolio-detail{grid-template-columns:1fr;gap:12px;padding:0;border:0;background:transparent;box-shadow:none}.company-profile-card{display:block}.company-profile-cover{aspect-ratio:16/9}.company-profile-body,.company-products{padding:20px 18px}.company-profile-heading h3,.company-products h3{font-size:1.45rem}.product-gallery{grid-template-columns:repeat(2,minmax(0,1fr))}.company-resource-row{align-items:stretch}.portfolio-brochure{width:100%}.company-resource-row small{max-width:none}}
@media(max-width:420px){.portfolio-company-grid{grid-template-columns:1fr}.company-tile{display:grid;grid-template-columns:120px 1fr}.company-tile-cover{height:100%;aspect-ratio:auto}.company-tile-body{grid-template-columns:38px 1fr}.company-logo-slot{width:38px;height:38px}.company-tile-number{top:10px;inset-inline-start:10px}.company-tile-state{display:none}}
</style>
