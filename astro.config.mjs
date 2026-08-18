import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

export default defineConfig({
  site: 'https://targetft.com',
  output: 'static',
  build: { format: 'file' },
  integrations: [vue()],
});
