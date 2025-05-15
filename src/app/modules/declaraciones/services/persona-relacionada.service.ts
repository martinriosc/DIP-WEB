import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  listar(declaracionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pr/service/personarelacionada/listar?declaracionId=${declaracionId}`, { withCredentials: true });
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


  guardarPariente(data: any, idDeclaracion: number): Observable<ApiResponse> {
  const body = new HttpParams()
    .set('data', JSON.stringify(data))
    .set('idDeclaracion', idDeclaracion.toString());

  const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  });

  return this.http.post<ApiResponse>(
    `${this.apiUrl}/pr/service/personarelacionada/parientes/guardar`,
    body.toString(),
    { headers, withCredentials: true }
  );
}


 
  guardar(data: any, idDeclaracion: number): Observable<any> {
    const body = new HttpParams()
      .set('data', JSON.stringify(data))
      .set('idDeclaracion', idDeclaracion.toString());

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    });

    return this.http.post(
      `${this.apiUrl}/pr/service/personarelacionada/guardar`,
      body.toString(),
      { headers, withCredentials: true }
    );
  }

  eliminar(id: string) {
    return this.http.get<any>(
      `${this.apiUrl}/pr/service/personarelacionada/eliminar/${id}`,
      { withCredentials: true }
    );
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
  changePersonaRelacionada(declaracionId: number, data: any): Observable<any> {
    const body = new HttpParams()
      .set('declaracionId', declaracionId.toString())
      .set('valor', data.toString());

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    });

    return this.http.post<any>(`${this.apiUrl}/pr/service/declaracion/changePersonaRelacionada`, body.toString(), { headers, withCredentials: true });
  }
} 