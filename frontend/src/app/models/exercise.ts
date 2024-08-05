import { Sets } from './set';

export interface Exercise {
  id: number;
  name: string;
  sets: Sets[];
  prSet?: Sets;
  bodyPart: string;
  category: string;
}
