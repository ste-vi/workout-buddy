import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateWeightModalComponent } from './update-weight-modal.component';

describe('UpdateWeightModalComponent', () => {
  let component: UpdateWeightModalComponent;
  let fixture: ComponentFixture<UpdateWeightModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateWeightModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateWeightModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
