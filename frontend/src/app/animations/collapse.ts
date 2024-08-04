import { animate, style, transition, trigger } from '@angular/animations';

export const collapse = trigger('collapse', [
  transition(':enter', [
    style({ opacity: 0, height: 0 }),
    animate('0.25s ease', style({ opacity: 1, height: '*' })),
  ]),
  transition(':leave', [
    style({ opacity: 1, height: '*' }),
    animate('0.25s ease', style({ opacity: 0, height: 0 })),
  ]),
]);
