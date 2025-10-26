import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-organizations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-organizations.component.html',
  styleUrls: ['./search-organizations.component.scss'] 
})
export class SearchOrganizationsComponent {
  searchWithin: string = '';
  searchTerm: string = '';

  searchWithinOptions = [
    { label: 'Organization name', value: 'organization-name' },
    { label: 'City', value: 'city' },
    { label: 'Country', value: 'country' },
    { label: 'Affiliation ID', value: 'affiliation-id' }
  ];

  addIconUrl = 'assets/add-icon.svg';
  locationIconUrl = 'assets/location-icon.svg';
  greaterThanIconUrl = 'assets/greater-than-icon.svg';
  searchIconUrl = 'assets/search-icon.svg';

  onSearch() {
    console.log('Searching organizations:', this.searchTerm, this.searchWithin);
  }

  onReset() {
    this.searchTerm = '';
    this.searchWithin = '';
  }

  addSearchField() {
    console.log('Add organization field clicked');
  }

  addLocation() {
    console.log('Add location clicked');
  }
}