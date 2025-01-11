import { Tag } from './tag';
import { Exercise } from './exercise';

export class Workout {
  constructor(
    public id: number,
    public title: string,
    public startTime: Date,
    public endTime: Date,
    public totalSets: number,
    public prReps: number,
    public totalWeight: number,
    public tags: Tag[],
    public exercises: Exercise[],
  ) {
    this.recalculateTotalSets();
  }

  getDuration(): number {
    const duration = Math.abs(
      this.endTime.getTime() - this.startTime.getTime(),
    );
    return Math.round(duration / (1000 * 60));
  }

  recalculateTotalSets(): void {
    this.totalSets = this.exercises.reduce(
      (total, exercise) => total + (exercise.sets?.length || 0),
      0,
    );
  }
}
