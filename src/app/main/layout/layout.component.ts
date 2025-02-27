import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarLogComponent } from '../../shared/navbar-log/navbar-log.component';
import { AuthLoginService } from '../auth/services/auth.login.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet,FormsModule, CommonModule,
     NavbarComponent, NavbarLogComponent,FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  constructor(private authService: AuthLoginService) {}

  isAuthenticated: boolean = false; // Variable para almacenar si el usuario esta autenticado

  ngOnInit(): void {
    this.iamAuthenticated();
  }


  //verificar si el usuario esta autenticado al iniciar el componente
  iamAuthenticated() {
    this.isAuthenticated = this.authService.isLoggedIn();
  }

  //verificar si el usuario esta autenticado manualmente
  ngDoCheck(): void {
    this.isAuthenticated = this.authService.isLoggedIn();
  }
}
