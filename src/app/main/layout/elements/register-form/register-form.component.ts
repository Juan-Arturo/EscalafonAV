import { Component, OnInit } from '@angular/core';
import { TabService } from '../../../../core/services/tab.service';
import {  FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent implements OnInit {
    dataForm!: FormGroup;

  constructor(public tabService: TabService,private fb: FormBuilder,) {}
 


//   ngOnInit(): void {
//   this.tabService.setActiveTab('datos-personales');
//   this.dataForm = this.fb.group({
//     nombre: ['', [Validators.required]],
//     apellido: ['', [Validators.required]],
//     correo: ['', [Validators.required, Validators.email]],
//   });
// }


  ngOnInit(): void {
    this.tabService.setActiveTab('datos-personales');
  }

  setActive(tabId: string): void {
    this.tabService.setActiveTab(tabId);
  }

  isActive(tabId: string): boolean {
    return this.tabService.isActive(tabId);
  }


  onSubmit(){
    console.log("guardado...w")
  }
}
