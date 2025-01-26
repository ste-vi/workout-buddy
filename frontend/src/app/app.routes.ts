import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { StartWorkoutComponent } from './components/start-workout/start-workout.component';
import { WorkoutHistoryComponent } from './components/workout-history/workout-history.component';
import { ProgressComponent } from './components/progress/progress.component';
import { AuthGuard } from './components/auth/auth-guard';
import {LoginComponent} from "./components/auth/login/login.component";
import {RegistrationComponent} from "./components/auth/registration/registration.component";

export const excludedRoutes = ['/login', '/register'];

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegistrationComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'progress',
    component: ProgressComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'workout/start',
    component: StartWorkoutComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'workout/history',
    component: WorkoutHistoryComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: '/dashboard' },
];
