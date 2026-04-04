import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AttendanceService } from '../../service/attendance.service';
import { EnrollmentService } from '../../../groups/service/enrollment/enrollment.service';
import { GroupService } from '../../../groups/service/groups/group.service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent implements OnInit {

  userRole = '';
  userId = 0;

  studentPresentCount = 0;
studentAbsentCount = 0;

  groups: any[] = [];
  selectedGroupId: number | null = null;

  selectedDate: string = new Date().toISOString().substring(0,10);

  studentsInGroup: any[] = [];
  myAttendances: any[] = [];

  presentCount = 0;
  absentCount = 0;

  loading = false;
  message = '';
  messageType: 'success' | 'danger' | '' = '';

  constructor(
    private attendanceService: AttendanceService,
    private enrollmentService: EnrollmentService,
    private groupService: GroupService
  ) {}

  ngOnInit() {
  this.loadUser();
  this.loadGroups();
}

  loadUser() {
  const role = localStorage.getItem('role');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  this.userRole = role || '';
  this.userId = user?.id || 0;

  // 👇 AQUÍ
  if (this.userRole === 'student') {
    this.loadStudentAttendances();
  }
}
  loadGroups() {
    this.groupService.getAllGroups().subscribe({
      next: (data) => this.groups = data
    });
  }

  loadStudentsByGroup() {

    if (!this.selectedGroupId) return;

    this.loading = true;
    this.studentsInGroup = [];

    const selectedDate = this.selectedDate;

    this.enrollmentService
      .getEnrollmentsByGroupId(this.selectedGroupId)
      .subscribe({

        next: (enrollments: any[]) => {

          const requests = enrollments.map(e =>
            this.attendanceService.getByEnrollment(e.id).pipe(
              catchError(() => of([]))
            )
          );

          forkJoin(requests).subscribe({

            next: (results: any[]) => {

              this.studentsInGroup = enrollments.map((e, index) => {

                const attList = results[index] || [];

                const attendance = attList.find((a: any) =>
                  a.attendance_date?.substring(0,10) === selectedDate
                ) || null;

                return {
                  enrollmentId: e.id,
                  studentId: e.student.id,
                  studentName: e.student.user.first_name + ' ' + e.student.user.last_name,
                  status: attendance ? attendance.status : true,
                  date: selectedDate,
                  attendanceId: attendance ? attendance.id : null
                };

              });

              this.calculateStats();
              this.loading = false;

            },

            error: () => {
              this.loading = false;
              this.showMessage('Error loading students', 'danger');
            }

          });

        },

        error: () => {
          this.loading = false;
          this.showMessage('Error loading enrollments', 'danger');
        }

      });

  }

  calculateStats() {
    this.presentCount = this.studentsInGroup.filter(s => s.status === true).length;
    this.absentCount = this.studentsInGroup.length - this.presentCount;
  }

  saveAllAttendance() {

    const requests = this.studentsInGroup.map(s => {

      const payload = {
        attendance_date: s.date,
        status: s.status === true
      };

      if (s.attendanceId) {
        return this.attendanceService.update(s.attendanceId, payload);
      }

      return this.attendanceService.create({
        ...payload,
        enrollment: { id: s.enrollmentId }
      });

    });

    this.loading = true;

    forkJoin(requests).subscribe({
      next: () => {
        this.loading = false;
        this.showMessage('Attendance saved', 'success');
        this.loadStudentsByGroup();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.showMessage('Error saving attendance', 'danger');
      }
    });
  }

  deleteAttendance(id: number) {

    if (!id) return;

    if (!confirm('¿Eliminar esta asistencia?')) return;

    this.attendanceService.delete(id).subscribe({

      next: () => {
        this.showMessage('Deleted', 'success');
        this.loadStudentsByGroup();
      },

      error: () => {
        this.showMessage('Error deleting', 'danger');
      }

    });

  }
loadStudentAttendances() {
  this.attendanceService.getMyAttendances().subscribe({
    next: (data) => {
      this.myAttendances = data.sort((a, b) =>
  new Date(b.attendance_date).getTime() - new Date(a.attendance_date).getTime()
);
 // 🔥 CALCULAR CONTADOR
      this.studentPresentCount = this.myAttendances.filter(a => a.status === true).length;
      this.studentAbsentCount = this.myAttendances.filter(a => a.status === false).length;
    },
    error: (err) => {
      console.error(err);
    }
  });
}

  showMessage(text: string, type: 'success' | 'danger') {
    this.message = text;
    this.messageType = type;

    setTimeout(() => {
      this.message = '';
      this.messageType = '';
    }, 3000);
  }
}