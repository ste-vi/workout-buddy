export interface Exercise {
  id: number;
  name: string;
  sets: Set[];
}

export interface Set {
  id: number;
  reps: number;
  weight: number;
}
