import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudenService } from '../../services/studen.service';
import { Observable, switchMap } from 'rxjs';

@Component({
  selector: 'app-add-users',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-users.component.html',
  styleUrl: './add-users.component.css'
})
export class AddUsersComponent {
  showPassword = false;
  alertMessage = '';
  alertType: 'success' | 'error' | 'warning' | '' = '';
  userForm: FormGroup;

  constructor(private fb: FormBuilder, private studentService: StudenService) {
    this.userForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      course: [''],      // Solo para estudiantes
      specialty: ['']    // Solo para profesores
    });
  }

  showAlert(message: string, type: 'success' | 'error' | 'warning') {
    this.alertMessage = message;
    this.alertType = type;

    setTimeout(() => {
      this.alertMessage = '';
      this.alertType = '';
    }, 4000);
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.showAlert('Completa todos los campos correctamente.', 'warning');
      return;
    }

    const { first_name, last_name, email, password, role, course, specialty } = this.userForm.value;

    // 1️⃣ Crear el usuario primero
    this.studentService.createUser({ first_name, last_name, email, password})
      .pipe(
        // 2️⃣ Según el rol, crear perfil adicional en students o teachers
        switchMap((createdUser: any) => {
          const userId = createdUser.id;

          if (role === 'student') {
            return this.studentService.createStudentProfile({ userId, course });
          }

          if (role === 'teacher') {
            return this.studentService.createTeacherProfile({ userId, specialty });
          }

          // Admin no necesita perfil adicional
          return new Observable(observer => {
            observer.next(createdUser);
            observer.complete();
          });
        })
      )
      .subscribe({
        next: () => {
          this.showAlert('Usuario registrado correctamente ✅', 'success');
          this.userForm.reset();
        },
        error: (err) => {
          if (err.status === 0) {
            this.showAlert('No hay conexión con el servidor.', 'error');
            return;
          }
          if (err.status === 409 || err.error?.message?.includes('existe')) {
            this.showAlert('El usuario ya existe.', 'warning');
            return;
          }
          if (err.status === 400) {
            this.showAlert('Datos inválidos proporcionados.', 'warning');
            return;
          }
          this.showAlert('Error al registrar el usuario.', 'error');
        }
      });
  }
}
