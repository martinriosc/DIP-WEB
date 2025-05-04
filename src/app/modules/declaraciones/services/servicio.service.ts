import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Lista los sujetos por servicio
   */
  listarSujetosByServicio(idServicio: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pr/service/admin/servicio/listarSujetosByServicio?idServicio=${idServicio}`, { withCredentials: true });
  }

  /**
   * Lista los servicios públicos
   */
  listarServiciosPublicos(tipo: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pr/service/serviciopublico/listar?tipo=${tipo}`, { withCredentials: true });
  }
} 