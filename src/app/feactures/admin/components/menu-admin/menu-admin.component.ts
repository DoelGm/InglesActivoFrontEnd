import { Component } from '@angular/core';
import { ScrollAnimateDirective } from '../../../../shared/directives/scroll-animate.directive';
import { LoginService } from '../../../login/services/login.service';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-menu-admin',
  imports: [ScrollAnimateDirective, NgIf, RouterLink],
  templateUrl: './menu-admin.component.html',
  styleUrl: './menu-admin.component.css'
})
export class MenuAdminComponent {

   showMenu = false;

  constructor(private login: LoginService) {}

  ngOnInit() {
    this.showMenu = this.login.isLogged();
  }

}
