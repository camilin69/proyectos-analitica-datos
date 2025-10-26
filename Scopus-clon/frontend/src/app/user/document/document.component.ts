// src/app/user/document/document.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { DocumentService } from '../../services/document.service';

interface DocumentDetail {
  id: number;
  article_title: string;
  abstract: string;
  authors: string[];
  keywords: string[];
  institution: {
    id: number;
    name: string;
    city: string;
    country: string;
  };
  funding: {
    id: number;
    information: string;
    sponsor: string;
    acronym: string;
    number: string;
  };
  language: string;
  issn: string;
  coden: string;
  doi: string;
  references: Array<{
    id: number;
    reference_text: string;
  }>;
  coderence: string;
  chemical_name: string;
  cas_number: string;
  orcid: string;
  publication_date: string;
  cites_count: number;
  document_type: string;
  content: {
    sections: Array<{
      title: string;
      text: string;
    }>;
  };
  subject_areas: string[];
  source_title: string;
  publisher: string;
}

@Component({
  selector: 'app-document',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private documentService = inject(DocumentService);

  document: DocumentDetail | null = null;
  documentId: number | null = null;
  searchQuery: string = '';
  maxDistance: number = 1;
  isLoading: boolean = true;
  error: string = '';

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.documentId = +params['id'];
      this.loadDocument();
    });

    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['q'] || '';
      this.maxDistance = params['max_distance'] ? parseFloat(params['max_distance']) : 1;
    });
  }

  loadDocument() {
    if (!this.documentId) {
      this.error = 'Document ID not provided';
      this.isLoading = false;
      return;
    }

    // Usar el nuevo método que busca en todas las fuentes
    this.documentService.getDocument(this.documentId).subscribe({
      next: (documentDetails) => {
        // Map the incoming payload to the DocumentDetail shape expected by the component
        this.document = this.mapToDocumentDetail(documentDetails);
        this.isLoading = false;
        console.log(`✅ Documento ${this.documentId} cargado exitosamente`);
      },
      error: (error) => {
        console.error('❌ Error loading document:', error);
        this.error = 'Document not found or failed to load';
        this.isLoading = false;
      }
    });
  }

  private mapToDocumentDetail(doc: any): DocumentDetail {
    return {
      id: doc.id,
      article_title: doc.article_title || 'No title available',
      abstract: doc.abstract || 'No abstract available',
      authors: doc.authors || [],
      keywords: doc.keywords || doc.authorKeywords || [],
      institution: doc.institution || {
        id: 0,
        name: 'Unknown institution',
        city: 'Unknown',
        country: 'Unknown'
      },
      funding: doc.funding || {
        id: 0,
        information: 'No funding information',
        sponsor: 'Unknown',
        acronym: 'N/A',
        number: 'N/A'
      },
      language: doc.language || 'Unknown',
      issn: doc.issn || 'N/A',
      coden: doc.coden || 'N/A',
      doi: doc.doi || 'N/A',
      references: doc.references || [],
      coderence: doc.coderence || 'N/A',
      chemical_name: doc.chemical_name || 'N/A',
      cas_number: doc.cas_number || 'N/A',
      orcid: doc.orcid || 'N/A',
      publication_date: doc.publication_date || new Date().toISOString().split('T')[0],
      cites_count: doc.citations || doc.cites_count || 0,
      document_type: doc.document_type || 'Unknown type',
      content: doc.content || {
        sections: [
          {
            title: 'Content',
            text: doc.abstract || 'No content available'
          }
        ]
      },
      subject_areas: doc.subject_areas || doc.subjectAreas || [],
      source_title: doc.source_title || doc.source_title || 'Unknown source',
      publisher: doc.publisher || 'Unknown publisher'
    };
  }

  goBack() {
    // Usar los parámetros de búsqueda guardados si no hay en la URL
    const searchQuery = this.searchQuery || this.documentService.getLastSearchParams().query;
    const maxDistance = this.maxDistance || this.documentService.getLastSearchParams().maxDistance;

    if (searchQuery) {
      this.router.navigate(['/results-documents'], {
        queryParams: {
          q: searchQuery,
          max_distance: maxDistance
        }
      });
    } else {
      this.location.back();
    }
  }

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}