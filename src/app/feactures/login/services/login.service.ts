import { Injectable } from '@angular/core';
import { environment } from '../../../../enviroment/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }
     
    login(email: string, password: string) {
    return this.http.post(`${this.apiUrl}/login`, {
      email,
      password,
    })
    .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Error desconocido';
          
          if (error.status === 401) {
            errorMessage = 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.';
          } else if (error.status === 404) {
            errorMessage = 'No hay cuenta registrada con este correo electrónico.';
          } else if (error.status === 400) {
            errorMessage = 'Email o contraseña inválidos.';
          } else if (error.status === 0) {
            errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
          } else {
            errorMessage = `Error del servidor: ${error.status}`;
          }
          
          return throwError(() => new Error(errorMessage));
        })
      );
  }
  }

