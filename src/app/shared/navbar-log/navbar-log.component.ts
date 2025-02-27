import { Component } from '@angular/core';
import { AuthLoginService } from '../../main/auth/services/auth.login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-log',
  imports: [],
  templateUrl: './navbar-log.component.html',
  styleUrl: './navbar-log.component.css'
})
export class NavbarLogComponent {


  constructor(private authService: AuthLoginService, private router: Router) { }
  
    // Método para cerrar sesión
    logout(): void {
      this.authService.logout(); // Llama al servicio de autenticación para cerrar sesión
      this.router.navigate(['/escalafon/home']); // Redirige al usuario a la página de login
    }
}
