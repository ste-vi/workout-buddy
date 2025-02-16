import { Workout } from './workout';

export interface OngoingProcess {
  workout?: Workout;
  onboardingInProgress: boolean;
}
