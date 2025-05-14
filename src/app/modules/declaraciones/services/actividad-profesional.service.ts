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

    /**
   * Crea o actualiza una actividad (grupos 1, 2 ó 3).
   * Si `datos.id` es '', el back-end la trata como nueva.
   */
    guardarActividad(datos: any, declaranteId: number) {
      const body = new HttpParams()
        .set('datos', JSON.stringify(datos))
        .set('declaranteId', declaranteId);
  
      return this.http.post<any>(
        `${this.apiUrl}/pr/service/actividadprofesional/actividades/guardar`,
        body,
        { withCredentials: true }
      );
    }
  
    /**
     * Elimina una actividad por ID.
     */
    eliminarActividad(id: number) {
      return this.http.get<any>(
        `${this.apiUrl}/pr/service/actividadprofesional/actividades/eliminar/${id}`,
        { withCredentials: true }
      );
    }
} 