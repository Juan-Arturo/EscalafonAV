import {
  Component,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  ElementRef,
} from '@angular/core';
// Importación de clases necesarias de Angular para manejar el ciclo de vida del componente y elementos del DOM.
import { Modal } from 'bootstrap'; // Importa la clase Modal de Bootstrap para manejar el modal.
import { CoreModalService } from '../../core/services/core.modal.service'; // Importa el servicio que maneja el estado del modal.
import { CommonModule } from '@angular/common'; // Importa el módulo común de Angular (usado para pipes, directivas, etc.).
import { SafeUrlPipe } from '../../core/pipes/safe-url.pipe'; // Importa un pipe personalizado que permite manejar URLs de manera segura.
import { Subscription } from 'rxjs'; // Importa Subscription de RxJS para manejar las suscripciones a observables.

@Component({
  selector: 'shared-custom-modal-component', // El selector que se utilizará para insertar este componente en el HTML.
  templateUrl: './shared-custom-modal.component.html', // Ruta del template HTML que define la vista del componente.
  imports: [CommonModule, SafeUrlPipe], // Importación de módulos y pipes necesarios.
})
export class SharedCustomModalComponent implements AfterViewInit, OnDestroy {
  title = ''; // Propiedad para almacenar el título del modal.
  data = ''; // Propiedad para almacenar los datos que se mostrarán en el modal.
  imageUrl? = null; // Propiedad opcional para almacenar la URL de una imagen a mostrar.
  pdfUrl? = null; // Propiedad opcional para almacenar la URL de un archivo PDF a mostrar.

  // Referencia a un contenedor donde se cargarán dinámicamente los componentes dentro del modal.
  @ViewChild('contentContainer', { read: ViewContainerRef, static: true })
  contentContainer!: ViewContainerRef;

  // Referencia al elemento del modal para inicializar y controlar el modal de Bootstrap.
  @ViewChild('modalElement', { static: true }) modalElement!: ElementRef;

  modalInstance!: Modal; // Instancia del modal de Bootstrap.
  private modalSubscription!: Subscription; // Suscripción para escuchar cambios en el estado del modal.

  constructor(private modalService: CoreModalService) {
    // Suscripción al observable modalState$ del servicio CoreModalService para recibir datos del modal.
    this.modalSubscription = this.modalService.modalState$.subscribe(
      (modalData) => {
        if (!modalData) {
          this.close(); // Si no hay datos, cierra el modal.
          return;
        }
        // Si hay datos, asigna los valores a las propiedades del componente.
        this.title = modalData.title;
        this.imageUrl = modalData.imageUrl;
        this.pdfUrl = modalData.pdfUrl;
        this.data = modalData.data;

        // Si se proporciona un componente, lo carga dinámicamente dentro del modal.
        if (modalData.component) {
          this.loadComponent(modalData.component, this.data);
        } else {
          this.modalInstance.show(); // Si no hay componente, solo muestra el modal.
        }
      }
    );
  }

  ngAfterViewInit() {
    // Después de que la vista haya sido inicializada, crea una instancia del modal de Bootstrap.
    this.modalInstance = new Modal(this.modalElement.nativeElement);
  }

  ngOnDestroy() {
    // Al destruir el componente, cancela la suscripción al observable para evitar pérdidas de memoria.
    this.modalSubscription.unsubscribe();
    this.close(); // Cierra el modal al destruir el componente.
  }

  // Método para cargar un componente dinámicamente dentro del modal.
  private loadComponent(component: any, data: any) {
    this.contentContainer.clear(); // Limpia cualquier contenido previamente cargado en el contenedor.
    if (component) {
      // Crea el componente dinámicamente y le asigna los datos.
      const componentRef = this.contentContainer.createComponent(component);
      Object.assign(componentRef.instance as any, {
        ...data,
        close: () => this.close(), // Pasa el método close como parte de los datos.
      });
    }
    this.modalInstance.show(); // Muestra el modal después de cargar el componente.
  }

  // Método para cerrar el modal y limpiar el contenido cargado.
  close() {
    this.modalInstance.hide(); // Oculta el modal.
    this.contentContainer.clear(); // Limpia el contenido cargado dinámicamente.
  }
}
