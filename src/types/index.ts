/**
 * Tipos compartidos de The Apex Prime.
 * Todo el contenido editorial vive en `src/data/*` y se tipa contra este archivo.
 */
import type { ImageMetadata } from 'astro';

/** Plataformas soportadas por el programa (context.md §4). */
export type Platform = 'PC' | 'Xbox' | 'PlayStation' | 'Switch';

/**
 * Nombres de icono disponibles en `src/components/ui/Icon.astro`.
 * Los paths provienen de Lucide (ISC). En islas de React se usa `lucide-react`
 * directamente; en componentes Astro se usa `Icon.astro` para no enviar JS.
 */
export type IconName =
  | 'arrow-right'
  | 'arrow-left'
  | 'check'
  | 'chevron-down'
  | 'clock'
  | 'crosshair'
  | 'gamepad'
  | 'graduation-cap'
  | 'menu'
  | 'message-square'
  | 'monitor'
  | 'play'
  | 'radar'
  | 'route'
  | 'shield-check'
  | 'target'
  | 'trophy'
  | 'users'
  | 'video'
  | 'x'
  | 'zap';

export interface NavItem {
  readonly label: string;
  readonly href: string;
}

export interface SocialLink {
  readonly label: string;
  readonly href: string;
}

/**
 * Dato numérico destacado.
 * `verified: false` marca cifras que context.md §18 pide confirmar antes de
 * publicar. Las cifras no verificadas nunca se emiten en datos estructurados.
 */
export interface Stat {
  readonly id: string;
  readonly value: string;
  readonly label: string;
  readonly note?: string;
  readonly verified: boolean;
}

export interface ProblemItem {
  readonly id: string;
  readonly index: string;
  readonly title: string;
  readonly description: string;
}

export interface MethodStep {
  readonly index: string;
  readonly title: string;
  readonly description: string;
  readonly icon: IconName;
}

/** Uno de los cuatro pilares del programa (context.md §6). */
export interface Benefit {
  readonly id: string;
  readonly index: string;
  readonly kicker: string;
  readonly title: string;
  readonly description: string;
  readonly items: readonly string[];
  readonly icon: IconName;
}

export interface ProcessStep {
  readonly index: string;
  readonly title: string;
  readonly description: string;
  readonly icon: IconName;
}

/**
 * Testimonio en formato "Player Spotlight".
 * Solo se renderiza como tarjeta completa si existe `quote`. Los miembros sin
 * cita confirmada aparecen únicamente en el roster de la comunidad.
 */
export interface Testimonial {
  readonly id: string;
  readonly handle: string;
  readonly platform: Platform;
  readonly role?: string;
  readonly rankFrom?: string;
  readonly rankTo?: string;
  readonly availability?: string;
  readonly quote?: string;
  /** `false` = falta confirmar la cita textual o el resultado con el jugador. */
  readonly verified: boolean;
}

export interface FaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
  /**
   * `true` = la respuesta definitiva depende de un dato pendiente (context.md §18).
   * Estos ítems se muestran en la página pero se excluyen del JSON-LD FAQPage.
   */
  readonly pending?: boolean;
}

/** Contenido editorial de una diapositiva del carrusel de pilares. */
export interface CarouselSlideContent {
  readonly id: string;
  readonly index: string;
  readonly kicker: string;
  readonly title: string;
  readonly description: string;
  readonly highlight: string;
  /** Color de acento en formato `r g b`, para componer con `rgb(... / alpha)`. */
  readonly accent: string;
  /** Texto fantasma gigante detrás de la figura. */
  readonly ghost: string;
  readonly image: ImageMetadata;
  readonly imageAlt: string;
  /**
   * Posición horizontal del centro visual de la figura, en % del ancho de la
   * imagen. Varias ilustraciones tienen al personaje pegado a un borde: sin
   * esto quedarían recortadas fuera del escenario en móvil.
   */
  readonly focusX: number;
}

/**
 * Diapositiva ya resuelta que se pasa a la isla de React.
 * La optimización de imagen se hace en el componente Astro padre con `getImage()`,
 * para que la isla no dependa de `astro:assets`.
 */
export interface CarouselSlide
  extends Omit<CarouselSlideContent, 'image' | 'imageAlt'> {
  readonly image: {
    readonly src: string;
    readonly srcset: string;
    readonly width: number;
    readonly height: number;
    readonly alt: string;
  };
}

export interface PaymentMethod {
  readonly id: string;
  readonly label: string;
  readonly detail: string;
  readonly hint: string;
}
