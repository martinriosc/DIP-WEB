import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

export interface Ley19863Item {
  id: number;
  fecha: string;
  numero: string;
  tipo: string;
  estado: string;
  descripcion: string;
  servicio: string;
}

@Component({
  selector: 'app-ley-19863-list',
  templateUrl: './ley-19863-list.component.html',
  styleUrls: ['./ley-19863-list.component.scss']
})
export class Ley19863ListComponent implements AfterViewInit, OnInit {
  showFilters = false;
  isLoading = false;

  fechaInicio = new FormControl();
  fechaFin = new FormControl();
  tipo = new FormControl('');
  estado = new FormControl('');
  numero = new FormControl('');

  tipos: any[] = [
    { id: '1', nombre: 'Tipo A' },
    { id: '2', nombre: 'Tipo B' },
    { id: '3', nombre: 'Tipo C' }
  ];
  estados: any[] = [
    { id: '1', nombre: 'Activo' },
    { id: '2', nombre: 'Inactivo' },
    { id: '3', nombre: 'Pendiente' }
  ];

  dataSource = new MatTableDataSource<Ley19863Item>([]);
  totalItems: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;

  displayedColumns: string[] = [
    'id',
    'fecha',
    'numero',
    'tipo',
    'estado',
    'descripcion',
    'acciones'
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private _toastr: ToastrService,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngAfterViewInit(): void {
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página:';
    this.paginator._intl.nextPageLabel = 'Siguiente página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.firstPageLabel = 'Primera página';
    this.paginator._intl.lastPageLabel = 'Última página';
  }

  cargarDatos() {
    this.isLoading = true;
    setTimeout(() => {
      const mockData: Ley19863Item[] = [
        {
          id: 1,
          fecha: '2024-01-15',
          numero: 'LEY19863-001',
          tipo: 'Tipo A',
          estado: 'Activo',
          descripcion: 'Descripción de Ley 19863 001',
          servicio: 'Servicio General'
        },
        {
          id: 2,
          fecha: '2024-01-16',
          numero: 'LEY19863-002',
          tipo: 'Tipo B',
          estado: 'Pendiente',
          descripcion: 'Descripción de Ley 19863 002',
          servicio: 'Servicio Específico'
        }
      ];
      
      this.dataSource.data = mockData;
      this.totalItems = mockData.length;
      this.isLoading = false;
    }, 1000);
  }

  toggleFiltros() {
    this.showFilters = !this.showFilters;
  }

  crear() {
    this._toastr.info('Funcionalidad en desarrollo', 'Crear Ley 19863');
  }

  getEstadoPillClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'activo':
        return 'estado-activo';
      case 'inactivo':
        return 'estado-inactivo';
      case 'pendiente':
        return 'estado-pendiente';
      default:
        return 'estado-default';
    }
  }

  editar(element: Ley19863Item) {
    this._toastr.info('Funcionalidad en desarrollo', 'Editar');
  }

  ver(element: Ley19863Item) {
    this._toastr.info('Funcionalidad en desarrollo', 'Ver detalle');
  }

  eliminar(element: Ley19863Item) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._toastr.success('Registro eliminado correctamente');
        this.cargarDatos();
      }
    });
  }

  buscar() {
    this.currentPage = 0;
    this.cargarDatos();
  }

  limpiar() {
    this.fechaInicio.reset();
    this.fechaFin.reset();
    this.tipo.reset();
    this.estado.reset();
    this.numero.reset();
    this.cargarDatos();
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarDatos();
  }
} 