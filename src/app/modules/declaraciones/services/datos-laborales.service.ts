import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
  guardar(data: any, declaracionId: number): Observable<any> {
  const body = new HttpParams()
    .set('data', JSON.stringify(data))
    .set('idDeclaracion', declaracionId.toString());

  const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  });

  return this.http.post(
    `${this.apiUrl}/pr/service/datoslaborales/guardar`,
    body.toString(),
    { headers, withCredentials: true, observe: 'response' }
  );
}
} 