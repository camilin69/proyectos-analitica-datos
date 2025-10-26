// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { previewGuard } from './guards/preview.guard';
import { SourcesComponent } from './components/sources/sources.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'preview',
    loadChildren: () => import('./preview/preview.routes').then(m => m.PREVIEW_ROUTES),
    canActivate: [previewGuard]
  },
  {
    path: '',
    loadChildren: () => import('./user/user.routes').then(m => m.USER_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'sources',
    loadComponent: () => import('./components/sources/sources.component').then(c => c.SourcesComponent)
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];