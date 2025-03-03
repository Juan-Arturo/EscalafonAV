import { Component } from '@angular/core';

import { ColDef, themeQuartz } from 'ag-grid-community';



import { AgGridAngular } from 'ag-grid-angular';
import { CommonModule } from '@angular/common';
import { UploadService } from './services/upload.service';
import { injectSelector } from '@reduxjs/angular-redux';
import { Documento } from '../../interfaces/interfaces';
import { CoreModalService } from '../../../../core/services/core.modal.service';
import { DocumentosService } from '../../services/documentos.service';
import { PreofileService } from '../../services/profile.service';
import { CoreLoadingService } from '../../../../core/services/core.loading.service';
import { CoreAlertService } from '../../../../core/services/core.alert.service';
import { RootState } from '../../../../store';
import { SharedCustomModalComponent } from '../../../../shared/shared-custom-modal/shared-custom-modal.component';
import { SharedActionsGridComponent } from '../../../../shared/shared-actions-grid/shared-actions-grid.component';



@Component({
  selector: 'upload-files-component',
  standalone: true,
  imports: [CommonModule, SharedCustomModalComponent],
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

        if (!params.data.documentInfo.fecha_emision) {
          return "Archivo no subido"
        }
        return params.data.documentInfo.fecha_emision;
      },
    },

    {
      field: 'vigencia',
      headerName: 'Fecha de vencimiento',
      flex: 1,
      maxWidth: 200,
      cellRenderer: (params: any) => {
        if (!params.data.documentInfo.fecha_emision) {
          return "Archivo no subido"
        }
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
        if (!params.data.documentInfo.fecha_emision) {
          return "Archivo no subido"
        }
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
    pagination: false,
    columnChooser: true,
  };

  constructor(
    private modalService: CoreModalService,
    private documentosService: DocumentosService,
    private uploadService: UploadService,
    private profileService: PreofileService,
    private loading: CoreLoadingService,
    private alertService: CoreAlertService
  ) { }
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

  loadData(dataUser: any): void {
    this.documentosService.getData().subscribe({
      next: (data) => {
        const idUser =
          dataUser.informacion_rupeet.datos_personales
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
                  this.rowData = [...allDocuments];
                  this.currentPage = 1; // Resetear a la primera página cuando se cargan nuevos datos
                  this.calculateTotalPages();
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
          this.loadData(data)
        },
        error: (error: any) => {
          // Manejo del error en caso de que ocurra
          console.error('Error al obtener la información del usuario:', error);
        },
      });

      this.loading.hide();
    } else {
      // Si `curp` no está disponible, verificamos si el estado del usuario cambia
      // Esta es una técnica de comprobación repetida para ver si `user` llega después

      setTimeout(() => {
        this.loadUserData(); // Reintenta cargar los datos si no existe curp
      }, 1000); // Esperamos 1 segundo y lo intentamos nuevamente
    }
  }

  uploadFile(event: Event, doc: Documento): void {
    const target = event.target as HTMLInputElement;
    if (target && target.files && target.files[0]) {
      this.uploadService.uploadFile(target.files[0], doc.id_documento, this.dataUser.informacion_rupeet.datos_personales.id_informacion_rupeet, doc.tipo_documento, doc.nombre_documento);
    }
  }

  seeDocument(row: Documento): void {
    if (!row.documentInfo?.ruta) {
      this.alertService.error('No hay documento disponible');
      return;
    }

    this.uploadService.fetchFile(row.documentInfo.ruta).subscribe({
      next: (response: any) => {
        // Ahora response debería ser la URL firmada de S3
        this.modalService.open(null, row.nombre_documento, null, null, response);
      },
      error: (error) => {
        console.error('Error al obtener el documento:', error);
        this.alertService.error('Error al cargar el documento');
      }
    });
  }

  // Variables para la paginación personalizada
  public itemsPerPage: number = 4; // Mantener 4 elementos por página
  public currentPage: number = 1;
  public totalPages: number = 1;
  
  // Método para obtener los elementos de la página actual
  get paginatedData(): Documento[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.rowData.slice(startIndex, endIndex);
  }

  // Método para cambiar de página
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  // Calcular total de páginas
  private calculateTotalPages(): void {
    this.totalPages = Math.max(1, Math.ceil(this.rowData.length / this.itemsPerPage));
  }

  // Método para obtener filas vacías cuando hay menos de 4 elementos
  getEmptyRows(): number[] {
    const currentPageItems = this.paginatedData.length;
    const emptyRowsCount = this.itemsPerPage - currentPageItems;
    return emptyRowsCount > 0 ? Array(emptyRowsCount).fill(0) : [];
  }


  //funciones 
  formatVigencia(documento: Documento): string {
    return documento.unidad_periodo == 'sin vigencia'
      ? 'Sin vigencia'
      : `${documento.vigencia} ${documento.unidad_periodo}`;
  }

  formatFechaEmision(documento: Documento): string {
    if (!documento.documentInfo?.fecha_emision) {
      return "Archivo no subido";
    }
    return documento.documentInfo.fecha_emision;
  }

  formatFechaVencimiento(documento: Documento): string {
    if (!documento.documentInfo?.fecha_emision) {
      return "Archivo no subido";
    }
    if (documento.unidad_periodo == 'sin vigencia') {
      return 'Sin vigencia';
    }
    return documento.documentInfo.fecha_vencimiento;
  }

  calcularDiasRestantes(documento: Documento): string {
    if (!documento.documentInfo?.fecha_emision) {
      return "Archivo no subido";
    }
    if (documento.unidad_periodo == 'sin vigencia') {
      return 'Sin vigencia';
    }

    const fechaVencimiento = new Date(documento.documentInfo.fecha_vencimiento);
    const fechaActual = new Date();
    const diferenciaMs = fechaVencimiento.getTime() - fechaActual.getTime();
    const diferenciaDias = Math.floor(diferenciaMs / (1000 * 3600 * 24));

    if (diferenciaDias < 0) {
      return 'Vencido';
    }

    if (diferenciaDias === 1) {
      return '1 día';
    }
    if (diferenciaDias < 30) {
      return `${diferenciaDias} días`;
    }

    const diferenciaMeses = Math.floor(diferenciaDias / 30);
    if (diferenciaMeses === 1) {
      return '1 mes';
    }
    if (diferenciaMeses < 12) {
      return `${diferenciaMeses} meses`;
    }

    const diferenciaAnios = Math.floor(diferenciaDias / 365);
    if (diferenciaAnios === 1) {
      return '1 año';
    }
    return `${diferenciaAnios} años`;
  }
  
}
