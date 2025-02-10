import {
  ApplicationConfig,
  importProvidersFrom,
  isDevMode,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HammerModule } from '@angular/platform-browser';
import 'hammerjs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { provideServiceWorker } from '@angular/service-worker';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { authInterceptor } from './inteceptors/token.interceptor';
import { errorInterceptor } from './inteceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideAnimationsAsync(),
    provideEnvironmentNgxMask(),
    importProvidersFrom(HammerModule, DragDropModule),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:5000',
    }),
  ],
};
