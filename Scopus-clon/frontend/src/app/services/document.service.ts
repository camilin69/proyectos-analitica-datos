// document.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  
  // Nuevos campos para comparación
  search_time?: number;
  search_config?: string;
  search_engine?: string;
}

export interface DocumentSearchResponse {
  query: string;
  search_type: string;
  max_distance?: number;
  total_results: number;
  offset: number;
  limit: number;
  results: Document[];
  search_time?: number;
  search_config?: string;
  search_engine?: string;
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

export interface SearchComparisonResult {
  engine: string;
  config?: string;
  results: Document[];
  total_results: number;
  search_time: number;
  query: string;
  search_within: string;
  max_distance?: number;
}

// EXPORTAR las interfaces HNSW
export interface HNSWConfiguration {
  description: string;
  'hnsw:space': string;
  'hnsw:construction_ef': number;
  'hnsw:search_ef': number;
  'hnsw:M': number;
}

export interface HNSWConfig {
  [configName: string]: HNSWConfiguration;
}

interface HNSWConfigResponse {
  available_configurations: HNSWConfig;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = environment.documentsApiUrl;
  private usersApiUrl = environment.usersApiUrl;
  
  // Sistema de caché
  private cachedDocuments: Document[] = [];
  private cachedDocumentDetails: Map<number, DocumentDetails> = new Map();
  private searchWithin: string = '';
  private lastSearchQuery: string = '';
  private lastMaxDistance: number = 0.1;
  private lastSearchEngine: string = 'chromadb';
  private lastHNSWConfig: string = 'balanced';

  // Claves para localStorage
  private readonly CACHED_DOCS_KEY = 'cached_documents';
  private readonly CACHED_DETAILS_KEY = 'cached_document_details';
  private readonly LAST_SEARCH_KEY = 'last_search_params';

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  // ========== MÉTODOS DE LOCALSTORAGE ==========

  private loadFromLocalStorage(): void {
    try {
      const cachedDocs = localStorage.getItem(this.CACHED_DOCS_KEY);
      if (cachedDocs) {
        this.cachedDocuments = JSON.parse(cachedDocs);
      }

      const cachedDetails = localStorage.getItem(this.CACHED_DETAILS_KEY);
      if (cachedDetails) {
        const detailsArray = JSON.parse(cachedDetails);
        this.cachedDocumentDetails = new Map(detailsArray);
      }

      const lastSearch = localStorage.getItem(this.LAST_SEARCH_KEY);
      if (lastSearch) {
        const searchParams = JSON.parse(lastSearch);
        this.lastSearchQuery = searchParams.query;
        this.lastMaxDistance = searchParams.maxDistance;
        this.searchWithin = searchParams.searchWithin;
        this.lastSearchEngine = searchParams.searchEngine || 'chromadb';
        this.lastHNSWConfig = searchParams.hnswConfig || 'balanced';
      }
    } catch (error) {
      console.error('❌ Error cargando datos desde localStorage:', error);
    }
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem(this.CACHED_DOCS_KEY, JSON.stringify(this.cachedDocuments));
      
      const detailsArray = Array.from(this.cachedDocumentDetails.entries());
      localStorage.setItem(this.CACHED_DETAILS_KEY, JSON.stringify(detailsArray));
      
      const searchParams = {
        query: this.lastSearchQuery,
        searchWithin: this.searchWithin,
        maxDistance: this.lastMaxDistance,
        searchEngine: this.lastSearchEngine,
        hnswConfig: this.lastHNSWConfig
      };
      localStorage.setItem(this.LAST_SEARCH_KEY, JSON.stringify(searchParams));
    } catch (error) {
      console.error('❌ Error guardando datos en localStorage:', error);
    }
  }

  // ========== MÉTODOS DE BÚSQUEDA MEJORADOS ==========

  searchDocuments(
    query: string, 
    searchType: 'semantic' | 'traditional' = 'semantic',
    searchWithin: string,
    limit: number = 10,
    offset: number = 0,
    maxDistance: number = 0.1,
    searchEngine: string = 'chromadb',
    hnswConfig: string = 'balanced'
  ): Observable<DocumentSearchResponse> {
    
    if (searchEngine === 'mysql') {
      // Búsqueda en MySQL (base de datos tradicional)
      let params = new HttpParams()
        .set('q', query)
        .set('searchWithin', searchWithin)
        .set('limit', limit.toString())
        .set('offset', offset.toString());

      return this.http.get<DocumentSearchResponse>(`${this.usersApiUrl}/documents/search`, { params });
    } else {
      // Búsqueda en ChromaDB (vectorial)
      let params = new HttpParams()
        .set('q', query)
        .set('type', searchType)
        .set('searchWithin', searchWithin)
        .set('limit', limit.toString())
        .set('offset', offset.toString())
        .set('max_distance', maxDistance.toString())
        .set('hnsw_config', hnswConfig);

      return this.http.get<DocumentSearchResponse>(`${this.apiUrl}/search`, { params });
    }
  }

  searchWithHNSWComparison(
    query: string,
    searchWithin: string,
    limit: number = 10,
    offset: number = 0,
    maxDistance: number = 0.1
  ): Observable<SearchComparisonResult[]> {
    
    let params = new HttpParams()
      .set('q', query)
      .set('searchWithin', searchWithin)
      .set('limit', limit.toString())
      .set('max_distance', maxDistance.toString());

    return this.http.get<any>(`${this.apiUrl}/search/compare-hnsw`, { params }).pipe(
      map(response => {
        const comparisonResults: SearchComparisonResult[] = [];
        
        for (const [configName, configData] of Object.entries(response.comparison)) {
          const data = configData as any;
          comparisonResults.push({
            engine: 'chromadb',
            config: configName,
            results: data.results || [],
            total_results: data.total_results || 0,
            search_time: data.search_time || 0,
            query: response.query,
            search_within: response.search_within,
            max_distance: response.max_distance
          } as SearchComparisonResult);
        }
        
        return comparisonResults;
      })
    );
  }

  /**
   * Realizar búsqueda comparativa entre MySQL y ChromaDB
   */
  searchWithEngineComparison(
    query: string,
    searchWithin: string,
    limit: number = 10,
    offset: number = 0,
    maxDistance: number = 0.1,
    hnswConfig: string = 'balanced'
  ): Observable<SearchComparisonResult[]> {
    
    const mysqlSearch = this.searchDocuments(
      query, 'traditional', searchWithin, limit, offset, maxDistance, 'mysql'
    ).pipe(
      map(response => ({
        engine: 'mysql',
        config: 'traditional',
        results: response.results,
        total_results: response.total_results,
        search_time: response.search_time || 0,
        query: response.query,
        search_within: searchWithin,
        max_distance: maxDistance
      } as SearchComparisonResult))
    );

    const chromaDBSearch = this.searchDocuments(
      query, 'semantic', searchWithin, limit, offset, maxDistance, 'chromadb', hnswConfig
    ).pipe(
      map(response => ({
        engine: 'chromadb',
        config: hnswConfig,
        results: response.results,
        total_results: response.total_results,
        search_time: response.search_time || 0,
        query: response.query,
        search_within: searchWithin,
        max_distance: maxDistance
      } as SearchComparisonResult))
    );

    return forkJoin([mysqlSearch, chromaDBSearch]);
  }

  getDocumentById(id: number): Observable<DocumentDetails> {
    return this.http.get<DocumentDetails>(`${this.apiUrl}/documents/${id}`);
  }

  // ========== SISTEMA DE CACHÉ MEJORADO ==========

  setCachedDocuments(documents: Document[]): void {
    this.cachedDocuments = documents;
    this.saveToLocalStorage();
  }

  getCachedDocuments(): Document[] {
    return this.cachedDocuments;
  }

  getCachedDocumentById(id: number): Document | null {
    return this.cachedDocuments.find(doc => doc.id === id) || null;
  }

  setCachedDocumentDetails(id: number, documentDetails: DocumentDetails): void {
    this.cachedDocumentDetails.set(id, documentDetails);
    this.saveToLocalStorage();
  }

  getCachedDocumentDetails(id: number): DocumentDetails | null {
    return this.cachedDocumentDetails.get(id) || null;
  }

  setLastSearchParams(
    query: string, 
    searchWithin: string, 
    maxDistance: number,
    searchEngine: string = 'chromadb',
    hnswConfig: string = 'balanced'
  ): void {
    this.lastSearchQuery = query;
    this.lastMaxDistance = maxDistance;
    this.searchWithin = searchWithin;
    this.lastSearchEngine = searchEngine;
    this.lastHNSWConfig = hnswConfig;
    this.saveToLocalStorage();
  }

  getLastSearchParams(): { 
    query: string; 
    searchWithin: string; 
    maxDistance: number;
    searchEngine: string;
    hnswConfig: string;
  } {
    return {
      query: this.lastSearchQuery,
      searchWithin: this.searchWithin,
      maxDistance: this.lastMaxDistance,
      searchEngine: this.lastSearchEngine,
      hnswConfig: this.lastHNSWConfig
    };
  }

  getDocument(id: number): Observable<DocumentDetails> {
    const cachedDetails = this.getCachedDocumentDetails(id);
    if (cachedDetails) {
      return of(cachedDetails);
    }

    const cachedDocument = this.getCachedDocumentById(id);
    if (cachedDocument) {
      const documentDetails = this.mapToDocumentDetails(cachedDocument);
      this.setCachedDocumentDetails(id, documentDetails);
      return of(documentDetails);
    }

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

  clearAllCache(): void {
    this.cachedDocuments = [];
    this.cachedDocumentDetails.clear();
    this.lastSearchQuery = '';
    this.lastMaxDistance = 0.1;
    this.lastSearchEngine = 'chromadb';
    this.lastHNSWConfig = 'balanced';
    localStorage.removeItem(this.CACHED_DOCS_KEY);
    localStorage.removeItem(this.CACHED_DETAILS_KEY);
    localStorage.removeItem(this.LAST_SEARCH_KEY);
  }

  getHNSWConfigs(): Observable<HNSWConfig> {
    return this.http.get<HNSWConfigResponse>(`${this.apiUrl}/search/get-hnsw-configs`).pipe(
      map(response => response.available_configurations),
      catchError(error => {
        console.error('Error fetching HNSW configs:', error);
        return of({} as HNSWConfig); 
      })
    );
  }

  getSearchEngines(): string[] {
    return ['chromadb', 'mysql'];
  }
}