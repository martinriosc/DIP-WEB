import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PersonaRelacionadaService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de personas relacionadas por declarante
   */
  listar(declaracionId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/personarelacionada/listar?declaracionId=${declaracionId}`, { withCredentials: true });
  }

  /**
   * Obtiene la lista de parientes
   */
  listarParientes(declaracionId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/personarelacionada/parientes/listar?declaracionId=${declaracionId}`, { withCredentials: true });
  }

  /**
   * Obtiene la lista de parentescos
   */
  listarParentescos(tipo: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/personarelacionada/parentescos/listar?tipo=${tipo}`, { withCredentials: true });
  }

  /**
   * Obtiene una persona relacionada específica
   */
  getPersonaRelacionada(idPersonaRelacionada: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/personaRelacionada/getPersona?idPersonaRelacionada=${idPersonaRelacionada}`, { withCredentials: true });
  }

  /**
   * Guarda información de una persona relacionada
   */
  guardar(data: any, declaranteId: number): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('declaranteId', declaranteId.toString());
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/personaRelacionada/guardar`, formData, { withCredentials: true });
  }

  /**
   * Elimina una persona relacionada
   */
  eliminar(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/personaRelacionada/eliminar?id=${id}`, { withCredentials: true });
  }

  /**
   * Valida la información de un RUT para una persona
   */
  validarRut(rut: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/personaRelacionada/validarRut?rut=${rut}`, { withCredentials: true });
  }

  /**
   * Obtiene información de una persona por su RUT
   */
  getInfoPersona(rut: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/personaRelacionada/getInfoPersona/${rut}`, { withCredentials: true });
  }

  /**
   * Cambia el estado de una persona relacionada (activa/inactiva "aplica")
   */
  changePersonaRelacionada(data: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/declaracion/changePersonaRelacionada`, data, { withCredentials: true });
  }
} 