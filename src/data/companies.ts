const atlas = '/assets/products/illustrative-product-atlas.webp';
const spriteCols = 5;
const spriteRows = 5;

export const companies = [
  {
    id: 'falcon', nameAr: 'فالكون', nameEn: 'Falcon',
    categoryAr: 'الشاي والمشروبات العشبية', categoryEn: 'Tea & Herbal Infusions',
    descriptionAr: 'مجموعة مختارة من الشاي والأعشاب ضمن نطاق الاهتمام التجاري الحالي.',
    descriptionEn: 'A selected tea and herbal portfolio within the current commercial focus.',
    sprite: atlas, spriteCols, spriteRows,
    products: [
      {slug:'tea',nameAr:'شاي',nameEn:'Tea',spriteIndex:7},
      {slug:'anise',nameAr:'ينسون',nameEn:'Anise',spriteIndex:0},
      {slug:'chamomile',nameAr:'كمومايل',nameEn:'Chamomile',spriteIndex:1},
      {slug:'cinnamon',nameAr:'قرفة',nameEn:'Cinnamon',spriteIndex:2},
      {slug:'green-tea',nameAr:'شاي أخضر',nameEn:'Green Tea',spriteIndex:3},
      {slug:'mint',nameAr:'نعناع',nameEn:'Mint',spriteIndex:6},
      {slug:'linden',nameAr:'تليا',nameEn:'Linden / Tilia',spriteIndex:5},
      {slug:'white-tea',nameAr:'شاي أبيض',nameEn:'White Tea',spriteIndex:9},
      {slug:'thyme',nameAr:'زعتر',nameEn:'Thyme',spriteIndex:8},
      {slug:'hibiscus',nameAr:'كركديه',nameEn:'Hibiscus',spriteIndex:4}
    ], brochure: null,
  },
  {
    id: 'al-nada', nameAr: 'الندى', nameEn: 'Al Nada',
    categoryAr: 'منتجات الألبان والأغذية المجمدة والمجهزة', categoryEn: 'Dairy, Frozen & Prepared Foods',
    descriptionAr: 'منتجات ألبان وأغذية مجهزة ضمن نطاق التقييم التجاري الحالي.',
    descriptionEn: 'Dairy and prepared foods within the current commercial evaluation scope.',
    sprite: atlas, spriteCols, spriteRows,
    products: [
      {slug:'roumy-cheese',nameAr:'جبنة رومي',nameEn:'Roumy Cheese',spriteIndex:14},
      {slug:'pigeon',nameAr:'حمام',nameEn:'Pigeon',spriteIndex:13},
      {slug:'kofta',nameAr:'كفتة',nameEn:'Kofta',spriteIndex:10},
      {slug:'mahshi',nameAr:'محشي',nameEn:'Mahshi / Stuffed Vegetables',spriteIndex:11},
      {slug:'mombar',nameAr:'ممبار',nameEn:'Mombar',spriteIndex:12}
    ],
    noteAr: 'فحم الشيشة محفوظ في بيانات المصدر كمنتج تجاري مجاور غير غذائي، ولا يُعرض ضمن محفظة الأغذية أو كادعاء تجاري عام.',
    noteEn: 'Shisha charcoal remains in source data as an adjacent non-food item and is not shown as part of the food portfolio or as a public trading claim.',
    brochure: null,
  },
  {
    id: 'al-dar', nameAr: 'الدار', nameEn: 'Al Dar',
    categoryAr: 'العسل والدبس والحلويات التقليدية', categoryEn: 'Honey, Molasses & Traditional Sweets',
    descriptionAr: 'عسل ودبس وحلويات تقليدية ضمن نطاق الاهتمام التجاري الحالي.',
    descriptionEn: 'Honey, molasses and traditional sweets within the current commercial focus.',
    sprite: atlas, spriteCols, spriteRows,
    products: [
      {slug:'bee-honey',nameAr:'عسل نحل',nameEn:'Bee Honey',spriteIndex:15},
      {slug:'molasses',nameAr:'عسل أسود',nameEn:'Sugarcane Molasses',spriteIndex:17},
      {slug:'levantine-sweets',nameAr:'حلويات شامية',nameEn:'Levantine Sweets',spriteIndex:16}
    ], brochure: null,
  },
  {
    id: 'al-reem', nameAr: 'الريم', nameEn: 'Al Reem',
    categoryAr: 'العصائر والمشروبات التقليدية', categoryEn: 'Juices & Traditional Beverages',
    descriptionAr: 'عصائر ومشروبات تقليدية بنكهات مختارة ضمن نطاق الاهتمام الحالي.',
    descriptionEn: 'Selected juices and traditional beverages within the current commercial focus.',
    sprite: atlas, spriteCols, spriteRows,
    products: [
      {slug:'orange',nameAr:'برتقال',nameEn:'Orange',spriteIndex:22},
      {slug:'hibiscus-drink',nameAr:'كركديه',nameEn:'Hibiscus',spriteIndex:20},
      {slug:'carob',nameAr:'خروب',nameEn:'Carob',spriteIndex:18},
      {slug:'tamarind',nameAr:'تمر هندي',nameEn:'Tamarind',spriteIndex:24},
      {slug:'guava',nameAr:'جوافة',nameEn:'Guava',spriteIndex:19},
      {slug:'mango',nameAr:'مانجو',nameEn:'Mango',spriteIndex:21},
      {slug:'pomegranate',nameAr:'رمان',nameEn:'Pomegranate',spriteIndex:23}
    ], brochure: null,
  }
] as const;

export type TargetCompany = typeof companies[number];
