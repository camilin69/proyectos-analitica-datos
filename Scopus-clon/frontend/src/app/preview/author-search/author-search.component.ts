import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-author-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './author-search.component.html',
  styleUrls: ['./author-search.component.scss']
})
export class AuthorSearchComponent {
  // Aquí puedes agregar la lógica para el formulario si es necesario
}