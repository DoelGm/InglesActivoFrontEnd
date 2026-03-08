import { Component, OnInit } from '@angular/core';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EnrollmentService } from '../../../groups/service/enrollment/enrollment.service';
import { TeacherAssignmentService } from '../../../groups/service/teachers-assignment/teacher-assignment.service';
import { GradesService } from '../../services/grades.service';
import { GroupService } from '../../../groups/service/groups/group.service';

@Component({
  selector: 'app-my-grades',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule, NgClass, DatePipe],
  templateUrl: './my-grades.component.html',
  styleUrl: './my-grades.component.css'
})
export class MyGradesComponent implements OnInit {

  userRole = '';
  userId = 0;
  userName = '';

  groups: any[] = []
  grades: any[] = []

  selectedGroupId: number = 0

  studentsInGroup: any[] = []
  assignments: any[] = []

  teacherId: number = 0

  loading = false
  message = ''
  messageType: '' | 'success' | 'danger' = ''

  constructor(
    private enrollmentService: EnrollmentService,
    private gradesService: GradesService,
    private groupsService: GroupService,
    private teacherAssignmentService: TeacherAssignmentService
  ) {}

  ngOnInit() {
    this.loadUser()
    this.loadGroups()
    this.loadAssignments()

    if (this.userRole === 'student') {
      this.loadStudentGrades()
    }
  }

  loadUser() {

    const role = localStorage.getItem('role')
    const user = JSON.parse(localStorage.getItem('user') || '{}')

    this.userRole = role || ''
    this.userId = user?.id || 0
    this.userName = (user?.first_name || '') + ' ' + (user?.last_name || '')

  }

  loadGroups() {
    this.groupsService.getAllGroups().subscribe({
      next: (data: any) => this.groups = data
    })
  }

  loadAssignments() {

    this.teacherAssignmentService.getAssignments().subscribe({
      next: (data: any) => {
        this.assignments = data
      }
    })

  }

  loadStudentsByGroup() {

    if (!this.selectedGroupId) return

    this.loading = true

    const groupId = Number(this.selectedGroupId)

    const assignment = this.assignments.find(
      (a: any) => Number(a.group?.id) === groupId
    )

    if (!assignment) {

      this.loading = false
      this.teacherId = 0

      this.showMessage('Teacher not assigned to this group', 'danger')
      return

    }

    this.teacherId = assignment.teacher?.id

    this.enrollmentService
      .getEnrollmentsByGroupId(groupId)
      .subscribe({

        next: (enrollments: any) => {

          this.studentsInGroup = []

          enrollments.forEach((e: any) => {

            this.gradesService
              .getGradesByEnrollment(e.id)
              .subscribe({

                next: (grades: any) => {

                  const grade = grades?.length ? grades[0] : null

                  this.studentsInGroup.push({

                    enrollmentId: e.id,

                    studentName:
                      e.student.user.first_name +
                      ' ' +
                      e.student.user.last_name,

                    score: grade ? grade.score : '',
                    comments: grade ? grade.comments : ''

                  })

                },

                error: () => {

                  this.studentsInGroup.push({

                    enrollmentId: e.id,

                    studentName:
                      e.student.user.first_name +
                      ' ' +
                      e.student.user.last_name,

                    score: '',
                    comments: ''

                  })

                }

              })

          })

          this.loading = false

        },

        error: () => {

          this.loading = false
          this.showMessage('Error loading students', 'danger')

        }

      })

  }

  saveAllGrades() {

    if (!this.teacherId) {
      this.showMessage('Teacher not assigned to this group', 'danger')
      return
    }

    const requests = this.studentsInGroup.map(s => {

      if (!s.score) return null

      return this.gradesService.createGrade(

        s.enrollmentId,
        this.teacherId,
        {
          score: s.score,
          comments: s.comments
        }

      )

    }).filter(Boolean)

    if (requests.length === 0) {

      this.showMessage('No grades to save', 'danger')
      return

    }

    this.loading = true

    let completed = 0

    requests.forEach((r: any) => {

      r.subscribe({

        next: () => {

          completed++

          if (completed === requests.length) {

            this.loading = false
            this.showMessage('Grades saved', 'success')

          }

        },

        error: () => {

          this.loading = false
          this.showMessage('Error saving grades', 'danger')

        }

      })

    })

  }

  loadStudentGrades() {

    this.enrollmentService
      .getByStudent(this.userId)
      .subscribe({

        next: (enrollments: any) => {

          enrollments.forEach((e: any) => {

            this.gradesService
              .getGradesByEnrollment(e.id)
              .subscribe({

                next: (g: any) => {

                  g.forEach((grade: any) => {

                    this.grades.push({

                      ...grade,

                      groupName: e.group.name,
                      score: grade.score,
                      comments: grade.comments,
                      createdAt: grade.date_recorded

                    })

                  })

                }

              })

          })

        }

      })

  }

  showMessage(text: string, type: 'success' | 'danger') {

    this.message = text
    this.messageType = type

    setTimeout(() => {
      this.message = ''
      this.messageType = ''
    }, 3000)

  }

}