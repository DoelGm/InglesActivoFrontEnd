import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileComponent } from '../../../../feactures/profile/components/profile/profile.component';


@Component({
  selector: 'app-navbar',
  imports: [CommonModule, ProfileComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  showProfile: boolean = false;
  homeLink: string = '/home';

  constructor(private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role;
        if (role === 'admin') this.homeLink = '/admin/home';
        else if (role === 'teacher') this.homeLink = '/teacher/home';
        else if (role === 'student') this.homeLink = '/home';
      } catch (error) {
        console.error('Token inválido', error);
      }
    }
  }

  goHome() {
    this.router.navigate([this.homeLink]);
  }

  openProfile() {
    this.showProfile = true;
  }

  closeProfile() {
    this.showProfile = false;
  }
}
