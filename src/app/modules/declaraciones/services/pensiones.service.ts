import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PensionesService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de pensiones por declarante
   */
  listar(declaranteId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/pensiones/listar?declaranteId=${declaranteId}`, { withCredentials: true });
  }

  /**
   * Guarda la información de una pensión
   */
  guardar(data: any, declaranteId: number): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('declaranteId', declaranteId.toString());
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/pensiones/guardar`, formData, { withCredentials: true });
  }

  /**
   * Elimina una pensión
   */
  eliminar(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/pensiones/eliminar?id=${id}`, { withCredentials: true });
  }
} 