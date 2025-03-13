import { Component, OnInit } from '@angular/core';
import { TabService } from '../../../../core/services/tab.service';
import {FormBuilder, FormGroup, FormsModule, Validators,} from '@angular/forms';
import { UploadFilesComponent } from '../upload-files/upload-files.component';
import { PreofileService } from '../../services/profile.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, UploadFilesComponent],
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent implements OnInit {
  // dataForm!: FormGroup;
  curp: string = '';
  userData: any = {
    curp: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    rfc: '',
    fechaNacimiento: '',
    lugarNacimiento: '',
    nacionalidad: '',
    estadoCivil: '',
  };

  constructor(public tabService: TabService, private fb: FormBuilder, private profileService: PreofileService) {}

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

  getInfoCurp(): void {
    if (this.curp) {
      this.profileService.getInfo(this.curp).subscribe({
        next: (response) => {
          console.log(response);
          // Actualizar los campos del formulario con la respuesta
          this.userData = {
            curp: response.curp || '',

            // Datos personales
            nombre: response.informacion_rupeet.datos_personales.nombre || '',
            apellidoPaterno: response.informacion_rupeet.datos_personales.apellido_paterno || '',
            apellidoMaterno: response.informacion_rupeet.datos_personales.apellido_materno || '',
            rfc: response.informacion_rupeet.datos_personales.rfc || '',
            fechaNacimiento: response.fechaNacimiento || '',
            lugarNacimiento: response.lugarNacimiento || '',
            nacionalidad: response.nacionalidad || '',
            estadoCivil: response.informacion_rupeet.datos_personales.estado_civil || '',

            // Datos domiciliarios
            calle: response.informacion_rupeet.domicilios[0].calle || '',
            noExterior: response.informacion_rupeet.domicilios[0].numero_externo || '',
            codigoPostal: response.informacion_rupeet.domicilios[0].codigo_postal || '',
            colonia: response.informacion_rupeet.domicilios[0].colonia || '',

          };
        },
        error: (error) => {
          console.error('Error al obtener información:', error);
        },
      });
    }
  }

  onSubmit(): void {
    console.log('guardado...', this.userData);
  }
}