import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IosInstallPromptComponent } from './ios-install-prompt.component';

describe('IosInstallPromptComponent', () => {
  let component: IosInstallPromptComponent;
  let fixture: ComponentFixture<IosInstallPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IosInstallPromptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IosInstallPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
