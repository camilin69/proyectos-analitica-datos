// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🔐 Auth Guard - Checking authentication...');
  
  if (authService.checkAuth()) {
    console.log('✅ Auth Guard - User is authenticated, allowing access');
    return true;
  } else {
    console.log('❌ Auth Guard - User not authenticated, redirecting to preview');
    return router.createUrlTree(['/preview']);
  }
};