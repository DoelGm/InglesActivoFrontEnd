import { Routes } from '@angular/router';
import { AdminComponent } from './core/layout/pages/admin/admin.component';
import { PublicComponent } from './core/layout/pages/public/public.component';
import { HomePageComponent } from './feactures/home/pages/home-page/home-page.component';
import { LoginPageComponent } from './feactures/login/pages/login-page/login-page.component';
import { GroupPageComponent } from './feactures/groups/pages/group-page/group-page.component';
import { StudentsComponent } from './feactures/admin/components/students/students.component';
import { AddStudentsComponent } from './feactures/admin/components/add-students/add-students.component';
import { AddGroupComponent } from './feactures/groups/components/add-group/add-group.component';
import { GroupDetailComponent } from './feactures/groups/components/group-detail/group-detail.component';
import { AdminGuard } from './guards/admin.guard';

export const routes: Routes = [
    {
    path: '',
    component: LoginPageComponent
  },

  // PUBLIC LAYOUT
   {
    path: '',
    component: PublicComponent,
    children: [
      { path: 'home', component: HomePageComponent },
      { path: 'groups', component: GroupPageComponent },
      { path: 'groups/:id', component: GroupDetailComponent }
    ]
  },

    {
  path: 'admin',
  canActivate: [AdminGuard],
  component: AdminComponent,
  children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomePageComponent },
    { path: 'students', component: StudentsComponent },
    { path: 'addStudents', component: AddStudentsComponent },
    { path: 'addGroup', component: AddGroupComponent },
    { path: 'groups', component: GroupPageComponent },
    { path: 'groups/:id', component: GroupDetailComponent }
  ]
}

    
];
