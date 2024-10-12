import { Exercise } from "../../../models/exercise";
import { WorkoutHistory } from "../../../models/workout-history";
import { tags } from "./workflow-templates-dummy-daya";
import { Sets } from "../../../models/set";

function generateExercises(count: number, workoutType: string): Exercise[] {
  const exercisePool = {
    strength: ['Squats', 'Deadlifts', 'Bench Press', 'Overhead Press', 'Rows', 'Pull-ups'],
    cardio: ['Running', 'Cycling', 'Jump Rope', 'Burpees', 'Mountain Climbers'],
    yoga: ['Downward Dog', 'Warrior Pose', 'Tree Pose', 'Child\'s Pose', 'Sun Salutation'],
    core: ['Planks', 'Crunches', 'Some Twists', 'Leg Raises', 'Bicycle Crunches'],
    upperBody: ['Push-ups', 'Dips', 'Shoulder Press', 'Bicep Curls', 'Tricep Extensions'],
    lowerBody: ['Lunges', 'Leg Press', 'Calf Raises', 'Leg Curls', 'Hip Thrusts'],
    crossfit: ['Box Jumps', 'Kettlebell Swings', 'Thrusters', 'Wall Balls', 'Double Unders'],
    swimming: ['Freestyle Laps', 'Breaststroke Laps', 'Backstroke Laps', 'Butterfly Laps'],
    pilates: ['The Hundred', 'Roll Up', 'Single Leg Circles', 'Spine Stretch', 'Saw']
  };

  const selectedExercises = exercisePool[workoutType as keyof typeof exercisePool] || exercisePool.strength;

  return Array(count).fill(null).map((_, index) => {
    const exerciseName = selectedExercises[index % selectedExercises.length];
    const setCount = Math.floor(Math.random() * 4) + 1; // 1 to 4 sets
    const sets: Sets[] = Array(setCount).fill(null).map((_, setIndex) => ({
      id: setIndex + 1,
      reps: Math.floor(Math.random() * 12) + 5, // 5 to 16 reps
      weight: workoutType === 'cardio' || workoutType === 'yoga' ? 0 : Math.floor(Math.random() * 100) + 10, // 10 to 109 weight
      previousReps: Math.floor(Math.random() * 12) + 5,
      previousWeight: workoutType === 'cardio' || workoutType === 'yoga' ? 0 : Math.floor(Math.random() * 100) + 10,
      completed: true
    }));

    return {
      id: index + 1,
      name: exerciseName,
      sets: sets,
      bodyPart: 'Various',
      category: workoutType === 'cardio' ? 'Cardio' : 'Strength',
      prSet: sets[0] // Add the PR set to the exercise
    };
  });
}

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
    exercises: generateExercises(10, 'strength')
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
    exercises: generateExercises(3, 'cardio')
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
    exercises: generateExercises(6, 'strength')
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
    exercises: generateExercises(12, 'yoga')
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
    exercises: generateExercises(8, 'cardio')
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
    exercises: generateExercises(5, 'upperBody')
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
    exercises: generateExercises(6, 'lowerBody')
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
    exercises: generateExercises(8, 'core')
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
    exercises: generateExercises(15, 'pilates')
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
    exercises: generateExercises(4, 'crossfit')
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
    exercises: generateExercises(1, 'swimming')
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
    exercises: generateExercises(9, 'strength')
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
    exercises: generateExercises(9, 'strength')
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
    exercises: generateExercises(9, 'strength')
  },
];
