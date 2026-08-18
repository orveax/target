<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { usePortfolioStore } from '../stores/portfolio';

type ProductCredit = {
  href?: string;
  ar?: string;
  en?: string;
};

type ProductRecord = {
  nameAr: string;
  nameEn: string;
  image?: string | null;
  visualIndex?: number;
  credit?: ProductCredit | null;
};

type CompanyVisual = {
  coverImage?: string | null;
  coverPosition?: string | null;
};

type CompanyBrochure = {
  enabled?: boolean;
  path?: string;
};

type CompanyRecord = {
  id: string;
  slug: string;
  status: string;
  nameAr: string | null;
  nameEn: string | null;
  categoryAr?: string | null;
  categoryEn?: string | null;
  summaryAr?: string | null;
  summaryEn?: string | null;
  products?: ProductRecord[];
  logo?: string | null;
  visual?: CompanyVisual | null;
  brochure?: CompanyBrochure | null;
};

type ActiveCompanyRecord = CompanyRecord & {
  status: 'active';
  nameAr: string;
  nameEn: string;
};

type LucideWindow = Window & {
  lucide?: { createIcons?: () => void };
};

const store = usePortfolioStore();
const records = ref<CompanyRecord[]>([]);
const isAr = computed(() => store.language === 'ar');
const companies = computed<ActiveCompanyRecord[]>(() => records.value.filter(
  (company): company is ActiveCompanyRecord =>
    company.status === 'active' && Boolean(company.nameAr && company.nameEn),
));
const company = computed(() => companies.value[store.companyIndex] ?? companies.value[0] ?? null);
const atlas = '/assets/products/illustrative-product-atlas.webp';
let observer: MutationObserver | undefined;

function productsFor(record: CompanyRecord): ProductRecord[] {
  if (!Array.isArray(record.products)) return [];
  return record.products.filter((product) => Boolean(product?.nameAr && product?.nameEn));
}

const products = computed<ProductRecord[]>(() => company.value ? productsFor(company.value) : []);

function productCount(record: CompanyRecord) {
  return productsFor(record).length;
}

function logoMark(record: CompanyRecord) {
  const value = String(record.nameEn || 'T').trim();
  return value
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function coverStyle(record: CompanyRecord) {
  const image = record.visual?.coverImage || '/images/home-food-trade-editorial-v1.png';
  return {
    backgroundImage: `linear-gradient(180deg,rgba(12,73,49,.03),rgba(12,73,49,.42)),url("${image}")`,
    backgroundPosition: record.visual?.coverPosition || 'center',
  };
}

function atlasStyle(index: number | undefined) {
  const safe = Number.isFinite(index) ? Math.max(0, Math.min(24, Number(index))) : 0;
  const col = safe % 5;
  const row = Math.floor(safe / 5);
  return {
    backgroundImage: `url("${atlas}")`,
    backgroundSize: '500% 500%',
    backgroundPosition: `${col * 25}% ${row * 25}%`,
    backgroundRepeat: 'no-repeat',
  };
}

function handleProductImageError(event: Event) {
  const img = event.currentTarget as HTMLImageElement | null;
  if (!img) return;
  img.style.display = 'none';
  img.closest('.product-photo-card')?.classList.add('is-atlas-fallback');
}

async function refreshIcons() {
  await nextTick();
  (window as LucideWindow).lucide?.createIcons?.();
}

async function selectCompany(index: number) {
  store.selectCompany(index);
  await refreshIcons();
}

async function loadCompanies() {
  try {
    const response = await fetch('/content/companies.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Company records request failed with ${response.status}`);
    const payload = await response.json() as { companies?: CompanyRecord[] };
    records.value = Array.isArray(payload.companies) ? payload.companies : [];
    if (store.companyIndex >= companies.value.length) store.selectCompany(0);
    await refreshIcons();
  } catch (error) {
    console.error('Unable to load TARGET company records', error);
    records.value = [];
  }
}

onMounted(() => {
  const syncLanguage = async () => {
    store.setLanguage(document.documentElement.lang === 'en' ? 'en' : 'ar');
    await refreshIcons();
  };

  void syncLanguage();
  void loadCompanies();

  observer = new MutationObserver(() => { void syncLanguage(); });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'dir'] });
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<template>
  <section class="portfolio-app" data-album-owner="vue" :dir="isAr ? 'rtl' : 'ltr'">
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
          <span class="company-count">{{ productCount(c) }} {{ isAr ? 'منتجات' : 'products' }}</span>
        </span>
      </button>
    </div>

    <article v-if="company" :key="company.id" id="company-detail" class="portfolio-detail" role="tabpanel">
      <section class="company-profile-card">
        <div class="company-profile-cover" :style="coverStyle(company)">
          <span class="visual-note">{{ isAr ? 'صورة تعريفية مؤقتة' : 'Temporary reference visual' }}</span>
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
          <div class="claim-note"><i data-lucide="shield-check"></i><span>{{ isAr ? 'عرض الشركة والمنتجات هنا لا يعني وكالة أو تمثيلًا أو حصرية أو حقوق توزيع ما لم يتم توثيق ذلك بشكل منفصل.' : 'Displaying the company and products here does not imply agency, representation, exclusivity or distribution rights unless separately documented.' }}</span></div>
        </div>
      </section>

      <section class="company-products" :aria-label="isAr ? `منتجات ${company.nameAr}` : `${company.nameEn} products`">
        <div class="company-products-head">
          <div>
            <span class="portfolio-label">{{ isAr ? 'ألبوم المنتجات' : 'Product Album' }}</span>
            <h3>{{ isAr ? `منتجات ${company.nameAr}` : `${company.nameEn} products` }}</h3>
          </div>
          <span class="product-count">{{ products.length }} {{ isAr ? 'منتجات' : 'products' }}</span>
        </div>
        <p class="products-intro products-intro--photo">{{ isAr ? 'كل بطاقة أدناه تخص المنتج المدرج لهذه الشركة فقط. الصور الحالية مرجعية للمنتج، وتُستبدل بصور العبوات الأصلية عند اعتمادها.' : 'Every card below belongs only to a product listed for this company. Current images are product references and can be replaced with approved packshots later.' }}</p>

        <div class="product-gallery product-gallery--photo" role="list">
          <article
            v-for="p in products"
            :key="`${company.id}-${p.nameEn}`"
            class="product-photo-card"
            role="listitem"
          >
            <figure class="product-photo-frame" :style="atlasStyle(p.visualIndex)">
              <img
                v-if="p.image"
                :src="p.image"
                :alt="isAr ? p.nameAr : p.nameEn"
                loading="lazy"
                decoding="async"
                @error="handleProductImageError"
              />
            </figure>
            <div class="product-photo-copy">
              <strong>{{ isAr ? p.nameAr : p.nameEn }}</strong>
              <a
                v-if="p.credit?.href"
                class="product-photo-credit"
                :href="p.credit.href"
                target="_blank"
                rel="noopener noreferrer"
              >{{ isAr ? (p.credit.ar || p.credit.en) : (p.credit.en || p.credit.ar) }}</a>
            </div>
          </article>
        </div>

        <div class="product-tags" :aria-label="isAr ? 'قائمة منتجات الشركة' : 'Company product list'">
          <span v-for="p in products" :key="`${company.id}-tag-${p.nameEn}`">{{ isAr ? p.nameAr : p.nameEn }}</span>
        </div>

        <div class="company-resource-row">
          <a
            v-if="company.brochure?.enabled && company.brochure.path"
            class="portfolio-brochure"
            :href="`/${company.brochure.path}`"
            :download="`${company.slug}-product-brochure.pdf`"
          >
            <i data-lucide="file-down"></i>
            <span>{{ isAr ? 'تحميل بروشور المنتجات PDF' : 'Download Product Brochure PDF' }}</span>
          </a>
        </div>
      </section>
    </article>

    <div v-else class="portfolio-empty" role="status">{{ isAr ? 'لا توجد سجلات شركات مفعلة للعرض حاليًا.' : 'No company records are currently enabled for display.' }}</div>
  </section>
</template>
