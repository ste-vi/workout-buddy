import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestWorkoutWidgetComponent } from './latest-workout-widget.component';

describe('LatestWorkoutWidgetComponent', () => {
  let component: LatestWorkoutWidgetComponent;
  let fixture: ComponentFixture<LatestWorkoutWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LatestWorkoutWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LatestWorkoutWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
