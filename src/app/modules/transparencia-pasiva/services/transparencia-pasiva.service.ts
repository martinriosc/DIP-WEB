import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

/**
 * Interfaz para los filtros del endpoint de transparencia pasiva
 */
export interface FiltroTransparenciaPasiva {
  fechaDesdeDeclaracion?: string;
  fechaHastaDeclaracion?: string;
  fechaDesdeRecepcion?: string;
  fechaHastaRecepcion?: string;
  tipoDeclaracionId?: number;
  cargo?: string;
  rutDeclarante?: string;
  nombreDeclarante?: string;
  apellidoPaterno?: string;
  apellidoMaterno?: string;
  servicioId?: string;
  rol?: number;
}

/**
 * Interfaz para los parámetros de ordenamiento
 */
export interface SortParameter {
  property: string;
  direction: 'ASC' | 'DESC';
}

@Injectable({
  providedIn: 'root'
})
export class TransparenciaPasivaService {
  
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de declaraciones de transparencia pasiva
   * @param filtro Objeto con los filtros a aplicar
   * @param sort Array de parámetros de ordenamiento
   * @param start Índice de inicio para la paginación
   * @param limit Límite de registros por página
   * @returns Observable con la respuesta de la API
   */
  listar(
    filtro: FiltroTransparenciaPasiva = {},
    sort: SortParameter[] = [{ property: 'recepcion', direction: 'ASC' }],
    start: number = 0,
    limit: number = 100
  ): Observable<ApiResponse> {
    
    // Construir URL base
    let url = `${this.apiUrl}/pr/service/transparencia/listar`;
    
    // Crear parámetros de consulta
    const params = new URLSearchParams();
    
    // Agregar timestamp
    params.append('_dc', Date.now().toString());
    
    // Agregar filtro como JSON
    params.append('filtro', JSON.stringify(filtro));
    
    // Agregar parámetros de paginación
    params.append('page', '1');
    params.append('start', start.toString());
    params.append('limit', limit.toString());
    
    // Agregar parámetros de ordenamiento
    params.append('sort', JSON.stringify(sort));
    
    // Construir URL completa
    url += '?' + params.toString();
    
    return this.http.get<ApiResponse>(url, { withCredentials: true });
  }

  /**
   * Obtiene las declaraciones con filtros por defecto
   * Utiliza los parámetros predeterminados del sistema
   */
  listarConFiltrosDefecto(): Observable<ApiResponse> {
    const filtroDefecto: FiltroTransparenciaPasiva = {
      fechaDesdeDeclaracion: '',
      fechaHastaDeclaracion: '',
      fechaDesdeRecepcion: '',
      fechaHastaRecepcion: '',
      tipoDeclaracionId: 1,
      cargo: '',
      rutDeclarante: '',
      nombreDeclarante: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      servicioId: '',
      rol: 11
    };
    
    return this.listar(filtroDefecto);
  }

  /**
   * Busca declaraciones con filtros específicos
   * @param filtro Filtros personalizados
   * @param opciones Opciones adicionales de paginación y ordenamiento
   */
  buscarDeclaraciones(
    filtro: Partial<FiltroTransparenciaPasiva>,
    opciones: {
      start?: number;
      limit?: number;
      sort?: SortParameter[];
    } = {}
  ): Observable<ApiResponse> {
    
    const { start = 0, limit = 100, sort = [{ property: 'recepcion', direction: 'ASC' }] } = opciones;
    
    return this.listar(filtro, sort, start, limit);
  }
} 