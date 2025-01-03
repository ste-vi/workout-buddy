import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BodyWeightMeasuresComponent } from './body-weight-measures.component';

describe('BodyWeightMeasuresComponent', () => {
  let component: BodyWeightMeasuresComponent;
  let fixture: ComponentFixture<BodyWeightMeasuresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BodyWeightMeasuresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BodyWeightMeasuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
