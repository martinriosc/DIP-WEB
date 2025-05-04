import { LeyReservadoService } from './../../services/ley-reservado.service';
import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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
    private _declaracionHelper: DeclaracionHelperService
  ) { }

  ngOnInit(): void {
    this.cargarFiltros();
    this.cargarDeclaraciones();
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

    this._declaracion.listar<Declaracion[]>(filtro, null, this.currentPage, this.pageSize)
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
    this.router.navigate(['/declaraciones/detalle']);
  }

  // Devuelve la clase/pill para el estado
  getEstadoPillClass(estado: string): string {
    switch (estado) {
      case 'RECEPCIONADA':
        return 'pill pill-success';
      case 'ARCHIVADA':
        return 'pill pill-secondary';
      case 'RECIBIDA':
        return 'pill pill-warning';
      default:
        return 'pill pill-default';
    }
  }

  verDetalle(nro: any) {
    this._declaracionHelper.setDeclaracionId(nro);
    this.router.navigate(['/declaraciones/ver']);
  }

  editar(element: Declaracion) {
    this._declaracionHelper.setDeclaracionId(element.id);
    this.router.navigate(['/declaraciones/detalle']);
  }

  bitacora(element: Declaracion) {
    this._declaracion.obtenerBitacora(Number(element.id))
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Aquí puedes mostrar la bitácora en un diálogo
            console.log('Bitácora:', response.data);
          }
        },
        error: (error) => {
          console.error('Error al obtener bitácora:', error);
        }
      });
  }

  archivar(element: Declaracion) {
    if (confirm('¿Está seguro de archivar esta declaración?')) {
      this._declaracion.archivarDeclaracion(Number(element.id))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.cargarDeclaraciones();
            }
          },
          error: (error) => {
            console.error('Error al archivar declaración:', error);
          }
        });
    }
  }

  eliminar(element: Declaracion) {
    if (confirm('¿Está seguro de eliminar esta declaración?')) {
      this._declaracion.eliminarDeclaracion(Number(element.id))
        .subscribe({
          next: (response) => {
            if (response.success) {
              this.cargarDeclaraciones();
            }
          },
          error: (error) => {
            console.error('Error al eliminar declaración:', error);
          }
        });
    }
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
}
