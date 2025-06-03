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
import { VisadorService } from '../../services/visador.service';
import { Declaracion } from '../../../../shared/models/AllModels';
import { AuthService } from '../../../auth/services/auth.service';
import { HttpParams } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

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

  /* ══════════════ Propiedades para el modal de bitácora ══════════════ */
  showBitacoraModal = false;
  bitacoraData: any[] = [];
  bitacoraLoading = false;
  bitacoraPageSize = 5;
  bitacoraCurrentPage = 0;
  bitacoraTotalItems = 0;
  currentDeclaracionId = 0;

  /* ══════════════ Propiedades para el modal de derivar ══════════════ */
  showDerivarModal = false;
  derivarLoading = false;
  visadores: any[] = [];
  visadorSeleccionado: any = null;
  observacionDerivar = '';
  currentDeclaracionToDerivar: Declaracion | null = null;

  /* ══════════════ Estado de loading para acciones ══════════════ */
  enviarJefeServicioLoading = false;
  currentDeclaracionEnviando: number | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private declaracionService: DeclaracionService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private visadorService: VisadorService,
    private dialog: MatDialog
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
  bitacora(d: Declaracion) {
    this.currentDeclaracionId = Number(d.id);
    this.bitacoraCurrentPage = 0;
    this.ajustarModalParaSidebar();
    this.cargarBitacora();
    this.showBitacoraModal = true;
  }

  cargarBitacora() {
    this.bitacoraLoading = true;
    const startIndex = this.bitacoraCurrentPage * this.bitacoraPageSize;
    
    this.declaracionService.obtenerBitacora(this.currentDeclaracionId, startIndex + 1, this.bitacoraPageSize)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.bitacoraData = response.data || [];
            this.bitacoraTotalItems = response.total || this.bitacoraData.length;
          } else {
            this.bitacoraData = [];
            this.bitacoraTotalItems = 0;
          }
          this.bitacoraLoading = false;
        },
        error: (error) => {
          console.error('Error al obtener bitácora:', error);
          this.bitacoraData = [];
          this.bitacoraTotalItems = 0;
          this.bitacoraLoading = false;
          this.toastrService.error('Error al cargar la bitácora');
        }
      });
  }

  cerrarBitacoraModal() {
    this.showBitacoraModal = false;
    this.bitacoraData = [];
    this.currentDeclaracionId = 0;
  }

  onBitacoraPaginaChange(event: any) {
    this.bitacoraCurrentPage = event.pageIndex;
    this.bitacoraPageSize = event.pageSize;
    this.cargarBitacora();
  }

  getAccionPillClass(accion: string): string {
    switch (accion.toUpperCase()) {
      case 'BORRADOR':
        return 'pill pill-success';
      case 'ENVÍA A MINISTRO DE FE':
      case 'PENDIENTE FIRMAR':
        return 'pill pill-primary';
      case 'FIRMA':
      case 'FIRMADA':
        return 'pill pill-primary';
      case 'ENVIA A ORGANISMO FISCALIZADOR':
      case 'RECEPCIONA ORGANISMO FISCALIZADOR':
        return 'pill pill-secondary';
      case 'ARCHIVADA':
        return 'pill pill-default';
      default:
        return 'pill pill-default';
    }
  }

  private ajustarModalParaSidebar() {
    // Método para ajustar el modal si hay una sidebar activa
    // Puedes implementar lógica específica aquí si es necesario
  }

  derivar(d: Declaracion) { 
    // Verificar que la declaración esté en estado PENDIENTE REVISOR
    if (d.declaEstado !== 'PENDIENTE REVISOR') {
      this.toastrService.warning('Solo se pueden derivar declaraciones con estado PENDIENTE REVISOR');
      return;
    }

    this.currentDeclaracionToDerivar = d;
    this.cargarVisadores(d.id);
    this.showDerivarModal = true;
  }

  enviarAJefeServicio(d: Declaracion) { 
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea enviar esta declaración al Jefe de Servicio?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Opción 1: Usar SweetAlert con loading (más elegante)
        Swal.fire({
          title: 'Enviando...',
          text: 'Enviando declaración al Jefe de Servicio',
          icon: 'info',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Opción 2: Usar overlay global (comentado, pero disponible)
        // this.enviarJefeServicioLoading = true;

        this.currentDeclaracionEnviando = Number(d.id);
        this.declaracionService.enviarJefeServicio(Number(d.id), 2).subscribe({
          next: (response) => {
            Swal.close();
            if (response === true) {
              Swal.fire({
                title: '¡Éxito!',
                text: 'Declaración enviada al Jefe de Servicio exitosamente',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              });
              this.buscar(); // Actualizar la lista
            } else {
              Swal.fire({
                title: 'Error',
                text: 'Error al enviar la declaración al Jefe de Servicio',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
            }
          },
          error: (error) => {
            console.error('Error al enviar declaración al Jefe de Servicio:', error);
            Swal.close();
            Swal.fire({
              title: 'Error',
              text: 'Error al enviar la declaración al Jefe de Servicio',
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          },
          complete: () => {
            this.currentDeclaracionEnviando = null;
            // this.enviarJefeServicioLoading = false; // Para overlay global
          }
        });
      }
    });
  }

  /* ══════════════ FUNCIONES DEL MODAL DE DERIVAR ══════════════ */
  cargarVisadores(idDeclaracion: number) {
    this.derivarLoading = true;
    this.visadorService.getVisadorByDeclaraciones(idDeclaracion.toString()).subscribe({
      next: (response) => {
        if (response.success) {
          this.visadores = response.data || [];
        } else {
          this.visadores = [];
          this.toastrService.error('Error al cargar los visadores');
        }
        this.derivarLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar visadores:', error);
        this.visadores = [];
        this.derivarLoading = false;
        this.toastrService.error('Error al cargar los visadores');
      }
    });
  }

  /* ══════════════ FUNCIÓN ALTERNATIVA CON OVERLAY GLOBAL ══════════════ */
  enviarAJefeServicioConOverlay(d: Declaracion) {
    Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea enviar esta declaración al Jefe de Servicio?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Usar overlay global en lugar de SweetAlert loading
        this.enviarJefeServicioLoading = true;
        this.currentDeclaracionEnviando = Number(d.id);
        
        this.declaracionService.enviarJefeServicio(Number(d.id), 2).subscribe({
          next: (response) => {
            if (response === true) {
              this.toastrService.success('Declaración enviada al Jefe de Servicio exitosamente');
              this.buscar(); // Actualizar la lista
            } else {
              this.toastrService.error('Error al enviar la declaración al Jefe de Servicio');
            }
          },
          error: (error) => {
            console.error('Error al enviar declaración al Jefe de Servicio:', error);
            this.toastrService.error('Error al enviar la declaración al Jefe de Servicio');
          },
          complete: () => {
            this.currentDeclaracionEnviando = null;
            this.enviarJefeServicioLoading = false;
          }
        });
      }
    });
  }

  confirmarDerivar() {
    if (!this.visadorSeleccionado) {
      this.toastrService.warning('Debe seleccionar un visador');
      return;
    }

    if (!this.observacionDerivar.trim()) {
      this.toastrService.warning('Debe ingresar una observación');
      return;
    }

    if (!this.currentDeclaracionToDerivar) {
      return;
    }

    this.derivarLoading = true;

    this.declaracionService.enviarVisador(
      Number(this.currentDeclaracionToDerivar.id),
      this.visadorSeleccionado.id,
      this.observacionDerivar.trim(),
      2
    ).subscribe({
      next: (response) => {
        if (response === true) {
          this.toastrService.success('Declaración derivada exitosamente');
          this.cerrarDerivarModal();
          this.buscar(); // Actualizar la lista
        } else {
          this.toastrService.error('Error al derivar la declaración');
        }
      },
      error: (error) => {
        console.error('Error al derivar declaración:', error);
        this.toastrService.error('Error al derivar la declaración');
      },
      complete: () => {
        this.derivarLoading = false;
      }
    });
  }

  cerrarDerivarModal() {
    this.showDerivarModal = false;
    this.visadores = [];
    this.visadorSeleccionado = null;
    this.observacionDerivar = '';
    this.currentDeclaracionToDerivar = null;
    this.derivarLoading = false;
  }

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
    switch (estado) {
      case 'BORRADOR':
        return 'pill pill-success';
      case 'PENDIENTE FIRMAR':
      case 'FIRMADA':
      case 'PENDIENTE REVISOR':
        return 'pill pill-primary';
      case 'ENVIADA A ORGANISMO FISCALIZADOR':
      case 'RECEPCIONADA POR ORGANISMO FISCALIZADOR':
        return 'pill pill-secondary';
      case 'ARCHIVADA':
        return 'pill pill-default';
      default:
        return 'pill pill-default';
    }
  }
}
