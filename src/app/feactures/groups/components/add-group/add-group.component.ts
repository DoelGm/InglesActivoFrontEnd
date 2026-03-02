import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { GroupService } from '../../service/groups/group.service';
import { UsersService } from '../../../admin/services/users.service';
import { TeacherAssignmentService } from '../../service/teachers-assignment/teacher-assignment.service';
import { EnrollmentService } from '../../service/enrollment/enrollment.service';

interface GroupForm {
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  capacity: number | null;
  teacher_id: number | null;
  student_ids: number[];
}

@Component({
  selector: 'app-add-group',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent implements OnInit {

  group: GroupForm = {
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    capacity: null,
    teacher_id: null,
    student_ids: []
  };
  
  teacherSearch = '';
  studentSearch = '';
  teachers: any[] = [];
  students: any[] = [];

  submitting = false;
  errorMessage = '';
  successMessage = '';

  // Para usar Math en el template
  Math = Math;

  constructor(
    private groupService: GroupService,
    private usersService: UsersService,
    private teacherAssignmentService: TeacherAssignmentService,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
    this.loadStudents();
  }

  loadTeachers(): void {
    this.usersService.getAllTeachers().subscribe({
      next: (teachers) => { 
        const teachersArray = Array.isArray(teachers)
          ? teachers
          : [teachers];

        this.teachers = teachersArray.map((teacher: any) => ({
          teacher_id: teacher.id,
          displayName: `${teacher.user.first_name} ${teacher.user.last_name}`
        }));
      },
      error: (err) => {
        console.error(err);
        this.teachers = [];
      }
    });
  }

  loadStudents(): void {
    this.usersService.getAllStudents().subscribe({
      next: (students) => {
        const studentsArray = Array.isArray(students)
          ? students
          : [students];

        this.students = studentsArray.map((student: any) => ({
          student_id: student.id,
          displayName: `${student.user.first_name} ${student.user.last_name}`
        }));
      },
      error: (err) => {
        console.error(err);
        this.students = [];
      }
    });
  }

  filteredTeachers() {
    if (!this.teacherSearch.trim()) {
      return this.teachers;
    }
    const searchTerm = this.teacherSearch.toLowerCase().trim();
    return this.teachers.filter(t =>
      t.displayName.toLowerCase().includes(searchTerm)
    );
  }

  filteredStudents() {
    if (!this.studentSearch.trim()) {
      return this.students;
    }
    const searchTerm = this.studentSearch.toLowerCase().trim();
    return this.students.filter(s =>
      s.displayName.toLowerCase().includes(searchTerm)
    );
  }

  isSelected(studentId: number): boolean {
    return this.group.student_ids.includes(studentId);
  }

  submitGroup(): void {
    if (
      !this.group.name ||
      !this.group.start_date ||
      !this.group.end_date ||
      this.group.capacity === null ||
      this.group.capacity <= 0 ||
      this.group.teacher_id === null
    ) {
      this.errorMessage = 'Please fill all required fields correctly.';
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      name: this.group.name,
      description: this.group.description,
      start_date: this.group.start_date,
      end_date: this.group.end_date,
      capacity: this.group.capacity,
      code: this.generateCode(),
      is_active: true
    };

    this.groupService.createGroup(payload).subscribe({
      next: (createdGroup) => {
        const groupId = createdGroup?.id;
        if (!groupId) {
          this.errorMessage = 'Invalid group response.';
          this.submitting = false;
          return;
        }

        const teacherRequest =
          this.teacherAssignmentService.assignTeacher(
            groupId,
            this.group.teacher_id!
          );

        const enrollmentRequests = this.group.student_ids.map(
          studentId =>
            this.enrollmentService.enrollStudent(groupId, studentId)
        );

        forkJoin([teacherRequest, ...enrollmentRequests]).subscribe({
          next: () => {
            this.successMessage = 'Group created successfully!';
            this.resetForm();
            this.submitting = false;
          },
          error: (err) => {
            console.error(err);
            this.errorMessage =
              'Error assigning teacher or enrolling students.';
            this.submitting = false;
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.errorMessage =
          err?.error?.message || 'Error creating group.';
        this.submitting = false;
      }
    });
  }

  generateCode(): string {
    return (
      'GRP-' +
      Math.random().toString(36).substring(2, 7).toUpperCase()
    );
  }

  resetForm(): void {
    this.group = {
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      capacity: null,
      teacher_id: null,
      student_ids: []
    };
    this.teacherSearch = '';
    this.studentSearch = '';
  }
}