// document.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/enviroment';

export interface Document {
  id: number;
  article_title: string;
  abstract?: string;
  authors: string[];
  source_title: string;
  year?: number;
  citations: number;
  document_type: string;
  keywords: string[];
  subject_areas: string[];
  distance?: number;
  
  // Campos adicionales para documentos completos
  institution?: any;
  funding?: any;
  language?: string;
  issn?: string;
  doi?: string;
  references?: any[];
  publication_date?: string;
  cites_count?: number;
  content?: any;
  publisher?: string;
  
  selected?: boolean;
  documentTitle?: string;
  authorKeywords?: string[];
  subjectAreas?: string[];
}

export interface DocumentSearchResponse {
  query: string;
  search_type: string;
  max_distance: number;
  total_results: number;
  offset: number;
  limit: number;
  results: Document[];
}

export interface DocumentDetails {
  id: number;
  article_title: string;
  abstract?: string;
  authors: string[];
  keywords: string[];
  institution?: {
    id: number;
    name: string;
    city: string;
    country: string;
  };
  funding?: {
    id: number;
    information: string;
    sponsor: string;
    acronym: string;
    number: string;
  };
  language?: string;
  issn?: string;
  doi?: string;
  references: Array<{
    id: number;
    reference_text: string;
  }>;
  publication_date?: string;
  cites_count: number;
  document_type: string;
  content?: {
    sections: Array<{
      title: string;
      text: string;
    }>;
  };
  subject_areas: string[];
  source_title: string;
  publisher?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = environment.documentsApiUrl;
  
  // Sistema de caché
  private cachedDocuments: Document[] = [];
  private cachedDocumentDetails: Map<number, DocumentDetails> = new Map();
  private lastSearchQuery: string = '';
  private lastMaxDistance: number = 0.1;

  // Claves para localStorage
  private readonly CACHED_DOCS_KEY = 'cached_documents';
  private readonly CACHED_DETAILS_KEY = 'cached_document_details';
  private readonly LAST_SEARCH_KEY = 'last_search_params';

  constructor(private http: HttpClient) {
    // Cargar datos del localStorage al inicializar
    this.loadFromLocalStorage();
  }

  // ========== MÉTODOS DE LOCALSTORAGE ==========

  private loadFromLocalStorage(): void {
    try {
      // Cargar documentos cacheados
      const cachedDocs = localStorage.getItem(this.CACHED_DOCS_KEY);
      if (cachedDocs) {
        this.cachedDocuments = JSON.parse(cachedDocs);
        console.log(`📁 Cargados ${this.cachedDocuments.length} documentos desde localStorage`);
      }

      // Cargar detalles de documentos
      const cachedDetails = localStorage.getItem(this.CACHED_DETAILS_KEY);
      if (cachedDetails) {
        const detailsArray = JSON.parse(cachedDetails);
        this.cachedDocumentDetails = new Map(detailsArray);
        console.log(`📁 Cargados ${this.cachedDocumentDetails.size} detalles de documentos desde localStorage`);
      }

      // Cargar última búsqueda
      const lastSearch = localStorage.getItem(this.LAST_SEARCH_KEY);
      if (lastSearch) {
        const searchParams = JSON.parse(lastSearch);
        this.lastSearchQuery = searchParams.query;
        this.lastMaxDistance = searchParams.maxDistance;
        console.log(`📁 Cargada última búsqueda: "${this.lastSearchQuery}" desde localStorage`);
      }
    } catch (error) {
      console.error('❌ Error cargando datos desde localStorage:', error);
      this.clearLocalStorage();
    }
  }

  private saveToLocalStorage(): void {
    try {
      // Guardar documentos cacheados
      localStorage.setItem(this.CACHED_DOCS_KEY, JSON.stringify(this.cachedDocuments));
      
      // Guardar detalles de documentos (convertir Map a Array)
      const detailsArray = Array.from(this.cachedDocumentDetails.entries());
      localStorage.setItem(this.CACHED_DETAILS_KEY, JSON.stringify(detailsArray));
      
      // Guardar última búsqueda
      const searchParams = {
        query: this.lastSearchQuery,
        maxDistance: this.lastMaxDistance
      };
      localStorage.setItem(this.LAST_SEARCH_KEY, JSON.stringify(searchParams));
    } catch (error) {
      console.error('❌ Error guardando datos en localStorage:', error);
    }
  }

  private clearLocalStorage(): void {
    localStorage.removeItem(this.CACHED_DOCS_KEY);
    localStorage.removeItem(this.CACHED_DETAILS_KEY);
    localStorage.removeItem(this.LAST_SEARCH_KEY);
  }

  // ========== MÉTODOS DE BÚSQUEDA (sin cambios) ==========

  searchDocuments(
    query: string, 
    searchType: 'semantic' | 'keyword' = 'semantic',
    limit: number = 10,
    offset: number = 0,
    maxDistance: number = 0.1
  ): Observable<DocumentSearchResponse> {
    let params = new HttpParams()
      .set('q', query)
      .set('type', searchType)
      .set('limit', limit.toString())
      .set('offset', offset.toString())
      .set('max_distance', maxDistance.toString()); 

    return this.http.get<DocumentSearchResponse>(`${this.apiUrl}/search`, { params });
  }

  getDocumentById(id: number): Observable<DocumentDetails> {
    return this.http.get<DocumentDetails>(`${this.apiUrl}/documents/${id}`);
  }

  // ========== SISTEMA DE CACHÉ MEJORADO ==========

  setCachedDocuments(documents: Document[]): void {
    this.cachedDocuments = documents;
    this.saveToLocalStorage(); // Guardar automáticamente
    console.log(`💾 Cached ${documents.length} documents y guardado en localStorage`);
  }

  getCachedDocuments(): Document[] {
    return this.cachedDocuments;
  }

  getCachedDocumentById(id: number): Document | null {
    return this.cachedDocuments.find(doc => doc.id === id) || null;
  }

  setCachedDocumentDetails(id: number, documentDetails: DocumentDetails): void {
    this.cachedDocumentDetails.set(id, documentDetails);
    this.saveToLocalStorage(); // Guardar automáticamente
    console.log(`💾 Cached details for document ${id} y guardado en localStorage`);
  }

  getCachedDocumentDetails(id: number): DocumentDetails | null {
    return this.cachedDocumentDetails.get(id) || null;
  }

  setLastSearchParams(query: string, maxDistance: number): void {
    this.lastSearchQuery = query;
    this.lastMaxDistance = maxDistance;
    this.saveToLocalStorage(); // Guardar automáticamente
    console.log(`💾 Saved search params: "${query}", ${maxDistance} en localStorage`);
  }

  getLastSearchParams(): { query: string; maxDistance: number } {
    return {
      query: this.lastSearchQuery,
      maxDistance: this.lastMaxDistance
    };
  }

  // Método para obtener un documento desde cualquier fuente (cache, localStorage, o API)
  getDocument(id: number): Observable<DocumentDetails> {
    // Primero verificar en caché de detalles
    const cachedDetails = this.getCachedDocumentDetails(id);
    if (cachedDetails) {
      console.log(`📄 Documento ${id} encontrado en caché de detalles`);
      return new Observable(observer => {
        observer.next(cachedDetails);
        observer.complete();
      });
    }

    // Luego verificar en caché de documentos básicos
    const cachedDocument = this.getCachedDocumentById(id);
    if (cachedDocument) {
      console.log(`📄 Documento ${id} encontrado en caché básico, mapeando a detalles`);
      const documentDetails = this.mapToDocumentDetails(cachedDocument);
      this.setCachedDocumentDetails(id, documentDetails);
      return new Observable(observer => {
        observer.next(documentDetails);
        observer.complete();
      });
    }

    // Finalmente, cargar desde API
    console.log(`📄 Documento ${id} no encontrado en caché, cargando desde API`);
    return this.getDocumentById(id);
  }

  private mapToDocumentDetails(doc: Document): DocumentDetails {
    return {
      id: doc.id,
      article_title: doc.article_title,
      abstract: doc.abstract,
      authors: doc.authors,
      keywords: doc.keywords,
      institution: doc.institution,
      funding: doc.funding,
      language: doc.language,
      issn: doc.issn,
      doi: doc.doi,
      references: doc.references || [],
      publication_date: doc.publication_date,
      cites_count: doc.cites_count || doc.citations,
      document_type: doc.document_type,
      content: doc.content,
      subject_areas: doc.subject_areas,
      source_title: doc.source_title,
      publisher: doc.publisher
    };
  }

  // Limpiar caché (opcional)
  clearAllCache(): void {
    this.cachedDocuments = [];
    this.cachedDocumentDetails.clear();
    this.lastSearchQuery = '';
    this.lastMaxDistance = 0.1;
    this.clearLocalStorage();
    console.log('🧹 Todo el caché limpiado');
  }
}