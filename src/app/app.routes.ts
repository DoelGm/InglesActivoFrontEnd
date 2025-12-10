import { Routes } from '@angular/router';
import { AdminComponent } from './core/layout/pages/admin/admin.component';
import { PublicComponent } from './core/layout/pages/public/public.component';
import { HomePageComponent } from './feactures/home/pages/home-page/home-page.component';
import { LoginPageComponent } from './feactures/login/pages/login-page/login-page.component';
import { GroupPageComponent } from './feactures/groups/pages/group-page/group-page.component';
import { StudentsComponent } from './feactures/admin/components/students/students.component';
import { AddStudentsComponent } from './feactures/admin/components/add-students/add-students.component';

export const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: LoginPageComponent
            },
        ]
    },
    {
        path: 'home',
        component: PublicComponent,
        children: [
            {
                path: '',
                component: HomePageComponent
            },
        ]
    },
    {
        path: 'groups',
        component: PublicComponent,
        children: [
            { path: '', component: GroupPageComponent } 
        ]
        },

       {
        path: 'students',
        component: PublicComponent,
        children: [
            { path: '', component: StudentsComponent } 
        ]
        },
               {
        path: 'addStudents',
        component: PublicComponent,
        children: [
            { path: '', component: AddStudentsComponent } 
        ]
        },

    // {
    //     path: 'admin',
    //     component: AdminComponent,
    //     children: [
    //         {}
    //     ]
    // },
    
];
