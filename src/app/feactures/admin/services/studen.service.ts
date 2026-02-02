import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudenService {

  private apiUrl = `${environment.apiUrl}/auth`;

   constructor(private http: HttpClient) {}

  createStudent(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
}
}