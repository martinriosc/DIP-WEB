import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import {
  DeclaracionService,
  TipoDeclaracion,
  Servicio,
  EstadoDeclaracion
} from '../../../declaraciones/services/declaracion.service';
import { Declaracion } from '../../../../shared/models/AllModels';
import { AuthService } from '../../../auth/services/auth.service';
import { HttpParams } from '@angular/common/http';
import { forkJoin } from 'rxjs';

/* ─────────────── Tabs ─────────────── */
type TabId = 'pendientes' | 'enviados';

@Component({
  selector: 'app-revisor-list',
  templateUrl: './revisor-list.component.html',
  styleUrls: ['./revisor-list.component.scss']
})
export class RevisorListComponent implements AfterViewInit, OnInit {
  /* ══════════════ Estado general ══════════════ */
  showFilters = false;
  isLoading   = false;

  /* ══════════════ Contadores ══════════════════ */
  totalPendientes = 0;
  totalEnviados   = 0;

  tabs = [
    { id: 'pendientes' as TabId, label: 'Pendientes', count: () => this.totalPendientes == 0 ? '' : this.totalPendientes },
    { id: 'enviados'   as TabId, label: 'Enviados',   count: () => this.totalEnviados == 0 ? '' : this.totalEnviados }
  ];
  currentTab: TabId = 'pendientes';

  /* ══════════════ Filtros ═════════════════════ */
  enviadoPor       = new FormControl('');
  fechaDeclaracion = new FormControl<Date | null>(null);
  tipo             = new FormControl('');
  run              = new FormControl('');
  declarante       = new FormControl('');
  servicio         = new FormControl('');
  cargo            = new FormControl('');
  estado           = new FormControl('');

  tiposDeclaracion: TipoDeclaracion[] = [];
  servicios: Servicio[]               = [];
  estadosDeclaracion: EstadoDeclaracion[] = [];

  /* ══════════════ Tabla / selección ═══════════ */
  dataSource       = new MatTableDataSource<Declaracion>([]);
  displayedColumns = [
    'select',
    'id',
    'fechaDeclaracion',
    'tipoDeclaracion',
    'numeral',
    'rut',
    'declarante',
    'servicio',
    'cargo',
    'estado',
    'enviadoPor',
    'acciones'
  ];
  selection = new SelectionModel<Declaracion>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private declaracionService: DeclaracionService,
    private authService: AuthService
  ) {}

  /* ══════════════ LIFE-CYCLE ══════════════════ */
  ngOnInit(): void {
    this.cargarDatosIniciales();
    this.buscar();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.configurarPaginador();
  }

  private configurarPaginador(): void {
    this.paginator._intl.itemsPerPageLabel   = 'Elementos por página';
    this.paginator._intl.nextPageLabel       = 'Siguiente página';
    this.paginator._intl.previousPageLabel   = 'Página anterior';
    this.paginator._intl.firstPageLabel      = 'Primera página';
    this.paginator._intl.lastPageLabel       = 'Última página';
  }

  /* ══════════════ CARGA INICIAL ═══════════════ */
  private cargarDatosIniciales(): void {
    /* combos */
    this.declaracionService.obtenerTiposDeclaracion()
      .subscribe(t => (this.tiposDeclaracion = t));

    const usuario = this.authService.currentUser;
    if (usuario) {
      this.declaracionService.obtenerServicios(usuario.rut, 2)
        .subscribe(r => (this.servicios = r.data));
    }

    this.cargarEstadosDeclaracion();
    this.cargarTotales();
  }

  private cargarEstadosDeclaracion(): void {
    const bandeja = this.currentTab === 'pendientes' ? 1 : 2;
    this.declaracionService.obtenerEstadosDeclaracion(bandeja, 2)
      .subscribe(e => (this.estadosDeclaracion = e));
  }

  private cargarTotales(): void {
    this.isLoading = true;
    forkJoin({
      pendientes: this.declaracionService.obtenerTotalDeclaraciones({ tipobandeja: 1, rol: 2 }),
      enviados  : this.declaracionService.obtenerTotalDeclaraciones({ tipobandeja: 2, rol: 2 })
    }).subscribe({
      next: res => {
        this.totalPendientes = res.pendientes.data ?? 0;
        this.totalEnviados   = res.enviados.data   ?? 0;
        this.isLoading = false;
      },
      error: err => { console.error(err); this.isLoading = false; }
    });
  }

  /* ══════════════ ACCIONES DE TABS ═════════════ */
  setTab(tab: TabId): void {
    if (this.currentTab === tab) return;
    this.currentTab = tab;
    this.selection.clear();
    this.cargarEstadosDeclaracion();
    this.limpiar();
    this.buscar();
  }

  /* ══════════════ FILTROS ══════════════════════ */
  toggleFiltros(): void { this.showFilters = !this.showFilters; }

  buscar(): void {
    this.isLoading = true;
    const filtro = {
      remitente           : this.enviadoPor.value ?? '',
      fechaRecepcion      : '',
      fechaFirmaDeclarante: '',
      tipoId              : this.tipo.value ?? '',
      rut                 : this.run.value ?? '',
      declarante          : this.declarante.value ?? '',
      servicioId          : this.servicio.value ?? '',
      cargo               : this.cargo.value ?? '',
      estadoId            : +this.estado.value! || 0,
      rol                 : 2,
      tipobandeja         : this.currentTab === 'pendientes' ? 1 : 2
    };

    const params = new HttpParams()
      .set('filtro', JSON.stringify(filtro))
      .set('page', '1')
      .set('start', '0')
      .set('limit', '100')
      .set('sort', JSON.stringify([{ property: 'id', direction: 'DESC' }]));

    forkJoin({
      declaraciones: this.declaracionService.obtenerDeclaraciones(params),
      total        : this.declaracionService.obtenerTotalDeclaraciones(filtro)
    }).subscribe({
      next: res => {
        if (res.declaraciones.success) this.dataSource.data = res.declaraciones.data;
        if (res.total.success) {
          if (this.currentTab === 'pendientes') {
            this.totalPendientes = res.total.data;
          } else {
            this.totalEnviados   = res.total.data;
          }
          this.paginator.length = res.total.data;
        }
        this.isLoading = false;
      },
      error: err => { console.error(err); this.isLoading = false; }
    });
  }

  limpiar(): void {
    this.enviadoPor.reset();
    this.fechaDeclaracion.reset();
    this.tipo.reset();
    this.run.reset();
    this.declarante.reset();
    this.servicio.reset();
    this.cargo.reset();
    this.estado.reset();
    this.selection.clear();
  }

  /* ══════════════ SELECCIÓN ════════════════════ */
  isAllSelected(): boolean {
    return this.selection.selected.length === this.dataSource.data.length;
  }
  isSomeSelected(): boolean {
    return this.selection.selected.length > 0 && !this.isAllSelected();
  }
  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(r => this.selection.select(r));
  }
  toggle(row: Declaracion): void { this.selection.toggle(row); }

  /* ══════════════ ACCIONES SOBRE FILAS ═════════ */
  bitacora(d: Declaracion)  { /* … */ }
  derivar(d: Declaracion)   { /* … */ }
  enviarAJefeServicio(d: Declaracion) { /* … */ }
  export(): void { /* … */ }

  descargarSeleccionados(): void {
    this.selection.selected.forEach(d =>
      this.declaracionService.descargarDeclaracion(d.id).subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const a   = document.createElement('a');
        a.href = url; a.download = `declaracion_${d.id}.pdf`; a.click();
        window.URL.revokeObjectURL(url);
      })
    );
  }

  /* ══════════════ PILLS DE ESTADO ══════════════ */
  getEstadoPillClass(estado: string): string {
    switch ((estado || '').toLowerCase()) {
      case 'activo':
      case 'aprobado':
      case 'completado':  return 'pill pill-success';
      case 'inactivo':
      case 'rechazado':
      case 'cancelado':   return 'pill pill-danger';
      case 'pendiente':
      case 'en revisión': return 'pill pill-warning';
      case 'enviado':
      case 'derivado':    return 'pill pill-info';
      default:            return 'pill pill-secondary';
    }
  }
}
