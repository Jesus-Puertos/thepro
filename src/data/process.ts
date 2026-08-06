import type { ProcessStep } from '@/types';

/** context.md §7 — cómo funciona, en tres pasos. */
export const processSteps: readonly ProcessStep[] = [
  {
    index: '01',
    title: 'Inscríbete',
    description:
      'Pagas los $500 MXN de la membresía desde la plataforma. También aceptamos PayPal y transferencia.',
    icon: 'zap',
  },
  {
    index: '02',
    title: 'Obtén acceso',
    description:
      'Con el pago directo el acceso a la plataforma y al Discord es inmediato o más rápido. Con PayPal o transferencia envías tu comprobante y puede tardar hasta 24 horas.',
    icon: 'shield-check',
  },
  {
    index: '03',
    title: 'Entrena y progresa',
    description:
      'Entras a las sesiones de lunes a viernes, estudias el contenido de la plataforma y recibes feedback sobre lo que estás corrigiendo.',
    icon: 'route',
  },
];
