import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DeclaranteService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Guarda la información del declarante
   */
  guardarDeclarante(data: any, declaracionId: number): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('declaracionId', declaracionId.toString());
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/declarante/guardar`, formData, { withCredentials: true });
  }

  /**
   * Obtiene la lista de declarantes asociados a una declaración
   */
  listarDeclarantes(idDeclaracion: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/declarante/declarantes/listar?idDeclaracion=${idDeclaracion}`, { withCredentials: true });
  }

  /**
   * Obtiene los datos de un declarante por ID de declaración
   */
  getDatosDeclarante(declaracionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pr/service/declarante/${declaracionId}`, { withCredentials: true });
  }

  /**
   * Verifica si el usuario está autenticado
   */
  loginUser(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/declarante/loginUser`, { withCredentials: true });
  }

  /**
   * Obtiene los servicios disponibles para un usuario y rol
   */
  selectServicio(idRol: number, rut: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/declarante/selectServicio?idRol=${idRol}&rut=${rut}`, { withCredentials: true });
  }

  /**
   * Obtiene el perfil del usuario actual
   */
  obtenerPerfil(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/declarante/perfil`, { withCredentials: true });
  }

  /**
   * Guarda el perfil del usuario
   */
  guardarPerfil(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/declarante/guardarPerfil`, data, { withCredentials: true });
  }

  /**
   * Obtiene información de administrador
   */
  infoAdmin(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/declarante/infoAdmin`, { withCredentials: true });
  }
} 