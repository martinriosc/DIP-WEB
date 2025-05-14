import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  /**
   * Guarda la información de otro bien
   */
  guardar(data: any, declaranteId: number): Observable<any> {
    const body = new HttpParams()
      .set('data', JSON.stringify(data))
      .set('declaranteId', declaranteId);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    });

    return this.http.post<any>(
      `${this.apiUrl}/pr/service/otrosBienes/guardar`,
      body.toString(),                // 👈 importante: string plano
      { headers, withCredentials: true, observe: 'response' }
    );
  }

  /**
   * Elimina un otro bien
   */
  eliminar(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pr/service/otrosBienes/eliminar?id=${id}`, { withCredentials: true });
  }
} 