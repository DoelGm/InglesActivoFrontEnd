import { Injectable } from '@angular/core';
import { environment } from '../../../../../enviroment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TeacherAssignmentService {

  private apiUrl = `${environment.apiUrl}/teacher-assignments`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token') || '';
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  }

  assignTeacher(groupId: number, teacherId: number) {
  return this.http.post(
    this.apiUrl,
    { teacherId, groupId },
    this.getAuthHeaders()
  );
}
   getAssignments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}