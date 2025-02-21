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

import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ScrollService } from '../../core/services/scroll.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
 constructor(private scrollService: ScrollService) {}
  ngOnInit(): void {
    this.goToSection("home")
  }


  goToSection(sectionId: string) {
    this.scrollService.scrollToSection(sectionId, '/escalafon');
  }
}
