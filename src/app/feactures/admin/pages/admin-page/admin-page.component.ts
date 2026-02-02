import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MenuAdminComponent } from "../../components/menu-admin/menu-admin.component";

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [CommonModule, MenuAdminComponent],
  template: `
  <app-menu-admin></app-menu-admin>
 
  `
})
export class AdminPageComponent {

}