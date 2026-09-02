# The Apex Prime

Landing de ventas para **The Apex Prime**, un programa mensual de coaching para
jugadores de Apex Legends ($500 MXN/mes).

Construida con Astro 7, TypeScript estricto, Tailwind CSS 4 y CSS nativo, con
islas de React solo donde hay interactividad real.

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # astro check + build de producción
npm run preview  # sirve dist/
npm run test     # vitest (44 tests sobre las reglas del proyecto)
```

---

## Arquitectura

```text
assets/                     Recursos originales. No se mueven ni se renombran;
                            se importan con el alias @assets y los optimiza Astro.
public/favicon.png          Única copia de un asset, porque el favicon necesita
                            una ruta estable.
src/
├── components/
│   ├── layout/             Header, Footer, Container
│   ├── ui/                 Piezas reutilizables (botón, panel angular, iconos…)
│   ├── sections/           Las 11 secciones de la landing, una por archivo
│   └── islands/            Los únicos componentes de React
├── data/                   Todo el contenido editorial y la oferta
├── layouts/MainLayout.astro  SEO, fuentes, JSON-LD, arranque de scripts
├── lib/                    analytics.ts · attribution.ts · motion.ts
├── pages/                  index · 404 · robots.txt · 3 páginas legales
├── styles/                 global · typography · utilities · animations
└── types/index.ts          Interfaces compartidas
```

Alias: `@/*` → `src/*`, `@assets/*` → `assets/*`.

---

## Decisiones que conviene conocer

**Tailwind 4 por `@tailwindcss/vite`, no `@astrojs/tailwind`.** Esa integración
está obsoleta en Astro 5+. La paleta y las tipografías viven en el bloque
`@theme` de `src/styles/global.css`, así que `--color-red` funciona tanto como
variable CSS como utilidad `bg-red`.

**Sin `@react-three/drei` y sin modelos externos.** La escena del hero genera
toda su geometría en código, así que `useGLTF` no hace falta; y `Environment`,
la otra pieza útil de drei, descarga HDRIs de una CDN externa. Hay dos `.glb` en
`assets/` que no se cargan: ver [`THIRD_PARTY_ASSETS.md`](THIRD_PARTY_ASSETS.md) §6.

**Sin Framer Motion, sin Lenis, sin clsx.** GSAP y CSS cubren todo el
movimiento; `class:list` de Astro cubre las clases condicionales.

**Los iconos van por duplicado a propósito.** `lucide-react` dentro de las islas,
y los mismos `path` inlineados en `Icon.astro` para los componentes Astro. Así
una sección estática no arrastra React solo por un icono.

### Estrategia de hidratación

| Isla | Directiva | Por qué |
| --- | --- | --- |
| `MobileMenu` | `client:idle` | React son ~56 kB gzip; con `client:load` compiten con el LCP del hero en móvil, que es de donde llega casi todo el tráfico. El botón se pinta en el HTML y queda operativo en cuanto el hilo principal está libre. |
| `HeroExperience` | `client:idle` | Es decoración. El fallback CSS ya está pintado, así que no debe competir con el LCP. |
| `PillarsScroll` | `client:visible` | Está muy por debajo del pliegue. En escritorio monta el recorrido con scroll; en el resto renderiza los cuatro pilares apilados. |
| `TestimonialCarousel` | `client:visible` | Ídem. |
| `FaqAccordion` | `client:visible` | Ídem. Además funciona sin JavaScript. |

El CTA principal está en el header **también en móvil**, así que el camino a la
compra nunca depende de que una isla se hidrate.

### La experiencia 3D nunca bloquea nada

`HeroExperience` es una puerta: descarta la escena si el usuario pidió menos
movimiento, si la pantalla mide menos de 768 px, si no hay WebGL, si el
dispositivo declara menos de 4 núcleos o menos de 4 GB, o si hay ahorro de datos
activado. Cuando decide seguir, carga `ApexScene` con `import()` dinámico —
three.js jamás entra en el bundle inicial — y deja de renderizar en cuanto el
hero sale de pantalla.

Debajo siempre hay un fallback de CSS puro (haces de luz, cuadrícula técnica,
chevron y grano). El hero nunca se ve vacío.

### Animaciones que no pueden dejar contenido invisible

El contenido es visible por defecto. Un script inline en `<head>` añade
`.motion-ready` al `<html>` solo si hay JavaScript y el usuario no pidió menos
movimiento; esa clase es la que activa los estados iniciales ocultos. GSAP se
descarga únicamente en ese caso.

**Regla que no se puede romper:** ninguna regla CSS oculta un elemento que ya
tenga `data-revealed`. Cada revelado sigue siempre estos tres pasos, en este
orden:

```ts
gsap.set(elementos, ESTADO_INICIAL); // 1. el estado inicial pasa a estilo en línea
markRevealed(elementos);             // 2. el CSS deja de tener nada que decir
gsap.to(elementos, { opacity: 1 });  // 3. se anima, y clearProps ya es seguro
```

Sin el paso 2, el `clearProps` del final borra el estilo en línea y la regla CSS
vuelve a ocultar el elemento: el texto entra y se desvanece.

Cuatro seguros por encima de eso: si el `import()` de GSAP falla se retira la
compuerta; si `initMotion` lanza, el `catch` la retira; si nada de eso llega a
ejecutarse, un failsafe de 2,5 s la retira; y a los 4 s un barrido hace visible
cualquier elemento que siga oculto estando ya en pantalla. Sin JavaScript, nada
llega a ocultarse.

---

## Contenido

Todo el texto vive en `src/data/`. Ninguna sección tiene copy incrustado.

| Archivo | Contenido |
| --- | --- |
| `site.ts` | Marca, SEO, precio, checkout, métodos de pago, legal |
| `navigation.ts` | Enlaces del header |
| `stats.ts` | Barra de estadísticas y microprueba del hero |
| `problems.ts` · `method.ts` · `benefits.ts` · `process.ts` | Secciones 3 a 6 |
| `testimonials.ts` | Testimonios y roster |
| `faq.ts` | 12 preguntas |
| `legends.ts` | Diapositivas de la sección de pilares |

**Regla que atraviesa todo el proyecto:** no se inventan cifras, rangos, logros
ni políticas. Lo que falta está marcado con `TODO(pendiente)` y listado en
[`PENDIENTES.md`](PENDIENTES.md). Las cifras con `verified: false` y las FAQ con
`pending: true` nunca se emiten en datos estructurados.

---

## Analítica y atribución

Ninguna etiqueta de terceros se carga si no existe su variable de entorno, así
que en desarrollo la página no envía un solo byte fuera:

```bash
PUBLIC_GA4_ID=G-XXXXXXXXXX
PUBLIC_META_PIXEL_ID=000000000000000
```

### Atribución

El pago ocurre fuera del sitio, así que sin esto no hay forma de saber qué venta
vino de Instagram y cuál de Facebook. `src/lib/attribution.ts` captura los
parámetros de campaña, los guarda en `sessionStorage` con criterio de **primer
toque** y los pega a los enlaces `[data-checkout]` — que `PrimaryButton` marca
solo, comparando con `offer.checkoutUrl`, para que ningún CTA nuevo se quede sin
atribuir por olvido. Cada evento sale ya enriquecido con la campaña.

> ⚠️ La URL de checkout es un acortador. TinyURL suele reenviar la query string
> al destino, pero no lo garantiza: para que la atribución sea fiable conviene
> apuntar a la URL real de la plataforma de pago.

### Eventos

Los eventos se declaran en el marcado y los recoge una escucha delegada:

```astro
<a data-track="hero_cta_click">…</a>
<a data-track="payment_click" data-track-payload='{"method":"paypal"}'>…</a>
```

Desde una isla: `trackEvent('carousel_interaction', { slide: 'coaching' })`.

Todo evento se encola en `window.__apexPrimeEvents` y se reenvía a `dataLayer` y
`gtag` si existen, así que una etiqueta instalada más tarde puede reproducir lo
que pasó antes de cargarse. La profundidad de scroll (25/50/75/100) se mide sola.

`checkout_start` y los CTA se traducen a eventos estándar de Meta
(`InitiateCheckout`, `Lead`); el resto van como `trackCustom`.

Ver `src/lib/analytics.ts`.

---

## Tests

```bash
npm run test
```

44 tests con Vitest que no comprueban redacción, sino **las reglas que se pueden
romper sin darse cuenta** al editar un archivo de datos meses después: que
ninguna FAQ pendiente se cuele en el JSON-LD, que ningún testimonio sin cita
aparezca como spotlight, que las cifras sin verificar sigan marcadas, que cada
diapositiva declare un modo de render válido, y que la atribución no se pierda
ni se duplique.

Están verificados por mutación: al hacer que `structuredFaq` devuelva todas las
preguntas, fallan exactamente los dos tests que deben fallar.

---

## Páginas legales

`/terminos`, `/privacidad` y `/pagos` existen y recogen **solo lo confirmado**.
Todo lo demás sale marcado en dorado como «Por definir», visible en la propia
página.

Siguen en borrador: salen con `noindex`, fuera del sitemap, excluidas en
`robots.txt` y con un aviso arriba. Al cerrarlas hay que poner `draft={false}`
en cada página y quitar las reglas de `src/pages/robots.txt.ts` y del filtro del
sitemap en `astro.config.mjs`.

El aviso de privacidad se llama así, y no «política», porque es el instrumento
que exige la LFPDPPP a un negocio mexicano.

---

## Accesibilidad

Un solo `h1`, jerarquía de encabezados sin saltos, enlace para saltar al
contenido, foco visible en dorado, botones y enlaces reales (nunca `div`
clicables), `prefers-reduced-motion` respetado en CSS y en JavaScript.

El menú móvil cierra con Escape, devuelve el foco al botón que lo abrió, bloquea
el scroll del fondo y atrapa el foco dentro del panel. El carrusel de testimonios
responde a las flechas del teclado y a gestos táctiles. La sección de pilares se
recorre con el scroll —que ya es accesible por teclado— y además su barra de
progreso son botones reales que saltan a cada pilar. El acordeón de FAQ usa
`<details>`/`<summary>` nativos, así que funciona incluso sin JavaScript.

---

## Documentos relacionados

- [`context.md`](context.md) — brief original del cliente. **No se modifica.**
- [`THIRD_PARTY_ASSETS.md`](THIRD_PARTY_ASSETS.md) — licencias y riesgos de los recursos.
- [`PENDIENTES.md`](PENDIENTES.md) — datos por confirmar antes de publicar.
