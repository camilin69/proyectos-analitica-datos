import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results-organizations',
  standalone: true,
  imports: [CommonModule],
  template: '<h2>Organizations Results</h2><p>Organizations search results will be displayed here</p>'
})
export class ResultsOrganizationsComponent {}