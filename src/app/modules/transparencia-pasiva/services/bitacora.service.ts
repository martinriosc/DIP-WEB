import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../auth/models/ApiResponse';
import { environment } from 'src/environments/environment';

/**
 * Interfaz para los parámetros de ordenamiento de bitácora
 */
export interface SortParameterBitacora {
  property: string;
  direction: 'ASC' | 'DESC';
}

/**
 * Interfaz para una entrada de bitácora
 */
export interface EntradaBitacora {
  id: number;
  declaracionId: number;
  fecha: string;
  accion: string;
  usuario: string;
  descripcion: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class BitacoraService {
  
  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) { }

  /**
   * Obtiene la bitácora de una declaración específica
   * @param declaracionId ID de la declaración
   * @param sort Array de parámetros de ordenamiento
   * @param start Índice de inicio para la paginación
   * @param limit Límite de registros por página
   * @returns Observable con la respuesta de la API
   */
  getBitacoras(
    declaracionId: number,
    sort: SortParameterBitacora[] = [{ property: 'fecha', direction: 'ASC' }],
    start: number = 0,
    limit: number = 100
  ): Observable<ApiResponse> {
    
    // Construir URL base
    let url = `${this.apiUrl}/pr/service/bitacora/getBitacoras`;
    
    // Crear parámetros de consulta
    const params = new URLSearchParams();
    
    // Agregar timestamp
    params.append('_dc', Date.now().toString());
    
    // Agregar ID de declaración
    params.append('declaracionId', declaracionId.toString());
    
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
   * Obtiene la bitácora completa de una declaración con ordenamiento por fecha ascendente
   * @param declaracionId ID de la declaración
   * @returns Observable con la respuesta de la API
   */
  getBitacoraCompleta(declaracionId: number): Observable<ApiResponse> {
    return this.getBitacoras(
      declaracionId,
      [{ property: 'fecha', direction: 'ASC' }],
      0,
      100
    );
  }

  /**
   * Obtiene la bitácora de una declaración con paginación personalizada
   * @param declaracionId ID de la declaración
   * @param opciones Opciones de paginación y ordenamiento
   * @returns Observable con la respuesta de la API
   */
  getBitacoraConOpciones(
    declaracionId: number,
    opciones: {
      start?: number;
      limit?: number;
      sort?: SortParameterBitacora[];
    } = {}
  ): Observable<ApiResponse> {
    
    const { 
      start = 0, 
      limit = 100, 
      sort = [{ property: 'fecha', direction: 'ASC' }] 
    } = opciones;
    
    return this.getBitacoras(declaracionId, sort, start, limit);
  }

  /**
   * Obtiene la bitácora más reciente de una declaración
   * @param declaracionId ID de la declaración
   * @param limit Número máximo de registros recientes
   * @returns Observable con la respuesta de la API
   */
  getBitacoraReciente(declaracionId: number, limit: number = 10): Observable<ApiResponse> {
    return this.getBitacoras(
      declaracionId,
      [{ property: 'fecha', direction: 'DESC' }],
      0,
      limit
    );
  }
} 