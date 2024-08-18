import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutTemplateEditComponent } from './workout-template-edit.component';

describe('WorkoutTemplateEditComponent', () => {
  let component: WorkoutTemplateEditComponent;
  let fixture: ComponentFixture<WorkoutTemplateEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutTemplateEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutTemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
