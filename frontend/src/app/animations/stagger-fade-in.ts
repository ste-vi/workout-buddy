import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
} from '@angular/animations';

export const staggerFadeIn = trigger('staggerFadeIn', [
  transition('* => *', [
    query(
      ':enter',
      [
        style({
          opacity: 0,
          transform: 'translateY(15px) scale(0.98)',
          filter: 'blur(4px)',
        }),
        stagger('60ms', [
          animate(
            '250ms cubic-bezier(0.35, 0, 0.25, 1)',
            style({
              opacity: 1,
              transform: 'translateY(0) scale(1)',
              filter: 'blur(0)',
            }),
          ),
        ]),
      ],
      { optional: true },
    ),
  ]),
]);
