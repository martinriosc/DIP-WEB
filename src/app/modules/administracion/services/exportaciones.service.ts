import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExportacionesService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de exportaciones con paginación por módulo
   */
  listar(idModulo: number, start: number = 0, limit: number = 10): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/exportaciones/listar?idModulo=${idModulo}&start=${start}&limit=${limit}`, { withCredentials: true });
  }

  /**
   * Exporta usuarios de carga masiva
   */
  exportarUsuariosCargaMasiva(idServicio: number): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/exportaciones/usuariosCargaMasiva?idServicio=${idServicio}`, {}, { withCredentials: true });
  }

  /**
   * Obtiene la lista de descargas masivas disponibles
   */
  listarDescargaMasiva(idServicio: number, start: number = 0, limit: number = 10): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/exportaciones/listarDescargaMasiva?idServicio=${idServicio}&start=${start}&limit=${limit}`, { withCredentials: true });
  }

  /**
   * Crea un archivo zip con declaraciones
   */
  crearZip(idsDeclaracion: string, tipo: number, filtros: string): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('idsDeclaracion', idsDeclaracion);
    formData.append('tipo', tipo.toString());
    formData.append('filtros', filtros);
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/exportaciones/crearZip`, formData, { withCredentials: true });
  }

  /**
   * Exporta publicaciones
   */
  exportarPublicacion(data: any, filtros: string): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('filtros', filtros);
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/exportaciones/exportarPublicacion`, formData, { withCredentials: true });
  }

  /**
   * Exporta usuarios sin declaración
   */
  exportarSinDeclaracion(data: any, filtros: string): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('filtros', filtros);
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/exportaciones/exportarSinDeclaracion`, formData, { withCredentials: true });
  }

  /**
   * Exporta datos para UADip
   */
  exportarUADip(data: any, filtros: string): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('filtros', filtros);
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/exportaciones/exportarUADip`, formData, { withCredentials: true });
  }

  /**
   * Genera un excel con declaraciones pendientes
   */
  generarExcelPendientes(data: any, filtros: string): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('filtros', filtros);
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/exportaciones/generarExcelPendientes`, formData, { withCredentials: true });
  }

  /**
   * Exporta datos de la bandeja de entrada
   */
  exportarBandejaEntrada(data: any, filtros: string): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('filtros', filtros);
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/exportaciones/exportarBandejaEntrada`, formData, { withCredentials: true });
  }

  /**
   * Exporta reportes
   */
  exportarReportes(data: any, filtros: string): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('filtros', filtros);
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/exportaciones/exportarReportes`, formData, { withCredentials: true });
  }

  /**
   * Crea un zip con declaraciones
   */
  crearZipDeclaraciones(data: any, tipo: number, filtros: string, ambiente: boolean): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('tipo', tipo.toString());
    formData.append('filtros', filtros);
    formData.append('ambiente', ambiente.toString());
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/exportaciones/crearZipDeclaraciones`, formData, { withCredentials: true });
  }

  /**
   * Exporta datos de ley reservado
   */
  exportarLeyReservado(data: any, filtros: string): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    formData.append('filtros', filtros);
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/exportaciones/exportarLeyReservado`, formData, { withCredentials: true });
  }
} 