import { animate, style, transition, trigger } from '@angular/animations';

export const toastTop = trigger('toastTop', [
  transition(':enter', [
    style({ transform: 'translateY(-100%)', opacity: 0 }),
    animate('250ms cubic-bezier(0.35, 0, 0.25, 1)',
      style({ transform: 'translateY(0%)', opacity: 1 })
    ),
  ]),
  transition(':leave', [
    style({ transform: 'translateY(0%)', opacity: 1 }),
    animate('250ms cubic-bezier(0.35, 0, 0.25, 1)',
      style({ transform: 'translateY(-100%)', opacity: 0 })
    ),
  ]),
]);
