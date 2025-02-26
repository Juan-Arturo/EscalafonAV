import { Component } from '@angular/core';
import { Documento } from '../ct-documento/interfaces/interfaces';
import { ColDef, themeQuartz } from 'ag-grid-community';

import { DocumentosService } from '../ct-documento/services/documentos.service';
import { AgGridAngular } from 'ag-grid-angular';

import { CommonModule } from '@angular/common';
import { UploadService } from './services/upload.service';
import { injectSelector } from '@reduxjs/angular-redux';

import { PreofileService } from '../profile/services/profile.service';
import { SharedCustomModalComponent } from '../../../shared/shared-custom-modal/shared-custom-modal.component';
import { SharedActionsGridComponent } from '../../../shared/shared-actions-grid/shared-actions-grid.component';
import { CoreModalService } from '../../../core/services/core.modal.service';
import { CoreLoadingService } from '../../../core/services/core.loading.service';
import { RootState } from '../../../store';


@Component({
  selector: 'upload-files-component',
  imports: [AgGridAngular, SharedCustomModalComponent, CommonModule],
  templateUrl: './upload-files.component.html',
  styleUrl: './upload-files.component.css',
})
export class UploadFilesComponent {
  public rowData: Documento[] = [];

  public myTheme = themeQuartz.withParams({
    spacing: 10,
    foregroundColor: '#422b7c',
    headerBackgroundColor: '#e9ddff',
    rowHoverColor: '#fdf7ff',
    // rowHeight: 100,
  });
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];

  public columnDefs: ColDef[] = [
    {
      field: 'nombre_documento',
      headerName: 'Nombre del documento',
      flex: 1,
      maxWidth: 300,
    },
    {
      field: 'vigencia',
      headerName: 'Vigencia',
      flex: 1,
      maxWidth: 200,
      cellRenderer: (params: any) => {
        return params.data.unidad_periodo == 'sin vigencia'
          ? 'Sin vigencia'
          : params.data.vigencia + ' ' + params.data.unidad_periodo;
      },
    },

    {
      field: 'vigencia',
      headerName: 'Fecha de emisión',
      flex: 1,
      maxWidth: 200,
      cellRenderer: (params: any) => {
        return params.data.documentInfo.fecha_emision;
      },
    },

    {
      field: 'vigencia',
      headerName: 'Fecha de vencimiento',
      flex: 1,
      maxWidth: 200,
      cellRenderer: (params: any) => {
        if (params.data.unidad_periodo == 'sin vigencia') {
          return 'Sin vigencia';
        }
        return params.data.documentInfo.fecha_vencimiento;
      },
    },
    {
      field: 'vigencia',
      headerName: 'Días por vencer',
      flex: 1,
      maxWidth: 200,
      cellRenderer: (params: any) => {
        if (params.data.unidad_periodo == 'sin vigencia') {
          return 'Sin vigencia';
        }

        // Obtener la fecha de vencimiento y convertirla en un objeto Date
        const fechaVencimiento = new Date(
          params.data.documentInfo.fecha_vencimiento
        );

        // Obtener la fecha actual (con la zona horaria local)
        const fechaActual = new Date();

        // Asegurarse de que la fecha de vencimiento y la fecha actual estén en la misma zona horaria
        const diferenciaMs = fechaVencimiento.getTime() - fechaActual.getTime();

        // Calcular la diferencia en días
        const diferenciaDias = Math.floor(diferenciaMs / (1000 * 3600 * 24)); // Convierte milisegundos a días

        // Si la fecha ya pasó (diferencia en días negativa), mostrar "Vencido"
        if (diferenciaDias < 0) {
          return 'Vencido';
        }

        // Si la diferencia es menor a 30 días, mostrar días restantes
        if (diferenciaDias === 1) {
          return '1 día';
        }
        if (diferenciaDias < 30) {
          return `${diferenciaDias} días`;
        }

        // Si la diferencia es entre 30 y 365 días, mostrar los meses restantes
        const diferenciaMeses = Math.floor(diferenciaDias / 30); // Aproximación de meses
        if (diferenciaMeses === 1) {
          return '1 mes';
        }
        if (diferenciaMeses < 12) {
          return `${diferenciaMeses} meses`;
        }

        // Si la diferencia es mayor a 365 días, mostrar los años restantes
        const diferenciaAnios = Math.floor(diferenciaDias / 365);
        if (diferenciaAnios === 1) {
          return '1 año';
        }
        return `${diferenciaAnios} años`;
      },
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      cellRenderer: SharedActionsGridComponent,

      cellRendererParams: {
        onUploadFile: this.uploadFile.bind(this),
      },
      flex: 1,

      // Configura el ancho de la columna de acciones.
    },

    {
      field: 'document',
      headerName: 'Documento',
      cellRenderer: SharedActionsGridComponent,

      cellRendererParams: {
        onSeeDocument: this.seeDocument.bind(this),
      },
      flex: 1,
      maxWidth: 200,
      // Configura el ancho de la columna de acciones.
    },
  ];

  public gridOptions = {
    defaultColDef: {
      flex: 1,
      filter: true,
      sortable: true,
      resizable: true,
    },
    columnChooser: true,
    // Habilita el selector de columnas para que el usuario pueda elegir qué columnas ver.
  };

  constructor(
    private modalService: CoreModalService,
    private documentosService: DocumentosService,
    private uploadService: UploadService,
    private profileService: PreofileService,
    private loading: CoreLoadingService
  ) {}
  private userSelector = injectSelector<RootState, any>(
    (state) => state.auth.user
  );
  dataUser: any = {};
  get user() {
    return this.userSelector(); // Se actualiza automáticamente
  }

  ngAfterViewInit(): void {
    this.loadUserData();
  }

  loadData(): void {
    this.documentosService.getData().subscribe({
      next: (data) => {
        const idUser =
          this.dataUser.informacion_rupeet.datos_personales
            .id_informacion_rupeet;

        // Inicializamos una variable para almacenar todos los datos
        let allDocuments: any[] = [];

        // Primero, mapeamos la información de cada documento
        data.documents.map((doc: any) => {
          // Llamamos al servicio para obtener información adicional sobre cada documento
          this.documentosService
            .documentInfo(idUser, doc.id_documento)
            .subscribe({
              next: (documentInfo) => {
                // Concatenamos la información de cada documento con la información ya obtenida
                allDocuments.push({
                  ...doc,
                  documentInfo: documentInfo, // Aquí estamos añadiendo la información del documento
                });

                // Después de añadir los datos del documento, actualizamos rowData
                // Sólo después de haber procesado todos los documentos podemos asignar rowData
                if (allDocuments.length === data.documents.length) {
                  this.rowData = [...allDocuments]; // Esto asegura que rowData tiene todos los documentos completos
                }
              },
              error: (error) => {
                console.error(
                  'Error al obtener información del documento:',
                  error
                );
              },
            });
        });
      },
      error: (error) => {
        console.error('Error al cargar los datos:', error);
      },
    });
  }

  loadUserData() {
    this.loading.show();
    // Usamos un observador o verificación periódica para asegurarnos de que `user` y `curp` existan
    const user = this.user;
    // Verificamos si `user` ya tiene un `curp`
    if (user && user.curp) {
      // Si `curp` existe, hacemos la solicitud al servicio
      this.profileService.getInfo(user.curp).subscribe({
        next: (data: any) => {
          this.dataUser = data;
        },
        error: (error: any) => {
          // Manejo del error en caso de que ocurra
          console.error('Error al obtener la información del usuario:', error);
        },
      });
      this.loadData();
      this.loading.hide();
    } else {
      // Si `curp` no está disponible, verificamos si el estado del usuario cambia
      // Esta es una técnica de comprobación repetida para ver si `user` llega después

      setTimeout(() => {
        this.loadUserData(); // Reintenta cargar los datos si no existe curp
      }, 1000); // Esperamos 1 segundo y lo intentamos nuevamente
    }
  }

  uploadFile(file: any, row: Documento): void {
    this.uploadService
      .uploadFile(
        file,
        row.id_documento,
        this.dataUser.informacion_rupeet.datos_personales.id_informacion_rupeet,
        row.tipo_documento,
        row.nombre_documento
      )
      .subscribe();
    this.loadData();
  }

  seeDocument(row: Documento): void {
    this.uploadService
      .fetchFile(
        this.dataUser.informacion_rupeet.datos_personales.id_informacion_rupeet,
        row.nombre_documento
      )
      .subscribe((imageBlob) => {
        const url = URL.createObjectURL(imageBlob); // Crea una URL temporal para la imagen
        this.modalService.open(null, row.nombre_documento, null, null, url);
      });
  }
}
