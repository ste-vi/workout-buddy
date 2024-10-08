import {
  animate,
  style,
  transition,
  trigger,
  state,
} from '@angular/animations';

export const collapse = trigger('collapse', [
  state(
    'void',
    style({
      height: '0',
      opacity: '0',
      transform: 'scaleY(0.8)',
      marginTop: '0',
      marginBottom: '0',
      paddingTop: '0',
      paddingBottom: '0',
    }),
  ),
  state(
    '*',
    style({
      height: '*',
      opacity: '1',
      transform: 'scaleY(1)',
      marginTop: '*',
      marginBottom: '*',
      paddingTop: '*',
      paddingBottom: '*',
    }),
  ),
  transition('void <=> *', [animate('250ms cubic-bezier(0.35, 0, 0.25, 1)')]),
]);
