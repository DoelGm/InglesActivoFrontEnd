import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderLoginComponent } from '../../../login/components/header-login/header-login.component';
import { ForgotPasswordComponent } from '../../components/forgot-password/forgot-password.component';

@Component({
  selector: 'app-forgot-password-page',
  standalone: true,
  imports: [CommonModule, HeaderLoginComponent, ForgotPasswordComponent], 
  template: `
    <app-header-login></app-header-login>
    <div class="mt-5">
      <app-forgot-password></app-forgot-password>
    </div>
  `
})
export class ForgotPasswordPageComponent {}
