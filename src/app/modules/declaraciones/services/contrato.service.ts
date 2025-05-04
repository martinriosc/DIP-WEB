import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Lista los contratos
   */
  listar(declaranteId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/contrato/listar?declaranteId=${declaranteId}`, { withCredentials: true });
  }

  /**
   * Guarda la información de un contrato
   */
  guardar(data: any, declaranteId: number): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('declaranteId', declaranteId.toString());
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/contrato/guardar`, formData, { withCredentials: true });
  }

  /**
   * Elimina un contrato
   */
  eliminar(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/contrato/eliminar?id=${id}`, { withCredentials: true });
  }
} 