import { Suspense, lazy, useEffect, useState } from 'react';

/**
 * Puerta de entrada a la experiencia 3D del hero.
 *
 * Es una mejora progresiva pura: mientras no se cumplan todas las condiciones
 * este componente no renderiza nada y queda visible el fallback CSS que ya
 * pintó Astro (haces de luz, cuadrícula y grano). El hero nunca se ve vacío y
 * el contenido comercial jamás depende de WebGL.
 *
 * Se descarta la escena cuando:
 *  - el usuario pidió menos movimiento,
 *  - la pantalla es pequeña (el móvil no necesita cargar three.js),
 *  - no hay WebGL,
 *  - el dispositivo declara pocos núcleos o poca memoria,
 *  - el usuario activó el ahorro de datos.
 */

const ApexScene = lazy(() => import('./ApexScene'));

interface NetworkInformation {
  saveData?: boolean;
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl2') ?? canvas.getContext('webgl')),
    );
  } catch {
    return false;
  }
}

function deviceCanHandleIt(): boolean {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: NetworkInformation;
  };

  if (nav.connection?.saveData) return false;
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency < 4) return false;
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4) return false;

  return true;
}

export default function HeroExperience() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const bigEnough = window.matchMedia('(min-width: 768px)').matches;

    if (reduced || !bigEnough || !deviceCanHandleIt() || !supportsWebGL()) return;

    setEnabled(true);
  }, []);

  // Se deja de renderizar en cuanto el hero sale de pantalla.
  useEffect(() => {
    if (!enabled || typeof IntersectionObserver === 'undefined') return;

    const hero = document.getElementById('top');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? true),
      { rootMargin: '120px' },
    );
    observer.observe(hero);

    return () => observer.disconnect();
  }, [enabled]);

  if (!enabled || !visible) return null;

  return (
    <Suspense fallback={null}>
      <ApexScene />
    </Suspense>
  );
}
