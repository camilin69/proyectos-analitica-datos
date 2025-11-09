// search-documents.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-search-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-documents.component.html',
  styleUrls: ['./search-documents.component.scss']
})
export class SearchDocumentsComponent implements OnInit {
  private sanitizer = inject(DomSanitizer);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  addIconUrl: SafeResourceUrl;
  dateIconUrl: SafeResourceUrl;
  searchIconUrl: SafeResourceUrl;
  greaterThanIconUrl: SafeResourceUrl;
  bellIconUrl: SafeResourceUrl;

  searchTerm: string = '';
  searchWithin: string = 'title and abstract and keywords';
  maxDistance: number = 1;
  
  searchWithinOptions = [
    { value: 'all-fields', label: 'All fields' },
    { value: 'title and abstract and keywords', label: 'Article title, Abstract, Keywords' },
    { value: 'article_title', label: 'Article title' },
    { value: 'abstract', label: 'Abstract' },
    { value: 'keywords', label: 'Keywords' },
    { value: 'authors', label: 'Authors' },
    { value: 'institution', label: 'Institution' },
    { value: 'funding', label: 'Funding' },
    { value: 'language', label: 'Language' },
    { value: 'issn', label: 'ISSN' },
    { value: 'coden', label: 'CODEN' },
    { value: 'doi', label: 'DOI' },
    { value: 'references', label: 'References' },
    { value: 'coderence', label: 'Coderence' },
    { value: 'chemical_name', label: 'Chemical name' },
    { value: 'cas_number', label: 'CAS number' },
    { value: 'orcid', label: 'ORCID' },
    { value: 'publication_date', label: 'Publication date' },
    { value: 'document_type', label: 'Document type' },
    { value: 'content', label: 'Content' },
    { value: 'subject_areas', label: 'Subject areas' },
    { value: 'source_title', label: 'Source title' },
    { value: 'publisher', label: 'Publisher' }
  ];

  constructor() {
    this.addIconUrl = this.sanitizer.bypassSecurityTrustResourceUrl("/assets/add-icon.svg");
    this.dateIconUrl = this.sanitizer.bypassSecurityTrustResourceUrl("/assets/date-icon.svg");
    this.searchIconUrl = this.sanitizer.bypassSecurityTrustResourceUrl("/assets/search-icon.svg");
    this.greaterThanIconUrl = this.sanitizer.bypassSecurityTrustResourceUrl("/assets/greater-than-icon.svg");
    this.bellIconUrl = this.sanitizer.bypassSecurityTrustResourceUrl("/assets/bell-icon.svg");
  }

  ngOnInit() {
    // Cargar parámetros de la URL al inicializar
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchTerm = params['q'];
      }
      if (params['searchWithin']) {
        this.searchWithin = params['searchWithin'];
      }
      if (params['max_distance']) {
        this.maxDistance = parseFloat(params['max_distance']);
      }
    });
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/results-documents'], { 
        queryParams: { 
          q: this.searchTerm,
          searchWithin: this.searchWithin,
          max_distance: this.maxDistance,
        } 
      });
    }
  }

  onMaxDistanceInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;
        
    // Reemplazar coma por punto
    value = value.replace(',', '.');
    
    // Validar y truncar decimales
    if (value.includes('.')) {
      const parts = value.split('.');
      const integerPart = parts[0];
      const decimalPart = parts[1];
      
      // Si hay más de 4 decimales, cortar el valor
      if (decimalPart && decimalPart.length > 4) {
        const truncatedValue = integerPart + '.' + decimalPart.substring(0, 4);
        input.value = truncatedValue;
        
        // Aplicar validación de rango también aquí
        const numericValue = parseFloat(truncatedValue);
        if (!isNaN(numericValue)) {
          this.maxDistance = this.applyRangeValidation(numericValue);
        }
        return;
      }
    }
    
    // Aplicar validación de rango para todos los valores
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      this.maxDistance = this.applyRangeValidation(numericValue);
      
      // Si el valor está fuera de rango, actualizar el input visualmente
      const clampedValue = this.applyRangeValidation(numericValue);
      if (clampedValue !== numericValue) {
        input.value = clampedValue.toString();
      }
    }
  }

  onMaxDistanceChange(value: any): void {
    console.log("Change event - value:", value);
    
    // Solo validaciones básicas aquí
    if (value === null || value === undefined || value === '' || value === '-' || value === '.') {
      this.maxDistance = 1.0;
      return;
    }
    
    const numericValue = parseFloat(value.toString().replace(',', '.'));
    
    if (isNaN(numericValue)) {
      this.maxDistance = this.maxDistance || 1.0;
      return;
    }
    
    // Aplicar validación de rango
    this.maxDistance = this.applyRangeValidation(numericValue);
  }

  private applyRangeValidation(value: number): number {
    let finalValue = value;
    
    // Aplicar límites 0-2
    if (finalValue < 0) {
      finalValue = 0;
    } else if (finalValue > 2) {
      finalValue = 2;
    }
    
    // Aplicar límite de 4 decimales
    return Number(finalValue.toFixed(4));
  }

  addSearchField() {
    console.log('Add search field');
  }

  addDateRange() {
    console.log('Add date range');
  }
}