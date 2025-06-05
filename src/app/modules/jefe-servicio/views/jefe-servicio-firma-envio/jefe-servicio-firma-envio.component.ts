import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';

export interface DeclaracionJefeServicio {
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

@Component({
  selector: 'app-jefe-servicio-firma-envio',
  standalone: false,
  templateUrl: './jefe-servicio-firma-envio.component.html',
  styleUrls: ['./jefe-servicio-firma-envio.component.scss']
})
export class JefeServicioFirmaEnvioComponent {
  @Input() dataSource!: MatTableDataSource<DeclaracionJefeServicio>;
  @Input() selection!: SelectionModel<DeclaracionJefeServicio>;
  @Input() isLoading = false;

  @Output() bitacora = new EventEmitter<DeclaracionJefeServicio>();
  @Output() descargar = new EventEmitter<DeclaracionJefeServicio>();
  @Output() firmarEnviarSeleccionadas = new EventEmitter<void>();
  @Output() devolverSeleccionadas = new EventEmitter<void>();
  @Output() firmarArchivarTodas = new EventEmitter<void>();
  @Output() devolverTodas = new EventEmitter<void>();
  @Output() masterToggle = new EventEmitter<void>();
  @Output() toggle = new EventEmitter<DeclaracionJefeServicio>();

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

  onBitacora(element: DeclaracionJefeServicio) {
    this.bitacora.emit(element);
  }

  onDescargar(element: DeclaracionJefeServicio) {
    this.descargar.emit(element);
  }

  onFirmarEnviarSeleccionadas() {
    this.firmarEnviarSeleccionadas.emit();
  }

  onDevolverSeleccionadas() {
    this.devolverSeleccionadas.emit();
  }

  onFirmarArchivarTodas() {
    this.firmarArchivarTodas.emit();
  }

  onDevolverTodas() {
    this.devolverTodas.emit();
  }

  onMasterToggle() {
    this.masterToggle.emit();
  }

  onToggle(element: DeclaracionJefeServicio) {
    this.toggle.emit(element);
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isSomeSelected(): boolean {
    return this.selection.selected.length > 0 && !this.isAllSelected();
  }

  isSelected(element: DeclaracionJefeServicio): boolean {
    return this.selection.isSelected(element);
  }

  pillClass(estado: string): string {
    const estadoLower = estado.toLowerCase();
    if (estadoLower.includes('pendiente')) return 'pill-pending';
    if (estadoLower.includes('recepcionad')) return 'pill-received';
    if (estadoLower.includes('firmad')) return 'pill-signed';
    if (estadoLower.includes('enviad')) return 'pill-sent';
    if (estadoLower.includes('archivad')) return 'pill-archived';
    if (estadoLower.includes('devuelt')) return 'pill-returned';
    if (estadoLower.includes('rechazad')) return 'pill-rejected';
    if (estadoLower.includes('observad')) return 'pill-observed';
    return 'pill-default';
  }
} 