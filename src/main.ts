import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { ApplicationConfig } from '@angular/core';

import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';

const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withHashLocation()),
    provideHttpClient(),
    provideAnimations(),
  ],
};

bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));