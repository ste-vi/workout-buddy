import { Sets } from './set';

export interface Exercise {
  id: number;
  name: string;
  sets: Sets[];
  prSet?: Sets;
  bodyPart?: BodyPart;
  category: Category;
}

export enum BodyPart {
  Legs = 'Legs',
  Chest = 'Chest',
  Back = 'Back',
  Arms = 'Arms',
  Shoulders = 'Shoulders',
  Core = 'Core',
  FullBody = 'Full Body',
}

export enum Category {
  Dumbbell = 'Dumbbell',
  Barbell = 'Barbell',
  Strength = 'Strength',
  BodyWeight = 'Body Weight',
  AssistedBodyWeight = 'Assisted Body Weight',
  Machine = 'Machine',
  Cardio = 'Cardio',
  Duration = 'Duration'
}
