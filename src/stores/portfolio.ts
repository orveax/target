import { defineStore } from 'pinia';

export const usePortfolioStore = defineStore('target-portfolio', {
  state: () => ({
    companyIndex: 0,
    language: 'ar' as 'ar' | 'en',
  }),
  actions: {
    selectCompany(index: number) {
      this.companyIndex = index;
    },
    setLanguage(language: 'ar' | 'en') {
      this.language = language;
    },
  },
});
