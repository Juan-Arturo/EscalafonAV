import { Component } from '@angular/core';
import { ScrollService } from '../../../../core/services/scroll.service';
import { NewslatterComponent } from '../newslatter/newslatter.component';
import { QuickAcessComponent } from '../quick-acess/quick-acess.component';
import { TeammatesComponent } from '../teammates/teammates.component';
import { ContactComponent } from '../../../../shared/contact/contact.component';

@Component({
  selector: 'app-home',
  imports: [NewslatterComponent, QuickAcessComponent, TeammatesComponent, ContactComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
 constructor(private scrollService: ScrollService) {}

  goToSection(sectionId: string) {
    this.scrollService.scrollToSection(sectionId, '/escalafon');
  }
}
