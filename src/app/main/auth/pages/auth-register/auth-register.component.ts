import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthLoginService } from '../../services/auth.login.service';
import { CoreAlertService } from '../../../../core/services/core.alert.service';
import { cleanObject } from '../../../../core/helpers/clenedObjects.helpers';

@Component({
  selector: 'auth-register-component',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './auth-register.component.html',
  styleUrls: ['./auth-register.component.css'],
})
export class AuthRegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthLoginService,
    private alertService: CoreAlertService,
    private router: Router
  ) {
    this.registerForm = this.fb.group(
      {
        nombre_usuario: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],

        telefono: [
          '',
          [Validators.required, Validators.pattern('^[0-9]{10}$')],
        ], // Asegura que el teléfono tenga 10 dígitos
        curp: [
          '',
          [
            Validators.required,
            Validators.pattern('^[A-Z]{4}[0-9]{6}[A-Z]{6}[0-9]{2}$'),
          ],
        ], // Validación básica para CURP
        contrasena: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.mustMatch('contrasena', 'confirmPassword') }
    );
  }

  ngOnInit(): void {}

  // Validación para que las contraseñas coincidan
  mustMatch(controlName: string, matchingControlName: string): any {
    return (formGroup: FormGroup) => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (matchingControl?.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control?.value !== matchingControl?.value) {
        matchingControl?.setErrors({ mustMatch: true });
      } else {
        matchingControl?.setErrors(null);
      }
    };
  }

  validateField(field: string, value: string): void {
    this.authService.validateField(field, value).subscribe((response) => {
      console.log(response);
      if (response.msg === 'Campo en uso') {
        this.registerForm.get(field)?.setErrors({ fieldTaken: true });
      } else {
        this.registerForm.get(field)?.setErrors(null); // Limpia los errores si el campo está disponible
      }
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const cleanedForm = cleanObject(this.registerForm.value, [
        'confirmPassword',
      ]);
      this.authService.register(cleanedForm).subscribe((success) => {
        if (success) {
          this.router.navigate(['/auth/login']);
        } else {
          this.alertService.warning('Error al registrarse');
        }
      });
    } else {
      this.alertService.warning('Revise los datos del formulario');
    }
  }
}
