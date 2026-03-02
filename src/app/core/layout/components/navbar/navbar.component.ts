import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileComponent } from '../../../../feactures/profile/components/profile/profile.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, ProfileComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  showProfile: boolean = false;
  homeLink: string = '/home';

  // Notificaciones
  hasNotifications: boolean = false;
  showNotifications: boolean = false;
  notificationCount: number = 0;
  lastNotification: string = '';
  notifications: string[] = [];

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

    // Ejemplo de notificación simulada al inicio
    setTimeout(() => {
      this.showNotification('¡Tienes un nuevo mensaje!');
    }, 5000);
  }

  // Mostrar nueva notificación (solo afecta el número)
  showNotification(message: string) {
    this.lastNotification = message;
    this.notifications.unshift(message);
    this.notificationCount = this.notifications.length;
    this.hasNotifications = true;
  }

  // Mostrar/ocultar contenido de la notificación al hacer click
  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
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