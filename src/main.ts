import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { Routes } from '@angular/router';// ✅ adjust path if needed
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    provideRouter(routes) // ✅ Now Angular knows about your routes
  ],
}).catch((err) => console.error(err));
