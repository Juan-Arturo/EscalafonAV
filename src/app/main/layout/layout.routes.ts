import { Routes } from '@angular/router'; // Importación del módulo para definir las rutas
import { LayoutComponent } from './layout.component';
import { HomeComponent } from './pages/home/home.component';
import { NewslatterComponent } from './pages/newslatter/newslatter.component';

import { TeammatesComponent } from './pages/teammates/teammates.component';
import { ContactComponent } from '../../shared/contact/contact.component';
import { AboutComponent } from './pages/about/about.component';
import { RegisterFormComponent } from './elements/register-form/register-form.component';
import { QuickAcessComponent } from './pages/quick-acess/quick-acess.component';
import { CoreAuthGuard } from '../../core/guards/core.auth.guard';
import { CoreLoginGuard } from '../../core/guards/core.login.guard';




// Definición de las rutas asociadas a la sección de promette
export const layoutRoutes: Routes = [
 
  {
    path: 'escalafon',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: "home", component: HomeComponent }, //CoreLoginGuard protege la ruta de usuarios autenticados
      { path: "about", component: AboutComponent },
      { path: "newslatter", component: NewslatterComponent, },
      { path: "access", component: QuickAcessComponent,  },
      { path: "teammates", component: TeammatesComponent,  },
      { path: "contact", component: ContactComponent, },
      { path: "form", component: RegisterFormComponent,canActivate: [CoreAuthGuard] }, //CoreLoginGuard protege la ruta de usuarios NO autenticados
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  
];




