import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
      rol: filtro.rol || 1,
      tipobandeja: filtro.tipobandeja || 3
    };

    params = params.set('filtro', JSON.stringify(filtroObj));

    if (sort) {
      params = params.set('sort', JSON.stringify([{ property: sort, direction: 'DESC' }]));
    }

    return this.http.get<ApiResponse<T>>(`${this.apiUrl}/pr/service/declaracion/declaraciones/listar`, {
      params,
      withCredentials: true
    });
  }

  continuarBorrador() {
    return this.http.get<any>(`${this.apiUrl}/pr/service/declaracion/continuarBorrador`, { withCredentials: true });
  }

  validarNuevaDeclaracion() {
    return this.http.get<any>(`${this.apiUrl}/pr/service/declaracion/validarnuevadeclaracion`, { withCredentials: true });
  }

  crearNuevaDeclaracionConUltimosDatos() {
    return this.http.get<any>(`${this.apiUrl}/pr/service/declaracion/declaracionUsada`, { withCredentials: true });
  }

  listarDeclaracionesParaClonar() {
    return this.http.get<any>(`${this.apiUrl}/pr/service/declaracion/declaracionesClonar`, { withCredentials: true });
  }

  crearNuevaDeclaracionConDatosAnteriores(idDeclaracion: number) {
    const body = new HttpParams()
      .set('idDeclaracion', JSON.stringify(idDeclaracion))

    // 2) Forzar el mismo Content‑Type que usaba jQuery
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    });

    // 3) Enviar la cookie de sesión
    return this.http.post<any>(
      `${this.apiUrl}/pr/service/declaracion/clonarDeclaracion`,
      body.toString(),                // 👈 importante: string plano
      { headers, withCredentials: true, observe: 'response' }
    );

  }



  // Guardar declaracion
  guardarDeclaracion(form: any): Observable<any> {
    const body = new HttpParams()
      .set('datos', JSON.stringify(form));
    return this.http.post<any>(`${this.apiUrl}/pr/service/declaracion/guardar`, body.toString(), { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, withCredentials: true });
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
    const url = `${this.apiUrl}/pr/service/declaracion/archivar`;
    return this.http.post<ApiResponse<any>>(url, { idDeclaracion }, { withCredentials: true });
  }

  /**
   * Elimina una declaración
   */
  eliminarDeclaracion(declaracionId: number): Observable<any> {
    const body = new HttpParams()
      .set('declaracionId', declaracionId.toString());
    const url = `${this.apiUrl}/pr/service/declaracion/eliminarDeclaracion`;
    return this.http.post<any>(url, body, { withCredentials: true });
  }

  /**
   * Descarga una declaración
   */
  descargarDeclaracion(idDeclaracion: number, tipo: 'completa' | 'publica' = 'completa'): Observable<Blob> {
    const url = `${this.apiUrl}/pr/service/declaracion/descargar?idDeclaracion=${idDeclaracion}&tipo=${tipo}`;
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
  obtenerRegistro(declaranteId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/pr/service/registro/obtener?declaranteId=${declaranteId}`, { withCredentials: true });
  }

  /**
   * Guarda el registro de una grilla
   */
  guardarRegistro(declaranteId: number, grilla: string, valor: boolean): Observable<any> {
    const params = new HttpParams()
      .set('declaranteId', declaranteId.toString())
      .set('grilla', grilla)
      .set('valor', valor.toString());

    return this.http.post<any>(`${this.apiUrl}/pr/service/registro/guardar`, params, { withCredentials: true });
  }

  guardarRegistroPasivo(declaranteId: number, grilla: string, valor: number): Observable<any> {
    const params = new HttpParams()
      .set('declaranteId', declaranteId.toString())
      .set('grilla', grilla)
      .set('valor', valor.toString());

    return this.http.post<any>(`${this.apiUrl}/pr/service/registro/guardar/pasivo`, params, { withCredentials: true });
  }

  /**
   * Obtiene las declaraciones según los filtros
   */
  obtenerDeclaraciones(params: HttpParams): Observable<ApiResponse<Declaracion[]>> {
    const url = `${this.apiUrl}/pr/service/declaracion/declaraciones/listar`;
    return this.http.get<ApiResponse<Declaracion[]>>(url, { params, withCredentials: true });
  }

  /**
   * Obtiene el total de declaraciones según los filtros
   */
  obtenerTotalDeclaraciones(filtro: any): Observable<ApiResponse<number>> {
    const url = `${this.apiUrl}/pr/service/declaracion/totalDeclaraciones`;
    const params = new HttpParams()
      .set('_dc', new Date().getTime().toString())
      .set('filtro', JSON.stringify(filtro));
    return this.http.get<ApiResponse<number>>(url, { params, withCredentials: true });
  }

  /**
   * Valida si hay un proceso activo
   */
  validarProcesoActivo(): Observable<ApiResponse<boolean>> {
    const url = `${this.apiUrl}/pr/service/procesoMasivo/validaProcesoActivo`;
    const params = new HttpParams()
      .set('_dc', new Date().getTime().toString());
    return this.http.get<ApiResponse<boolean>>(url, { params, withCredentials: true });
  }


  listarExportaciones(idModulo = 8, page = 1, limit = 100) {
    const params = new HttpParams()
      .set('_dc', Date.now().toString())
      .set('idModulo', idModulo)
      .set('page', page)
      .set('start', '0')
      .set('limit', limit);
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/pr/service/exportaciones/listar`,
      { params, withCredentials: true });
  }

  listarProcesosMasivos(tipo: 'firmar' | 'archivar', page = 1, limit = 100) {
    const fn = tipo === 'firmar'
      ? 'listarProcesosFirmarArchivarMasivos'
      : 'listarProcesosFirmarArchivarMasivos';
    const params = new HttpParams()
      .set('_dc', Date.now().toString())
      .set('filtro', 'null')
      .set('page', page)
      .set('start', '0')
      .set('limit', limit);
    return this.http.get<ApiResponse<any>>(`${this.apiUrl}/pr/service/procesoMasivo/${fn}`,
      { params, withCredentials: true });
  }
} 