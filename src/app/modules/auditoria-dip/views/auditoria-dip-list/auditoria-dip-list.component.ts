import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

export interface AuditoriaDipItem {
  id: number;
  fecha: string;
  numero: string;
  tipo: string;
  estado: string;
  descripcion: string;
  servicio: string;
}

@Component({
  selector: 'app-auditoria-dip-list',
  templateUrl: './auditoria-dip-list.component.html',
  styleUrls: ['./auditoria-dip-list.component.scss']
})
export class AuditoriaDipListComponent implements AfterViewInit, OnInit {
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

  dataSource = new MatTableDataSource<AuditoriaDipItem>([]);
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
      const mockData: AuditoriaDipItem[] = [
        {
          id: 1,
          fecha: '2024-01-15',
          numero: 'AUDITORIA-001',
          tipo: 'Tipo A',
          estado: 'Activo',
          descripcion: 'Descripción de auditoría DIP 001',
          servicio: 'Servicio General'
        },
        {
          id: 2,
          fecha: '2024-01-16',
          numero: 'AUDITORIA-002',
          tipo: 'Tipo B',
          estado: 'Pendiente',
          descripcion: 'Descripción de auditoría DIP 002',
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
    this._toastr.info('Funcionalidad en desarrollo', 'Crear Auditoría DIP');
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

  editar(element: AuditoriaDipItem) {
    this._toastr.info('Funcionalidad en desarrollo', 'Editar');
  }

  ver(element: AuditoriaDipItem) {
    this._toastr.info('Funcionalidad en desarrollo', 'Ver detalle');
  }

  eliminar(element: AuditoriaDipItem) {
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