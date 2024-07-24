import { Exercise } from './exercise';
import {Tag} from "./tag";
import {Workout} from "./workout";

export interface WorkoutTemplate {
  id: number;
  name: string;
  description: string;
  exercises: Exercise[];
  estimatedDuration: string;
  totalSets: number;
  lastPerformedWorkout: Workout
  tags: Tag[];
  volumeTrend: Trend
}

export interface Trend {
  value: string;
  percentage: number;
}
