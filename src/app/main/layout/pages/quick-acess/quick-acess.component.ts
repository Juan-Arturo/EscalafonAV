import { Component } from '@angular/core';
import { CoreAlertService } from '../../../../core/services/core.alert.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from 'express';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-quick-acess',
  imports: [FormsModule, CommonModule],
  templateUrl: './quick-acess.component.html',
  styleUrl: './quick-acess.component.css'
})
export class QuickAcessComponent{
      constructor(private alertService:CoreAlertService) { }


  loginAlert() {
    this.alertService.requestLogin()
  }
 
 
}
