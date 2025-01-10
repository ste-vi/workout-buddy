import { WorkoutTemplate } from '../../../models/workout-template';
import { Tag } from '../../../models/tag';
import { BodyPart, ExerciseCategory } from '../../../models/exercise';

export const tags: Tag[] = [
  { id: 1, name: 'Strength Training' },
  { id: 2, name: 'Cardio' },
  { id: 3, name: 'Flexibility' },
  { id: 4, name: 'Core' },
  { id: 5, name: 'Yoga' },
];

export const suggestedWorkoutTemplate: WorkoutTemplate = new WorkoutTemplate();
