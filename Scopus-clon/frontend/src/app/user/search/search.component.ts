import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchDocumentsComponent } from '../search-components/search-documents/search-documents.component';

@Component({
  selector: 'app-search-section',
  standalone: true,
  imports: [CommonModule, FormsModule,SearchDocumentsComponent],
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