export class WorkoutCompletionResponse {
  constructor(
    public endTime: Date,
    public workoutsCount: number,
    public updateTemplate: boolean,
    public templateId: number,
  ) {
    this.endTime = new Date(endTime);
  }
}
