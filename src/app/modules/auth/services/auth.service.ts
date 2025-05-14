import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { ApiResponse } from '../models/ApiResponse';
import { User } from '../models/User';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // URL base de la API
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    // Check if we have a user in local storage (optional)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  /**
   * Verifica si el usuario ya está autenticado usando la sesión existente
   * Usará el jsessionid de la cookie automáticamente
   */
  checkSession(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/declarante/loginUser`, { withCredentials: true })
      .pipe(
        tap(response => {
          if (response.success && response.data) {
            this.setCurrentUser(response.data);
          }
        }),
        catchError(error => {
          console.error('Error checking session:', error);
          // Return a properly typed ApiResponse
          return of({ success: false, data: {} as User } as ApiResponse);
        })
      );
  }

  /**
   * Guarda la información del usuario actual
   */
  private setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  /**
   * Devuelve el usuario actual
   */
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(rolName: string): boolean {
    const user = this.currentUser;
    if (!user || !user.roles) return false;
    return user.roles.some(rol => rol.nombre === rolName);
  }

  /**
   * Limpia la sesión del usuario en la aplicación
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getCurrentUserRut(): string {
    return this.currentUser?.rut || '';
  }

  getCurrentUserRol(): number {
    // return this.currentUser?.roles[0].id || 1;
    return 1;
  }

  isAuthenticated(): boolean {
    return !!this.currentUser;
  }
}
