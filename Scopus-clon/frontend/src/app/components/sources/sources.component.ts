// src/app/components/sources/sources.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Source {
  id: number;
  rank: number;
  title: string;
  citeScore: number;
  highestPercentile: number;
  citations: string;
  documents: number;
  percentCited: number;
  category: string;
  quartile?: string;
}

@Component({
  selector: 'app-sources',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sources.component.html',
  styleUrls: ['./sources.component.scss']
})
export class SourcesComponent {
  searchQuery: string = '';
  selectedYear: string = '2024';
  selectedQuartiles: string[] = [];
  showOpenAccessOnly: boolean = false;
  showTop10Percent: boolean = false;
  minCitations: number = 0;
  minDocuments: number = 0;
  
  years = ['2024', '2023', '2022', '2021'];
  quartiles = ['1st quartile', '2nd quartile', '3rd quartile', '4th quartile'];
  
  sources: Source[] = [
    {
      id: 1,
      rank: 1,
      title: 'CA: A Cancer Journal for Clinicians',
      citeScore: 1154.2,
      highestPercentile: 99,
      citations: '1/415',
      documents: 105,
      percentCited: 94,
      category: 'Oncology',
      quartile: '1st quartile'
    },
    {
      id: 2,
      rank: 2,
      title: 'Foundations and Trends in Machine Learning',
      citeScore: 202.9,
      highestPercentile: 99,
      citations: '3,450',
      documents: 17,
      percentCited: 88,
      category: 'Software'
    },
    {
      id: 3,
      rank: 3,
      title: 'Nature Reviews Drug Discovery',
      citeScore: 181.8,
      highestPercentile: 99,
      citations: '32,182',
      documents: 177,
      percentCited: 92,
      category: 'Pharmacology',
      quartile: '1st quartile'
    },
    {
      id: 4,
      rank: 4,
      title: 'Nature Reviews Molecular Cell Biology',
      citeScore: 150.9,
      highestPercentile: 99,
      citations: '33,659',
      documents: 223,
      percentCited: 87,
      category: 'Molecular Biology',
      quartile: '1st quartile'
    }
  ];

  toggleQuartile(quartile: string): void {
    const index = this.selectedQuartiles.indexOf(quartile);
    if (index > -1) {
      this.selectedQuartiles.splice(index, 1);
    } else {
      this.selectedQuartiles.push(quartile);
    }
  }

  clearFilters(): void {
    this.selectedQuartiles = [];
    this.showOpenAccessOnly = false;
    this.showTop10Percent = false;
    this.minCitations = 0;
    this.minDocuments = 0;
    this.searchQuery = '';
  }

  exportToExcel(): void {
    console.log('Exporting to Excel...');
  }

  saveToSourceList(): void {
    console.log('Saving to source list...');
  }

  downloadSourceList(): void {
    console.log('Downloading Scopus Source List...');
  }

  get filteredSources(): Source[] {
    return this.sources.filter(source => {
      const matchesSearch = !this.searchQuery || 
        source.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        source.category.toLowerCase().includes(this.searchQuery.toLowerCase());
      
      const matchesQuartile = this.selectedQuartiles.length === 0 || 
        (source.quartile && this.selectedQuartiles.includes(source.quartile));
      
      return matchesSearch && matchesQuartile;
    });
  }
}