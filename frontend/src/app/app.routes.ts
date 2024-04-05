import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';

export const routes: Routes = [    
{ path: '', component: LoginPageComponent }, // Default route
{ path: 'login', component: LoginPageComponent },
{ path: 'register', component: RegisterPageComponent },
// Add other routes as needed
];