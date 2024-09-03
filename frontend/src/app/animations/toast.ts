import { animate, style, transition, trigger } from '@angular/animations';

export const toast = trigger('toast', [
  transition(':enter', [
    style({ transform: 'translateX(100%)' }),
    animate('0.25s ease', style({ transform: 'translateX(0%)' })),
  ]),
  transition(':leave', [
    style({ transform: 'translateX(0%)' }),
    animate('0.25s ease', style({ transform: 'translateX(-100%)' })),
  ]),
]);
