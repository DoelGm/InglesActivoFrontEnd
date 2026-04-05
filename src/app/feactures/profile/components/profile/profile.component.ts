import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ChangePasswordComponent } from '../../../change-password/change-password.component';
import { ProfileService } from '../../service/profile.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ChangePasswordComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  
  userData: any = {};
  showChangePassword: boolean = false;

  constructor(
    private router: Router,
    private profileService: ProfileService) {}
 
  ngOnInit() {
    this.loadUserData();
  }

  loadUserData() {
  const token = localStorage.getItem('token');
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.sub;

    this.profileService.getUserById(userId).subscribe((user: any) => {
      this.userData = {
        nombre: user.first_name + ' ' + user.last_name,
        email: user.email,
        role: user.role.name,
        usuario: user.first_name
      };
    });
  }
}


  closeProfile() {
    this.close.emit();
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
    this.closeProfile();
  }

openChangePassword() {
  this.showChangePassword = true;
}

closeChangePassword() {
  this.showChangePassword = false;
}
}