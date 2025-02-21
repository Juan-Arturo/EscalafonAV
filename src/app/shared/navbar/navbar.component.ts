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

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollService } from '../../core/services/scroll.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
 constructor(private scrollService: ScrollService) {}

  goToSection(sectionId: string) {
    this.scrollService.scrollToSection(sectionId, '/escalafon');
  }
}
