import { Routes } from '@angular/router';
import { AdminComponent } from './core/layout/pages/admin/admin.component';
import { PublicComponent } from './core/layout/pages/public/public.component';
import { HomePageComponent } from './feactures/home/pages/home-page/home-page.component';
import { LoginPageComponent } from './feactures/login/pages/login-page/login-page.component';
import { GroupPageComponent } from './feactures/groups/pages/group-page/group-page.component';
import { StudentsComponent } from './feactures/admin/components/students/students.component';
import { AddGroupComponent } from './feactures/groups/components/add-group/add-group.component';
import { GroupDetailComponent } from './feactures/groups/components/group-detail/group-detail.component';
import { AdminGuard } from './guards/admin.guard';
import { AddUsersComponent } from './feactures/admin/components/add-users/add-users.component';
import { AddNewsComponent } from './feactures/admin/components/add-news/add-news.component';
import { TeachersComponent } from './feactures/admin/components/teachers/teachers.component';
import { AdminsComponent } from './feactures/admin/components/admins/admins.component';
import { authGuard } from './guards/auth.guard';
import { ForgotPasswordPageComponent } from './feactures/forgot-password/pages/forgot-password/forgot-password-page.component';
import { GradesComponent } from './feactures/grades/services/grades/grades.component';
import { MyGradesComponent } from './feactures/grades/components/my-grades/my-grades.component';


export const routes: Routes = [
   { path: '', component: LoginPageComponent },
   { path: 'forgotPassword', component: ForgotPasswordPageComponent },

  // PUBLIC LAYOUT
   {
    path: '',
    component: PublicComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomePageComponent },
      { path: 'groups', component: GroupPageComponent },
      { path: 'groups/:id', component: GroupDetailComponent },
      { path: 'grades', component: MyGradesComponent },
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
    { path: 'teachers', component: TeachersComponent },
    { path: 'admins', component: AdminsComponent },
    { path: 'addUsers', component: AddUsersComponent },
    { path: 'addGroup', component: AddGroupComponent },
    { path: 'addNews', component: AddNewsComponent },
    { path: 'groups', component: GroupPageComponent },
    { path: 'groups/:id', component: GroupDetailComponent },
    { path: 'grades', component: MyGradesComponent },
  ]
}

    
];
