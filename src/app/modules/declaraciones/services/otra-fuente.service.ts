import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OtraFuenteService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de otras fuentes de ingreso por declarante
   */
  listar(declaranteId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/otraFuente/listar?declaranteId=${declaranteId}`, { withCredentials: true });
  }

  /**
   * Guarda la información de otra fuente de ingreso
   */
  guardar(data: any, declaranteId: number): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('declaranteId', declaranteId.toString());
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/otraFuente/guardar`, formData, { withCredentials: true });
  }

  /**
   * Elimina una otra fuente de ingreso
   */
  eliminar(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/otraFuente/eliminar?id=${id}`, { withCredentials: true });
  }
} 