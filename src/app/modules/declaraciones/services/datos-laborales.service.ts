import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatosLaboralesService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Obtiene los datos laborales por ID de declaración
   */
  getDatosLaborales(declaracionId: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/datoslaborales/${declaracionId}`, { withCredentials: true });
  }

  /**
   * Guarda la información de datos laborales
   */
  guardar(data: any, idDeclaracion: number): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('idDeclaracion', idDeclaracion.toString());
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/datoslaborales/guardar`, formData, { withCredentials: true });
  }
} 