import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { Declaracion } from '../../../shared/models/AllModels';

export interface TipoDeclaracion {
  id: number;
  nombre: string;
}

export interface Servicio {
  id: number;
  nombre: string;
  flag: boolean;
  flagAsuncion: boolean;
}

export interface EstadoDeclaracion {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class DeclaracionService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Lista las declaraciones según el filtro
   */
  listar<T>(filtro: any, sort: string | null, page: number, size: number): Observable<ApiResponse<T>> {
    const _dc = new Date().getTime();
    let params = new HttpParams()
      .set('page', page.toString())
      .set('start', (page * size).toString())
      .set('limit', size.toString());
    
    // Estructura del filtro según el ejemplo
    const filtroObj = {
      remitente: filtro.remitente || '',
      fechaRecepcion: filtro.fechaRecepcion || '',
      fechaFirmaDeclarante: filtro.fechaFirmaDeclarante || '',
      tipoId: filtro.tipoId || '',
      rut: filtro.rut || '',
      declarante: filtro.declarante || '',
      servicioId: filtro.servicioId || '',
      cargo: filtro.cargo || '',
      estadoId: filtro.estadoId || 0,
      rol: filtro.rol.id || 1,
      tipobandeja: filtro.tipobandeja || 3
    };
    
    params = params.set('filtro', JSON.stringify(filtroObj));
    
    if (sort) {
      params = params.set('sort', JSON.stringify([{ property: 'id', direction: 'DESC' }]));
    }
    
    return this.http.get<ApiResponse<T>>(`${this.apiUrl}/pr/service/declaracion/declaraciones/listar`, { 
      params,
      withCredentials: true 
    });
  }

  /**
   * Obtiene el total de declaraciones según el filtro
   */
  totalDeclaraciones(filtro: any): Observable<ApiResponse<number>> {
    const _dc = new Date().getTime();
    let params = new HttpParams()
    
    // Estructura del filtro según el ejemplo
    const filtroObj = {
      remitente: filtro.remitente || '',
      fechaRecepcion: filtro.fechaRecepcion || '',
      fechaFirmaDeclarante: filtro.fechaFirmaDeclarante || '',
      tipoId: filtro.tipoId || '',
      rut: filtro.rut || '',
      declarante: filtro.declarante || '',
      servicioId: filtro.servicioId || '',
      cargo: filtro.cargo || '',
      estadoId: filtro.estadoId || 0,
      rol: filtro.rol || 1,
      tipobandeja: filtro.tipobandeja || 3
    };
    
    params = params.set('filtro', JSON.stringify(filtroObj));
    
    return this.http.get<ApiResponse<number>>(`${this.apiUrl}/pr/service/declaracion/totalDeclaraciones`, { 
      params,
      withCredentials: true 
    });
  }

  /**
   * Obtiene los tipos de declaración
   */
  obtenerTiposDeclaracion(): Observable<TipoDeclaracion[]> {
    const url = `${this.apiUrl}/pr/service/declaracionTipo/tipo`;
    return this.http.get<TipoDeclaracion[]>(url, { withCredentials: true });
  }

  /**
   * Obtiene los servicios disponibles
   */
  obtenerServicios(rut: string, idRol: number): Observable<ApiResponse<Servicio[]>> {
    const url = `${this.apiUrl}/pr/service/declarante/selectServicio?rut=${rut}&idRol=${idRol}`;
    return this.http.get<ApiResponse<Servicio[]>>(url, { withCredentials: true });
  }

  /**
   * Obtiene los estados de declaración
   */
  obtenerEstadosDeclaracion(tipo: number, rol: number): Observable<EstadoDeclaracion[]> {
    const url = `${this.apiUrl}/pr/service/declaracionEstado/listado?tipo=${tipo}&rol=${rol}`;
    return this.http.get<EstadoDeclaracion[]>(url, { withCredentials: true });
  }

  /**
   * Obtiene la bitácora de una declaración
   */
  obtenerBitacora(idDeclaracion: number): Observable<ApiResponse<any>> {
    const url = `${this.apiUrl}/pr/service/transparenciaActiva/listarBitacora?idDeclaracion=${idDeclaracion}`;
    return this.http.get<ApiResponse<any>>(url, { withCredentials: true });
  }

  /**
   * Archiva una declaración
   */
  archivarDeclaracion(idDeclaracion: number): Observable<ApiResponse<any>> {
    const url = `${this.apiUrl}/pr/service/bandejaUAdip/archivar`;
    return this.http.post<ApiResponse<any>>(url, { idDeclaracion }, { withCredentials: true });
  }

  /**
   * Elimina una declaración
   */
  eliminarDeclaracion(idDeclaracion: number): Observable<ApiResponse<any>> {
    const url = `${this.apiUrl}/pr/service/bandejaUAdip/eliminar`;
    return this.http.post<ApiResponse<any>>(url, { idDeclaracion }, { withCredentials: true });
  }

  /**
   * Descarga una declaración
   */
  descargarDeclaracion(idDeclaracion: number, tipo: 'completa' | 'publica' = 'completa'): Observable<Blob> {
    const url = `${this.apiUrl}/pr/service/bandejaUAdip/descargar?idDeclaracion=${idDeclaracion}&tipo=${tipo}`;
    return this.http.get(url, { 
      responseType: 'blob',
      withCredentials: true 
    });
  }

  /**
   * Obtiene una declaración por su ID
   */
  getDeclaracion(declaracionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pr/service/declaracion/${declaracionId}`, { withCredentials: true });
  }

  /**
   * Confirma los datos de una declaración
   */
  confirmarDatos(declaracionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pr/service/declaracion/confirmardatos?declaracionId=${declaracionId}`, { withCredentials: true });
  }

  /**
   * Obtiene el estado del flag "aplica"
   */
  obtenerAplica(declaracionId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pr/service/declaracion/obtenerAplica?declaracionId=${declaracionId}`, { withCredentials: true });
  }

  /**
   * Obtiene el bloque de tabla (wrapper)
   */
  obtenerRegistro(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pr/service/registro/obtener`, { withCredentials: true });
  }

  /**
   * Guarda el bloque de tabla (wrapper)
   */
  guardarRegistro(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/pr/service/registro/guardar`, data, { withCredentials: true });
  }
} 