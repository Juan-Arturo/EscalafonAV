import { Component, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'auth-component',
  imports: [RouterModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class AuthComponent { }
