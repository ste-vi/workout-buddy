import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BmiWidgetComponent } from './bmi-widget.component';

describe('BmiWidgetComponent', () => {
  let component: BmiWidgetComponent;
  let fixture: ComponentFixture<BmiWidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BmiWidgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BmiWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
