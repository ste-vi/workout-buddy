import { animate, style, transition, trigger } from '@angular/animations';

export const dialogOpenClose = trigger('dialogOpenClose', [
  transition(':enter', [
    style({ opacity: 0, scale: 0.7 }),
    animate('0.25s cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, scale: 1 })),
  ]),
  transition(':leave', [
    style({ opacity: 1, scale: 1 }),
    animate('0.25s cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 0, scale: 0.7 })),
  ]),
]);
