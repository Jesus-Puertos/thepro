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
| `assets/thepro_mini_logo.png` | Logotipo del header, del footer y favicon (`public/favicon.png`) | **No se ha alterado** ni recoloreado (context.md §12.8). Es el único archivo copiado a `public/`, porque el favicon debe servirse desde una ruta estable. |

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

| Archivo | Uso actual | Riesgo |
| --- | --- | --- |
| `assets/left_legend.png` | Figura del pilar 03 en el carrusel | Ilustración de personaje de Apex Legends. Propiedad de Electronic Arts / Respawn Entertainment. |
| `assets/right_legend.png` | Figura del pilar 04 | Ídem. |
| `assets/right-legend.png` | Figura del pilar 02 | Ídem. |

Se aplican en monocromo (`grayscale(1)`) como elementos decorativos de fondo,
nunca como logotipo ni como sello de aprobación, y el footer incluye un descargo
de no afiliación. Aun así **son material protegido**.

**Cómo sustituirlas:** las tres están centralizadas en
[`src/data/legends.ts`](src/data/legends.ts). Cambiar el `import` y el valor
`focusX` de cada diapositiva es todo lo que hace falta; no hay que tocar el
componente. Alternativas válidas: ilustración propia encargada, siluetas
abstractas o capturas de las propias sesiones de coaching.

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
