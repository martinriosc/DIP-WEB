import { LeyReservadoService } from './../../services/ley-reservado.service';
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DeclaracionService, TipoDeclaracion, Servicio, EstadoDeclaracion } from '../../services/declaracion.service';
import { ApiResponse } from '../../../auth/models/ApiResponse';
import { saveAs } from 'file-saver';
import { Declaracion } from '../../../../shared/models/AllModels';
import { AuthService } from '../../../auth/services/auth.service';
import { DeclaranteService } from '../../services/declarante.service';
import { InmuebleService } from '../../services/inmueble.service';
import { AguasService } from '../../services/aguas.service';
import { OtraFuenteService } from '../../services/otra-fuente.service';
import { PensionesService } from '../../services/pensiones.service';
import { PersonaRelacionadaService } from '../../services/persona-relacionada.service';
import { PublicacionService } from '../../services/publicacion.service';
import { ValoresObligatoriosService } from '../../services/valores-obligatorios.service';
import { DeclaracionHelperService } from '../../services/declaracion-helper.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-declaracion-list',
  templateUrl: './declaracion-list.component.html',
  styleUrls: ['./declaracion-list.component.scss']
})
export class DeclaracionListComponent implements AfterViewInit, OnInit {
  // Mostrar / ocultar caja de filtros
  showFilters = false;
  isLoading = false;

  // Filtros
  fechaRecepcion = new FormControl();
  fechaFirmaDeclarante = new FormControl();
  tipo = new FormControl('');
  servicio = new FormControl('');
  cargo = new FormControl('');
  estado = new FormControl('');

  // Datos para los filtros
  tiposDeclaracion: TipoDeclaracion[] = [];
  servicios: Servicio[] = [];
  estadosDeclaracion: EstadoDeclaracion[] = [];

  dataSource = new MatTableDataSource<Declaracion>([]);
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;

  displayedColumns: string[] = [
    'nro',
    'fechaRecepcion',
    'tipo',
    'servicio',
    'cargo',
    'estado',
    'acciones'
  ];

  // Propiedades para el modal de bitácoras
  showBitacoraModal = false;
  bitacoraData: any[] = [];
  bitacoraLoading = false;
  bitacoraPageSize = 5;
  bitacoraCurrentPage = 0;
  bitacoraTotalItems = 0;
  currentDeclaracionId = 0;

  // Propiedades para el modal de archivado
  showArchivarModal = false;
  archivarForm = this._fb.group({
    observacion: ['', [Validators.required, Validators.minLength(10)]]
  });
  archivarLoading = false;
  currentDeclaracionToArchive: Declaracion | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private initialLoadDone = false;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private _declaracion: DeclaracionService,
    private _declarante: DeclaranteService,
    private _aguas: AguasService,
    private _inmueble: InmuebleService,
    private _leyReservado: LeyReservadoService,
    private _otraFuente: OtraFuenteService,
    private _pensiones: PensionesService,
    private _personaRelacionada: PersonaRelacionadaService,
    private _publicacion: PublicacionService,
    private _valoresObligatorios: ValoresObligatoriosService,
    private _auth: AuthService,
    private _declaracionHelper: DeclaracionHelperService,
    private _toastr: ToastrService,
    private _fb: FormBuilder
  ) {
    this._declaracionHelper.resetState();
  }

  ngOnInit(): void {
    this.cargarFiltros();
    this.cargarDeclaraciones();
    this.ajustarModalParaSidebar();
  }


  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página:';
    this.paginator._intl.nextPageLabel = 'Siguiente página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.firstPageLabel = 'Primera página';
    this.paginator._intl.lastPageLabel = 'Última página';
  }

  cargarFiltros() {
    this._declaracion.obtenerTiposDeclaracion()
      .subscribe({
        next: (tipos) => {
          this.tiposDeclaracion = tipos;
        },
        error: (error) => {
          console.error('Error al cargar tipos de declaración:', error);
        }
      });

    const userRut = this._auth.getCurrentUserRut();
    const userRol = this._auth.getCurrentUserRol();

    this._declaracion.obtenerServicios(userRut, userRol)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.servicios = response.data;
          }
        },
        error: (error) => {
          console.error('Error al cargar servicios:', error);
        }
      });

    const tipoBandeja = 3;
    this._declaracion.obtenerEstadosDeclaracion(tipoBandeja, userRol)
      .subscribe({
        next: (estados) => {
          this.estadosDeclaracion = estados;
        },
        error: (error) => {
          console.error('Error al cargar estados de declaración:', error);
        }
      });
  }

  cargarDeclaraciones() {
    this.isLoading = true;
    const filtro = {
      remitente: '',
      fechaRecepcion: this.fechaRecepcion.value ? this.fechaRecepcion.value.toISOString().split('T')[0] : '',
      fechaFirmaDeclarante: this.fechaFirmaDeclarante.value ? this.fechaFirmaDeclarante.value.toISOString().split('T')[0] : '',
      tipoId: this.tipo.value || '',
      rut: '',
      declarante: '',
      servicioId: this.servicio.value || '',
      cargo: this.cargo.value || '',
      estadoId: this.estado.value !== null && this.estado.value !== '' ? Number(this.estado.value) : 0,
      rol: this._auth.getCurrentUserRol() || 1,
      tipobandeja: 3 // TIPO_BANDEJA_PENDIENTE
    };

    this._declaracion.listar<Declaracion[]>(filtro, 'modificacion', this.currentPage, this.pageSize)
      .subscribe({
        next: (response: ApiResponse<Declaracion[]>) => {
          if (response.success) {
            this.dataSource.data = response.data.map(declaracion => ({
              ...declaracion,
              fecha: this.formatearFecha(declaracion.fecha),
              recepcion: declaracion.recepcion ? this.formatearFecha(declaracion.recepcion) : ''
            }));

            if (typeof response.total === 'number') {
              this.totalItems = response.total;
            }
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al cargar declaraciones:', error);
          this.isLoading = false;
        }
      });
  }

  private formatearFecha(fecha: string | Date): Date | string {
    if (!fecha) return '';
    if (fecha instanceof Date) return fecha;
    try {
      const [fechaPart, horaPart] = fecha.split(' ');
      const [dia, mes, anio] = fechaPart.split('/');
      return new Date(`${anio}-${mes}-${dia}T${horaPart}`);
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return '';
    }
  }

  toggleFiltros() {
    this.showFilters = !this.showFilters;
  }

  crear() {
    this._declaracion.validarNuevaDeclaracion().subscribe({
      next: (res: any) => {
        if (!res.data) {
          this._declaracionHelper.setIsCreating(true);
          this._declaracionHelper.setDeclaracionId(0);
          this._declaracionHelper.setDeclaranteId(this._auth.currentUser?.idDeclarante ?? 0);
          this.dialog.closeAll();
          this.router.navigate(['declaraciones', 'detalle']);
        } else {
          this._toastr.error('No se puede crear una nueva declaración. Ya existe una declaración con estado BORRADOR.')
        }
      },
      error: (err: any) => {
        console.log(err);
        this._toastr.error('No se puede crear una nueva declaración. Ya existe una declaración con estado BORRADOR.')
      }
    })
  }

  // Devuelve la clase/pill para el estado
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

  verDetalle(nro: any) {
    this._declaracionHelper.setDeclaracionId(nro);
    this.router.navigate(['/declaraciones/ver']);
  }

  editar(element: Declaracion) {

    this._declaracionHelper.setIsCreating(false);
    const declaracionId = Number(element.id);
    this._declaracionHelper.setDeclaracionId(declaracionId);

    const possibleDeclaranteId =
      (element as any).declaranteId ?? (element as any).idDeclarante;
    if (possibleDeclaranteId !== undefined && possibleDeclaranteId !== null) {
      this._declaracionHelper.setDeclaranteId(Number(possibleDeclaranteId));
    }

    this.router.navigate(['/declaraciones/detalle']);
  }

  bitacora(element: Declaracion) {
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
          this._toastr.error('Error al cargar la bitácora');
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

  /**
   * Verifica si una declaración puede ser archivada
   */
  puedeArchivar(element: Declaracion): boolean {
    const estadosArchivables = ['PENDIENTE FIRMAR', 'PENDIENTE REVISOR', 'FIRMADA'];
    return estadosArchivables.includes(element.declaEstado);
  }

  /**
   * Abre el modal para archivar una declaración
   */
  archivar(element: Declaracion) {
    this.currentDeclaracionToArchive = element;
    this.archivarForm.reset();
    this.ajustarModalParaSidebar();
    this.showArchivarModal = true;
  }

  /**
   * Cierra el modal de archivado
   */
  cerrarArchivarModal() {
    this.showArchivarModal = false;
    this.archivarForm.reset();
    this.currentDeclaracionToArchive = null;
    this.archivarLoading = false;
  }

  /**
   * Confirma y procesa el archivado de la declaración
   */
  confirmarArchivado() {
    if (!this.currentDeclaracionToArchive || this.archivarLoading) {
      return;
    }

    // Marcar todos los campos como tocados para mostrar errores de validación
    this.archivarForm.markAllAsTouched();

    if (this.archivarForm.invalid) {
      this._toastr.error('Debe ingresar una observación válida para archivar la declaración');
      return;
    }

    const observacion = this.archivarForm.get('observacion')?.value?.trim() || '';

    // Mostrar SweetAlert de confirmación
    Swal.fire({
      title: '¿Está seguro de archivar esta declaración?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, archivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && this.currentDeclaracionToArchive) {
        this.archivarLoading = true;
        
        this._declaracion.archivarDeclaracion(Number(this.currentDeclaracionToArchive.id), observacion)
          .subscribe({
            next: (response) => {
              if (response) {
                this._toastr.success('Declaración archivada exitosamente');
                this.cerrarArchivarModal();
                this.cargarDeclaraciones();
              } else {
                this._toastr.error('Error al archivar la declaración');
                this.archivarLoading = false;
              }
            },
            error: (error) => {
              console.error('Error al archivar declaración:', error);
              this._toastr.error('Error al archivar la declaración');
              this.archivarLoading = false;
            }
          });
      }
    });
  }

  eliminar(element: Declaracion) {

    Swal.fire({
      title: '¿Estas seguro de eliminar esta declaración?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._declaracion.eliminarDeclaracion(Number(element.id))
          .subscribe({
            next: (response) => {
              if (response) {
                this.cargarDeclaraciones();
              }
            },
            error: (error) => {
              console.error('Error al eliminar declaración:', error);
            }
          });
      }
    })

  }

  descargarDeclaracion(element: Declaracion, tipo: 'completa' | 'publica' = 'completa') {
    this._declaracion.descargarDeclaracion(Number(element.id), tipo)
      .subscribe({
        next: (blob) => {
          const extension = tipo === 'completa' ? 'pdf' : 'json';
          saveAs(blob, `declaracion_${element.id}.${extension}`);
        },
        error: (error) => {
          console.error('Error al descargar declaración:', error);
        }
      });
  }

  // Filtros (Buscar/Limpiar)
  buscar() {
    this.currentPage = 0;
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.cargarDeclaraciones();
  }

  limpiar() {
    this.fechaRecepcion.reset();
    this.fechaFirmaDeclarante.reset();
    this.tipo.setValue('');
    this.servicio.setValue('');
    this.cargo.setValue('');
    this.estado.setValue('');
    this.buscar();
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarDeclaraciones();
  }

  private ajustarModalParaSidebar() {
    // Lista de selectores comunes para sidebars
    const sidebarSelectors = [
      '.sidebar',
      '.mat-sidenav',
      '.sidenav', 
      '.side-nav',
      '.mat-drawer',
      'nav[role="navigation"]',
      '.app-sidebar',
      '.main-sidebar',
      '.navigation-sidebar'
    ];
    
    let sidebarDetected = false;
    
    for (const selector of sidebarSelectors) {
      const sidebar = document.querySelector(selector);
      if (sidebar) {
        const sidebarRect = sidebar.getBoundingClientRect();
        const sidebarWidth = sidebarRect.width;
        
        if (sidebarWidth > 0 && window.getComputedStyle(sidebar).display !== 'none') {
          document.documentElement.style.setProperty('--sidebar-width', `${sidebarWidth}px`);
          sidebarDetected = true;
          console.log(`Sidebar detectado: ${selector}, ancho: ${sidebarWidth}px`);
          break;
        }
      }
    }
    
    if (!sidebarDetected) {
      // Remover la variable CSS si no hay sidebar
      document.documentElement.style.removeProperty('--sidebar-width');
      console.log('No se detectó sidebar, usando ancho completo');
    }
  }
}
