import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  guardarDeclarante(declarante: any, declaracionId: number): Observable<any> {
    const body = new HttpParams()
      .set('data', JSON.stringify(declarante))
      .set('declaracionId', declaracionId);

    // 2) Forzar el mismo Content‑Type que usaba jQuery
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    });

    // 3) Enviar la cookie de sesión
    return this.http.post<any>(
      `${this.apiUrl}/pr/service/declarante/guardar`,
      body.toString(),                // 👈 importante: string plano
      { headers, withCredentials: true, observe: 'response' }
    );
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