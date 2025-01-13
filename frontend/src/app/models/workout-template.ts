import { Exercise } from './exercise';
import { Tag } from './tag';
import {getDuration} from "./workout";

export class WorkoutTemplate {
  id?: number;
  title: string = '';
  exercises: Exercise[] = [];
  totalSets: number = 0;
  lastPerformedWorkout?: LastPerformedWorkout;
  tags: Tag[] = [];
  volumeTrend?: Trend;
  archived?: boolean;

  constructor();
  constructor(data: Partial<WorkoutTemplate>);
  constructor(data?: Partial<WorkoutTemplate>) {
    if (data) {
      this.id = data.id;
      this.title = data.title || '';
      this.totalSets = data.totalSets || 0;
      this.lastPerformedWorkout = data.lastPerformedWorkout
        ? new LastPerformedWorkout(data.lastPerformedWorkout)
        : undefined;
      this.tags = data.tags || [];
      this.volumeTrend = data.volumeTrend;
      this.archived = data.archived;
      this.exercises = sortExercises(data.exercises);

      this.recalculateTotalSets();
    }
  }

  recalculateTotalSets(): void {
    this.totalSets = this.exercises.reduce(
      (total, exercise) => total + (exercise.sets?.length || 0),
      0,
    );
  }
}

export class LastPerformedWorkout {
  id: number;
  startTime: Date;
  endTime: Date;

  constructor(data: Partial<LastPerformedWorkout>) {
    this.id = data.id!;
    this.startTime = new Date(data.startTime!);
    this.endTime = new Date(data.endTime!);
  }

  public getDuration(): number {
    return getDuration(this.startTime, this.endTime);
  }
}

export interface Trend {
  value: string;
  percentage: number;
}

export function sortExercises(exercises: Exercise[] | undefined) {
  return (exercises || []).sort(
    (a, b) => (a.position || 0) - (b.position || 0),
  );
}
