import { Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { ProfileComponent } from './profile/profile.component';
import { FilesListComponent } from './files-list/files-list.component';

export const routes: Routes = [    
{ path: '', component: LoginPageComponent },
{ path: 'login', component: LoginPageComponent },
{ path: 'register', component: RegisterPageComponent },
{ path: 'profile', component: ProfileComponent },
{ path: 'files-list', component: FilesListComponent }
// Add other routes as needed
];
