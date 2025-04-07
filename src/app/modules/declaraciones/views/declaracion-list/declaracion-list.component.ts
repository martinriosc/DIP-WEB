import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';

export interface Declaracion {
  nro: string;
  fechaRecepcion: string;
  tipo: string;
  servicio: string;
  cargo: string;
  estado: string;
}

@Component({
  selector: 'app-declaracion-list',
  templateUrl: './declaracion-list.component.html',
  styleUrls: ['./declaracion-list.component.scss']
})
export class DeclaracionListComponent implements AfterViewInit {

  // Mostrar / ocultar caja de filtros
  showFilters = false;

  // Filtros
  fechaDeclaracion = new FormControl();
  tipo = new FormControl('');
  servicio = new FormControl('');
  cargo = new FormControl('');
  estado = new FormControl('');

  data: Declaracion[] = [
    {
      nro: '012345',
      fechaRecepcion: '2023-03-15',
      tipo: 'FIRMA DECLARACIÓN PERIÓDICA (MARZO)',
      servicio: 'CONTRALORÍA GENERAL - TESTING CGR',
      cargo: 'JEFE DE UNIDAD',
      estado: 'RECEPCIONADA'
    },
    {
      nro: '678910',
      fechaRecepcion: '2023-05-22',
      tipo: 'PRIMERA DECLARACIÓN',
      servicio: 'CONTRALORÍA GENERAL - TESTING CGR',
      cargo: 'JEFE DE UNIDAD',
      estado: 'ARCHIVADA'
    },
    {
      nro: '111213',
      fechaRecepcion: '2023-08-01',
      tipo: 'FIRMA DECLARACIÓN PERIÓDICA (AGOSTO)',
      servicio: 'CONTRALORÍA GENERAL - TESTING CGR',
      cargo: 'JEFE DE UNIDAD',
      estado: 'RECIBIDA'
    }
  ];

  dataSource = new MatTableDataSource<Declaracion>(this.data);

  // Añadimos la columna 'select' al principio
  displayedColumns: string[] = [
    'select',
    'nro',
    'fechaRecepcion',
    'tipo',
    'servicio',
    'cargo',
    'estado',
    'acciones'
  ];

  // Para la selección múltiple
  selection = new SelectionModel<Declaracion>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;

    // Paginador en español
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página:';
    this.paginator._intl.nextPageLabel = 'Siguiente página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.firstPageLabel = 'Primera página';
    this.paginator._intl.lastPageLabel = 'Última página';
  }

  // Colapsar/expander caja de filtros
  toggleFiltros() {
    this.showFilters = !this.showFilters;
  }

  // Metodos de selección multiple
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  isSomeSelected() {
    const numSelected = this.selection.selected.length;
    return numSelected > 0 && !this.isAllSelected();
  }
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
  toggle(row: Declaracion) {
    this.selection.toggle(row);
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

  // Acciones
  editar(element: Declaracion) {
    console.log('Editar:', element);
  }
  bitacora(element: Declaracion) {
    console.log('Bitácora:', element);
  }
  archivar(element: Declaracion) {
    console.log('Archivar:', element);
  }
  eliminar(element: Declaracion) {
    console.log('Eliminar:', element);
  }

  // Descarga masiva
  descargarSeleccionados() {
    const seleccionados = this.selection.selected;
    if (seleccionados.length === 0) {
      alert('No hay declaraciones seleccionadas.');
      return;
    }
    // Lógica real de descarga
    console.log('Descargando declaraciones:', seleccionados);
    alert(`Se descargarán ${seleccionados.length} declaraciones...`);
  }

  // Filtros (Buscar/Limpiar)
  buscar() {
    console.log('Buscar con filtros:', {
      fechaDeclaracion: this.fechaDeclaracion.value,
      tipo: this.tipo.value,
      servicio: this.servicio.value,
      cargo: this.cargo.value,
      estado: this.estado.value
    });
    // Lógica real de filtrado
  }

  limpiar() {
    this.fechaDeclaracion.reset();
    this.tipo.setValue('');
    this.servicio.setValue('');
    this.cargo.setValue('');
    this.estado.setValue('');
    this.selection.clear();
  }
}
