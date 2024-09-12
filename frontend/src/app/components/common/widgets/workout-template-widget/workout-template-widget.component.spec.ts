import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutTemplateWidgetComponent } from './workout-template-widget.component';

describe('WorkoutTemplateWidgetComponent', () => {
  let component: WorkoutTemplateWidgetComponent;
  let fixture: ComponentFixture<WorkoutTemplateWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutTemplateWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutTemplateWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
