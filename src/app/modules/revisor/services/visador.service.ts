import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VisadorService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de visadores por declaración
   */
  listar(idDeclaracion: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/visador/listar?idDeclaracion=${idDeclaracion}`, { withCredentials: true });
  }

  /**
   * Obtiene los visadores por múltiples declaraciones
   */
  getVisadorByDeclaraciones(idDeclaracion: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/visador/getVisadorByDeclaraciones?idDeclaracion=${idDeclaracion}`, { withCredentials: true });
  }
} 