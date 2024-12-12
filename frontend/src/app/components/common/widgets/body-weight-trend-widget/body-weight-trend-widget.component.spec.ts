import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyWeightTrendWidgetComponent } from './body-weight-trend-widget.component';

describe('WeightTrendWidgetComponent', () => {
  let component: BodyWeightTrendWidgetComponent;
  let fixture: ComponentFixture<BodyWeightTrendWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyWeightTrendWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyWeightTrendWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
