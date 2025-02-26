import { Component, AfterViewInit } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';

import { CommonModule } from '@angular/common';

import {
  AllCommunityModule,
  ColDef,
  ModuleRegistry,
  themeQuartz,
} from 'ag-grid-community';
import { FormComponent } from './components/form/form.component';
import { Documento } from './interfaces/interfaces';
import { DocumentosService } from './services/documentos.service';
import { SharedCustomModalComponent } from '../../../shared/shared-custom-modal/shared-custom-modal.component';
import { SharedActionsGridComponent } from '../../../shared/shared-actions-grid/shared-actions-grid.component';
import { CoreModalService } from '../../../core/services/core.modal.service';
ModuleRegistry.registerModules([AllCommunityModule]);
@Component({
  selector: 'ct-documento-component',
  imports: [AgGridAngular, SharedCustomModalComponent, CommonModule],
  templateUrl: './ct-documento.component.html',
  styleUrls: ['./ct-documento.component.css'],
})
export class CtDocumentoComponent implements AfterViewInit {
  public rowData: Documento[] = [];

  public myTheme = themeQuartz.withParams({
    spacing: 10,
    foregroundColor: '#422b7c',
    headerBackgroundColor: '#e9ddff',
    rowHoverColor: '#fdf7ff',
  });
  public paginationPageSize = 10;
  public paginationPageSizeSelector: number[] | boolean = [10, 25, 50];

  public columnDefs: ColDef[] = [
    {
      field: 'nombre_documento',
      headerName: 'Nombre del documento',
      flex: 1,
    },
    {
      field: 'unidad_periodo',
      headerName: 'Tipo de vigencia',
      flex: 1,
    },
    {
      field: 'vigencia',
      headerName: 'Periodo de vigencia',
      flex: 1,
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      cellRenderer: SharedActionsGridComponent,

      cellRendererParams: {
        onView: this.view.bind(this),
        onEdit: this.edit.bind(this),
        // onDelete: this.delete.bind(this),
      },
      flex: 1,
      maxWidth: 250,
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
    private documentosService: DocumentosService // Inyecta el servicio de datos para acceder a las APIs.
  ) {}

  ngAfterViewInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.documentosService.getData().subscribe({
      next: (data) => {
        console.log(data);
        this.rowData = [...data.documents];
      },
      error: (error) => {
        console.error('Error al cargar los datos:', error);
      },
    });
  }

  // Métodos para las acciones de las filas
  view(row: any) {
    this.modalService.open(FormComponent, 'Ver registro', {
      data: { mode: 'view', id_documento: row.id_documento },
    });
  }

  edit(row: any) {
    this.modalService.open(FormComponent, 'Editar registro', {
      data: {
        mode: 'edit',
        id_documento: row.id_documento,
        loadData: this.loadData.bind(this),
      },
    });
  }

  delete(row: any) {
    // this.alertService
    //   .confirm(
    //     `¿Seguro que deseas eliminar a ${row.nombre}?`,
    //     'Eliminar registro'
    //   )
    //   .then((result) => {
    //     if (result.isConfirmed) {
    //       // Si el usuario confirma, elimina el registro y recarga los datos.
    //       this.documentosService.delete(row.id).subscribe(() => {
    //         this.loadData();
    //       });
    //     }
    //   });
  }

  add() {
    this.modalService.open(FormComponent, 'Agregar registro', {
      data: { mode: 'add', loadData: this.loadData.bind(this) },
    });
  }
}
