import { Exercise } from './exercise';
import { Tag } from './tag';

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
      this.exercises = data.exercises || [];
      this.totalSets = data.totalSets || 0;
      this.lastPerformedWorkout = data.lastPerformedWorkout;
      this.tags = data.tags || [];
      this.volumeTrend = data.volumeTrend;
      this.archived = data.archived;

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

interface LastPerformedWorkout {
  id: number;
  duration: string;
  date: Date;
}

export interface Trend {
  value: string;
  percentage: number;
}
