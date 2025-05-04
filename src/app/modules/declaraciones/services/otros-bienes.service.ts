import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OtrosBienesService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Lista otros bienes con paginación
   */
  listar(declaranteId: number, page: number = 1, start: number = 0, limit: number = 25): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('declaranteId', declaranteId.toString())
      .set('page', page.toString())
      .set('start', start.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/otrosBienes/listar`, { 
      params,
      withCredentials: true 
    });
  }
} 