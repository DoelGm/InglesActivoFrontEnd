import { Component, OnInit } from '@angular/core';
import { StudenService } from '../../services/studen.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-students',
  imports: [CommonModule],
  templateUrl: './students.component.html',
  styleUrl: './students.component.css'
})
export class StudentsComponent implements OnInit {

  students: any[] = [];
  loading = false;

  constructor(private studentService: StudenService) {}

  ngOnInit(): void {
    this.getStudents();
  }

  getStudents(): void {
    this.loading = true;
    this.studentService.vewStudents().subscribe({
      next: (resp) => {
        this.students = resp;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener estudiantes', err);
        this.loading = false;
      }
    });
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }
}

