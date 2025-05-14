import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  guardar(data: any, declaranteId: number): Observable<any> {
    const body = new HttpParams()
      .set('data', JSON.stringify(data))
      .set('declaranteId', declaranteId);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    });

    return this.http.post<any>(
      `${this.apiUrl}/pr/service/otraFuente/guardar`,
      body.toString(),                // 👈 importante: string plano
      { headers, withCredentials: true, observe: 'response' }
    );
  }

  /**
   * Elimina una otra fuente de ingreso
   */
  eliminar(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pr/service/otraFuente/eliminar?id=${id}`, { withCredentials: true });
  }
} 