import { animate, style, transition, trigger } from '@angular/animations';

export const fadeInOut = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0, filter: 'blur(2px)' }),
    animate('0.25s cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, filter: 'blur(0)' })),
  ]),
  transition(':leave', [
    style({ opacity: 1, filter: 'blur(0)' }),
    animate('0.25s cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 0, filter: 'blur(2px)' })),
  ]),
]);
