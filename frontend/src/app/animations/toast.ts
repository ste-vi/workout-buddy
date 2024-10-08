import { animate, style, transition, trigger } from '@angular/animations';

export const toast = trigger('toast', [
  transition(':enter', [
    style({ transform: 'translateX(100%)', opacity: 0 }),
    animate('250ms cubic-bezier(0.35, 0, 0.25, 1)',
      style({ transform: 'translateX(0%)', opacity: 1 })
    ),
  ]),
  transition(':leave', [
    style({ transform: 'translateX(0%)', opacity: 1 }),
    animate('250ms cubic-bezier(0.35, 0, 0.25, 1)',
      style({ transform: 'translateX(-100%)', opacity: 0 })
    ),
  ]),
]);
