import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-add-users',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-users.component.html',
  styleUrls: ['./add-users.component.css']
})
export class AddUsersComponent {
  showPassword = false;
  alertMessage = '';
  alertType: 'success' | 'error' | 'warning' | '' = '';
  userForm: FormGroup;

  constructor(private fb: FormBuilder, private usersService: UsersService) {
    this.userForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      course: [''],      // Solo para estudiantes
      specialty: ['']    // Solo para profesores
    });

    // Validación condicional
    this.userForm.get('role')?.valueChanges.subscribe(role => {
      const specialtyControl = this.userForm.get('specialty');
      const courseControl = this.userForm.get('course');
      
      if (role === 'teacher') {
        specialtyControl?.setValidators([Validators.required]);
        courseControl?.clearValidators();
      } else if (role === 'student') {
        courseControl?.setValidators([Validators.required]);
        specialtyControl?.clearValidators();
      } else {
        specialtyControl?.clearValidators();
        courseControl?.clearValidators();
      }
      
      specialtyControl?.updateValueAndValidity();
      courseControl?.updateValueAndValidity();
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

    const formValues = this.userForm.value;
    
    // Construir payload exactamente como en Postman
    const payload: any = {
      first_name: formValues.first_name,
      last_name: formValues.last_name,
      email: formValues.email,
      role: formValues.role
    };

    // Agregar campos específicos según el rol
    if (formValues.role === 'teacher') {
      payload.specialty = formValues.specialty;
    }
    
    if (formValues.role === 'student') {
      payload.course = formValues.course;
    }

    console.log('Enviando payload:', payload);

    // Elegir el endpoint correcto según el rol
    let request;
    if (formValues.role === 'teacher') {
      request = this.usersService.createTeacher(payload);
    } else if (formValues.role === 'student') {
      request = this.usersService.createStudent(payload);
    } else {
      request = this.usersService.createAdmin(payload);
    }

    request.subscribe({
      next: (response) => {
        this.showAlert('Usuario registrado correctamente', 'success');
        this.userForm.reset();
        
        this.userForm.patchValue({
          role: '',
          course: '',
          specialty: ''
        });
      },
      error: (err) => {
        let errorMessage = 'Error al registrar el usuario.';
        if (err.error?.message) {
          if (Array.isArray(err.error.message)) {
            errorMessage = err.error.message.join(', ');
          } else {
            errorMessage = err.error.message;
          }
        }
        
        this.showAlert(errorMessage, 'error');
      }
    });
  }
}
