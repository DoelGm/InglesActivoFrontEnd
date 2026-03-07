import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { GroupService, Group } from '../../service/groups/group.service';
import { EnrollmentService } from '../../service/enrollment/enrollment.service';
import { TeacherAssignmentService } from '../../service/teachers-assignment/teacher-assignment.service';


@Component({
  selector: 'app-my-groups',
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule],
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.css']
})
export class MyGroupsComponent implements OnInit {

  groups: Group[] = [];
  filteredGroups: Group[] = [];
  colors: string[] = [];
  filterText = '';

  isAdmin = false;

  groupToDelete: Group | null = null;
  selectedGroups: number[] = [];
  showMultiDeleteModal = false;

  groupToEdit: Group | null = null;
  editData: Partial<Group> = {
    name: '',
    description: ''
  };

  constructor(
    private router: Router,
    private groupService: GroupService,
    private enrollmentService: EnrollmentService,
    private teacherAssignmentService: TeacherAssignmentService
  ) {}

  ngOnInit() {
    const role = localStorage.getItem('role');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.id;

    this.isAdmin = role === 'admin';

    if (role === 'admin') {
      this.loadAllGroups();
    } else if (role === 'student') {
      this.loadStudentGroups(userId);
    } else if (role === 'teacher') {
      this.loadTeacherGroups(userId);
    }
  }


  loadAllGroups() {
    this.groupService.getAllGroups().subscribe({
      next: (res) => {
        this.setGroups(res);
      },
      error: (err) => console.error(err)
    });
  }

  loadStudentGroups(studentId: number) {
    this.enrollmentService.getByStudent(studentId).subscribe({
      next: (res) => {
        const groups = res.map(e => e.group);
        this.setGroups(groups);
      },
      error: (err) => console.error(err)
    });
  }

  loadTeacherGroups(teacherId: number) {
  this.teacherAssignmentService.getAssignments().subscribe({
    next: (res) => {
      // Filtrar solo las asignaciones del teacher logeado
      const myAssignments = res.filter(a => a.teacher.id === teacherId);

      const groups = myAssignments.map(a => a.group);

      this.setGroups(groups);
    },
    error: (err) => console.error(err)
  });
}

  setGroups(groups: Group[]) {
    this.groups = groups;
    this.filteredGroups = [...this.groups];
    this.colors = this.groups.map(() => this.getRandomColor());
  }

  // =====================
  // 🔎 FILTRO
  // =====================

  filterGroups() {
    const term = this.filterText.toLowerCase();
    this.filteredGroups =
      this.groups.filter(g =>
        g.name.toLowerCase().includes(term));
  }

  goToGroup(groupId: number) {
    this.router.navigate(['/groups', groupId]);
  }

  getRandomColor(): string {
    const colors = [
      '#FF6B6B','#6BCB77','#4D96FF','#FFD93D',
      '#845EC2','#FF9671','#008F7A',
      '#FFC75F','#F9F871','#D65DB1'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  getInitials(name: string): string {
    return name.split(' ')
      .map(w => w[0])
      .join('')
      .toUpperCase();
  }

  // =====================
  // 📝 EDITAR
  // =====================

  openEditModal(group: Group, event: Event) {
    event.stopPropagation();
    this.groupToEdit = group;
    this.editData = {
      name: group.name,
      description: group.description
    };
  }

  closeEditModal() {
    this.groupToEdit = null;
  }

  saveEdit() {
    if (!this.groupToEdit) return;

    this.groupService.updateGroup(
      this.groupToEdit.id!,
      this.editData
    ).subscribe({
      next: (updated) => {
        const index =
          this.groups.findIndex(g =>
            g.id === updated.id);

        this.groups[index] = updated;
        this.filteredGroups = [...this.groups];
        this.closeEditModal();
      },
      error: (err) => console.error(err)
    });
  }

  // =====================
  // 🗑 ELIMINAR INDIVIDUAL
  // =====================

  openDeleteModal(group: Group, event: Event) {
    event.stopPropagation();
    this.groupToDelete = group;
  }

  closeDeleteModal() {
    this.groupToDelete = null;
  }

  deleteConfirmed() {
    if (!this.groupToDelete) return;

    this.groupService.deleteGroup(
      this.groupToDelete.id!
    ).subscribe({
      next: () => {
        this.groups =
          this.groups.filter(g =>
            g.id !== this.groupToDelete!.id);

        this.filteredGroups = [...this.groups];
        this.groupToDelete = null;
      },
      error: (err) => console.error(err)
    });
  }

  // =====================
  // 🗑 ELIMINAR MÚLTIPLE
  // =====================

  toggleSelection(id: number, event: any) {
    event.stopPropagation();

    if (event.target.checked) {
      this.selectedGroups.push(id);
    } else {
      this.selectedGroups =
        this.selectedGroups.filter(g => g !== id);
    }
  }

  openMultiDeleteModal() {
    this.showMultiDeleteModal = true;
  }

  closeMultiDeleteModal() {
    this.showMultiDeleteModal = false;
  }

  deleteMultipleConfirmed() {
    const requests =
      this.selectedGroups.map(id =>
        this.groupService.deleteGroup(id)
      );

    forkJoin(requests).subscribe({
      next: () => {
        this.groups =
          this.groups.filter(g =>
            !this.selectedGroups.includes(g.id!));

        this.filteredGroups = [...this.groups];
        this.selectedGroups = [];
        this.showMultiDeleteModal = false;
      },
      error: (err) => console.error(err)
    });
  }
}