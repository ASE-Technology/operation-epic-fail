import { Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { FilesListComponent } from './files-list/files-list.component';

export const routes: Routes = [ 
    { path: 'profile', component: ProfileComponent },
    { path: 'files-list', component: FilesListComponent }
];
