import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../enviroment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
   private apiUrl = `${environment.apiUrl}`;

   private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  constructor(private http: HttpClient) {}

  getUserById(id: string) {
    return this.http.get(`${this.apiUrl}/users/${id}`, {
      headers: this.getAuthHeaders()
    });
}
}
