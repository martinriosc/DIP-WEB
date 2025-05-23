import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BienMuebleService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Lista los vehículos con paginación
   */
  listarVehiculos(tipo: any, declaranteId: number, page: number = 1, start: number = 0, limit: number = 25): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('tipo', JSON.stringify(tipo))
      .set('declaranteId', declaranteId.toString())
      .set('page', page.toString())
      .set('start', start.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/bienmueble/vehiculo/listar`, { 
      params,
      withCredentials: true 
    });
  }

  /**
   * Lista los bienes muebles con paginación
   */
  listar(declaranteId: number, page: number = 1, start: number = 0, limit: number = 25): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('declaranteId', declaranteId.toString())
      .set('page', page.toString())
      .set('start', start.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/bienmueble/listar`, { 
      params,
      withCredentials: true 
    });
  }

  /**
   * Lista los atributos de vehículos con paginación
   */
  listarAtributosVehiculo(tipo: string, vehiculoLiviano: number, page: number = 1, start: number = 0, limit: number = 25): Observable<ApiResponse> {
    const params = new HttpParams()
      .set('tipo', tipo)
      .set('vehiculoLiviano', vehiculoLiviano.toString())
      .set('page', page.toString())
      .set('start', start.toString())
      .set('limit', limit.toString());

    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/bienmueble/vehiculo/atributo/listar`, { 
      params,
      withCredentials: true 
    });
  }

   guardar(dto: any, declaranteId: number) {
    const body = new HttpParams()
      .set('data', JSON.stringify(dto))
      .set('declaranteId', declaranteId.toString());

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    });

    // El servlet único procesa vehículos, aeronaves, naves y otros
    return this.http.post(
      `${this.apiUrl}/pr/service/bienmueble/vehiculo/guardar`,
      body.toString(),
      { headers, withCredentials: true }
    );
  }
  
  
  eliminar(id: number) {

    return this.http.get(
      `${this.apiUrl}/pr/service/bienmueble/vehiculo/eliminar?id=${id}`,
      { withCredentials: true }
    );
  }
} 