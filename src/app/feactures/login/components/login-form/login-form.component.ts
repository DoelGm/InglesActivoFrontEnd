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
   isLoading: boolean = false;

  login() {
    this.loginService.login(this.email, this.password).subscribe(
      (response) => {
        console.log('Login exitoso', response);
        this.router.navigate(['/home']);
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


