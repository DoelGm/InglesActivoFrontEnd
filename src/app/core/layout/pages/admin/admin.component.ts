import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuAdminComponent } from  '../../../../feactures/admin/components/menu-admin/menu-admin.component';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { NavbarComponent } from "../../components/navbar/navbar.component";

@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [RouterOutlet, MenuAdminComponent, SidebarComponent, NavbarComponent],
  template: `
   <app-navbar></app-navbar>
   <app-menu-admin></app-menu-admin>
      <div class="row">
          <div class="col-md-2 d-flex">
            <app-sidebar class="bg-body-secondary rounded bg-opacity-50 text-dark p-3" style="min-width 320px;"></app-sidebar>
          </div>
          <div class="col-md-7 d-flex flex-column">
              <router-outlet></router-outlet>
          </div>
          <div class="col-md-3"></div>
      </div>
  `
})
export class AdminComponent {}
