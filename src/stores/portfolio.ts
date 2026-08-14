import { defineStore } from 'pinia';

export const usePortfolioStore = defineStore('target-portfolio', {
  state: () => ({
    companyIndex: 0,
    productIndex: 0,
    language: 'ar' as 'ar' | 'en',
  }),
  actions: {
    selectCompany(index: number) {
      this.companyIndex = index;
      this.productIndex = 0;
    },
    selectProduct(index: number) {
      this.productIndex = index;
    },
    setLanguage(language: 'ar' | 'en') {
      this.language = language;
    },
  },
});
