import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { DocumentService, Document, DocumentSearchResponse } from '../../../services/document.service';
import { SearchDocumentsComponent } from '../../search-components/search-documents/search-documents.component';

interface ResultsDocument extends Document {
  selected: boolean;
  documentTitle: string;
  authorKeywords: string[];
  subjectAreas: string[];
  index?: number; 
}

@Component({
  selector: 'app-results-documents',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchDocumentsComponent],
  templateUrl: './results-documents.component.html',
  styleUrls: ['./results-documents.component.scss']
})
export class ResultsDocumentsComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  maxDistance: number = 0.3;
  documents: ResultsDocument[] = [];
  filteredDocuments: ResultsDocument[] = [];
  selectedDocuments: Set<number> = new Set();
  showAbstractId: number | null = null;
  sortBy: string = 'relevance';
  Math = Math;
  // Estado de carga y errores
  isLoading: boolean = false;
  error: string = '';
  totalResults: number = 0;
  
  // Paginación
  currentPage: number = 1;
  pageSize: number = 10;
  totalPages: number = 0;
  pages: number[] = [];
  
  // Filters
  yearFilter: string = '';
  authorFilter: string = '';
  subjectAreaFilter: string = '';
  documentTypeFilter: string = '';
  
  // Subject para manejar subscriptions
  private destroy$ = new Subject<void>();
  
  // Lista de áreas temáticas disponibles
  subjectAreas: string[] = [];
  documentTypes: string[] = [];

  // Métodos para emitir cambios de filtros
  private onYearFilterChange: (value: string) => void = () => {};
  private onAuthorFilterChange: (value: string) => void = () => {};
  private onSubjectFilterChange: (value: string) => void = () => {};
  private onTypeFilterChange: (value: string) => void = () => {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.searchQuery = params['q'] || '';
        this.maxDistance = params['max_distance'] ? parseFloat(params['max_distance']) : 0.3;
        
        console.log('Search query received:', this.searchQuery);
        console.log('Max distance received:', this.maxDistance);
        
        if (this.searchQuery) {
          // Reiniciar paginación cuando cambia la búsqueda
          this.currentPage = 1;
          this.documents = [];
          this.filteredDocuments = [];
          this.performSearch();
        }
      });
    this.setupFilterDebouncing();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    
    this.currentPage = page;
    this.scrollToTop(); // ← Agregar esta línea
    this.performSearch();
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  private scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }


  generatePageNumbers(): void {
    const maxPagesToShow = 10;
    const half = Math.floor(maxPagesToShow / 2);
    let start = Math.max(1, this.currentPage - half);
    let end = Math.min(this.totalPages, start + maxPagesToShow - 1);
    
    // Ajustar si estamos cerca del final
    if (end - start + 1 < maxPagesToShow) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }
    
    this.pages = [];
    for (let i = start; i <= end; i++) {
      this.pages.push(i);
    }
  }

  performSearch() {
    if (!this.searchQuery.trim()) {
      this.error = 'Please enter a search query';
      return;
    }

    this.isLoading = true;
    this.error = '';
    console.log('Performing search for:', this.searchQuery, 'with max Distance:', this.maxDistance);

    // Guardar parámetros de búsqueda
    this.documentService.setLastSearchParams(this.searchQuery, this.maxDistance);

    // Calcular offset para la paginación
    const offset = (this.currentPage - 1) * this.pageSize;

    this.documentService.searchDocuments(
      this.searchQuery, 
      'semantic', 
      this.pageSize, 
      offset, 
      this.maxDistance
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: DocumentSearchResponse) => {
          console.log('Search response received:', response);
          
          // Guardar documentos en caché
          this.documentService.setCachedDocuments(response.results);
          
          // Procesar documentos con índices
          this.documents = response.results.map((doc, index) => ({
            ...this.mapToResultsDocument(doc),
            index: offset + index + 1 // ← Agregar índice calculado
          }));
          
          this.filteredDocuments = [...this.documents];
          this.totalResults = response.total_results;
          
          // Configurar paginación
          this.totalPages = Math.ceil(response.total_results / this.pageSize);
          this.generatePageNumbers();
          
          console.log(`📊 Búsqueda completada: ${this.documents.length} documentos cargados, ${this.totalResults} totales, Páginas: ${this.totalPages}`);
          
          this.updateAvailableFilters();
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading documents:', error);
          this.error = 'Failed to load search results. Please try again.';
          this.isLoading = false;
        }
      });
      this.scrollToTop();
  }

  private mapToResultsDocument(doc: Document): ResultsDocument {
    return {
      ...doc,
      selected: false,
      documentTitle: doc.article_title,
      authorKeywords: doc.keywords || [],
      subjectAreas: doc.subject_areas || [],
      source_title: doc.source_title || 'Unknown Source',
      citations: doc.citations || 0,
      document_type: doc.document_type || 'Unknown Type',
      year: doc.year || new Date().getFullYear(),
      distance: doc.distance || 2.0
    };
  }

  private updateAvailableFilters() {
    // Actualizar áreas temáticas disponibles
    const allSubjectAreas = new Set<string>();
    const allDocumentTypes = new Set<string>();
    
    this.documents.forEach(doc => {
      doc.subjectAreas?.forEach(area => allSubjectAreas.add(area));
      if (doc.document_type) {
        allDocumentTypes.add(doc.document_type);
      }
    });
    
    this.subjectAreas = Array.from(allSubjectAreas).sort();
    this.documentTypes = Array.from(allDocumentTypes).sort();
    
    console.log('Available filters updated:', {
      subjectAreas: this.subjectAreas,
      documentTypes: this.documentTypes
    });
  }

  applyFilters() {
    console.log('Applying filters:', {
      year: this.yearFilter,
      author: this.authorFilter,
      subject: this.subjectAreaFilter,
      type: this.documentTypeFilter
    });

    this.filteredDocuments = this.documents.filter(doc => {
      // Filtro por año
      const yearMatch = !this.yearFilter || 
        (doc.year && doc.year.toString().includes(this.yearFilter));
      
      // Filtro por autor
      const authorMatch = !this.authorFilter || 
        doc.authors.some(author => 
          author.toLowerCase().includes(this.authorFilter.toLowerCase())
        );
      
      // Filtro por área temática
      const subjectMatch = !this.subjectAreaFilter ||
        doc.subjectAreas.some(area => 
          area.toLowerCase().includes(this.subjectAreaFilter.toLowerCase())
        );
      
      // Filtro por tipo de documento
      const typeMatch = !this.documentTypeFilter ||
        doc.document_type.toLowerCase().includes(this.documentTypeFilter.toLowerCase());
      
      return yearMatch && authorMatch && subjectMatch && typeMatch;
    });

    console.log('Filtered documents:', this.filteredDocuments.length);
    this.applySorting();
  }

  applySorting() {
    console.log('Applying sorting:', this.sortBy);
    
    switch (this.sortBy) {
      case 'date-newest':
        this.filteredDocuments.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case 'date-oldest':
        this.filteredDocuments.sort((a, b) => (a.year || 0) - (b.year || 0));
        break;
      case 'citations':
        this.filteredDocuments.sort((a, b) => (b.citations || 0) - (a.citations || 0));
        break;
      case 'relevance':
      default:
        // Mantener el orden original (relevancia de la búsqueda semántica)
        break;
    }
  }

  navigateToDocument(documentId: number): void {
    console.log('Navigating to document:', documentId);
    
    // Guardar documentos en caché antes de navegar
    this.documentService.setCachedDocuments(this.documents);
    
    // Navegar al componente DocumentComponent con los parámetros de búsqueda
    this.router.navigate(['/document', documentId], {
      queryParams: {
        q: this.searchQuery,
        max_distance: this.maxDistance
      }
    });
    this.scrollToTop();
  }

  onSortChange() {
    console.log('Sort changed to:', this.sortBy);
    this.applySorting();
  }

  onYearFilterInput(event: any) {
    this.yearFilter = event.target.value;
    this.onYearFilterChange(this.yearFilter);
  }

  onAuthorFilterInput(event: any) {
    this.authorFilter = event.target.value;
    this.onAuthorFilterChange(this.authorFilter);
  }

  onSubjectAreaCheckboxChange(event: any) {
    this.subjectAreaFilter = event.target.checked ? event.target.id.replace('area-', '') : '';
    this.onSubjectFilterChange(this.subjectAreaFilter);
  }

  onDocumentTypeChange(event: any) {
    this.documentTypeFilter = event.target.value;
    this.onTypeFilterChange(this.documentTypeFilter);
  }

  toggleSelectAll(event: any) {
    const checked = event.target.checked;
    this.filteredDocuments.forEach(doc => {
      doc.selected = checked;
      if (checked) {
        this.selectedDocuments.add(doc.id);
      } else {
        this.selectedDocuments.delete(doc.id);
      }
    });
  }

  toggleSelectDocument(doc: ResultsDocument) {
    doc.selected = !doc.selected;
    if (doc.selected) {
      this.selectedDocuments.add(doc.id);
    } else {
      this.selectedDocuments.delete(doc.id);
    }
  }

  toggleAbstract(docId: number) {
    this.showAbstractId = this.showAbstractId === docId ? null : docId;
  }

  saveSearch() {
    const searchData = {
      query: this.searchQuery,
      filters: {
        year: this.yearFilter,
        author: this.authorFilter,
        subjectArea: this.subjectAreaFilter,
        documentType: this.documentTypeFilter
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('Saving search:', searchData);
  }

  setSearchAlert() {
    console.log('Set search alert for:', this.searchQuery);
  }

  exportDocuments() {
    const selectedIds = Array.from(this.selectedDocuments);
    if (selectedIds.length === 0) {
      alert('Please select documents to export');
      return;
    }

    console.log('Exporting documents:', selectedIds);
    // Implementar lógica de exportación
  }

  downloadDocuments() {
    const selectedIds = Array.from(this.selectedDocuments);
    if (selectedIds.length === 0) {
      alert('Please select documents to download');
      return;
    }

    console.log('Downloading documents:', selectedIds);
  }

  showCitationOverview() {
    const selectedIds = Array.from(this.selectedDocuments);
    if (selectedIds.length === 0) {
      alert('Please select documents to view citation overview');
      return;
    }

    console.log('Citation overview for:', selectedIds);
  }

  onDistanceChange(newDistance: number) {
    this.maxDistance = newDistance;
    if (this.searchQuery) {
      this.performSearch();
    }
  }

  clearFilters() {
    this.yearFilter = '';
    this.authorFilter = '';
    this.subjectAreaFilter = '';
    this.documentTypeFilter = '';
    this.applyFilters();
  }

  private setupFilterDebouncing() {
    // Crear subjects para cada filtro
    const yearFilter$ = new Subject<string>();
    const authorFilter$ = new Subject<string>();
    const subjectFilter$ = new Subject<string>();
    const typeFilter$ = new Subject<string>();

    // Aplicar debounce a cada filtro
    yearFilter$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.applyFilters());

    authorFilter$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.applyFilters());

    subjectFilter$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.applyFilters());

    typeFilter$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.applyFilters());

    // Asignar los métodos para emitir cambios
    this.onYearFilterChange = (value: string) => yearFilter$.next(value);
    this.onAuthorFilterChange = (value: string) => authorFilter$.next(value);
    this.onSubjectFilterChange = (value: string) => subjectFilter$.next(value);
    this.onTypeFilterChange = (value: string) => typeFilter$.next(value);
  }

}