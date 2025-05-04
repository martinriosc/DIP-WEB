import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AutorizadorService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de solicitudes con filtros, paginación y ordenamiento
   */
  getSolicitudes(filtro: any, sort: any = null, start: number = 0, limit: number = 10): Observable<ApiResponse> {
    let url = `${this.apiUrl}/pr/service/autorizador/solicitudes?start=${start}&limit=${limit}`;
    
    if (filtro) {
      url += `&filtro=${JSON.stringify(filtro)}`;
    }
    
    if (sort) {
      url += `&sort=${JSON.stringify(sort)}`;
    }
    
    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }

  /**
   * Rechaza una solicitud
   */
  rechazarSolicitud(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/autorizador/rechazarSolicitud`, data, { withCredentials: true });
  }

  /**
   * Crea una respuesta para una solicitud
   */
  crearRespuesta(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/autorizador/crearRespuesta`, data, { withCredentials: true });
  }

  /**
   * Obtiene una respuesta de solicitud
   */
  obtenerRespuesta(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/autorizador/obtenerRespuesta`, data, { withCredentials: true });
  }

  /**
   * Aprueba una respuesta para una solicitud
   */
  aprobarRespuesta(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/autorizador/aprobarRespuesta`, data, { withCredentials: true });
  }

  /**
   * Agrega una declaración a una respuesta
   */
  agregarDeclaracionRespuesta(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/autorizador/agregarDeclaracionRespuesta`, data, { withCredentials: true });
  }

  /**
   * Elimina una declaración de una respuesta
   */
  eliminarDeclaracionRespuesta(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/autorizador/eliminarDeclaracionRespuesta`, data, { withCredentials: true });
  }

  /**
   * Obtiene las declaraciones de una respuesta
   */
  getDeclaracionesRespuesta(idRespuesta: number, query: string = '', start: number = 0, limit: number = 10): Observable<ApiResponse> {
    let url = `${this.apiUrl}/pr/service/autorizador/declaracionesRespuesta?idRespuesta=${idRespuesta}&start=${start}&limit=${limit}`;
    
    if (query) {
      url += `&query=${query}`;
    }
    
    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }

  /**
   * Obtiene las declaraciones autorizadas de una solicitud
   */
  getDeclaracionesAutorizadas(idSolicitud: number, query: string = '', start: number = 0, limit: number = 10): Observable<ApiResponse> {
    let url = `${this.apiUrl}/pr/service/autorizador/declaracionesAutorizadas?idSolicitud=${idSolicitud}&start=${start}&limit=${limit}`;
    
    if (query) {
      url += `&query=${query}`;
    }
    
    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }

  /**
   * Obtiene el servicio autorizado para una solicitud
   */
  getServicioAutorizado(idSolicitud: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/autorizador/servicioAutorizado?idSolicitud=${idSolicitud}`, { withCredentials: true });
  }
} 