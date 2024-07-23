import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediumButtonComponent } from './medium-button.component';

describe('MediumButtonComponent', () => {
  let component: MediumButtonComponent;
  let fixture: ComponentFixture<MediumButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MediumButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediumButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
