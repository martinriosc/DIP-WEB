import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActividadProfesionalService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Valida el cónyuge para una declaración
   */
  validarConyuge(declaracionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pr/service/actividadprofesional/validarConyuge?declaracionId=${declaracionId}`, { withCredentials: true });
  }

  /**
   * Lista las actividades
   */
  listarActividades(grupo: number, declaranteId: number): Observable<any> {
    const params = new HttpParams()
      .set('grupo', grupo.toString())
      .set('declaranteId', declaranteId.toString());
    return this.http.post<any>(`${this.apiUrl}/pr/service/actividadprofesional/actividades/listar`, params, { withCredentials: true });
  }

  /**
   * Lista las actividades profesionales con paginación
   */
  listar(query: string = '', tipo: string = '', page: number = 1, start: number = 0, limit: number = 25): Observable<any> {
    const params = new HttpParams()
      .set('query', query)
      .set('tipo', tipo)
      .set('page', page.toString())
      .set('start', start.toString())
      .set('limit', limit.toString());

    return this.http.get<any>(`${this.apiUrl}/pr/service/actividadprofesional/listar`, { 
      params,
      withCredentials: true 
    });
  }
} 