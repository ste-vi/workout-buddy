import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { StartWorkoutComponent } from './components/start-workout/start-workout.component';
import { WorkoutHistoryComponent } from './components/workout-history/workout-history.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'workout/start',
    component: StartWorkoutComponent,
  },
  {
    path: 'workout/history',
    component: WorkoutHistoryComponent,
  },
  { path: '**', redirectTo: '/dashboard' },
];
