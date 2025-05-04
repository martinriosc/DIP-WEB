import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpenDataService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Obtiene datos abiertos públicos con filtros
   */
  getPublicData(filtros: any): Observable<ApiResponse> {
    let url = `${this.apiUrl}/pu/service/openData/getData`;
    
    if (filtros) {
      const params = new URLSearchParams();
      
      Object.keys(filtros).forEach(key => {
        if (filtros[key] !== null && filtros[key] !== undefined) {
          params.append(key, filtros[key].toString());
        }
      });
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }

  /**
   * Obtiene datos abiertos privados con filtros
   */
  getPrivateData(filtros: any): Observable<ApiResponse> {
    let url = `${this.apiUrl}/pr/service/openDataPrivado/getData`;
    
    if (filtros) {
      const params = new URLSearchParams();
      
      Object.keys(filtros).forEach(key => {
        if (filtros[key] !== null && filtros[key] !== undefined) {
          params.append(key, filtros[key].toString());
        }
      });
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }

  /**
   * Obtiene declaraciones para datos abiertos con filtros
   */
  getDeclaraciones(filtros: any): Observable<ApiResponse> {
    let url = `${this.apiUrl}/pr/service/openDataPrivado/getDeclaraciones`;
    
    if (filtros) {
      const params = new URLSearchParams();
      
      Object.keys(filtros).forEach(key => {
        if (filtros[key] !== null && filtros[key] !== undefined) {
          params.append(key, filtros[key].toString());
        }
      });
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }

  /**
   * Descarga datos abiertos en formato específico
   */
  descargarDatos(filtros: any, formato: string = 'json'): Observable<Blob> {
    let url = `${this.apiUrl}/pu/service/openData/download${formato.toUpperCase()}`;
    
    if (filtros) {
      const params = new URLSearchParams();
      
      Object.keys(filtros).forEach(key => {
        if (filtros[key] !== null && filtros[key] !== undefined) {
          params.append(key, filtros[key].toString());
        }
      });
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }
    
    return this.http.get(url, {
      responseType: 'blob',
      withCredentials: true
    });
  }
} 