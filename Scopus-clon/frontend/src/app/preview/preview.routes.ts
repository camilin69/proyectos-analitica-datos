import { Routes } from '@angular/router';
import { AuthorSearchComponent } from './author-search/author-search.component';

export const PREVIEW_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./homepage-preview/homepage-preview.component').then(c => c.HomepagePreview)
  },
  {
    path: 'author-search',
    component: AuthorSearchComponent
  }
];