import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }

  // Para crear profesor (crea usuario + perfil teacher)
  createTeacher(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/create-teacher`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // Para crear estudiante (crea usuario + perfil student)
  createStudent(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/create-student`, data, {
      headers: this.getAuthHeaders()
    });
  }

  // Para crear admin (solo usuario con rol admin)
  createAdmin(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/create-admin`, data, {
      headers: this.getAuthHeaders()
    });
  }

  changePassword(data: { userId: number; newPassword: string }) {
  return this.http.post(`${this.apiUrl}/password-resets`, data);
}


  // Métodos de consulta
  getUserById(id: number) {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  viewStudents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/students`, {
      headers: this.getAuthHeaders()
    });
  }


  updateUser(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }


  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, {
      headers: this.getAuthHeaders()
    });
  }


  viewTeachers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/teachers`, {
      headers: this.getAuthHeaders()
    });
  }

  viewAdmins(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/admins`, {
      headers: this.getAuthHeaders()
    });   
  }
}