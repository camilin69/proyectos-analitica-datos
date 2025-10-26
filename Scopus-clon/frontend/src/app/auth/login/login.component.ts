import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    if (this.authService.checkAuth()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      // Simulación - en una implementación real, esto verificaría el email
      // y luego redirigiría al formulario de contraseña o registro
      const email = this.loginForm.get('email')?.value;
      
      // Por ahora, simulamos que el usuario existe y vamos a password
      setTimeout(() => {
        this.isLoading = false;
        this.router.navigate(['/auth/password'], { 
          state: { email: email } 
        });
      }, 1000);
    } else {
      this.markFormGroupTouched();
    }
  }

  navigateToOrganizationLogin(): void {
    console.log('Navigate to organization login');
  }

  navigateToHelp(): void {
    console.log('Navigate to help');
  }

  tryAnotherAccount(): void {
    this.loginForm.reset();
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.loginForm.get(key)?.markAsTouched();
    });
  }

  get email() { return this.loginForm.get('email'); }
}