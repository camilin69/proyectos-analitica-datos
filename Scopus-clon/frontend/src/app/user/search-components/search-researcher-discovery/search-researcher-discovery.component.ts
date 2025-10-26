import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-researcher-discovery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-researcher-discovery.component.html',
  styleUrls: ['./search-researcher-discovery.component.scss'] 
})
export class SearchResearcherDiscoveryComponent {
  searchWithin: string = '';
  searchTerm: string = '';

  searchWithinOptions = [
    { label: 'Research interests', value: 'research-interests' },
    { label: 'Expertise areas', value: 'expertise-areas' },
    { label: 'Publications', value: 'publications' },
    { label: 'Keywords', value: 'keywords' }
  ];

  addIconUrl = 'assets/add-icon.svg';
  expertiseIconUrl = 'assets/expertise-icon.svg';
  greaterThanIconUrl = 'assets/greater-than-icon.svg';
  searchIconUrl = 'assets/search-icon.svg';

  onSearch() {
    console.log('Searching researchers:', this.searchTerm, this.searchWithin);
  }

  onReset() {
    this.searchTerm = '';
    this.searchWithin = '';
  }

  addResearchField() {
    console.log('Add research field clicked');
  }

  addExpertise() {
    console.log('Add expertise clicked');
  }
}