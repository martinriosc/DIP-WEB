import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import {
  DeclaracionService,
  EstadoDeclaracion,
  TipoDeclaracion
} from 'src/app/modules/declaraciones/services/declaracion.service';
import { merge, debounceTime, switchMap, tap } from 'rxjs';

/* Modelo de fila */
export interface DeclaracionMinistroFe {
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
    { id: 'firma-envio-masivo' as TabId, label: 'Para firma y envío (proceso masivo)',     count: () => this.firmaEnvioCount == 0 ? '' : this.firmaEnvioCount  },
    { id: 'enviadas' as TabId,           label: 'Enviadas / Recepcionadas',                count: () => this.enviadasCount == 0 ? '' : this.enviadasCount },
    { id: 'archivo-masivo' as TabId,     label: 'Para Archivo (proceso masivo)',           count: () => this.archivoMasivoCount == 0 ? '' : this.archivoMasivoCount },
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

  /* ──────────────────────────── Constructor ───────────────────── */
  constructor(private _declaracion: DeclaracionService) {}

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

  /* ──────────────────────────── Tabs ──────────────────────────── */
  setTab(tab: TabId): void {
    if (this.currentTab === tab) return;
    this.currentTab = tab;
    this.estados = [];
    /* limpiamos selecciones al cambiar de bandeja */
    this.selectionPendientes.clear();
    this.selectionEnviadas.clear();
    this.selectionArchivadas.clear();
    let nroTab = 0;
    if(tab === 'pendientes') nroTab = 1;
    if(tab === 'firma-envio-masivo') nroTab = 6;
    if(tab === 'enviadas') nroTab = 2;
    if(tab === 'archivo-masivo') nroTab = 7;
    if(tab === 'archivadas') nroTab = 5;
    this._declaracion.obtenerEstadosDeclaracion(nroTab, 3).subscribe(e => (this.estados = e));
    this.loadBandeja();
    
  }

  /* ───────────────────── Selección genérica (checkbox) ────────── */
  private getSelection(tab: TabId): SelectionModel<DeclaracionMinistroFe> {
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

  onBitacora(){

  }
  onFirmar(): void {
    const ids = this.selectionPendientes.selected.map(d => d.idDeclaracion);
    if (!ids.length) return;
    this._declaracion.validarProcesoActivo().subscribe(flag => {
      if (flag.data) { alert('Hay un proceso masivo activo'); return; }
      this._declaracion.archivarDeclaracion(ids[0]).subscribe(() => this.loadBandeja());
    });
  }

  onDerivar(): void {
    const ids = this.selectionPendientes.selected.map(d => d.idDeclaracion);
    if (!ids.length) return;
    this._declaracion.confirmarDatos(ids[0]).subscribe(() => this.loadBandeja());
  }

  onEnviarOrganismo(): void {
    const ids = this.selectionPendientes.selected.map(d => d.idDeclaracion);
    if (!ids.length) return;
    this._declaracion.descargarDeclaracion(ids[0]).subscribe(() => {});
  }

  /* ─────────────────────── Filtros / export ───────────────────── */
  buscar(): void { this.loadBandeja(); }

  limpiar(): void {
    this.enviadoPor.reset();
    this.fechaDeclaracion.reset();
    this.tipoDeclaracion.reset();
    this.run.reset();
    this.declarante.reset();
    this.servicio.reset();
    this.cargo.reset();
    this.estado.reset();
    this.buscar();
  }

  exportar(): void {
    /* lógica de exportación */
    console.log('exportar');
  }

  descargarVersionCompleta(): void {
    console.log('descargar versión completa - tab', this.currentTab);
  }

  /* ─────────────────────── Pills de estado ────────────────────── */
  pillClass(estado: string): string {
    switch ((estado || '').toUpperCase()) {
      case 'RECEPCIONADA': return 'pill pill-success';
      case 'ARCHIVADA':    return 'pill pill-secondary';
      case 'RECIBIDA':     return 'pill pill-warning';
      default:             return 'pill pill-default';
    }
  }
}
