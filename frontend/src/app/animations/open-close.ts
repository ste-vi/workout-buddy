import { animate, style, transition, trigger } from '@angular/animations';

export const openClose = trigger('openClose', [
  transition(':enter', [
    style({ opacity: 0, scale: 0.7 }),
    animate('0.25s', style({ opacity: 1, scale: 1 })),
  ]),
  transition(':leave', [
    style({ opacity: 1, scale: 1 }),
    animate('0.25s', style({ opacity: 0, scale: 0.7 })),
  ]),
]);
