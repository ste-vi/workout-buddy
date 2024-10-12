import { Tag } from './tag';
import { Exercise } from './exercise';
import { WorkoutTemplate } from './workout-template';

export class Workout {
  constructor(
    public id: number,
    public title: string,
    public date: Date,
    public startTime: Date,
    public endTime: Date,
    public totalSets: number,
    public prReps: number,
    public totalWeight: number,
    public totalExercises: number,
    public tags: Tag[],
    public exercises: Exercise[],
  ) {}

  getDuration(): number {
    const duration = Math.abs(
      this.endTime.getTime() - this.startTime.getTime(),
    );
    // Round to nearest minute
    return Math.round(duration / (1000 * 60));
  }
}
