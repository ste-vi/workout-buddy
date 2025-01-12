import { Tag } from './tag';
import { Exercise } from './exercise';
import { sortExercises } from './workout-template';

export class Workout {
  id?: number;
  title: string = '';
  startTime: Date = new Date();
  endTime?: Date = undefined;
  totalSets: number = 0;
  prReps: number = 0;
  totalWeight: number = 0;
  tags: Tag[] = [];
  exercises: Exercise[] = [];

  constructor(data: Partial<Workout>) {
    if (data) {
      this.id = data.id;
      this.title = data.title || '';
      this.totalSets = data.totalSets || 0;
      this.startTime = data.startTime!;
      this.endTime = data.startTime!;
      this.totalSets = data.totalSets!;
      this.prReps = data.prReps!;
      this.totalWeight = data.totalWeight!;
      this.tags = data.tags || [];
      this.exercises = sortExercises(data.exercises);

      this.recalculateTotalSets();
      this.recalculateTotalWeight();
    }
  }

  recalculateTotalSets(): void {
    this.totalSets = this.exercises.reduce(
      (total, exercise) => total + (exercise.sets?.length || 0),
      0,
    );
  }

  recalculateTotalWeight(): void {
    this.totalWeight = this.exercises.reduce((total, exercise) => {
      return (
        total +
        exercise.sets.reduce((exerciseTotal, set) => {
          return exerciseTotal + (set.weight || 0) * set.reps!;
        }, 0)
      );
    }, 0);
  }
}

export function getWorkoutDuration(startTime?: Date, endTime?: Date): number {
  if (!startTime || !endTime) return 0;
  startTime = new Date(startTime);
  endTime = new Date(endTime);
  const duration = Math.abs(endTime.getTime() - startTime.getTime());
  return Math.round(duration / (1000 * 60));
}
