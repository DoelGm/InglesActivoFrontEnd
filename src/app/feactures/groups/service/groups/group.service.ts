import { Injectable } from '@angular/core';
import { environment } from '../../../../../enviroment/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Group {
  id?: number;
  code: string;
  name: string;
  description?: string;
  start_date: string;
  end_date: string;
  capacity: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private apiUrl = `${environment.apiUrl}/groups`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  // Crear un grupo
  createGroup(group: Partial<Group>): Observable<Group> {
    return this.http.post<Group>(this.apiUrl, group, { headers: this.getAuthHeaders() });
  }

  // Obtener todos los grupos
  getAllGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // Obtener un grupo por ID
  getGroupById(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Actualizar un grupo por ID
  updateGroup(id: number, group: Partial<Group>): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/${id}`, group, { headers: this.getAuthHeaders() });
  }

  // Eliminar un grupo por ID
  deleteGroup(id: number): Observable<Group> {
    return this.http.delete<Group>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
