export interface Rol {
  id: number;
  nombre: string;
}

export interface Servicio {
  id: number;
  nombre: string;
}

export interface Parametro {
  id: number;
  servicio: Servicio;
  roles: Rol[];
}

export interface User {
  idDeclarante: number;
  rut: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  roles: Rol[];
  primerLogin: boolean;
  correo: string;
  correoValidar: string;
  parametros: Parametro[];
  correoInstitucional: string;
  correoValidarInstitucional: string;
  telefonoContacto: number;
}
