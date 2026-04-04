import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../enviroment/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  private api = `${environment.apiUrl}/attendances`;

   private getAuthHeaders() {
    const token = localStorage.getItem('token') || '';
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  }

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(this.api, this.getAuthHeaders());
  }

  getByEnrollment(id: number) {
  return this.http.get<any[]>(`${this.api}/enrollment/${id}`, this.getAuthHeaders());
}

getMyAttendances() {
  return this.http.get<any[]>(`${this.api}/my`, this.getAuthHeaders());
}

  create(data: any) {
    return this.http.post(this.api, data, this.getAuthHeaders());
  }

  update(id: number, data: any) {
    return this.http.patch(`${this.api}/${id}`, data, this.getAuthHeaders());
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`, this.getAuthHeaders());
  }
}