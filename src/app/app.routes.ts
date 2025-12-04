import { Routes } from '@angular/router';
import { AdminComponent } from './core/layout/pages/admin/admin.component';
import { PublicComponent } from './core/layout/pages/public/public.component';
import { HomePageComponent } from './feactures/home/pages/home-page/home-page.component';
import { LoginPageComponent } from './feactures/login/pages/login-page/login-page.component';
import { GroupPageComponent } from './feactures/groups/pages/group-page/group-page.component';

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
    // {
    //     path: 'admin',
    //     component: AdminComponent,
    //     children: [
    //         {}
    //     ]
    // },
    
];
