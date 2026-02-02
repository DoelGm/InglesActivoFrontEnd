import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudenService } from '../../services/studen.service';

@Component({
  selector: 'app-add-students',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-students.component.html',
  styleUrl: './add-students.component.css'
})
export class AddStudentsComponent {
  showPassword: boolean = false;
  alertMessage: string = '';
  alertType: 'success' | 'error' | 'warning' | '' = '';
  studentForm: FormGroup;

  showAlert(message: string, type: 'success' | 'error' | 'warning') {
    this.alertMessage = message;
    this.alertType = type;

    // Se oculta sola después de 4 segundos
    setTimeout(() => {
      this.alertMessage = '';
      this.alertType = '';
    }, 4000);
  }

  constructor(
    private fb: FormBuilder,
    private studentService: StudenService
  ) {
    this.studentForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
  if (this.studentForm.invalid) {
    this.showAlert('Completa todos los campos correctamente.', 'warning');
    return;
  }

  this.studentService.createStudent(this.studentForm.value)
    .subscribe({
      next: (res) => {
        this.showAlert('Alumno creado correctamente ✅', 'success');
        this.studentForm.reset();
      },
      error: (err) => {

        // Sin conexión
        if (err.status === 0) {
          this.showAlert('No hay conexión con el servidor.', 'error');
          return;
        }

        // Usuario ya existe (típico 409 o mensaje del backend)
        if (err.status === 409 || err.error?.message?.includes('existe')) {
          this.showAlert('El usuario ya existe.', 'warning');
          return;
        }

        if (err.status === 400) {
          this.showAlert('Datos inválidos proporcionados.', 'warning');
          return;
        }

        if (err.status === 409 || err.error?.message?.toLowerCase().includes('correo')) {
          this.showAlert('Este correo ya está registrado.', 'warning');
          return;

        // Error genérico
        this.showAlert('Error al crear el alumno.', 'error');
      }
    }
    });
  }
}
