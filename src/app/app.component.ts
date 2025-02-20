import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ContactComponent } from './shared/contact/contact.component';
import { FooterComponent } from './shared/footer/footer.component';
import { FooterALTComponent } from './shared/footer-alt/footer-alt.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ContactComponent, FooterComponent, FooterALTComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ESCALAFON';
}
