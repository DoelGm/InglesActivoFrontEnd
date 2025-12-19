import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'] // también estaba mal: debe ser style**s**Url**s**
})
export class LoginFormComponent {
  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}
  email: string = '';
  password: string = '';
  errorMsg: string = '';

  login() {
    this.loginService.login(' email', ' password').subscribe(
      (response) => {
        console.log('Login exitoso', response);
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Error de login', error);
      }
    );
  }
}
