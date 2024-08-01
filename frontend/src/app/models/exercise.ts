export interface Exercise {
  id: number;
  name: string;
  sets: Set[];
  prSet: Set;
  bodyPart: string;
  category: string;
}

export interface Set {
  id?: number;
  reps: number;
  weight: number;
  previousReps?: number;
  previousWeight?: number;
  completed: boolean;
}
