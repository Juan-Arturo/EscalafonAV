import { Routes } from '@angular/router'; // Importación del módulo para definir las rutas
import { CoreAuthGuard } from '../../core/guards/core.auth.guard';
import { LayoutComponent } from './layout.component';
import { HomeComponent } from './pages/home/home.component';
import { NewslatterComponent } from './pages/newslatter/newslatter.component';
import { QuickAcessComponent } from './pages/quick-acess/quick-acess.component';
import { TeammatesComponent } from './pages/teammates/teammates.component';
import { ContactComponent } from '../../shared/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';



// Definición de las rutas asociadas a la sección de promette
export const layoutRoutes: Routes = [
  {
    path: 'escalafon', // Ruta base para la sección de promette
    component: LayoutComponent, // Componente principal para la vista de promette
    // canActivate: [CoreAuthGuard], // El guard AuthGuard asegura que solo los usuarios autenticados pueden acceder a estas rutas
    children: [
        { path: "home", component: HomeComponent },
        { path: "about", component: AboutComponent },
        { path: "newslatter", component: NewslatterComponent },
        { path: "access", component: QuickAcessComponent },
        { path: "teammates", component: TeammatesComponent },
        {path: "contact", component: ContactComponent},

    ],
  },

//{ path: "escalafon", component: LayoutComponent },
];
