import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransparenciaActivaService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de declaraciones para transparencia activa
   */
  listar(filtro: any, sort: any = null, start: number = 0, limit: number = 10): Observable<ApiResponse> {
    let url = `${this.apiUrl}/pr/service/transparenciaActiva/listar?start=${start}&limit=${limit}`;
    
    if (filtro) {
      url += `&filtro=${JSON.stringify(filtro)}`;
    }
    
    if (sort) {
      url += `&sort=${JSON.stringify(sort)}`;
    }
    
    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }

  /**
   * Obtiene el total de declaraciones
   */
  totalDeclaraciones(filtro: any): Observable<ApiResponse> {
    let url = `${this.apiUrl}/pr/service/transparenciaActiva/totalDeclaraciones`;
    
    if (filtro) {
      url += `?filtro=${JSON.stringify(filtro)}`;
    }
    
    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }

  /**
   * Obtiene la bitácora de una declaración
   */
  listarBitacora(idDeclaracion: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/transparenciaActiva/listarBitacora?idDeclaracion=${idDeclaracion}`, { withCredentials: true });
  }

  /**
   * Envía declaraciones a vista pública
   */
  enviarVistaPublica(idsDeclaracion: string): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('idsDeclaracion', idsDeclaracion);
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/transparenciaActiva/enviarVistaPublica`, formData, { withCredentials: true });
  }

  /**
   * Obtiene la lista de procesos JSON
   */
  listarProcesos(filtro: any, sort: any = null, start: number = 0, limit: number = 10): Observable<ApiResponse> {
    let url = `${this.apiUrl}/pr/service/transparenciaActiva/listarProcesos?start=${start}&limit=${limit}`;
    
    if (filtro) {
      url += `&filtro=${JSON.stringify(filtro)}`;
    }
    
    if (sort) {
      url += `&sort=${JSON.stringify(sort)}`;
    }
    
    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }

  /**
   * Obtiene los estados posibles de un proceso
   */
  estadosProceso(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/transparenciaActiva/estadosProceso`, { withCredentials: true });
  }

  /**
   * Obtiene las declaraciones JSON de un proceso
   */
  listarDeclaracionesJson(idProceso: number, sort: any = null, start: number = 0, limit: number = 10): Observable<ApiResponse> {
    let url = `${this.apiUrl}/pr/service/transparenciaActiva/listarDeclaracionesJson?idProceso=${idProceso}&start=${start}&limit=${limit}`;
    
    if (sort) {
      url += `&sort=${JSON.stringify(sort)}`;
    }
    
    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }
} 