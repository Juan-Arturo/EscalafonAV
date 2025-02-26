import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PreofileService } from './services/profile.service';
import { injectSelector } from '@reduxjs/angular-redux';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { UploadFilesComponent } from '../upload-files/upload-files.component';
import { TabsModule } from 'primeng/tabs';
import { RootState } from '../../../store';
import { CoreLoadingService } from '../../../core/services/core.loading.service';
import { CoreAlertService } from '../../../core/services/core.alert.service';
import { ValidatorsPatterns } from '../../../core/helpers/validators';

@Component({
  selector: 'profile-component',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [
    CommonModule,
    InputTextModule,
    FloatLabelModule,
    ReactiveFormsModule,
    NgbAccordionModule,
    UploadFilesComponent,
    TabsModule,
  ],
})
export class ProfileComponent implements OnInit {
  tab: String = '0';
  tabs: { title: string; value: string }[] = [];
  profileForm: FormGroup;
  profileImage: string | ArrayBuffer | null = null; // Variable para la imagen
  selectedFile: File | null = null; // Para almacenar el archivo de imagen seleccionado
  dataUser: any = {}; // Contendrá la información del usuario
  private userSelector = injectSelector<RootState, any>(
    (state) => state.auth.user
  );

  changeTab(tab: string): void {
    this.tab = tab;
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result;
      };
      this.uploadImage();
      reader.readAsDataURL(file);
    }
  }
  uploadImage(): void {
    if (
      this.selectedFile &&
      this.dataUser.informacion_rupeet?.datos_personales?.id_informacion_rupeet
    ) {
      const ct_documento_id = 15; // Valor fijo o dinámico
      const id_informacion_rupeet =
        this.dataUser.informacion_rupeet.datos_personales.id_informacion_rupeet;

      // Llama al servicio para subir la imagen
      this.profileService
        .uploadImage(this.selectedFile, ct_documento_id, id_informacion_rupeet)
        .subscribe();
    } else {
      console.error(
        'No se ha seleccionado un archivo o falta información del usuario.'
      );
    }
  }
  // Aquí se obtiene el usuario con un getter
  get user() {
    return this.userSelector(); // Se actualiza automáticamente
  }

  constructor(
    private profileService: PreofileService,
    private fb: FormBuilder,
    private loading: CoreLoadingService,
    private alert: CoreAlertService
  ) {
    this.profileForm = this.fb.group({
      id_usuario: [],
      id_informacion_rupeet: [],
      nombre_usuario: [
        '',
        [Validators.required, Validators.pattern(ValidatorsPatterns.nombre)],
      ],
      apellido_materno: [
        '',
        [Validators.required, Validators.pattern(ValidatorsPatterns.nombre)],
      ],
      apellido_paterno: [
        '',
        [Validators.required, Validators.pattern(ValidatorsPatterns.nombre)],
      ],
      nombre: [
        '',
        [Validators.required, Validators.pattern(ValidatorsPatterns.nombre)],
      ],
      curp: [
        '',
        [Validators.required, Validators.pattern(ValidatorsPatterns.curp)],
      ],
      rfc: [
        '',
        [Validators.required, Validators.pattern(ValidatorsPatterns.rfc)],
      ],
      domicilios: this.fb.array([this.createDomicilio()]),

      telefono_personal: [
        '',
        [Validators.pattern(ValidatorsPatterns.telefono)],
      ],
      telefono_casa: ['', [Validators.pattern(ValidatorsPatterns.telefono)]],
      telefono_trabajo: ['', [Validators.pattern(ValidatorsPatterns.telefono)]],
      fechaNacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      email: ['', [Validators.email]],
      email_institucional: ['', [Validators.email]],
      email_respaldo: ['', [Validators.email]],
    });
  }

  createDomicilio(): FormGroup {
    return this.fb.group({
      calle: ['', Validators.required], // Requiere una calle
      codigo_postal: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{5}$/), // Asegura que el código postal sea un número de 5 dígitos
        ],
      ],
      colonia: ['', Validators.required], // Requiere una colonia
      id_domicilio: [''], // Requiere el ID del domicilio
      numero_externo: [
        '',
        [Validators.required, Validators.pattern(/^\d+$/)], // Solo números para el número externo
      ],
      numero_interno: [
        '',
        [Validators.pattern(/^\d+$/)], // Solo números para el número interno (puede ser opcional)
      ],
    });
  }

  get domicilios(): FormArray {
    return this.profileForm.get('domicilios') as FormArray;
  }

  addDomicilio(): void {
    this.domicilios.push(this.createDomicilio());
  }

  removeDomicilio(index: number): void {
    this.domicilios.removeAt(index);
  }

  // Método para cargar los datos del usuario cuando el componente se inicializa
  ngOnInit(): void {
    this.tabs = [
      { title: 'Datos personales', value: '0' },
      { title: 'Documentos', value: '1' },
    ];
    // Aquí estamos verificando si el usuario tiene curp al cargar el componente
    this.loadUserData();
    // Observa el campo de la CURP y actualiza la fecha y género
    this.profileForm.get('curp')?.valueChanges.subscribe((curp: string) => {
      if (curp && curp.length === 18) {
        const fechaNacimiento = getBirthDateFromCURP(curp);
        const genero = getGenderFromCURP(curp);

        // Actualiza los campos
        this.profileForm.patchValue({
          fechaNacimiento: fechaNacimiento,
          genero: genero,
        });

        // Opcional: Deshabilitar nuevamente si lo deseas
        ['fechaNacimiento', 'genero'].forEach((field) => {
          this.profileForm.get(field)?.disable();
        });
      }
    });
  }

  // Método para cargar los datos del usuario
  loadUserData() {
    this.loading.show();
    // Usamos un observador o verificación periódica para asegurarnos de que `user` y `curp` existan
    const user = this.user;
    // Verificamos si `user` ya tiene un `curp`
    if (user && user.curp) {
      // Si `curp` existe, hacemos la solicitud al servicio
      this.profileService.getInfo(user.curp).subscribe({
        next: (data: any) => {
          console.log(data);
          this.profileService
            .fetchFile(
              data.informacion_rupeet?.datos_personales.id_informacion_rupeet
            )
            .subscribe((imageBlob) => {
              const imageUrl = URL.createObjectURL(imageBlob); // Crea una URL temporal para la imagen
              this.profileImage = imageUrl; // Asignar a la variable de la imagen
            });

          this.profileForm.patchValue({
            id_usuario: data.id_usuario,
            id_informacion_rupeet:
              data.informacion_rupeet?.datos_personales.id_informacion_rupeet,
            nombre_usuario: data.nombre_usuario,
            nombre: data.informacion_rupeet?.datos_personales.nombre,
            apellido_materno:
              data.informacion_rupeet?.datos_personales.apellido_materno,
            apellido_paterno:
              data.informacion_rupeet?.datos_personales.apellido_paterno,
            curp: data.curp,
            rfc: data.informacion_rupeet?.datos_personales.rfc,
            fechaNacimiento: getBirthDateFromCURP(
              data.informacion_rupeet?.datos_personales.curp
            ),
            genero: getGenderFromCURP(
              data.informacion_rupeet?.datos_personales.curp
            ),
            email: data.email,
            email_institucional:
              data.informacion_rupeet?.datos_personales.email_institucional,
            email_respaldo:
              data.informacion_rupeet?.datos_personales.email_respaldo,
            telefono_personal: data.telefono,
            telefono_casa:
              data.informacion_rupeet?.datos_personales.telefono_casa,
            telefono_trabajo:
              data.informacion_rupeet?.datos_personales.telefono_trabajo,
          });
          // Limpiamos el array antes de agregar los nuevos domicilios
          this.domicilios.clear();

          // Si hay domicilios, agregamos cada uno al FormArray
          data.informacion_rupeet?.domicilios.forEach((domicilio: any) => {
            this.domicilios.push(
              this.fb.group({
                calle: domicilio.calle || '',
                codigo_postal: domicilio.codigo_postal || '',
                colonia: domicilio.colonia || '',

                id_domicilio: domicilio.id_domicilio || '',
                numero_externo: domicilio.numero_externo || '',
                numero_interno: domicilio.numero_interno || '',
              })
            );
          });

          ['fechaNacimiento', 'genero'].forEach((field) => {
            this.profileForm.get(field)?.disable();
          });
          this.dataUser = data;
        },
        error: (error: any) => {
          // Manejo del error en caso de que ocurra
          console.error('Error al obtener la información del usuario:', error);
        },
      });
      this.loading.hide();
    } else {
      // Si `curp` no está disponible, verificamos si el estado del usuario cambia
      // Esta es una técnica de comprobación repetida para ver si `user` llega después

      setTimeout(() => {
        this.loadUserData(); // Reintenta cargar los datos si no existe curp
      }, 1000); // Esperamos 1 segundo y lo intentamos nuevamente
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      // Imprimir los valores del formulario
      this.profileService.saveInfo(this.profileForm.value).subscribe();
      this.loadUserData();
    } else {
      this.alert.warning('Por favor, completa todos los campos requeridos.');
    }
  }
}
function getBirthDateFromCURP(curp: string) {
  throw new Error('Function not implemented.');
}

function getGenderFromCURP(curp: string) {
  throw new Error('Function not implemented.');
}

