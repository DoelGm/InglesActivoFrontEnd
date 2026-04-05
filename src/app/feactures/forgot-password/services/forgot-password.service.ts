import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  forgotPassword(data: { email: string }): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/password-resets/forgot-password`,
      data
    );
  }
}

