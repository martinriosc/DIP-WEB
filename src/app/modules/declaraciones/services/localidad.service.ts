import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalidadService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de regiones
   */
  getRegiones(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/localidad/region`, { withCredentials: true });
  }

  /**
   * Obtiene las comunas de una región
   */
  getComunasPorRegion(regionId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/localidad/comuna/region/${regionId}`, { withCredentials: true });
  }

  /**
   * Obtiene la lista de países extranjeros
   */
  getPaisesExtranjeros(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/localidad/paisExtranjero`, { withCredentials: true });
  }

  /**
   * Obtiene la información de Chile como país
   */
  getPaisChile(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/localidad/paisChile`, { withCredentials: true });
  }
} 