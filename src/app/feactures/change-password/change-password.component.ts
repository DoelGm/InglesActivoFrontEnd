import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../admin/services/users.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm: FormGroup;
  alertMessage = '';
  userId!: number;
  alertType: 'success' | 'error' | '' = '';

  constructor(
    private fb: FormBuilder, 
    private userService: UsersService,
    private router: Router
  ) {
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    // Obtener userId del localStorage o del token
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        this.userId = user.id;
      } catch (e) {
        console.error('Error al obtener usuario:', e);
        this.showAlert('Error al identificar al usuario', 'error');
      }
    } else {
      this.showAlert('Usuario no identificado', 'error');
    }
  }

  showAlert(message: string, type: 'success' | 'error') {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => { 
      this.alertMessage = ''; 
      this.alertType = ''; 
    }, 4000);
  }

  onSubmit() {
    if (this.passwordForm.invalid) {
      this.showAlert('Completa todos los campos correctamente', 'error');
      return;
    }

    const { newPassword, confirmPassword } = this.passwordForm.value;

    if (newPassword !== confirmPassword) {
      this.showAlert('Las contraseñas no coinciden', 'error');
      return;
    }

    if (!this.userId) {
      this.showAlert('Usuario no identificado', 'error');
      return;
    }

    // Crear objeto con los datos necesarios
    const changePasswordData = {
      userId: this.userId,
      newPassword: newPassword
    };

    this.userService.changePassword(changePasswordData).subscribe({
      next: (response) => {
        this.showAlert('Contraseña cambiada correctamente', 'success');
        this.passwordForm.reset();
        
        // Si el usuario debe cambiar la contraseña, redirigir al dashboard después de cambiarla
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error al cambiar contraseña:', err);
        this.showAlert(err.error?.message || 'Error al cambiar la contraseña', 'error');
      }
    });
  }
}