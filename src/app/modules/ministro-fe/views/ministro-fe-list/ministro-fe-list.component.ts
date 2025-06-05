import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import {
  DeclaracionService,
  EstadoDeclaracion,
  TipoDeclaracion
} from 'src/app/modules/declaraciones/services/declaracion.service';
import { MinistroFeService, ProcesoMasivo, Exportacion } from '../../services/ministro-fe.service';
import { merge, debounceTime, switchMap, tap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

/* Modelo de fila */
export interface DeclaracionMinistroFe {
  id: number;
  idDeclaracion: number;
  fechaDeclaracion: string;
  tipoDeclaracion: string;
  numeral: number | string;
  rut: string;
  declarante: string;
  servicio: string;
  cargo: string;
  estado: string;
  enviadoPor: string;
}

type TabId =
  | 'pendientes'
  | 'firma-envio-masivo'
  | 'enviadas'
  | 'archivo-masivo'
  | 'archivadas';

@Component({
  selector: 'app-ministro-fe-list',
  standalone:false,
  templateUrl: './ministro-fe-list.component.html',
  styleUrls: ['./ministro-fe-list.component.scss']
})
export class MinistroFeListComponent implements OnInit {
  /* ──────────────────────────── Tabs ──────────────────────────── */
  pendientesCount = 0;
  firmaEnvioCount = 0;
  enviadasCount   = 0;
  archivoMasivoCount = 0;
  archivadasCount = 0;

  tabs = [
    { id: 'pendientes' as TabId,         label: 'Pendientes',                              count: () => this.pendientesCount == 0 ? '' : this.pendientesCount },
    { id: 'enviadas' as TabId,           label: 'Enviadas / Recepcionadas',                count: () => this.enviadasCount == 0 ? '' : this.enviadasCount },
    { id: 'archivadas' as TabId,         label: 'Archivadas',                              count: () => this.archivadasCount == 0 ? '' : this.archivadasCount }
  ];

  currentTab: TabId = 'pendientes';

  /* ──────────────────────────── Filtros ───────────────────────── */
  enviadoPor        = new FormControl('');
  fechaDeclaracion  = new FormControl<Date | null>(null);
  tipoDeclaracion   = new FormControl('');
  run               = new FormControl('');
  declarante        = new FormControl('');
  servicio          = new FormControl('');
  cargo             = new FormControl('');
  estado            = new FormControl('');

  tipos: TipoDeclaracion[] = [];
  estados: EstadoDeclaracion[] = [];
  serviciosCombo: any[] = [];

  showFilters = false;
isLoading   = false;

  /* ──────────────────────── Datasources / selección ───────────── */
  dataSourcePendientes  = new MatTableDataSource<DeclaracionMinistroFe>([]);
  dataSourceEnviadas    = new MatTableDataSource<DeclaracionMinistroFe>([]);
  dataSourceArchivadas  = new MatTableDataSource<DeclaracionMinistroFe>([]);

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
    'acciones'
    
  ];

  selectionPendientes = new SelectionModel<DeclaracionMinistroFe>(true, []);
  selectionEnviadas   = new SelectionModel<DeclaracionMinistroFe>(true, []);
  selectionArchivadas = new SelectionModel<DeclaracionMinistroFe>(true, []);

  /* ══════════════ Propiedades para el modal de bitácora ══════════════ */
  showBitacoraModal = false;
  bitacoraData: any[] = [];
  bitacoraLoading = false;
  bitacoraPageSize = 5;
  bitacoraCurrentPage = 0;
  bitacoraTotalItems = 0;
  currentDeclaracionId = 0;

  /* ══════════════ Propiedades para procesos masivos ══════════════ */
  procesosMasivos: ProcesoMasivo[] = [];
  exportaciones: Exportacion[] = [];
  procesosMasivosLoading = false;
  exportacionesLoading = false;

  /* ══════════════ Propiedades para modales de confirmación ══════════════ */
  showConfirmModal = false;
  confirmModalTitle = '';
  confirmModalMessage = '';
  confirmModalAction: () => void = () => {};
  observacionModal = new FormControl('');

  /* ──────────────────────────── Constructor ───────────────────── */
  constructor(
    private _declaracion: DeclaracionService, 
    private _ministroFe: MinistroFeService,
    private toastr: ToastrService
  ) {}

  /* ───────────────────────────── Lifecycle ────────────────────── */
  ngOnInit(): void {
    /* combos */
    this._declaracion.obtenerTiposDeclaracion().subscribe(t => (this.tipos = t));
    this._declaracion.obtenerServicios('15381086-9', 3).subscribe(r => (this.serviciosCombo = r.data));
    this._declaracion.obtenerEstadosDeclaracion(1, 3).subscribe(e => (this.estados = e));

    /* primera carga + filtros reactivos */
    this.loadBandeja();
    this.wireFilters();
  }

  /* ──────────────────────────── Carga remota ──────────────────── */
  private loadBandeja(page = 0, limit = 100): void {
     this.isLoading = true;
    const bandejaMap: Record<TabId, number> = {
      'pendientes': 1,
      'firma-envio-masivo': 6,
      'enviadas': 2,
      'archivo-masivo': 7,
      'archivadas': 5
    };

    const filtro = {
      remitente:            this.enviadoPor.value ?? '',
      fechaRecepcion:       '',
      fechaFirmaDeclarante: this.fechaDeclaracion.value
                              ? this.fechaDeclaracion.value.toISOString().slice(0, 10)
                              : '',
      tipoId:               this.tipoDeclaracion.value ?? '',
      rut:                  this.run.value ?? '',
      declarante:           this.declarante.value ?? '',
      servicioId:           this.servicio.value ?? '',
      cargo:                this.cargo.value ?? '',
      estadoId:             this.estado.value ? +this.estado.value : 0,
      rol:                  3,
      tipobandeja:          bandejaMap[this.currentTab]
    };

    this._declaracion
      .listar<DeclaracionMinistroFe>(filtro, 'id', page, limit)
      .pipe(
        tap((resp:any) => this.bindToDatasource(resp.data)),
        switchMap(() => this._declaracion.totalDeclaraciones(filtro))
      )
      .subscribe(totalResp => {
        this.updateCounter(totalResp.data ?? 0);
        this.isLoading = false;
      });
  }

    getDataSource(tab: TabId): MatTableDataSource<DeclaracionMinistroFe> {
    if (tab === 'enviadas')                    return this.dataSourceEnviadas;
    if (tab === 'archivadas' || tab === 'archivo-masivo')
                                               return this.dataSourceArchivadas;
    return this.dataSourcePendientes;          // pendientes + firma/envío
  }


  private bindToDatasource(arr: DeclaracionMinistroFe[]): void {
    if (['pendientes', 'firma-envio-masivo'].includes(this.currentTab)) {
      this.dataSourcePendientes.data = arr;
    } else if (this.currentTab === 'enviadas') {
      this.dataSourceEnviadas.data = arr;
    } else {
      /* archivadas + archivo masivo */
      this.dataSourceArchivadas.data = arr;
    }
  }

  private updateCounter(total: number): void {
    switch (this.currentTab) {
      case 'pendientes':            this.pendientesCount     = total; break;
      case 'firma-envio-masivo':    this.firmaEnvioCount     = total; break;
      case 'enviadas':              this.enviadasCount       = total; break;
      case 'archivo-masivo':        this.archivoMasivoCount  = total; break;
      case 'archivadas':            this.archivadasCount     = total; break;
    }
  }

  private wireFilters(): void {
    merge(
      this.enviadoPor.valueChanges,
      this.fechaDeclaracion.valueChanges,
      this.tipoDeclaracion.valueChanges,
      this.run.valueChanges,
      this.declarante.valueChanges,
      this.servicio.valueChanges,
      this.cargo.valueChanges,
      this.estado.valueChanges
    )
    .pipe(debounceTime(300))
    .subscribe(() => this.loadBandeja());
  }

  /* ──────────────────────────── Tab management ────────────────── */
  setTab(tab: TabId): void {
    this.currentTab = tab;

    /* Cargar estados según el tab */
    const tipoBandejaMap: Record<TabId, number> = {
      'pendientes': 1,
      'firma-envio-masivo': 6,
      'enviadas': 2,
      'archivo-masivo': 7,
      'archivadas': 5
    };

    this._declaracion.obtenerEstadosDeclaracion(tipoBandejaMap[tab], 3).subscribe(e => {
      this.estados = e;
      this.estado.setValue(''); // Reset filter
    });

    // Cargar datos adicionales según el tab
    this.cargarProcesosMasivos();
    this.cargarExportaciones();

    /* Reset filters and reload */
    this.limpiar();
  }

  /* ───────────────────── Selección genérica (checkbox) ────────── */
  getSelection(tab: TabId): SelectionModel<DeclaracionMinistroFe> {
    if (tab === 'enviadas') return this.selectionEnviadas;
    if (tab === 'archivadas' || tab === 'archivo-masivo') return this.selectionArchivadas;
    return this.selectionPendientes; // pendientes + firma/envío
  }

  masterToggle(tab: TabId): void {
    const sel = this.getSelection(tab);
    const ds  = this.getDataSource(tab).data;
    this.isAllSelected(tab) ? sel.clear() : ds.forEach(r => sel.select(r));
  }

  isAllSelected(tab: TabId): boolean {
    const sel = this.getSelection(tab);
    const ds  = this.getDataSource(tab).data;
    return sel.selected.length === ds.length;
  }

  isSomeSelected(tab: TabId): boolean {
    const sel = this.getSelection(tab);
    return sel.selected.length > 0 && !this.isAllSelected(tab);
  }

  toggle(tab: TabId, row: DeclaracionMinistroFe): void {
    this.getSelection(tab).toggle(row);
  }

  isSelected(tab: TabId, row: DeclaracionMinistroFe): boolean {
    return this.getSelection(tab).isSelected(row);
  }

  /* ────────────────────── Barra de acciones ───────────────────── */

  onBitacora(element: DeclaracionMinistroFe) {
    this.currentDeclaracionId = Number(element.id);
    this.bitacoraCurrentPage = 0;
    this.ajustarModalParaSidebar();
    this.cargarBitacora();
    this.showBitacoraModal = true;
  }

  cargarBitacora() {
    this.bitacoraLoading = true;
    const startIndex = this.bitacoraCurrentPage * this.bitacoraPageSize;
    
    this._declaracion.obtenerBitacora(this.currentDeclaracionId, startIndex + 1, this.bitacoraPageSize)
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
          this.toastr.error('Error al cargar la bitácora');
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

  onFirmar(): void {
    const selection = this.getSelection(this.currentTab);
    const selectedItems = selection.selected;
    
    if (selectedItems.length === 0) {
      this.toastr.warning('Debe seleccionar al menos una declaración para firmar');
      return;
    }

    if (selectedItems.length === 1) {
      const element = selectedItems[0];
      this.mostrarModalConfirmacion(
        'Firmar Declaración',
        `¿Está seguro de que desea firmar la declaración ${element.idDeclaracion}?`,
        () => {
          this._ministroFe.firmarDeclaracion(element.idDeclaracion, this.observacionModal.value || '').subscribe({
            next: (response) => {
              this.toastr.success('Declaración firmada correctamente');
              this.loadBandeja();
              selection.clear();
              this.cerrarModalConfirmacion();
            },
            error: (error) => {
              console.error('Error al firmar declaración:', error);
              this.toastr.error('Error al firmar la declaración');
            }
          });
        }
      );
    } else {
      this.firmarEnviarSeleccionadas();
    }
  }

  onDerivar(): void {
    const selection = this.getSelection(this.currentTab);
    const selectedItems = selection.selected;
    
    if (selectedItems.length === 0) {
      this.toastr.warning('Debe seleccionar al menos una declaración para derivar');
      return;
    }

    // Por simplicidad, usamos un idVisador por defecto. 
    // En una implementación real, se debería mostrar un modal para seleccionar el visador
    const idVisadorDefault = 1;
    
    if (selectedItems.length === 1) {
      const element = selectedItems[0];
      this.mostrarModalConfirmacion(
        'Derivar Declaración',
        `¿Está seguro de que desea derivar la declaración ${element.idDeclaracion}?`,
        () => {
          this._ministroFe.enviarVisador(element.idDeclaracion, idVisadorDefault, this.observacionModal.value || '').subscribe({
            next: (response) => {
              this.toastr.success('Declaración derivada correctamente');
              this.loadBandeja();
              selection.clear();
              this.cerrarModalConfirmacion();
            },
            error: (error) => {
              console.error('Error al derivar declaración:', error);
              this.toastr.error('Error al derivar la declaración');
            }
          });
        }
      );
    }
  }

  onEnviarOrganismo(): void {
    const selection = this.getSelection(this.currentTab);
    const selectedItems = selection.selected;
    
    if (selectedItems.length === 0) {
      this.toastr.warning('Debe seleccionar al menos una declaración');
      return;
    }

    if (selectedItems.length === 1) {
      this.enviarOrganismoFiscalizador(selectedItems[0]);
    } else {
      this.toastr.info('Para múltiples declaraciones, use las opciones de proceso masivo');
    }
  }

  /* ─────────────────────── Filtros / export ───────────────────── */
  buscar(): void { this.loadBandeja(); }

  limpiar(): void {
    this.enviadoPor.setValue('');
    this.fechaDeclaracion.setValue(null);
    this.tipoDeclaracion.setValue('');
    this.run.setValue('');
    this.declarante.setValue('');
    this.servicio.setValue('');
    this.cargo.setValue('');
    this.estado.setValue('');
    this.loadBandeja();
  }

  exportar(): void {
    this.iniciarExportacion();
  }

  descargarVersionCompleta(): void {
    const selection = this.getSelection(this.currentTab);
    const selectedItems = selection.selected;
    
    if (selectedItems.length === 0) {
      this.toastr.warning('Debe seleccionar al menos una declaración para descargar');
      return;
    }

    if (selectedItems.length === 1) {
      this.descargarDeclaracion(selectedItems[0]);
    } else {
      // Descargar múltiples declaraciones
      selectedItems.forEach(item => {
        this.descargarDeclaracion(item);
      });
    }
  }

  /* ─────────────────────── Pills de estado ────────────────────── */
  pillClass(estado: string): string {
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

  /* ══════════════════════════ Nuevos métodos para integraciones ══════════════════════════ */

  /**
   * Carga los procesos masivos según el tab actual
   */
  cargarProcesosMasivos(): void {
    this.procesosMasivosLoading = true;
    
    if (this.currentTab === 'pendientes') {
      this._ministroFe.listarProcesosMasivos().subscribe({
        next: (response) => {
          this.procesosMasivos = response.data || [];
          this.procesosMasivosLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar procesos masivos:', error);
          this.toastr.error('Error al cargar procesos masivos');
          this.procesosMasivosLoading = false;
        }
      });
    } else if (['firma-envio-masivo', 'archivo-masivo'].includes(this.currentTab)) {
      this._ministroFe.listarProcesosFirmarArchivarMasivos().subscribe({
        next: (response) => {
          this.procesosMasivos = response.data || [];
          this.procesosMasivosLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar procesos masivos:', error);
          this.toastr.error('Error al cargar procesos masivos');
          this.procesosMasivosLoading = false;
        }
      });
    }
  }

  /**
   * Carga las exportaciones
   */
  cargarExportaciones(): void {
    this.exportacionesLoading = true;
    this._ministroFe.listarExportaciones().subscribe({
      next: (response) => {
        this.exportaciones = response.data || [];
        this.exportacionesLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar exportaciones:', error);
        this.toastr.error('Error al cargar exportaciones');
        this.exportacionesLoading = false;
      }
    });
  }

  /**
   * Inicia el proceso de exportación
   */
  iniciarExportacion(): void {
    const filtro = this.construirFiltroActual();
    
    this._ministroFe.iniciarExportacion(filtro).subscribe({
      next: (response) => {
        this.toastr.success('Proceso de exportación iniciado correctamente');
        this.cargarExportaciones(); // Recargar lista de exportaciones
      },
      error: (error) => {
        console.error('Error al iniciar exportación:', error);
        this.toastr.error('Error al iniciar el proceso de exportación');
      }
    });
  }

  /**
   * Construye el filtro actual basado en los controles del formulario
   */
  private construirFiltroActual(): any {
    const bandejaMap: Record<TabId, number> = {
      'pendientes': 1,
      'firma-envio-masivo': 6,
      'enviadas': 2,
      'archivo-masivo': 7,
      'archivadas': 5
    };

    return {
      remitente: this.enviadoPor.value ?? '',
      fechaRecepcion: '',
      fechaFirmaDeclarante: this.fechaDeclaracion.value
        ? this.fechaDeclaracion.value.toISOString().slice(0, 10)
        : '',
      tipoId: this.tipoDeclaracion.value ?? '',
      rut: this.run.value ?? '',
      declarante: this.declarante.value ?? '',
      servicioId: this.servicio.value ?? '',
      cargo: this.cargo.value ?? '',
      estadoId: this.estado.value ? +this.estado.value : 0,
      rol: 3,
      tipobandeja: bandejaMap[this.currentTab]
    };
  }

  /**
   * Descarga una declaración
   */
  descargarDeclaracion(element: DeclaracionMinistroFe): void {
    this._ministroFe.descargarDeclaracion(element.idDeclaracion).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `declaracion_${element.idDeclaracion}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
        this.toastr.success('Declaración descargada correctamente');
      },
      error: (error) => {
        console.error('Error al descargar declaración:', error);
        this.toastr.error('Error al descargar la declaración');
      }
    });
  }

  /**
   * Archiva las declaraciones seleccionadas
   */
  archivarSeleccionadas(): void {
    const selection = this.getSelection(this.currentTab);
    const selectedIds = selection.selected.map(item => item.idDeclaracion);
    
    if (selectedIds.length === 0) {
      this.toastr.warning('Debe seleccionar al menos una declaración');
      return;
    }

    this.mostrarModalConfirmacion(
      'Archivar Declaraciones',
      `¿Está seguro de que desea archivar ${selectedIds.length} declaración(es)?`,
      () => {
        this._ministroFe.archivarSeleccionadas(selectedIds, this.observacionModal.value || '').subscribe({
          next: (response) => {
            this.toastr.success('Declaraciones archivadas correctamente');
            this.loadBandeja();
            selection.clear();
            this.cerrarModalConfirmacion();
          },
          error: (error) => {
            console.error('Error al archivar declaraciones:', error);
            this.toastr.error('Error al archivar las declaraciones');
          }
        });
      }
    );
  }

  /**
   * Devuelve las declaraciones seleccionadas
   */
  devolverSeleccionadas(): void {
    const selection = this.getSelection(this.currentTab);
    const selectedIds = selection.selected.map(item => item.idDeclaracion);
    
    if (selectedIds.length === 0) {
      this.toastr.warning('Debe seleccionar al menos una declaración');
      return;
    }

    this.mostrarModalConfirmacion(
      'Devolver Declaraciones',
      `¿Está seguro de que desea devolver ${selectedIds.length} declaración(es)?`,
      () => {
        this._ministroFe.devolverSeleccionadas(selectedIds, this.observacionModal.value || '').subscribe({
          next: (response) => {
            this.toastr.success('Declaraciones devueltas correctamente');
            this.loadBandeja();
            selection.clear();
            this.cerrarModalConfirmacion();
          },
          error: (error) => {
            console.error('Error al devolver declaraciones:', error);
            this.toastr.error('Error al devolver las declaraciones');
          }
        });
      }
    );
  }

  /**
   * Firma y envía las declaraciones seleccionadas
   */
  firmarEnviarSeleccionadas(): void {
    const selection = this.getSelection(this.currentTab);
    const selectedIds = selection.selected.map(item => item.idDeclaracion);
    
    if (selectedIds.length === 0) {
      this.toastr.warning('Debe seleccionar al menos una declaración');
      return;
    }

    this.mostrarModalConfirmacion(
      'Firmar y Enviar Declaraciones',
      `¿Está seguro de que desea firmar y enviar ${selectedIds.length} declaración(es)?`,
      () => {
        this._ministroFe.firmarEnviarSeleccionadas(selectedIds, this.observacionModal.value || '').subscribe({
          next: (response) => {
            this.toastr.success('Declaraciones firmadas y enviadas correctamente');
            this.loadBandeja();
            selection.clear();
            this.cerrarModalConfirmacion();
          },
          error: (error) => {
            console.error('Error al firmar y enviar declaraciones:', error);
            this.toastr.error('Error al firmar y enviar las declaraciones');
          }
        });
      }
    );
  }

  /**
   * Devuelve todas las declaraciones de la bandeja actual
   */
  devolverTodasDeclaraciones(): void {
    const filtro = this.construirFiltroActual();
    
    this.mostrarModalConfirmacion(
      'Devolver Todas las Declaraciones',
      '¿Está seguro de que desea devolver TODAS las declaraciones de esta bandeja?',
      () => {
        this._ministroFe.devolverTodoDeclaracion(filtro, this.observacionModal.value || '').subscribe({
          next: (response) => {
            this.toastr.success('Todas las declaraciones han sido devueltas correctamente');
            this.loadBandeja();
            this.cerrarModalConfirmacion();
          },
          error: (error) => {
            console.error('Error al devolver todas las declaraciones:', error);
            this.toastr.error('Error al devolver todas las declaraciones');
          }
        });
      }
    );
  }

  /**
   * Firma y archiva todas las declaraciones de la bandeja actual
   */
  firmarArchivarTodasDeclaraciones(): void {
    const filtro = this.construirFiltroActual();
    
    this.mostrarModalConfirmacion(
      'Firmar y Archivar Todas las Declaraciones',
      '¿Está seguro de que desea firmar y archivar TODAS las declaraciones de esta bandeja?',
      () => {
        this._ministroFe.firmarArchivarMasivo(filtro, this.observacionModal.value || '').subscribe({
          next: (response) => {
            this.toastr.success('Todas las declaraciones han sido firmadas y archivadas correctamente');
            this.loadBandeja();
            this.cerrarModalConfirmacion();
          },
          error: (error) => {
            console.error('Error al firmar y archivar todas las declaraciones:', error);
            this.toastr.error('Error al firmar y archivar todas las declaraciones');
          }
        });
      }
    );
  }

  /**
   * Envía una declaración al organismo fiscalizador
   */
  enviarOrganismoFiscalizador(element: DeclaracionMinistroFe): void {
    this.mostrarModalConfirmacion(
      'Enviar a Organismo Fiscalizador',
      `¿Está seguro de que desea enviar la declaración ${element.idDeclaracion} al organismo fiscalizador?`,
      () => {
        this._ministroFe.enviarCgrDeclaracion(element.idDeclaracion, this.observacionModal.value || '').subscribe({
          next: (response) => {
            this.toastr.success('Declaración enviada al organismo fiscalizador correctamente');
            this.loadBandeja();
            this.cerrarModalConfirmacion();
          },
          error: (error) => {
            console.error('Error al enviar al organismo fiscalizador:', error);
            this.toastr.error('Error al enviar la declaración al organismo fiscalizador');
          }
        });
      }
    );
  }

  /**
   * Muestra el modal de confirmación
   */
  private mostrarModalConfirmacion(titulo: string, mensaje: string, accion: () => void): void {
    this.confirmModalTitle = titulo;
    this.confirmModalMessage = mensaje;
    this.confirmModalAction = accion;
    this.observacionModal.setValue('');
    this.showConfirmModal = true;
  }

  /**
   * Cierra el modal de confirmación
   */
  cerrarModalConfirmacion(): void {
    this.showConfirmModal = false;
    this.confirmModalTitle = '';
    this.confirmModalMessage = '';
    this.confirmModalAction = () => {};
    this.observacionModal.setValue('');
  }

  /**
   * Ejecuta la acción confirmada
   */
  ejecutarAccionConfirmada(): void {
    this.confirmModalAction();
  }

  /**
   * Descarga un archivo de exportación
   */
  descargarExportacion(exportacion: Exportacion): void {
    if (exportacion.estado !== 'Completado') {
      this.toastr.warning('La exportación aún no está completada');
      return;
    }

    // Implementar descarga del archivo
    // En una implementación real, esto podría ser una llamada al servicio para obtener el archivo
    const url = `${this._ministroFe['apiUrl']}/pr/service/exportaciones/descargar/${exportacion.id}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = exportacion.archivo;
    link.click();
    
    this.toastr.success('Descargando archivo de exportación');
  }
}
