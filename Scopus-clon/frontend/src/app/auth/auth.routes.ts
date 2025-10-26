import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  { 
    path: 'login', 
    loadComponent: () => import('./login/login.component').then(c => c.LoginComponent)
  },
  { 
    path: 'register', 
    loadComponent: () => import('./register/register.component').then(c => c.RegisterComponent)
  },
  { 
    path: 'password', 
    loadComponent: () => import('./password/password.component').then(c => c.PasswordComponent)
  },
  { 
    path: 'register-details', 
    loadComponent: () => import('./register-details/register-details.component').then(c => c.RegisterDetailsComponent)
  }
];