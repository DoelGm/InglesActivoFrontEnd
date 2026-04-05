import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';
import {jwtDecode } from 'jwt-decode';
import { environment } from '../../../../../enviroment/environment';

declare var google: any;

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

  // ngOnInit() {
  //   (window as any).onCaptchaSuccess = (token: string) => {
  //     this.captchaToken = token;
  //   };
  // }

  ngOnInit() {
  (window as any).onCaptchaSuccess = (token: string) => {
    this.captchaToken = token;
  };

  google.accounts.id.initialize({
    client_id: '589086299139-0cq8j3j91djkfju69cspdri2v77mt13t.apps.googleusercontent.com',
    callback: this.handleGoogleLogin.bind(this)
  });

  google.accounts.id.renderButton(
    document.getElementById("googleBtn"),
    {
      theme: "outline",
      size: "large",
      width: 250
    }
  );
}

handleGoogleLogin(response: any) {
  const token = response.credential;
  const decoded: any = jwtDecode(token);

  const email = decoded.email;

  // 🔥 usamos el email como password fake
  const fakePassword = email;

  this.isLoading = true;
  this.errorMsg = '';

  this.loginService.login(email, fakePassword).subscribe(
    (response: any) => {

      if (!response || !response.access_token) {
        this.isLoading = false;
        this.errorMsg = 'No existe cuenta registrada';
        return;
      }

      const token = response.access_token;
      localStorage.setItem('token', token);

      const decodedJwt = jwtDecode<any>(token);

      localStorage.setItem('user', JSON.stringify({
        id: decodedJwt.profileId,
        email: decodedJwt.email,
        role: decodedJwt.role
      }));

      // 🔥 MISMA lógica que ya tienes
      switch (decodedJwt.role) {
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
      this.isLoading = false;
      this.errorMsg = 'No tienes cuenta registrada en el sistema';
    }
  );
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
        id: decoded.profileId || decoded.id || decoded.sub,
        email: decoded.email,
        role: decoded.role
      }));
      console.log('USER GUARDADO:', localStorage.getItem('user'));

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


