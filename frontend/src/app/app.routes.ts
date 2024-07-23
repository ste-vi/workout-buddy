import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {ProfileComponent} from "./components/profile/profile.component";
import {StartWorkoutComponent} from "./components/start-workout/start-workout.component";

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'start-workout',
    component: StartWorkoutComponent
  },
  { path: '**', redirectTo: '/dashboard' },
];
