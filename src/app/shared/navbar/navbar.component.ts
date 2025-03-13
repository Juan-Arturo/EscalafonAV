// import { Component } from '@angular/core';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-navbar',
//   imports: [RouterModule],
//   templateUrl: './navbar.component.html',
//   styleUrl: './navbar.component.css'
// })
// export class NavbarComponent {

// }

import { Component, OnInit, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isMobileMenuOpen: boolean = false;

  ngOnInit(): void {
    // Escuchar eventos de navegación
    this.closeMenuOnNavigation();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Obtener el elemento nav
    const navmenu = document.getElementById('navmenu');
    const mobileToggle = document.querySelector('.mobile-nav-toggle');

    // Si el menú está abierto y el clic no fue dentro del nav ni en el botón toggle
    if (this.isMobileMenuOpen && navmenu && mobileToggle) {
      if (!navmenu.contains(event.target as Node) && 
          !mobileToggle.contains(event.target as Node)) {
        this.closeMobileMenu();
      }
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.updateMenuState();
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.updateMenuState();
  }

  private updateMenuState(): void {
    const navmenu = document.getElementById('navmenu');
    if (navmenu) {
      if (this.isMobileMenuOpen) {
        navmenu.classList.add('navbar-mobile');
        document.body.classList.add('mobile-nav-active');
      } else {
        navmenu.classList.remove('navbar-mobile');
        document.body.classList.remove('mobile-nav-active');
      }
    }
  }

  private closeMenuOnNavigation(): void {
    // Agregar listener para los clicks en los enlaces
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'A') {
        this.closeMobileMenu();
      }
    });
  }
}