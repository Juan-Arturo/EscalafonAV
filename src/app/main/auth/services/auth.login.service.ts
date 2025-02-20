import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, debounceTime, map, switchMap } from 'rxjs/operators';
import { CoreAlertService } from '../../../core/services/core.alert.service';
import { environment } from '../../../../environments/environment';
import { injectDispatch } from '@reduxjs/angular-redux';
import {
  loginReducer,
  logoutReducer,
} from '../../../store/slices/authSlice/authSlice';
import { handleError } from '../../../core/helpers/handle';
import { newUser } from '../interfaces/loginResponse';
@Injectable({
  providedIn: 'root',
})
export class AuthLoginService {
  private apiUrl = environment.apiUrl; // Se ajusta la ruta base de autenticación
  private refreshTokenInProgress = false;
  private dispatch;
  constructor(
    private http: HttpClient,
    private router: Router,
    private alertService: CoreAlertService
  ) {
    this.dispatch = injectDispatch();
  }

  login(email: string, password: string): Observable<boolean> {
    return this.http
      .post<{ token: string; user: any }>(`${this.apiUrl}/auth/login`, {
        nombre_usuario: email,
        contrasena: password,
      })
      .pipe(
        map((response) => {
          if (response && response.token) {
            localStorage.setItem('authToken', response.token);
            this.dispatch(loginReducer(response.user));
            return true;
          }
          return false;
        }),
        catchError((error) =>
          handleError(error, this.alertService, 'Error de autenticación')
        )
      );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    this.dispatch(logoutReducer());
    this.router.navigate(['/auth/login']);
  }

  isLoggedIn(): string | null {
    return localStorage.getItem('authToken') || '';
  }

  isLoggedInInfo(): Observable<boolean> {
    return this.http.get<any>(`${this.apiUrl}/auth/isLoggin`).pipe(
      map((response) => {
        this.dispatch(loginReducer({ user: response.user }));
        return true;
      }),
      catchError((error) =>
        handleError(error, this.alertService, 'Error de autenticación')
      )
    );
  }

  getToken(): string | null {
    return localStorage.getItem('authToken') || '';
  }

  renewToken(): Observable<boolean> {
    if (this.refreshTokenInProgress) {
      return of(false);
    }

    this.refreshTokenInProgress = true;
    return this.http
      .get<{ token: string; user: any }>(`${this.apiUrl}/auth/renew-token`)
      .pipe(
        map((response) => {
          if (response && response.token) {
            localStorage.setItem('authToken', response.token);
            this.dispatch(loginReducer({ user: response.user }));
            this.refreshTokenInProgress = false;
            return true;
          }
          this.refreshTokenInProgress = false;
          return false;
        }),
        catchError((error) =>
          handleError(error, this.alertService, 'Error de autenticación')
        )
      );
  }

  handleExpiredToken(): Observable<boolean> {
    return this.renewToken().pipe(
      switchMap((success) => {
        if (success) {
          return of(true);
        } else {
          this.logout();
          return of(false);
        }
      }),
      catchError((error) =>
        handleError(error, this.alertService, 'Error de autenticación')
      )
    );
  }

  register(form: newUser): Observable<boolean> {
    return this.http
      .post<{ msg: string; user: any }>(`${this.apiUrl}/auth/register`, form)
      .pipe(
        map((response) => {
          if (response) {
            this.alertService.success(
              'Registro exitoso, ingresa ahora',
              `Bienvenido ${response.user.nombre_usuario}`
            );
            return true;
          }
          return false;
        }),
        catchError((error) =>
          handleError(error, this.alertService, 'Error al registrar')
        )
      );
  }

  validateField(field: string, value: string): Observable<any> {
    return this.http
      .post<{ msg: string }>(`${this.apiUrl}/auth/validateField`, {
        field,
        value,
      })
      .pipe(
        debounceTime(500), // Espera 500ms antes de hacer la petición
        map((response: any) => {
          // Verifica la respuesta y regresa un Observable
          return response;
        }),
        catchError((error) => {
          console.error('Error de validación:', error);
          return []; // Regresa un Observable vacío para evitar que la suscripción se rompa
        })
      );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http
      .post<{ msg: string }>(`${this.apiUrl}/auth/forgotPassword`, {
        email,
      })
      .pipe(
        debounceTime(500), // Espera 500ms antes de hacer la petición
        map((response: any) => {
          if (response) {
            this.alertService.success(
              'Se ha enviado un mensage a tu correo electronico, sigue las instruciones para restablecer tu contraseña',
              `Solicitud de restablecimiento de contraseña`
            );
            return true;
          }
          return false;
        }),
        catchError((error) => {
          console.error('Error de validación:', error);
          return []; // Regresa un Observable vacío para evitar que la suscripción se rompa
        })
      );
  }

  resetPassword(token: string, contrasena: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agrega el token como un Bearer token en el encabezado
    });

    return this.http
      .post<{ msg: string }>(
        `${this.apiUrl}/auth/resetPassword`,
        {
          token,
          contrasena,
        },
        { headers }
      ) // Pasa los encabezados como una opción en la solicitud HTTP
      .pipe(
        debounceTime(500), // Espera 500ms antes de hacer la petición
        map((response: any) => {
          if (response) {
            this.alertService.success(
              'Se ha cambiado tu contraseña, ingresa ahora',
              `Solicitud de restablecimiento de contraseña`
            );
            return true;
          }
          return false;
        }),
        catchError((error) => {
          console.error('Error de validación:', error);
          return []; // Regresa un Observable vacío para evitar que la suscripción se rompa
        })
      );
  }
}
