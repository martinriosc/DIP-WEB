import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';
import { BandejaUAdip } from '../../../shared/models/AllModels';

export interface FiltroOrganismoFiscalizador {
  fechaDesdeDeclaracion?: string;
  fechaHastaDeclaracion?: string;
  fechaDesdeRecepcion?: string;
  fechaHastaRecepcion?: string;
  tipoDeclaracionId?: string;
  estadoId?: string;
  rutDeclarante?: string;
  nombreDeclarante?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  servicioId?: number;
  cargo?: string;
  rol?: number;
}

export interface BitacoraEntry {
  id: number;
  usuario: string;
  fecha: string;
  accion: string;
  perfil: string;
  observaciones: string;
}

@Injectable({
  providedIn: 'root'
})
export class OrganismoFiscalizadorService {
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de declaraciones del organismo fiscalizador con filtros, paginación y ordenamiento
   * Endpoint: /pr/service/bandejaUAdip/listar
   */
  listarDeclaraciones(
    filtro: FiltroOrganismoFiscalizador, 
    sort: any[] = [], 
    page: number = 1, 
    start: number = 0, 
    limit: number = 100
  ): Observable<ApiResponse<BandejaUAdip[]>> {
    const _dc = new Date().getTime();
    
    let params = new HttpParams()
      .set('_dc', _dc.toString())
      .set('page', page.toString())
      .set('start', start.toString())
      .set('limit', limit.toString());

    // Agregar filtro como JSON string
    if (filtro) {
      params = params.set('filtro', JSON.stringify(filtro));
    }

    // Agregar ordenamiento como JSON string
    if (sort && sort.length > 0) {
      params = params.set('sort', JSON.stringify(sort));
    }

    return this.http.get<ApiResponse<BandejaUAdip[]>>(
      `${this.apiUrl}/pr/service/bandejaUAdip/listar`,
      { params, withCredentials: true }
    );
  }

  /**
   * Obtiene el total de declaraciones según los filtros aplicados
   * Endpoint: /pr/service/bandejaUAdip/totalDeclaraciones
   */
  obtenerTotalDeclaraciones(filtro: FiltroOrganismoFiscalizador): Observable<ApiResponse<number>> {
    const _dc = new Date().getTime();
    
    let params = new HttpParams()
      .set('_dc', _dc.toString());

    // Agregar filtro como JSON string
    if (filtro) {
      params = params.set('filtro', JSON.stringify(filtro));
    }

    return this.http.get<ApiResponse<number>>(
      `${this.apiUrl}/pr/service/bandejaUAdip/totalDeclaraciones`,
      { params, withCredentials: true }
    );
  }

  /**
   * Obtiene la bitácora de una declaración específica
   * Endpoint: /pr/service/bitacora/getBitacoras
   */
  obtenerBitacora(
    declaracionId: number,
    page: number = 1,
    start: number = 0,
    limit: number = 100,
    sort: any[] = [{ property: 'fecha', direction: 'ASC' }]
  ): Observable<ApiResponse<BitacoraEntry[]>> {
    const _dc = new Date().getTime();
    
    let params = new HttpParams()
      .set('_dc', _dc.toString())
      .set('declaracionId', declaracionId.toString())
      .set('page', page.toString())
      .set('start', start.toString())
      .set('limit', limit.toString());

    // Agregar ordenamiento como JSON string
    if (sort && sort.length > 0) {
      params = params.set('sort', JSON.stringify(sort));
    }

    return this.http.get<ApiResponse<BitacoraEntry[]>>(
      `${this.apiUrl}/pr/service/bitacora/getBitacoras`,
      { params, withCredentials: true }
    );
  }

  /**
   * Método utilitario para construir filtros con valores por defecto
   */
  construirFiltroDefecto(filtroCustom: Partial<FiltroOrganismoFiscalizador> = {}): FiltroOrganismoFiscalizador {
    return {
      fechaDesdeDeclaracion: '',
      fechaHastaDeclaracion: '',
      fechaDesdeRecepcion: '',
      fechaHastaRecepcion: '',
      tipoDeclaracionId: '',
      estadoId: '',
      rutDeclarante: '',
      nombreDeclarante: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      servicioId: 4862, // Valor por defecto basado en el ejemplo
      cargo: '',
      rol: 5, // Valor por defecto basado en el ejemplo
      ...filtroCustom
    };
  }
} 