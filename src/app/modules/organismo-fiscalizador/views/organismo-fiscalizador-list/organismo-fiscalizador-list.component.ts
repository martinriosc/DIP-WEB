import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

import { BandejaUAdip } from '../../../../shared/models/AllModels';
import { OrganismoFiscalizadorService, FiltroOrganismoFiscalizador, BitacoraEntry } from '../../services/organismo-fiscalizador.service';
import { ApiResponse } from '../../../auth/models/ApiResponse';

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
  currentPage = 0;

  // Filtros
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

  // DataSource para la tabla
  dataSource = new MatTableDataSource<BandejaUAdip>([]);

  // Columnas de la tabla
  displayedColumns: string[] = [
    'id',
    'fechaDeclaracion',
    'fechaRecepcion',
    'declaTipo',
    'rutDeclarante',
    'nombreDeclarante',
    'servicio',
    'cargo',
    'declaEstado',
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

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private organismoFiscalizadorService: OrganismoFiscalizadorService,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarDeclaraciones();
  }

  // Método para alternar filtros
  toggleFiltros() {
    this.showFilters = !this.showFilters;
  }

  // Método para construir filtros desde el formulario
  private construirFiltros(): FiltroOrganismoFiscalizador {
    return this.organismoFiscalizadorService.construirFiltroDefecto({
      fechaDesdeDeclaracion: this.fechaDeclaracionDesde.value ? this.formatearFechaParaAPI(this.fechaDeclaracionDesde.value) : '',
      fechaHastaDeclaracion: this.fechaDeclaracionHasta.value ? this.formatearFechaParaAPI(this.fechaDeclaracionHasta.value) : '',
      fechaDesdeRecepcion: this.fechaRecepcionDesde.value ? this.formatearFechaParaAPI(this.fechaRecepcionDesde.value) : '',
      fechaHastaRecepcion: this.fechaRecepcionHasta.value ? this.formatearFechaParaAPI(this.fechaRecepcionHasta.value) : '',
      tipoDeclaracionId: this.tipoDeclaracion.value || '',
      estadoId: this.estado.value || '',
      rutDeclarante: this.runDeclarante.value || '',
      nombreDeclarante: this.nombreDeclarante.value || '',
      apellidoPaterno: this.apellidoPaterno.value || '',
      apellidoMaterno: this.apellidoMaterno.value || '',
      cargo: this.cargo.value || ''
    });
  }

  // Método para formatear fecha para la API (DD/MM/YYYY)
  private formatearFechaParaAPI(fecha: Date): string {
    if (!fecha) return '';
    const day = fecha.getDate().toString().padStart(2, '0');
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const year = fecha.getFullYear();
    return `${day}/${month}/${year}`;
  }

  // Método principal para cargar declaraciones
  cargarDeclaraciones() {
    this.isLoading = true;
    const filtros = this.construirFiltros();
    const ordenamiento = [{ property: 'recepcion', direction: 'ASC' }];
    const start = this.currentPage * this.pageSize;

    this.organismoFiscalizadorService.listarDeclaraciones(
      filtros,
      ordenamiento,
      this.currentPage + 1,
      start,
      this.pageSize
    ).subscribe({
      next: (response: ApiResponse<BandejaUAdip[]>) => {
        if (response.success) {
          this.dataSource.data = response.data || [];
          this.totalItems = response.total || 0;
        } else {
          this.toastr.error('Error al cargar las declaraciones');
          this.dataSource.data = [];
          this.totalItems = 0;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar declaraciones:', error);
        this.toastr.error('Error al conectar con el servidor');
        this.dataSource.data = [];
        this.totalItems = 0;
        this.isLoading = false;
      }
    });
  }

  // Método para obtener clases CSS de pills de estado
  getEstadoPillClass(estado: string): string {
    switch (estado?.toUpperCase()) {
      case 'FIRMADA':
        return 'pill-success';
      case 'PENDIENTE FIRMAR':
      case 'PENDIENTE REVISOR':
        return 'pill-warning';
      case 'ARCHIVADA':
        return 'pill-secondary';
      case 'RECEPCIONADA POR ORGANISMO FISCALIZADOR':
        return 'pill-primary';
      case 'BORRADOR':
        return 'pill-info';
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

  // Método para ver detalle de declaración
  verDetalle(element: BandejaUAdip) {
    console.log('Ver detalle de declaración:', element.id);
    // Aquí se puede implementar la navegación al detalle
  }

  // Método para descargar declaración
  descargar(element: BandejaUAdip) {
    console.log('Descargar declaración:', element.code);
    // Implementar descarga usando el code de la declaración
  }

  // Método para ver bitácora
  verBitacora(element: BandejaUAdip) {
    this.currentDeclaracionId = element.id;
    this.bitacoraCurrentPage = 0;
    this.cargarBitacora();
    this.showBitacoraModal = true;
  }

  // Método para cargar bitácora
  cargarBitacora() {
    this.bitacoraLoading = true;
    const startIndex = this.bitacoraCurrentPage * this.bitacoraPageSize;
    
    this.organismoFiscalizadorService.obtenerBitacora(
      this.currentDeclaracionId,
      this.bitacoraCurrentPage + 1,
      startIndex,
      this.bitacoraPageSize
    ).subscribe({
      next: (response: ApiResponse<BitacoraEntry[]>) => {
        if (response.success) {
          this.bitacoraData = response.data || [];
          this.bitacoraTotalItems = response.total || 0;
        } else {
          this.bitacoraData = [];
          this.bitacoraTotalItems = 0;
          this.toastr.error('Error al cargar la bitácora');
        }
        this.bitacoraLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener bitácora:', error);
        this.bitacoraData = [];
        this.bitacoraTotalItems = 0;
        this.bitacoraLoading = false;
        this.toastr.error('Error al cargar la bitácora');
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

  // Método para buscar con filtros
  buscar() {
    this.currentPage = 0;
    this.cargarDeclaraciones();
  }

  // Método para limpiar filtros
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
    this.currentPage = 0;
    this.cargarDeclaraciones();
  }

  // Método para exportar (placeholder)
  exportar() {
    console.log('Exportar...');
    this.toastr.info('Funcionalidad de exportación en desarrollo');
  }

  // Métodos para descarga de versiones completas (placeholders)
  descargarVersionCompletaJSON() {
    console.log('Descargar declaración (versión completa JSON)...');
    this.toastr.info('Funcionalidad en desarrollo');
  }
  
  descargarVersionCompleta() {
    console.log('Descargar declaración (versión completa)...');
    this.toastr.info('Funcionalidad en desarrollo');
  }
}
