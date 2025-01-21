import { Sets } from './set';

export interface Exercise {
  id?: number;
  name: string;
  sets: Sets[];
  prSet?: Sets;
  bodyPart?: BodyPart;
  category: ExerciseCategory;
  synced?: boolean;
  position?: number;
  notes?: string;
}

export enum BodyPart {
  LEGS = 'LEGS',
  CHEST = 'CHEST',
  BACK = 'BACK',
  ARMS = 'ARMS',
  SHOULDERS = 'SHOULDERS',
  CORE = 'CORE',
  FULL_BODY = 'FULL_BODY',
}

export enum ExerciseCategory {
  DUMBBELL = 'DUMBBELL',
  BARBELL = 'BARBELL',
  STRENGTH = 'STRENGTH',
  BODY_WEIGHT = 'BODY_WEIGHT',
  ASSISTED_BODY_WEIGHT = 'ASSISTED_BODY_WEIGHT',
  MACHINE = 'MACHINE',
  CARDIO = 'CARDIO',
  DURATION = 'DURATION',
}

export function getBodyPartDisplayName(bodyPart?: BodyPart): string {
  if (!bodyPart) {
    return '';
  }
  return bodyPart
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function getCategoryDisplayName(category?: ExerciseCategory): string {
  if (!category) {
    return '';
  }
  return category
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
