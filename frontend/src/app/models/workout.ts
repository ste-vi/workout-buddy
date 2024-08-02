import { Tag } from './tag';
import { Exercise } from './exercise';
import {WorkoutTemplate} from "./workout-template";

export interface Workout {
  id: number;
  title?: string
  date: Date;
  duration: string;
  tags?: Tag[];
  exercises?: Exercise[];
  workoutTemplate?: WorkoutTemplate;
}
