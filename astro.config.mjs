import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

export default defineConfig({
  site: 'https://targetft.com',
  output: 'static',
  build: { format: 'file' },
  integrations: [vue({ appEntrypoint: '/src/pages/_app' })],
  vite: {
    define: {
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
    },
    ssr: {
      noExternal: ['pinia'],
    },
  },
});
