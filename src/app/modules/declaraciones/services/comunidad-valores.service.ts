import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComunidadValoresService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Lista las comunidades de valores con paginación
   */
  listar(tipoId: number, declaranteId: number, extranjero: boolean = false, controlador: boolean = false, page: number = 1, start: number = 0, limit: number = 25): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('tipoId', tipoId.toString())
      .set('declaranteId', declaranteId.toString())
      .set('extranjero', extranjero.toString())
      .set('controlador', controlador.toString())
      .set('page', page.toString())
      .set('start', start.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/comunidadvalores/listar`, { 
      params,
      withCredentials: true 
    });
  }

  /**
   * Lista los títulos con paginación
   */
  listarTitulos(query: string = '', derecho: boolean = true, page: number = 1, start: number = 0, limit: number = 25): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('query', query)
      .set('derecho', derecho.toString())
      .set('page', page.toString())
      .set('start', start.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/comunidadvalores/titulo/listar`, { 
      params,
      withCredentials: true 
    });
  }

  /**
   * Guarda una comunidad de valores
   */
  guardar(data: any, declaranteId: number): Observable<any> {
    const body = new HttpParams()
      .set('data', JSON.stringify(data))
      .set('declaranteId', declaranteId.toString());

   const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    });

    
    return this.http.post<any>(
      `${this.apiUrl}/pr/service/comunidadvalores/guardar`,
      body.toString(),                // 👈 importante: string plano
      { headers, withCredentials: true, observe: 'response' }
    );
  }

  /**
   * Elimina una comunidad de valores
   */
  eliminar(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pr/service/comunidadvalores/eliminar?id=${id}`, {
      withCredentials: true
    });
  }
} 