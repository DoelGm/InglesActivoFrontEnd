import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


interface SidebarLink {
  label: string;
  route: string;
}


@Component({
  selector: 'app-sidebar',
  imports: [NgFor, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  links: SidebarLink[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    let role = '';

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        role = payload.role;
      } catch (error) {
        console.error('Token inválido', error);
      }
    }

    // Genera enlaces según el rol
    if (role === 'admin') {
      this.links = [
        { label: 'Groups', route: '/admin/groups' },
        { label: 'Grades', route: '/admin/grades' },
        { label: 'Attendance', route: '/student/grades'}
      ];
    } else if (role === 'teacher') {
      this.links = [
        { label: 'Groups', route: '/teacher/groups' },
        { label: 'Grades', route: '/teacher/grades' },
        { label: 'Attendance', route: '/student/grades'}
      ];
    } else if (role === 'student') {
      this.links = [
        { label: 'Groups', route: '/student/groups' },
        { label: 'Grades', route: '/student/grades' },
        { label: 'Attendance', route: '/student/grades'}
      ];
    }
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }

}
