import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { TransparenciaPasivaService, FiltroTransparenciaPasiva, SortParameter } from '../../services/transparencia-pasiva.service';
import { BitacoraService } from '../../services/bitacora.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

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

/**
 * Interfaz para las entradas de bitácora
 */
export interface BitacoraEntry {
  id: number;
  usuario: string;
  fecha: string;
  accion: string;
  perfil: string;
  observaciones: string;
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
  currentPage = 0;

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

  // MatTableDataSource para la tabla
  dataSource = new MatTableDataSource<any>([]);

  // Columnas en el orden que muestra la captura
  displayedColumns: string[] = [
    'idDeclaracion',
    'fechaDeclaracion',
    'fechaRecepcion',
    'tipoDeclaracion',
    'rutDeclarante',
    'nombreDeclarante',
    'servicio',
    'cargo',
    'estado',
    'acciones'
  ];

  // Propiedades para el modal de bitácora
  showBitacoraModal = false;
  bitacoraData: BitacoraEntry[] = [];
  bitacoraLoading = false;
  bitacoraPageSize = 5;
  bitacoraCurrentPage = 0;
  bitacoraTotalItems = 0;
  currentDeclaracionId = 0;

  constructor(
    private transparenciaPasivaService: TransparenciaPasivaService,
    private bitacoraService: BitacoraService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    // Cargar datos iniciales con filtros por defecto
    this.cargarDeclaraciones();
  }

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
    this.currentPage = event.pageIndex;
    this.cargarDeclaraciones();
  }

  /**
   * Carga las declaraciones desde la API
   */
  private cargarDeclaraciones() {
    this.isLoading = true;
    
    const filtro = this.construirFiltro();
    const start = this.currentPage * this.pageSize;
    const sort: SortParameter[] = [{ property: 'recepcion', direction: 'ASC' }];
    
    this.transparenciaPasivaService.listar(filtro, sort, start, this.pageSize)
      .pipe(
        catchError(error => {
          console.error('Error al cargar declaraciones:', error);
          this.mostrarError('Error al cargar las declaraciones');
          return of({ success: false, data: [], total: 0 });
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(response => {
        if (response.success) {
          this.dataSource.data = response.data || [];
          this.totalItems = response.total || 0;
        } else {
          this.mostrarError('No se pudieron cargar las declaraciones');
        }
      });
  }

  /**
   * Construye el objeto de filtro basado en los valores de los controles
   */
  private construirFiltro(): FiltroTransparenciaPasiva {
    return {
      fechaDesdeDeclaracion: this.formatearFecha(this.fechaDeclaracionDesde.value),
      fechaHastaDeclaracion: this.formatearFecha(this.fechaDeclaracionHasta.value),
      fechaDesdeRecepcion: this.formatearFecha(this.fechaRecepcionDesde.value),
      fechaHastaRecepcion: this.formatearFecha(this.fechaRecepcionHasta.value),
      tipoDeclaracionId: this.tipoDeclaracion.value ? parseInt(this.tipoDeclaracion.value) : 1,
      cargo: this.cargo.value || '',
      rutDeclarante: this.rutDeclarante.value || '',
      nombreDeclarante: this.nombreDeclarante.value || '',
      apellidoPaterno: this.apellidoPaterno.value || '',
      apellidoMaterno: this.apellidoMaterno.value || '',
      servicioId: this.servicio.value || '',
      rol: 11 // Valor por defecto según el endpoint
    };
  }

  /**
   * Formatea una fecha para ser enviada a la API
   */
  private formatearFecha(fecha: Date | null): string {
    if (!fecha) return '';
    
    const day = fecha.getDate().toString().padStart(2, '0');
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const year = fecha.getFullYear();
    
    return `${day}/${month}/${year}`;
  }

  /**
   * Muestra un mensaje de error
   */
  private mostrarError(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Muestra un mensaje de éxito
   */
  private mostrarExito(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  // Métodos de acciones
  verDetalle(element: DeclaracionTransparencia) {
    console.log('Ver detalle de declaración:', element.idDeclaracion);
    // Aquí se podría abrir un modal o navegar a una página de detalle
  }

  /**
   * Ver bitácora de una declaración
   */
  verBitacora(element: any) {
    console.log('Ver bitácora de declaración:', element.id);
    
    this.bitacoraLoading = true;
    this.currentDeclaracionId = element.id;
    
    this.bitacoraService.getBitacoraCompleta(element.id)
      .pipe(
        catchError(error => {
          console.error('Error al cargar bitácora:', error);
          this.mostrarError('Error al cargar la bitácora');
          return of({ success: false, data: [] });
        }),
        finalize(() => {
          this.bitacoraLoading = false;
        })
      )
      .subscribe(response => {
        if (response.success) {
          console.log('Bitácora cargada:', response.data);
          this.bitacoraData = response.data;
          this.bitacoraTotalItems = response.data.length;
          this.showBitacoraModal = true;
        }
      });
  }

  // Método para cargar bitácora con paginación
  cargarBitacora() {
    this.bitacoraLoading = true;
    const startIndex = this.bitacoraCurrentPage * this.bitacoraPageSize;
    
    this.bitacoraService.getBitacoraConOpciones(this.currentDeclaracionId, {
      start: startIndex,
      limit: this.bitacoraPageSize,
      sort: [{ property: 'fecha', direction: 'ASC' }]
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.bitacoraData = response.data || [];
          this.bitacoraTotalItems = response.total || 0;
        } else {
          this.bitacoraData = [];
          this.bitacoraTotalItems = 0;
          this.mostrarError('Error al cargar la bitácora');
        }
        this.bitacoraLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener bitácora:', error);
        this.bitacoraData = [];
        this.bitacoraTotalItems = 0;
        this.bitacoraLoading = false;
        this.mostrarError('Error al cargar la bitácora');
      }
    });
  }

  // Método para cerrar modal de bitácora
  cerrarBitacoraModal() {
    this.showBitacoraModal = false;
    this.bitacoraData = [];
    this.currentDeclaracionId = 0;
  }

  // Método para cambiar página de bitácora
  onBitacoraPageChange(event: PageEvent) {
    this.bitacoraPageSize = event.pageSize;
    this.bitacoraCurrentPage = event.pageIndex;
    this.cargarBitacora();
  }

  // Método para obtener clases CSS de pills de acción en bitácora
  getAccionPillClass(accion: string): string {
    switch (accion?.toUpperCase()) {
      case 'BORRADOR':
        return 'pill-info';
      case 'ENVIA A JEFE DE SERVICIO':
        return 'pill-warning';
      case 'FIRMA':
        return 'pill-success';
      case 'ENVIA A ORGANISMO FISCALIZADOR':
      case 'RECEPCIONA ORGANISMO FISCALIZADOR':
        return 'pill-primary';
      default:
        return 'pill-default';
    }
  }

  descargar(element: any) {
    console.log('Descargar declaración:', element.id);
    // Implementar lógica de descarga
  }

  // Botones
  buscar() {
    this.currentPage = 0; // Resetear a la primera página
    this.cargarDeclaraciones();
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
    
    // Recargar con filtros limpiados
    this.currentPage = 0;
    this.cargarDeclaraciones();
    
    this.mostrarExito('Filtros limpiados');
  }

  exportar() {
    console.log('Exportar...');
    // Implementar lógica para exportar CSV, XLSX, etc.
    // Se podría usar el mismo servicio con parámetros diferentes
  }

  descargarVersionPublica() {
    console.log('Descargar declaración (versión pública)...');
    // Implementar lógica de descarga de versión pública
  }
}
