import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { CommonModule } from '@angular/common';

import { injectSelector } from '@reduxjs/angular-redux';
import { InputNumber } from 'primeng/inputnumber';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { RootState } from '../../../../store';
import { DocumentosService } from '../../services/documentos.service';
import { ModalData } from '../../interfaces/interfaces';
import { ToggleSwitch } from 'primeng/toggleswitch';
@Component({
  selector: 'form-component',
  templateUrl: './form.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputTextModule,
    FloatLabelModule,
    ToggleSwitch,
    SelectModule,
    InputNumber,
  ],
})
export class FormComponent implements OnInit {
  @Input() data?: ModalData; // Modo del formulario
  @Input() close!: () => void;
  form: FormGroup;
  id: number | null = null; // ID del registro (para editar/ver)
  private userSelector = injectSelector<RootState, any>(
    (state) => state.auth.user
  );
  get user() {
    return this.userSelector(); // Se actualiza automáticamente
  }
  public departments: any[] = [];
  public selectedCDepartment: any;
  public filteredDepartments!: any[];

  estadoOptions = [
    { label: 'Años', value: 'años' },
    { label: 'Meses', value: 'meses' },
    { label: 'Días', value: 'dias' },
    { label: 'sin vigencia', value: 'sin vigencia' },
  ];

  tipoOptions = [
    { label: 'Pdf', value: 'pdf' },
    { label: 'Imagen', value: 'image' },
  ];

  constructor(
    private fb: FormBuilder,
    private documentsService: DocumentosService
  ) {
    this.form = this.fb.group({
      nombre_documento: ['', Validators.required],
      estado_publica: ['', Validators.required],
      unidad_periodo: ['', Validators.required],
      tamanio: ['', Validators.required],
      tipo_documento: ['', Validators.required],
      vigencia: ['', Validators.required],
    });
  }

  ngOnInit() {
    if (this.data?.mode === 'edit' || this.data?.mode === 'view') {
      this.loadData(this.data.id_documento);
    }

    if (this.data?.mode === 'view') {
      this.form.disable();
    }
  }

  loadData(id_documento?: number) {
    if (id_documento) {
      this.documentsService.get(id_documento).subscribe((record) => {
        this.form.patchValue({
          ...record.document,
          ct_usuario_at: this.user.id_usuario,
        });
      });
    }
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.data?.mode === 'add') {
        this.documentsService.add(this.form.value).subscribe();
        this.data?.loadData?.();
      } else if (this.data?.mode === 'edit' && this.data.id_documento) {
        this.documentsService
          .edit(this.data.id_documento, this.form.value)
          .subscribe();
        this.data?.loadData?.();
      }
    }
  }
}
