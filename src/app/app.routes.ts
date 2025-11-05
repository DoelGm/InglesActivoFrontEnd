import { Routes } from '@angular/router';
import { AdminComponent } from './core/layout/pages/admin/admin.component';
import { PublicComponent } from './core/layout/pages/public/public.component';
import { HomePageComponent } from './feactures/home/pages/home-page/home-page.component';

export const routes: Routes = [
    {
        path: '',
        component: PublicComponent,
        children: [
            {
                path: '',
                component: HomePageComponent
            },
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
