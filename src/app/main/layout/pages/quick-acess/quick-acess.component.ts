import { Component } from '@angular/core';
import { CoreAlertService } from '../../../../core/services/core.alert.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from 'express';
import Swal from 'sweetalert2';
import { title } from 'process';


@Component({
  selector: 'app-quick-acess',
  imports: [FormsModule, CommonModule],
  templateUrl: './quick-acess.component.html',
  styleUrl: './quick-acess.component.css'
})
export class QuickAcessComponent{
      constructor(private alertService:CoreAlertService) { }


  loginAlert() {
    const title:string ="Inicia Sesión"
    const message: string = "Debes iniciar sesión para acceder a este recurso."
    const route: string = "/escalafon/form"
    this.alertService.requestLogin(title,message,route)
  }
 
 
}
