import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  guardar(data: any, declaranteId: number): Observable<any> {
    const body = new HttpParams()
      .set('data', JSON.stringify(data))
      .set('declaranteId', declaranteId);

          const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    });

    return this.http.post<any>(
      `${this.apiUrl}/pr/service/contrato/guardar`,
      body.toString(),                // 👈 importante: string plano
      { headers, withCredentials: true, observe: 'response' }
    );
  
  }

  /**
   * Elimina un contrato
   */
  eliminar(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/contrato/eliminar?id=${id}`, { withCredentials: true });
  }
} 