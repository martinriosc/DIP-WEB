/* ActividadProfesional */
export interface ActividadProfesional {
  id: number;
  grupo: number;
  tipoActividadId: number;
  tipoActividad: string;
  rubroId: number;
  rubro: string;
  naturalezaVinculo: string;
  objetoEntidad: string;
  objetoVinculo: string;
  fechaInicio: Date;
  clasificacionId: number;
  clasificacion: string;
  razonSocial: string;
  rutRun: boolean;
  rut: string;
  borrador: boolean;
}

/* AdminActividad */
export interface AdminActividad {
  id: number;
  actividad: string;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  estado: boolean;
  estadoId: number;
}

/* AdminCampoJsonReservado */
export interface AdminCampoJsonReservado {
  id: number;
  idSeccion: number;
  seccion: string;
  idCampoJson: number;
  campoJson: string;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  estado: boolean;
  estadoId: number;
}

/* AdminCargo */
export interface AdminCargo {
  id: number;
  cargo: string;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  estado: boolean;
}

/* AdminDatoReservado */
export interface AdminDatoReservado {
  id: number;
  campo: string;
  estadoXml: boolean;
  idSeccionFormulario: number;
  seccionFormulario: string;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  estado: boolean;
  estadoId: number;
}

/* AdminDependencia */
export interface AdminDependencia {
  id: number;
  dependencia: string;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  estado: boolean;
}

/* AdminGrado */
export interface AdminGrado {
  id: number;
  grado: string;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  estado: boolean;
}

/* AdminJsonReservado */
export interface AdminJsonReservado {
  id: number;
  nombre: string;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  estado: boolean;
  estadoId: number;
}

/* AdminMarcaVehiculo */
export interface AdminMarcaVehiculo {
  id: number;
  marcaVehiculo: string;
  tipoVehiculo: string;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  estado: boolean;
  estadoId: number;
}

/* AdminProfesion */
export interface AdminProfesion {
  id: number;
  profesion: string;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  estado: boolean;
  estadoId: number;
}

/* AdminReporte */
export interface AdminReporte {
  codigo: string;
  valor: string;
  visible: boolean;
}

/* AdminServicio */
export interface AdminServicio {
  id: number;
  servicio: string;
  tieneFiscalizador: boolean;
  defaultGrado: boolean;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  estado: boolean;
  estadoId: number;
  codigoSiaper: number;
}

/* AdminServicioFiscalizador */
export interface AdminServicioFiscalizador {
  id: number;
  idServicioFiscalizador: number;
  servicioFiscalizador: string;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  estado: boolean;
}

/* AdminServicioUsuario */
export interface AdminServicioUsuario {
  id: number;
  dependencia: string;
  cargo: string;
  grado: string;
  planta: string;
  calidad: string;
  estamento: string;
  roles: string;
  estado: boolean;
  servicio: string;
  servicioId: number;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
}

/* AdminTipoVehiculo */
export interface AdminTipoVehiculo {
  id: number;
  vehiculo: string;
  tipoVehiculo: string;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  estado: boolean;
  estadoId: number;
}

/* AdminUtm */
export interface AdminUtm {
  id: number;
  valorUtm: number;
  mes: number;
  anio: number;
  mesNombre: string;
  usuario: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  estado: boolean;
  estadoId: number;
}

/* AguasConcesiones */
export interface AguasConcesiones {
  id: number;
  nombre: string;
  numeroResolucion: string;
  numero: string;
  anio: string;
  entidad: string;
  tipoDerechoId: number;
  tipoDerecho: string;
  naturaleza: string;
  actoOtorgaId: number;
  actoOtorga: string;
  tipo: string;
  tipoId: number;
  emisor: string;
  emisorId: number;
  numeroRegistro: string;
  anioRegistro: string;
  borrador: boolean;
  controlador: boolean;
}

/* ApercibimientoDetalle */
export interface ApercibimientoDetalle {
  id: number;
  fechaApercibimiento: Date;
  tipoApercibimiento: string;
  idDeclaracion: number;
  folioDeclaracion: string;
  fechaDeclaracion: Date;
  servicioDeclaracion: string;
  tipoDeclaracion: string;
  cargoDeclaracion: string;
  numeralDeclaracion: string;
  leido: string;
  estado: string;
  comentario: string;
}

/* Apercibimiento */
export interface Apercibimiento {
  id: number;
  fechaApercibimiento: string;
  tipoApercibimiento: string;
  idDeclaracion: number;
  folioDeclaracion: string;
  fechaDeclaracion: string;
  servicioDeclaracion: string;
  tipoDeclaracion: string;
  cargoDeclaracion: string;
  numeralDeclaracion: string;
  leido: string;
  estado: string;
  nombreDeclarante: string;
  runDeclarante: string;
}

/* ApercibimientoOportunidad */
export interface ApercibimientoOportunidad {
  id: number;
  numeroOficio: number;
  fechaApercibimiento: Date;
  servicioDeclaracion: string;
  tipoDeclaracion: string;
  periodo: number;
  cargoDeclaracion: string;
  gradoDeclaracion: string;
  numeralDeclaracion: string;
  folio: Date;
  comentario: string;
}

/* ArchivoSolicitud */
export interface ArchivoSolicitud {
  id: number;
  nombre: string;
  md5: string;
}

/* Auditoria */
export interface Auditoria {
  id: number;
  fechaRecepcion: Date;
  fechaDeclaracion: Date;
  rutDeclarante: string;
  nombreDeclarante: string;
  declaTipo: string;
  servicio: string;
  cargo: string;
  declaEstado: string;
  sujetoObligado: number;
  sujetoObligadoOriginal: string;
  code: string;
  domicilio: string;
  periodo: number;
}

/* Autorizador */
export interface Autorizador {
  id: number;
  fechaSolicitud: Date;
  fechaEnvio: Date;
  rut: string;
  nombre: string;
  servicioSolicitante: string;
  motivoSolicitud: string;
  estado: string;
}

/* AutorizarDeclaracion */
export interface AutorizarDeclaracion {
  id: number;
  rutNombre: string;
  fechaDeclaracion: Date;
  tipoDeclaracion: string;
  cargo: string;
  code: string;
  estado: string;
}

/* BandejaLeyReservado */
export interface BandejaLeyReservado {
  id: number;
  fechaRecepcion: Date;
  fechaDeclaracion: Date;
  rutDeclarante: string;
  nombreDeclarante: string;
  declaTipo: string;
  servicio: string;
  cargo: string;
  declaEstado: string;
  sujetoObligado: number;
  sujetoObligadoOriginal: string;
  code: string;
}

/* BandejaUAdip */
export interface BandejaUAdip {
  id: number;
  fechaDeclaracion: string;
  fechaRecepcion: string;
  declaTipo: string;
  rutDeclarante: string;
  nombreDeclarante: string;
  servicio: string;
  cargo: string;
  declaEstado: string;
  sujetoObligado: number;
  sujetoObligadoOriginal: string;
  declaranteId: number;
  code: string;
  recepcion: string;
  reservado: boolean;
  periodo: number;
}

/* BienInmueble */
export interface BienInmueble {
  id: number;
  extranjero: string;
  clase: string;
  ubicacion: string;
  direccion: string;
  borrador: boolean;
  otra: string;
  fechaAdquisicion: Date;
}

/* BienInmuebleExtranjero */
export interface BienInmuebleExtranjero {
  id: number;
  pais: string;
  ciudad: string;
  direccion: string;
  valor: string;
  moneda: string;
  fechaAdquisicion: Date;
  clase: string;
  rbDomicilio: boolean;
  borrador: boolean;
}

/* BienMueble */
export interface BienMueble {
  id: number;
  descripcion: string;
  numero: string;
  anio: number;
  entidad: string;
  valor: string;
  monedaId: number;
  moneda: string;
  borrador: boolean;
}

/* Bitacora */
export interface Bitacora {
  id: number;
  usuario: string;
  fecha: Date;
  accion: string;
  perfil: string;
  observaciones: string;
}

/* BitacoraDescarga */
export interface BitacoraDescarga {
  id: number;
  fechaDescarga: Date;
  usuario: string;
  tipoDeclaracion: string;
}

/* BitacoraJson */
export interface BitacoraJson {
  id: number;
  fecha: Date;
  estado: string;
  error: string;
  operacion: string;
}

/* BitacoraSolicitud */
export interface BitacoraSolicitud {
  id: number;
  fecha: Date;
  estado: string;
  usuario: string;
}

/* Comun */
export interface Comun {
  id: number;
  nombre: string;
  autonomo: boolean;
}

/* ComunFiltroAutorizador */
export interface ComunFiltroAutorizador {
  id: string;
  nombre: string;
  autonomo: boolean;
}

/* ComunidadDerecho */
export interface ComunidadDerecho {
  id: number;
  tituloId: number;
  titulo: string;
  cantidadPorcentaje?: any;
  cantidad: string;
  razonSocial: string;
  rut: string;
  giroSii: string;
  fechaAdquisicion: Date;
  valorPlazaLibro?: any;
  valorCorriente: string;
  gravamenId: number;
  gravamen: string;
  controlador?: any;
  paisId: number;
  pais: string;
  borrador: boolean;
  moneda: string;
  calidadControlador?: any;
}

/* Configuracion */
export interface Configuracion {
  codigo: string;
  valor: string;
  visible: boolean;
}

/* ConfirmarDatos */
export interface ConfirmarDatos {
  id: number;
  tipo: string;
  item: string;
  tiene: string;
  incompleto: boolean;
  orden: number;
}

/* Contrato */
export interface Contrato {
  id: number;
  rut: string;
  razonSocial: string;
  fechaCelebracion: Date;
  notaria: string;
  valor: number;
  borrador: boolean;
}

/* Declaracion */
export interface Declaracion {
  id: number;
  anio: string;
  recepcion: string | Date;
  fechaFirmaDeclarante: string | Date;
  rut: string;
  declarante: string;
  declaTipo: string;
  servicio: string;
  cargo: string;
  declaEstado: string;
  fecha: string | Date;
  nombre: string;
  declaranteId: number;
  remitente: string;
  sujetoObligado: number;
  sujetoObligadoOriginal: string;
  code: string;
}

/* DeclaracionApercibimiento */
export interface DeclaracionApercibimiento {
  id: number;
  fecha: string;
  folio: string;
  cargo: string;
  tipo: string;
  servicio: string;
}

/* DeclaracionesJson */
export interface DeclaracionesJson {
  id: number;
  idDeclaracion: number;
  estado: string;
}

/* DeclaracionSolicitud */
export interface DeclaracionSolicitud {
  id: number;
  run: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  servicioSolicitante: string;
}

/* DescargaMasiva */
export interface DescargaMasiva {
  id: number;
  nombreCompleto: string;
  servicio: string;
  md5: string;
  fechaSolicitud: Date;
  contador: number;
}

/* DetalleProcesoMasivo */
export interface DetalleProcesoMasivo {
  id: number;
  idDeclaracion: number;
  accion: string;
  estado: string;
}

/* DetalleServicio */
export interface DetalleServicio {
  id: number;
  rut: string;
  nombre: string;
  tipoDeclaracion: string;
}

/* DetalleSolicitud */
export interface DetalleSolicitud {
  id: number;
  fecha: Date;
  declaTipo: string;
  declaEstado: string;
  rut: string;
  nombre: string;
  servicio: string;
  verDetalle: boolean;
}

/* ExportacionesUsuario */
export interface ExportacionesUsuario {
  id: number;
  nombreCompleto: string;
  filtro: any;
  fechaSolicitud: Date;
  total: number;
  contador: number;
  md5: string;
  tipo: string;
}

/* FirmarArchivarMasivo */
export interface FirmarArchivarMasivo {
  id: number;
  fecha: Date;
  usuario: string;
  nombreArchivo: string;
  declaraciones: string;
  total: number;
  procentaje: number;
  estado: string;
}

/* Funcionario */
export interface Funcionario {
  id: number;
  fechaCreacion: Date;
  servicio: string;
  numeroFuncionarios: number;
  estado: string;
  informador: string;
  fechaModificacion: Date;
  propietario: string;
}

/* Gravamen */
export interface Gravamen {
  id: number;
  tipoId: number;
  tipo: string;
  otro: string;
  fojas: string;
  numeroInscripcion: string;
  anio: number;
  conservadorId: number;
  conservador: string;
}

/* Incumplimiento */
export interface Incumplimiento {
  id: number;
  fechaCreacion: Date;
  servicio: string;
  numeroFuncionarios: number;
  estado: string;
  informador: string;
  ultimaModificacion: Date;
  propietario: string;
}

/* InfoAdmin */
export interface InfoAdmin {
  id: number;
  servicio: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  correo: string;
}

/* OtraFuente */
export interface OtraFuente {
  id: number;
  fuenteConflicto: string;
  observaciones: string;
  borrador: boolean;
}

/* OtrosAntecedentes */
export interface OtrosAntecedentes {
  id: number;
  descripcion: string;
  borrador: boolean;
}

/* OtrosBienes */
export interface OtrosBienes {
  id: number;
  tipoBien: string;
  monto: string;
  descripcion: string;
  borrador: boolean;
}

/* Pariente */
export interface Pariente {
  id?: number | null;      // allowNull/useNull
  parentescoId: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  rut: string;
  fechaNacimiento: Date;
}

/* Pasivos */
export interface Pasivos {
  id: number;
  tipoId: number;
  tipo: string;
  otroTipo: string;
  monto: number;
  razonSocial: string;
  borrador: boolean;
}

/* Pensiones */
export interface Pensiones {
  id: number;
  monto: number;
  borrador: boolean;
}

/* PersonaRelacionada */
export interface PersonaRelacionada {
  id?: number | null;
  parentescoId: number;
  parentesco: string;
  rut: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
}

/* ProcesoJson */
export interface ProcesoJson {
  id: number;
  fechaProceso: Date;
  declaraciones: string;
  total: number;
  cantidad: number;
  estado: string;
  procesadasCorrectamente: number;
  procesadasConError: number;
}

/* ProcesoMasivo */
export interface ProcesoMasivo {
  id: number;
  fecha: Date;
  usuario: string;
  nombreArchivo: string;
  declaraciones: string;
  total: number;
  procentaje: number;
  estado: string;
}

/* Prohibicion */
export interface Prohibicion {
  id?: number | null;
  fojas: string;
  numero: string;
  anio: number;
  degravamenTipo?: any;
  conservadorBienes?: any;
}

/* Publicacion */
export interface Publicacion {
  id: number;
  recepcion: Date;
  fechaFirmaDeclarante: Date;
  rut: string;
  declarante: string;
  declaTipo: string;
  servicio: string;
  cargo: string;
  declaEstado: string;
  sujetoObligado: number;
  sujetoObligadoOriginal: string;
  code: string;
  periodo: number;
}

/* ReporteComun */
export interface ReporteComun {
  id: number;
  servicio: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  rol: string;
  fechaCreacion: Date;
  fechaModificacion: Date;
  fechaDeclaracion: Date;
  fechaRecepcion: Date;
}

/* ReporteDeclaracion */
export interface ReporteDeclaracion {
  id: number;
  nombre: string;
  totalBorradores: number;
  totalPendientes: number;
  totalRecepcionadas: number;
  totalGeneral: number;
  groupBy: string;
}

/* ReporteUsuario */
export interface ReporteUsuario {
  id: number;
  nombre: string;
  autonomo: boolean;
  totalDeclarantes: number;
  totalRevisores: number;
  totalJefes: number;
  totalAdministradores: number;
  totalGeneral: number;
  groupBy: string;
}

/* SinDeclaracion */
export interface SinDeclaracion {
  id: number;
  rut: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  roles: string;
  correo: string;
}

/* Solicitud */
export interface Solicitud {
  id: number;
  fechaSolicitud: Date;
  fechaEnvio: Date;
  motivoSolicitud: string;
  numeroOrigen: number;
  anoOrigen: number;
  estado: string;
  respuesta: string;
}

/* Texto */
export interface Texto {
  id: number;
  campo: string;
  texto: string;
}

/* TransparenciaActiva */
export interface TransparenciaActiva {
  id: number;
  idProceso: number;
  fechaRecepcion: Date;
  fechaDeclaracion: Date;
  rutDeclarante: string;
  nombreDeclarante: string;
  declaTipo: string;
  servicio: string;
  cargo: string;
  declaEstado: string;
  sujetoObligado: number;
  sujetoObligadoOriginal: string;
  fechaProceso: Date;
  estadoProceso: string;
  code: string;
}

/* Transparencia */
export interface Transparencia {
  id: number;
  fechaRecepcion: Date;
  fechaDeclaracion: Date;
  rutDeclarante: string;
  nombreDeclarante: string;
  declaTipo: string;
  servicio: string;
  cargo: string;
  declaEstado: string;
  sujetoObligado: number;
  sujetoObligadoOriginal: string;
  code: string;
  domicilio: string;
  periodo: number;
}

/* Usuario */
export interface UsuarioModel {
  idUsuarioServicio: string;
  id: number;
  rut: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  activo: boolean;
  fechaCreacion: Date;
  fechaModificacion: Date;
  servicioId: number;
  servicio: string;
  usuario: string;
}

/* ValoresObligatorios */
export interface ValoresObligatorios {
  id: number;
  tipoInstrumentoId: number;
  tipoInstrumento: string;
  razonSocial: string;
  paisId: number;
  pais: string;
  fecha: Date;
  monto: string;
  monedaId: number;
  moneda: string;
  gravamenId: number;
  gravamen: string;
  tipoSeguro: string;
  borrador: boolean;
}

/* Vehiculo */
export interface Vehiculo {
  id: number;
  tipoMotorizadoId: number;
  tipoMotorizado: string;
  tipoVehiculoId: number;
  marcaId: number;
  modelo: string;
  anio: string;
  patente: string;
  numeroMotor: string;
  numeroChasis: string;
  numeroInscripcion: string;
  anioInscripcion: string;
  tasacionFiscal: string;
  monedaId: number;
  moneda: string;
  valorComercial: string;
  gravamenes: string;
  propietario: string;
  marca: string;
  marcaOtra: string;
  numeroSerie: string;
  nombre: string;
  tonelaje: string;
  caracteristicas: string;
  borrador: boolean;
  avaluoFiscal: string;
  gravamenId: number;
  tasacion: string;
  nombreTipo: string;
  nombreGravamen: string;
}
