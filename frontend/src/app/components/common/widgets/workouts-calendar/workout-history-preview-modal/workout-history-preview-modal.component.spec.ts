import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutHistoryPreviewModalComponent } from './workout-history-preview-modal.component';

describe('WorkoutHistoryPreviewModalComponent', () => {
  let component: WorkoutHistoryPreviewModalComponent;
  let fixture: ComponentFixture<WorkoutHistoryPreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutHistoryPreviewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutHistoryPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
