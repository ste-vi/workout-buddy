import { BodyPart, ExerciseCategory, Exercise } from '../../../models/exercise';
import { tags } from './workflow-templates-dummy-daya';
import { Sets } from '../../../models/set';
import { Workout } from '../../../models/workout';

function generateExercises(count: number, workoutType: string): Exercise[] {
  const exercisePool = {
    strength: [
      'Squats',
      'Deadlifts',
      'Bench Press',
      'Overhead Press',
      'Rows',
      'Pull-ups',
    ],
    cardio: ['Running', 'Cycling', 'Jump Rope', 'Burpees', 'Mountain Climbers'],
    yoga: [
      'Downward Dog',
      'Warrior Pose',
      'Tree Pose',
      "Child's Pose",
      'Sun Salutation',
    ],
    core: [
      'Planks',
      'Crunches',
      'Some Twists',
      'Leg Raises',
      'Bicycle Crunches',
    ],
    upperBody: [
      'Push-ups',
      'Dips',
      'Shoulder Press',
      'Bicep Curls',
      'Tricep Extensions',
    ],
    lowerBody: [
      'Lunges',
      'Leg Press',
      'Calf Raises',
      'Leg Curls',
      'Hip Thrusts',
    ],
    crossfit: [
      'Box Jumps',
      'Kettlebell Swings',
      'Thrusters',
      'Wall Balls',
      'Double Unders',
    ],
    swimming: [
      'Freestyle Laps',
      'Breaststroke Laps',
      'Backstroke Laps',
      'Butterfly Laps',
    ],
    pilates: [
      'The Hundred',
      'Roll Up',
      'Single Leg Circles',
      'Spine Stretch',
      'Saw',
    ],
  };

  const selectedExercises =
    exercisePool[workoutType as keyof typeof exercisePool] ||
    exercisePool.strength;

  return Array(count)
    .fill(null)
    .map((_, index) => {
      const exerciseName = selectedExercises[index % selectedExercises.length];
      const setCount = Math.floor(Math.random() * 4) + 1; // 1 to 4 sets
      const sets: Sets[] = Array(setCount)
        .fill(null)
        .map((_, setIndex) => ({
          id: setIndex + 1,
          reps: Math.floor(Math.random() * 12) + 5, // 5 to 16 reps
          weight:
            workoutType === 'cardio' || workoutType === 'yoga'
              ? 0
              : Math.floor(Math.random() * 100) + 10, // 10 to 109 weight
          previousReps: Math.floor(Math.random() * 12) + 5,
          previousWeight:
            workoutType === 'cardio' || workoutType === 'yoga'
              ? 0
              : Math.floor(Math.random() * 100) + 10,
          completed: true,
        }));

      return {
        id: index + 1,
        name: exerciseName,
        sets: sets,
        bodyPart: BodyPart.FULL_BODY,
        category: ExerciseCategory.STRENGTH,
        prSet: sets[0], // Add the PR set to the exercise
        synced: true,
        position: index + 1,
      };
    });
}

export const workout: Workout[] = [
  new Workout(
    1,
    'Bodyweight Training',
    new Date('2024-10-08T09:00:00'),
    new Date('2024-10-08T09:30:00'),
    10,
    10,
    100,
    [tags[0], tags[3]], // Strength Training, Core
    generateExercises(10, 'strength'),
  ),
  new Workout(
    2,
    'Cardio Workout',
    new Date('2024-09-29T15:00:00'),
    new Date('2024-09-29T15:45:00'),
    5,
    15,
    0,
    [tags[1]], // Cardio
    generateExercises(3, 'cardio'),
  ),
  new Workout(
    3,
    'Strength Training',
    new Date('2024-09-27T18:00:00'),
    new Date('2024-09-27T19:00:00'),
    15,
    8,
    500,
    [tags[0]], // Strength Training
    generateExercises(6, 'strength'),
  ),
  new Workout(
    4,
    'Yoga Session',
    new Date('2024-09-12T07:00:00'),
    new Date('2024-09-12T08:15:00'),
    0,
    0,
    0,
    [tags[2], tags[4]], // Flexibility, Yoga
    generateExercises(12, 'yoga'),
  ),
  new Workout(
    5,
    'HIIT Workout',
    new Date('2024-09-13T12:00:00'),
    new Date('2024-09-13T12:25:00'),
    8,
    20,
    50,
    [tags[1], tags[3]], // Cardio, Core
    generateExercises(8, 'cardio'),
  ),
  new Workout(
    6,
    'Upper Body Focus',
    new Date('2024-09-14T16:00:00'),
    new Date('2024-09-14T16:50:00'),
    12,
    12,
    300,
    [tags[0]], // Strength Training
    generateExercises(5, 'upperBody'),
  ),
  new Workout(
    7,
    'Lower Body Workout',
    new Date('2024-10-01T17:00:00'),
    new Date('2024-10-01T17:55:00'),
    14,
    10,
    450,
    [tags[0]], // Strength Training
    generateExercises(6, 'lowerBody'),
  ),
  new Workout(
    8,
    'Core Strength',
    new Date('2024-10-02T19:00:00'),
    new Date('2024-10-02T19:40:00'),
    10,
    25,
    20,
    [tags[3]], // Core
    generateExercises(8, 'core'),
  ),
  new Workout(
    9,
    'Pilates Class',
    new Date('2024-10-03T08:00:00'),
    new Date('2024-10-03T09:00:00'),
    0,
    0,
    0,
    [tags[2], tags[3]], // Flexibility, Core
    generateExercises(15, 'pilates'),
  ),
  new Workout(
    10,
    'CrossFit WOD',
    new Date('2024-09-18T06:00:00'),
    new Date('2024-09-18T06:35:00'),
    5,
    30,
    200,
    [tags[0], tags[1]], // Strength Training, Cardio
    generateExercises(4, 'crossfit'),
  ),
  new Workout(
    11,
    'Swimming Laps',
    new Date('2024-09-19T20:00:00'),
    new Date('2024-09-19T20:45:00'),
    0,
    0,
    0,
    [tags[1]], // Cardio
    generateExercises(1, 'swimming'),
  ),
  new Workout(
    12,
    'Full Body Workout',
    new Date('2024-09-20T17:00:00'),
    new Date('2024-09-20T18:10:00'),
    18,
    15,
    600,
    [tags[0], tags[1], tags[3]], // Strength Training, Cardio, Core
    generateExercises(9, 'strength'),
  ),
  new Workout(
    13,
    'Full Body Workout August',
    new Date('2024-08-12T18:00:00'),
    new Date('2024-08-12T19:10:00'),
    18,
    15,
    600,
    [tags[0], tags[1], tags[3]], // Strength Training, Cardio, Core
    generateExercises(9, 'strength'),
  ),
  new Workout(
    14,
    'Full Body Workout October',
    new Date('2024-10-12T16:00:00'),
    new Date('2024-10-12T17:10:00'),
    18,
    15,
    600,
    [tags[0], tags[1], tags[3]], // Strength Training, Cardio, Core
    generateExercises(9, 'strength'),
  ),
];
