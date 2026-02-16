import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForgotPasswordService } from '../../services/forgot-password.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
successSent = false;
   email: string = '';
  alertMessage = '';
  alertType: 'success' | 'error' | '' = '';
  isLoading = false;
  emailSent = false;

  constructor(private forgotService: ForgotPasswordService, private router: Router) {}

  showAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;

    setTimeout(() => {
      this.alertMessage = '';
      this.alertType = '';
    }, 4000);
  }

  onSubmit() {
    if (!this.email) {
      this.showAlert('Ingresa tu correo', 'error');
      return;
    }

    this.isLoading = true;

    this.forgotService.forgotPassword({ email: this.email }).subscribe({
      next: () => {
        this.isLoading = false;
        this.emailSent = true;
        this.successSent = true; // ahora muestra el mensaje de éxito
        this.showAlert(
          'Se envió una contraseña temporal a tu correo',
          'success'
        );
      },
      error: (err) => {
        this.isLoading = false;
        // Mostrar el mensaje exacto que venga del backend
        if (err.status === 404) {
          this.showAlert('No se encontró el correo ingresado', 'error');
        } else {
          this.showAlert(err.error?.message || 'Error al enviar el correo', 'error');
        }
      }
    });
  }

  goLogin() {
  this.router.navigate(['/']);
  }
}