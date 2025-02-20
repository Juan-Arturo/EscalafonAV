import { Routes } from '@angular/router'; // Importación del módulo para definir las rutas
import { CoreAuthGuard } from '../../core/guards/core.auth.guard';
import { LayoutComponent } from './layout.component';


// Definición de las rutas asociadas a la sección de promette
export const layoutRoutes: Routes = [
//   {
//     path: 'escalafon', // Ruta base para la sección de promette
//     component: LayoutComponent, // Componente principal para la vista de promette
//     canActivate: [CoreAuthGuard], // El guard AuthGuard asegura que solo los usuarios autenticados pueden acceder a estas rutas
//     children: [
     
//     ],
//   },

{ path: "escalafon", component: LayoutComponent },
];
