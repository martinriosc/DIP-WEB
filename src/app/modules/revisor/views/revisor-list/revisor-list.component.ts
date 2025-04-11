import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';

/**
 * Modelo de datos para un Revisor (ajusta a lo que realmente uses).
 */
export interface Revisor {
  rut: string;
  nombreCompleto: string;
  fechaAsignacion: string; // Ej: '2023-03-15'
  cargo: string;
  estado: string;
}

/**
 * Componente que lista revisores con la MISMA estructura que DeclaracionList:
 * - Breadcrumb
 * - Caja de filtros colapsable
 * - Tabla en desktop con selección múltiple y paginador
 * - Vista de lista en mobile
 * - Acciones para cada revisor
 */
@Component({
  selector: 'app-revisor-list',
  templateUrl: './revisor-list.component.html',
  styleUrls: ['./revisor-list.component.scss']
})
export class RevisorListComponent implements AfterViewInit {

  // Control para mostrar/ocultar la caja de filtros
  showFilters = false;

  // Controles de filtros (ajusta nombres si tus imágenes requieren otros):
  fechaAsignacion = new FormControl();
  cargo = new FormControl('');
  estado = new FormControl('');

  // Datos de ejemplo:
  // Ajusta los campos a lo que tus imágenes muestren realmente
  data: Revisor[] = [
    {
      rut: '11.111.111-1',
      nombreCompleto: 'Juan Pérez',
      fechaAsignacion: '2023-01-10',
      cargo: 'Analista',
      estado: 'Activo'
    },
    {
      rut: '22.222.222-2',
      nombreCompleto: 'María González',
      fechaAsignacion: '2023-02-05',
      cargo: 'Supervisor',
      estado: 'Inactivo'
    },
    {
      rut: '33.333.333-3',
      nombreCompleto: 'Ana Fernández',
      fechaAsignacion: '2023-03-20',
      cargo: 'Jefe de Unidad',
      estado: 'Activo'
    },
  ];

  // DataSource de Material Table
  dataSource = new MatTableDataSource<Revisor>(this.data);

  // Columnas a mostrar en la tabla (con la columna 'select' al inicio, y 'acciones' al final).
  displayedColumns: string[] = [
    'select',
    'rut',
    'nombreCompleto',
    'fechaAsignacion',
    'cargo',
    'estado',
    'acciones'
  ];

  // Para selección múltiple (checkboxes en la tabla)
  selection = new SelectionModel<Revisor>(true, []);

  // Paginador de la tabla
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    // Enlazamos el paginador
    this.dataSource.paginator = this.paginator;

    // Configuración opcional de textos del paginador en español
    this.paginator._intl.itemsPerPageLabel = 'Elementos por página:';
    this.paginator._intl.nextPageLabel = 'Siguiente página';
    this.paginator._intl.previousPageLabel = 'Página anterior';
    this.paginator._intl.firstPageLabel = 'Primera página';
    this.paginator._intl.lastPageLabel = 'Última página';
  }

  // Alterna la caja de filtros
  toggleFiltros() {
    this.showFilters = !this.showFilters;
  }

  // Métodos de selección (igual que en DeclaracionList)
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isSomeSelected() {
    return this.selection.selected.length > 0 && !this.isAllSelected();
  }

  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  toggle(row: Revisor) {
    this.selection.toggle(row);
  }

  // Lógica para “descargar seleccionados”
  descargarSeleccionados() {
    const seleccionados = this.selection.selected;
    if (seleccionados.length === 0) {
      alert('No hay revisores seleccionados.');
      return;
    }
    // Lógica real de descarga...
    console.log('Descargando revisores:', seleccionados);
    alert(`Se descargarán ${seleccionados.length} revisores.`);
  }

  // Determina la clase "pill" para el estado, si quieres distintos colores
  getEstadoPillClass(estado: string): string {
    switch (estado) {
      case 'Activo':
        return 'pill pill-success';  // verde
      case 'Inactivo':
        return 'pill pill-secondary'; // gris
      default:
        return 'pill pill-default';   // color genérico
    }
  }

  // Acciones
  editar(revisor: Revisor) {
    console.log('Editar:', revisor);
  }
  bitacora(revisor: Revisor) {
    console.log('Bitácora:', revisor);
  }
  archivar(revisor: Revisor) {
    console.log('Archivar:', revisor);
  }
  eliminar(revisor: Revisor) {
    console.log('Eliminar:', revisor);
  }

  // Filtros: Buscar y Limpiar
  buscar() {
    console.log('Buscar con filtros:', {
      fechaAsignacion: this.fechaAsignacion.value,
      cargo: this.cargo.value,
      estado: this.estado.value
    });
    // Aplica la lógica de filtrado real o una petición HTTP
  }

  limpiar() {
    this.fechaAsignacion.reset();
    this.cargo.setValue('');
    this.estado.setValue('');
    this.selection.clear();
  }
}
