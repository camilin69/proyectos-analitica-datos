// src/app/services/auth.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  institution?: {
    id: number;
    name: string;
    location: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  institutionId?: number;
}

export interface AuthResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  institution?: {
    id: number;
    name: string;
    location: string;
  };
  accessToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private accessToken = signal<string | null>(null);
  private router = inject(Router);
  private http = inject(HttpClient);
  
  // URL directa al backend - SIN PROXY
  private apiUrl = 'http://localhost:5000/api';
  
  private apiEndpoints = {
    auth: {
      login: `${this.apiUrl}/auth/login`,
      register: `${this.apiUrl}/auth/register`,
      me: `${this.apiUrl}/auth/me`
    },
    sources: `${this.apiUrl}/sources`,
    health: `${this.apiUrl}/health`
  };
  
  public isLoggedIn = computed(() => this.currentUser() !== null && this.accessToken() !== null);
  public user = computed(() => this.currentUser());
  public token = computed(() => this.accessToken());

  constructor() {
    console.log('🚀 AuthService initialized - Direct API calls');
    console.log('📡 API URL:', this.apiUrl);
    this.initialize();
  }

  private getHeaders() {
    const token = this.accessToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // ========== AUTH ENDPOINTS ==========
  login(credentials: LoginRequest): Observable<AuthResponse> {
    console.log('🔐 Attempting login to:', this.apiEndpoints.auth.login);
    return this.http.post<AuthResponse>(this.apiEndpoints.auth.login, credentials)
      .pipe(
        tap(response => {
          this.handleAuthentication(response);
        }),
        catchError(error => {
          console.error('❌ Login error:', error);
          throw error;
        })
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    console.log('📝 Attempting registration to:', this.apiEndpoints.auth.register);
    return this.http.post<AuthResponse>(this.apiEndpoints.auth.register, userData)
      .pipe(
        tap(response => {
          this.handleAuthentication(response);
        }),
        catchError(error => {
          console.error('❌ Registration error:', error);
          throw error;
        })
      );
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(this.apiEndpoints.auth.me, { 
      headers: this.getHeaders() as any 
    }).pipe(
      tap(user => {
        this.currentUser.set(user);
        localStorage.setItem('user', JSON.stringify(user));
      }),
      catchError(error => {
        console.error('❌ Error fetching current user:', error);
        this.logout();
        throw error;
      })
    );
  }

  // ========== SOURCES ENDPOINTS ==========
  getSources(page: number = 1, limit: number = 50, searchQuery: string = ''): Observable<any> {
    const params = {
      page: page.toString(),
      limit: limit.toString(),
      ...(searchQuery && { search: searchQuery })
    };
    
    return this.http.get(this.apiEndpoints.sources, { 
      params,
      headers: this.getHeaders() as any 
    });
  }

  // ========== HEALTH CHECK ==========
  healthCheck(): Observable<any> {
    return this.http.get(this.apiEndpoints.health);
  }

  // ========== AUTH MANAGEMENT ==========
  private handleAuthentication(response: AuthResponse): void {
    const { accessToken, ...user } = response;
    
    this.accessToken.set(accessToken);
    this.currentUser.set(user);
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    console.log('✅ Authentication successful:', user);
    this.router.navigate(['/']);
  }

  logout(): void {
    this.currentUser.set(null);
    this.accessToken.set(null);
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    
    console.log('🚪 User logged out');
    this.router.navigate(['/preview']);
  }

  initialize(): void {
    const savedToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.accessToken.set(savedToken);
        this.currentUser.set(user);
        console.log('🔍 User loaded from localStorage');
        
        // Verificar que el backend esté disponible
        this.healthCheck().subscribe({
          next: (health) => console.log('✅ Backend health:', health),
          error: (error) => console.warn('⚠️ Backend might be unavailable:', error)
        });
        
      } catch (error) {
        console.error('❌ Error loading saved authentication:', error);
        this.logout();
      }
    }
  }

  checkAuth(): boolean {
    return this.isLoggedIn();
  }

  // Método de simulación para desarrollo
  simulateLogin(): void {
    const mockUser: User = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com'
    };
    
    this.currentUser.set(mockUser);
    this.accessToken.set('dev-mock-token');
    
    localStorage.setItem('accessToken', 'dev-mock-token');
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    console.log('🎭 Simulated development login');
    this.router.navigate(['/']);
  }

  // Método para debug
  getApiConfig() {
    return {
      apiUrl: this.apiUrl,
      endpoints: this.apiEndpoints,
      currentUser: this.currentUser(),
      isLoggedIn: this.isLoggedIn()
    };
  }
}