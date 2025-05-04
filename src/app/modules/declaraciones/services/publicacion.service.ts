import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de publicaciones con filtros, paginación y ordenamiento
   */
  listarPublicaciones(filtro: any, sort: any = null, start: number = 0, limit: number = 10): Observable<ApiResponse> {
    let url = `${this.apiUrl}/pr/service/publicacion/listarPublicaciones?start=${start}&limit=${limit}`;
    
    if (filtro) {
      url += `&filtro=${JSON.stringify(filtro)}`;
    }
    
    if (sort) {
      url += `&sort=${JSON.stringify(sort)}`;
    }
    
    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }

  /**
   * Guarda la información de una publicación
   */
  guardar(datos: any): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('datos', JSON.stringify(datos));
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/publicacion/guardar`, formData, { withCredentials: true });
  }

  /**
   * Obtiene la lista de usuarios sin declaración
   */
  listarSinDeclaracion(servicioId: number, sort: any = null, start: number = 0, limit: number = 10): Observable<ApiResponse> {
    let url = `${this.apiUrl}/pr/service/publicacion/listarSinDeclaracion?servicioId=${servicioId}&start=${start}&limit=${limit}`;
    
    if (sort) {
      url += `&sort=${JSON.stringify(sort)}`;
    }
    
    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }

  /**
   * Obtiene información de una declaración específica
   */
  infoDeclaracion(idDeclaracion: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/publicacion/infoDeclaracion?idDeclaracion=${idDeclaracion}`, { withCredentials: true });
  }

  /**
   * Reenvía la declaración al jefe de servicio
   */
  reenviarJefeServicio(idDeclaracion: number): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('idDeclaracion', idDeclaracion.toString());
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/publicacion/reenviarJefeServicio`, formData, { withCredentials: true });
  }
} 