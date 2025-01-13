import { Tag } from './tag';
import { Exercise } from './exercise';
import { sortExercises } from './workout-template';

export class Workout {
  id?: number;
  title: string = '';
  startTime: Date = new Date();
  endTime?: Date = undefined;
  totalSets?: number;
  prReps?: number;
  totalWeight?: number;
  tags: Tag[] = [];
  exercises: Exercise[] = [];

  constructor(data: Partial<Workout>) {
    if (data) {
      this.id = data.id;
      this.title = data.title || '';
      this.totalSets = data.totalSets || 0;
      this.startTime = data.startTime!;
      this.endTime = data.endTime;
      this.tags = data.tags || [];
      this.exercises = sortExercises(data.exercises);

      if (data.totalWeight) {
        this.totalWeight = data.totalWeight;
      } else {
        this.calculateTotalWeight();
      }

      this.calculatePrSets();
      this.calculateTotalSets();
    }
  }

  public calculatePrSets() {
    this.prReps = this.exercises.reduce((total, exercise) => {
      const prSets = exercise.sets.filter((set) => set.personalRecord);
      return total + prSets.length;
    }, 0);
  }

  public calculateTotalSets() {
    this.totalSets = this.exercises.reduce(
      (total, exercise) => total + (exercise.sets?.length || 0),
      0,
    );
  }

  public calculateTotalWeight() {
    this.totalWeight = this.exercises.reduce((total, exercise) => {
      return (
        total +
        exercise.sets.reduce((exerciseTotal, set) => {
          return exerciseTotal + (set.weight || 0) * set.reps!;
        }, 0)
      );
    }, 0);
  }

  public getWorkoutDuration(): number {
    return getDuration(this.startTime, this.endTime);
  }
}

export function getDuration(startTime?: Date, endTime?: Date): number {
  if (!startTime || !endTime) return 0;
  const duration = Math.abs(
    new Date(endTime).getTime() - new Date(startTime).getTime(),
  );
  return Math.round(duration / (1000 * 60));
}
