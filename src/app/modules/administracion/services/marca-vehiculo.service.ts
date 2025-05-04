import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarcaVehiculoService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de marcas de vehículos
   */
  listar(start: number = 0, limit: number = 10): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/marcaVehiculoAdmin/listar?start=${start}&limit=${limit}`, { withCredentials: true });
  }

  /**
   * Obtiene una marca de vehículo específica
   */
  getMarca(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/marcaVehiculoAdmin/getMarca?id=${id}`, { withCredentials: true });
  }

  /**
   * Guarda información de una marca de vehículo
   */
  guardar(data: any): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/marcaVehiculoAdmin/guardar`, formData, { withCredentials: true });
  }

  /**
   * Elimina una marca de vehículo
   */
  eliminar(id: number): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('id', id.toString());
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/marcaVehiculoAdmin/eliminar`, formData, { withCredentials: true });
  }

  /**
   * Busca marcas de vehículos por nombre
   */
  buscar(query: string, start: number = 0, limit: number = 10): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/marcaVehiculoAdmin/buscar?query=${query}&start=${start}&limit=${limit}`, { withCredentials: true });
  }
} 