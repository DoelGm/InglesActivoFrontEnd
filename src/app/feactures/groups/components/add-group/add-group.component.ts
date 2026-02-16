import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupService } from '../../service/group.service';
import { UsersService } from '../../../admin/services/users.service';

@Component({
  selector: 'app-add-group',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {
  group: any = {
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    capacity: 0,
    teacherId: null,
    studentIds: [] as number[]
  };

  teachers: any[] = [];
  students: any[] = [];

  teacherFilter: string = '';
  studentFilter: string = '';

  submitting = false;
  errorMessage = '';
  successMessage = '';

  loadingTeachers = false;
  loadingStudents = false;

  constructor(
    private groupService: GroupService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.loadTeachers();
    this.loadStudents();
  }

  loadTeachers() {
    this.loadingTeachers = true;
    this.usersService.viewTeachers().subscribe({
      next: (res) => {
        this.teachers = Array.isArray(res) ? res : [];
        this.loadingTeachers = false;
      },
      error: (err) => {
        console.error('Error loading teachers', err);
        this.teachers = [];
        this.loadingTeachers = false;
      }
    });
  }

  loadStudents() {
    this.loadingStudents = true;
    this.usersService.viewStudents().subscribe({
      next: (res) => {
        this.students = Array.isArray(res) ? res : [];
        this.loadingStudents = false;
      },
      error: (err) => {
        console.error('Error loading students', err);
        this.students = [];
        this.loadingStudents = false;
      }
    });
  }

  filteredTeachers() {
    if (!this.teacherFilter) return this.teachers;
    return this.teachers.filter(t =>
      (t.first_name + ' ' + t.last_name).toLowerCase().includes(this.teacherFilter.toLowerCase())
    );
  }

  filteredStudents() {
    if (!this.studentFilter) return this.students;
    return this.students.filter(s =>
      (s.first_name + ' ' + s.last_name).toLowerCase().includes(this.studentFilter.toLowerCase())
    );
  }

  submitGroup() {
    if (!this.group.name || !this.group.start_date || !this.group.end_date || !this.group.capacity || !this.group.teacherId) {
      this.errorMessage = 'Please fill all required fields.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      ...this.group,
      code: this.generateCode(),
      is_active: true
    };

    this.groupService.createGroup(payload).subscribe({
      next: (res) => {
        this.successMessage = 'Group created successfully!';
        console.log('Created group:', res);
        this.resetForm();
        this.submitting = false;
      },
      error: (err) => {
        console.error('Error creating group:', err);
        this.errorMessage = err?.error?.message || 'Error creating group. Check console.';
        this.submitting = false;
      }
    });
  }

  generateCode(): string {
    return 'GRP-' + Math.random().toString(36).substring(2, 7).toUpperCase();
  }

  resetForm() {
    this.group = {
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      capacity: 0,
      teacherId: null,
      studentIds: []
    };
    this.teacherFilter = '';
    this.studentFilter = '';
  }
}
