import { defineConfig } from 'astro/config';
import vue from '@astrojs/vue';

export default defineConfig({
  output: 'static',
  build: { format: 'file' },
  integrations: [vue({ appEntrypoint: '/src/pages/_app' })]
});
