import { WorkoutTemplate } from '../../../models/workout-template';
import { Tag } from '../../../models/tag';

export const tags: Tag[] = [
  { id: 1, name: 'Strength Training' },
  { id: 2, name: 'Cardio' },
  { id: 3, name: 'Flexibility' },
  { id: 4, name: 'Core' },
  { id: 5, name: 'Yoga' },
];

export const suggestedWorkoutTemplate: WorkoutTemplate = {
  id: 1,
  name: 'High-Intensity Interval Training',
  description:
    'A high-intensity interval training (HIIT) workout is a cardiovascular exercise technique that combines high-intensity aerobic activities with short bursts of low-intensity activities called intervals.',
  exercises: [
    {
      id: 1,
      name: 'Squats',
      sets: [
        { id: 1, reps: 8, weight: 135 },
        { id: 2, reps: 7, weight: 135 },
      ],
      prSet: { id: 1, reps: 8, weight: 135 },
      bodyPart: 'Back',
    },
    {
      id: 2,
      name: 'Lunges',
      sets: [{ id: 1, reps: 8, weight: 135 }],
      prSet: { id: 1, reps: 8, weight: 135 },
      bodyPart: 'Back',
    },
    {
      id: 3,
      name: 'Push-ups',
      sets: [{ id: 1, reps: 8, weight: 135 }],
      prSet: { id: 1, reps: 8, weight: 135 },
      bodyPart: 'Back',
    },
    {
      id: 4,
      name: 'Pull-ups',
      sets: [{ id: 1, reps: 8, weight: 135 }],
      prSet: { id: 1, reps: 8, weight: 135 },
      bodyPart: 'Back',
    },
  ],
  estimatedDuration: '30 min',
  totalSets: 5,
  lastPerformedWorkout: {
    id: 1,
    duration: '35 min',
    date: new Date('2024-07-18'),
  },
  tags: tags,
  volumeTrend: {
    value: 'increase',
    percentage: 10,
  },
};

export const workoutTemplates: WorkoutTemplate[] = [
  suggestedWorkoutTemplate,
  {
    id: 1,
    name: 'Back + Biceps',
    description:
      'Back and biceps workouts involve exercises that target the back muscles and biceps muscles.',
    exercises: [
      {
        id: 1,
        name: 'Squats',
        sets: [
          { id: 1, reps: 8, weight: 135 },
          { id: 2, reps: 7, weight: 135 },
        ],
        prSet: { id: 1, reps: 8, weight: 135 },
        bodyPart: 'Back',
      },
      {
        id: 2,
        name: 'Lunges',
        sets: [{ id: 1, reps: 8, weight: 135 }],
        prSet: { id: 1, reps: 8, weight: 135 },
        bodyPart: 'Back',
      },
      {
        id: 3,
        name: 'Push-ups',
        sets: [{ id: 1, reps: 8, weight: 135 }],
        prSet: { id: 1, reps: 8, weight: 135 },
        bodyPart: 'Back',
      },
      {
        id: 4,
        name: 'Pull-ups',
        sets: [{ id: 1, reps: 8, weight: 135 }],
        prSet: { id: 1, reps: 8, weight: 135 },
        bodyPart: 'Back',
      },
      {
        id: 5,
        name: 'Pull-ups',
        sets: [{ id: 1, reps: 8, weight: 135 }],
        prSet: { id: 1, reps: 8, weight: 135 },
        bodyPart: 'Back',
      },
      {
        id: 6,
        name: 'Pull-ups',
        sets: [{ id: 1, reps: 8, weight: 135 }],
        prSet: { id: 1, reps: 8, weight: 135 },
        bodyPart: 'Back',
      },
      {
        id: 7,
        name: 'Pull-ups',
        sets: [{ id: 1, reps: 8, weight: 135 }],
        prSet: { id: 1, reps: 8, weight: 135 },
        bodyPart: 'Back',
      },
      {
        id: 7,
        name: 'Pull-ups',
        sets: [{ id: 1, reps: 8, weight: 135 }],
        prSet: { id: 1, reps: 8, weight: 135 },
        bodyPart: 'Back',
      },
    ],
    estimatedDuration: '30 min',
    totalSets: 5,
    lastPerformedWorkout: {
      id: 1,
      duration: '35 min',
      date: new Date('2024-07-18'),
    },
    tags: tags,
    volumeTrend: {
      value: 'increase',
      percentage: 10,
    },
  },
];
