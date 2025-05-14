import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InmuebleService {
  // URL base de la API
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Obtiene los atributos de inmuebles según el tipo
   */
  listarAtributos(tipo: string, tipoGravamen: string = ''): Observable<ApiResponse> {
    let url = `${this.apiUrl}/pr/service/inmueble/atributo/listar?tipo=${tipo}`;

    if (tipoGravamen) {
      url += `&tipoGravamen=${tipoGravamen}`;
    }

    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }

  /**
   * Guarda la información de bien inmueble
   */
  guardarBienInmueble(data: any, declaranteId: number): Observable<any> {
    const body = new HttpParams()
      .set('data', JSON.stringify(data))
      .set('declaranteId', declaranteId.toString());

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    });

    return this.http.post(
      `${this.apiUrl}/pr/service/inmueble/bieninmueble/guardar`,
      body.toString(),                  // ← string plano
      { headers, withCredentials: true }
    );
  }

  /**
   * Lista los bienes inmuebles
   */
  listarBienesInmuebles(declaranteId: number, controlador: boolean = false, idDerecho?: number): Observable<ApiResponse> {
    let url = `${this.apiUrl}/pr/service/inmueble/bieninmueble/listar?declaranteId=${declaranteId}&controlador=${controlador}`;

    if (idDerecho) {
      url += `&idDerecho=${idDerecho}`;
    }

    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }

  /**
   * Lista los bienes inmuebles en el extranjero
   */
  listarBienesInmueblesExtranjero(declaranteId: number, controlador: boolean = false, idDerecho?: number): Observable<ApiResponse> {
    let url = `${this.apiUrl}/pr/service/inmueble/bieninmuebleExtranjero/listar?declaranteId=${declaranteId}&controlador=${controlador}`;

    if (idDerecho) {
      url += `&idDerecho=${idDerecho}`;
    }

    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }

  /**
   * Obtiene un inmueble específico
   */
  getInmueble(inmuebleId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/inmueble/inmueble/${inmuebleId}`, { withCredentials: true });
  }

  /**
   * Lista los gravámenes de un inmueble
   */
  listarGravamenes(inmuebleId: number, controlador: boolean = false): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/inmueble/bieninmueble/degravamen/listar?inmuebleId=${inmuebleId}&controlador=${controlador}`, { withCredentials: true });
  }

  /**
   * Obtiene un gravamen específico
   */
  getGravamen(degravamenId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/inmueble/bieninmueble/degravamen?degravamenId=${degravamenId}`, { withCredentials: true });
  }

  /**
   * Elimina un inmueble
   */
  eliminarInmueble(inmuebleId: number): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('inmuebleId', inmuebleId.toString());

    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/inmueble/bieninmueble/eliminar`, formData, { withCredentials: true });
  }

  /**
   * Elimina un gravamen
   */
  eliminarGravamen(degravamenId: number): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('degravamenId', degravamenId.toString());

    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/inmueble/bieninmueble/degravamen/eliminar`, formData, { withCredentials: true });
  }


} 