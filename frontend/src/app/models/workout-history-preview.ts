import {getDuration} from "./workout";

export class WorkoutHistoryPreview {
  id: number;
  title: string;
  startTime: Date;
  endTime: Date;
  totalWeight: number | null;
  prReps: number;

  constructor(data: Partial<WorkoutHistoryPreview>) {
    this.id = data.id || 0;
    this.title = data.title || '';
    this.startTime = data.startTime ? new Date(data.startTime) : new Date();
    this.endTime = data.endTime ? new Date(data.endTime) : new Date();
    this.totalWeight = data.totalWeight !== undefined ? data.totalWeight : null;
    this.prReps = data.prReps || 0;
  }

  public getWorkoutDuration(): number {
    return getDuration(this.startTime, this.endTime);
  }
}
