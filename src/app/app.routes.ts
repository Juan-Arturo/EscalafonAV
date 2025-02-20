import { Routes } from '@angular/router'; // Importación de la interfaz Routes para definir las rutas


import { authRoutes } from './main/auth/auth.routes';
import { layoutRoutes } from './main/layout/layout.routes';

// Definición de las rutas principales de la aplicación
export const routes: Routes = [
  ...authRoutes,
  ...layoutRoutes,

  { path: "", redirectTo: "escalafon", pathMatch: "full" },
  { path: '**', redirectTo: 'escalafon' },
];







// import { Routes } from '@angular/router';

// export const routes: Routes = [];
