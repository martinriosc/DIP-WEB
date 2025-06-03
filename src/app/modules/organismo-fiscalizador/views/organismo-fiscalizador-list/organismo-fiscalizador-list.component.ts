import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

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
  runDeclarante: string;     // Ej.: '15381086-9'
  nombreDeclarante: string;  // Ej.: 'CHRISTIAN ALEJANDRO'
  apellidoPaterno: string;   // Ej.: 'RODRIGUEZ'
  apellidoMaterno: string;   // Ej.: 'SANCHEZ'
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

  // Propiedades para la UI
  showFilters = false;
  isLoading = false;

  // Propiedades para paginación
  totalItems = 0;
  pageSize = 25;

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
      runDeclarante: '15381086-9',
      nombreDeclarante: 'CHRISTIAN ALEJANDRO',
      apellidoPaterno: 'RODRIGUEZ',
      apellidoMaterno: 'SANCHEZ',
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
      runDeclarante: '12123123-2',
      nombreDeclarante: 'CHRISTIAN ALEJANDRO',
      apellidoPaterno: 'MARTINEZ',
      apellidoMaterno: 'LOPEZ',
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
    'runDeclarante',
    'nombreDeclarante',
    'apellidoPaterno',
    'apellidoMaterno',
    'servicio',
    'cargo',
    'estado',
    'acciones'
  ];

  constructor() {
    this.totalItems = this.data.length;
  }

  ngOnInit(): void {}

  // Método para alternar filtros
  toggleFiltros() {
    this.showFilters = !this.showFilters;
  }

  // Método para obtener clases CSS de pills de estado
  getEstadoPillClass(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'FIRMADA':
        return 'pill-success';
      case 'PENDIENTE':
        return 'pill-warning';
      case 'ARCHIVADA':
        return 'pill-secondary';
      case 'RECEPCIONADA':
        return 'pill-primary';
      default:
        return 'pill-default';
    }
  }

  // Método para manejar cambios de página
  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    console.log('Página cambiada:', event);
  }

  // Métodos de acciones
  verDetalle(element: DeclaracionFiscalizador) {
    console.log('Ver detalle de declaración:', element.idDeclaracion);
  }

  descargar(element: DeclaracionFiscalizador) {
    console.log('Descargar declaración:', element.idDeclaracion);
  }

  // Botones: Buscar, Limpiar, Exportar
  buscar() {
    this.isLoading = true;
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

    // Simular llamada async
    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
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
    this.dataSource.data = this.data;
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
