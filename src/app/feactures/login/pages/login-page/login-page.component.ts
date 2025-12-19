import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoginFormComponent } from '../../components/login-form/login-form.component';
import { HeaderLoginComponent } from "../../components/header-login/header-login.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, LoginFormComponent, HeaderLoginComponent], // Importa el componente aquí
  template: `
    <app-header-login></app-header-login>
    <app-login-form></app-login-form>
  `
})
export class LoginPageComponent {

}
