import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudenService {

  private apiUrl = `${environment.apiUrl}`;

   constructor(private http: HttpClient) {}

  createUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data);
}

createStudentProfile(data: any) 
{ 
  return this.http.post(`${this.apiUrl}/users/create-student`, data); }
createTeacherProfile(data: any) 
{ 
  return this.http.post(`${this.apiUrl}/users/create-teacher`, data); }

  vewStudents(): Observable<any> {
    return this.http.get(`${this.apiUrl}users/students`);
  }
}