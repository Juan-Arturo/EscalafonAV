import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import store from './store';
import { provideRedux } from '@reduxjs/angular-redux';
import { AuthInterceptor } from './core/helpers/interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes), 
     provideAnimationsAsync(),
     provideRedux({ store }),
     provideClientHydration(withEventReplay()),
     provideHttpClient(withInterceptors([AuthInterceptor])),
     provideHttpClient(v())
    ],
};
