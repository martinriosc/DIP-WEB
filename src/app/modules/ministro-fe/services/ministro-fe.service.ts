import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../auth/models/ApiResponse';

export interface ProcesoMasivo {
  id: number;
  fecha: string;
  tipo: string;
  estado: string;
  usuario: string;
  descripcion: string;
}

export interface Exportacion {
  id: number;
  fecha: string;
  modulo: string;
  usuario: string;
  estado: string;
  archivo: string;
}

@Injectable({
  providedIn: 'root'
})
export class MinistroFeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de procesos masivos de clasificación
   */
  listarProcesosMasivos(filtro: any = null, page: number = 1, limit: number = 100): Observable<ApiResponse<ProcesoMasivo[]>> {
    const params = new HttpParams()
      .set('_dc', new Date().getTime().toString())
      .set('filtro', filtro ? JSON.stringify(filtro) : 'null')
      .set('page', page.toString())
      .set('start', '0')
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<ProcesoMasivo[]>>(
      `${this.apiUrl}/pr/service/procesoMasivo/listar`,
      { params, withCredentials: true }
    );
  }

  /**
   * Obtiene la lista de procesos masivos para firmar y archivar
   */
  listarProcesosFirmarArchivarMasivos(filtro: any = null, page: number = 1, limit: number = 100): Observable<ApiResponse<ProcesoMasivo[]>> {
    const params = new HttpParams()
      .set('_dc', new Date().getTime().toString())
      .set('filtro', filtro ? JSON.stringify(filtro) : 'null')
      .set('page', page.toString())
      .set('start', '0')
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<ProcesoMasivo[]>>(
      `${this.apiUrl}/pr/service/procesoMasivo/listarProcesosFirmarArchivarMasivos`,
      { params, withCredentials: true }
    );
  }

  /**
   * Obtiene la lista de exportaciones
   */
  listarExportaciones(idModulo: number = 8, page: number = 1, limit: number = 100): Observable<ApiResponse<Exportacion[]>> {
    const params = new HttpParams()
      .set('_dc', new Date().getTime().toString())
      .set('idModulo', idModulo.toString())
      .set('page', page.toString())
      .set('start', '0')
      .set('limit', limit.toString());

    return this.http.get<ApiResponse<Exportacion[]>>(
      `${this.apiUrl}/pr/service/exportaciones/listar`,
      { params, withCredentials: true }
    );
  }

  /**
   * Envía una declaración al visador (Derivar)
   */
  enviarVisador(idDeclaracion: number, idVisador: number, observacion: string = ''): Observable<any> {
    const body = new HttpParams()
      .set('idDeclaracion', idDeclaracion.toString())
      .set('idVisador', idVisador.toString())
      .set('observacion', observacion);

    return this.http.post<any>(
      `${this.apiUrl}/pr/service/declaracion/enviarVisador`,
      body.toString(),
      { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true 
      }
    );
  }

  /**
   * Firma una declaración
   */
  firmarDeclaracion(idDeclaracion: number, observacion: string = ''): Observable<any> {
    const body = new HttpParams()
      .set('idDeclaracion', idDeclaracion.toString())
      .set('observacion', observacion);

    return this.http.post<any>(
      `${this.apiUrl}/pr/service/declaracion/firmarDeclaracion`,
      body.toString(),
      { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true 
      }
    );
  }

  /**
   * Envía una declaración al organismo fiscalizador (CGR)
   */
  enviarCgrDeclaracion(idDeclaracion: number, observacion: string = ''): Observable<any> {
    const body = new HttpParams()
      .set('idDeclaracion', idDeclaracion.toString())
      .set('observacion', observacion);

    return this.http.post<any>(
      `${this.apiUrl}/pr/service/declaracion/enviarCgrDeclaracion`,
      body.toString(),
      { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true 
      }
    );
  }

  /**
   * Devuelve todas las declaraciones de una bandeja
   */
  devolverTodoDeclaracion(filtro: any, observacion: string = ''): Observable<any> {
    const body = new HttpParams()
      .set('filtro', JSON.stringify(filtro))
      .set('observacion', observacion);

    return this.http.post<any>(
      `${this.apiUrl}/pr/service/declaracion/devolverTodoDeclaracion`,
      body.toString(),
      { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true 
      }
    );
  }

  /**
   * Firma y archiva de forma masiva todas las declaraciones de una bandeja
   */
  firmarArchivarMasivo(filtro: any, observacion: string = ''): Observable<any> {
    const body = new HttpParams()
      .set('filtro', JSON.stringify(filtro))
      .set('observacion', observacion);

    return this.http.post<any>(
      `${this.apiUrl}/pr/service/declaracion/firmarArchivarMasivo`,
      body.toString(),
      { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true 
      }
    );
  }

  /**
   * Archiva una o varias declaraciones
   */
  archivarDeclaracion(idDeclaraciones: number[], observacion: string = ''): Observable<any> {
    const body = new HttpParams()
      .set('idDeclaraciones', idDeclaraciones.join(','))
      .set('observacion', observacion);

    return this.http.post<any>(
      `${this.apiUrl}/pr/service/declaracion/archivarDeclaracion`,
      body.toString(),
      { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true 
      }
    );
  }

  /**
   * Firma y envía declaraciones seleccionadas de forma masiva
   */
  firmarEnviarSeleccionadas(idDeclaraciones: number[], observacion: string = ''): Observable<any> {
    const body = new HttpParams()
      .set('idDeclaraciones', idDeclaraciones.join(','))
      .set('observacion', observacion);

    return this.http.post<any>(
      `${this.apiUrl}/pr/service/declaracion/firmarEnviarSeleccionadas`,
      body.toString(),
      { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true 
      }
    );
  }

  /**
   * Archiva declaraciones seleccionadas de forma masiva
   */
  archivarSeleccionadas(idDeclaraciones: number[], observacion: string = ''): Observable<any> {
    const body = new HttpParams()
      .set('idDeclaraciones', idDeclaraciones.join(','))
      .set('observacion', observacion);

    return this.http.post<any>(
      `${this.apiUrl}/pr/service/declaracion/archivarSeleccionadas`,
      body.toString(),
      { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true 
      }
    );
  }

  /**
   * Devuelve declaraciones seleccionadas
   */
  devolverSeleccionadas(idDeclaraciones: number[], observacion: string = ''): Observable<any> {
    const body = new HttpParams()
      .set('idDeclaraciones', idDeclaraciones.join(','))
      .set('observacion', observacion);

    return this.http.post<any>(
      `${this.apiUrl}/pr/service/declaracion/devolverSeleccionadas`,
      body.toString(),
      { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true 
      }
    );
  }

  /**
   * Descarga una declaración en formato PDF
   */
  descargarDeclaracion(idDeclaracion: number, tipo: 'completa' | 'publica' = 'completa'): Observable<Blob> {
    const url = `${this.apiUrl}/pr/service/declaracion/descargar?idDeclaracion=${idDeclaracion}&tipo=${tipo}`;
    return this.http.get(url, {
      responseType: 'blob',
      withCredentials: true
    });
  }

  /**
   * Inicia un proceso de exportación
   */
  iniciarExportacion(filtro: any, formato: 'excel' | 'pdf' = 'excel'): Observable<any> {
    const body = new HttpParams()
      .set('filtro', JSON.stringify(filtro))
      .set('formato', formato)
      .set('idModulo', '8');

    return this.http.post<any>(
      `${this.apiUrl}/pr/service/exportaciones/iniciar`,
      body.toString(),
      { 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true 
      }
    );
  }
} 