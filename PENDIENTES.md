# Datos pendientes de confirmar

Todo lo que aparece aquí está marcado en el código con `TODO(pendiente)` y
centralizado en archivos de datos, para que actualizarlo sea editar una línea y
no buscar por toda la landing.

Nada de esta lista se ha inventado ni se publica como afirmación cerrada.

---

## Bloqueantes antes de publicar

| # | Pendiente | Dónde se resuelve | Qué se muestra ahora |
| --- | --- | --- | --- |
| 1 | Significado exacto de «221 jugadores» | `src/data/stats.ts` (`verified: false`) y `heroProofItems` | Se muestra la cifra tal cual la dio el cliente, con la nota «Jugadores que forman o han formado parte del programa». **No entra en el JSON-LD.** |
| 2 | ¿La membresía se renueva automáticamente? | `src/data/faq.ts` → `renovacion` | La respuesta deriva al correo de contacto en lugar de afirmar una política. Excluida del `FAQPage`. |
| 3 | Política de cancelación | `src/data/faq.ts` → `cancelar` | Ídem. |
| 4 | Política de devolución / garantía | `src/data/faq.ts` → `devolucion` | Ídem. |
| 5 | Logros verificables de The Pro (alias profesional, rango máximo, equipos, torneos, años dando coaching, sesiones impartidas, resultados de alumnos) | `src/components/sections/CoachSection.astro` → `confirmedFacts` | Solo se publican los tres datos confirmados en `context.md`. context.md advierte que la autoridad no puede apoyarse únicamente en «llevo seis años jugando». |
| 6 | Dominio definitivo | `astro.config.mjs` (`SITE_URL`) y `src/data/site.ts` (`site.url`) | Placeholder `https://theapexprime.com`. Afecta a canonical, Open Graph y a la URL de la imagen social. |
| 7 | URLs reales de Instagram y Twitch | `src/data/site.ts` → `socials` | Enlaces `#`. |
| 8 | Páginas de términos, privacidad y política de pagos | `src/data/site.ts` → `legalLinks` | Enlaces `#`. |
| 9 | Autorización o sustitución de las ilustraciones de Apex Legends | `src/data/legends.ts` | Ver [`THIRD_PARTY_ASSETS.md`](THIRD_PARTY_ASSETS.md) §3. |

---

## Decisión de negocio que conviene revisar

**Publicación de la CLABE.** El bloque de precio muestra la CLABE de Banorte y
el titular de la cuenta, dentro de un `<details>` plegado por defecto para no
partir en tres el camino de compra (context.md §3) y no exponer los datos más de
lo necesario (context.md §19). Sigue siendo información bancaria en una página
pública e indexable.

Alternativas si se prefiere no exponerla:

1. Sustituir los datos por un enlace de WhatsApp o correo («te enviamos los datos
   de transferencia»).
2. Dejar solo PayPal como método alternativo.

Se cambia en `src/data/site.ts` → `alternativePayments`.

---

## Mejora la conversión, no bloquea

| Pendiente | Efecto |
| --- | --- |
| Citas textuales de zB I ZeNeR I, WILJO, KENAL_VZ, mattblwolf, MaikSensei y ORDAMA | Hoy solo Perit0s17 tiene testimonio completo. Al añadir `quote` (y `rankFrom`/`rankTo` si los hay) en `src/data/testimonials.ts`, el testimonio entra automáticamente en el carrusel y deja el roster. |
| Duración y horarios oficiales de los intensivos | Permitiría concretar las FAQ 01 y 05. |
| Cómo se envían las partidas para revisión, y si el feedback es individual, grupal o mixto | Cierra la FAQ `feedback`, hoy marcada como pendiente. |
| Cuánto tiempo permanecen disponibles las grabaciones | Cierra la FAQ `grabadas`. |
| Flujo exacto de acceso a Discord tras el pago | Concretaría el paso 02 de «Cómo funciona». |
| Disponibilidad y precio de referencia fuera de México | Hoy la página solo habla de MXN. |
| Principal objeción real de los compradores | Debería tener su propia FAQ o su propio bloque. |
| Si Sabionet permite ocultar su header y footer | Afecta a cómo se integra esta landing con la plataforma. |

---

## Cómo cerrar un pendiente

1. Edita el archivo de datos correspondiente.
2. Si es una cifra, pon `verified: true` — solo entonces puede aparecer en datos
   estructurados.
3. Si es una FAQ, borra la marca `pending: true`: la pregunta se incorporará sola
   al JSON-LD `FAQPage`.
4. Borra la fila de esta tabla y el comentario `TODO(pendiente)` del código.
