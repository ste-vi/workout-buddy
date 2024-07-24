import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutTemplateDetailsComponent } from './workout-template-details.component';

describe('WorkoutTemplateDetailsComponent', () => {
  let component: WorkoutTemplateDetailsComponent;
  let fixture: ComponentFixture<WorkoutTemplateDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutTemplateDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutTemplateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
