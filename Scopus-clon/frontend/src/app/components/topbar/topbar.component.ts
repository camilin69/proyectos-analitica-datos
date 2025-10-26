import { Component, OnInit, inject, SecurityContext } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);

  isLoggedIn = this.authService.isLoggedIn;
  currentUser = this.authService.user;
  searchQuery: string = '';

  // URLs seguras para los logos
  elsevierLogoUrl: SafeResourceUrl;
  scopusTextUrl: SafeResourceUrl;
  scopusPreviewTextUrl: SafeResourceUrl;
  infoIconUrl: SafeResourceUrl;
  institutionIconUrl: SafeResourceUrl;
  searchIconUrl: SafeResourceUrl;
  notificationsIconUrl: SafeResourceUrl;

  constructor() {
    // Sanitizar las URLs
    this.elsevierLogoUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/elsevier-logo.svg');
    this.scopusTextUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/elsevier-logo-text.svg');
    this.scopusPreviewTextUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/elsevier-logo-text-preview.svg');
    this.infoIconUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/info-icon.svg');
    this.institutionIconUrl = this.sanitizer.bypassSecurityTrustResourceUrl('assets/institution-icon.svg');
    this.searchIconUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/assets/search-icon.svg');
    this.notificationsIconUrl = this.sanitizer.bypassSecurityTrustResourceUrl('/assets/bell-icon.svg');

  }

  ngOnInit(): void {}

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/results-documents'], { 
        queryParams: { q: this.searchQuery } 
      });
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  navigateToSearch(): void {
    this.router.navigate(['/']);
  }

  navigateToAuthorSearch(): void {
    this.router.navigate(['/preview/author-search']);
  }

  navigateToSources(): void {
    this.router.navigate(['/sources']);
  }

  logout(): void {
    this.authService.logout();
  }
}