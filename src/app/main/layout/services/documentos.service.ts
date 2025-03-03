import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { CoreAlertService } from '../../../core/services/core.alert.service';
import { CoreLoadingService } from '../../../core/services/core.loading.service';
import { Documento } from '../interfaces/interfaces';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { handleError } from '../../../core/helpers/handle';

@Injectable({
  providedIn: 'root',
})
export class DocumentosService {
  private apiUrl = environment.apiUrl;
  private data: Documento[] = [];

  constructor(
    private alertService: CoreAlertService,
    private loading: CoreLoadingService,
    private http: HttpClient
  ) { }

  getData(): Observable<any> {
    this.loading.show(); // Muestra el indicador de carga all/escalafon
    return this.http.get<any>(`${this.apiUrl}/documents/all`).pipe(
      // Solicitud HTTP GET
      tap(() => this.loading.hide()), // Oculta el indicador de carga después de la operación exitosa
      catchError((error: any) => {
        this.loading.hide();
        return handleError(error, this.alertService, '');
      })
    );
  }

  get(id_Documento: number): Observable<any> {
    this.loading.show(); // Muestra el indicador de carga
    return this.http
      .get<any>(`${this.apiUrl}/documents/getById/${id_Documento}`)
      .pipe(
        // Solicitud HTTP GET
        tap(() => this.loading.hide()), // Oculta el indicador de carga después de la operación exitosa
        catchError((error: any) => {
          this.loading.hide();
          return handleError(error, this.alertService, '');
        })
      );
  }

  add(data: Documento): Observable<any> {
    this.loading.show(); // Muestra el indicador de carga

    return this.http.post(`${this.apiUrl}/documents/register`, data).pipe(
      tap(() => {
        this.loading.hide(); // Oculta el indicador de carga después de una respuesta exitosa
        this.alertService.success('Documento creado exitosamente'); // Muestra un mensaje de éxito
      }),
      catchError((error: any) => {
        console.log(error);
        this.loading.hide();
        return handleError(error, this.alertService, '');
      })
    );
  }

  edit(id_documento: number, data: Documento): Observable<any> {
    this.loading.show(); // Muestra el indicador de carga

    return this.http
      .put(`${this.apiUrl}/documents/update`, { ...data, id_documento })
      .pipe(
        tap(() => {
          this.loading.hide(); // Oculta el indicador de carga después de una respuesta exitosa
          this.alertService.success('El documento se ha actualizado exitosamente'); // Muestra un mensaje de éxito
        }),
        catchError((error: any) => {
          this.loading.hide();
          return handleError(error, this.alertService, '');
        })
      );
  }

  getDataDepartments(): Observable<any> {
    this.loading.show(); // Muestra el indicador de carga
    return this.http.get<any>(`${this.apiUrl}/department/`).pipe(
      // Solicitud HTTP GET
      tap(() => this.loading.hide()), // Oculta el indicador de carga después de la operación exitosa
      catchError((error: any) => {
        this.loading.hide();
        return handleError(error, this.alertService, '');
      })
    );
  }

  documentInfo(
    dt_informacion_rupeet_id: any,
    ct_documento_id: any
  ): Observable<any> {
    return this.http
      .get<any>(
        `${this.apiUrl}/uploadFiles/getById/${dt_informacion_rupeet_id}/${ct_documento_id}`
      )
      .pipe(
        map((response) => {
          return response;
        }),
        catchError((error) => handleError(error, this.alertService, 'Error'))
      );
  }
}
