import { Exercise } from './exercise';
import { Tag } from './tag';

export interface WorkoutTemplate {
  id?: number;
  title: string;
  description: string;
  exercises: Exercise[];
  estimatedDuration?: string;
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
