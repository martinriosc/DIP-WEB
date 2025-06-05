import { Injectable } from '@angular/core';
import { 
  DeclaracionTransparenciaPasiva, 
  TipoDeclaracion, 
  EstadoDeclaracion,
  OpcionesExportacion 
} from '../models/transparencia-pasiva.models';

@Injectable({
  providedIn: 'root'
})
export class TransparenciaPasivaUtilsService {

  constructor() { }

  /**
   * Formatea una fecha para mostrar en la UI
   * @param fecha Fecha en formato string
   * @returns Fecha formateada para mostrar
   */
  formatearFechaParaMostrar(fecha: string): string {
    if (!fecha) return '';
    
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString('es-CL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return fecha; // Devolver la fecha original si hay error
    }
  }

  /**
   * Formatea una fecha para enviar a la API
   * @param fecha Objeto Date
   * @returns Fecha en formato DD/MM/YYYY
   */
  formatearFechaParaAPI(fecha: Date | null): string {
    if (!fecha) return '';
    
    const day = fecha.getDate().toString().padStart(2, '0');
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const year = fecha.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  /**
   * Obtiene la clase CSS para el estado de una declaración
   * @param estado Estado de la declaración
   * @returns Clase CSS correspondiente
   */
  obtenerClaseEstado(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'FIRMADA':
        return 'pill-success';
      case 'PENDIENTE':
        return 'pill-warning';
      case 'ARCHIVADA':
        return 'pill-secondary';
      case 'RECEPCIONADA':
        return 'pill-primary';
      case 'PROCESADA':
        return 'pill-info';
      case 'OBSERVADA':
        return 'pill-danger';
      case 'BORRADOR':
        return 'pill-light';
      default:
        return 'pill-default';
    }
  }

  /**
   * Obtiene el nombre del tipo de declaración por ID
   * @param tipoId ID del tipo de declaración
   * @returns Nombre del tipo de declaración
   */
  obtenerNombreTipoDeclaracion(tipoId: number): string {
    switch (tipoId) {
      case TipoDeclaracion.PRIMERA:
        return 'Primera Declaración';
      case TipoDeclaracion.ACTUALIZACION_PERIODICA:
        return 'Actualización Periódica';
      case TipoDeclaracion.ACTUALIZACION_EXTRAORDINARIA:
        return 'Actualización Extraordinaria';
      case TipoDeclaracion.TERMINO_FUNCIONES:
        return 'Término de Funciones';
      default:
        return 'No especificado';
    }
  }

  /**
   * Obtiene el nombre del estado por ID
   * @param estadoId ID del estado
   * @returns Nombre del estado
   */
  obtenerNombreEstado(estadoId: number): string {
    switch (estadoId) {
      case EstadoDeclaracion.BORRADOR:
        return 'Borrador';
      case EstadoDeclaracion.FIRMADA:
        return 'Firmada';
      case EstadoDeclaracion.RECEPCIONADA:
        return 'Recepcionada';
      case EstadoDeclaracion.PROCESADA:
        return 'Procesada';
      case EstadoDeclaracion.ARCHIVADA:
        return 'Archivada';
      case EstadoDeclaracion.PENDIENTE:
        return 'Pendiente';
      case EstadoDeclaracion.OBSERVADA:
        return 'Observada';
      default:
        return 'No especificado';
    }
  }

  /**
   * Valida un RUT chileno
   * @param rut RUT a validar
   * @returns true si es válido, false en caso contrario
   */
  validarRUT(rut: string): boolean {
    if (!rut) return false;
    
    // Limpiar el RUT
    const rutLimpio = rut.replace(/[^0-9kK]/g, '');
    
    if (rutLimpio.length < 2) return false;
    
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1).toLowerCase();
    
    // Calcular dígito verificador
    let suma = 0;
    let multiplicador = 2;
    
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i]) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    
    const dvCalculado = 11 - (suma % 11);
    const dvFinal = dvCalculado === 11 ? '0' : dvCalculado === 10 ? 'k' : dvCalculado.toString();
    
    return dv === dvFinal;
  }

  /**
   * Formatea un RUT para mostrar
   * @param rut RUT sin formato
   * @returns RUT con formato XX.XXX.XXX-X
   */
  formatearRUT(rut: string): string {
    if (!rut) return '';
    
    const rutLimpio = rut.replace(/[^0-9kK]/g, '');
    
    if (rutLimpio.length < 2) return rut;
    
    const cuerpo = rutLimpio.slice(0, -1);
    const dv = rutLimpio.slice(-1);
    
    // Formatear el cuerpo del RUT
    const cuerpoFormateado = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return `${cuerpoFormateado}-${dv}`;
  }

  /**
   * Construye el nombre completo de una persona
   * @param nombres Nombres
   * @param apellidoPaterno Apellido paterno
   * @param apellidoMaterno Apellido materno
   * @returns Nombre completo
   */
  construirNombreCompleto(nombres: string, apellidoPaterno: string, apellidoMaterno: string): string {
    const partes = [nombres, apellidoPaterno, apellidoMaterno].filter(parte => parte && parte.trim());
    return partes.join(' ');
  }

  /**
   * Genera opciones de exportación por defecto
   * @param formato Formato de exportación
   * @returns Opciones de exportación configuradas
   */
  generarOpcionesExportacion(formato: 'CSV' | 'XLSX' | 'PDF' = 'XLSX'): OpcionesExportacion {
    return {
      formato,
      incluirBitacora: false,
      columnas: [
        'idDeclaracion',
        'fechaDeclaracion',
        'fechaRecepcion',
        'tipoDeclaracion',
        'rutDeclarante',
        'nombreDeclarante',
        'apellidoPaterno',
        'apellidoMaterno',
        'servicio',
        'cargo',
        'estado'
      ],
      nombreArchivo: `transparencia_pasiva_${this.formatearFechaParaArchivo(new Date())}`
    };
  }

  /**
   * Formatea una fecha para usar en nombres de archivo
   * @param fecha Fecha a formatear
   * @returns Fecha en formato YYYYMMDD_HHMMSS
   */
  private formatearFechaParaArchivo(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const day = fecha.getDate().toString().padStart(2, '0');
    const hours = fecha.getHours().toString().padStart(2, '0');
    const minutes = fecha.getMinutes().toString().padStart(2, '0');
    const seconds = fecha.getSeconds().toString().padStart(2, '0');
    
    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
  }

  /**
   * Filtra declaraciones por texto de búsqueda
   * @param declaraciones Array de declaraciones
   * @param textoBusqueda Texto a buscar
   * @returns Declaraciones filtradas
   */
  filtrarDeclaracionesPorTexto(
    declaraciones: DeclaracionTransparenciaPasiva[], 
    textoBusqueda: string
  ): DeclaracionTransparenciaPasiva[] {
    if (!textoBusqueda || textoBusqueda.trim() === '') {
      return declaraciones;
    }
    
    const texto = textoBusqueda.toLowerCase().trim();
    
    return declaraciones.filter(declaracion => 
      declaracion.rutDeclarante.toLowerCase().includes(texto) ||
      declaracion.nombreDeclarante.toLowerCase().includes(texto) ||
      declaracion.apellidoPaterno.toLowerCase().includes(texto) ||
      declaracion.apellidoMaterno.toLowerCase().includes(texto) ||
      declaracion.cargo.toLowerCase().includes(texto) ||
      declaracion.servicio.toLowerCase().includes(texto) ||
      declaracion.estado.toLowerCase().includes(texto)
    );
  }

  /**
   * Ordena declaraciones por una propiedad específica
   * @param declaraciones Array de declaraciones
   * @param propiedad Propiedad por la cual ordenar
   * @param direccion Dirección del ordenamiento
   * @returns Declaraciones ordenadas
   */
  ordenarDeclaraciones(
    declaraciones: DeclaracionTransparenciaPasiva[], 
    propiedad: keyof DeclaracionTransparenciaPasiva,
    direccion: 'ASC' | 'DESC' = 'ASC'
  ): DeclaracionTransparenciaPasiva[] {
    return [...declaraciones].sort((a, b) => {
      const valorA = a[propiedad];
      const valorB = b[propiedad];
      
      // Manejar valores undefined o null
      if (valorA == null && valorB == null) return 0;
      if (valorA == null) return direccion === 'ASC' ? -1 : 1;
      if (valorB == null) return direccion === 'ASC' ? 1 : -1;
      
      if (valorA < valorB) return direccion === 'ASC' ? -1 : 1;
      if (valorA > valorB) return direccion === 'ASC' ? 1 : -1;
      return 0;
    });
  }
} 