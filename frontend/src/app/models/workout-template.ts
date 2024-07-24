import { Exercise } from './exercise';

export interface WorkoutTemplate {
  id: number;
  name: string;
  description: string;
  exercises: Exercise[];
  estimatedDuration: string;
  totalSets: number;
  lastExecutionDate: Date;
}
