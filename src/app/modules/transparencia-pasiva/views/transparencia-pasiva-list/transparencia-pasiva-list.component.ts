import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

/**
 * Interfaz para representar cada Declaración
 * que se listará en Transparencia Pasiva.
 */
export interface DeclaracionTransparencia {
  idDeclaracion: number;
  fechaDeclaracion: string;  // Ej: '08/04/2024 12:14:11'
  fechaRecepcion: string;    // Ej: '08/04/2024 14:11:05'
  tipoDeclaracion: string;   // Ej: 'PRIMERA DECLARACIÓN'
  numeral: number | string;
  rutDeclarante: string;     // Ej: '15381086-9'
  nombreDeclarante: string;  // Ej: 'CHRISTIAN ALEJANDRO SALINAS'
  servicio: string;          // Ej: 'CONTRALORIA GENERAL DE LA REPUBLICA'
  cargo: string;             // Ej: 'JEFE DE UNIDAD'
  estado: string;            // Ej: 'FIRMADA', 'ARCHIVADA', etc.
}

@Component({
  selector: 'app-transparencia-pasiva-list',
  templateUrl: './transparencia-pasiva-list.component.html',
  styleUrls: ['./transparencia-pasiva-list.component.scss']
})
export class TransparenciaPasivaListComponent implements OnInit {

  // Título principal: "Transparencia Pasiva"

  // Filtros:
  fechaDeclaracionDesde = new FormControl();
  fechaDeclaracionHasta = new FormControl();
  fechaRecepcionDesde   = new FormControl();
  fechaRecepcionHasta   = new FormControl();
  tipoDeclaracion       = new FormControl('');
  cargo                 = new FormControl('');
  rutDeclarante         = new FormControl('');
  nombreDeclarante      = new FormControl('');
  apellidoPaterno       = new FormControl('');
  apellidoMaterno       = new FormControl('');
  servicio              = new FormControl('');

  /**
   * Lista de declaraciones de ejemplo (vacía para mostrar "Sin Registro de Declaraciones").
   * Ajusta si deseas simular datos.
   */
  data: DeclaracionTransparencia[] = [];

  // MatTableDataSource para la tabla
  dataSource = new MatTableDataSource<DeclaracionTransparencia>(this.data);

  // Columnas en el orden que muestra la captura
  displayedColumns: string[] = [
    'idDeclaracion',
    'fechaDeclaracion',
    'fechaRecepcion',
    'tipoDeclaracion',
    'numeral',
    'rutDeclarante',
    'nombreDeclarante',
    'servicio',
    'cargo',
    'estado'
  ];

  constructor() {}

  ngOnInit(): void {}

  // Botones
  buscar() {
    console.log('Buscar con filtros:', {
      fechaDeclaracionDesde: this.fechaDeclaracionDesde.value,
      fechaDeclaracionHasta: this.fechaDeclaracionHasta.value,
      fechaRecepcionDesde: this.fechaRecepcionDesde.value,
      fechaRecepcionHasta: this.fechaRecepcionHasta.value,
      tipoDeclaracion: this.tipoDeclaracion.value,
      cargo: this.cargo.value,
      rutDeclarante: this.rutDeclarante.value,
      nombreDeclarante: this.nombreDeclarante.value,
      apellidoPaterno: this.apellidoPaterno.value,
      apellidoMaterno: this.apellidoMaterno.value,
      servicio: this.servicio.value
    });
  }

  limpiar() {
    this.fechaDeclaracionDesde.reset();
    this.fechaDeclaracionHasta.reset();
    this.fechaRecepcionDesde.reset();
    this.fechaRecepcionHasta.reset();
    this.tipoDeclaracion.setValue('');
    this.cargo.setValue('');
    this.rutDeclarante.reset();
    this.nombreDeclarante.reset();
    this.apellidoPaterno.reset();
    this.apellidoMaterno.reset();
    this.servicio.reset();
    this.dataSource.data = [];
    console.log('Filtros limpiados');
  }

  exportar() {
    console.log('Exportar...');
    // Lógica para exportar CSV, XLSX, etc.
  }

  descargarVersionPublica() {
    console.log('Descargar declaración (versión pública)...');
  }
}
