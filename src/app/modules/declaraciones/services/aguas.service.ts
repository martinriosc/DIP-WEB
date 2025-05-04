import { HttpClient } from '@angular/common/http';
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
  listarAtributos(tipo: string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/aguas/atributo/listar?tipo=${tipo}`, { withCredentials: true });
  }

  /**
   * Guarda información de aguas o concesiones
   */
  guardar(data: any, declaranteId: number): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('declaranteId', declaranteId.toString());
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/aguas/guardar`, formData, { withCredentials: true });
  }

  /**
   * Lista los derechos de aguas o concesiones
   */
  listar(tipo: string, declaranteId: number, controlador: boolean = false, idDerecho?: number): Observable<ApiResponse> {
    let url = `${this.apiUrl}/pr/service/aguas/listar?tipo=${tipo}&declaranteId=${declaranteId}&controlador=${controlador}`;
    
    if (idDerecho) {
      url += `&idDerecho=${idDerecho}`;
    }
    
    return this.http.get<ApiResponse>(url, { withCredentials: true });
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
  listarEntidadesLike(query: string, start: number = 0, limit: number = 10): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/aguas/listarEntidadesLike?query=${query}&start=${start}&limit=${limit}`, { withCredentials: true });
  }

  /**
   * Lista los tipos de naturaleza
   */
  listarNaturaleza(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/aguas/listarNaturaleza`, { withCredentials: true });
  }
} 