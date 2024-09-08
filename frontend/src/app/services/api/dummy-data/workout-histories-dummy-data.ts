import { WorkoutHistory } from '../../../models/workout-history';

export const workoutHistory: WorkoutHistory[] = [
  {
    id: 1,
    title: 'Bodyweight Training',
    date: new Date('2024-08-09'),
    duration: '30 min',
    totalSets: 10,
    prReps: 10,
    totalWeight: 100,
    totalExercises: 10,
  },
  {
    id: 2,
    title: 'Cardio Workout',
    date: new Date('2024-08-10'),
    duration: '45 min',
    totalSets: 5,
    prReps: 15,
    totalWeight: 0,
    totalExercises: 3,
  },
];
