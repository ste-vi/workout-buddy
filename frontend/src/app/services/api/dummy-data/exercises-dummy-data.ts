import { Exercise } from '../../../models/exercise';

export enum BodyPart {
  Legs = 'Legs',
  Chest = 'Chest',
  Back = 'Back',
  Arms = 'Arms',
  Shoulders = 'Shoulders',
  Core = 'Core',
  FullBody = 'Full Body'
}

export enum Category {
  Strength = 'Strength',
  Bodyweight = 'Bodyweight',
  Machine = 'Machine'
}

export const exercises: Exercise[] = [
  { id: 1, name: 'Squats', sets: [], prSet: { id: 1, reps: 10, weight: 100, previousReps: 8, previousWeight: 90, completed: false }, bodyPart: BodyPart.Legs, category: Category.Strength },
  { id: 2, name: 'Lunges', sets: [], prSet: { id: 2, reps: 12, weight: 50, previousReps: 10, previousWeight: 45, completed: false }, bodyPart: BodyPart.Legs, category: Category.Strength },
  { id: 3, name: 'Push-ups', sets: [], bodyPart: BodyPart.Chest, category: Category.Bodyweight },
  { id: 4, name: 'Pull-ups', sets: [], prSet: { id: 4, reps: 8, weight: 0, previousReps: 6, previousWeight: 0, completed: false }, bodyPart: BodyPart.Back, category: Category.Bodyweight },
  { id: 5, name: 'Deadlifts', sets: [], prSet: { id: 5, reps: 5, weight: 150, previousReps: 4, previousWeight: 140, completed: false }, bodyPart: BodyPart.Back, category: Category.Strength },
  { id: 6, name: 'Bench Press', sets: [], bodyPart: BodyPart.Chest, category: Category.Strength },
  { id: 7, name: 'Bicep Curls', sets: [], prSet: { id: 7, reps: 12, weight: 20, previousReps: 10, previousWeight: 18, completed: false }, bodyPart: BodyPart.Arms, category: Category.Strength },
  { id: 8, name: 'Tricep Dips', sets: [], bodyPart: BodyPart.Arms, category: Category.Bodyweight },
  { id: 9, name: 'Leg Press', sets: [], prSet: { id: 9, reps: 10, weight: 200, previousReps: 8, previousWeight: 180, completed: false }, bodyPart: BodyPart.Legs, category: Category.Machine },
  { id: 10, name: 'Calf Raises', sets: [], prSet: { id: 10, reps: 20, weight: 50, previousReps: 18, previousWeight: 45, completed: false }, bodyPart: BodyPart.Legs, category: Category.Strength },
  { id: 11, name: 'Shoulder Press', sets: [], prSet: { id: 11, reps: 10, weight: 40, previousReps: 8, previousWeight: 35, completed: false }, bodyPart: BodyPart.Shoulders, category: Category.Strength },
  { id: 12, name: 'Lat Pulldowns', sets: [], bodyPart: BodyPart.Back, category: Category.Machine },
  { id: 13, name: 'Chest Flyes', sets: [], prSet: { id: 13, reps: 12, weight: 30, previousReps: 10, previousWeight: 25, completed: false }, bodyPart: BodyPart.Chest, category: Category.Machine },
  { id: 14, name: 'Leg Curls', sets: [], bodyPart: BodyPart.Legs, category: Category.Machine },
  { id: 15, name: 'Leg Extensions', sets: [], prSet: { id: 15, reps: 15, weight: 40, previousReps: 12, previousWeight: 35, completed: false }, bodyPart: BodyPart.Legs, category: Category.Machine },
  { id: 16, name: 'Seated Row', sets: [], bodyPart: BodyPart.Back, category: Category.Machine },
  { id: 17, name: 'Plank', sets: [], prSet: { id: 17, reps: 1, weight: 0, previousReps: 1, previousWeight: 0, completed: false }, bodyPart: BodyPart.Core, category: Category.Bodyweight },
  { id: 18, name: 'Triceps Pushdown', sets: [], bodyPart: BodyPart.Core, category: Category.Bodyweight },
  { id: 19, name: 'Mountain Climbers', sets: [], prSet: { id: 19, reps: 30, weight: 0, previousReps: 25, previousWeight: 0, completed: false }, bodyPart: BodyPart.Core, category: Category.Bodyweight },
  { id: 20, name: 'Burpees', sets: [], bodyPart: BodyPart.FullBody, category: Category.Bodyweight },
  { id: 21, name: 'Jumping Jacks', sets: [], prSet: { id: 21, reps: 50, weight: 0, previousReps: 40, previousWeight: 0, completed: false }, bodyPart: BodyPart.FullBody, category: Category.Bodyweight },
  { id: 22, name: 'High Knees', sets: [], bodyPart: BodyPart.FullBody, category: Category.Bodyweight },
  { id: 23, name: 'Bicycle Crunches', sets: [], prSet: { id: 23, reps: 30, weight: 0, previousReps: 25, previousWeight: 0, completed: false }, bodyPart: BodyPart.Core, category: Category.Bodyweight },
  { id: 24, name: 'Dumbbell Rows', sets: [], bodyPart: BodyPart.Back, category: Category.Strength },
  { id: 25, name: 'Kettlebell Swings', sets: [], prSet: { id: 25, reps: 20, weight: 20, previousReps: 18, previousWeight: 15, completed: false }, bodyPart: BodyPart.FullBody, category: Category.Strength },
  { id: 26, name: 'Farmer\'s Walk', sets: [], bodyPart: BodyPart.FullBody, category: Category.Strength },
  { id: 27, name: 'Box Jumps', sets: [], prSet: { id: 27, reps: 15, weight: 0, previousReps: 12, previousWeight: 0, completed: false }, bodyPart: BodyPart.Legs, category: Category.Bodyweight },
  { id: 28, name: 'Medicine Ball Slams', sets: [], bodyPart: BodyPart.FullBody, category: Category.Strength },
  { id: 29, name: 'Battle Ropes', sets: [], prSet: { id: 29, reps: 30, weight: 0, previousReps: 25, previousWeight: 0, completed: false }, bodyPart: BodyPart.FullBody, category: Category.Strength },
  { id: 30, name: 'Tire Flips', sets: [], bodyPart: BodyPart.FullBody, category: Category.Strength },
];
