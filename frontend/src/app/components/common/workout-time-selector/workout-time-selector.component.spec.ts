import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutTimeSelectorComponent } from './workout-time-selector.component';

describe('WorkoutTimeSelectorComponent', () => {
  let component: WorkoutTimeSelectorComponent;
  let fixture: ComponentFixture<WorkoutTimeSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutTimeSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutTimeSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
