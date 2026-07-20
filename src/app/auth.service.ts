import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

const getApiUrl = () => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return window.location.origin.includes('localhost')
      ? 'http://localhost:3333'
      : (window as any).__API_URL__ || 'https://seu-backend-railway.railway.app';
  }
  return 'http://localhost:3333';
};

const API_BASE_URL = getApiUrl();
const AUTH_TOKEN_KEY = 'akcit_auth_token';
const AUTH_ROLE_KEY = 'akcit_auth_role';

export interface LoginResponse {
  token: string;
  role: 'admin' | 'client';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(localStorage.getItem(AUTH_TOKEN_KEY));
  private roleSubject = new BehaviorSubject<'admin' | 'client' | null>(
    (localStorage.getItem(AUTH_ROLE_KEY) as 'admin' | 'client' | null) ?? null
  );

  public token$ = this.tokenSubject.asObservable();
  public role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient) {}

  get token(): string | null {
    return this.tokenSubject.value;
  }

  get role(): 'admin' | 'client' | null {
    return this.roleSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  get isAdmin(): boolean {
    return this.role === 'admin';
  }

  loginAsAdmin(): Observable<LoginResponse> {
    return this.login('admin', 'admin123');
  }

  loginAsClient(): Observable<LoginResponse> {
    return this.login('client', 'client123');
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_BASE_URL}/login`, { username, password }).pipe(
      tap((response) => {
        this.setSession(response.token, response.role);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_ROLE_KEY);
    this.tokenSubject.next(null);
    this.roleSubject.next(null);
  }

  private setSession(token: string, role: 'admin' | 'client'): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_ROLE_KEY, role);
    this.tokenSubject.next(token);
    this.roleSubject.next(role);
  }

  getAuthHeaders(): { headers: HttpHeaders } | {} {
    const token = this.token;
    if (!token) {
      return {};
    }

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }
}
