import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchDocumentsComponent } from '../search-components/search-documents/search-documents.component';
import { SearchAuthorsComponent } from '../search-components/search-authors/search-authors.component';
import { SearchOrganizationsComponent } from '../search-components/search-organizations/search-organizations.component';
import { SearchResearcherDiscoveryComponent } from '../search-components/search-researcher-discovery/search-researcher-discovery.component';

@Component({
  selector: 'app-search-section',
  standalone: true,
  imports: [CommonModule, FormsModule,SearchDocumentsComponent,
    SearchAuthorsComponent,
    SearchOrganizationsComponent,
    SearchResearcherDiscoveryComponent],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  searchType: string = 'documents';
  searchTypes = [
    { value: 'documents', label: 'Documents' },
    { value: 'authors', label: 'Authors' },
    { value: 'researcher-discovery', label: 'Researcher Discovery' },
    { value: 'organizations', label: 'Organizations' }
  ];
}