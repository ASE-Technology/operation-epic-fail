import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/public/login-page/login-page.component';
import { RegisterPageComponent } from './pages/public/register-page/register-page.component';
import { ProfileComponent } from './pages/portal/profile/profile.component';
import { FilesListComponent } from './pages/portal/files-list/files-list.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { PortalLayoutComponent } from './layouts/portal-layout/portal-layout.component';
import { HomeComponent } from './pages/public/home/home.component';
import { DashboardComponent } from './pages/portal/dashboard/dashboard.component';

export const routes: Routes = [
    {
        path: '',
        component: PublicLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'home', component: HomeComponent },
            { path: 'login', component: LoginPageComponent },
            { path: 'register', component: RegisterPageComponent },
        ]
    },
    {
        path: 'portal',
        component: PortalLayoutComponent,
        children: [
            { path: '', component: DashboardComponent },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'profile', component: ProfileComponent },
            { path: 'files', component: FilesListComponent }
        ]
    }
];
