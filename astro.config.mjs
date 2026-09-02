// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// TODO(pendiente): sustituir por el dominio definitivo antes de publicar.
// Se usa para canonical, Open Graph y sitemap.
const SITE_URL = 'https://theapexprime.com';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [
    react(),
    sitemap({
      // Las páginas legales están en borrador y salen con `noindex`; que no
      // entren tampoco al sitemap.
      filter: (page) => !/\/(terminos|privacidad|pagos)\/?$/.test(page),
    }),
  ],
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
