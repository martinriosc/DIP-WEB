import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

/**
 * Interfaz para representar las declaraciones
 * que se listan en Organismo Fiscalizador.
 */
export interface DeclaracionFiscalizador {
  idDeclaracion: number;
  fechaDeclaracion: string;  // Ej.: '08/04/2024 12:14:11'
  fechaRecepcion: string;    // Ej.: '08/04/2024 14:11:05'
  tipoDeclaracion: string;   // Ej.: 'ACTUALIZACION PERIÓDICA'
  periodo: string | number;  // Ej.: 2024
  numeral: number | string;
  rutDeclarante: string;     // Ej.: '15381086-9'
  nombreDeclarante: string;  // Ej.: 'CHRISTIAN ALEJANDRO'
  servicio: string;          // Ej.: 'CONTRALORÍA GENERAL...'
  cargo: string;             // Ej.: 'JEFE DE UNIDAD'
  estado: string;            // Ej.: 'FIRMADA', 'ARCHIVADA', etc.
}

@Component({
  selector: 'app-organismo-fiscalizador-list',
  templateUrl: './organismo-fiscalizador-list.component.html',
  styleUrls: ['./organismo-fiscalizador-list.component.scss']
})
export class OrganismoFiscalizadorListComponent implements OnInit {

  // Título: "Organismo Fiscalizador"
  // Filtros:
  fechaDeclaracionDesde = new FormControl();
  fechaDeclaracionHasta = new FormControl();
  fechaRecepcionDesde   = new FormControl();
  fechaRecepcionHasta   = new FormControl();
  tipoDeclaracion       = new FormControl('');
  estado                = new FormControl('');
  runDeclarante         = new FormControl('');
  nombreDeclarante      = new FormControl('');
  apellidoPaterno       = new FormControl('');
  apellidoMaterno       = new FormControl('');
  servicio              = new FormControl('');
  cargo                 = new FormControl('');

  /**
   * Data de ejemplo. En la captura aparece "Sin Registro de Declaraciones",
   * pero aquí dejamos una lista vacía para demostrar.
   * Si quieres simular data, puedes agregar objetos.
   */
  data: DeclaracionFiscalizador[] = [
    // Deja vacío para mostrar "Sin Registro de Declaraciones"
    // o agrega elementos si quieres ver filas.
    {
      idDeclaracion: 12345,
      fechaDeclaracion: '10/04/2025 12:10:00',
      fechaRecepcion: '10/04/2025 15:30:00',
      tipoDeclaracion: 'ACTUALIZACION PERIÓDICA',
      periodo: 2025,
      numeral: 22,
      rutDeclarante: '15381086-9',
      nombreDeclarante: 'CHRISTIAN ALEJANDRO',
      servicio: 'CONTRALORÍA GENERAL - TESTING',
      cargo: 'JEFE DE UNIDAD',
      estado: 'FIRMADA'
    },
    {
      idDeclaracion: 12346,
      fechaDeclaracion: '12/04/2025 12:10:00',
      fechaRecepcion: '14/04/2025 15:30:00',
      tipoDeclaracion: 'ACTUALIZACION PERIÓDICA',
      periodo: 2025,
      numeral: 23,
      rutDeclarante: '12123123-2',
      nombreDeclarante: 'CHRISTIAN ALEJANDRO',
      servicio: 'CONTRALORÍA GENERAL - TESTING',
      cargo: 'JEFE DE UNIDAD',
      estado: 'PENDIENTE'
    },
  ];

  // DataSource para la tabla
  dataSource = new MatTableDataSource<DeclaracionFiscalizador>(this.data);

  // Columnas de la tabla (en el orden visto en la imagen)
  displayedColumns: string[] = [
    'idDeclaracion',
    'fechaDeclaracion',
    'fechaRecepcion',
    'tipoDeclaracion',
    'periodo',
    'numeral',
    'rutDeclarante',
    'nombreDeclarante',
    'servicio',
    'cargo',
    'estado'
  ];

  constructor() {}

  ngOnInit(): void {}

  // Botones: Buscar, Limpiar, Exportar
  buscar() {
    console.log('Buscar con filtros:', {
      fechaDeclaracionDesde: this.fechaDeclaracionDesde.value,
      fechaDeclaracionHasta: this.fechaDeclaracionHasta.value,
      fechaRecepcionDesde: this.fechaRecepcionDesde.value,
      fechaRecepcionHasta: this.fechaRecepcionHasta.value,
      tipoDeclaracion: this.tipoDeclaracion.value,
      estado: this.estado.value,
      runDeclarante: this.runDeclarante.value,
      nombreDeclarante: this.nombreDeclarante.value,
      apellidoPaterno: this.apellidoPaterno.value,
      apellidoMaterno: this.apellidoMaterno.value,
      servicio: this.servicio.value,
      cargo: this.cargo.value,
    });
  }

  limpiar() {
    this.fechaDeclaracionDesde.reset();
    this.fechaDeclaracionHasta.reset();
    this.fechaRecepcionDesde.reset();
    this.fechaRecepcionHasta.reset();
    this.tipoDeclaracion.setValue('');
    this.estado.setValue('');
    this.runDeclarante.reset();
    this.nombreDeclarante.reset();
    this.apellidoPaterno.reset();
    this.apellidoMaterno.reset();
    this.servicio.reset();
    this.cargo.reset();
    console.log('Filtros limpiados');
    this.dataSource.data = [];
  }

  exportar() {
    console.log('Exportar...');
    // Lógica para exportar CSV, XLSX, etc.
  }

  // Botones de descarga (JSON y versión completa)
  descargarVersionCompletaJSON() {
    console.log('Descargar declaración (versión completa JSON)...');
  }
  descargarVersionCompleta() {
    console.log('Descargar declaración (versión completa)...');
  }
}
