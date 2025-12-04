import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuAdminComponent } from  '../../../../feactures/home/components/menu-admin/menu-admin.component';

@Component({
  standalone: true,
  selector: 'app-admin',
  imports: [RouterOutlet, MenuAdminComponent],
  template: `
    <div class="row">
      <div class="col-md-3">
        <app-menu-admin class="bg-body-secondary rounded p-3"></app-menu-admin>
      </div>
      <div class="col-md-9">
        <router-outlet></router-outlet>
      </div>
    </div>
  `
})
export class AdminComponent {}
