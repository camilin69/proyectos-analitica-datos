// src/app/user/user.routes.ts
import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./homepage/homepage.component').then(c => c.Homepage),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./search/search.component').then(c => c.SearchComponent)
      },
      {
        path: 'search',
        loadComponent: () => import('./search/search.component').then(c => c.SearchComponent)
      },
      {
        path: 'results-authors',
        loadComponent: () => import('./results-components/results-authors/results-authors.component').then(c => c.ResultsAuthorsComponent)
      },
      {
        path: 'results-documents',
        loadComponent: () => import('./results-components/results-documents/results-documents.component').then(c => c.ResultsDocumentsComponent)
      },
      {
        path: 'document/:id',
        loadComponent: () => import('./document/document.component').then(c => c.DocumentComponent)
      },
      {
        path: 'results-organizations',
        loadComponent: () => import('./results-components/results-organizations/results-organizations.component').then(c => c.ResultsOrganizationsComponent)
      },
      {
        path: 'results-researcher-discovery',
        loadComponent: () => import('./results-components/results-researcher-discovery/results-researcher-discovery.component').then(c => c.ResultsResearcherDiscoveryComponent)
      }
    ]
  }
];