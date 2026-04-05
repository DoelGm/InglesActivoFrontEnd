import { Component, OnInit } from '@angular/core';
import { 
  FormBuilder, 
  FormGroup, 
  FormsModule, 
  ReactiveFormsModule, 
  Validators, 
  AbstractControl, 
  ValidationErrors 
} from '@angular/forms';
import { UsersService } from '../admin/services/users.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  passwordForm: FormGroup;
  alertMessage = '';
  userId!: number;
  alertType: 'success' | 'error' | '' = '';

  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder, 
    private userService: UsersService,
    private router: Router
  ) {

    // 👇 Validador personalizado dentro del constructor
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });

  }

  ngOnInit() {
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

  // 👇 Validador para comparar contraseñas
  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return newPassword === confirmPassword ? null : { mismatch: true };
  }

  toggleNewPassword() {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
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

    if (!this.userId) {
      this.showAlert('Usuario no identificado', 'error');
      return;
    }

    const changePasswordData = {
      userId: this.userId,
      newPassword: this.passwordForm.value.newPassword
    };

    this.userService.changePassword(changePasswordData).subscribe({
      next: () => {
        this.showAlert('Contraseña cambiada correctamente', 'success');
        this.passwordForm.reset();

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
