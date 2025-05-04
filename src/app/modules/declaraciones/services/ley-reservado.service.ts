import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeyReservadoService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Obtiene los datos de ley reservado con filtros, paginación y ordenamiento
   */
  listar(filtro: any, sort: any = null, start: number = 0, limit: number = 10): Observable<ApiResponse> {
    let url = `${this.apiUrl}/pr/service/leyReservado/listarLeyReservado?start=${start}&limit=${limit}`;
    
    if (filtro) {
      url += `&filtro=${JSON.stringify(filtro)}`;
    }
    
    if (sort) {
      url += `&sort=${JSON.stringify(sort)}`;
    }
    
    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }

  /**
   * Obtiene información específica de ley reservado
   */
  getInfoLeyReservado(idLeyReservado: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/leyReservado/infoLeyReservado?idLeyReservado=${idLeyReservado}`, { withCredentials: true });
  }

  /**
   * Guarda información de ley reservado
   */
  guardar(datos: any): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('datos', JSON.stringify(datos));
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/leyReservado/guardar`, formData, { withCredentials: true });
  }
} 