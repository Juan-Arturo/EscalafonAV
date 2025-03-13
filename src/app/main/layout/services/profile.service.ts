import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { CoreAlertService } from '../../../core/services/core.alert.service';
import { environment } from '../../../../environments/environment';
import { injectDispatch } from '@reduxjs/angular-redux';

import { handleError } from '../../../core/helpers/handle';
import { CoreLoadingService } from '../../../core/services/core.loading.service';
import { DocumentosService } from './documentos.service';


@Injectable({
  providedIn: 'root',
})
export class PreofileService {
  private apiUrl = environment.apiUrl; // Base URL for authentication

  constructor(
    private http: HttpClient,
    private alertService: CoreAlertService,
    private loading: CoreLoadingService,
    private documentosService: DocumentosService
  ) { }

  // Updated method to return user details, adjust the response format if needed
  getInfo(curp: string): Observable<any> {
    // Changed to Observable<any> if response is more complex
    return this.http
      .post<{ usuario: any }>(`${this.apiUrl}/users/details`, { curp })
      .pipe(
        map((response) => response.usuario), // Assuming you want to return the 'user' object
        catchError((error) =>
          handleError(error, this.alertService, 'Error de autenticación')
        )
      );
  }
  uploadImage(
    file: File,
    ct_documento_id: number,
    dt_informacion_rupeet_id: number
  ): Observable<any> {
    // Muestra el loading
    this.loading.show();

    // Crea un objeto FormData
    const formData = new FormData();
    formData.append(
      'id_informacion_rupeet',
      dt_informacion_rupeet_id.toString()
    );
    formData.append('id_documento', ct_documento_id.toString());
    formData.append('nombreDocumento', 'Foto de perfil');
    formData.append('tipoDocumento', 'image');
    formData.append('file', file, file.name);

    return this.http
      .post<any>(`${this.apiUrl}/uploadFiles/upload`, formData)
      .pipe(
        map((response) => {
          this.loading.hide(); // Oculta el loading
          this.alertService.success(`Se ha guardado la información`);
          return response; // Retorna la respuesta
        }),
        catchError((error) => {
          this.loading.hide(); // Oculta el loading en caso de error
          handleError(error, this.alertService, 'Error al subir la imagen');
          return throwError(error);
        })
      );
  }

  fetchFile(dt_informacion_rupeet_id: number): Observable<any> {
    // Muestra el loading
    this.loading.show();

    // First, fetch the document info
    return this.documentosService
      .documentInfo(dt_informacion_rupeet_id, 15)
      .pipe(
        switchMap((data) => {

          if (!data.ruta) {
            this.loading.hide();
            return ""
          }
          // Construct the URL for the file
          const url = `${this.apiUrl}/uploadFiles/file/${data.ruta}`;

          // Fetch the file as a Blob
          return this.http.get(url).pipe(
            map((response) => {
              this.loading.hide(); // Oculta el loading
              return response; // Retorna la respuesta
            }),
            catchError((error) => {
              this.loading.hide(); // Oculta el loading en caso de error
              // handleError(error, this.alertService, 'Error al obtener la imagen');
              return throwError(error);
            })
          );
        }),
        catchError((error) => {
          this.loading.hide(); // Oculta el loading en caso de error
          console.error('Error al obtener información del documento:', error);
          return throwError(error);
        })
      );
  }

  // Función para guardar la información
  saveInfo(data: any): Observable<any> {
    // Muestra el loading
    this.loading.show();

    return this.http.post<any>(`${this.apiUrl}/users/updateRupeet`, data).pipe(
      map((response) => {
        this.loading.hide(); // Oculta el loading
        if (response) {
          this.alertService.success(`Se ha guardado la información`);
          return true;
        }
        return false;
      }),
      catchError((error) => {
        this.loading.hide(); // Oculta el loading en caso de error
        handleError(
          error,
          this.alertService,
          'Error al guardar la información'
        );
        return throwError(error);
      })
    );
  }
}
