import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  standalone: true,
  selector: 'app-public',
  imports: [RouterOutlet, NavbarComponent, SidebarComponent],
  template: `
    <app-navbar></app-navbar>
      <div class="row">
          <div class="col-md-2 d-flex">
            <app-sidebar class="bg-body-secondary rounded bg-opacity-50 text-dark p-3" style="min-width: 300px;"></app-sidebar>
          </div>
          <div class="col-md-7 d-flex flex-column">
              <router-outlet></router-outlet>
          </div>
          <div class="col-md-3"></div>
      </div>
  `
})
export class PublicComponent {

}
