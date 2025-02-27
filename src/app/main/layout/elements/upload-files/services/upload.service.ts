import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


import { injectDispatch } from '@reduxjs/angular-redux';
import { environment } from '../../../../../../environments/environment';
import { CoreAlertService } from '../../../../../core/services/core.alert.service';
import { CoreLoadingService } from '../../../../../core/services/core.loading.service';
import { handleError } from '../../../../../core/helpers/handle';


@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private apiUrl = environment.apiUrl; // Base URL for authentication

  constructor(
    private http: HttpClient,
    private alertService: CoreAlertService,
    private loading: CoreLoadingService
  ) { }

  uploadFile(
    file: File,
    ct_documento_id: number,
    dt_informacion_rupeet_id: number,
    type: string,
    nombre_documento: string
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
    formData.append('nombreDocumento', nombre_documento);
    formData.append('tipoDocumento', type);
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
          handleError(error, this.alertService, 'Error al subir el archivo');
          return throwError(error);
        })
      );
  }

  fetchFile(ruta: string): Observable<Blob> {
    // Muestra el loading
    this.loading.show();

    const url = `${this.apiUrl}/uploadFiles/file/${ruta}`;

    return this.http.get<any>(url).pipe(
      map((response) => {
        this.loading.hide(); // Oculta el loading
        return response; // Retorna la respuesta
      }),
      catchError((error) => {
        this.loading.hide(); // Oculta el loading en caso de error
        handleError(error, this.alertService, 'Error al obtener la imagen');
        return throwError(error);
      })
    );
  }
}
