import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ScrollAnimateDirective } from '../../../../shared/directives/scroll-animate.directive';

@Component({
  selector: 'app-admins',
  standalone: true,
  imports: [CommonModule, FormsModule, ScrollAnimateDirective],
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.css']
})
export class AdminsComponent implements OnInit {

  admins: any[] = [];
  loading = false;

  selectedAdmin: any = null;
  adminToDelete: any = null;
  selectedIds: number[] = [];

  filterName: string = '';
  filterEmail: string = '';

  message: string = '';
  messageType: 'success' | 'danger' | '' = '';

  deleteMultiple = false;

  searchTerm = '';
private debounceTimer: any;

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.getAdmins();
  }

  showMessage(text: string, type: 'success' | 'danger') {
    this.message = text;
    this.messageType = type;
    setTimeout(() => { this.message = ''; this.messageType = ''; }, 4000);
  }

  getAdmins(): void {
    this.loading = true;
    this.userService.viewAdmins().subscribe({
      next: (resp) => { this.admins = Array.isArray(resp) ? resp : []; this.loading = false; },
      error: () => { this.admins = []; this.loading = false; this.showMessage('Error cargando administradores', 'danger'); }
    });
  }

  filteredAdmins(): any[] {
    return this.admins.filter(a =>
      (a.first_name?.toLowerCase().includes(this.filterName.toLowerCase()) ||
       a.last_name?.toLowerCase().includes(this.filterName.toLowerCase())) &&
      a.email?.toLowerCase().includes(this.filterEmail.toLowerCase())
    );
  }

  onSearchChange() {

  clearTimeout(this.debounceTimer);

  this.debounceTimer = setTimeout(() => {

    const term = this.searchTerm.trim();

    if (!term) {
      this.getAdmins();
      return;
    }

    this.userService.searchUsers(term).subscribe({
      next: res => this.admins = Array.isArray(res) ? res : [],
      error: () => this.showMessage('Error en búsqueda', 'danger')
    });

  }, 400);
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
    this.selectedIds = event.target.checked ? this.filteredAdmins().map(a => a.id) : [];
  }

  confirmDeleteMultiple() { if (this.selectedIds.length) this.deleteMultiple = true; }
  closeDeleteMultiple() { this.deleteMultiple = false; }

  async deleteSelected() {

  if (!this.selectedIds.length) return;

  this.loading = true;

  const results = await Promise.allSettled(
    this.selectedIds.map(id =>
      this.userService.deleteUserPromise(id)
    )
  );

  const success = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  this.admins = this.admins.filter(a => !this.selectedIds.includes(a.id));

  this.selectedIds = [];
  this.loading = false;
  this.deleteMultiple = false;

  if (failed === 0) {
    this.showMessage('Administradores eliminados correctamente', 'success');
  } else {
    this.showMessage(`${success} eliminados, ${failed} fallaron`, 'danger');
  }
}

  editAdmin(admin: any) { this.selectedAdmin = { ...admin }; }
  closeModal() { this.selectedAdmin = null; }

  updateAdmin(form: NgForm) {
    if (!this.selectedAdmin?.id) return;
    if (form.invalid) { Object.values(form.controls).forEach(c => c.markAsTouched()); return; }
    this.loading = true;
    const data = {
      first_name: this.selectedAdmin.first_name,
      last_name: this.selectedAdmin.last_name,
      email: this.selectedAdmin.email,
      is_active: this.selectedAdmin.is_active
    };
    this.userService.updateUser(this.selectedAdmin.id, data).subscribe({
      next: () => {
        const index = this.admins.findIndex(a => a.id === this.selectedAdmin.id);
        if (index !== -1) this.admins[index] = { ...this.selectedAdmin };
        this.loading = false;
        this.closeModal();
        this.showMessage('Administrador actualizado correctamente', 'success');
      },
      error: () => { this.loading = false; this.showMessage('Error al actualizar el administrador', 'danger'); }
    });
  }

  confirmDelete(admin: any) { this.adminToDelete = admin; }
  closeDeleteModal() { this.adminToDelete = null; }

  deleteConfirmed() {
    if (!this.adminToDelete) return;
    this.loading = true;
    this.userService.deleteUser(this.adminToDelete.id).subscribe({
      next: () => {
        this.admins = this.admins.filter(a => a.id !== this.adminToDelete.id);
        this.adminToDelete = null;
        this.loading = false;
        this.showMessage('Administrador eliminado correctamente', 'success');
      },
      error: () => { this.loading = false; this.showMessage('Error eliminando el administrador', 'danger'); }
    });
  }
}
