import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AguasService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Obtiene los atributos de aguas según el tipo
   */
  listarAtributos(tipo: string): Observable<any> {
 
    return this.http.get<any>(`${this.apiUrl}/pr/service/aguas/atributo/listar?tipo=${tipo}`,{ withCredentials: true });
  }

  private postLegacy(data: any, declaranteId: number) {
    const body = new HttpParams()
      .set('data', JSON.stringify(data))
      .set('declaranteId', declaranteId.toString());

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    });

    return this.http.post(
      `${this.apiUrl}/pr/service/aguas/guardar`,
      body.toString(),
      { headers, withCredentials: true }
    );
  }

  /* ---------- DERECHOS ---------- */
  guardarDerecho(dto: any, declaranteId: number) {
    const payload = { ...dto, formId: '1' };
    return this.postLegacy(payload, declaranteId);
  }

  /* ---------- CONCESIONES ---------- */
  guardarConcesion(dto: any, declaranteId: number) {
    const payload = { ...dto, formId: '2' };
    return this.postLegacy(payload, declaranteId);
  }

  /**
   * Lista los derechos de aguas o concesiones
   */
  listar(tipo: string, declaranteId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pr/service/aguas/listar?tipo=${tipo}&declaranteId=${declaranteId}&controlador=false&page=1&start=0&limit=25`, { withCredentials: true });
  }

  /**
   * Elimina un derecho de aguas o concesión
   */
  eliminar(tipo: string, id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/aguas/eliminar?tipo=${tipo}&id=${id}`, { withCredentials: true });
  }

  /**
   * Busca entidades por nombre
   */
  listarEntidadesLike(term: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pr/service/aguas/listarEntidadesLike`, { withCredentials: true });
  }

  /**
   * Lista los tipos de naturaleza
   */
  listarNaturaleza(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pr/service/aguas/listarNaturaleza`, { withCredentials: true });
  }


} 