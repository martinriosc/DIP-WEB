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
    const _dc = new Date().getTime();
    const url = `${this.apiUrl}/pr/service/visador/getVisadorByDeclaraciones?_dc=${_dc}&query=&idDeclaracion=${idDeclaracion}&page=1&start=0&limit=25`;
    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }
} 