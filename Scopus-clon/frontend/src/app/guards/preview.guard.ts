// src/app/guards/preview.guard.ts
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const previewGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('👀 Preview Guard - Checking if user should see preview...');
  
  if (!authService.checkAuth()) {
    console.log('✅ Preview Guard - User not authenticated, showing preview');
    return true;
  } else {
    console.log('❌ Preview Guard - User is authenticated, redirecting to home');
    return router.createUrlTree(['/']);
  }
};