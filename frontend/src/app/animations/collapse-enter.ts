import { animate, style, transition, trigger } from '@angular/animations';

export const collapseEnter = trigger('collapseEnter', [
  transition(':enter', [
    style({ opacity: 0, height: 0, transform: 'scaleY(0.8)' }),
    animate('250ms cubic-bezier(0.35, 0, 0.25, 1)',
      style({ opacity: 1, height: '*', transform: 'scaleY(1)' })
    ),
  ]),
]);
