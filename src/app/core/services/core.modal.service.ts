// Importa los módulos necesarios de Angular y RxJS
import { Injectable } from '@angular/core'; // Importa el decorador Injectable
import { Subject } from 'rxjs'; // Importa Subject de RxJS para gestionar eventos

// El decorador Injectable hace que este servicio esté disponible a nivel global de la aplicación
@Injectable({
  providedIn: 'root', // Esto asegura que el servicio sea accesible en toda la aplicación
})
export class CoreModalService {
  // Creamos un Subject privado para gestionar el estado del modal
  private modalState = new Subject<any>();
  // El modalState$ es un Observable que permite que otros componentes se suscriban y escuchen el estado del modal
  modalState$ = this.modalState.asObservable();

  // Método para abrir el modal y pasar datos específicos a través de la emisión del Subject
  open(
    component: any,
    title: string,
    data?: any,
    imageUrl?: any,
    pdfUrl?: any
  ) {
    // Emite un nuevo valor en el Subject con los datos necesarios para abrir el modal
    this.modalState.next({ component, title, data, imageUrl, pdfUrl });
  }

  // Método para cerrar el modal, emitiendo un valor falso para indicar que el modal debe cerrarse
  close() {
    this.modalState.next(false);
  }
}
