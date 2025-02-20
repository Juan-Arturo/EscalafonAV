import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthLoginService } from '../../services/auth.login.service';
import { CoreAlertService } from '../../../../core/services/core.alert.service';
import { cleanObject } from '../../../../core/helpers/clenedObjects.helpers';

@Component({
  selector: 'restore-password-component',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './restore-password.component.html',
  styleUrl: './restore-password.component.css',
})
export class RestorePasswordComponent {
  restoreForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthLoginService,
    private alertService: CoreAlertService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.restoreForm = this.fb.group(
      {
        contrasena: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.mustMatch('contrasena', 'confirmPassword') }
    );
  }

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

  onSubmit(): void {
    const token: string = this.route.snapshot.paramMap.get('token') || '';
    if (this.restoreForm.valid) {
      this.authService
        .resetPassword(token, this.restoreForm.value.contrasena)
        .subscribe((success) => {
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
