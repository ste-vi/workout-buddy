import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedWorkoutModalComponent } from './completed-workout-modal.component';

describe('CompletedWorkoutModalComponent', () => {
  let component: CompletedWorkoutModalComponent;
  let fixture: ComponentFixture<CompletedWorkoutModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedWorkoutModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompletedWorkoutModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
