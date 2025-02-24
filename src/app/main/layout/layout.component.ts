import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { FooterComponent } from '../../shared/footer/footer.component';
import { NavbarLogComponent } from '../../shared/navbar-log/navbar-log.component';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, NavbarComponent, NavbarLogComponent,FooterComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
