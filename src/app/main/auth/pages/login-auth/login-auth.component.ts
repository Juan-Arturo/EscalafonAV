import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthLoginService } from '../../services/auth.login.service';

@Component({
  selector: 'app-login-auth',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-auth.component.html',
  styleUrl: './login-auth.component.css'
})
export class LoginAuthComponent {
loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthLoginService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { userName, password } = this.loginForm.value;

      this.authService.login(userName, password).subscribe((success) => {
        if (success) {
          this.router.navigate(['/escalafon/form']);
        }
      });
    }
  }
}
