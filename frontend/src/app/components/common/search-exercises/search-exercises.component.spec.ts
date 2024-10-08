import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchExercisesComponent } from './search-exercises.component';

describe('ExercisesComponent', () => {
  let component: SearchExercisesComponent;
  let fixture: ComponentFixture<SearchExercisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchExercisesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchExercisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
