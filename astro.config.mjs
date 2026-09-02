// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Dominio público actual. Sustituirlo aquí cuando se conecte el dominio definitivo;
// canonical, Open Graph y sitemap deben apuntar siempre a una URL que ya responda.
const SITE_URL = 'https://thepro-nu.vercel.app';

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
