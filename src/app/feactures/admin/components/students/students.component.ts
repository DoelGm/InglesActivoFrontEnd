import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ScrollAnimateDirective } from '../../../../shared/directives/scroll-animate.directive';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule, ScrollAnimateDirective],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit {

  students: any[] = [];
  loading = false;

  selectedStudent: any = null;
  studentToDelete: any = null;

  selectedIds: number[] = [];

  filterName: string = '';
  filterEmail: string = '';

  message: string = '';
  messageType: 'success' | 'danger' | '' = '';

  searchTerm = '';
private debounceTimer: any;

  constructor(private studentService: UsersService) {}

  ngOnInit(): void {
    this.getStudents();
  }

  // =============================
  // MENSAJES
  // =============================

  showMessage(text: string, type: 'success' | 'danger') {
    this.message = text;
    this.messageType = type;

    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 4000);
  }

  // =============================
  // GET STUDENTS
  // =============================

  getStudents(): void {
    this.loading = true;

    this.studentService.viewStudents().subscribe({
      next: (resp) => {
        this.students = Array.isArray(resp) ? resp : [];
        this.loading = false;
      },
      error: () => {
        this.students = [];
        this.loading = false;
        this.showMessage('Error cargando estudiantes', 'danger');
      }
    });
  }

  // =============================
  // FILTER
  // =============================

  filteredStudents(): any[] {
    return this.students.filter(student =>
      (student.first_name?.toLowerCase().includes(this.filterName.toLowerCase()) ||
       student.last_name?.toLowerCase().includes(this.filterName.toLowerCase())) &&
      student.email?.toLowerCase().includes(this.filterEmail.toLowerCase())
    );
  }

  onSearchChange() {

  clearTimeout(this.debounceTimer);

  this.debounceTimer = setTimeout(() => {

    const term = this.searchTerm.trim();

    if (!term) {
      this.getStudents();
      return;
    }

    this.studentService.searchUsers(term).subscribe({
      next: res => this.students = Array.isArray(res) ? res : [],
      error: () => this.showMessage('Error en búsqueda', 'danger')
    });

  }, 400);
}

  getInitials(name: string): string {
    if (!name) return '';
    return name.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  // =============================
  // MULTI SELECT
  // =============================

  toggleSelection(id: number): void {
    if (this.selectedIds.includes(id)) {
      this.selectedIds = this.selectedIds.filter(x => x !== id);
    } else {
      this.selectedIds.push(id);
    }
  }

  toggleSelectAll(event: any): void {
    if (event.target.checked) {
      this.selectedIds = this.filteredStudents().map(s => s.id);
    } else {
      this.selectedIds = [];
    }
  }

  async deleteSelected() {

  if (!this.selectedIds.length) return;

  this.loading = true;

  const results = await Promise.allSettled(
    this.selectedIds.map(id =>
      this.studentService.deleteUserPromise(id)
    )
  );

  const success = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  this.students = this.students.filter(s => !this.selectedIds.includes(s.id));

  this.selectedIds = [];
  this.loading = false;
  this.deleteMultiple = false;

  if (failed === 0) {
    this.showMessage('Estudiantes eliminados correctamente', 'success');
  } else {
    this.showMessage(`${success} eliminados, ${failed} fallaron`, 'danger');
  }
}


  deleteMultiple = false;

confirmDeleteMultiple() {
  if (this.selectedIds.length === 0) return;
  this.deleteMultiple = true;
}

closeDeleteMultiple() {
  this.deleteMultiple = false;
}

  // =============================
  // EDIT
  // =============================

  editStudent(student: any): void {
    this.selectedStudent = { ...student };
  }

  closeModal(): void {
    this.selectedStudent = null;
  }

  updateStudent(form: NgForm): void {
    if (!this.selectedStudent?.id) return;

    if (form.invalid) {
      Object.values(form.controls).forEach(control =>
        control.markAsTouched()
      );
      return;
    }

    this.loading = true;

    const studentData = {
      first_name: this.selectedStudent.first_name,
      last_name: this.selectedStudent.last_name,
      email: this.selectedStudent.email,
      is_active: this.selectedStudent.is_active
    };

    this.studentService.updateUser(this.selectedStudent.id, studentData)
      .subscribe({
        next: () => {
          const index = this.students.findIndex(
            s => s.id === this.selectedStudent.id
          );

          if (index !== -1) {
            this.students[index] = { ...this.selectedStudent };
          }

          this.loading = false;
          this.closeModal();
          this.showMessage('Estudiante actualizado correctamente', 'success');
        },
        error: () => {
          this.loading = false;
          this.showMessage('Error al actualizar el estudiante', 'danger');
        }
      });
  }

  // =============================
  // DELETE INDIVIDUAL
  // =============================

  confirmDelete(student: any) {
    this.studentToDelete = student;
  }

  closeDeleteModal() {
    this.studentToDelete = null;
  }

  deleteConfirmed() {
    if (!this.studentToDelete) return;

    this.loading = true;

    this.studentService.deleteUser(this.studentToDelete.id)
      .subscribe({
        next: () => {
          this.students = this.students.filter(
            s => s.id !== this.studentToDelete.id
          );
          this.studentToDelete = null;
          this.loading = false;
          this.showMessage('Estudiante eliminado correctamente', 'success');
        },
        error: () => {
          this.loading = false;
          this.showMessage('Error eliminando el estudiante', 'danger');
        }
      });
  }
}
