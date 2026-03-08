import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GradesService {

  private apiUrl = `${environment.apiUrl}/grades`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    const token = localStorage.getItem('token') || '';
    return {
      headers: { Authorization: `Bearer ${token}` }
    };
  }

  // Crear calificación
  createGrade(enrollmentId: number, teacherId: number, data: any) {
    return this.http.post(
      `${this.apiUrl}/${enrollmentId}/${teacherId}`,
      data,
      this.getAuthHeaders()
    );
  }

  // Obtener todas las calificaciones
  getAllGrades() {
    return this.http.get(
      `${this.apiUrl}`,
      this.getAuthHeaders()
    );
  }

  // Calificaciones por inscripción
  getGradesByEnrollment(enrollmentId: number) {
    return this.http.get(
      `${this.apiUrl}/enrollment/${enrollmentId}`,
      this.getAuthHeaders()
    );
  }

  // Calificaciones por profesor
  getGradesByTeacher(teacherId: number) {
    return this.http.get(
      `${this.apiUrl}/teacher/${teacherId}`,
      this.getAuthHeaders()
    );
  }

  // Obtener una calificación
  getGradeById(id: number) {
    return this.http.get(
      `${this.apiUrl}/${id}`,
      this.getAuthHeaders()
    );
  }

  // Actualizar calificación
  updateGrade(id: number, data: any) {
    return this.http.patch(
      `${this.apiUrl}/${id}`,
      data,
      this.getAuthHeaders()
    );
  }

  // Eliminar calificación
  deleteGrade(id: number) {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      this.getAuthHeaders()
    );
  }

}

