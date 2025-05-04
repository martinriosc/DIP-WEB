import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServicioAdminService {
  // URL base de la API
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Guarda información de un servicio
   */
  guardar(form: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/admin/servicio/guardar`, JSON.stringify(form), {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
  }

  /**
   * Lista los servicios con paginación y filtros
   */
  listarCargos(servicioId: number, start: number = 0, limit: number = 10): Observable<ApiResponse> {
    let url = `${this.apiUrl}/pr/service/admin/cargo/listar/servicio?servicioId=${servicioId}&start=${start}&limit=${limit}`;

    
    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }

  /**
   * Lista los servicios con paginación y filtros
   */
  listGrados(servicioId: number, start: number = 0, limit: number = 10): Observable<ApiResponse> {
    let url = `${this.apiUrl}/pr/service/admin/grado/listar/servicio?servicioId=${servicioId}&start=${start}&limit=${limit}`;
    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }

  /**
   * Actualiza el estado de servicios
   */
  actualizarEstado(servicioIds: number[]): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/admin/servicio/actualizarEstado`, JSON.stringify(servicioIds), {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    });
  }

  /**
   * Actualiza el parámetro de cargo
   */
  actualizarCargo(servicioId: number, valor: boolean): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('servicioId', servicioId.toString());
    formData.append('valor', valor.toString());
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/admin/servicio/actualizarCargo`, formData, { withCredentials: true });
  }

  /**
   * Actualiza el parámetro de grado
   */
  actualizarGrado(servicioId: number, valor: boolean): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('servicioId', servicioId.toString());
    formData.append('valor', valor.toString());
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/admin/servicio/actualizarGrado`, formData, { withCredentials: true });
  }

  /**
   * Carga los datos de un servicio
   */
  cargar(servicioId: number): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('servicioId', servicioId.toString());
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/admin/servicio/cargar`, formData, { withCredentials: true });
  }

  /**
   * Agrega cargos a un servicio
   */
  agregarCargos(servicioId: number, lista: number[]): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('servicioId', servicioId.toString());
    formData.append('lista', JSON.stringify(lista));
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/admin/servicio/agregarCargos`, formData, { withCredentials: true });
  }

  /**
   * Agrega grados a un servicio
   */
  agregarGrados(servicioId: number, lista: number[]): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('servicioId', servicioId.toString());
    formData.append('lista', JSON.stringify(lista));
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/admin/servicio/agregarGrados`, formData, { withCredentials: true });
  }

  /**
   * Obtiene datos de un servicio específico
   */
  getServicio(servicioId: number): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('servicioId', servicioId.toString());
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/admin/servicio/getServicio`, formData, { withCredentials: true });
  }

  /**
   * Lista los sujetos por servicio
   */
  listarSujetosByServicio(idServicio: number, start: number = 0, limit: number = 10): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/pr/service/admin/servicio/listarSujetosByServicio?idServicio=${idServicio}&start=${start}&limit=${limit}`, { withCredentials: true });
  }

  /**
   * Guarda la asociación entre servicio y sujeto
   */
  guardarServicioSujeto(sujetosId: string, idServicio: number): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('sujetosId', sujetosId);
    formData.append('idServicio', idServicio.toString());
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/admin/servicio/guardarServicioSujeto`, formData, { withCredentials: true });
  }

  /**
   * Elimina un sujeto de un servicio
   */
  eliminarServicioSujeto(idSujeto: number, idServicio: number): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('idSujeto', idSujeto.toString());
    formData.append('idServicio', idServicio.toString());
    
    return this.http.post<ApiResponse>(`${this.apiUrl}/pr/service/admin/servicio/eliminarServicioSujeto`, formData, { withCredentials: true });
  }
} 