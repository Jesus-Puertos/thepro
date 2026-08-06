// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// TODO(pendiente): sustituir por el dominio definitivo antes de publicar.
// Se usa para canonical, Open Graph y sitemap.
const SITE_URL = 'https://theapexprime.com';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [react()],
  prefetch: false,
  build: {
    // Un único archivo CSS: la landing es de una sola página.
    inlineStylesheets: 'auto',
  },
  vite: {
    plugins: [tailwindcss()],
    build: {
      // three.js + r3f viven en su propio chunk cargado con import() dinámico.
      chunkSizeWarningLimit: 900,
    },
  },
});
