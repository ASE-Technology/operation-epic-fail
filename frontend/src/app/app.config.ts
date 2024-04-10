import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authenticationInterceptor } from './interceptors/authentication.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withViewTransitions()), 
    provideHttpClient(withInterceptors([authenticationInterceptor])),
    provideAnimations(),
    provideToastr(),
    provideCharts(withDefaultRegisterables())
  ]
};
