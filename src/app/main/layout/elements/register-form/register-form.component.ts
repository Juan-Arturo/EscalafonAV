import { Component, OnInit } from '@angular/core';
import { TabService } from '../../../../core/services/tab.service';
import {  FormBuilder, FormGroup, Validators} from '@angular/forms';
import { UploadFilesComponent } from '../upload-files/upload-files.component';

import { PreofileService } from '../../services/profile.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  imports: [UploadFilesComponent],
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent implements OnInit {
    dataForm!: FormGroup;
    
  constructor(public tabService: TabService,private fb: FormBuilder, private profileService: PreofileService)  {}
 


//   ngOnInit(): void {
//   this.tabService.setActiveTab('datos-personales');
//   this.dataForm = this.fb.group({
//     nombre: ['', [Validators.required]],
//     apellido: ['', [Validators.required]],
//     correo: ['', [Validators.required, Validators.email]],
//   });
// }

curp: string = '';


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


  getInfoCurp(curp: string){
    this.profileService.getInfo(curp).subscribe((res) => {
      console.log(res);
    });
  }
}
