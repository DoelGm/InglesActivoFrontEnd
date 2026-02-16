import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';
import {jwtDecode } from 'jwt-decode';
import { environment } from '../../../../../enviroment/environment';

interface TokenPayload {
  role: string;
  email: string;
  exp: number;
}


@Component({
  selector: 'app-login-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'] // también estaba mal: debe ser style**s**Url**s**
})
export class LoginFormComponent {
  email: string = '';
  password: string = '';
  errorMsg: string = '';
  isLoading: boolean = false;
  showPassword: boolean = false;
  siteKey = environment.recaptchaSiteKey;
   captchaToken: string = '';
 


  constructor(
    private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    (window as any).onCaptchaSuccess = (token: string) => {
      this.captchaToken = token;
    };
  }

 login() {
   if (!this.captchaToken) {
    this.errorMsg = 'Por favor verifica el captcha.';
    return;
  }

  this.isLoading = true;
  this.errorMsg = '';
  

  this.loginService.login(this.email, this.password).subscribe(
    (response: any) => {

      if (!response || !response.access_token) {
        this.isLoading = false;
        this.errorMsg = 'Credenciales incorrectas';
        return;
        
      }

      const token = response.access_token;
      localStorage.setItem('token', token);

      const decoded = jwtDecode<any>(token);

      localStorage.setItem('role', decoded.role);

      // GUARDAR USUARIO
      localStorage.setItem('user', JSON.stringify({
        id: decoded.sub,   // o decoded.userId, depende de tu backend
        email: decoded.email,
        role: decoded.role
      }));

     switch (decoded.role) {
      case 'admin':
        this.router.navigate(['/admin']);
        break;

      case 'teacher':
        this.router.navigate(['/teacher']);
        break;

      default:
        this.router.navigate(['/home']);
        break;
    }


      this.isLoading = false;
    },
      (error) => {
        console.error('Error de login', error);
        this.isLoading = false;
        
        // Manejo de diferentes tipos de errores
        if (error.message.includes('No hay cuenta registrada')) {
          this.errorMsg = 'No hay cuenta registrada con este correo electrónico.';
        } else if (error.message.includes('Credenciales incorrectas')) {
          this.errorMsg = 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.';
        } else if (error.message.includes('Error de conexión')) {
          this.errorMsg = 'Error de conexión. Verifica tu conexión a internet.';
        } else {
          this.errorMsg = error.message || 'Ocurrió un error. Por favor, intenta nuevamente.';
        }
      },
    );
    }
  }


