import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-teachers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {

  teachers: any[] = [];
  loading = false;

  selectedTeacher: any = null;
  teacherToDelete: any = null;
  selectedIds: number[] = [];

  filterName: string = '';
  filterEmail: string = '';

  message: string = '';
  messageType: 'success' | 'danger' | '' = '';

  deleteMultiple = false;

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.getTeachers();
  }

  showMessage(text: string, type: 'success' | 'danger') {
    this.message = text;
    this.messageType = type;
    setTimeout(() => { this.message = ''; this.messageType = ''; }, 4000);
  }

  getTeachers(): void {
    this.loading = true;
    this.userService.viewTeachers().subscribe({
      next: (resp) => { this.teachers = Array.isArray(resp) ? resp : []; this.loading = false; },
      error: () => { this.teachers = []; this.loading = false; this.showMessage('Error cargando profesores', 'danger'); }
    });
  }

  filteredTeachers(): any[] {
    return this.teachers.filter(t =>
      (t.first_name?.toLowerCase().includes(this.filterName.toLowerCase()) ||
       t.last_name?.toLowerCase().includes(this.filterName.toLowerCase())) &&
      t.email?.toLowerCase().includes(this.filterEmail.toLowerCase())
    );
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0,2);
  }

  toggleSelection(id: number) {
    if (this.selectedIds.includes(id)) this.selectedIds = this.selectedIds.filter(x => x !== id);
    else this.selectedIds.push(id);
  }

  toggleSelectAll(event: any) {
    this.selectedIds = event.target.checked ? this.filteredTeachers().map(t => t.id) : [];
  }

  confirmDeleteMultiple() { if (this.selectedIds.length) this.deleteMultiple = true; }
  closeDeleteMultiple() { this.deleteMultiple = false; }

  deleteSelected() {
    if (!this.selectedIds.length) return;
    this.loading = true;
    const requests = this.selectedIds.map(id => this.userService.deleteUser(id).toPromise());
    Promise.all(requests).then(() => {
      this.teachers = this.teachers.filter(t => !this.selectedIds.includes(t.id));
      this.selectedIds = [];
      this.loading = false;
      this.deleteMultiple = false;
      this.showMessage('Profesores eliminados correctamente', 'success');
    }).catch(() => {
      this.loading = false;
      this.deleteMultiple = false;
      this.showMessage('Error eliminando algunos profesores', 'danger');
    });
  }

  editTeacher(teacher: any) { this.selectedTeacher = { ...teacher }; }
  closeModal() { this.selectedTeacher = null; }

  updateTeacher(form: NgForm) {
    if (!this.selectedTeacher?.id) return;
    if (form.invalid) { Object.values(form.controls).forEach(c => c.markAsTouched()); return; }
    this.loading = true;
    const data = {
      first_name: this.selectedTeacher.first_name,
      last_name: this.selectedTeacher.last_name,
      email: this.selectedTeacher.email,
      is_active: this.selectedTeacher.is_active
    };
    this.userService.updateUser(this.selectedTeacher.id, data).subscribe({
      next: () => {
        const index = this.teachers.findIndex(t => t.id === this.selectedTeacher.id);
        if (index !== -1) this.teachers[index] = { ...this.selectedTeacher };
        this.loading = false;
        this.closeModal();
        this.showMessage('Profesor actualizado correctamente', 'success');
      },
      error: () => { this.loading = false; this.showMessage('Error al actualizar el profesor', 'danger'); }
    });
  }

  confirmDelete(teacher: any) { this.teacherToDelete = teacher; }
  closeDeleteModal() { this.teacherToDelete = null; }

  deleteConfirmed() {
    if (!this.teacherToDelete) return;
    this.loading = true;
    this.userService.deleteUser(this.teacherToDelete.id).subscribe({
      next: () => {
        this.teachers = this.teachers.filter(t => t.id !== this.teacherToDelete.id);
        this.teacherToDelete = null;
        this.loading = false;
        this.showMessage('Profesor eliminado correctamente', 'success');
      },
      error: () => { this.loading = false; this.showMessage('Error eliminando el profesor', 'danger'); }
    });
  }
}
