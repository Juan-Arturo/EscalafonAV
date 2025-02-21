import { Component } from '@angular/core';
import { ScrollService } from '../../../../core/services/scroll.service';
import { NewslatterComponent } from '../newslatter/newslatter.component';
import { QuickAcessComponent } from '../quick-acess/quick-acess.component';
import { TeammatesComponent } from '../teammates/teammates.component';
import { ContactComponent } from '../../../../shared/contact/contact.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
