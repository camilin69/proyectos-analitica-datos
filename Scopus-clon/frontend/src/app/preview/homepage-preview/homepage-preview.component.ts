// src/app/preview/homepage-preview/homepage-preview.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-homepage-preview',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './homepage-preview.component.html',
  styleUrl: './homepage-preview.component.scss'
})
export class HomepagePreview {
  constructor(private router: Router) {}

  onCreateAccount() {
    this.router.navigate(['/auth/register']);
  }

  onSubscribe() {
    console.log('Subscribe clicked');
  }

  navigateToSources() {
    this.router.navigate(['/preview/sources']);
  }
}