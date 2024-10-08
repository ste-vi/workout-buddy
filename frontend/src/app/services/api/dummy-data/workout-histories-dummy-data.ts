import {Exercise} from "../../../models/exercise";
import {WorkoutHistory} from "../../../models/workout-history";
import {tags} from "./workflow-templates-dummy-daya";
import {exercises} from "./exercises-dummy-data";

export const workoutHistory: WorkoutHistory[] = [
  {
    id: 1,
    title: 'Bodyweight Training',
    date: new Date('2024-10-08'),
    duration: '30 min',
    totalSets: 10,
    prReps: 10,
    totalWeight: 100,
    totalExercises: 10,
    tags: [tags[0], tags[3]],  // Strength Training, Core
    exercises: [exercises[0], exercises[1], exercises[5]],
  },
  {
    id: 2,
    title: 'Cardio Workout',
    date: new Date('2024-09-29'),
    duration: '45 min',
    totalSets: 5,
    prReps: 15,
    totalWeight: 0,
    totalExercises: 3,
    tags: [tags[1]],  // Cardio
    exercises: [exercises[1], exercises[4]],
  },
  {
    id: 3,
    title: 'Strength Training',
    date: new Date('2024-09-27'),
    duration: '60 min',
    totalSets: 15,
    prReps: 8,
    totalWeight: 500,
    totalExercises: 6,
    tags: [tags[0]],  // Strength Training
    exercises: [exercises[2], exercises[3], exercises[4]],
  },
  {
    id: 4,
    title: 'Yoga Session',
    date: new Date('2024-09-12'),
    duration: '75 min',
    totalSets: 0,
    prReps: 0,
    totalWeight: 0,
    totalExercises: 12,
    tags: [tags[2], tags[4]],  // Flexibility, Yoga
    exercises: [exercises[5]],
  },
  {
    id: 5,
    title: 'HIIT Workout',
    date: new Date('2024-09-13'),
    duration: '25 min',
    totalSets: 8,
    prReps: 20,
    totalWeight: 50,
    totalExercises: 8,
    tags: [tags[1], tags[3]],  // Cardio, Core
    exercises: [exercises[0], exercises[1], exercises[5]],
  },
  {
    id: 6,
    title: 'Upper Body Focus',
    date: new Date('2024-09-14'),
    duration: '50 min',
    totalSets: 12,
    prReps: 12,
    totalWeight: 300,
    totalExercises: 5,
    tags: [tags[0]],  // Strength Training
    exercises: [exercises[0], exercises[2], exercises[4]],
  },
  {
    id: 7,
    title: 'Lower Body Workout',
    date: new Date('2024-10-01'),
    duration: '55 min',
    totalSets: 14,
    prReps: 10,
    totalWeight: 450,
    totalExercises: 6,
    tags: [tags[0]],  // Strength Training
    exercises: [exercises[1], exercises[3]],
  },
  {
    id: 8,
    title: 'Core Strength',
    date: new Date('2024-10-02'),
    duration: '40 min',
    totalSets: 10,
    prReps: 25,
    totalWeight: 20,
    totalExercises: 8,
    tags: [tags[3]],  // Core
    exercises: [exercises[5]],
  },
  {
    id: 9,
    title: 'Pilates Class',
    date: new Date('2024-10-03'),
    duration: '60 min',
    totalSets: 0,
    prReps: 0,
    totalWeight: 0,
    totalExercises: 15,
    tags: [tags[2], tags[3]],  // Flexibility, Core
    exercises: [exercises[5]],
  },
  {
    id: 10,
    title: 'CrossFit WOD',
    date: new Date('2024-09-18'),
    duration: '35 min',
    totalSets: 5,
    prReps: 30,
    totalWeight: 200,
    totalExercises: 4,
    tags: [tags[0], tags[1]],  // Strength Training, Cardio
    exercises: [exercises[0], exercises[1], exercises[2], exercises[3]],
  },
  {
    id: 11,
    title: 'Swimming Laps',
    date: new Date('2024-09-19'),
    duration: '45 min',
    totalSets: 0,
    prReps: 0,
    totalWeight: 0,
    totalExercises: 1,
    tags: [tags[1]],  // Cardio
    exercises: [],
  },
  {
    id: 12,
    title: 'Full Body Workout',
    date: new Date('2024-09-20'),
    duration: '70 min',
    totalSets: 18,
    prReps: 15,
    totalWeight: 600,
    totalExercises: 9,
    tags: [tags[0], tags[1], tags[3]],  // Strength Training, Cardio, Core
    exercises: [exercises[0], exercises[1], exercises[2], exercises[3], exercises[4], exercises[5]],
  },
  {
    id: 13,
    title: 'Full Body Workout August',
    date: new Date('2024-08-12'),
    duration: '70 min',
    totalSets: 18,
    prReps: 15,
    totalWeight: 600,
    totalExercises: 9,
    tags: [tags[0], tags[1], tags[3]],  // Strength Training, Cardio, Core
    exercises: [exercises[0], exercises[1], exercises[2], exercises[3], exercises[4], exercises[5]],
  },
  {
    id: 14,
    title: 'Full Body Workout October',
    date: new Date('2024-10-12'),
    duration: '70 min',
    totalSets: 18,
    prReps: 15,
    totalWeight: 600,
    totalExercises: 9,
    tags: [tags[0], tags[1], tags[3]],  // Strength Training, Cardio, Core
    exercises: [exercises[0], exercises[1], exercises[2], exercises[3], exercises[4], exercises[5]],
  },
];
