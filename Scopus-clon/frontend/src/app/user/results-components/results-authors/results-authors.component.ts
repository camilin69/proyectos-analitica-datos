import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-results-authors',
  standalone: true,
  imports: [CommonModule],
  template: '<h2>Authors Results</h2><p>Authors search results will be displayed here</p>'
})
export class ResultsAuthorsComponent {}