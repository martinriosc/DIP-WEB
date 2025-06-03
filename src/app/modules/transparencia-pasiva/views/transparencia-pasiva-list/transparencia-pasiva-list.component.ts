import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';

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
  nombreDeclarante: string;  // Ej: 'CHRISTIAN ALEJANDRO'
  apellidoPaterno: string;   // Ej: 'SALINAS'
  apellidoMaterno: string;   // Ej: 'RODRIGUEZ'
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

  // Propiedades para la UI
  showFilters = false;
  isLoading = false;

  // Propiedades para paginación
  totalItems = 0;
  pageSize = 25;

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
   * Lista de declaraciones de ejemplo.
   */
  data: DeclaracionTransparencia[] = [
    {
      idDeclaracion: 54321,
      fechaDeclaracion: '15/04/2025 10:30:00',
      fechaRecepcion: '15/04/2025 16:45:00',
      tipoDeclaracion: 'PRIMERA DECLARACIÓN',
      numeral: 15,
      rutDeclarante: '12345678-9',
      nombreDeclarante: 'MARIA JOSE',
      apellidoPaterno: 'GONZALEZ',
      apellidoMaterno: 'MARTINEZ',
      servicio: 'CONTRALORIA GENERAL DE LA REPUBLICA',
      cargo: 'ANALISTA',
      estado: 'FIRMADA'
    },
    {
      idDeclaracion: 54322,
      fechaDeclaracion: '16/04/2025 11:15:00',
      fechaRecepcion: '16/04/2025 17:20:00',
      tipoDeclaracion: 'ACTUALIZACION PERIÓDICA',
      numeral: 16,
      rutDeclarante: '98765432-1',
      nombreDeclarante: 'PEDRO ANTONIO',
      apellidoPaterno: 'LOPEZ',
      apellidoMaterno: 'SILVA',
      servicio: 'CONTRALORIA GENERAL DE LA REPUBLICA',
      cargo: 'PROFESIONAL',
      estado: 'PENDIENTE'
    }
  ];

  // MatTableDataSource para la tabla
  dataSource = new MatTableDataSource<DeclaracionTransparencia>(this.data);

  // Columnas en el orden que muestra la captura
  displayedColumns: string[] = [
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
  verDetalle(element: DeclaracionTransparencia) {
    console.log('Ver detalle de declaración:', element.idDeclaracion);
  }

  descargar(element: DeclaracionTransparencia) {
    console.log('Descargar declaración:', element.idDeclaracion);
  }

  // Botones
  buscar() {
    this.isLoading = true;
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
    this.cargo.setValue('');
    this.rutDeclarante.reset();
    this.nombreDeclarante.reset();
    this.apellidoPaterno.reset();
    this.apellidoMaterno.reset();
    this.servicio.reset();
    this.dataSource.data = this.data;
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
