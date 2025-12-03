import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-form',
  imports: [CommonModule],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'] // también estaba mal: debe ser style**s**Url**s**
})
export class LoginFormComponent {
  constructor(private router: Router) {}

  goHome() {
    this.router.navigate(['/home']);
  }
}
