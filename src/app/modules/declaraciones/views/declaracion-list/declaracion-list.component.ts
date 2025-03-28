import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

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

  // Filtros individuales
  fechaDeclaracion = new FormControl();
  tipo = new FormControl('');
  servicio = new FormControl('');
  cargo = new FormControl('');
  estado = new FormControl('');

  // Filtro por escritura (buscador global)
  filterControl = new FormControl('');

  // Datos dummy para la tabla
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

  // Columnas de la tabla, se agrega "acciones" para los botones por fila
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // Filtrado global por escritura
  applyFilter() {
    const filterValue = this.filterControl.value;
    this.dataSource.filter = filterValue!.trim().toLowerCase();
  }

  // Métodos de búsqueda por filtros (puedes personalizar la lógica)
  buscar() {
    console.log('Buscar con filtros:', {
      fechaDeclaracion: this.fechaDeclaracion.value,
      tipo: this.tipo.value,
      servicio: this.servicio.value,
      cargo: this.cargo.value,
      estado: this.estado.value
    });
    // Aquí podrías combinar los filtros con la data, por ejemplo
  }

  limpiar() {
    this.fechaDeclaracion.reset();
    this.tipo.setValue('');
    this.servicio.setValue('');
    this.cargo.setValue('');
    this.estado.setValue('');
  }

  // Acciones para cada fila
  editar(element: Declaracion) {
    console.log('Editar:', element);
  }
  eliminar(element: Declaracion) {
    console.log('Eliminar:', element);
  }
  archivar(element: Declaracion) {
    console.log('Archivar:', element);
  }
}
