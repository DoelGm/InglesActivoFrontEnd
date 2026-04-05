import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroment/environment';
import { Observable, of, tap } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private cache = new Map<string, any>();
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
  }


  createTeacher(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/create-teacher`, data, {
      headers: this.getAuthHeaders()
    });
  }

  createStudent(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/create-student`, data, {
      headers: this.getAuthHeaders()
    });
  }

  createAdmin(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/create-admin`, data, {
      headers: this.getAuthHeaders()
    });
  }

  changePassword(data: { userId: number; newPassword: string }) {
    return this.http.post(`${this.apiUrl}/users/change-password`, data);
  }

  private cachedRequest(key: string, request: Observable<any>) {
    if (this.cache.has(key)) {
      return of(this.cache.get(key));
    }

    return request.pipe(
      tap(data => this.cache.set(key, data))
    );
  }


  viewStudents(): Observable<any> {
    return this.cachedRequest(
      'students',
      this.http.get(`${this.apiUrl}/users/students`, { headers: this.getAuthHeaders() })
    );
  }

  getAllStudents(): Observable<any> {
    return this.http.get(`${this.apiUrl}/students_profile`, { headers: this.getAuthHeaders() });
  }

  viewTeachers(): Observable<any> {
    return this.cachedRequest(
      'teachers',
      this.http.get(`${this.apiUrl}/users/teachers`, { headers: this.getAuthHeaders() })
    );
  }

  getAllTeachers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/teachers`, { headers: this.getAuthHeaders() });
  }

  viewAdmins(): Observable<any> {
    return this.cachedRequest(
      'admins',
      this.http.get(`${this.apiUrl}/users/admins`, { headers: this.getAuthHeaders() })
    );
  }

  getUserById(id: number) {
    return this.cachedRequest(
      `user-${id}`,
      this.http.get(`${this.apiUrl}/users/${id}`, { headers: this.getAuthHeaders() })
    );
  }


  searchUsers(term: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/search?q=${term}`, {
      headers: this.getAuthHeaders()
    });
  }



  updateUser(id: number, data: any): Observable<any> {
    this.clearUserCache(id);
    return this.http.put(`${this.apiUrl}/users/${id}`, data, {
      headers: this.getAuthHeaders()
    });
  }

  deleteUser(id: number): Observable<any> {
    this.clearUserCache(id);
    return this.http.delete(`${this.apiUrl}/users/${id}`, {
      headers: this.getAuthHeaders()
    });
  }

  private clearUserCache(id: number) {
    this.cache.delete(`user-${id}`);
    this.cache.delete('teachers');
    this.cache.delete('students');
    this.cache.delete('admins');
  }


  deleteUserPromise(id: number) {
    return firstValueFrom(this.deleteUser(id));
  }
}