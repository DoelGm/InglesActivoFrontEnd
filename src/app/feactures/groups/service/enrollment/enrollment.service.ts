import { Injectable } from '@angular/core';
import { environment } from '../../../../../enviroment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

 private apiUrl = `${environment.apiUrl}/enrollments`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token') || '';
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  }

  enrollStudent(groupId: number, studentId: number) {
    return this.http.post(
      `${this.apiUrl}/${groupId}/${studentId}`,
      {},
      this.getAuthHeaders()
    );
  }

  deleteEnrollment(enrollmentId: number) {
    return this.http.delete(
      `${this.apiUrl}/${enrollmentId}`,
      this.getAuthHeaders()
    );
  }

  getEnrollmentsByGroupId(groupId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/group/${groupId}`, this.getAuthHeaders());
  }

  getByStudent(studentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/student/${studentId}`, this.getAuthHeaders());
  }
}