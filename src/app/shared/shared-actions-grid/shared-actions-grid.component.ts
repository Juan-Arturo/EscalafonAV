import { CommonModule } from '@angular/common';
// Importa el módulo común de Angular, necesario para usar algunas funcionalidades comunes en los componentes, como pipes o directivas.

import { Component } from '@angular/core';
// Importa el decorador `Component` de Angular para definir el componente.

import type { ICellRendererParams } from 'ag-grid-community';
import { FileUploadModule } from 'primeng/fileupload';
// Importa el tipo `ICellRendererParams` de ag-Grid, que es usado para tipar los parámetros que se pasan al componente de renderizado de celdas.

@Component({
  selector: 'shared-actions-grid-component',
  // Define el selector del componente, que es utilizado para invocar el componente en el HTML.

  imports: [CommonModule, FileUploadModule],
  // Importa los módulos necesarios para este componente. En este caso solo el `CommonModule` que es básico.

  templateUrl: './shared-actions-grid.component.html',
  // Ruta al archivo HTML que contiene la plantilla del componente.
})
export class SharedActionsGridComponent {
  params: any;
  // Propiedad para almacenar los parámetros pasados al componente del renderizado de celdas.

  // Método llamado cuando el componente es inicializado o cuando se reinicia con los parámetros de la celda.
  agInit(params: ICellRendererParams): void {
    this.params = params;
    // Asigna los parámetros del renderizado de la celda a la propiedad `params` del componente.
  }

  // Método llamado cuando el usuario hace clic en el botón "Ver"
  onViewClick(): void {
    if (this.params?.onView) {
      // Si el parámetro `onView` está definido, se ejecuta pasando los datos de la fila.
      this.params?.onView(this.params?.data);
    }
  }

  // Método llamado cuando el usuario hace clic en el botón "Editar"
  onEditClick(): void {
    if (this.params.onEdit) {
      // Si el parámetro `onEdit` está definido, se ejecuta pasando los datos de la fila.
      this.params.onEdit(this.params.data);
    }
  }

  // Método llamado cuando el usuario hace clic en el botón "Eliminar"
  onDeleteClick(): void {
    if (this.params.onDelete) {
      // Si el parámetro `onDelete` está definido, se ejecuta pasando los datos de la fila.
      this.params.onDelete(this.params.data);
    }
  }

  // Método para disparar el clic en el input de archivo
  triggerFileInput(): void {
    const fileInput = document.getElementById(
      'file-upload'
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click(); // Dispara el clic en el input oculto
    }
  }

  // Método para manejar el archivo subido
  uploadFile(event: any): void {
    if (event.files && event.files.length > 0) {
      const file = event.files[0]; // Obtener el primer archivo
      this.params.onUploadFile(file, this.params?.data);
    } else {
      console.error('No se seleccionó ningún archivo');
    }
  }

  // Método llamado cuando el usuario hace clic en el botón "Ver documento"
  onSeeDocumentClick(): void {
    console.log(this.params.data);
    if (this.params.onSeeDocument) {
      // Si el parámetro `onSeeDocument` está definido, se ejecuta pasando los datos de la fila.
      this.params.onSeeDocument(this.params.data);
    }
  }
}
