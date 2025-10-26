import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, RegisterRequest } from '../../services/auth.service';

@Component({
  selector: 'app-register-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-details.component.html',
  styleUrls: ['./register-details.component.scss']
})
export class RegisterDetailsComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  userEmail: string = '';
  showPassword = false;
  showConfirmPassword = false;

  institutions = [
    { id: 1, name: 'Universidad Pedagógica y Tecnológica de Colombia', location: 'Colombia' },
    { id: 2, name: 'Universidad Nacional de Colombia', location: 'Colombia' },
    { id: 3, name: 'Universidad de los Andes', location: 'Colombia' },
    { id: 4, name: 'Other', location: '' }
  ];

  constructor() {
    const navigation = this.router.getCurrentNavigation();
    this.userEmail = navigation?.extras?.state?.['email'] || '';

    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: [this.userEmail, [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      institutionId: ['', [Validators.required]],
      agreeToTerms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const formValue = this.registerForm.value;
      const registerData: RegisterRequest = {
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        email: formValue.email,
        password: formValue.password,
        institutionId: formValue.institutionId === 4 ? undefined : formValue.institutionId
      };

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.error || 'Error during registration. Please try again.';
        }
      });
    }
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  get firstName() { return this.registerForm.get('firstName'); }
  get lastName() { return this.registerForm.get('lastName'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get institutionId() { return this.registerForm.get('institutionId'); }
  get agreeToTerms() { return this.registerForm.get('agreeToTerms'); }
}