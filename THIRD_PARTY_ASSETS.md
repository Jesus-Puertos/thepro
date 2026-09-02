# Recursos de terceros

Inventario de todo lo que hay en `assets/`, cómo se usa (o por qué no se usa) y
qué queda pendiente de aclarar antes de publicar comercialmente.

> **Aviso general.** Ninguno de estos archivos se descargó durante el desarrollo:
> todos venían ya en el repositorio. No se ha extraído contenido de los archivos
> del juego ni se ha descargado ningún modelo 3D. La escena de Three.js usa
> geometría generada en código (`src/components/islands/ApexScene.tsx`), no
> modelos externos.

---

## 1. Propiedad del cliente — en uso

| Archivo | Uso | Notas |
| --- | --- | --- |
| `assets/the_pro_sin_fondo.png` | Figura del hero y primera diapositiva del carrusel | Recorte con canal alfa real (1024×1024, sujeto en x 196–803). Se integra con máscaras CSS, sin deformar la foto. |
| `assets/thepro.webp` | Retrato en la sección «Conoce a The Pro» y como imagen social (Open Graph) | 1080×1080. Se recorta a 1200×630 en build para Open Graph. |
| `assets/LOGO_alta_resolucion.png` | Logotipo del header y del footer | 645×483 con canal alfa. **No se ha alterado** ni recoloreado (context.md §12.8). Sustituye a `thepro_mini_logo.png`, que medía 70×70 y no tenía transparencia. Es 4:3, así que se dibuja en 48×36 y 64×48 — nunca en un cuadrado, que lo deformaría. |
| `public/favicon.png` | Favicon | Derivado del logo en alta resolución: 512×512 con el logo centrado sobre lienzo transparente, porque un favicon debe ser cuadrado. Es el único archivo copiado a `public/`, ya que el favicon necesita una ruta estable. |
| `assets/equipo_esports.png` | Imagen del pilar 04, «Discord y comunidad» | Foto real de un equipo, ya en negro con haces rojos y dorados: la paleta de la marca. El `alt` describe lo que se ve («tres jugadores de un equipo de esports con sus mandos») sin afirmar quiénes son ni vincularlos al programa. 1,9 MB de origen → 14–74 kB en WebP. |
| `assets/thepro_mini_logo.png` | Ya no se usa | Reemplazado por el logo en alta resolución. Se deja intacto. |

Licencia: se asume propiedad de The Apex Prime. **Pendiente:** confirmar por
escrito quién tiene los derechos de las fotografías (fotógrafo / cesión).

---

## 2. Marcas de plataforma — uso nominativo

| Archivo | Uso |
| --- | --- |
| `assets/steamLogo.svg` | Icono «PC» en `PlatformStrip.astro` |
| `assets/XboxLogo.svg` | Icono «Xbox» |
| `assets/PSlogo.svg` | Icono «PlayStation» |

Los tres se inlinean como SVG (no como `<img>`) para poder teñirlos con
`currentColor` y ahorrar peticiones. Se usan de forma **nominativa**: indican
únicamente en qué plataformas funciona el programa. Son marcas de Valve
Corporation, Microsoft y Sony Interactive Entertainment respectivamente.

Nintendo Switch no tiene logotipo en `assets/`, así que se representa con un
icono genérico de mando (Lucide, ISC).

**Pendiente:** si el cliente quiere usar los logotipos oficiales de forma
destacada (no como simple indicador de compatibilidad), debe revisar las guías
de marca de cada fabricante.

---

## 3. Material de Apex Legends / ALGS — EN USO, requiere autorización

> ⚠️ **Acción requerida antes del lanzamiento.**

### Imágenes de los pilares

| Archivo | Uso actual |
| --- | --- |
| `assets/plataforma_aprendizaje.png` | Imagen del pilar 02, «Plataforma de aprendizaje» |
| `assets/feedback.png` | Imagen del pilar 03, «Feedback y acompañamiento» |

Son key art de Apex Legends, propiedad de Electronic Arts / Respawn Entertainment.
Se muestran dentro de un panel, recortadas con `object-position` según el
centroide de luminancia de cada una (69–70 %, porque el sujeto está a la derecha).

**Cómo sustituirlas:** están centralizadas en
[`src/data/legends.ts`](src/data/legends.ts). Cambiar el `import` y el `focus`
de la diapositiva es todo lo que hace falta; no hay que tocar el componente.

### Ilustraciones de fondo

| Archivo | Uso actual |
| --- | --- |
| `assets/vantage.png` | Fondo de la sección «El problema». Es el antiguo `right-legend.png`, renombrado por el cliente. |
| `assets/left_legend.png` | Fondo de la sección «Método» |
| `assets/right_legend.png` | Fondo del CTA final |

Las tres pasan por `SectionBackdrop.astro`, que les aplica el mismo tratamiento:
monocromo, opacidad del 5–7 % y bordes desvanecidos con máscara radial. Nunca
como logotipo ni como sello de aprobación, y el footer incluye un descargo de no
afiliación. Aun así **son material protegido**.

Alternativas válidas para todo lo anterior: ilustración propia encargada,
siluetas abstractas o capturas de las propias sesiones de coaching.

---

## 4. Material de Apex Legends / ALGS — DELIBERADAMENTE NO USADO

Estos archivos están en `assets/` pero **no se referencian desde ningún sitio**.
Se han dejado intactos (no se han borrado ni movido) por si el cliente los
necesita en otro contexto.

| Archivo | Por qué no se usa |
| --- | --- |
| `assets/algs-logo.svg` | Logotipo oficial de Apex Legends Global Series. Usarlo daría a entender una afiliación o un respaldo que no existe. |
| `assets/apex_logo.svg` | Marca triangular de Apex Legends. En su lugar, la forma en «A» del hero y de la escena 3D es geometría original (`.hero-chevron` y `ApexScene.tsx`). |
| `assets/ALGS_Y6_WebsiteBanner.jpg` | Banner promocional oficial del Year 6. Reutilizarlo sería copiar material de campaña de EA. |
| `assets/ALGS_Background_Textures_Scannerline_Map.png` | Textura oficial. Las scanlines del sitio se generan con `repeating-linear-gradient` en CSS: cero riesgo de propiedad intelectual, cero bytes descargados y mejor rendimiento. |

---

## 4 bis. Archivos que no usa el sitio

| Archivo | Nota |
| --- | --- |
| `assets/registros.xlsx` | No se referencia desde ningún sitio y, al no importarse, Astro no lo copia a `dist/` — no se publicaría. Aun así **contiene registros de personas y está dentro del repositorio**: conviene sacarlo de `assets/` y guardarlo fuera del control de versiones. Solo se leyó su número de filas (2, encabezado incluido), nunca su contenido. |

---

## 5. Bibliotecas

| Recurso | Licencia | Uso |
| --- | --- | --- |
| [Lucide](https://lucide.dev) (`lucide-react`) | ISC | Iconos. En islas de React se importa el paquete; en componentes Astro los `path` están inlineados en `src/components/ui/Icon.astro` para no enviar JavaScript. |
| [Anton](https://fonts.google.com/specimen/Anton) | SIL Open Font License 1.1 | Tipografía display. Se sirve desde Google Fonts; no se incluye ningún archivo de fuente en el repositorio. |
| [Inter](https://fonts.google.com/specimen/Inter) | SIL Open Font License 1.1 | Tipografía de lectura. Ídem. |
| [GSAP](https://gsap.com) + ScrollTrigger | Licencia estándar «No Charge» de GSAP | Animaciones. Cubre sitios que no cobran por acceder al contenido. **Pendiente:** si en el futuro la landing pasa a ser un producto de pago con acceso restringido, revisar si hace falta una licencia comercial de GSAP. |
| [Three.js](https://threejs.org) | MIT | Escena 3D del hero. |
| [React Three Fiber](https://r3f.docs.pmnd.rs) | MIT | Renderizador de React para Three.js. |
| [Astro](https://astro.build), [React](https://react.dev), [Tailwind CSS](https://tailwindcss.com) | MIT | Base del proyecto. |

---

## 6. Modelos 3D — presentes en `assets/`, NO se usan

Hay dos `.glb` en `assets/`, ambos generados por Sketchfab y ambos del universo
de Apex Legends. **Ninguno se carga en la página**, por decisión del cliente.
Los archivos se dejan intactos por si se quieren retomar.

| Archivo | Peso | Contenido |
| --- | --- | --- |
| `apex_legend_loot_bot.glb` | 12,4 MB | 14 210 triángulos · 4 texturas (11,4 MB) |
| `loba_3d_model_apex_legends.glb` | 24,4 MB | 44 695 triángulos · 16 texturas (21,8 MB) |

Si en algún momento se retoman, esto es lo que ya se sabe de ellos:

- **La geometría es irrelevante; las texturas son el 92 % del peso.** Optimizar
  pasa por reescalarlas y convertirlas a WebP, no por comprimir mallas. Una
  prueba con `@gltf-transform` sobre el loot bot (512 px en el color base,
  256 px en los mapas técnicos, más `quantize()`) lo dejó en **623 kB, un −95 %**.
- **Draco y Meshopt no compensan aquí:** obligarían a descargar un decodificador
  en el cliente para ahorrar unos pocos kB en mallas que ya son pequeñas.
  `KHR_mesh_quantization` lo descomprime three.js de forma nativa.
- **Loba no serviría tal cual.** Sus 4 materiales usan
  `KHR_materials_pbrSpecularGlossiness`, una extensión obsoleta con cero soporte
  en three.js 0.185 (0 coincidencias en `GLTFLoader.js`). Los materiales caerían
  al de por defecto y se vería como plástico gris plano.
- **Pendiente de licencia.** Ninguno de los dos `.glb` trae campo `copyright` en
  su metadato `asset`, así que habría que localizar su ficha original en
  Sketchfab. Aplicaría además el mismo aviso de la sección 3.

La escena 3D del hero funciona sin ellos: toda su geometría se genera en código
—chevrons con `THREE.ExtrudeGeometry` y esquirlas con `InstancedMesh`— en
[`src/components/islands/ApexScene.tsx`](src/components/islands/ApexScene.tsx).
