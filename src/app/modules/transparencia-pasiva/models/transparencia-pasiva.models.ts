/**
 * Interfaz para representar una declaración de transparencia pasiva
 */
export interface DeclaracionTransparenciaPasiva {
  idDeclaracion: number;
  fechaDeclaracion: string;
  fechaRecepcion: string;
  tipoDeclaracion: string;
  tipoDeclaracionId: number;
  numeral: number;
  rutDeclarante: string;
  nombreDeclarante: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  servicio: string;
  servicioId: string;
  cargo: string;
  estado: string;
  estadoId: number;
  // Campos adicionales que podrían venir de la API
  observaciones?: string;
  fechaCreacion?: string;
  fechaModificacion?: string;
  usuarioCreador?: string;
  usuarioModificador?: string;
}

/**
 * Interfaz para la respuesta de la API de listado de declaraciones
 */
export interface RespuestaListadoDeclaraciones {
  success: boolean;
  data: DeclaracionTransparenciaPasiva[];
  total: number;
  page: number;
  limit: number;
  message?: string;
}

/**
 * Interfaz para una entrada de bitácora
 */
export interface EntradaBitacora {
  id: number;
  declaracionId: number;
  fecha: string;
  fechaHora: Date;
  accion: string;
  accionId: number;
  usuario: string;
  usuarioId: number;
  descripcion: string;
  estado: string;
  estadoId: number;
  observaciones?: string;
  detallesAdicionales?: any;
}

/**
 * Interfaz para la respuesta de la API de bitácora
 */
export interface RespuestaBitacora {
  success: boolean;
  data: EntradaBitacora[];
  total: number;
  declaracionId: number;
  message?: string;
}

/**
 * Enum para los tipos de declaración
 */
export enum TipoDeclaracion {
  PRIMERA = 1,
  ACTUALIZACION_PERIODICA = 2,
  ACTUALIZACION_EXTRAORDINARIA = 3,
  TERMINO_FUNCIONES = 4
}

/**
 * Enum para los estados de declaración
 */
export enum EstadoDeclaracion {
  BORRADOR = 1,
  FIRMADA = 2,
  RECEPCIONADA = 3,
  PROCESADA = 4,
  ARCHIVADA = 5,
  PENDIENTE = 6,
  OBSERVADA = 7
}

/**
 * Enum para las acciones de bitácora
 */
export enum AccionBitacora {
  CREACION = 1,
  MODIFICACION = 2,
  FIRMA = 3,
  RECEPCION = 4,
  PROCESAMIENTO = 5,
  ARCHIVO = 6,
  OBSERVACION = 7,
  CORRECCION = 8
}

/**
 * Interfaz para opciones de exportación
 */
export interface OpcionesExportacion {
  formato: 'CSV' | 'XLSX' | 'PDF';
  incluirBitacora: boolean;
  filtro?: any;
  columnas?: string[];
  nombreArchivo?: string;
}

/**
 * Interfaz para configuración de paginación
 */
export interface ConfiguracionPaginacion {
  pageSize: number;
  pageIndex: number;
  length: number;
  pageSizeOptions: number[];
}

/**
 * Interfaz para respuesta de operaciones generales
 */
export interface RespuestaOperacion {
  success: boolean;
  message: string;
  data?: any;
  errors?: string[];
} 