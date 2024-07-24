export interface Exercise {
  id: number;
  name: string;
  sets: Set[];
  prSet: Set;
  bodyPart: string
}

export interface Set {
  id: number;
  reps: number;
  weight: number;
}
