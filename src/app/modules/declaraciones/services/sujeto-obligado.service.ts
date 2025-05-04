import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SujetoObligadoService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Obtiene el sujeto obligado por servicio
   */
  getByServicio(idServicio: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pr/service/sujetoObligado/getByServicio?idServicio=${idServicio}`, { withCredentials: true });
  }
} 