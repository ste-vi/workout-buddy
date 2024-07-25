import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingWorkoutComponent } from './ongoing-workout.component';

describe('OngoingWorkoutComponent', () => {
  let component: OngoingWorkoutComponent;
  let fixture: ComponentFixture<OngoingWorkoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OngoingWorkoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OngoingWorkoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
