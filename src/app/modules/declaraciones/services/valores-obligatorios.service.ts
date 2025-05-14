import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ValoresObligatoriosService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de valores obligatorios por declarante y tipo
   */
  listar(declaranteId: number, tipo: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/valoresObligatorios/listar?declaranteId=${declaranteId}&tipo=${tipo}`, { withCredentials: true });
  }

  /**
   * Obtiene la lista de tipos de instrumentos por tipo de valor
   */
  listarTipoInstrumento(tipo: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/valoresObligatorios/tipoInstrumento/listar?tipo=${tipo}`, { withCredentials: true });
  }

  /**
   * Guarda la información de un valor obligatorio
   */
  guardar(data: any, declaranteId: number): Observable<ApiResponse> {
   const body = new HttpParams()
      .set('data', JSON.stringify(data))
      .set('declaranteId', declaranteId.toString());

  const headers = new HttpHeaders({
      'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'
  });

  return this.http.post<ApiResponse>(
      `${this.apiUrl}/pr/service/valoresObligatorios/guardar`,
      body.toString(),
      { headers, withCredentials:true }
  );
  }

  /**
   * Elimina un valor obligatorio
   */
  eliminar(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/pr/service/valoresObligatorios/eliminar?id=${id}`, { withCredentials: true });
  }
} 