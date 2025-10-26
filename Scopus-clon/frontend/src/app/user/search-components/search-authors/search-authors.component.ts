import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-authors',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-authors.component.html',
  styleUrls: ['./search-authors.component.scss']
})
export class SearchAuthorsComponent {
  searchWithin: string = '';
  searchTerm: string = '';

  searchWithinOptions = [
    { label: 'Author name', value: 'author-name' },
    { label: 'ORCID', value: 'orcid' },
    { label: 'Affiliation', value: 'affiliation' }
  ];

  addIconUrl = 'assets/add-icon.svg';
  affiliationIconUrl = 'assets/affiliation-icon.svg';
  greaterThanIconUrl = 'assets/greater-than-icon.svg';
  searchIconUrl = 'assets/search-icon.svg';

  onSearch() {
    console.log('Searching authors:', this.searchTerm, this.searchWithin);
  }

  onReset() {
    this.searchTerm = '';
    this.searchWithin = '';
  }

  addSearchField() {
    console.log('Add author field clicked');
  }

  addAffiliation() {
    console.log('Add affiliation clicked');
  }
}