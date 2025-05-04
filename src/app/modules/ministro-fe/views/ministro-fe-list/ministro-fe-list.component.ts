import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

/**
 * Interfaz que representa cada “Declaración” que mostrará
 * el Ministro de Fe en sus diferentes bandejas (Pendientes, Enviadas, Archivadas).
 */
export interface DeclaracionMinistroFe {
  idDeclaracion: number;
  fechaDeclaracion: string;   // Ej.: '08/04/2024 12:14:11'
  tipoDeclaracion: string;    // Ej.: 'PRIMERA DECLARACIÓN', 'ACTUALIZACION PERIÓDICA'
  numeral: number | string;
  rut: string;                // Ej.: '15381086-9'
  declarante: string;         // Nombre del declarante
  servicio: string;           // Servicio o institución
  cargo: string;              // Cargo del declarante
  estado: string;             // Ej.: 'PENDIENTE FIRMAR'
  enviadoPor: string;         // Quién envió la declaración
}

@Component({
  selector: 'app-ministro-fe-list',
  templateUrl: './ministro-fe-list.component.html',
  styleUrls: ['./ministro-fe-list.component.scss']
})
export class MinistroFeListComponent implements OnInit {

  /**
   * Para controlar cuál de las 3 pestañas está activa:
   *  - 'pendientes'
   *  - 'enviadas'
   *  - 'archivadas'
   */
  currentTab: 'pendientes' | 'firma-envio-masivo' | 'enviadas' | 'archivo-masivo' | 'archivadas' = 'pendientes';

  // Conteo que se muestra en las pestañas
  pendientesCount = 14;
  firmaEnvioCount = 5;
  enviadasCount = 35;
  archivoMasivoCount = 10;
  archivadasCount = 10;

  // Filtros (FormControls para usar en la plantilla)
  enviadoPor = new FormControl('');
  fechaDeclaracion = new FormControl();
  tipoDeclaracion = new FormControl('');
  run = new FormControl('');
  declarante = new FormControl('');
  servicio = new FormControl('');
  cargo = new FormControl('');
  estado = new FormControl('');

  // Datos de ejemplo para cada pestaña (ajusta según tu backend)
  dataPendientes: DeclaracionMinistroFe[] = [
    {
      idDeclaracion: 1222004,
      fechaDeclaracion: '08/04/2024 12:14:11',
      tipoDeclaracion: 'ACTUALIZACION PERIÓDICA',
      numeral: 22,
      rut: '15381086-9',
      declarante: 'CHRISTIAN ALEJANDRO SALAS',
      servicio: 'CONTRALORÍA GENERAL - TESTING CGR',
      cargo: 'JEFE DE UNIDAD',
      estado: 'PENDIENTE FIRMAR',
      enviadoPor: 'DECLARANTE',
    },
    {
      idDeclaracion: 1221789,
      fechaDeclaracion: '08/04/2024 10:03:25',
      tipoDeclaracion: 'PRIMERA DECLARACIÓN',
      numeral: 22,
      rut: '15381086-9',
      declarante: 'CHRISTIAN ALEJANDRO SALAS',
      servicio: 'CONTRALORÍA GENERAL - TESTING CGR',
      cargo: 'JEFE DE UNIDAD',
      estado: 'PENDIENTE FIRMAR',
      enviadoPor: 'DECLARANTE',
    },
  ];

  dataEnviadas: DeclaracionMinistroFe[] = [
    {
      idDeclaracion: 1319557,
      fechaDeclaracion: '06/02/2025 13:42:31',
      tipoDeclaracion: 'ACTUALIZACION PERIÓDICA (MARZO)',
      numeral: 19,
      rut: '15381086-9',
      declarante: 'CHRISTIAN ALEJANDRO SALAS',
      servicio: 'CONTRALORÍA GENERAL - TESTING CGR',
      cargo: 'JEFE DE UNIDAD',
      estado: 'RECEPCIONADA POR DIP',
      enviadoPor: 'DECLARANTE',
    },
    {
      idDeclaracion: 1319558,
      fechaDeclaracion: '07/02/2025 09:15:10',
      tipoDeclaracion: 'PRIMERA DECLARACIÓN',
      numeral: 22,
      rut: '15400000-0',
      declarante: 'MARÍA FERNANDA PÉREZ',
      servicio: 'CONTRALORÍA GENERAL',
      cargo: 'ANALISTA',
      estado: 'RECEPCIONADA POR DIP',
      enviadoPor: 'DECLARANTE',
    },
  ];

  dataArchivadas: DeclaracionMinistroFe[] = [
    {
      idDeclaracion: 1319525,
      fechaDeclaracion: '06/02/2025 11:50:39',
      tipoDeclaracion: 'ACTUALIZACION VOLUNTARIA',
      numeral: 14,
      rut: '15381086-9',
      declarante: 'CHRISTIAN ALEJANDRO SALAS',
      servicio: 'CONTRALORÍA GENERAL - TESTING CGR',
      cargo: 'JEFE DE UNIDAD',
      estado: 'ARCHIVADA',
      enviadoPor: 'DECLARANTE',
    },
  ];

  // DataSources para las tablas (1 por pestaña)
  dataSourcePendientes = new MatTableDataSource<DeclaracionMinistroFe>(this.dataPendientes);
  dataSourceEnviadas   = new MatTableDataSource<DeclaracionMinistroFe>(this.dataEnviadas);
  dataSourceArchivadas = new MatTableDataSource<DeclaracionMinistroFe>(this.dataArchivadas);

  // Columnas de la tabla
  displayedColumns: string[] = [
    'select',
    'idDeclaracion',
    'fechaDeclaracion',
    'tipoDeclaracion',
    'numeral',
    'rut',
    'declarante',
    'servicio',
    'cargo',
    'estado',
    'enviadoPor',
  ];

  // Selección múltiple por pestaña
  selectionPendientes = new SelectionModel<DeclaracionMinistroFe>(true, []);
  selectionEnviadas   = new SelectionModel<DeclaracionMinistroFe>(true, []);
  selectionArchivadas = new SelectionModel<DeclaracionMinistroFe>(true, []);

  constructor() {}

  ngOnInit(): void {}

  // Cambia la pestaña actual
  setTab(tab: 'pendientes' | 'firma-envio-masivo' | 'enviadas' | 'archivo-masivo' | 'archivadas'): void {
    this.currentTab = tab;
  }

  // ---------- Pestaña Pendientes ----------
  masterTogglePendientes() {
    const ds = this.dataSourcePendientes.data;
    this.isAllSelectedPendientes()
      ? this.selectionPendientes.clear()
      : ds.forEach(row => this.selectionPendientes.select(row));
  }
  isAllSelectedPendientes() {
    const numSelected = this.selectionPendientes.selected.length;
    const numRows = this.dataSourcePendientes.data.length;
    return numSelected === numRows;
  }
  isSomeSelectedPendientes() {
    return (
      this.selectionPendientes.selected.length > 0 &&
      !this.isAllSelectedPendientes()
    );
  }
  togglePendientes(row: DeclaracionMinistroFe) {
    this.selectionPendientes.toggle(row);
  }

  // ---------- Pestaña Enviadas ----------
  masterToggleEnviadas() {
    const ds = this.dataSourceEnviadas.data;
    this.isAllSelectedEnviadas()
      ? this.selectionEnviadas.clear()
      : ds.forEach(row => this.selectionEnviadas.select(row));
  }
  isAllSelectedEnviadas() {
    const numSelected = this.selectionEnviadas.selected.length;
    const numRows = this.dataSourceEnviadas.data.length;
    return numSelected === numRows;
  }
  isSomeSelectedEnviadas() {
    return (
      this.selectionEnviadas.selected.length > 0 &&
      !this.isAllSelectedEnviadas()
    );
  }
  toggleEnviadas(row: DeclaracionMinistroFe) {
    this.selectionEnviadas.toggle(row);
  }

  // ---------- Pestaña Archivadas ----------
  masterToggleArchivadas() {
    const ds = this.dataSourceArchivadas.data;
    this.isAllSelectedArchivadas()
      ? this.selectionArchivadas.clear()
      : ds.forEach(row => this.selectionArchivadas.select(row));
  }
  isAllSelectedArchivadas() {
    const numSelected = this.selectionArchivadas.selected.length;
    const numRows = this.dataSourceArchivadas.data.length;
    return numSelected === numRows;
  }
  isSomeSelectedArchivadas() {
    return (
      this.selectionArchivadas.selected.length > 0 &&
      !this.isAllSelectedArchivadas()
    );
  }
  toggleArchivadas(row: DeclaracionMinistroFe) {
    this.selectionArchivadas.toggle(row);
  }

  // ---------- Acciones principales ----------
  onDerivar() {
    console.log('Derivar declaraciones seleccionadas en la pestaña:', this.currentTab);
  }
  onFirmar() {
    console.log('Firmar declaraciones seleccionadas en la pestaña:', this.currentTab);
  }
  onEnviarOrganismo() {
    console.log('Enviar a Organismo Fiscalizador desde pestaña:', this.currentTab);
  }

  // ---------- Filtros ----------
  buscar() {
    // Aquí harías la lógica real de filtrado:
    console.log('Buscar con filtros:', {
      enviadoPor: this.enviadoPor.value,
      fechaDeclaracion: this.fechaDeclaracion.value,
      tipoDeclaracion: this.tipoDeclaracion.value,
      run: this.run.value,
      declarante: this.declarante.value,
      servicio: this.servicio.value,
      cargo: this.cargo.value,
      estado: this.estado.value,
    });
  }
  limpiar() {
    this.enviadoPor.reset();
    this.fechaDeclaracion.reset();
    this.tipoDeclaracion.reset();
    this.run.reset();
    this.declarante.reset();
    this.servicio.reset();
    this.cargo.reset();
    this.estado.reset();
    // Limpia selecciones
    this.selectionPendientes.clear();
    this.selectionEnviadas.clear();
    this.selectionArchivadas.clear();
  }
  exportar() {
    console.log('Exportar declaraciones (CSV/Excel/etc.)...');
  }

  // Descargar declaración (versión completa)
  descargarVersionCompleta() {
    console.log('Descargar declaración (versión completa) de la pestaña:', this.currentTab);
  }
}
