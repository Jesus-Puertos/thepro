import type { APIRoute } from 'astro';

import { site } from '@/data/site';

/**
 * `robots.txt` generado, no estático: así la URL del sitemap sale siempre del
 * dominio configurado y no se queda un placeholder pegado en un archivo suelto
 * el día que cambie.
 */
export const GET: APIRoute = ({ site: configuredSite }) => {
  const origin = (configuredSite ?? new URL(site.url)).origin;

  const body = [
    'User-agent: *',
    'Allow: /',
    '',
    '# Borradores legales: se excluyen hasta que tengan revisión jurídica.',
    'Disallow: /terminos',
    'Disallow: /privacidad',
    'Disallow: /pagos',
    '',
    `Sitemap: ${origin}/sitemap-index.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
