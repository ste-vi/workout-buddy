import { animate, style, transition, trigger } from '@angular/animations';

export const collapseEnter = trigger('collapseEnter', [
  transition(':enter', [
    style({ opacity: 0, height: 0 }),
    animate('0.25s ease', style({ opacity: 1, height: '*' })),
  ]),
]);
