export interface Sets {
  id?: number;
  reps?: number;
  weight?: number;
  completed: boolean;
  personalRecord: boolean;
  previousSet?: Sets
}
