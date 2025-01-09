import { Exercise } from './exercise';
import { Tag } from './tag';

export interface WorkoutTemplate {
  id?: number;
  title: string;
  exercises: Exercise[];
  estimatedDuration?: number;
  totalSets: number;
  lastPerformedWorkout?: LastPerformedWorkout;
  tags: Tag[];
  volumeTrend?: Trend;
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
