import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParametroAdminService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Guarda un parámetro de servicio
   */
  guardar(form: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/admin/parametro/guardar`, JSON.stringify(form), {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
  }

  /**
   * Actualiza el estado de parámetros
   */
  actualizarEstado(parametroIds: number[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/admin/parametro/actualizarEstado`, JSON.stringify(parametroIds), {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
  }

  /**
   * Valida un parámetro
   */
  validarParametro(usuarioId: number, servicioId: number): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('usuarioId', usuarioId.toString());
    formData.append('servicioId', servicioId.toString());
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/admin/parametro/validar`, formData, { withCredentials: true });
  }

  /**
   * Valida un jefe de servicio
   */
  validarJefeServicio(usuarioId: number, servicioId: number): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('usuarioId', usuarioId.toString());
    formData.append('servicioId', servicioId.toString());
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/admin/parametro/validarJefeServicio`, formData, { withCredentials: true });
  }

  /**
   * Elimina un parámetro
   */
  eliminarParametro(idParametro: number): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('idParametro', idParametro.toString());
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/admin/parametro/eliminarParametro`, formData, { withCredentials: true });
  }

  /**
   * Obtiene la configuración del sistema
   */
  listarConfiguracion(parametro: string, start: number = 0, limit: number = 10): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/admin/parametro/listarConfiguracion?parametro=${parametro}&start=${start}&limit=${limit}`, { withCredentials: true });
  }

  /**
   * Guarda una configuración del sistema
   */
  guardarConfiguracion(form: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/admin/parametro/guardarConfiguracion`, JSON.stringify(form), {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
  }

  /**
   * Obtiene las URLs de carga masiva
   */
  obtenerUrlsCargaMasiva(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/admin/parametro/obtenerUrlsCargaMasiva`, { withCredentials: true });
  }
} 