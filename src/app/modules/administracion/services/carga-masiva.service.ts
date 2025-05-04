import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CargaMasivaService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Realiza la carga masiva de usuarios
   */
  cargaMasiva(file: File, servicioId: string): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('servicioId', servicioId);
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/cargamasiva/cargaMasiva`, formData, { withCredentials: true });
  }

  /**
   * Descarga el archivo de ejemplo para la carga masiva
   */
  descargarEjemplo(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pr/service/cargamasiva/descarga`, {
      responseType: 'blob',
      withCredentials: true
    });
  }

  /**
   * Descarga el archivo de información de la carga masiva
   */
  descargarInfo(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/pr/service/cargamasiva/descargaInfo`, {
      responseType: 'blob',
      withCredentials: true
    });
  }
} 